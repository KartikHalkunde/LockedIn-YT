// ===== CROSS-BROWSER COMPATIBILITY =====
if (typeof browser === 'undefined') {
  var browser = chrome;
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
  hideRecommended: false,
  hideSidebarShorts: false,
  hideLiveChat: false,
  hideEndCards: false,
  hideComments: false,
  disableAutoplay: false,
  hideSearchRecommended: false,
  hideShortsSearch: false,
  hideExplore: false,
  hideMoreFromYT: false,
  hidePlaylists: false,
  extensionEnabled: true,
  lightMode: false,
  showStats: false,
  takeBreak: false,
  breakDuration: 5,
  customMeme: null
};

// Default stats structure
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

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  setupToggleListeners();
  setupPowerButton();
  setupMenuButton();
  setupFeedbackButton();
  setupSponsorButton();
  setupCustomMemeUpload();
  setupBreakTimer();
  displayVersion();
  loadStats();
});

// ===== VERSION DISPLAY =====
function displayVersion() {
  const manifest = browser.runtime.getManifest();
  const versionElement = document.querySelector('.version');
  if (versionElement) {
    versionElement.textContent = `v${manifest.version}`;
  }
}

// ===== MENU BUTTON (Hamburger) =====
function setupMenuButton() {
  const menuButton = document.getElementById('menuButton');
  const closeMenuButton = document.getElementById('closeMenuButton');
  const settingsMenu = document.getElementById('settingsMenu');

  menuButton.addEventListener('click', () => {
    settingsMenu.classList.add('open');
    // Trigger stats animation when menu opens
    triggerStatsAnimation();
  });

  closeMenuButton.addEventListener('click', () => {
    settingsMenu.classList.remove('open');
  });
}

// Trigger stats counter animation
function triggerStatsAnimation() {
  const statsSection = document.getElementById('statsSection');
  if (statsSection && statsSection.classList.contains('visible')) {
    browser.storage.local.get('stats', (result) => {
      const stats = { ...DEFAULT_STATS, ...result.stats };
      updateStatsDisplay(stats, true);
    });
  }
}

// ===== FEEDBACK BUTTON =====
function setupFeedbackButton() {
  const feedbackButton = document.getElementById('feedbackButton');
  const closeFeedbackButton = document.getElementById('closeFeedbackButton');
  const feedbackPage = document.getElementById('feedbackPage');

  if (feedbackButton && feedbackPage) {
    feedbackButton.addEventListener('click', () => {
      feedbackPage.classList.add('open');
    });
  }

  if (closeFeedbackButton && feedbackPage) {
    closeFeedbackButton.addEventListener('click', () => {
      feedbackPage.classList.remove('open');
    });
  }
}

// ===== SPONSOR BUTTON =====
function setupSponsorButton() {
  const sponsorButton = document.getElementById('sponsorButton');
  const closeSponsorButton = document.getElementById('closeSponsorButton');
  const sponsorPage = document.getElementById('sponsorPage');

  if (sponsorButton && sponsorPage) {
    sponsorButton.addEventListener('click', () => {
      sponsorPage.classList.add('open');
    });
  }

  if (closeSponsorButton && sponsorPage) {
    closeSponsorButton.addEventListener('click', () => {
      sponsorPage.classList.remove('open');
    });
  }
}

