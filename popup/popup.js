// Load saved settings when popup opens
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  setupToggleListeners();
});

// Load settings from chrome.storage
function loadSettings() {
  const toggles = document.querySelectorAll('input[type="checkbox"]');
  
  chrome.storage.sync.get(null, (settings) => {
    toggles.forEach((toggle) => {
      const settingId = toggle.dataset.setting;
      if (settings[settingId] !== undefined) {
        toggle.checked = settings[settingId];
      }
    });
  });
}

// Setup event listeners for all toggles
function setupToggleListeners() {
  const toggles = document.querySelectorAll('input[type="checkbox"]');
  
  toggles.forEach((toggle) => {
    toggle.addEventListener('change', (e) => {
      const settingId = e.target.dataset.setting;
      const isChecked = e.target.checked;
      
      // Save to chrome.storage
      chrome.storage.sync.set({ [settingId]: isChecked }, () => {
        // Notify content script of the change
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: 'settingChanged',
              setting: settingId,
              value: isChecked
            });
          }
        });
      });
    });
  });
}
