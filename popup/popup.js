// ===== CROSS-BROWSER COMPATIBILITY =====
// Support both Firefox (browser) and Chromium-based browsers (chrome)
if (typeof browser === 'undefined') {
  var browser = chrome;
}

// ===== DEFAULT SETTINGS =====
const DEFAULT_SETTINGS = {
  hideFeed: false,
  hideShortsHomepage: false,
  hideSidebar: false,
  hideLiveChat: false,
  hideEndCards: false,
  hideComments: false,
  disableAutoplay: false,
  hideSearchRecommended: false,
  hideShortsSearch: false,
  hideExplore: false,
  hideMoreFromYT: false,
  extensionEnabled: true
};

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  setupToggleListeners();
  setupPowerButton();
  displayVersion();
});

function displayVersion() {
  const manifest = browser.runtime.getManifest();
  const versionElement = document.querySelector('.version');
  if (versionElement) {
    versionElement.textContent = `v${manifest.version}`;
  }
}

function setupPowerButton() {
  const powerButton = document.getElementById('powerButton');
  const popupContainer = document.querySelector('.popup-container');
  
  // Load initial state
  browser.storage.sync.get('extensionEnabled', (result) => {
    const isEnabled = result.extensionEnabled !== undefined ? result.extensionEnabled : true;
    updatePowerState(isEnabled);
  });
  
  powerButton.addEventListener('click', () => {
    browser.storage.sync.get('extensionEnabled', (result) => {
      const currentState = result.extensionEnabled !== undefined ? result.extensionEnabled : true;
      const newState = !currentState;
      
      // Save new state
      browser.storage.sync.set({ extensionEnabled: newState }, () => {
        if (browser.runtime.lastError) {
          console.error('LockedIn: Failed to save power state', browser.runtime.lastError);
          return;
        }
        
        updatePowerState(newState);
        
        // Notify all YouTube tabs about the power state change
        browser.tabs.query({}, (tabs) => {
          tabs.forEach((tab) => {
            if (tab.url && tab.url.includes('youtube.com')) {
              browser.tabs.sendMessage(tab.id, {
                action: 'powerStateChanged',
                enabled: newState
              }).catch((error) => {
                console.debug('LockedIn: Could not send message to tab', error);
              });
            }
          });
        });
      });
    });
  });
}

function updatePowerState(isEnabled) {
  const popupContainer = document.querySelector('.popup-container');
  
  if (isEnabled) {
    popupContainer.classList.remove('disabled');
  } else {
    popupContainer.classList.add('disabled');
  }
}

function loadSettings() {
  const toggles = document.querySelectorAll('input[type="checkbox"]');
  
  // Load settings with error handling
  browser.storage.sync.get(null, (settings) => {
    // Merge with defaults to ensure all settings exist
    const currentSettings = { ...DEFAULT_SETTINGS, ...settings };
    
    toggles.forEach((toggle) => {
      const settingId = toggle.dataset.setting;
      if (currentSettings[settingId] !== undefined) {
        toggle.checked = currentSettings[settingId];
      }
    });
  });
}

function setupToggleListeners() {
  const toggles = document.querySelectorAll('input[type="checkbox"]');
  
  toggles.forEach((toggle) => {
    toggle.addEventListener('change', (e) => {
      const settingId = e.target.dataset.setting;
      const isChecked = e.target.checked;
      
      // Save with error handling
      browser.storage.sync.set({ [settingId]: isChecked }, () => {
        if (browser.runtime.lastError) {
          console.error('LockedIn: Failed to save setting', browser.runtime.lastError);
          // Revert toggle if save failed
          e.target.checked = !isChecked;
          return;
        }
        
        // Send message to content script
        browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            browser.tabs.sendMessage(tabs[0].id, {
              action: 'settingChanged',
              setting: settingId,
              value: isChecked
            }).catch((error) => {
              // Ignore errors if tab is not a YouTube page
              console.debug('LockedIn: Could not send message to tab', error);
            });
          }
        });
      });
    });
  });
}
