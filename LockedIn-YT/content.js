// ===== CROSS-BROWSER COMPATIBILITY =====
// Support both Firefox (browser) and Chromium-based browsers (chrome)
if (typeof browser === 'undefined') {
  var browser = chrome;
}

function normalizePathname(pathname) {
  if (!pathname) return '/';
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.replace(/\/+$/, '');
  }
  return pathname;
}

function isHomePath(pathname = window.location.pathname) {
  const normalized = normalizePathname(pathname);
  return normalized === '/' || normalized === '/home';
}

function isSubscriptionsPath(pathname = window.location.pathname) {
  return normalizePathname(pathname) === '/feed/subscriptions';
}

function isHomeLikeSurface(pathname = window.location.pathname) {
  const normalized = normalizePathname(pathname);
  if (isHomePath(normalized) || isSubscriptionsPath(normalized)) {
    return true;
  }
  return normalized === '/feed/trending';
}

// ===== INSTANT REDIRECT TO SUBSCRIPTIONS =====
// Check immediately on page load if we should redirect from homepage
(function instantRedirectCheck() {
  if (isHomePath()) {
    // Check storage synchronously using the sync API
    browser.storage.sync.get(['hideFeed', 'redirectToSubs', 'extensionEnabled'], (result) => {
      if (result.extensionEnabled !== false && result.hideFeed && result.redirectToSubs) {
        // Redirect immediately before page renders
        window.location.replace('https://www.youtube.com/feed/subscriptions');
      }
    });
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

const timesUpOverlayStyle = document.createElement('style');
timesUpOverlayStyle.id = 'lockedin-timesup-style';
timesUpOverlayStyle.textContent = `
#lockedin-timesup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0);
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
  z-index: 2147483646;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease-out, backdrop-filter 0.2s ease-out;
}

#lockedin-timesup-overlay.visible {
  opacity: 1;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  pointer-events: all;
  transition: opacity 0.25s ease-in, backdrop-filter 0.3s ease-in;
}

#lockedin-timesup-overlay .lockedin-timesup-image {
  position: absolute;
  top: 200px;
  left: 50%;
  transform: translate(-50%, -20px);
  width: 120px;
  height: 120px;
  max-width: 120px;
  max-height: 120px;
  border-radius: 8px;
  object-fit: contain;
  filter: drop-shadow(0 12px 25px rgba(0, 0, 0, 0.25));
  opacity: 0;
  transition: opacity 0.25s ease-out;
}

#lockedin-timesup-overlay.show-image .lockedin-timesup-image {
  opacity: 1;
}

@media (max-width: 700px) {
  #lockedin-timesup-overlay .lockedin-timesup-image {
    top: 120px;
  }
}
`;
(document.head || document.documentElement).appendChild(timesUpOverlayStyle);

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
  /* Hide Shorts shelf containers on search page */
  ytd-reel-shelf-renderer:not([data-lockedin-hidden]),
  ytd-rich-shelf-renderer:has([href^="/shorts/"]):not([data-lockedin-hidden]),
  ytd-rich-section-renderer:has([href^="/shorts/"]):not([data-lockedin-hidden]),
  grid-shelf-view-model:not([data-lockedin-hidden]) {
    display: none;
  }
  
  /* Hide video renderers that link to Shorts on search page */
  ytd-video-renderer:has([href^="/shorts/"]):not([data-lockedin-hidden]) {
    display: none;
  }
  
  /* Hide Shorts overlay badge items on search page */
  ytd-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]):not([data-lockedin-hidden]) {
    display: none;
  }
`;
    }
  }
  
  // Update the style element
  style.textContent = css;
}

function setRootFlag(flag, enabled) {
  const root = document.documentElement;
  if (!root) return;
  if (enabled) {
    root.setAttribute(flag, 'true');
  } else {
    root.removeAttribute(flag);
  }
}

let timesUpOverlayTimeout = null;
let breakRedirectTimeout = null;

function showTimesUpOverlay() {
  try {
    const existing = document.getElementById('lockedin-timesup-overlay');
    if (existing) {
      existing.remove();
    }
    const overlay = document.createElement('div');
    overlay.id = 'lockedin-timesup-overlay';

    const img = document.createElement('img');
    img.className = 'lockedin-timesup-image';
    img.alt = 'Time is up!';
    img.src = browser.runtime.getURL('homepage/timesUp.jpg');
    img.onerror = () => {
      img.remove();
      const fallback = document.createElement('div');
      fallback.className = 'lockedin-timesup-image';
      fallback.style.display = 'flex';
      fallback.style.alignItems = 'center';
      fallback.style.justifyContent = 'center';
      fallback.style.fontSize = '20px';
      fallback.style.fontWeight = '600';
      fallback.style.color = '#0f0f0f';
      fallback.textContent = 'Time\'s up!';
      overlay.appendChild(fallback);
    };
    overlay.appendChild(img);

    (document.body || document.documentElement).appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.classList.add('visible');
      requestAnimationFrame(() => overlay.classList.add('show-image'));
    });

    clearTimeout(timesUpOverlayTimeout);
    timesUpOverlayTimeout = setTimeout(() => {
      overlay.classList.remove('visible');
      overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
    }, 3000);
  } catch (error) {
    console.error('LockedIn: Failed to show times up overlay', error);
  }
}

function handleBreakEnded() {
  showTimesUpOverlay();
  clearTimeout(breakRedirectTimeout);
  breakRedirectTimeout = setTimeout(() => {
    try {
      if (window.location.hostname && window.location.hostname.includes('youtube.com')) {
        const targetUrl = 'https://www.youtube.com/';
        if (window.location.href !== targetUrl) {
          window.location.replace(targetUrl);
        }
      }
    } catch (error) {
      console.error('LockedIn: Failed to redirect after break', error);
    }
  }, 600);
}

// ===== DEBOUNCE UTILITY =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===== DEFAULT SETTINGS =====
const DEFAULT_SETTINGS = {
  hideFeed: false,
  redirectToSubs: false,
  hideShortsHomepage: false,
  hideCommunityPosts: false,
  hideShortsGlobally: false,
  redirectShorts: false,
  hideSidebar: false,
  hideLiveChat: false,
  hideEndCards: false,
  hideComments: false,
  disableAutoplay: false,
  hideSearchRecommended: false,
  hideShortsSearch: false,
  hideExplore: false,
  hideMoreFromYT: false,
  hidePlaylists: false,
  extensionEnabled: true
};

let latestSyncedSettings = { ...DEFAULT_SETTINGS };
const GUIDE_HIDE_ATTR = 'data-lockedin-guide';
const GUIDE_HOME_SELECTORS = [
  'ytd-guide-entry-renderer a[href="/"]',
  'ytd-guide-entry-renderer a[href="/home"]',
  'ytd-guide-entry-renderer a[title="Home"]',
  'ytd-guide-entry-renderer #endpoint[title="Home"]',
  'ytd-mini-guide-entry-renderer a[href="/"]',
  'ytd-mini-guide-entry-renderer a[href="/home"]',
  'ytd-mini-guide-entry-renderer a[title="Home"]',
  'ytd-mini-guide-entry-renderer #endpoint[title="Home"]'
];
const GUIDE_SHORTS_SELECTORS = [
  'ytd-guide-entry-renderer a[href^="/shorts"]',
  'ytd-guide-entry-renderer a[title="Shorts"]',
  'ytd-guide-entry-renderer #endpoint[title="Shorts"]',
  'ytd-mini-guide-entry-renderer a[href^="/shorts"]',
  'ytd-mini-guide-entry-renderer a[title="Shorts"]',
  'ytd-mini-guide-entry-renderer #endpoint[title="Shorts"]'
];
const guideObserver = new MutationObserver(() => {
  if (latestSyncedSettings.extensionEnabled === false) return;
  updateGuideVisibility();
});

function applyInstantShortsCssFromCache() {
  setInstantHiding(
    latestSyncedSettings.hideShortsHomepage,
    latestSyncedSettings.hideShortsSearch,
    latestSyncedSettings.hideShortsGlobally
  );
}

function applyRedirectStateFromCache() {
  const shouldRedirect =
    latestSyncedSettings.hideFeed && latestSyncedSettings.redirectToSubs;
  redirectToSubscriptions(shouldRedirect);
}

function toggleGuideSelectors(selectors, marker, shouldHide) {
  if (!selectors || selectors.length === 0) return;
  const combinedSelector = selectors.join(',');
  document.querySelectorAll(combinedSelector).forEach((link) => {
    const container = link.closest('ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer');
    if (!container) return;
    if (shouldHide) {
      container.style.display = 'none';
      container.setAttribute('hidden', '');
      container.setAttribute(GUIDE_HIDE_ATTR, marker);
    } else if (container.getAttribute(GUIDE_HIDE_ATTR) === marker) {
      container.style.display = '';
      container.removeAttribute('hidden');
      container.removeAttribute(GUIDE_HIDE_ATTR);
    }
  });
}

function updateGuideVisibility() {
  const enabled = latestSyncedSettings.extensionEnabled !== false;
  const hideHomeTab = enabled && (
    latestSyncedSettings.hideFeed ||
    latestSyncedSettings.redirectToSubs
  );
  const hideShortsTab = enabled && (
    latestSyncedSettings.hideShortsHomepage ||
    latestSyncedSettings.hideShortsGlobally ||
    latestSyncedSettings.hideShortsSearch ||
    latestSyncedSettings.redirectShorts
  );
  setRootFlag('data-lockedin-hide-home', hideHomeTab);
  setRootFlag('data-lockedin-hide-shorts-tab', hideShortsTab);
  toggleGuideSelectors(GUIDE_HOME_SELECTORS, 'home', hideHomeTab);
  toggleGuideSelectors(GUIDE_SHORTS_SELECTORS, 'shorts', hideShortsTab);
}

function observeGuideContainers() {
  document.querySelectorAll('ytd-guide-renderer, ytd-mini-guide-renderer').forEach((container) => {
    guideObserver.observe(container, { childList: true, subtree: true });
  });
}

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
    browser.storage.local.get('stats').then((result) => {
      const stats = { ...DEFAULT_STATS, ...result.stats };
      const today = new Date().toDateString();
      
      // Reset today's time if it's a new day
      if (stats.todayDate !== today) {
        stats.todaySessionMs = 0;
        stats.todayDate = today;
      }
      
      stats.sessionTimeMs += elapsed;
      stats.todaySessionMs += elapsed;
      
      browser.storage.local.set({ stats });
    }).catch(() => {});
  }
}

// Track stats for blocked elements - only when page is active
function trackStat(type, count = 1) {
  if (count <= 0) return;
  
  // Only track stats when user is actively on the YouTube page
  if (!isPageCurrentlyActive()) return;
  
  browser.storage.local.get('stats').then((result) => {
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
    
    browser.storage.local.set({ stats });
  }).catch(() => {});
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
browser.storage.sync.get(null).then((settings) => {
  // If no settings exist, initialize with defaults
  if (Object.keys(settings).length === 0) {
    latestSyncedSettings = { ...DEFAULT_SETTINGS };
    browser.storage.sync.set(DEFAULT_SETTINGS).catch((error) => {
      console.error('LockedIn: Failed to initialize settings', error);
    });
  } else {
    latestSyncedSettings = { ...DEFAULT_SETTINGS, ...settings };
  }
  updateGuideVisibility();
}).catch((error) => {
  console.error('LockedIn: Failed to check settings', error);
});

// ===== HELPER FUNCTIONS =====
function toggleElement(selector, shouldHide) {
  const element = document.querySelector(selector);
  if (element) {
    element.style.display = shouldHide ? 'none' : '';
  }
}

function toggleAllElements(selector, shouldHide) {
  document.querySelectorAll(selector).forEach(el => {
    el.style.display = shouldHide ? 'none' : '';
  });
}

function dataUrlToBlob(dataUrl) {
  const parts = dataUrl.split(',');
  if (parts.length < 2) {
    throw new Error('Invalid data URL');
  }
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const binaryString = atob(parts[1]);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

function getImageSource(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith('data:')) {
    return { src: imageUrl, cleanup: null };
  }
  try {
    const blob = dataUrlToBlob(imageUrl);
    const objectUrl = URL.createObjectURL(blob);
    return {
      src: objectUrl,
      cleanup: () => URL.revokeObjectURL(objectUrl)
    };
  } catch (error) {
    console.error('LockedIn: Failed to convert custom meme to blob', error);
    return { src: null, cleanup: null };
  }
}

// ===== REDIRECT TO SUBSCRIPTIONS PAGE =====
let homepageInterceptorSetup = false;

function redirectToSubscriptions(shouldRedirect) {
  const styleId = 'lockedin-hide-homepage-nav';
  
  if (!shouldRedirect) {
    // Remove the CSS that hides homepage navigation
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) existingStyle.remove();
    
    // Remove click interceptor
    if (window._lockedinHomepageInterceptor) {
      document.removeEventListener('click', window._lockedinHomepageInterceptor, true);
      window._lockedinHomepageInterceptor = null;
    }
    homepageInterceptorSetup = false;
    return;
  }
  
  // Inject CSS to hide homepage from sidebar and top navigation
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Hide Home tab in sidebar (expanded) */
      ytd-guide-entry-renderer:has(a[href="/"]),
      ytd-guide-entry-renderer:has(a[title="Home"]) {
        display: none !important;
      }
      
      /* Hide Home tab in mini sidebar (collapsed) */
      ytd-mini-guide-entry-renderer:has(a[href="/"]),
      ytd-mini-guide-entry-renderer:has(a[title="Home"]) {
        display: none !important;
      }

      /* Hide Home tab in top navigation chips and tabs */
      tp-yt-paper-tab:has(a[href="/"]),
      tp-yt-paper-tab:has(a[href^="/home"]),
      tp-yt-paper-tab:has(a[title="Home"]),
      tp-yt-paper-tab:has(div[title="Home"]),
      yt-tab-shape:has(a[href="/"]),
      yt-tab-shape:has(a[href^="/home"]),
      yt-chip-cloud-chip-renderer:has(a[href="/"]),
      yt-chip-cloud-chip-renderer:has(a[href^="/home"]),
      yt-chip-cloud-chip-renderer:has(div[title="Home"]),
      ytd-feed-filter-chip-bar-renderer tp-yt-paper-tab:has(a[href="/"]),
      ytd-feed-filter-chip-bar-renderer yt-chip-cloud-chip-renderer:has(a[href="/"]),
      ytm-pivot-bar-item-renderer:has([href="/"])
      {
        display: none !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }
  
  // Intercept clicks on YouTube logo and any homepage links
  if (!homepageInterceptorSetup) {
    window._lockedinHomepageInterceptor = function(e) {
      const target = e.target.closest('a[href="/"], a[href="/home"], #logo, ytd-logo, #start a, a[title="YouTube Home"]');
      if (target) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = 'https://www.youtube.com/feed/subscriptions';
      }
    };
    document.addEventListener('click', window._lockedinHomepageInterceptor, true);
    homepageInterceptorSetup = true;
  }
  
  // If currently on homepage, redirect immediately
  if (isHomePath()) {
    window.location.replace('https://www.youtube.com/feed/subscriptions');
  }
}

function hideFeed(shouldHide) {
  const placeholderId = 'lockedin-feed-placeholder';
  
  if (!shouldHide) {
    // Restore feed elements
    const feedElements = [
      document.querySelector('ytd-rich-grid-renderer'),
      document.querySelector('ytd-two-column-browse-results-renderer'),
      ...document.querySelectorAll('[data-lockedin-hidden="feed"]')
    ].filter(el => el);
    
    feedElements.forEach(el => {
      el.style.removeProperty('display');
      el.removeAttribute('data-lockedin-hidden');
    });
    
    // Remove placeholder if it exists
    const placeholder = document.getElementById(placeholderId);
    if (placeholder) {
      placeholder.remove();
    }
    return;
  }
  
  // Only hide on homepage
  if (window.location.pathname === '/' || window.location.pathname === '/home') {
    // Hide multiple feed-related elements
    const feedSelectors = [
      'ytd-rich-grid-renderer',
      'ytd-two-column-browse-results-renderer #primary',
      'ytd-browse[page-subtype="home"]'
    ];
    
    feedSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (!el.hasAttribute('data-lockedin-hidden')) {
          el.style.setProperty('display', 'none', 'important');
          el.setAttribute('data-lockedin-hidden', 'feed');
        }
      });
    });
    
    // Create and inject placeholder with random meme image
    if (!document.getElementById(placeholderId)) {
        const placeholder = document.createElement('div');
        placeholder.id = placeholderId;
        placeholder.style.cssText = `
          position: absolute;
          top: 200px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 1;
          pointer-events: none;
        `;
        
        // Check for custom memes first
        browser.storage.local.get('customMemes', (result) => {
          let imageUrl;
          
          if (result.customMemes && result.customMemes.length > 0) {
            // Use random custom meme
            imageUrl = result.customMemes[Math.floor(Math.random() * result.customMemes.length)];
            console.log('LockedIn: Using custom meme');
          } else {
            // Use default meme images
            const memeImages = ['meme1.jpg', 'meme2.jpg', 'meme3.jpg', 'meme4.jpg', 'meme5.jpg'];
            const randomMeme = memeImages[Math.floor(Math.random() * memeImages.length)];
            imageUrl = browser.runtime.getURL('homepage/' + randomMeme);
            console.log('LockedIn: Loading default meme from:', imageUrl);
          }
          
          const { src, cleanup } = getImageSource(imageUrl);
          if (!src) {
            placeholder.innerHTML = '<div style="font-size: 50px;">🔒</div>';
            return;
          }
          
          // Create image element
          const img = document.createElement('img');
          img.src = src;
          img.alt = 'Stay Focused!';
          img.style.cssText = 'max-width: 120px; max-height: 120px; box-shadow: 0 2px 10px rgba(0,0,0,0.3); display: block; image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges; filter: contrast(1.2) saturate(0.8);';
          
          img.onerror = function() {
            console.error('LockedIn: Failed to load meme image');
            if (cleanup) cleanup();
            // Show a fallback emoji if image fails to load
            placeholder.innerHTML = '<div style="font-size: 50px;">🔒</div>';
          };
          
          img.onload = function() {
            console.log('LockedIn: Meme image loaded successfully');
            if (cleanup) cleanup();
          };
          
          placeholder.appendChild(img);
        });
        
        document.body.appendChild(placeholder);
        console.log('LockedIn: Placeholder injected into body');
      }
  } else {
    // Remove placeholder if not on homepage
    const placeholder = document.getElementById(placeholderId);
    if (placeholder) {
      placeholder.remove();
    }
  }
}

function hideSidebar(shouldHide) {
  if (!window.location.href.includes('/watch')) {
    return;
  }
  
  const playlistPanel = document.querySelector('#secondary ytd-playlist-panel-renderer, ytd-playlist-panel-renderer, ytd-playlist-panel-view-model, #playlist');
  const hasPlaylistPanel = !!playlistPanel;
  
  // Restore state when disabled
  if (!shouldHide) {
    // Restore recommendation items
    document.querySelectorAll('[data-lockedin-hidden="sidebar-recommendation"]').forEach(el => {
      el.style.display = '';
      el.removeAttribute('data-lockedin-hidden');
    });
    // Restore sidebar container
    toggleElement('#secondary', false);
    toggleElement('#secondary-inner', false);
    const flexyContainerRestore = document.querySelector('ytd-watch-flexy');
    if (flexyContainerRestore) {
      flexyContainerRestore.style.removeProperty('--ytd-watch-flexy-sidebar-width');
    }
    // Restore Up Next overlays
    toggleAllElements('.ytp-upnext, .ytp-upnext-container, .ytp-suggestion-set', false);
    return;
  }
  
  if (hasPlaylistPanel) {
    // Keep playlist panel visible, hide other recommendation items
    const recommendationSelectors = [
      '#secondary ytd-compact-video-renderer',
      '#secondary ytd-compact-movie-renderer',
      '#secondary ytd-compact-radio-renderer',
      '#secondary ytd-compact-autoplay-renderer',
      'ytd-watch-next-secondary-results-renderer ytd-compact-video-renderer',
      'ytd-watch-next-secondary-results-renderer ytd-compact-movie-renderer',
      'ytd-watch-next-secondary-results-renderer ytd-compact-radio-renderer',
      'ytd-watch-next-secondary-results-renderer ytd-compact-autoplay-renderer'
    ];
    recommendationSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        // Do not hide the playlist panel itself
        if (el.closest('ytd-playlist-panel-renderer')) return;
        if (!el.hasAttribute('data-lockedin-hidden')) {
          el.style.display = 'none';
          el.setAttribute('data-lockedin-hidden', 'sidebar-recommendation');
        }
      });
    });
    // Also hide common recommendation containers (keep playlist panel)
    const recommendationContainers = [
      'ytd-watch-next-secondary-results-renderer',
      '#related',
      '#secondary #items',
      'ytd-item-section-renderer',
      'ytd-continuation-item-renderer'
    ];
    recommendationContainers.forEach(containerSel => {
      document.querySelectorAll(`#secondary ${containerSel}`).forEach(container => {
        if (playlistPanel && container.contains(playlistPanel)) return;
        // Special handling for livestream continuation containers
        const isLivestreamContainer = container.querySelector('ytd-compact-video-renderer, ytd-compact-autoplay-renderer');
        if (isLivestreamContainer || container.tagName.toLowerCase() === 'ytd-continuation-item-renderer') {
          if (!container.hasAttribute('data-lockedin-hidden')) {
            container.style.display = 'none';
            container.setAttribute('data-lockedin-hidden', 'sidebar-recommendation');
          }
        } else if (!container.hasAttribute('data-lockedin-hidden')) {
          container.style.display = 'none';
          container.setAttribute('data-lockedin-hidden', 'sidebar-recommendation');
        }
      });
    });
    // Ensure sidebar stays visible
    toggleElement('#secondary', false);
    toggleElement('#secondary-inner', false);
  } else {
    // No current playlist: hide entire sidebar and all recommendation renderers
    // First hide all individual video renderers (including livestream recommendations)
    const allVideoRenderers = [
      'ytd-compact-video-renderer',
      'ytd-compact-movie-renderer',
      'ytd-compact-radio-renderer',
      'ytd-compact-autoplay-renderer',
      'ytd-video-renderer'
    ];
    let recsCount = 0;
    allVideoRenderers.forEach(selector => {
      document.querySelectorAll(`#secondary ${selector}`).forEach(el => {
        if (!el.hasAttribute('data-lockedin-hidden')) {
          el.style.display = 'none';
          el.setAttribute('data-lockedin-hidden', 'sidebar-recommendation');
          recsCount++;
        }
      });
    });
    // Track hidden recommendations
    if (recsCount > 0) {
      trackStat('recs', recsCount);
    }
    
    // Hide all container sections
    const allContainers = [
      'ytd-watch-next-secondary-results-renderer',
      'ytd-item-section-renderer',
      'ytd-continuation-item-renderer',
      '#related',
      '#items'
    ];
    allContainers.forEach(selector => {
      document.querySelectorAll(`#secondary ${selector}`).forEach(el => {
        if (!el.hasAttribute('data-lockedin-hidden')) {
          el.style.display = 'none';
          el.setAttribute('data-lockedin-hidden', 'sidebar-recommendation');
        }
      });
    });
    
    // Finally hide the entire sidebar
    toggleElement('#secondary', true);
    toggleElement('#secondary-inner', true);
    const flexyContainer = document.querySelector('ytd-watch-flexy');
    if (flexyContainer) {
      flexyContainer.style.setProperty('--ytd-watch-flexy-sidebar-width', '0px', 'important');
    }
  }
  
  // Hide player Up Next overlays when hiding recommendations or sidebar
  toggleAllElements('.ytp-upnext, .ytp-upnext-container, .ytp-suggestion-set', true);
}

