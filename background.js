// ===== CROSS-BROWSER COMPATIBILITY =====
if (typeof browser === 'undefined') {
  var browser = chrome;
}

const BREAK_ALARM_NAME = 'lockedin-break-timer';
const YOUTUBE_QUERY = { url: ['*://www.youtube.com/*'] };

async function getBreakState() {
  return browser.storage.sync.get([
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
  await browser.storage.sync.set({ extensionEnabled: true, breakStartTime: null });
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

browser.runtime.onMessage.addListener((message) => {
  if (message && message.action === 'completeBreak') {
    finalizeBreak('message');
  }
});

browser.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return;
  if (
    Object.prototype.hasOwnProperty.call(changes, 'breakStartTime') ||
    Object.prototype.hasOwnProperty.call(changes, 'breakDuration') ||
    Object.prototype.hasOwnProperty.call(changes, 'extensionEnabled') ||
    Object.prototype.hasOwnProperty.call(changes, 'takeBreak')
  ) {
    scheduleBreakAlarm();
  }
});

browser.runtime.onStartup.addListener(scheduleBreakAlarm);
browser.runtime.onInstalled.addListener(scheduleBreakAlarm);

scheduleBreakAlarm();
