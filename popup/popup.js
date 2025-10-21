document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  setupToggleListeners();
});

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

function setupToggleListeners() {
  const toggles = document.querySelectorAll('input[type="checkbox"]');
  
  toggles.forEach((toggle) => {
    toggle.addEventListener('change', (e) => {
      const settingId = e.target.dataset.setting;
      const isChecked = e.target.checked;
      
      chrome.storage.sync.set({ [settingId]: isChecked }, () => {
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