function hidePlaylists(shouldHide) {
  if (!window.location.href.includes('/watch')) {
    return;
  }
  
  const playlistPanel = document.querySelector('#secondary ytd-playlist-panel-renderer, ytd-playlist-panel-renderer, ytd-playlist-panel-view-model, #playlist');
  
  if (!shouldHide) {
    document.querySelectorAll('[data-lockedin-hidden="current-playlist-panel"]').forEach(el => {
      el.style.display = '';
      el.removeAttribute('data-lockedin-hidden');
    });
    if (playlistPanel) {
      playlistPanel.style.display = '';
    }
    collapseSidebarIfEmpty();
    return;
  }
  
  if (playlistPanel && !playlistPanel.hasAttribute('data-lockedin-hidden')) {
    playlistPanel.style.display = 'none';
    playlistPanel.setAttribute('data-lockedin-hidden', 'current-playlist-panel');
  }
  collapseSidebarIfEmpty();
}

function collapseSidebarIfEmpty() {
  const sidebar = document.querySelector('#secondary');
  if (!sidebar) return;
  const hasVisible = Array.from(sidebar.querySelectorAll('*')).some(el => {
    return el.offsetParent !== null && el.getAttribute('data-lockedin-hidden') !== 'sidebar-recommendation' && el.getAttribute('data-lockedin-hidden') !== 'current-playlist-panel';
  });
  if (!hasVisible) {
    sidebar.style.display = 'none';
  } else {
    sidebar.style.display = '';
  }
}

