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
  if (!shouldHide) {
    toggleElement('ytd-rich-grid-renderer', false);
    return;
  }
  
  if (window.location.pathname === '/' || window.location.pathname === '/home') {
    toggleElement('ytd-rich-grid-renderer', shouldHide);
  } else {
    toggleElement('ytd-rich-grid-renderer', false);
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
  const displayStyle = shouldHide ? 'none' : '';

  const shortsLink = document.querySelector('a[title="Shorts"]');
  if (shortsLink) shortsLink.style.display = displayStyle;

  document.querySelectorAll('ytd-video-renderer, ytd-rich-item-renderer, ytd-grid-video-renderer').forEach(video => {
    const shortsIndicator = video.querySelector('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]');
    const link = video.querySelector('a#thumbnail');
    if (shortsIndicator || (link && link.href.includes('/shorts/'))) {
      const parentElement = video.closest('ytd-rich-item-renderer') || video;
      parentElement.style.display = displayStyle;
    }
  });
  
  if (window.location.href.includes('/results?search_query=')) {
    document.querySelectorAll('ytd-video-renderer').forEach(videoResult => {
      const thumbnail = videoResult.querySelector('a#thumbnail');
      const shortsOverlay = videoResult.querySelector('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]');
      const durationBadge = videoResult.querySelector('#duration-text');
      
      if (shortsOverlay || 
          (thumbnail && thumbnail.href.includes('/shorts/')) ||
          (durationBadge && durationBadge.textContent.includes('#Shorts'))) {
        videoResult.style.display = displayStyle;
      }
    });
  }
  
  document.querySelectorAll('ytd-rich-shelf-renderer, ytd-reel-shelf-renderer').forEach(shelf => {
    const titleElement = shelf.querySelector('#title');
    if (titleElement && titleElement.innerText.toLowerCase().includes('shorts')) {
      shelf.style.display = displayStyle;
    }
  });
  
  document.querySelectorAll('ytd-reel-shelf-renderer').forEach(reelShelf => {
    reelShelf.style.display = displayStyle;
  });
  
  document.querySelectorAll('[href*="/shorts/"]').forEach(shortLink => {
    const videoContainer = shortLink.closest('ytd-video-renderer, ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer');
    if (videoContainer) {
      videoContainer.style.display = displayStyle;
    }
  });
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
  browser.storage.sync.get(null).then((settings) => {
    hideFeed(settings.hideFeed ?? true);
    hideSidebar(settings.hideSidebar ?? true);
    hideLiveChat(settings.hideLiveChat ?? true);
    hideEndCards(settings.hideEndCards ?? true);
    hideExplore(settings.hideExplore ?? true);
    hideShorts(settings.hideShorts ?? true);
    disableAutoplay(settings.disableAutoplay ?? true);
    
    ensureEssentialElementsVisible();
  });
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
  
  const comments = document.querySelector('#comments, ytd-comments');
  if (comments) {
    comments.style.display = '';
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

runAll();

const observer = new MutationObserver(runAll);
observer.observe(document.body, { childList: true, subtree: true });

browser.storage.onChanged.addListener(runAll);