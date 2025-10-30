// ===== CROSS-BROWSER COMPATIBILITY =====
// Support both Firefox (browser) and Chromium-based browsers (chrome)
if (typeof browser === 'undefined') {
  var browser = chrome;
}

// ===== INSTANT HIDING WITH CSS =====
// Inject CSS to hide Shorts immediately, before JavaScript detection
const instantHideStyle = document.createElement('style');
instantHideStyle.id = 'lockedin-instant-hide';
instantHideStyle.textContent = `
  /* Hide Shorts shelf containers instantly */
  ytd-reel-shelf-renderer:not([data-lockedin-hidden]),
  ytd-rich-shelf-renderer:has([href^="/shorts/"]):not([data-lockedin-hidden]),
  grid-shelf-view-model:not([data-lockedin-hidden]),
  ytd-rich-section-renderer:has([href^="/shorts/"]):not([data-lockedin-hidden]) {
    display: none;
  }
  
  /* Hide video renderers that link to Shorts */
  ytd-video-renderer:has([href^="/shorts/"]):not([data-lockedin-hidden]),
  ytd-rich-item-renderer:has([href^="/shorts/"]):not([data-lockedin-hidden]),
  ytd-grid-video-renderer:has([href^="/shorts/"]):not([data-lockedin-hidden]),
  ytd-compact-video-renderer:has([href^="/shorts/"]):not([data-lockedin-hidden]),
  ytd-reel-item-renderer:not([data-lockedin-hidden]) {
    display: none;
  }
  
  /* Hide Shorts tab in sidebar */
  ytd-guide-entry-renderer:has(a[href="/shorts"]):not([data-lockedin-hidden]),
  ytd-mini-guide-entry-renderer:has(a[href="/shorts"]):not([data-lockedin-hidden]) {
    display: none;
  }
  
  /* Hide Shorts overlay badge items */
  ytd-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]):not([data-lockedin-hidden]),
  ytd-rich-item-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]):not([data-lockedin-hidden]),
  ytd-grid-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]):not([data-lockedin-hidden]),
  ytd-compact-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]):not([data-lockedin-hidden]) {
    display: none;
  }
`;

// Inject the style immediately (before anything loads)
(document.head || document.documentElement).appendChild(instantHideStyle);

// Function to enable/disable instant CSS hiding
function setInstantHiding(enabled) {
  if (enabled) {
    if (!document.getElementById('lockedin-instant-hide')) {
      (document.head || document.documentElement).appendChild(instantHideStyle);
    }
  } else {
    const style = document.getElementById('lockedin-instant-hide');
    if (style) {
      style.remove();
    }
  }
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
  hideSidebar: false,
  hideLiveChat: false,
  hideEndCards: false,
  hideExplore: false,
  hideShorts: false,
  disableAutoplay: false,
  extensionEnabled: true
};