function hideLiveChat(shouldHide) {
  toggleElement('#chat', shouldHide);
}

function hideEndCards(shouldHide) {
  if (!shouldHide) {
    // Restore end screen cards
    toggleAllElements('.ytp-ce-element', false);
    toggleAllElements('.ytp-ce-video', false);
    toggleAllElements('.ytp-ce-playlist', false);
    toggleAllElements('.ytp-ce-channel', false);
    toggleAllElements('.ytp-ce-website', false);
    toggleAllElements('.ytp-ce-covering-overlay', false);
    toggleAllElements('.ytp-ce-shadow', false);
    toggleAllElements('.ytp-ce-size-1280', false);
    toggleAllElements('.ytp-ce-size-853', false);
    toggleAllElements('.ytp-show-tiles', false);
    
    document.querySelectorAll('.ytp-endscreen-content').forEach(el => {
      el.style.display = '';
    });
    
    document.querySelectorAll('[class*="endscreen"]').forEach(el => {
      el.style.display = '';
    });
    
    // Restore video suggestions that appear after video ends
    toggleAllElements('.ytp-suggestion-set', false);
    toggleAllElements('.ytp-videowall-still', false);
    toggleAllElements('.html5-endscreen', false);
    toggleAllElements('.ytp-endscreen-previous', false);
    toggleAllElements('.ytp-endscreen-next', false);
    
    // Restore the entire endscreen container
    document.querySelectorAll('.html5-endscreen, .ytp-endscreen-content, .ytp-ce-covering-overlay').forEach(el => {
      el.style.display = '';
      el.style.visibility = '';
      el.style.opacity = '';
    });
    
    return;
  }
  
  // Count visible end cards before hiding for stats
  let endCardsCount = 0;
  document.querySelectorAll('.ytp-ce-element:not([data-lockedin-counted])').forEach(el => {
    if (el.offsetParent !== null) {
      endCardsCount++;
      el.setAttribute('data-lockedin-counted', 'true');
    }
  });
  if (endCardsCount > 0) {
    trackStat('endcards', endCardsCount);
  }
  
  // Hide end screen annotation cards (cards that appear during video)
  toggleAllElements('.ytp-ce-element', true);
  toggleAllElements('.ytp-ce-video', true);
  toggleAllElements('.ytp-ce-playlist', true);
  toggleAllElements('.ytp-ce-channel', true);
  toggleAllElements('.ytp-ce-website', true);
  toggleAllElements('.ytp-ce-covering-overlay', true);
  toggleAllElements('.ytp-ce-shadow', true);
  toggleAllElements('.ytp-ce-size-1280', true);
  toggleAllElements('.ytp-ce-size-853', true);
  
  document.querySelectorAll('.ytp-endscreen-content').forEach(el => {
    el.style.display = 'none';
  });
  
  toggleAllElements('.ytp-show-tiles', true);
  document.querySelectorAll('[class*="endscreen"]').forEach(el => {
    el.style.display = 'none';
  });
  
  document.querySelectorAll('.ytp-ce-element-show').forEach(el => {
    el.style.display = 'none';
  });
  
  // Hide video suggestions that appear AFTER video ends (the grid of videos)
  toggleAllElements('.ytp-suggestion-set', true);
  toggleAllElements('.ytp-videowall-still', true);
  toggleAllElements('.html5-endscreen', true);
  toggleAllElements('.ytp-endscreen-previous', true);
  toggleAllElements('.ytp-endscreen-next', true);
  
  // Hide the entire endscreen container and its children
  document.querySelectorAll('.html5-endscreen, .ytp-endscreen-content, .ytp-ce-covering-overlay').forEach(el => {
    el.style.display = 'none';
    el.style.visibility = 'hidden';
    el.style.opacity = '0';
  });
  
  // Hide video wall (the grid of suggested videos at end)
  document.querySelectorAll('.ytp-videowall-still-image, .ytp-videowall-still, .videowall-endscreen').forEach(el => {
    el.style.display = 'none';
  });
}