// ===== POWER BUTTON =====
function setupPowerButton() {
  const powerButton = document.getElementById('powerButton');
  
  // Check if break countdown needs to be started
  browser.storage.sync.get(['extensionEnabled', 'takeBreak', 'breakDuration', 'breakStartTime'], (result) => {
    const isEnabled = result.extensionEnabled !== undefined ? result.extensionEnabled : true;
    
    if (!isEnabled && result.breakStartTime && result.takeBreak) {
      startBreakCountdown(Number(result.breakStartTime), Number(result.breakDuration));
    }
  });
  
  powerButton.addEventListener('click', () => {
    browser.storage.sync.get(['extensionEnabled', 'takeBreak', 'breakDuration'], (result) => {
      const currentState = result.extensionEnabled !== undefined ? result.extensionEnabled : true;
      const newState = !currentState;
      
      const saveData = { extensionEnabled: newState };
      
      if (!newState && result.takeBreak) {
        saveData.breakStartTime = Date.now();
        startBreakCountdown(saveData.breakStartTime, Number(result.breakDuration));
      } else {
        saveData.breakStartTime = null;
      }
      
      browser.storage.sync.set(saveData, () => {
        if (browser.runtime.lastError) {
          console.error('LockedIn: Failed to save power state', browser.runtime.lastError);
          return;
        }
        
        updatePowerState(newState);
        
        browser.tabs.query({}, (tabs) => {
          tabs.forEach((tab) => {
            if (tab.url && tab.url.includes('youtube.com')) {
              browser.tabs.sendMessage(tab.id, {
                action: 'powerStateChanged',
                enabled: newState
              }).catch(() => {});
            }
          });
        });
      });
    });
  });
}

function updatePowerState(isEnabled) {
  const popupContainer = document.querySelector('.popup-container');
  const breakTimerText = document.getElementById('breakTimerText');
  const headerLogo = document.querySelector('.header-logo');
  const isLightMode = popupContainer.classList.contains('light-mode');
  
  if (isEnabled) {
    popupContainer.classList.remove('disabled');
    if (breakTimerText) breakTimerText.style.display = 'none';
    // Restore logo based on light mode
    if (headerLogo) {
      headerLogo.src = isLightMode ? '../icons/iconFullLight.png' : '../icons/iconFull.png';
    }
  } else {
    popupContainer.classList.add('disabled');
    // When disabled, use LockedOut logo (LightOff.png for light mode)
    if (headerLogo) {
      headerLogo.src = isLightMode ? '../icons/LightOff.png' : '../icons/LockedOut.png';
    }
  }
}

// ===== BREAK TIMER =====
let breakInterval = null;

function setupBreakTimer() {
  const breakTimeButtons = document.querySelectorAll('.break-time-btn');
  const getButtonDuration = (btn) => {
    if (btn.dataset.time) {
      const minutes = parseFloat(btn.dataset.time);
      return Number.isFinite(minutes) ? minutes : null;
    }
    if (btn.dataset.seconds) {
      const seconds = parseFloat(btn.dataset.seconds);
      return Number.isFinite(seconds) ? seconds / 60 : null;
    }
    return null;
  };
  
  browser.storage.sync.get('breakDuration', (result) => {
    const duration = typeof result.breakDuration === 'number' ? result.breakDuration : 5;
    breakTimeButtons.forEach(btn => {
      const btnDuration = getButtonDuration(btn);
      if (btnDuration !== null && Math.abs(btnDuration - duration) < 0.001) {
        btn.classList.add('selected');
      }
    });
  });
  
  breakTimeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      breakTimeButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      
      const duration = getButtonDuration(btn) ?? 5;
      browser.storage.sync.set({ breakDuration: duration });
    });
  });
}