// ===== INITIALIZE SETTINGS ON INSTALL =====
// This fixes the race condition - ensures settings exist before content script runs
browser.storage.sync.get(null).then((settings) => {
  // If no settings exist, initialize with defaults
  if (Object.keys(settings).length === 0) {
    browser.storage.sync.set(DEFAULT_SETTINGS).catch((error) => {
      console.error('LockedIn: Failed to initialize settings', error);
    });
  }
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

function hideFeed(shouldHide) {
  const feedElement = document.querySelector('ytd-rich-grid-renderer');
  const placeholderId = 'lockedin-feed-placeholder';
  
  if (!shouldHide) {
    if (feedElement) {
      feedElement.style.display = '';
      feedElement.removeAttribute('data-lockedin-hidden');
    }
    // Remove placeholder if it exists
    const placeholder = document.getElementById(placeholderId);
    if (placeholder) {
      placeholder.remove();
    }
    return;
  }
  
  // Only hide on homepage
  if (window.location.pathname === '/' || window.location.pathname === '/home') {
    if (feedElement && !feedElement.hasAttribute('data-lockedin-hidden')) {
      feedElement.style.display = 'none';
      feedElement.setAttribute('data-lockedin-hidden', 'feed');
      
      // Create and inject placeholder with random meme image
      if (!document.getElementById(placeholderId)) {
        const placeholder = document.createElement('div');
        placeholder.id = placeholderId;
        placeholder.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 99999;
          pointer-events: none;
        `;
        
        // List of available meme images
        const memeImages = ['meme1.png', 'meme2.png', 'meme3.png', 'meme4.png', 'meme5.png'];
        const randomMeme = memeImages[Math.floor(Math.random() * memeImages.length)];
        const imageUrl = browser.runtime.getURL('homepage/' + randomMeme);
        
        console.log('LockedIn: Loading meme from:', imageUrl);
        
        // Create image element
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Stay Focused!';
        img.style.cssText = 'max-width: 120px; max-height: 120px; box-shadow: 0 2px 10px rgba(0,0,0,0.3); display: block; image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges; filter: contrast(1.2) saturate(0.8);';
        
        img.onerror = function() {
          console.error('LockedIn: Failed to load meme image:', imageUrl);
          // Show a fallback emoji if image fails to load
          placeholder.innerHTML = '<div style="font-size: 50px;">🔒</div>';
        };
        
        img.onload = function() {
          console.log('LockedIn: Meme image loaded successfully');
        };
        
        placeholder.appendChild(img);
        document.body.appendChild(placeholder);
        console.log('LockedIn: Placeholder injected into body');
      }
    }
  } else {
    if (feedElement) {
      feedElement.style.display = '';
      feedElement.removeAttribute('data-lockedin-hidden');
    }
    // Remove placeholder if not on homepage
    const placeholder = document.getElementById(placeholderId);
    if (placeholder) {
      placeholder.remove();
    }
  }
}

function hideSidebar(shouldHide) {
  if (!window.location.href.includes('/watch?v=')) {
    return;
  }
  
  if (!shouldHide) {
    toggleElement('#secondary', false);
    toggleElement('#secondary-inner', false);
    
    toggleAllElements('ytd-watch-next-secondary-results-renderer', false);
    toggleAllElements('#related', false);
    toggleAllElements('.watch-sidebar', false);
    
    const theaterSidebar = document.querySelector('#secondary.ytd-watch-flexy');
    if (theaterSidebar) {
      theaterSidebar.style.display = '';
    }
    
    document.querySelectorAll('#secondary *').forEach(element => {
      element.style.display = '';
    });
    
    toggleAllElements('.ytp-upnext', false);
    toggleAllElements('.ytp-upnext-container', false);
    toggleAllElements('.ytp-videowall-still', false);
    toggleAllElements('.ytp-suggestion-set', false);
    
    const primary = document.querySelector('#primary');
    if (primary) {
      primary.style.marginRight = '';
      primary.style.width = '';
    }
    
    const flexyContainer = document.querySelector('ytd-watch-flexy');
    if (flexyContainer) {
      flexyContainer.style.removeProperty('--ytd-watch-flexy-sidebar-width');
    }
    
    return;
  }
  
  toggleElement('#secondary', true);
  toggleElement('#secondary-inner', true);
  
  toggleAllElements('ytd-watch-next-secondary-results-renderer', true);
  toggleAllElements('#related', true);
  toggleAllElements('.watch-sidebar', true);
  
  const theaterSidebar = document.querySelector('#secondary.ytd-watch-flexy');
  if (theaterSidebar) {
    theaterSidebar.style.display = 'none';
  }
  
  document.querySelectorAll('#secondary *').forEach(element => {
    element.style.display = 'none';
  });
  
  toggleAllElements('.ytp-upnext', true);
  toggleAllElements('.ytp-upnext-container', true);
  toggleAllElements('.ytp-videowall-still', true);
  toggleAllElements('.ytp-suggestion-set', true);
  toggleAllElements('.ytp-endscreen-content', true);
  
  document.querySelectorAll('.ytp-videowall-still').forEach(wall => {
    wall.style.display = 'none';
  });
  
  document.querySelectorAll('[class*="suggestion"]').forEach(suggestion => {
    if (suggestion.closest('.ytp-player')) {
      suggestion.style.display = 'none';
    }
  });
  
  const primary = document.querySelector('#primary');
  if (primary) {
    primary.style.marginRight = '0';
    primary.style.width = '100%';
  }
  
  const flexyContainer = document.querySelector('ytd-watch-flexy');
  if (flexyContainer) {
    flexyContainer.style.setProperty('--ytd-watch-flexy-sidebar-width', '0px', 'important');
  }
}

function hideLiveChat(shouldHide) {
  toggleElement('#chat', shouldHide);
}

function hideEndCards(shouldHide) {
  if (!shouldHide) {
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
    
    return;
  }
  
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

function hideShorts(shouldHide) {
  if (!shouldHide) {
    // Restore all Shorts elements
    document.querySelectorAll('[data-lockedin-hidden="shorts"]').forEach(el => {
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
        container.setAttribute('data-lockedin-hidden', 'shorts');
      }
    });
  });

  // 2. Hide Shorts shelves/carousels (dedicated Shorts containers)
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
          shelf.setAttribute('data-lockedin-hidden', 'shorts');
          // Rearrange grid if needed
          gridRearranger.execute(shelf);
        }
      }
    });
  });

  // 3. THE KEY METHOD: Hide individual video renderers containing Shorts links
  // This uses the proven method from hide-youtube-shorts extension
  const videoRendererSelectors = [
    'ytd-video-renderer',           // Search results, list view, subscription feed
    'ytd-rich-item-renderer',       // Home page, grid view
    'ytd-grid-video-renderer',      // Grid mode
    'ytd-compact-video-renderer',   // Sidebar recommendations
    'ytd-playlist-video-renderer',  // Playlist items
    'ytd-reel-item-renderer'        // Reel items
  ];
  
  videoRendererSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(video => {
      // Check if this video links to a Short using [href^="/shorts/"] (starts with)
      // This is the most reliable method used by hide-youtube-shorts extension
      const shortsLink = video.querySelector('[href^="/shorts/"]');
      
      if (shortsLink && !video.hasAttribute('data-lockedin-hidden')) {
        video.setAttribute('hidden', '');
        video.setAttribute('data-lockedin-hidden', 'shorts');
        
        // Rearrange grid if this is a grid item to prevent gaps
        gridRearranger.execute(video);
        
        // Check if parent container should be hidden (if all siblings are hidden)
        hideContainerIfAllChildrenHidden(video);
      }
    });
  });

  // 4. Hide by SHORTS overlay badge (backup method for videos without links yet)
  document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]').forEach(overlay => {
    const container = overlay.closest(
      'ytd-video-renderer, ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer'
    );
    
    if (container && !container.hasAttribute('data-lockedin-hidden')) {
      container.setAttribute('hidden', '');
      container.setAttribute('data-lockedin-hidden', 'shorts');
      hideContainerIfAllChildrenHidden(container);
    }
  });

  // 5. Hide Shorts filter chips/tabs
  document.querySelectorAll('yt-chip-cloud-chip-renderer').forEach(chip => {
    const text = chip.textContent.toLowerCase();
    if ((text.includes('shorts') || text.includes('short')) && !chip.hasAttribute('data-lockedin-hidden')) {
      chip.setAttribute('hidden', '');
      chip.setAttribute('data-lockedin-hidden', 'shorts');
    }
  });

  // 6. Hide "Shorts remixing this video" section
  document.querySelectorAll('[aria-label*="Shorts remixing"]').forEach(section => {
    if (!section.hasAttribute('data-lockedin-hidden')) {
      section.setAttribute('hidden', '');
      section.setAttribute('data-lockedin-hidden', 'shorts');
    }
  });

  // 7. Redirect if currently on /shorts page
  if (window.location.pathname.startsWith('/shorts/')) {
    const videoId = window.location.pathname.split('/shorts/')[1].split('?')[0];
    if (videoId) {
      window.location.href = `https://www.youtube.com/watch?v=${videoId}`;
    }
  }
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

// Helper function: Hide parent container if all children are hidden
function hideContainerIfAllChildrenHidden(element) {
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
        container.setAttribute('data-lockedin-hidden', 'shorts');
        break;
      }
    }
  }
}

function disableAutoplay(shouldDisable) {
  if (shouldDisable) {
    const autoplayButton = document.querySelector('button.ytp-autonav-toggle-button');
    if (autoplayButton && autoplayButton.getAttribute('aria-pressed') === 'true') {
      autoplayButton.click();
    }
  }
}

function runAll() {
  // Add error handling to prevent extension from breaking
  browser.storage.sync.get(null).then((settings) => {
    // Merge with defaults to ensure all settings exist
    const currentSettings = { ...DEFAULT_SETTINGS, ...settings };
    
    // Check if extension is enabled
    if (!currentSettings.extensionEnabled) {
      // Restore all elements if extension is disabled
      restoreAllElements();
      setInstantHiding(false); // Disable CSS hiding
      return;
    }
    
    // Enable/disable instant CSS hiding based on hideShorts setting
    setInstantHiding(currentSettings.hideShorts);
    
    // Apply all hiding rules
    hideFeed(currentSettings.hideFeed);
    hideSidebar(currentSettings.hideSidebar);
    hideLiveChat(currentSettings.hideLiveChat);
    hideEndCards(currentSettings.hideEndCards);
    hideExplore(currentSettings.hideExplore);
    hideShorts(currentSettings.hideShorts);
    disableAutoplay(currentSettings.disableAutoplay);
    
    ensureEssentialElementsVisible();
  }).catch((error) => {
    console.error('LockedIn: Failed to load settings', error);
    // Fallback: use default settings if storage fails
    const currentSettings = DEFAULT_SETTINGS;
    setInstantHiding(currentSettings.hideShorts);
    hideFeed(currentSettings.hideFeed);
    hideSidebar(currentSettings.hideSidebar);
    hideLiveChat(currentSettings.hideLiveChat);
    hideEndCards(currentSettings.hideEndCards);
    hideExplore(currentSettings.hideExplore);
    hideShorts(currentSettings.hideShorts);
    disableAutoplay(currentSettings.disableAutoplay);
  });
}

function restoreAllElements() {
  // Restore all hidden elements when extension is disabled
  setInstantHiding(false); // Disable CSS hiding
  hideFeed(false);
  hideSidebar(false);
  hideLiveChat(false);
  hideEndCards(false);
  hideExplore(false);
  hideShorts(false);
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

// ===== RUN ON PAGE LOAD =====
runAll();

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

// ===== LISTEN FOR SETTINGS CHANGES =====
browser.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync') {
    runAll();
  }
});
// ===== LISTEN FOR MESSAGES FROM POPUP =====
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'powerStateChanged') {
    // Immediately apply the power state change
    runAll();
  } else if (message.action === 'settingChanged') {
    // Handle individual setting changes
    runAll();
  }
});