function hideExplore(shouldHide) {
  const exploreKeywords = ['explore', 'trending', 'music', 'movies', 'live', 'gaming', 'news', 'sports', 'learning', 'fashion','shopping','courses','podcasts'];
  document.querySelectorAll('ytd-guide-entry-renderer a').forEach(link => {
    const text = link.innerText.toLowerCase().trim();
    if (exploreKeywords.some(item => text.includes(item))) {
      const parent = link.closest('ytd-guide-entry-renderer');
      if (parent) {
        parent.style.display = shouldHide ? 'none' : '';
      }
    }
  });
}

// ===== HELPER FUNCTIONS FOR GRID REARRANGING =====
// Check if all children in an element are hidden
function allChildrenHidden(element) {
  for (let i = 0; i < element.childElementCount; i++) {
    if (!element.children[i].hasAttribute('hidden')) {
      return false;
    }
  }
  return true;
}

// Find parent element with specific tag name
function findParentWithElementTag(element, container) {
  while (element.tagName.toLowerCase() !== container && element.parentElement !== null) {
    element = element.parentElement;
  }
  return element.tagName.toLowerCase() === container ? element : null;
}

// Hide parent container if all children are hidden
function hideContainerOfElement(container, element) {
  if (allChildrenHidden(element.parentElement)) {
    const parent = findParentWithElementTag(element.parentElement, container);
    if (parent === null) return;
    if (!parent.hasAttribute('data-lockedin-hidden')) {
      parent.setAttribute('hidden', '');
      parent.setAttribute('data-lockedin-hidden', 'shorts');
    }
  }
}

// Grid rearranging class to prevent gaps in grid layout
class RearrangeVideosInGrid {
  constructor() {
    this.RICH_GRID_ROW = 'ytd-rich-grid-row';
  }

  countVisibleElementsInRow(row) {
    let visibleCount = 0;
    for (const child of row.children) {
      if (!child.hasAttribute('hidden')) {
        visibleCount++;
      }
    }
    return visibleCount;
  }

  rearrangeVideosInRichGridRows(startFromRowElement, elementsPerRow) {
    const richGridRows = startFromRowElement.parentElement.parentElement.querySelectorAll(this.RICH_GRID_ROW);
    const startIndex = Array.from(richGridRows).indexOf(startFromRowElement.parentElement);

    const amountOfVisibleElements = this.countVisibleElementsInRow(startFromRowElement);
    const elementsToMove = elementsPerRow - amountOfVisibleElements;

    for (let j = 0; j < elementsToMove; j++) {
      // For each next row, move one element to previous row
      for (let i = startIndex; i < richGridRows.length - 1; i++) {
        const nextRichRowDiv = richGridRows[i + 1].querySelector('div');
        if (nextRichRowDiv.childElementCount <= 0) break;
        richGridRows[i].querySelector('div').appendChild(nextRichRowDiv.childNodes[0]);
      }
    }
  }

  execute(element) {
    if (element.parentElement && element.parentElement.parentElement &&
        element.parentElement.parentElement.tagName.toLowerCase().match(this.RICH_GRID_ROW) &&
        element.hasAttribute('items-per-row')) {
      const pElement = element.parentElement;
      const itemsPerRow = element.getAttribute('items-per-row');
      element.remove();
      this.rearrangeVideosInRichGridRows(pElement, itemsPerRow);
    }
  }
}

// Create instance for grid rearranging
const gridRearranger = new RearrangeVideosInGrid();

// Track autoplay disabled state
let autoplayDisabledThisPage = false;

