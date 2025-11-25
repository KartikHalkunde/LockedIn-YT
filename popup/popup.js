// ===== CROSS-BROWSER COMPATIBILITY =====
if (typeof browser === 'undefined') {
  var browser = chrome;
}

// ===== DEFAULT SETTINGS =====
const DEFAULT_SETTINGS = {
  hideFeed: false,
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
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  setupToggleListeners();
  setupPowerButton();
  setupMenuButton();
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
  });

  closeMenuButton.addEventListener('click', () => {
    settingsMenu.classList.remove('open');
  });
}

// ===== POWER BUTTON =====
function setupPowerButton() {
  const powerButton = document.getElementById('powerButton');
  
  browser.storage.sync.get(['extensionEnabled', 'takeBreak', 'breakDuration', 'breakStartTime'], (result) => {
    const isEnabled = result.extensionEnabled !== undefined ? result.extensionEnabled : true;
    updatePowerState(isEnabled);
    
    if (!isEnabled && result.breakStartTime && result.takeBreak) {
      startBreakCountdown(result.breakStartTime, result.breakDuration);
    }
  });
  
  powerButton.addEventListener('click', () => {
    browser.storage.sync.get(['extensionEnabled', 'takeBreak', 'breakDuration'], (result) => {
      const currentState = result.extensionEnabled !== undefined ? result.extensionEnabled : true;
      const newState = !currentState;
      
      const saveData = { extensionEnabled: newState };
      
      if (!newState && result.takeBreak) {
        saveData.breakStartTime = Date.now();
        startBreakCountdown(Date.now(), result.breakDuration || 5);
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
  
  if (isEnabled) {
    popupContainer.classList.remove('disabled');
    if (breakTimerText) breakTimerText.style.display = 'none';
  } else {
    popupContainer.classList.add('disabled');
  }
}

// ===== BREAK TIMER =====
let breakInterval = null;

function setupBreakTimer() {
  const breakTimeButtons = document.querySelectorAll('.break-time-btn');
  
  browser.storage.sync.get('breakDuration', (result) => {
    const duration = result.breakDuration || 5;
    breakTimeButtons.forEach(btn => {
      if (parseInt(btn.dataset.time) === duration) {
        btn.classList.add('selected');
      }
    });
  });
  
  breakTimeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      breakTimeButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      
      const duration = parseInt(btn.dataset.time);
      browser.storage.sync.set({ breakDuration: duration });
    });
  });
}

function startBreakCountdown(startTime, duration) {
  const breakTimerText = document.getElementById('breakTimerText');
  if (!breakTimerText) return;
  
  breakTimerText.style.display = 'block';
  
  if (breakInterval) clearInterval(breakInterval);
  
  const endTime = startTime + (duration * 60 * 1000);
  
  function updateTimer() {
    const now = Date.now();
    const remaining = endTime - now;
    
    if (remaining <= 0) {
      clearInterval(breakInterval);
      browser.storage.sync.set({ extensionEnabled: true, breakStartTime: null }, () => {
        updatePowerState(true);
        browser.tabs.query({}, (tabs) => {
          tabs.forEach((tab) => {
            if (tab.url && tab.url.includes('youtube.com')) {
              browser.tabs.sendMessage(tab.id, {
                action: 'powerStateChanged',
                enabled: true
              }).catch(() => {});
            }
          });
        });
      });
      return;
    }
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    breakTimerText.textContent = `Back in ${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  
  updateTimer();
  breakInterval = setInterval(updateTimer, 1000);
}

// ===== CUSTOM MEME UPLOAD =====
function setupCustomMemeUpload() {
  const fileInput = document.getElementById('customMemeInput');
  const preview = document.getElementById('customMemePreview');
  const previewImg = document.getElementById('memePreviewImg');
  const removeBtn = document.getElementById('removeMemeBtn');
  
  // Load existing custom meme
  browser.storage.local.get('customMeme', (result) => {
    if (result.customMeme) {
      previewImg.src = result.customMeme;
      preview.classList.add('visible');
    }
  });
  
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 500 * 1024) {
      alert('File too large! Maximum size is 500KB.');
      return;
    }
    
    const validTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Invalid file type! Use PNG, JPG, GIF, or WebP.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      
      browser.storage.local.set({ customMeme: dataUrl }, () => {
        previewImg.src = dataUrl;
        preview.classList.add('visible');
        
        browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            browser.tabs.sendMessage(tabs[0].id, {
              action: 'customMemeUpdated',
              meme: dataUrl
            }).catch(() => {});
          }
        });
      });
    };
    reader.readAsDataURL(file);
  });
  
  removeBtn.addEventListener('click', () => {
    browser.storage.local.remove('customMeme', () => {
      previewImg.src = '';
      preview.classList.remove('visible');
      
      browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          browser.tabs.sendMessage(tabs[0].id, {
            action: 'customMemeUpdated',
            meme: null
          }).catch(() => {});
        }
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
        updateStatsDisplay(stats);
      });
    } else {
      statsSection.classList.remove('visible');
    }
  });
}

function updateStatsDisplay(stats) {
  // Calculate total estimated time saved (in minutes)
  const estimatedTimeSaved = 
    (stats.shortsBlocked || 0) * TIME_SAVED_ESTIMATES.short +
    (stats.recsHidden || 0) * TIME_SAVED_ESTIMATES.recommendation +
    (stats.endCardsBlocked || 0) * TIME_SAVED_ESTIMATES.endCard +
    (stats.autoplayStops || 0) * TIME_SAVED_ESTIMATES.autoplay;
  
  const timeSavedEl = document.getElementById('statTimeSaved');
  const timeLabelEl = document.getElementById('statTimeLabel');
  
  if (timeSavedEl && timeLabelEl) {
    if (estimatedTimeSaved >= 60) {
      const hours = Math.floor(estimatedTimeSaved / 60);
      timeSavedEl.textContent = hours;
      timeLabelEl.textContent = 'hours saved';
    } else {
      timeSavedEl.textContent = Math.round(estimatedTimeSaved);
      timeLabelEl.textContent = 'minutes saved';
    }
  }
  
  // Shorts blocked
  const shortsEl = document.getElementById('statShortsBlocked');
  if (shortsEl) {
    shortsEl.textContent = stats.shortsBlocked || 0;
  }
  
  // Days active
  const daysEl = document.getElementById('statDaysActive');
  if (daysEl) {
    if (stats.firstUseDate) {
      const days = Math.floor((Date.now() - stats.firstUseDate) / (1000 * 60 * 60 * 24));
      daysEl.textContent = Math.max(1, days);
    } else {
      daysEl.textContent = '1';
    }
  }
}

// ===== LOAD SETTINGS =====
function loadSettings() {
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
    if (currentSettings.lightMode) {
      popupContainer.classList.add('light-mode');
    }
    
    const statsSection = document.getElementById('statsSection');
    if (currentSettings.showStats) {
      statsSection.classList.add('visible');
    }
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
        if (isChecked) {
          popupContainer.classList.add('light-mode');
        } else {
          popupContainer.classList.remove('light-mode');
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
            updateStatsDisplay(stats);
          });
        } else {
          statsSection.classList.remove('visible');
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
