// ===== REDIRECT RULE MANAGEMENT =====
const REDIRECT_RULE_ID = 1;

async function updateRedirectRule() {
  const dnr = browser.declarativeNetRequest || chrome.declarativeNetRequest;
  if (!dnr) return; // Fallback if API is unavailable

  // Use effective (managed-overlaid) values so an admin can force the redirect.
  // Gate on hideFeed too, matching the content path (index.js instantRedirect):
  // redirectToSubs is a sub-option of hideFeed, so a managed hideFeed:false must
  // suppress the redirect even if sync has redirectToSubs:true.
  const state = await getEffectiveState(['hideFeed', 'redirectToSubs', 'extensionEnabled']);
  const shouldRedirect = state.extensionEnabled !== false && !!state.hideFeed && !!state.redirectToSubs;

  if (shouldRedirect) {
    await dnr.updateDynamicRules({
      removeRuleIds: [REDIRECT_RULE_ID], // Clear existing rule first
      addRules: [{
        id: REDIRECT_RULE_ID,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: { url: 'https://www.youtube.com/feed/subscriptions' }
        },
        condition: {
          // This Regex EXACTLY matches the homepage (with or without query parameters)
          // It will NOT match /watch, /results, or /feed/...
          regexFilter: "^https?://(www\\.)?youtube\\.com/?(\\?.*)?$",
          resourceTypes: ['main_frame'] // Only trigger on full page loads
        }
      }]
    });
  } else {
    // Remove the rule if the setting or extension is turned off
    await dnr.updateDynamicRules({
      removeRuleIds: [REDIRECT_RULE_ID]
    });
  }
}

// Call on startup and install
browser.runtime.onStartup.addListener(updateRedirectRule);
browser.runtime.onInstalled.addListener(updateRedirectRule);
// ===== CROSS-BROWSER COMPATIBILITY =====
if (typeof browser === 'undefined') {
  var browser = chrome;
}

// ===== MANAGED (ENTERPRISE POLICY) STORAGE =====
// The service worker does not load the content scripts, so it needs its own
// copy of the managed-overlay helper from content/shared/settings.js. Any key
// present in storage.managed is admin-forced; effective precedence is
// managed > sync > default. Never throws when policy is absent/empty.
function readManaged() {
  return new Promise((resolve) => {
    try {
      const area = browser && browser.storage ? browser.storage.managed : null;
      if (!area || typeof area.get !== 'function') {
        resolve({});
        return;
      }
      const maybePromise = area.get(null, (result) => {
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.lastError) {
          resolve({});
          return;
        }
        resolve(result || {});
      });
      if (maybePromise && typeof maybePromise.then === 'function') {
        maybePromise.then((result) => resolve(result || {})).catch(() => resolve({}));
      }
    } catch (error) {
      resolve({});
    }
  });
}

// Effective values for the given keys: sync overlaid by managed (managed wins).
async function getEffectiveState(keys) {
  const [sync, managed] = await Promise.all([
    browser.storage.sync.get(keys),
    readManaged()
  ]);
  return { ...(sync || {}), ...(managed || {}) };
}

const BREAK_ALARM_NAME = 'lockedin-break-timer';
const YOUTUBE_QUERY = { url: ['*://www.youtube.com/*'] };

async function getBreakState() {
  // Overlay managed so a locked extensionEnabled is honored by break logic too.
  return getEffectiveState([
    'takeBreak',
    'breakStartTime',
    'breakDuration',
    'extensionEnabled'
  ]);
}

async function clearBreakAlarm() {
  try {
    await browser.alarms.clear(BREAK_ALARM_NAME);
  } catch (error) {
    console.warn('LockedIn: Failed to clear break alarm', error);
  }
}

async function notifyTabsBreakEnded() {
  try {
    const tabs = await browser.tabs.query(YOUTUBE_QUERY);
    await Promise.all(tabs.map(async (tab) => {
      try {
        await browser.tabs.sendMessage(tab.id, { action: 'breakEnded' });
      } catch (_) {
        // Ignore tabs without the content script yet
      }
      try {
        await browser.tabs.sendMessage(tab.id, {
          action: 'powerStateChanged',
          enabled: true
        });
      } catch (_) {
        // Ignore tabs without the content script yet
      }
    }));
  } catch (error) {
    console.warn('LockedIn: Failed to notify tabs about break end', error);
  }
}