function disableAutoplay(shouldDisable) {
  if (!shouldDisable) {
    // Restore autoplay elements if user turns off the toggle
    toggleAllElements('.ytp-upnext', false);
    toggleAllElements('.ytp-upnext-container', false);
    toggleAllElements('.ytp-autonav-endscreen', false);
    toggleAllElements('.ytp-autonav-endscreen-upnext-container', false);
    toggleAllElements('.ytm-autonav-bar', false);
    toggleAllElements('.ytm-upnext-autoplay-container', false);
    
    document.querySelectorAll('.ytp-autonav-endscreen-upnext-button, .ytp-autonav-endscreen-countdown, .ytp-upnext-autoplay-icon').forEach(el => {
      el.style.display = '';
    });
    autoplayDisabledThisPage = false;
    return;
  }
  
  // Track autoplay stop once per page
  if (!autoplayDisabledThisPage) {
    const autoplayButton = document.querySelector('button.ytp-autonav-toggle-button');
    if (autoplayButton && autoplayButton.getAttribute('aria-pressed') === 'true') {
      trackStat('autoplay', 1);
      autoplayDisabledThisPage = true;
    }
  }
  
  // Method 1: Click the autoplay toggle button if it's enabled
  const autoplayButton = document.querySelector('button.ytp-autonav-toggle-button');
  if (autoplayButton && autoplayButton.getAttribute('aria-pressed') === 'true') {
    autoplayButton.click();
  }
  
  // Method 2: Also check for the newer autoplay toggle in settings
  const autoplayToggle = document.querySelector('.ytp-autonav-toggle-button-container button[aria-pressed="true"]');
  if (autoplayToggle) {
    autoplayToggle.click();
  }
  
  // Method 3: Try to find autoplay in the player settings menu
  const settingsAutoplay = document.querySelector('input[name="advancement"][checked]');
  if (settingsAutoplay) {
    settingsAutoplay.click();
  }
  
  // Method 4: Hide the "Up Next" autoplay countdown overlay
  toggleAllElements('.ytp-upnext', true);
  toggleAllElements('.ytp-upnext-container', true);
  toggleAllElements('.ytp-autonav-endscreen', true);
  toggleAllElements('.ytp-autonav-endscreen-upnext-container', true);
  
  // Method 5: Prevent autoplay by hiding the countdown
  document.querySelectorAll('.ytp-autonav-endscreen-upnext-button, .ytp-autonav-endscreen-countdown, .ytp-upnext-autoplay-icon').forEach(el => {
    el.style.display = 'none';
  });
  
  // Method 6: Mobile autoplay elements
  toggleAllElements('.ytm-autonav-bar', true);
  toggleAllElements('.ytm-upnext-autoplay-container', true);
}

function hideComments(shouldHide) {
  if (!shouldHide) {
    // Restore comments section
    toggleElement('#comments', false);
    toggleElement('ytd-comments', false);
    toggleAllElements('ytd-comments-entry-point-header-renderer', false);
    return;
  }
  
  // Hide comments section
  toggleElement('#comments', true);
  toggleElement('ytd-comments', true);
  toggleAllElements('ytd-comments-entry-point-header-renderer', true);
}

function hideSearchRecommended(shouldHide) {
  if (!shouldHide) {
    // Restore search recommendations
    document.querySelectorAll('[data-lockedin-hidden="search-recommended"]').forEach(el => {
      el.removeAttribute('hidden');
      el.style.display = '';
      el.removeAttribute('data-lockedin-hidden');
    });
    return;
  }
  
  // Only run on search results page
  if (!window.location.pathname.includes('/results')) return;
  
  // Hide "Explore more", "Channels new to you", "People also watched", "From related searches", etc.
  const recommendedKeywords = [
    'explore more',
    'channels new to you',
    'people also watched',
    'previously watched',
    'related to your search',
    'from related searches',
    'for you',
    'related searches'
  ];
  
  document.querySelectorAll('ytd-shelf-renderer').forEach(shelf => {
    const title = shelf.querySelector('#title');
    if (title) {
      const titleText = title.textContent.toLowerCase().trim();
      if (recommendedKeywords.some(keyword => titleText.includes(keyword))) {
        if (!shelf.hasAttribute('data-lockedin-hidden')) {
          shelf.setAttribute('hidden', '');
          shelf.setAttribute('data-lockedin-hidden', 'search-recommended');
        }
      }
    }
  });
  
  // Also hide other recommendation sections
  document.querySelectorAll('ytd-horizontal-card-list-renderer, ytd-item-section-renderer').forEach(section => {
    const heading = section.querySelector('yt-formatted-string, #title');
    if (heading) {
      const headingText = heading.textContent.toLowerCase().trim();
      if (recommendedKeywords.some(keyword => headingText.includes(keyword))) {
        if (!section.hasAttribute('data-lockedin-hidden')) {
          section.setAttribute('hidden', '');
          section.setAttribute('data-lockedin-hidden', 'search-recommended');
        }
      }
    }
  });
}

function hideMoreFromYT(shouldHide) {
  if (!shouldHide) {
    // Restore "More From YouTube" section
    document.querySelectorAll('[data-lockedin-hidden="more-from-yt"]').forEach(el => {
      el.removeAttribute('hidden');
      el.style.display = '';
      el.removeAttribute('data-lockedin-hidden');
    });
    return;
  }
  
  // Find and hide "More From YouTube" section in sidebar
  document.querySelectorAll('ytd-guide-section-renderer').forEach(section => {
    const heading = section.querySelector('#guide-section-title');
    if (heading) {
      const headingText = heading.textContent.toLowerCase().trim();
      if (headingText.includes('more from youtube')) {
        if (!section.hasAttribute('data-lockedin-hidden')) {
          section.setAttribute('hidden', '');
          section.setAttribute('data-lockedin-hidden', 'more-from-yt');
        }
      }
    }
  });
}

function hideCommunityPosts(shouldHide) {
  // Only apply on homepage
  const isHomepage = window.location.pathname === '/' || window.location.pathname === '/home';
  if (!isHomepage) return;

  if (!shouldHide) {
    // Restore community posts
    document.querySelectorAll('[data-lockedin-hidden="community-post"]').forEach(el => {
      el.removeAttribute('hidden');
      el.style.display = '';
      el.removeAttribute('data-lockedin-hidden');
    });
    return;
  }

  // Hide community posts sections (polls, posts, votes)
  // Using selectors from uBlock Origin rules
  document.querySelectorAll('ytd-rich-section-renderer:has(ytd-rich-item-renderer[is-post])').forEach(section => {
    if (!section.hasAttribute('data-lockedin-hidden')) {
      section.setAttribute('hidden', '');
      section.style.display = 'none';
      section.setAttribute('data-lockedin-hidden', 'community-post');
    }
  });

  // Hide individual post items
  document.querySelectorAll('ytd-rich-item-renderer[is-post]').forEach(post => {
    if (!post.hasAttribute('data-lockedin-hidden')) {
      post.setAttribute('hidden', '');
      post.style.display = 'none';
      post.setAttribute('data-lockedin-hidden', 'community-post');
    }
  });

  // Also hide post renderers inside rich items (alternative structure)
  document.querySelectorAll('ytd-rich-item-renderer:has(ytd-post-renderer), ytd-rich-item-renderer:has(ytd-backstage-post-thread-renderer)').forEach(item => {
    if (!item.hasAttribute('data-lockedin-hidden')) {
      item.setAttribute('hidden', '');
      item.style.display = 'none';
      item.setAttribute('data-lockedin-hidden', 'community-post');
    }
  });

  // Mobile support - hide backstage posts (community posts on mobile)
  document.querySelectorAll('ytm-backstage-post-renderer').forEach(post => {
    // Find the parent container to hide the entire post section
    const container = post.closest('ytm-item-section-renderer') || post.closest('ytm-rich-item-renderer') || post;
    if (container && !container.hasAttribute('data-lockedin-hidden')) {
      container.setAttribute('hidden', '');
      container.style.display = 'none';
      container.setAttribute('data-lockedin-hidden', 'community-post');
    }
  });

  // Also try direct selectors for mobile post renderers
  document.querySelectorAll('ytm-rich-item-renderer:has(ytm-post-renderer), ytm-item-section-renderer:has(ytm-post-renderer), ytm-item-section-renderer:has(ytm-backstage-post-renderer)').forEach(item => {
    if (!item.hasAttribute('data-lockedin-hidden')) {
      item.setAttribute('hidden', '');
      item.style.display = 'none';
      item.setAttribute('data-lockedin-hidden', 'community-post');
    }
  });
}

