// ===== CROSS-BROWSER COMPATIBILITY =====
// Support both Firefox (browser) and Chromium-based browsers (chrome)
if (typeof browser === 'undefined') {
  var browser = chrome;
}

// ===== EXTENSION CONTEXT VALIDATION =====
// Check if extension context is still valid (prevents errors after extension reload)
function isExtensionContextValid() {
  try {
    // Try to access extension API - will throw if context is invalidated
    return browser.runtime && browser.runtime.id;
  } catch (e) {
    return false;
  }
}

// Exit early if extension context is already invalidated
if (!isExtensionContextValid()) {
  console.log('LockedIn: Extension context invalidated, skipping initialization');
  // Don't throw error, just exit silently
  throw new Error('Extension context invalidated');
}

function storageGet(area, keys) {
  return new Promise((resolve) => {
    try {
      const storageArea = browser?.storage?.[area];
      if (!storageArea || typeof storageArea.get !== 'function') {
        resolve({});
        return;
      }

      const maybePromise = storageArea.get(keys, (result) => {
        if (typeof chrome !== 'undefined' && chrome.runtime?.lastError) {
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

function storageSet(area, value) {
  return new Promise((resolve) => {
    try {
      const storageArea = browser?.storage?.[area];
      if (!storageArea || typeof storageArea.set !== 'function') {
        resolve(false);
        return;
      }

      const maybePromise = storageArea.set(value, () => {
        if (typeof chrome !== 'undefined' && chrome.runtime?.lastError) {
          resolve(false);
          return;
        }
        resolve(true);
      });

      if (maybePromise && typeof maybePromise.then === 'function') {
        maybePromise.then(() => resolve(true)).catch(() => resolve(false));
      }
    } catch (error) {
      resolve(false);
    }
  });
}

// Environment, selector, and pathname helpers moved to content/shared/selectors.js

// ===== INSTANT REDIRECT TO SUBSCRIPTIONS =====
// Check immediately on page load if we should redirect from homepage
(function instantRedirectCheck() {
  if (!isExtensionContextValid()) return;
  if (isHomePath()) {
    // Check storage synchronously using the sync API
    try {
      browser.storage.sync.get(['hideFeed', 'redirectToSubs', 'extensionEnabled'], (result) => {
        if (result.extensionEnabled !== false && result.hideFeed && result.redirectToSubs) {
          // Redirect immediately before page renders
          window.location.replace('https://www.youtube.com/feed/subscriptions');
        }
      });
    } catch (e) {
      // Extension context invalidated, ignore
    }
  }
})();

// ===== INSTANT HIDING WITH CSS =====
// Inject CSS to hide Shorts immediately, before JavaScript detection
const instantHideStyle = document.createElement('style');
instantHideStyle.id = 'lockedin-instant-hide';
// Initial content (will be updated dynamically)
instantHideStyle.textContent = '';

// Inject the style immediately (before anything loads)
(document.head || document.documentElement).appendChild(instantHideStyle);

// Instant CSS hiding for recommended videos
const instantRecsHideStyle = document.createElement('style');
instantRecsHideStyle.id = 'lockedin-instant-recs-hide';
instantRecsHideStyle.textContent = '';
(document.head || document.documentElement).appendChild(instantRecsHideStyle);

// Protect video player from any CSS inheritance issues
const videoProtectionStyle = document.createElement('style');
videoProtectionStyle.id = 'lockedin-video-protection';
videoProtectionStyle.textContent = `
/* Ensure video player is never dimmed or filtered by our extension */
#movie_player,
.html5-video-player,
#movie_player video,
.html5-video-player video,
.html5-main-video,
video.video-stream {
  filter: none !important;
  opacity: 1 !important;
  visibility: visible !important;
  pointer-events: auto !important;
}
`;
(document.head || document.documentElement).appendChild(videoProtectionStyle);

const navHideStyle = document.createElement('style');
navHideStyle.id = 'lockedin-nav-hide';
navHideStyle.textContent = `
html[data-lockedin-hide-home="true"] ytd-guide-entry-renderer:has(a[href="/"]),
html[data-lockedin-hide-home="true"] ytd-guide-entry-renderer:has(a[href="/home"]),
html[data-lockedin-hide-home="true"] ytd-guide-entry-renderer:has(a[title="Home"]),
html[data-lockedin-hide-home="true"] ytd-guide-entry-renderer:has(#endpoint[title="Home"]),
html[data-lockedin-hide-home="true"] ytd-mini-guide-entry-renderer:has(a[href="/"]),
html[data-lockedin-hide-home="true"] ytd-mini-guide-entry-renderer:has(a[href="/home"]),
html[data-lockedin-hide-home="true"] ytd-mini-guide-entry-renderer:has(a[title="Home"]),
html[data-lockedin-hide-home="true"] ytd-mini-guide-entry-renderer:has(#endpoint[title="Home"]),
html[data-lockedin-hide-home="true"] tp-yt-paper-tab:has(a[href="/"]),
html[data-lockedin-hide-home="true"] tp-yt-paper-tab:has(a[href^="/home"]),
html[data-lockedin-hide-home="true"] tp-yt-paper-tab:has(a[title="Home"]),
html[data-lockedin-hide-home="true"] yt-tab-shape:has(a[href="/"]),
html[data-lockedin-hide-home="true"] yt-tab-shape:has(a[href^="/home"]),
html[data-lockedin-hide-home="true"] yt-chip-cloud-chip-renderer:has(a[href="/"]),
html[data-lockedin-hide-home="true"] yt-chip-cloud-chip-renderer:has(a[href^="/home"]),
html[data-lockedin-hide-home="true"] yt-chip-cloud-chip-renderer:has(a[title="Home"]),
html[data-lockedin-hide-home="true"] ytm-pivot-bar-item-renderer:has([href="/"]),
html[data-lockedin-hide-home="true"] ytm-pivot-bar-item-renderer:has([href="/home"]) {
  display: none !important;
}

html[data-lockedin-hide-shorts-tab="true"] ytd-guide-entry-renderer:has(a[href^="/shorts"]),
html[data-lockedin-hide-shorts-tab="true"] ytd-guide-entry-renderer:has(a[title="Shorts"]),
html[data-lockedin-hide-shorts-tab="true"] ytd-guide-entry-renderer:has(#endpoint[title="Shorts"]),
html[data-lockedin-hide-shorts-tab="true"] ytd-mini-guide-entry-renderer:has(a[href^="/shorts"]),
html[data-lockedin-hide-shorts-tab="true"] ytd-mini-guide-entry-renderer:has(a[title="Shorts"]),
html[data-lockedin-hide-shorts-tab="true"] ytd-mini-guide-entry-renderer:has(#endpoint[title="Shorts"]),
html[data-lockedin-hide-shorts-tab="true"] tp-yt-paper-tab:has(a[href^="/shorts"]),
html[data-lockedin-hide-shorts-tab="true"] tp-yt-paper-tab:has(a[title="Shorts"]),
html[data-lockedin-hide-shorts-tab="true"] yt-tab-shape:has(a[href^="/shorts"]),
html[data-lockedin-hide-shorts-tab="true"] yt-chip-cloud-chip-renderer:has(a[href^="/shorts"]),
html[data-lockedin-hide-shorts-tab="true"] yt-chip-cloud-chip-renderer:has(a[title="Shorts"]),
html[data-lockedin-hide-shorts-tab="true"] yt-chip-cloud-chip-renderer:has(div[title*="Shorts" i]),
html[data-lockedin-hide-shorts-tab="true"] ytm-pivot-bar-item-renderer:has([href^="/shorts"]),
html[data-lockedin-hide-shorts-tab="true"] ytm-pivot-bar-item-renderer:has([data-pivot-id="shorts"]) {
  display: none !important;
}
`;
(document.head || document.documentElement).appendChild(navHideStyle);

// Localization and default settings moved to content/shared/settings.js

// Function to enable/disable instant CSS hiding
function setInstantHiding(hideHomepage, hideSearch, hideGlobally = false) {
  const style = document.getElementById('lockedin-instant-hide');
  if (!style) return;
  
  let css = '';
  const navShortsCss = `
  /* Hide Shorts tab across top navigation surfaces */
  tp-yt-paper-tab:has(a[href^="/shorts"]),
  tp-yt-paper-tab:has(a[title="Shorts"]),
  tp-yt-paper-tab:has(div[title*="Shorts" i]),
  yt-tab-shape:has(a[href^="/shorts"]),
  yt-tab-shape:has(a[title="Shorts"]),
  yt-chip-cloud-chip-renderer:has(a[href^="/shorts"]),
  yt-chip-cloud-chip-renderer:has(a[title="Shorts"]),
  yt-chip-cloud-chip-renderer:has(div[title*="Shorts" i]),
  ytd-feed-filter-chip-bar-renderer tp-yt-paper-tab:has(a[href^="/shorts"]),
  ytd-feed-filter-chip-bar-renderer yt-chip-cloud-chip-renderer:has(a[href^="/shorts"]),
  ytm-pivot-bar-item-renderer:has([href^="/shorts"]),
  ytm-pivot-bar-item-renderer:has([data-pivot-id="shorts"]) {
    display: none !important;
  }
`;
  
  // Global Shorts hiding takes precedence - hides Shorts EVERYWHERE
  if (hideGlobally) {
    css = `
  /* ===== GLOBAL SHORTS HIDING ===== */
  
  /* Hide Shorts tab in sidebar (expanded and collapsed) */
  ytd-guide-entry-renderer:has(a[href="/shorts"]),
  ytd-mini-guide-entry-renderer:has(a[href="/shorts"]),
  ytd-guide-entry-renderer:has(a[title="Shorts"]),
  ytd-mini-guide-entry-renderer:has(a[title="Shorts"]) {
    display: none !important;
  }
  
  /* Hide Shorts shelf containers everywhere */
  ytd-reel-shelf-renderer,
  ytd-rich-shelf-renderer:has([href^="/shorts/"]),
  ytd-rich-section-renderer:has([href^="/shorts/"]),
  grid-shelf-view-model:has([href^="/shorts/"]) {
    display: none !important;
  }
  
  /* Hide all video renderers that link to Shorts */
  ytd-rich-item-renderer:has([href^="/shorts/"]),
  ytd-video-renderer:has([href^="/shorts/"]),
  ytd-grid-video-renderer:has([href^="/shorts/"]),
  ytd-compact-video-renderer:has([href^="/shorts/"]),
  ytd-reel-item-renderer {
    display: none !important;
  }
  
  /* Hide Shorts by overlay badge */
  ytd-rich-item-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]),
  ytd-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]),
  ytd-grid-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]),
  ytd-compact-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]) {
    display: none !important;
  }
  
  /* Hide Shorts in sidebar recommendations (watch page) */
  #secondary ytd-compact-video-renderer:has([href^="/shorts/"]),
  #related ytd-compact-video-renderer:has([href^="/shorts/"]) {
    display: none !important;
  }
  
  /* Hide Shorts filter chips on search page */
  yt-chip-cloud-chip-renderer:has([title*="Short" i]),
  yt-chip-cloud-chip-renderer:has([aria-label*="Short" i]) {
    display: none !important;
  }
  
  /* Mobile: Hide Shorts elements */
  ytm-reel-shelf-renderer,
  ytm-shorts-lockup-view-model,
  ytm-shorts-lockup-view-model-v2,
  ytm-pivot-bar-item-renderer:has([href="/shorts"]),
  ytm-pivot-bar-item-renderer:has([data-pivot-id="shorts"]) {
    display: none !important;
  }
`;
    css += navShortsCss;
  } else {
    // Add homepage-specific CSS if hideHomepage is enabled
    if (hideHomepage) {
      css += `
  /* Hide Shorts shelf containers on homepage */
  ytd-reel-shelf-renderer:not([data-lockedin-hidden]),
  ytd-rich-shelf-renderer:has([href^="/shorts/"]):not([data-lockedin-hidden]),
  ytd-rich-section-renderer:has([href^="/shorts/"]):not([data-lockedin-hidden]) {
    display: none;
  }
  
  /* Hide video renderers that link to Shorts on homepage */
  ytd-rich-item-renderer:has([href^="/shorts/"]):not([data-lockedin-hidden]),
  ytd-reel-item-renderer:not([data-lockedin-hidden]) {
    display: none;
  }
  
  /* Hide Shorts tab in sidebar */
  ytd-guide-entry-renderer:has(a[href="/shorts"]):not([data-lockedin-hidden]),
  ytd-mini-guide-entry-renderer:has(a[href="/shorts"]):not([data-lockedin-hidden]) {
    display: none;
  }
  
  /* Hide Shorts overlay badge items on homepage */
  ytd-rich-item-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]):not([data-lockedin-hidden]) {
    display: none;
  }
`;
      css += navShortsCss;
    }
    
    // Add search-specific CSS if hideSearch is enabled
    if (hideSearch) {
      css += `
  /* Hide Shorts shelf containers on search page ONLY */
  ytd-search ytd-reel-shelf-renderer:not([data-lockedin-hidden]),
  ytd-search ytd-rich-shelf-renderer:has([href^="/shorts/"]):not([data-lockedin-hidden]),
  ytd-search ytd-rich-section-renderer:has([href^="/shorts/"]):not([data-lockedin-hidden]),
  ytd-search grid-shelf-view-model:not([data-lockedin-hidden]),
  [page-subtype="search"] ytd-reel-shelf-renderer:not([data-lockedin-hidden]),
  [page-subtype="search"] ytd-rich-shelf-renderer:has([href^="/shorts/"]):not([data-lockedin-hidden]),
  [page-subtype="search"] ytd-rich-section-renderer:has([href^="/shorts/"]):not([data-lockedin-hidden]),
  [page-subtype="search"] grid-shelf-view-model:not([data-lockedin-hidden]) {
    display: none;
  }
  
  /* Hide video renderers that link to Shorts on search page ONLY */
  ytd-search ytd-video-renderer:has([href^="/shorts/"]):not([data-lockedin-hidden]),
  [page-subtype="search"] ytd-video-renderer:has([href^="/shorts/"]):not([data-lockedin-hidden]) {
    display: none;
  }
  
  /* Hide Shorts overlay badge items on search page ONLY */
  ytd-search ytd-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]):not([data-lockedin-hidden]),
  [page-subtype="search"] ytd-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]):not([data-lockedin-hidden]) {
    display: none;
  }
`;
    }
  }
  
  // Update the style element
  style.textContent = css;
}

// Function to set instant CSS hiding for recommended videos
function setInstantRecsHiding(hideRecommended, hideSidebar) {
  const style = document.getElementById('lockedin-instant-recs-hide');
  if (!style) return;
  
  let css = '';
  
  // Only apply instant hiding if either hideRecommended or hideSidebar is enabled
  if (hideRecommended || hideSidebar) {
    css = `
  /* ===== INSTANT RECOMMENDED VIDEOS HIDING ===== */
  /* Hide chip cloud (sidebar only) */
  #secondary yt-chip-cloud-renderer,
  #secondary yt-related-chip-cloud-renderer,
  #related yt-chip-cloud-renderer,
  #related yt-related-chip-cloud-renderer,
  #secondary ytd-feed-filter-chip-bar-renderer,
  #related ytd-feed-filter-chip-bar-renderer,
  ytd-watch-next-secondary-results-renderer ytd-feed-filter-chip-bar-renderer,
  ytd-watch-next-secondary-results-renderer yt-chip-cloud-renderer,
  ytd-watch-next-secondary-results-renderer yt-related-chip-cloud-renderer {
    display: none !important;
  }
  
  /* Hide video renderers in sidebar only */
  #secondary ytd-compact-video-renderer:not([data-lockedin-hidden]),
  #secondary ytd-compact-movie-renderer:not([data-lockedin-hidden]),
  #secondary ytd-compact-radio-renderer:not([data-lockedin-hidden]),
  #secondary ytd-compact-autoplay-renderer:not([data-lockedin-hidden]),
  #secondary ytd-reel-item-renderer:not([data-lockedin-hidden]),
  #secondary ytd-video-renderer:not([data-lockedin-hidden]),
  #related ytd-compact-video-renderer:not([data-lockedin-hidden]),
  #related ytd-compact-movie-renderer:not([data-lockedin-hidden]),
  #related ytd-compact-radio-renderer:not([data-lockedin-hidden]),
  #related ytd-compact-autoplay-renderer:not([data-lockedin-hidden]),
  #related ytd-reel-item-renderer:not([data-lockedin-hidden]),
  #related ytd-video-renderer:not([data-lockedin-hidden]),
  ytd-watch-next-secondary-results-renderer ytd-compact-video-renderer:not([data-lockedin-hidden]),
  ytd-watch-next-secondary-results-renderer ytd-compact-movie-renderer:not([data-lockedin-hidden]),
  ytd-watch-next-secondary-results-renderer ytd-compact-radio-renderer:not([data-lockedin-hidden]),
  ytd-watch-next-secondary-results-renderer ytd-compact-autoplay-renderer:not([data-lockedin-hidden]),
  ytd-watch-next-secondary-results-renderer ytd-reel-item-renderer:not([data-lockedin-hidden]),
  ytd-watch-next-secondary-results-renderer ytd-video-renderer:not([data-lockedin-hidden]),
  ytd-watch-next-secondary-results-renderer yt-lockup-view-model:not([data-lockedin-hidden]),
  #related yt-lockup-view-model:not([data-lockedin-hidden]),
  ytd-watch-next-secondary-results-renderer ytd-reel-shelf-renderer:not([data-lockedin-hidden]),
  #related ytd-reel-shelf-renderer:not([data-lockedin-hidden]),
  ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer > #contents:not([data-lockedin-hidden]),
  #related ytd-item-section-renderer > #contents:not([data-lockedin-hidden]) {
    display: none !important;
  }

  /* Hide recommendation containers that don't host transcript/engagement panels */
  #secondary ytd-item-section-renderer:not([data-lockedin-hidden]):not(:has(ytd-engagement-panel-section-list-renderer)):not(:has(ytd-transcript-segment-list-renderer)),
  #secondary ytd-continuation-item-renderer:not([data-lockedin-hidden]):not(:has(ytd-engagement-panel-section-list-renderer)):not(:has(ytd-transcript-segment-list-renderer)),
  #secondary ytd-watch-next-secondary-results-renderer:not([data-lockedin-hidden]):not(:has(ytd-engagement-panel-section-list-renderer)):not(:has(ytd-transcript-segment-list-renderer)),
  #secondary #related:not([data-lockedin-hidden]):not(:has(ytd-engagement-panel-section-list-renderer)):not(:has(ytd-transcript-segment-list-renderer)),
  #related ytd-item-section-renderer:not([data-lockedin-hidden]):not(:has(ytd-engagement-panel-section-list-renderer)):not(:has(ytd-transcript-segment-list-renderer)),
  #related ytd-continuation-item-renderer:not([data-lockedin-hidden]):not(:has(ytd-engagement-panel-section-list-renderer)):not(:has(ytd-transcript-segment-list-renderer)),
  ytd-watch-next-secondary-results-renderer ytd-item-section-renderer:not([data-lockedin-hidden]):not(:has(ytd-engagement-panel-section-list-renderer)):not(:has(ytd-transcript-segment-list-renderer)),
  ytd-watch-next-secondary-results-renderer ytd-continuation-item-renderer:not([data-lockedin-hidden]):not(:has(ytd-engagement-panel-section-list-renderer)):not(:has(ytd-transcript-segment-list-renderer)) {
    visibility: hidden !important;
    pointer-events: none !important;
    min-height: 0 !important;
    max-height: 0 !important;
    overflow: hidden !important;
  }

  /* If a container hosts transcript/engagement panels, keep it visible */
  #secondary ytd-item-section-renderer:has(ytd-engagement-panel-section-list-renderer),
  #secondary ytd-item-section-renderer:has(ytd-transcript-segment-list-renderer),
  #secondary ytd-continuation-item-renderer:has(ytd-engagement-panel-section-list-renderer),
  #secondary ytd-continuation-item-renderer:has(ytd-transcript-segment-list-renderer),
  #secondary ytd-watch-next-secondary-results-renderer:has(ytd-engagement-panel-section-list-renderer),
  #secondary ytd-watch-next-secondary-results-renderer:has(ytd-transcript-segment-list-renderer),
  #secondary #related:has(ytd-engagement-panel-section-list-renderer),
  #secondary #related:has(ytd-transcript-segment-list-renderer) {
    visibility: visible !important;
    pointer-events: auto !important;
    min-height: auto !important;
    max-height: none !important;
    overflow: visible !important;
  }
`;
  }
  
  style.textContent = css;
}

// Shared DOM helpers, default settings, and guide/sidebar orchestration moved to modules

// ===== STATS TRACKING =====
const DEFAULT_STATS = {
  shortsBlocked: 0,
  recsHidden: 0,
  endCardsBlocked: 0,
  autoplayStops: 0,
  sessionTimeMs: 0,
  todaySessionMs: 0,
  todayDate: null,
  weekTimeSaved: 0,
  weekStartDate: null,
  firstUseDate: null
};

// Time saved estimates (in minutes)
const TIME_SAVED_ESTIMATES = {
  short: 0.5,
  recommendation: 5,
  endCard: 3,
  autoplay: 8
};

// Track session time
let sessionStartTime = null;
let lastActiveTime = null;
let isTracking = false;
let isPageActive = true;

// Check if page is currently active (visible and focused)
function isPageCurrentlyActive() {
  return document.visibilityState === 'visible' && document.hasFocus();
}

// Initialize session tracking
function initSessionTracking() {
  if (isTracking) return;
  isTracking = true;
  sessionStartTime = Date.now();
  lastActiveTime = Date.now();
  isPageActive = isPageCurrentlyActive();
  
  // Update session time every 30 seconds
  setInterval(updateSessionTime, 30000);
  
  // Track visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      lastActiveTime = Date.now();
      isPageActive = document.hasFocus();
    } else {
      isPageActive = false;
      updateSessionTime();
    }
  });
  
  // Track focus changes
  window.addEventListener('focus', () => {
    lastActiveTime = Date.now();
    isPageActive = true;
  });
  
  window.addEventListener('blur', () => {
    isPageActive = false;
    updateSessionTime();
  });
}

function updateSessionTime() {
  if (!lastActiveTime || !isPageCurrentlyActive()) return;
  
  const now = Date.now();
  const elapsed = now - lastActiveTime;
  lastActiveTime = now;
  
  // Only count if less than 5 minutes (user might have been away)
  if (elapsed < 5 * 60 * 1000) {
    storageGet('local', 'stats').then((result) => {
      const stats = { ...DEFAULT_STATS, ...result.stats };
      const today = new Date().toDateString();
      
      // Reset today's time if it's a new day
      if (stats.todayDate !== today) {
        stats.todaySessionMs = 0;
        stats.todayDate = today;
      }
      
      stats.sessionTimeMs += elapsed;
      stats.todaySessionMs += elapsed;
      
      storageSet('local', { stats });
    });
  }
}

// Track stats for blocked elements - only when page is active
function trackStat(type, count = 1) {
  if (count <= 0) return;
  
  // Only track stats when user is actively on the YouTube page
  if (!isPageCurrentlyActive()) return;
  
  storageGet('local', 'stats').then((result) => {
    const stats = { ...DEFAULT_STATS, ...result.stats };
    const today = new Date().toDateString();
    const now = Date.now();
    
    // Initialize first use date
    if (!stats.firstUseDate) {
      stats.firstUseDate = now;
    }
    
    // Reset today's time if it's a new day
    if (stats.todayDate !== today) {
      stats.todaySessionMs = 0;
      stats.todayDate = today;
    }
    
    // Reset weekly stats if it's a new week (Sunday)
    const currentWeekStart = getWeekStart(now);
    if (!stats.weekStartDate || stats.weekStartDate !== currentWeekStart) {
      stats.weekTimeSaved = 0;
      stats.weekStartDate = currentWeekStart;
    }
    
    // Update specific stat
    switch (type) {
      case 'shorts':
        stats.shortsBlocked += count;
        stats.weekTimeSaved += count * TIME_SAVED_ESTIMATES.short;
        break;
      case 'recs':
        stats.recsHidden += count;
        stats.weekTimeSaved += count * TIME_SAVED_ESTIMATES.recommendation;
        break;
      case 'endcards':
        stats.endCardsBlocked += count;
        stats.weekTimeSaved += count * TIME_SAVED_ESTIMATES.endCard;
        break;
      case 'autoplay':
        stats.autoplayStops += count;
        stats.weekTimeSaved += count * TIME_SAVED_ESTIMATES.autoplay;
        break;
    }
    
    storageSet('local', { stats });
  });
}

function getWeekStart(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDay();
  const diff = date.getDate() - day;
  const weekStart = new Date(date.setDate(diff));
  return weekStart.toDateString();
}

// Start session tracking when script loads
initSessionTracking();

// ===== INITIALIZE SETTINGS ON INSTALL =====
// This fixes the race condition - ensures settings exist before content script runs
storageGet('sync', null).then((settings) => {
  // If no settings exist, initialize with defaults
  if (Object.keys(settings).length === 0) {
    latestSyncedSettings = { ...DEFAULT_SETTINGS };
    storageSet('sync', DEFAULT_SETTINGS).then((ok) => {
      if (!ok) {
        console.error('LockedIn: Failed to initialize settings');
      }
    });
  } else {
    latestSyncedSettings = { ...DEFAULT_SETTINGS, ...settings };
  }
  updateGuideVisibility();
}).catch(() => {
  console.error('LockedIn: Failed to check settings');
});

// Shared helper functions moved to content/shared/dom.js

// Watch, search, subscriptions, sidebar, autoplay, homepage, and shorts logic moved to dedicated modules

function runAll() {
  // Check if extension context is still valid
  if (!isExtensionContextValid()) {
    console.log('LockedIn: Extension context invalidated, skipping runAll');
    return;
  }
  
  // Add error handling to prevent extension from breaking
  storageGet('sync', null).then((settings) => {
    // Merge with defaults to ensure all settings exist
    const currentSettings = { ...DEFAULT_SETTINGS, ...settings };
    latestSyncedSettings = currentSettings;
    observeGuideContainers();
    updateGuideVisibility();
    startTranscriptObserver();
    
    // Check if extension is enabled
    if (!currentSettings.extensionEnabled) {
      // Restore all elements if extension is disabled
      restoreAllElements();
      stopTranscriptObserver();
      setInstantHiding(false, false, false); // Disable CSS hiding for homepage, search, and global
      setInstantRecsHiding(false, false); // Disable instant recs hiding
      hideNativeAutoplayToggle(false);
      return;
    }
    
    // Enable/disable instant CSS hiding based on hideShorts settings
    // Global takes precedence over individual settings
    setInstantHiding(currentSettings.hideShortsHomepage, currentSettings.hideShortsSearch, currentSettings.hideShortsGlobally);
    
    // Enable/disable instant CSS hiding for recommended videos
    setInstantRecsHiding(currentSettings.hideRecommended, currentSettings.hideSidebar);
    
    // YouTube Shorts group - handle redirects first
    redirectShorts(currentSettings.redirectShorts);
    setupShortsLinkInterception(currentSettings.redirectShorts);
    // Hide end cards when shorts are played in traditional video player
    hideEndCardsForShortsInPlayer(currentSettings.redirectShorts);

    // Thumbnails group - accepts mode: 'off', 'hidden', 'reveal-on-hover', 'blurred', 'solid-color'
    const thumbnailSetting = currentSettings.hideVideoThumbnails;
    const thumbnailMode = thumbnailSetting === true ? 'reveal-on-hover' : (thumbnailSetting || 'off');
    hideVideoThumbnails(thumbnailMode);
    
    // Apply global Shorts hiding (takes precedence over individual)
    if (currentSettings.hideShortsGlobally) {
      hideShortsGlobally(true);
    } else {
      hideShortsGlobally(false);
    }
    
    // Apply all hiding rules - Homepage group
    // Redirect to subscriptions if enabled (must be before hideFeed)
    redirectToSubscriptions(currentSettings.hideFeed && currentSettings.redirectToSubs);
    hideFeed(currentSettings.hideFeed);
    hideMostRelevantSubscriptions(currentSettings.hideMostRelevantSubscriptions);
    // Only apply individual Shorts hiding if global is not enabled
    if (!currentSettings.hideShortsGlobally) {
      hideShortsHomepage(currentSettings.hideShortsHomepage);
    }
    // Use Clean Homepage Feed master toggle or individual sub-toggles
    if (currentSettings.cleanHomepageFeed) {
      cleanHomepageFeed(true);
    } else {
      hideCommunityPosts(currentSettings.hideCommunityPosts);
      hideFeaturedContent(currentSettings.hideFeaturedContent);
      hideMembersOnly(currentSettings.hideMembersOnly);
    }
    
    // Video Page group
    hideSidebar(currentSettings.hideSidebar);
    // If hideSidebar is enabled, use hideAll to hide everything including playlists
    // Otherwise, restore everything first, then apply individual sub-toggles
    if (currentSettings.hideSidebar) {
      hideAll(true);
    } else {
      // First restore everything that hideAll may have hidden
      hideAll(false);
      // Then apply individual sub-toggles
      hideRecommendedVideos(currentSettings.hideRecommended);
      hideSidebarShorts(currentSettings.hideSidebarShorts);
      hidePlaylists(currentSettings.hidePlaylists);
    }
    ensureSidebarObserver(currentSettings.hideSidebar || currentSettings.hideRecommended);
    scheduleSidebarHideRetries(currentSettings);
    hideLiveChat(currentSettings.hideLiveChat);
    hideEndCards(currentSettings.hideEndCards);
    hideComments(currentSettings.hideComments);
    disableAutoplay(currentSettings.disableAutoplay);
    hideNativeAutoplayToggle(true);
    
    // Search Results group
    hideSearchRecommended(currentSettings.hideSearchRecommended);
    // Only apply individual Shorts hiding if global is not enabled
    if (!currentSettings.hideShortsGlobally) {
      hideShortsSearch(currentSettings.hideShortsSearch);
    }
    
    // YouTube Sidebar group
    // Use Clean Sidebar master toggle or individual sub-toggles
    if (currentSettings.cleanSidebar) {
      hideExplore(true);
      hideMoreFromYT(true);
      hideSubscriptions(true);
    } else {
      hideExplore(currentSettings.hideExplore);
      hideMoreFromYT(currentSettings.hideMoreFromYT);
      hideSubscriptions(currentSettings.hideSubscriptions);
    }
    
    updateGuideVisibility();
    ensureEssentialElementsVisible();
  }).catch((error) => {
    console.error('LockedIn: Failed to load settings', error);
    // Fallback: use default settings if storage fails
    const currentSettings = DEFAULT_SETTINGS;
    latestSyncedSettings = currentSettings;
    setInstantHiding(currentSettings.hideShortsHomepage, currentSettings.hideShortsSearch, currentSettings.hideShortsGlobally);
    observeGuideContainers();
    updateGuideVisibility();
    
    redirectShorts(currentSettings.redirectShorts);
    setupShortsLinkInterception(currentSettings.redirectShorts);
    hideEndCardsForShortsInPlayer(currentSettings.redirectShorts);
    hideVideoThumbnails(currentSettings.hideVideoThumbnails);
    hideShortsGlobally(currentSettings.hideShortsGlobally);
    
    redirectToSubscriptions(currentSettings.hideFeed && currentSettings.redirectToSubs);
    hideFeed(currentSettings.hideFeed);
    hideMostRelevantSubscriptions(currentSettings.hideMostRelevantSubscriptions);
    if (!currentSettings.hideShortsGlobally) {
      hideShortsHomepage(currentSettings.hideShortsHomepage);
    }
    // Use Clean Homepage Feed master toggle or individual sub-toggles
    if (currentSettings.cleanHomepageFeed) {
      cleanHomepageFeed(true);
    } else {
      hideCommunityPosts(currentSettings.hideCommunityPosts);
      hideFeaturedContent(currentSettings.hideFeaturedContent);
      hideMembersOnly(currentSettings.hideMembersOnly);
    }
    
    hideSidebar(currentSettings.hideSidebar);
    // If hideSidebar is enabled, use hideAll to hide everything including playlists
    // Otherwise, restore everything first, then apply individual sub-toggles
    if (currentSettings.hideSidebar) {
      hideAll(true);
    } else {
      // First restore everything that hideAll may have hidden
      hideAll(false);
      // Then apply individual sub-toggles
      hideRecommendedVideos(currentSettings.hideRecommended);
      hideSidebarShorts(currentSettings.hideSidebarShorts);
      hidePlaylists(currentSettings.hidePlaylists);
    }
    hideLiveChat(currentSettings.hideLiveChat);
    hideEndCards(currentSettings.hideEndCards);
    hideComments(currentSettings.hideComments);
    hideNativeAutoplayToggle(true);
    disableAutoplay(currentSettings.disableAutoplay);

    hideSearchRecommended(currentSettings.hideSearchRecommended);
    if (!currentSettings.hideShortsGlobally) {
      hideShortsSearch(currentSettings.hideShortsSearch);
    }
    
    // YouTube Sidebar group
    if (currentSettings.cleanSidebar) {
      hideExplore(true);
      hideMoreFromYT(true);
      hideSubscriptions(true);
    } else {
      hideExplore(currentSettings.hideExplore);
      hideMoreFromYT(currentSettings.hideMoreFromYT);
      hideSubscriptions(currentSettings.hideSubscriptions);
    }
    updateGuideVisibility();
  });
}

function restoreAllElements() {
  // Restore all hidden elements when extension is disabled
  setInstantHiding(false, false, false); // Disable CSS hiding for homepage, search, and global
  hideFeed(false);
  hideMostRelevantSubscriptions(false);
  hideShortsHomepage(false);
  hideCommunityPosts(false);
  hideFeaturedContent(false);
  hideMembersOnly(false);
  hideShortsGlobally(false);
  setupShortsLinkInterception(false);
  hideVideoThumbnails('off');
  
  hideSidebar(false);
  hideAll(false);  // Also restore elements that hideAll may have hidden
  hideRecommendedVideos(false);
  hideSidebarShorts(false);
  hidePlaylists(false);
  hideLiveChat(false);
  hideEndCards(false);
  hideComments(false);
  disableAutoplay(false);

  hideSearchRecommended(false);
  hideShortsSearch(false);
  
  hideExplore(false);
  hideMoreFromYT(false);
  hideSubscriptions(false);
  updateGuideVisibility();
}

// ensureEssentialElementsVisible moved to content/search.js

// ===== INITIALIZE INSTANT HIDING ON LOAD =====
// Load settings and set instant hiding CSS immediately
if (isExtensionContextValid()) {
  storageGet('sync', null).then((settings) => {
    const currentSettings = { ...DEFAULT_SETTINGS, ...settings };
    latestSyncedSettings = currentSettings;
    if (currentSettings.extensionEnabled) {
      setInstantHiding(currentSettings.hideShortsHomepage, currentSettings.hideShortsSearch, currentSettings.hideShortsGlobally);
      setInstantRecsHiding(currentSettings.hideRecommended, currentSettings.hideSidebar);
    }
    updateGuideVisibility();
  }).catch(() => {
    // Use defaults if storage fails or context is invalidated
    latestSyncedSettings = { ...DEFAULT_SETTINGS };
    setInstantHiding(DEFAULT_SETTINGS.hideShortsHomepage, DEFAULT_SETTINGS.hideShortsSearch, DEFAULT_SETTINGS.hideShortsGlobally);
    setInstantRecsHiding(DEFAULT_SETTINGS.hideRecommended, DEFAULT_SETTINGS.hideSidebar);
    updateGuideVisibility();
  });
}

// ===== RUN ON PAGE LOAD =====
runAll();

// Re-run shortly after load to catch late-rendered sidebar on hard refresh
setTimeout(runAll, 400);
setTimeout(runAll, 1200);

// Run immediately on URL changes (for navigation between pages)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    // Immediately run when URL changes (e.g., navigating to search)
    setTimeout(runAll, 100);
  }
}).observe(document, { subtree: true, childList: true });

// ===== OPTIMIZED MUTATION OBSERVER =====
// Single observer instance with debouncing for better performance
const debouncedRunAll = debounce(runAll, 50); // Very fast response: 50ms

const observer = new MutationObserver(debouncedRunAll);

// Observe with more specific config to reduce unnecessary callbacks
observer.observe(document.body, { 
  childList: true, 
  subtree: true,
  // Only watch for node additions/removals, not attributes
  attributes: false,
  characterData: false
});

function attachSpaEventListeners() {
  const spaEvents = [
    'yt-navigate-finish',
    'yt-page-data-updated',
    'yt-page-type-changed',
    'spfdone'
  ];
  spaEvents.forEach((eventName) => {
    window.addEventListener(eventName, debouncedRunAll, true);
    document.addEventListener(eventName, debouncedRunAll, true);
  });
  window.addEventListener('pageshow', debouncedRunAll, true);
  window.addEventListener('popstate', debouncedRunAll, true);
  window.addEventListener('load', debouncedRunAll, true);
}

attachSpaEventListeners();
observeGuideContainers();

function forceSidebarRehide() {
  if (latestSyncedSettings.extensionEnabled === false) return;
  applyInstantRecsCssFromCache();
  if (latestSyncedSettings.hideSidebar) {
    hideAll(true);
  } else if (latestSyncedSettings.hideRecommended) {
    hideRecommendedVideos(true);
    hideSidebarShorts(latestSyncedSettings.hideSidebarShorts);
  }
  ensureTranscriptPanelVisible();
  ensureSidebarObserver(latestSyncedSettings.hideSidebar || latestSyncedSettings.hideRecommended);
  scheduleSidebarHideRetries(latestSyncedSettings);
  runAll();
}

function forcePopupEquivalent() {
  storageGet('sync', null).then((settings) => {
    latestSyncedSettings = { ...DEFAULT_SETTINGS, ...settings };
    if (latestSyncedSettings.extensionEnabled === false) return;
    applyInstantRecsCssFromCache();
    runAll();
  }).catch(() => {
    // On failure, still attempt a rerun with cached settings
    if (latestSyncedSettings.extensionEnabled === false) return;
    applyInstantRecsCssFromCache();
    runAll();
  });
}

window.addEventListener('load', () => {
  forceSidebarRehide();
  setTimeout(forceSidebarRehide, 400);
  setTimeout(forceSidebarRehide, 1200);
  setTimeout(forcePopupEquivalent, 150);
  setTimeout(forcePopupEquivalent, 700);
});
window.addEventListener('pageshow', () => {
  forceSidebarRehide();
  setTimeout(forceSidebarRehide, 400);
  setTimeout(forcePopupEquivalent, 150);
});

// ===== LISTEN FOR SETTINGS CHANGES =====
browser.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') {
    return;
  }

  let redirectChanged = false;
  let shortsChanged = false;
  let recsChanged = false;

  Object.keys(changes).forEach((key) => {
    if (key === 'language') {
      const change = changes[key];
      const preferred = Object.prototype.hasOwnProperty.call(change, 'newValue')
        ? change.newValue
        : 'auto';
      handleLanguagePreferenceChange(preferred);
      return;
    }
    const change = changes[key];
    const nextValue = Object.prototype.hasOwnProperty.call(change, 'newValue')
      ? change.newValue
      : DEFAULT_SETTINGS[key];
    latestSyncedSettings[key] = nextValue;

    if (key === 'hideFeed' || key === 'redirectToSubs') {
      redirectChanged = true;
    }
    if (key === 'hideShortsHomepage' || key === 'hideShortsSearch' || key === 'hideShortsGlobally') {
      shortsChanged = true;
    }
    if (key === 'hideRecommended' || key === 'hideSidebar') {
      recsChanged = true;
    }
  });

  if (latestSyncedSettings.extensionEnabled !== false && redirectChanged) {
    applyRedirectStateFromCache();
  }

  if (latestSyncedSettings.extensionEnabled !== false && shortsChanged) {
    applyInstantShortsCssFromCache();
  }

  if (latestSyncedSettings.extensionEnabled !== false && recsChanged) {
    applyInstantRecsCssFromCache();
  }

  updateGuideVisibility();
  runAll();
});
// ===== LISTEN FOR MESSAGES FROM POPUP =====
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'powerStateChanged') {
    // Immediately apply the power state change
    runAll();
  } else if (message.action === 'settingChanged') {
    if (message.setting) {
      latestSyncedSettings[message.setting] = message.value;

      if (latestSyncedSettings.extensionEnabled !== false) {
        if (message.setting === 'hideFeed' || message.setting === 'redirectToSubs') {
          applyRedirectStateFromCache();
        }

        if (message.setting === 'hideShortsHomepage' || message.setting === 'hideShortsSearch' || message.setting === 'hideShortsGlobally') {
          applyInstantShortsCssFromCache();
        }
      }
    }
    updateGuideVisibility();
    runAll();
  } else if (message.action === 'customMemesUpdated') {
    // Re-apply hideFeed to update the displayed meme
    browser.storage.sync.get(['hideFeed', 'extensionEnabled'], (result) => {
      if (result.extensionEnabled !== false && result.hideFeed) {
        // Remove existing placeholder and re-create with new meme
        const placeholder = document.getElementById('lockedin-feed-placeholder');
        if (placeholder) placeholder.remove();
        hideFeed(true);
      }
    });
  } else if (message.action === 'breakEnded') {
    handleBreakEnded();
  }
});

// ===== REAL-TIME SETTING UPDATES =====
// Listen for setting changes and update video thumbnail mode instantly
browser.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'sync' && areaName !== 'local') return;
  if (changes.hideVideoThumbnails) {
    const newMode = changes.hideVideoThumbnails.newValue || 'off';
    hideVideoThumbnails(newMode);
  }
});
