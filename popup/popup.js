// ===== DEFAULT SETTINGS =====
const DEFAULT_SETTINGS = {
  hideFeed: false,
  hideSidebar: false,
  hideLiveChat: false,
  hideEndCards: false,
  hideExplore: false,
  hideShorts: false,
  disableAutoplay: false
};

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  setupToggleListeners();
});

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