function hideShortsHomepage(shouldHide) {
  if (!shouldHide) {
    // Restore homepage Shorts elements
    document.querySelectorAll('[data-lockedin-hidden="shorts-homepage"]').forEach(el => {
      el.removeAttribute('hidden');
      el.style.display = '';
      el.removeAttribute('data-lockedin-hidden');
    });
    return;
  }

  // 1. Hide Shorts tab in sidebar (guide) - both expanded and collapsed
  const guideShortsSelectors = [
    'ytd-guide-entry-renderer a[href="/shorts"]',
    'ytd-guide-entry-renderer a[title="Shorts"]',
    'ytd-mini-guide-entry-renderer a[href="/shorts"]',
    'ytd-mini-guide-entry-renderer a[title="Shorts"]'
  ];
  
  guideShortsSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(link => {
      const container = link.closest('ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer');
      if (container && !container.hasAttribute('data-lockedin-hidden')) {
        container.setAttribute('hidden', '');
        container.setAttribute('data-lockedin-hidden', 'shorts-homepage');
      }
    });
  });

  // 2. Hide Shorts shelves/carousels on homepage (dedicated Shorts containers)
  const shelfSelectors = [
    'ytd-reel-shelf-renderer',           // Shorts shelf
    'ytd-rich-shelf-renderer',           // Rich shelf (check if contains Shorts)
    'ytd-rich-section-renderer'          // Rich section
  ];
  
  shelfSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(shelf => {
      // Check if shelf contains Shorts by looking for reel items or Shorts links
      const hasReelItems = shelf.querySelector('ytd-reel-item-renderer') !== null;
      const hasShortsLinks = shelf.querySelector('[href^="/shorts/"]') !== null;
      const titleHasShorts = shelf.querySelector('#title')?.textContent.toLowerCase().includes('shorts');
      
      if (hasReelItems || hasShortsLinks || titleHasShorts) {
        if (!shelf.hasAttribute('data-lockedin-hidden')) {
          shelf.setAttribute('hidden', '');
          shelf.setAttribute('data-lockedin-hidden', 'shorts-homepage');
          // Count shorts in shelf for stats
          const shortsCount = shelf.querySelectorAll('ytd-reel-item-renderer, [href^="/shorts/"]').length;
          if (shortsCount > 0) {
            trackStat('shorts', shortsCount);
          }
          // Rearrange grid if needed
          gridRearranger.execute(shelf);
        }
      }
    });
  });

  // 3. Hide individual video renderers containing Shorts links on home-like feeds (Home + Subscriptions)
  const isHomepageSurface = isHomeLikeSurface();
  if (isHomepageSurface) {
    const videoRendererSelectors = [
      'ytd-rich-item-renderer',       // Home page, grid view
      'ytd-reel-item-renderer'        // Reel items
    ];
    
    videoRendererSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(video => {
        const shortsLink = video.querySelector('[href^="/shorts/"]');
        
        if (shortsLink && !video.hasAttribute('data-lockedin-hidden')) {
          video.setAttribute('hidden', '');
          video.setAttribute('data-lockedin-hidden', 'shorts-homepage');
          // Track stat for this short
          trackStat('shorts', 1);
          
          // Rearrange grid if this is a grid item to prevent gaps
          gridRearranger.execute(video);
          
          // Check if parent container should be hidden (if all siblings are hidden)
          hideContainerIfAllChildrenHiddenHomepage(video);
        }
      });
    });
  }

  // 4. Hide by SHORTS overlay badge on home-like feeds
  if (isHomepageSurface) {
    document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]').forEach(overlay => {
      const container = overlay.closest('ytd-rich-item-renderer');
      
      if (container && !container.hasAttribute('data-lockedin-hidden')) {
        container.setAttribute('hidden', '');
        container.setAttribute('data-lockedin-hidden', 'shorts-homepage');
        trackStat('shorts', 1);
        hideContainerIfAllChildrenHiddenHomepage(container);
      }
    });
  }
  
  // NOTE: Shorts redirect is handled by the separate redirectShorts() function
  // which is controlled by the "Redirect Shorts" toggle
}

function hideShortsSearch(shouldHide) {
  if (!shouldHide) {
    // Restore search Shorts elements
    document.querySelectorAll('[data-lockedin-hidden="shorts-search"]').forEach(el => {
      el.removeAttribute('hidden');
      el.style.display = '';
      el.removeAttribute('data-lockedin-hidden');
    });
    return;
  }

  // Only run on search results page
  const isSearchPage = window.location.pathname.includes('/results');
  if (!isSearchPage) return;

  // 1. Hide Shorts shelves/carousels on search page
  const shelfSelectors = [
    'ytd-reel-shelf-renderer',           // Shorts shelf
    'ytd-rich-shelf-renderer',           // Rich shelf (check if contains Shorts)
    'ytd-rich-section-renderer',         // Rich section
    'grid-shelf-view-model'              // Extendable shelf with shorts on Search page
  ];
  
  shelfSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(shelf => {
      // Check if shelf contains Shorts by looking for reel items or Shorts links
      const hasReelItems = shelf.querySelector('ytd-reel-item-renderer') !== null;
      const hasShortsLinks = shelf.querySelector('[href^="/shorts/"]') !== null;
      const titleHasShorts = shelf.querySelector('#title')?.textContent.toLowerCase().includes('shorts');
      
      if (hasReelItems || hasShortsLinks || titleHasShorts) {
        if (!shelf.hasAttribute('data-lockedin-hidden')) {
          shelf.setAttribute('hidden', '');
          shelf.setAttribute('data-lockedin-hidden', 'shorts-search');
        }
      }
    });
  });

  // 2. Hide individual video renderers containing Shorts links in SEARCH ONLY
  const videoRendererSelectors = [
    'ytd-video-renderer',           // Search results, list view
    'ytd-reel-item-renderer'        // Reel items
  ];
  
  videoRendererSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(video => {
      const shortsLink = video.querySelector('[href^="/shorts/"]');
      
      if (shortsLink && !video.hasAttribute('data-lockedin-hidden')) {
        video.setAttribute('hidden', '');
        video.setAttribute('data-lockedin-hidden', 'shorts-search');
        
        // Check if parent container should be hidden (if all siblings are hidden)
        hideContainerIfAllChildrenHiddenSearch(video);
      }
    });
  });

  // 3. Hide by SHORTS overlay badge in search
  document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]').forEach(overlay => {
    const container = overlay.closest('ytd-video-renderer');
    
    if (container && !container.hasAttribute('data-lockedin-hidden')) {
      container.setAttribute('hidden', '');
      container.setAttribute('data-lockedin-hidden', 'shorts-search');
      hideContainerIfAllChildrenHiddenSearch(container);
    }
  });

  // 4. Hide Shorts filter chips/tabs on search page
  document.querySelectorAll('yt-chip-cloud-chip-renderer').forEach(chip => {
    const text = chip.textContent.toLowerCase();
    if ((text.includes('shorts') || text.includes('short')) && !chip.hasAttribute('data-lockedin-hidden')) {
      chip.setAttribute('hidden', '');
      chip.setAttribute('data-lockedin-hidden', 'shorts-search');
    }
  });
}

// Helper function for homepage Shorts hiding
function hideContainerIfAllChildrenHiddenHomepage(element) {
  const parent = element.parentElement;
  if (!parent) return;
  
  // Check if all siblings are hidden
  let allHidden = true;
  for (let i = 0; i < parent.children.length; i++) {
    if (!parent.children[i].hasAttribute('hidden')) {
      allHidden = false;
      break;
    }
  }
  
  // If all children are hidden, hide the container too
  if (allHidden) {
    const containerSelectors = [
      'ytd-item-section-renderer',
      'ytd-shelf-renderer',
      'ytd-rich-grid-row'
    ];
    
    for (const selector of containerSelectors) {
      const container = element.closest(selector);
      if (container && !container.hasAttribute('data-lockedin-hidden')) {
        container.setAttribute('hidden', '');
        container.setAttribute('data-lockedin-hidden', 'shorts-homepage');
        break;
      }
    }
  }
}

// Helper function for search Shorts hiding
function hideContainerIfAllChildrenHiddenSearch(element) {
  const parent = element.parentElement;
  if (!parent) return;
  
  // Check if all siblings are hidden
  let allHidden = true;
  for (let i = 0; i < parent.children.length; i++) {
    if (!parent.children[i].hasAttribute('hidden')) {
      allHidden = false;
      break;
    }
  }
  
  // If all children are hidden, hide the container too
  if (allHidden) {
    const containerSelectors = [
      'ytd-item-section-renderer',
      'ytd-shelf-renderer'
    ];
    
    for (const selector of containerSelectors) {
      const container = element.closest(selector);
      if (container && !container.hasAttribute('data-lockedin-hidden')) {
        container.setAttribute('hidden', '');
        container.setAttribute('data-lockedin-hidden', 'shorts-search');
        break;
      }
    }
  }
}

