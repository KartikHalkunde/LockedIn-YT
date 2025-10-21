// A helper function to hide or show an element
function toggleElement(selector, shouldHide) {
  const element = document.querySelector(selector);
  if (element) {
    element.style.display = shouldHide ? 'none' : '';
  }
}

// A helper for multiple elements
function toggleAllElements(selector, shouldHide) {
  document.querySelectorAll(selector).forEach(el => {
    el.style.display = shouldHide ? 'none' : '';
  });
}

// 1. Hide Homepage Feed - TARGETED VERSION (preserves search results)
function hideFeed(shouldHide) {
  if (!shouldHide) {
    toggleElement('ytd-rich-grid-renderer', false);
    return;
  }
  
  // Only hide on homepage, not on search results or other pages
  if (window.location.pathname === '/' || window.location.pathname === '/home') {
    toggleElement('ytd-rich-grid-renderer', shouldHide);
  } else {
    // On other pages (like search), make sure the grid renderer is visible
    toggleElement('ytd-rich-grid-renderer', false);
  }
}

// 2. Hide Video Sidebar (Related/Up Next) - COMPLETE TOGGLE CONTROL + END SCREEN RECOMMENDATIONS
function hideSidebar(shouldHide) {
  // Only apply to video watch pages (not search results or homepage)
  if (!window.location.href.includes('/watch?v=')) {
    return;
  }
  
  if (!shouldHide) {
    // RESTORE SIDEBAR: When toggle is OFF, show everything normally
    toggleElement('#secondary', false);
    toggleElement('#secondary-inner', false);
    
    // Restore all secondary content containers
    toggleAllElements('ytd-watch-next-secondary-results-renderer', false);
    toggleAllElements('#related', false);
    toggleAllElements('.watch-sidebar', false);
    
    // Restore theater mode sidebar
    const theaterSidebar = document.querySelector('#secondary.ytd-watch-flexy');
    if (theaterSidebar) {
      theaterSidebar.style.display = '';
    }
    
    // Restore all elements inside the secondary container
    document.querySelectorAll('#secondary *').forEach(element => {
      element.style.display = '';
    });
    
    // RESTORE END-OF-VIDEO RECOMMENDATIONS
    toggleAllElements('.ytp-upnext', false);
    toggleAllElements('.ytp-upnext-container', false);
    toggleAllElements('.ytp-videowall-still', false);
    toggleAllElements('.ytp-suggestion-set', false);
    
    // Restore original layout
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
  
  // HIDE SIDEBAR: When toggle is ON, completely hide sidebar
  toggleElement('#secondary', true);
  toggleElement('#secondary-inner', true);
  
  // Hide all secondary content containers
  toggleAllElements('ytd-watch-next-secondary-results-renderer', true);
  toggleAllElements('#related', true);
  toggleAllElements('.watch-sidebar', true);
  
  // Theater mode specific - hide sidebar completely
  const theaterSidebar = document.querySelector('#secondary.ytd-watch-flexy');
  if (theaterSidebar) {
    theaterSidebar.style.display = 'none';
  }
  
  // Hide everything inside the secondary container
  document.querySelectorAll('#secondary *').forEach(element => {
    element.style.display = 'none';
  });
  
  // HIDE END-OF-VIDEO RECOMMENDATIONS
  toggleAllElements('.ytp-upnext', true);
  toggleAllElements('.ytp-upnext-container', true);
  toggleAllElements('.ytp-videowall-still', true);
  toggleAllElements('.ytp-suggestion-set', true);
  toggleAllElements('.ytp-endscreen-content', true);
  
  // Hide video wall that appears after video ends
  document.querySelectorAll('.ytp-videowall-still').forEach(wall => {
    wall.style.display = 'none';
  });
  
  // Hide suggestion overlays
  document.querySelectorAll('[class*="suggestion"]').forEach(suggestion => {
    if (suggestion.closest('.ytp-player')) {
      suggestion.style.display = 'none';
    }
  });
  
  // Adjust the main content area to use full width when sidebar is hidden
  const primary = document.querySelector('#primary');
  if (primary) {
    primary.style.marginRight = '0';
    primary.style.width = '100%';
  }
  
  // In theater mode, ensure the video takes full space
  const flexyContainer = document.querySelector('ytd-watch-flexy');
  if (flexyContainer) {
    flexyContainer.style.setProperty('--ytd-watch-flexy-sidebar-width', '0px', 'important');
  }
}

// 3. Hide Live Chat
function hideLiveChat(shouldHide) {
  toggleElement('#chat', shouldHide);
}

// 4. Hide End Screen Cards - COMPLETE TOGGLE CONTROL
function hideEndCards(shouldHide) {
  if (!shouldHide) {
    // RESTORE END SCREEN CARDS: When toggle is OFF, show all end screen elements
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
    
    // Restore endscreen content
    document.querySelectorAll('.ytp-endscreen-content').forEach(el => {
      el.style.display = '';
    });
    
    // Restore all endscreen-related elements
    document.querySelectorAll('[class*="endscreen"]').forEach(el => {
      el.style.display = '';
    });
    
    return;
  }
  
  // HIDE END SCREEN CARDS: When toggle is ON, hide all end screen elements
  toggleAllElements('.ytp-ce-element', true);
  toggleAllElements('.ytp-ce-video', true);
  toggleAllElements('.ytp-ce-playlist', true);
  toggleAllElements('.ytp-ce-channel', true);
  toggleAllElements('.ytp-ce-website', true);
  
  // Hide end screen overlays that appear over the video
  toggleAllElements('.ytp-ce-covering-overlay', true);
  toggleAllElements('.ytp-ce-shadow', true);
  toggleAllElements('.ytp-ce-size-1280', true);
  toggleAllElements('.ytp-ce-size-853', true);
  
  // Hide end screen video suggestions
  document.querySelectorAll('.ytp-endscreen-content').forEach(el => {
    el.style.display = 'none';
  });
  
  // Hide additional end screen elements
  toggleAllElements('.ytp-show-tiles', true);
  document.querySelectorAll('[class*="endscreen"]').forEach(el => {
    el.style.display = 'none';
  });
  
  // Hide any interactive end screen elements
  document.querySelectorAll('.ytp-ce-element-show').forEach(el => {
    el.style.display = 'none';
  });
}

// 5. Hide Explore and Trending
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

// 6. Hide Shorts (COMPREHENSIVE VERSION - includes search results)
function hideShorts(shouldHide) {
  const displayStyle = shouldHide ? 'none' : '';

  // 1. Hide the main sidebar link
  const shortsLink = document.querySelector('a[title="Shorts"]');
  if (shortsLink) shortsLink.style.display = displayStyle;

  // 2. Hide all video items that are explicitly Shorts (homepage, subscriptions, recommendations)
  document.querySelectorAll('ytd-video-renderer, ytd-rich-item-renderer, ytd-grid-video-renderer').forEach(video => {
    const shortsIndicator = video.querySelector('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]');
    const link = video.querySelector('a#thumbnail');
    if (shortsIndicator || (link && link.href.includes('/shorts/'))) {
      const parentElement = video.closest('ytd-rich-item-renderer') || video;
      parentElement.style.display = displayStyle;
    }
  });
  
  // 3. SEARCH RESULTS: Hide Shorts from search results specifically
  if (window.location.href.includes('/results?search_query=')) {
    document.querySelectorAll('ytd-video-renderer').forEach(videoResult => {
      const thumbnail = videoResult.querySelector('a#thumbnail');
      const shortsOverlay = videoResult.querySelector('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]');
      const durationBadge = videoResult.querySelector('#duration-text');
      
      // Multiple ways to detect Shorts in search results
      if (shortsOverlay || 
          (thumbnail && thumbnail.href.includes('/shorts/')) ||
          (durationBadge && durationBadge.textContent.includes('#Shorts'))) {
        videoResult.style.display = displayStyle;
      }
    });
  }
  
  // 4. Hide entire shelves/sections dedicated to Shorts
  document.querySelectorAll('ytd-rich-shelf-renderer, ytd-reel-shelf-renderer').forEach(shelf => {
    const titleElement = shelf.querySelector('#title');
    if (titleElement && titleElement.innerText.toLowerCase().includes('shorts')) {
      shelf.style.display = displayStyle;
    }
  });
  
  // 5. Hide Shorts shelf in any context
  document.querySelectorAll('ytd-reel-shelf-renderer').forEach(reelShelf => {
    reelShelf.style.display = displayStyle;
  });
  
  // 6. Hide individual short videos in any grid or list
  document.querySelectorAll('[href*="/shorts/"]').forEach(shortLink => {
    const videoContainer = shortLink.closest('ytd-video-renderer, ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer');
    if (videoContainer) {
      videoContainer.style.display = displayStyle;
    }
  });
}

// 7. Disable Autoplay
function disableAutoplay(shouldDisable) {
  if (shouldDisable) {
    const autoplayButton = document.querySelector('button.ytp-autonav-toggle-button');
    if (autoplayButton && autoplayButton.getAttribute('aria-pressed') === 'true') {
      autoplayButton.click();
    }
  }
}

// === MAIN FUNCTION ===
function runAll() {
  browser.storage.sync.get(null).then((settings) => {
    hideFeed(settings.hideFeed ?? true);
    hideSidebar(settings.hideSidebar ?? true);
    hideLiveChat(settings.hideLiveChat ?? true);
    hideEndCards(settings.hideEndCards ?? true);
    hideExplore(settings.hideExplore ?? true);
    hideShorts(settings.hideShorts ?? true);
    disableAutoplay(settings.disableAutoplay ?? true);
    
    // Ensure essential elements remain visible
    ensureEssentialElementsVisible();
  });
}

// Ensure comments, video player, and search functionality remain visible
function ensureEssentialElementsVisible() {
  // Ensure video player is visible
  const player = document.querySelector('#movie_player, .html5-video-player');
  if (player) {
    player.style.display = '';
  }
  
  // Ensure video container is visible
  const primaryContainer = document.querySelector('#primary, #primary-inner');
  if (primaryContainer) {
    primaryContainer.style.display = '';
  }
  
  // Ensure comments section is visible
  const comments = document.querySelector('#comments, ytd-comments');
  if (comments) {
    comments.style.display = '';
  }
  
  // Ensure search results are ALWAYS visible
  const searchResults = document.querySelector('#contents');
  if (searchResults) {
    searchResults.style.display = '';
  }
  
  // Ensure search result items are visible
  document.querySelectorAll('ytd-video-renderer, ytd-channel-renderer, ytd-playlist-renderer').forEach(result => {
    // Only make visible if we're on a search page
    if (window.location.href.includes('/results?search_query=')) {
      result.style.display = '';
    }
  });
  
  // Ensure rich grid renderer is visible on search pages
  if (window.location.href.includes('/results?search_query=')) {
    const gridRenderer = document.querySelector('ytd-rich-grid-renderer');
    if (gridRenderer) {
      gridRenderer.style.display = '';
    }
  }
  
  // Ensure video info (title, description, etc.) is visible
  const videoInfo = document.querySelector('#above-the-fold, #info, #meta');
  if (videoInfo) {
    videoInfo.style.display = '';
  }
}

// Run on initial load  
runAll();

// Rerun when the page structure changes (like navigating between videos)
const observer = new MutationObserver(runAll);
observer.observe(document.body, { childList: true, subtree: true });

// Rerun when settings are changed in the popup, which makes the toggles feel instant
browser.storage.onChanged.addListener(runAll);