function startBreakCountdown(startTime, duration) {
  const breakTimerText = document.getElementById('breakTimerText');
  if (!breakTimerText) return;
  
  breakTimerText.style.display = 'block';
  
  if (breakInterval) clearInterval(breakInterval);
  const normalizedDuration = Number(duration);
  const fallbackDuration = Number.isFinite(normalizedDuration) && normalizedDuration > 0 ? normalizedDuration : 5;
  let normalizedStart = Number(startTime);
  const now = Date.now();
  if (!Number.isFinite(normalizedStart) || normalizedStart <= 0) {
    normalizedStart = now;
    browser.storage.sync.set({ breakStartTime: normalizedStart });
  }
  const endTime = normalizedStart + (fallbackDuration * 60 * 1000);
  
  function updateTimer() {
    const currentTime = Date.now();
    const remaining = Math.max(0, endTime - currentTime);
    const totalSeconds = Math.floor(remaining / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    if (remaining <= 0) {
      clearInterval(breakInterval);
      breakTimerText.textContent = 'Back in 0:00';
      breakTimerText.style.display = 'none';
      updatePowerState(true);
      browser.runtime.sendMessage({ action: 'completeBreak' }).catch(() => {
        browser.storage.sync.set({ extensionEnabled: true, breakStartTime: null });
      });
      return;
    }
    
    breakTimerText.textContent = `Back in ${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  
  updateTimer();
  breakInterval = setInterval(updateTimer, 1000);
}

// ===== CUSTOM MEME UPLOAD =====
function setupCustomMemeUpload() {
  const fileInput = document.getElementById('customMemeInput');
  const gallery = document.getElementById('customMemeGallery');
  
  if (!fileInput || !gallery) {
    console.error('LockedIn: Custom meme elements not found');
    return;
  }
  
  if (fileInput.disabled || fileInput.dataset.disabled === 'true') {
    console.info('LockedIn: Custom meme upload is disabled (coming soon)');
    return;
  }
  
  console.log('LockedIn: Custom meme upload initialized');
  
  // Render gallery function - defined first so it's available everywhere
  function renderGallery(memes) {
    console.log('LockedIn: Rendering gallery with', memes ? memes.length : 0, 'images');
    gallery.innerHTML = '';
    
    if (!memes || memes.length === 0) {
      gallery.classList.remove('visible');
      return;
    }
    
    gallery.classList.add('visible');
    
    memes.forEach((meme, index) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      
      const img = document.createElement('img');
      img.src = meme;
      img.alt = `Custom image ${index + 1}`;
      img.addEventListener('click', () => {
        window.open(meme, '_blank');
      });
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'gallery-delete-btn';
      deleteBtn.innerHTML = '✕';
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteMeme(index);
      });
      
      item.appendChild(img);
      item.appendChild(deleteBtn);
      gallery.appendChild(item);
    });
    console.log('LockedIn: Gallery rendered, visible class:', gallery.classList.contains('visible'));
  }

  function readFilesAsDataUrls(files) {
    // Resolve each file to a data URL while gracefully handling read failures
    return Promise.all(files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          console.log('LockedIn: File read complete:', file.name);
          resolve(event.target.result);
        };
        reader.onerror = (error) => {
          console.error('LockedIn: Error reading file:', file.name, error);
          resolve(null);
        };
        reader.readAsDataURL(file);
      });
    }));
  }
  
  function deleteMeme(index) {
    browser.storage.local.get('customMemes', (result) => {
      const memes = result.customMemes || [];
      memes.splice(index, 1);
      
      if (memes.length === 0) {
        browser.storage.local.remove('customMemes', () => {
          renderGallery([]);
          notifyContentScript(null);
        });
      } else {
        browser.storage.local.set({ customMemes: memes }, () => {
          if (browser.runtime.lastError) {
            console.error('LockedIn: Failed to update memes:', browser.runtime.lastError);
            alert('Unable to update custom images. Please try again.');
            return;
          }
          renderGallery(memes);
          notifyContentScript(memes);
        });
      }
    });
  }
  
  function notifyContentScript(memes) {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        browser.tabs.sendMessage(tabs[0].id, {
          action: 'customMemesUpdated',
          memes: memes
        }).catch(() => {});
      }
    });
  }
  
  // Load existing custom memes
  browser.storage.local.get('customMemes', (result) => {
    console.log('LockedIn: Loaded existing memes:', result.customMemes ? result.customMemes.length : 0);
    if (result.customMemes && result.customMemes.length > 0) {
      renderGallery(result.customMemes);
    }
  });
  
  // File input change handler
  fileInput.addEventListener('change', function(e) {
    console.log('LockedIn: File input changed');
    const files = Array.from(e.target.files);
    console.log('LockedIn: Selected files:', files.length);
    
    if (!files.length) {
      console.log('LockedIn: No files selected');
      return;
    }
    
    // Get existing memes first
    browser.storage.local.get('customMemes', (result) => {
      const existingMemes = result.customMemes || [];
      console.log('LockedIn: Existing memes:', existingMemes.length);
      
      const validTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
      const validFiles = [];
      
      for (const file of files) {
        console.log('LockedIn: Checking file:', file.name, 'size:', file.size, 'type:', file.type);
        if (file.size > 500 * 1024) {
          alert(`File "${file.name}" is too large! Maximum size is 500KB per image.`);
          continue;
        }
        if (!validTypes.includes(file.type)) {
          alert(`File "${file.name}" has invalid type! Use PNG, JPG, GIF, or WebP.`);
          continue;
        }
        validFiles.push(file);
      }
      
      console.log('LockedIn: Valid files:', validFiles.length);
      
      if (existingMemes.length + validFiles.length > 5) {
        alert(`Maximum 5 images allowed! You already have ${existingMemes.length} and tried to add ${validFiles.length}.`);
        fileInput.value = '';
        return;
      }

      if (validFiles.length === 0) {
        fileInput.value = '';
        return;
      }
      
      readFilesAsDataUrls(validFiles).then((dataUrls) => {
        const newMemes = dataUrls.filter(Boolean);
        console.log('LockedIn: Processed new memes:', newMemes.length);

        if (newMemes.length === 0) {
          fileInput.value = '';
          return;
        }

        const allMemes = [...existingMemes, ...newMemes];
        console.log('LockedIn: Total memes to save:', allMemes.length);
        renderGallery(allMemes);
        
        browser.storage.local.set({ customMemes: allMemes }, () => {
          if (browser.runtime.lastError) {
            console.error('LockedIn: Error saving memes:', browser.runtime.lastError);
            fileInput.value = '';
            alert('Unable to save these images. Please try again.');
            return;
          }
          console.log('LockedIn: Memes saved successfully');
          fileInput.value = '';
          notifyContentScript(allMemes);
        });
      });
    });
  });
}

// ===== STATS =====
function loadStats() {
  browser.storage.sync.get(['showStats'], (result) => {
    const statsSection = document.getElementById('statsSection');
    const showStats = result.showStats || false;
    
    if (showStats) {
      statsSection.classList.add('visible');
      browser.storage.local.get('stats', (localResult) => {
        const stats = { ...DEFAULT_STATS, ...localResult.stats };
        updateStatsDisplay(stats, true); // animate on initial load
      });
    } else {
      statsSection.classList.remove('visible');
    }
  });
}

// Counter animation function
function animateCounter(element, targetValue, duration = 800, suffix = '') {
  if (!element) return;
  
  // Reset to 0 first
  element.textContent = '0' + suffix;
  
  const startValue = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out cubic)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    
    const currentValue = Math.round(startValue + (targetValue - startValue) * easeOut);
    element.textContent = currentValue + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = targetValue + suffix;
    }
  }
  
  // Small delay to ensure visibility
  setTimeout(() => {
    requestAnimationFrame(update);
  }, 50);
}

function updateStatsDisplay(stats, animate = false) {
  // Calculate total estimated time saved (in minutes)
  const estimatedTimeSaved = 
    (stats.shortsBlocked || 0) * TIME_SAVED_ESTIMATES.short +
    (stats.recsHidden || 0) * TIME_SAVED_ESTIMATES.recommendation +
    (stats.endCardsBlocked || 0) * TIME_SAVED_ESTIMATES.endCard +
    (stats.autoplayStops || 0) * TIME_SAVED_ESTIMATES.autoplay;
  
  const timeSavedEl = document.getElementById('statTimeSaved');
  const timeLabelEl = document.getElementById('statTimeLabel');
  
  if (timeSavedEl && timeLabelEl) {
    if (estimatedTimeSaved > 999) {
      // Show in hours after 999 minutes with decimal
      const hours = (estimatedTimeSaved / 60).toFixed(1);
      timeLabelEl.textContent = 'Time Saved';
      if (animate) {
        // For animation, animate to the whole number then add decimal
        const wholeHours = Math.floor(estimatedTimeSaved / 60);
        animateCounter(timeSavedEl, wholeHours, 800, 'hr');
        setTimeout(() => {
          timeSavedEl.textContent = hours + 'hr';
        }, 850);
      } else {
        timeSavedEl.textContent = hours + 'hr';
      }
    } else {
      timeLabelEl.textContent = 'Min Saved';
      if (animate) {
        animateCounter(timeSavedEl, Math.round(estimatedTimeSaved), 800);
      } else {
        timeSavedEl.textContent = Math.round(estimatedTimeSaved);
      }
    }
  }
  
  // Shorts blocked
  const shortsEl = document.getElementById('statShortsBlocked');
  if (shortsEl) {
    const shortsValue = stats.shortsBlocked || 0;
    if (shortsValue > 999) {
      // Format as 1k, 1.1k, etc.
      const kValue = (shortsValue / 1000).toFixed(1);
      // Remove .0 if whole number
      const displayValue = kValue.endsWith('.0') ? Math.floor(shortsValue / 1000) + 'k' : kValue + 'k';
      if (animate) {
        const wholeK = Math.floor(shortsValue / 1000);
        animateCounter(shortsEl, wholeK, 900, 'k');
        setTimeout(() => {
          shortsEl.textContent = displayValue;
        }, 950);
      } else {
        shortsEl.textContent = displayValue;
      }
    } else {
      if (animate) {
        animateCounter(shortsEl, shortsValue, 900);
      } else {
        shortsEl.textContent = shortsValue;
      }
    }
  }
  
  // Days active
  const daysEl = document.getElementById('statDaysActive');
  if (daysEl) {
    let daysValue = 1;
    if (stats.firstUseDate) {
      daysValue = Math.max(1, Math.floor((Date.now() - stats.firstUseDate) / (1000 * 60 * 60 * 24)));
    }
    if (animate) {
      animateCounter(daysEl, daysValue, 700);
    } else {
      daysEl.textContent = daysValue;
    }
  }
}

// ===== LOAD SETTINGS =====
function loadSettings() {
  return new Promise((resolve) => {
    const toggles = document.querySelectorAll('input[type="checkbox"]');
    
    browser.storage.sync.get(null, (settings) => {
      const currentSettings = { ...DEFAULT_SETTINGS, ...settings };
      
      toggles.forEach((toggle) => {
        const settingId = toggle.dataset.setting;
        if (currentSettings[settingId] !== undefined) {
          toggle.checked = currentSettings[settingId];
        }
      });
      
      const popupContainer = document.querySelector('.popup-container');
      const headerLogo = document.querySelector('.header-logo');
      const isDisabled = !currentSettings.extensionEnabled;
      
      // Apply light mode class first
      if (currentSettings.lightMode) {
        popupContainer.classList.add('light-mode');
      }
      
      // Then set the correct logo based on both light mode and disabled state
      if (headerLogo) {
        if (isDisabled) {
          headerLogo.src = currentSettings.lightMode ? '../icons/LightOff.png' : '../icons/LockedOut.png';
        } else {
          headerLogo.src = currentSettings.lightMode ? '../icons/iconFullLight.png' : '../icons/iconFull.png';
        }
      }
      
      // Apply disabled state
      if (isDisabled) {
        popupContainer.classList.add('disabled');
      }
      
      const statsSection = document.getElementById('statsSection');
      if (currentSettings.showStats) {
        statsSection.classList.add('visible');
      }
      
      // Show redirect to subs sub-toggle if hideFeed is enabled
      const redirectToSubsRow = document.getElementById('redirectToSubsRow');
      if (currentSettings.hideFeed) {
        redirectToSubsRow.classList.add('visible');
      }
      const sidebarSubToggles = document.getElementById('sidebarSubToggles');
      
      if (!currentSettings.hideSidebar) {
        if (sidebarSubToggles) sidebarSubToggles.classList.add('visible');
      } else {
        if (sidebarSubToggles) sidebarSubToggles.classList.remove('visible');
      }
      
      resolve();
    });
  });
}

// ===== TOGGLE LISTENERS =====
function setupToggleListeners() {
  const toggles = document.querySelectorAll('input[type="checkbox"]');
  
  toggles.forEach((toggle) => {
    toggle.addEventListener('change', (e) => {
      const settingId = e.target.dataset.setting;
      const isChecked = e.target.checked;
      
      if (settingId === 'lightMode') {
        const popupContainer = document.querySelector('.popup-container');
        const headerLogo = document.querySelector('.header-logo');
        const isDisabled = popupContainer.classList.contains('disabled');
        if (isChecked) {
          popupContainer.classList.add('light-mode');
          if (headerLogo) {
            headerLogo.src = isDisabled ? '../icons/LightOff.png' : '../icons/iconFullLight.png';
          }
        } else {
          popupContainer.classList.remove('light-mode');
          if (headerLogo) {
            headerLogo.src = isDisabled ? '../icons/LockedOut.png' : '../icons/iconFull.png';
          }
        }
      }
      
      if (settingId === 'showStats') {
        const statsSection = document.getElementById('statsSection');
        if (isChecked) {
          statsSection.classList.add('visible');
          browser.storage.local.get('stats', (result) => {
            const stats = { ...DEFAULT_STATS, ...result.stats };
            if (!stats.firstUseDate) {
              stats.firstUseDate = Date.now();
              browser.storage.local.set({ stats });
            }
            updateStatsDisplay(stats, true); // animate when toggled on
          });
        } else {
          statsSection.classList.remove('visible');
        }
      }
      
      // Show/hide redirect to subs sub-toggle when hideFeed is toggled
      if (settingId === 'hideFeed') {
        const redirectToSubsRow = document.getElementById('redirectToSubsRow');
        if (isChecked) {
          redirectToSubsRow.classList.add('visible');
        } else {
          redirectToSubsRow.classList.remove('visible');
          // Also turn off redirectToSubs when hideFeed is turned off
          const redirectToggle = document.querySelector('input[data-setting="redirectToSubs"]');
          if (redirectToggle && redirectToggle.checked) {
            redirectToggle.checked = false;
            browser.storage.sync.set({ redirectToSubs: false });
          }
        }
      }
      if (settingId === 'hideSidebar') {
        const sidebarSubToggles = document.getElementById('sidebarSubToggles');
        
        if (!isChecked) {
          if (sidebarSubToggles) sidebarSubToggles.classList.add('visible');
        } else {
          if (sidebarSubToggles) sidebarSubToggles.classList.remove('visible');
          
          // Turn off sub-toggles when parent is enabled
          const hideRecommendedToggle = document.querySelector('input[data-setting="hideRecommended"]');
          const hideSidebarShortsToggle = document.querySelector('input[data-setting="hideSidebarShorts"]');
          const hidePlaylistsToggle = document.querySelector('input[data-setting="hidePlaylists"]');
          
          if (hideRecommendedToggle && hideRecommendedToggle.checked) {
            hideRecommendedToggle.checked = false;
            browser.storage.sync.set({ hideRecommended: false });
          }
          if (hideSidebarShortsToggle && hideSidebarShortsToggle.checked) {
            hideSidebarShortsToggle.checked = false;
            browser.storage.sync.set({ hideSidebarShorts: false });
          }
          if (hidePlaylistsToggle && hidePlaylistsToggle.checked) {
            hidePlaylistsToggle.checked = false;
            browser.storage.sync.set({ hidePlaylists: false });
          }
        }
      }
      
      browser.storage.sync.set({ [settingId]: isChecked }, () => {
        if (browser.runtime.lastError) {
          console.error('LockedIn: Failed to save setting', browser.runtime.lastError);
          e.target.checked = !isChecked;
          return;
        }
        
        browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            browser.tabs.sendMessage(tabs[0].id, {
              action: 'settingChanged',
              setting: settingId,
              value: isChecked
            }).catch(() => {});
          }
        });
      });
    });
  });
}