// ===== GLOBAL SHORTS HIDING =====
function hideShortsGlobally(shouldHide) {
  if (!shouldHide) {
    // Restore all globally hidden Shorts elements
    document.querySelectorAll('[data-lockedin-hidden="shorts-global"]').forEach(el => {
      el.removeAttribute('hidden');
      el.style.display = '';
      el.removeAttribute('data-lockedin-hidden');
    });
    return;
  }

  // 1. Hide Shorts tab in sidebar (guide) - both expanded and collapsed
  const guideShortsSelectors = [
    'ytd-guide-entry-renderer a[href="/shorts"]',
    'ytd-guide-entry-renderer a[title="Shorts"]',
    'ytd-mini-guide-entry-renderer a[href="/shorts"]',
    'ytd-mini-guide-entry-renderer a[title="Shorts"]',
    // Mobile
    'ytm-pivot-bar-item-renderer a[href="/shorts"]'
  ];
  
  guideShortsSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(link => {
      const container = link.closest('ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer, ytm-pivot-bar-item-renderer');
      if (container && !container.hasAttribute('data-lockedin-hidden')) {
        container.setAttribute('hidden', '');
        container.setAttribute('data-lockedin-hidden', 'shorts-global');
      }
    });
  });

  // 2. Hide Shorts shelves/carousels everywhere
  const shelfSelectors = [
    'ytd-reel-shelf-renderer',
    'ytd-rich-shelf-renderer',
    'ytd-rich-section-renderer',
    'grid-shelf-view-model',
    // Mobile
    'ytm-reel-shelf-renderer'
  ];
  
  shelfSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(shelf => {
      const hasReelItems = shelf.querySelector('ytd-reel-item-renderer, ytm-shorts-lockup-view-model') !== null;
      const hasShortsLinks = shelf.querySelector('[href^="/shorts/"]') !== null;
      const titleHasShorts = shelf.querySelector('#title, .title')?.textContent?.toLowerCase().includes('shorts');
      
      if (hasReelItems || hasShortsLinks || titleHasShorts) {
        if (!shelf.hasAttribute('data-lockedin-hidden')) {
          shelf.setAttribute('hidden', '');
          shelf.setAttribute('data-lockedin-hidden', 'shorts-global');
        }
      }
    });
  });

  // 3. Hide ALL video renderers containing Shorts links (everywhere)
  const videoRendererSelectors = [
    'ytd-rich-item-renderer',           // Homepage grid
    'ytd-video-renderer',               // Search results, list view
    'ytd-grid-video-renderer',          // Grid view
    'ytd-compact-video-renderer',       // Sidebar recommendations
    'ytd-reel-item-renderer',           // Reel items
    // Mobile
    'ytm-shorts-lockup-view-model',
    'ytm-shorts-lockup-view-model-v2',
    'ytm-video-with-context-renderer'
  ];
  
  videoRendererSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(video => {
      const shortsLink = video.querySelector('[href^="/shorts/"]');
      const shortsOverlay = video.querySelector('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]');
      
      if ((shortsLink || shortsOverlay) && !video.hasAttribute('data-lockedin-hidden')) {
        video.setAttribute('hidden', '');
        video.setAttribute('data-lockedin-hidden', 'shorts-global');
      }
    });
  });

  // 4. Hide Shorts in sidebar recommendations (watch page)
  document.querySelectorAll('#secondary ytd-compact-video-renderer, #related ytd-compact-video-renderer').forEach(video => {
    const shortsLink = video.querySelector('[href^="/shorts/"]');
    const shortsOverlay = video.querySelector('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]');
    
    if ((shortsLink || shortsOverlay) && !video.hasAttribute('data-lockedin-hidden')) {
      video.setAttribute('hidden', '');
      video.setAttribute('data-lockedin-hidden', 'shorts-global');
    }
  });

  // 5. Hide Shorts filter chips on search page
  document.querySelectorAll('yt-chip-cloud-chip-renderer').forEach(chip => {
    const text = chip.textContent?.toLowerCase() || '';
    const title = chip.querySelector('[title]')?.getAttribute('title')?.toLowerCase() || '';
    if ((text.includes('shorts') || text.includes('short') || title.includes('shorts')) && !chip.hasAttribute('data-lockedin-hidden')) {
      chip.setAttribute('hidden', '');
      chip.setAttribute('data-lockedin-hidden', 'shorts-global');
    }
  });

  // 6. Hide Shorts on subscriptions page
  document.querySelectorAll('ytd-grid-video-renderer, ytd-expanded-shelf-contents-renderer').forEach(video => {
    const shortsLink = video.querySelector('[href^="/shorts/"]');
    const shortsOverlay = video.querySelector('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]');
    
    if ((shortsLink || shortsOverlay) && !video.hasAttribute('data-lockedin-hidden')) {
      video.setAttribute('hidden', '');
      video.setAttribute('data-lockedin-hidden', 'shorts-global');
    }
  });

  // 7. Hide Shorts on channel pages
  document.querySelectorAll('ytd-rich-item-renderer, ytd-grid-video-renderer').forEach(video => {
    const shortsLink = video.querySelector('[href^="/shorts/"]');
    const shortsOverlay = video.querySelector('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]');
    
    if ((shortsLink || shortsOverlay) && !video.hasAttribute('data-lockedin-hidden')) {
      video.setAttribute('hidden', '');
      video.setAttribute('data-lockedin-hidden', 'shorts-global');
    }
  });
}

// ===== REDIRECT SHORTS TO REGULAR VIDEO PLAYER =====
function redirectShorts(shouldRedirect) {
  if (!shouldRedirect) return;
  
  // Only redirect if currently on a /shorts/ page
  if (window.location.pathname.startsWith('/shorts/')) {
    const videoId = window.location.pathname.split('/shorts/')[1]?.split('?')[0]?.split('/')[0];
    if (videoId && videoId.length === 11) {
      // Preserve any query parameters
      const searchParams = new URLSearchParams(window.location.search);
      const newUrl = `https://www.youtube.com/watch?v=${videoId}${searchParams.toString() ? '&' + searchParams.toString() : ''}`;
      
      // Use replace to avoid adding to browser history
      window.location.replace(newUrl);
    }
  }
}