async function finalizeBreak(reason = 'alarm') {
  const state = await getBreakState();
  if (!state.takeBreak || !state.breakStartTime) {
    await clearBreakAlarm();
    return;
  }
  if (state.extensionEnabled !== false) {
    await browser.storage.sync.set({ breakStartTime: null });
    await clearBreakAlarm();
    return;
  }
  // Never write extensionEnabled back to sync when policy owns it: managed
  // storage is authoritative and would override sync anyway. Clear only the
  // break marker in that case.
  const managed = await readManaged();
  if (managed && Object.prototype.hasOwnProperty.call(managed, 'extensionEnabled')) {
    await browser.storage.sync.set({ breakStartTime: null });
  } else {
    await browser.storage.sync.set({ extensionEnabled: true, breakStartTime: null });
  }
  await clearBreakAlarm();
  await notifyTabsBreakEnded();
}

async function scheduleBreakAlarm() {
  const state = await getBreakState();
  const enabled = state.extensionEnabled === false;
  const takeBreak = state.takeBreak === true;
  const startTime = Number(state.breakStartTime);
  if (!takeBreak || !enabled || !Number.isFinite(startTime) || startTime <= 0) {
    await clearBreakAlarm();
    return;
  }
  const durationMinutes = typeof state.breakDuration === 'number' && !Number.isNaN(state.breakDuration)
    ? state.breakDuration
    : 5;
  const endTime = startTime + durationMinutes * 60 * 1000;
  const remaining = endTime - Date.now();
  if (remaining <= 0) {
    await finalizeBreak('expired');
    return;
  }
  await clearBreakAlarm();
  try {
    await browser.alarms.create(BREAK_ALARM_NAME, { when: Date.now() + remaining });
  } catch (error) {
    console.warn('LockedIn: Failed to create break alarm', error);
  }
}

browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === BREAK_ALARM_NAME) {
    finalizeBreak('alarm');
  }
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !message.action) {
    return undefined;
  }

  if (message.action === 'completeBreak') {
    finalizeBreak('message');
    if (typeof sendResponse === 'function') {
      sendResponse({ status: 'ok' });
    }
    return true;
  }

  if (message.action === 'startBreakTimer') {
    (async () => {
      await scheduleBreakAlarm();
      if (typeof sendResponse === 'function') {
        sendResponse({ status: 'scheduled' });
      }
    })().catch((error) => {
      console.warn('LockedIn: Failed to schedule break alarm', error);
      if (typeof sendResponse === 'function') {
        sendResponse({ status: 'error' });
      }
    });
    return true;
  }

  if (message.action === 'cancelBreakTimer') {
    (async () => {
      await clearBreakAlarm();
      if (typeof sendResponse === 'function') {
        sendResponse({ status: 'cleared' });
      }
    })().catch((error) => {
      console.warn('LockedIn: Failed to clear break alarm', error);
      if (typeof sendResponse === 'function') {
        sendResponse({ status: 'error' });
      }
    });
    return true;
  }

  return undefined;
});

browser.storage.onChanged.addListener((changes, area) => {
  if (area === 'managed') {
    // Enterprise policy changed: re-evaluate break alarm and redirect rule.
    scheduleBreakAlarm();
    updateRedirectRule();
    return;
  }
  if (area !== 'sync') return;
  if (
    Object.prototype.hasOwnProperty.call(changes, 'breakStartTime') ||
    Object.prototype.hasOwnProperty.call(changes, 'breakDuration') ||
    Object.prototype.hasOwnProperty.call(changes, 'extensionEnabled') ||
    Object.prototype.hasOwnProperty.call(changes, 'takeBreak')
  ) {
    scheduleBreakAlarm();
  }
  // Handle Redirect Rule Updates (NEW CODE)
  if (
    Object.prototype.hasOwnProperty.call(changes, 'hideFeed') ||
    Object.prototype.hasOwnProperty.call(changes, 'redirectToSubs') ||
    Object.prototype.hasOwnProperty.call(changes, 'extensionEnabled')
  ) {
    updateRedirectRule();
  }
});

browser.runtime.onStartup.addListener(scheduleBreakAlarm);
browser.runtime.onInstalled.addListener(scheduleBreakAlarm);

scheduleBreakAlarm();