// ===== HIDE END CARDS FOR SHORTS IN VIDEO PLAYER =====
// When a Short is played in the traditional video player, hide end screen cards
// Only hides for short videos (under 60 seconds), not traditional long videos
function hideEndCardsForShortsInPlayer(shouldHide) {
  // Clean up existing observer
  if (window._lockedinShortsEndCardObserver) {
    window._lockedinShortsEndCardObserver.disconnect();
    window._lockedinShortsEndCardObserver = null;
  }
  
  if (!shouldHide) return;
  
  // Check if we're on a watch page
  if (!window.location.pathname.startsWith('/watch')) return;
  
  // Function to check if current video is a Short (under 60 seconds)
  const isShortVideo = () => {
    // Method 1: Check video element duration
    const video = document.querySelector('video.html5-main-video, video');
    if (video && video.duration && !isNaN(video.duration)) {
      return video.duration <= 60;
    }
    
    // Method 2: Check the time display in player
    const timeDisplay = document.querySelector('.ytp-time-duration');
    if (timeDisplay) {
      const timeText = timeDisplay.textContent;
      // Parse time like "0:45" or "1:00"
      const parts = timeText.split(':');
      if (parts.length === 2) {
        const minutes = parseInt(parts[0], 10);
        const seconds = parseInt(parts[1], 10);
        const totalSeconds = minutes * 60 + seconds;
        return totalSeconds <= 60;
      }
    }
    
    return false;
  };
  
  // Hide all end screen elements for shorts played as regular videos
  const hideEndScreenElements = () => {
    // Only hide if it's a short video
    if (!isShortVideo()) return;
    
    // Hide end screen cards
    document.querySelectorAll('.ytp-ce-element, .ytp-ce-video, .ytp-ce-playlist, .ytp-ce-channel, .ytp-ce-website').forEach(el => {
      el.style.display = 'none';
    });
    
    // Hide end screen overlay
    document.querySelectorAll('.ytp-ce-covering-overlay, .ytp-ce-shadow').forEach(el => {
      el.style.display = 'none';
    });
    
    // Hide end screen content container
    document.querySelectorAll('.ytp-endscreen-content, .html5-endscreen').forEach(el => {
      el.style.display = 'none';
      el.style.visibility = 'hidden';
      el.style.opacity = '0';
    });
    
    // Hide video wall suggestions
    document.querySelectorAll('.ytp-videowall-still, .ytp-videowall-still-image, .videowall-endscreen').forEach(el => {
      el.style.display = 'none';
    });
    
    // Hide autoplay/up-next elements
    document.querySelectorAll('.ytp-autonav-endscreen, .ytp-autonav-endscreen-upnext-container, .ytp-suggestion-set').forEach(el => {
      el.style.display = 'none';
    });
  };
  
  // Wait for video metadata to load before checking duration
  const video = document.querySelector('video.html5-main-video, video');
  if (video) {
    // Check when video metadata loads
    video.addEventListener('loadedmetadata', hideEndScreenElements);
    // Also check when duration changes (for SPA navigation)
    video.addEventListener('durationchange', hideEndScreenElements);
  }
  
  // Run after a short delay to let video load
  setTimeout(hideEndScreenElements, 1000);
  setTimeout(hideEndScreenElements, 2000);
  
  // Also observe for dynamically added end screen elements
  const player = document.querySelector('#movie_player, .html5-video-player');
  if (player) {
    const observer = new MutationObserver(() => {
      hideEndScreenElements();
    });
    
    observer.observe(player, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    
    // Store observer reference for cleanup
    window._lockedinShortsEndCardObserver = observer;
  }
}

// ===== INTERCEPT SHORTS LINKS =====
// This intercepts clicks on Shorts links and redirects them to regular video player
function setupShortsLinkInterception(shouldIntercept) {
  const interceptHandler = (event) => {
    // Find the closest anchor tag
    const link = event.target.closest('a[href^="/shorts/"]');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (href && href.startsWith('/shorts/')) {
      event.preventDefault();
      event.stopPropagation();
      
      const videoId = href.split('/shorts/')[1]?.split('?')[0]?.split('/')[0];
      if (videoId && videoId.length === 11) {
        window.location.href = `https://www.youtube.com/watch?v=${videoId}`;
      }
    }
  };
  
  // Remove existing listener if any
  document.removeEventListener('click', window._lockedinShortsInterceptHandler, true);
  
  if (shouldIntercept) {
    window._lockedinShortsInterceptHandler = interceptHandler;
    document.addEventListener('click', interceptHandler, true);
  }
}

function runAll() {
  // Add error handling to prevent extension from breaking
  browser.storage.sync.get(null).then((settings) => {
    // Merge with defaults to ensure all settings exist
    const currentSettings = { ...DEFAULT_SETTINGS, ...settings };
    latestSyncedSettings = currentSettings;
    observeGuideContainers();
    updateGuideVisibility();
    
    // Check if extension is enabled
    if (!currentSettings.extensionEnabled) {
      // Restore all elements if extension is disabled
      restoreAllElements();
      setInstantHiding(false, false, false); // Disable CSS hiding for homepage, search, and global
      return;
    }
    
    // Enable/disable instant CSS hiding based on hideShorts settings
    // Global takes precedence over individual settings
    setInstantHiding(currentSettings.hideShortsHomepage, currentSettings.hideShortsSearch, currentSettings.hideShortsGlobally);
    
    // YouTube Shorts group - handle redirects first
    redirectShorts(currentSettings.redirectShorts);
    setupShortsLinkInterception(currentSettings.redirectShorts);
    // Hide end cards when shorts are played in traditional video player
    hideEndCardsForShortsInPlayer(currentSettings.redirectShorts);
    
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
    // Only apply individual Shorts hiding if global is not enabled
    if (!currentSettings.hideShortsGlobally) {
      hideShortsHomepage(currentSettings.hideShortsHomepage);
    }
    hideCommunityPosts(currentSettings.hideCommunityPosts);
    
    // Video Page group
    hideSidebar(currentSettings.hideSidebar);
    hidePlaylists(currentSettings.hidePlaylists);
    hideLiveChat(currentSettings.hideLiveChat);
    hideEndCards(currentSettings.hideEndCards);
    hideComments(currentSettings.hideComments);
    disableAutoplay(currentSettings.disableAutoplay);
    
    // Search Results group
    hideSearchRecommended(currentSettings.hideSearchRecommended);
    // Only apply individual Shorts hiding if global is not enabled
    if (!currentSettings.hideShortsGlobally) {
      hideShortsSearch(currentSettings.hideShortsSearch);
    }
    
    // YouTube Sidebar group
    hideExplore(currentSettings.hideExplore);
    hideMoreFromYT(currentSettings.hideMoreFromYT);
    
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
    hideShortsGlobally(currentSettings.hideShortsGlobally);
    
    redirectToSubscriptions(currentSettings.hideFeed && currentSettings.redirectToSubs);
    hideFeed(currentSettings.hideFeed);
    if (!currentSettings.hideShortsGlobally) {
      hideShortsHomepage(currentSettings.hideShortsHomepage);
    }
    hideCommunityPosts(currentSettings.hideCommunityPosts);
    
    hideSidebar(currentSettings.hideSidebar);
    hidePlaylists(currentSettings.hidePlaylists);
    hideLiveChat(currentSettings.hideLiveChat);
    hideEndCards(currentSettings.hideEndCards);
    hideComments(currentSettings.hideComments);
    disableAutoplay(currentSettings.disableAutoplay);
    
    hideSearchRecommended(currentSettings.hideSearchRecommended);
    if (!currentSettings.hideShortsGlobally) {
      hideShortsSearch(currentSettings.hideShortsSearch);
    }
    
    hideExplore(currentSettings.hideExplore);
    hideMoreFromYT(currentSettings.hideMoreFromYT);
    updateGuideVisibility();
  });
}

function restoreAllElements() {
  // Restore all hidden elements when extension is disabled
  setInstantHiding(false, false, false); // Disable CSS hiding for homepage, search, and global
  hideFeed(false);
  hideShortsHomepage(false);
  hideCommunityPosts(false);
  hideShortsGlobally(false);
  setupShortsLinkInterception(false);
  
  hideSidebar(false);
  hidePlaylists(false);
  hideLiveChat(false);
  hideEndCards(false);
  hideComments(false);
  disableAutoplay(false);
  
  hideSearchRecommended(false);
  hideShortsSearch(false);
  
  hideExplore(false);
  hideMoreFromYT(false);
  updateGuideVisibility();
}

function ensureEssentialElementsVisible() {
  const player = document.querySelector('#movie_player, .html5-video-player');
  if (player) {
    player.style.display = '';
  }
  
  const primaryContainer = document.querySelector('#primary, #primary-inner');
  if (primaryContainer) {
    primaryContainer.style.display = '';
  }
  
  const searchResults = document.querySelector('#contents');
  if (searchResults) {
    searchResults.style.display = '';
  }
  
  document.querySelectorAll('ytd-video-renderer, ytd-channel-renderer, ytd-playlist-renderer').forEach(result => {
    if (window.location.href.includes('/results?search_query=')) {
      result.style.display = '';
    }
  });
  
  if (window.location.href.includes('/results?search_query=')) {
    const gridRenderer = document.querySelector('ytd-rich-grid-renderer');
    if (gridRenderer) {
      gridRenderer.style.display = '';
    }
  }
  
  const videoInfo = document.querySelector('#above-the-fold, #info, #meta');
  if (videoInfo) {
    videoInfo.style.display = '';
  }
}

// ===== INITIALIZE INSTANT HIDING ON LOAD =====
// Load settings and set instant hiding CSS immediately
browser.storage.sync.get(null).then((settings) => {
  const currentSettings = { ...DEFAULT_SETTINGS, ...settings };
  latestSyncedSettings = currentSettings;
  if (currentSettings.extensionEnabled) {
    setInstantHiding(currentSettings.hideShortsHomepage, currentSettings.hideShortsSearch, currentSettings.hideShortsGlobally);
  }
  updateGuideVisibility();
}).catch(() => {
  // Use defaults if storage fails
  latestSyncedSettings = { ...DEFAULT_SETTINGS };
  setInstantHiding(DEFAULT_SETTINGS.hideShortsHomepage, DEFAULT_SETTINGS.hideShortsSearch, DEFAULT_SETTINGS.hideShortsGlobally);
  updateGuideVisibility();
});

// ===== RUN ON PAGE LOAD =====
runAll();

// Run immediately on URL changes (for navigation between pages)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    // Reset page-specific tracking flags
    autoplayDisabledThisPage = false;
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

// ===== LISTEN FOR SETTINGS CHANGES =====
browser.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') {
    return;
  }

  let redirectChanged = false;
  let shortsChanged = false;

  Object.keys(changes).forEach((key) => {
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
  });

  if (latestSyncedSettings.extensionEnabled !== false && redirectChanged) {
    applyRedirectStateFromCache();
  }

  if (latestSyncedSettings.extensionEnabled !== false && shortsChanged) {
    applyInstantShortsCssFromCache();
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
