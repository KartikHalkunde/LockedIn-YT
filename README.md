<div align="center">
  <img src="icons/iconFull.png" alt="LockedIn Logo" width="500"/>
  
  **Stay focused. Get things done.**
  
  [![Firefox Add-ons](https://img.shields.io/badge/Firefox-Available-orange?logo=firefox-browser&logoColor=white)](https://addons.mozilla.org/firefox/addon/lockedin-yt/)
  [![Edge Add-ons](https://img.shields.io/badge/Edge-Available-blue?logo=microsoft-edge&logoColor=white)](#)
  [![Chrome Web Store](https://img.shields.io/badge/Chrome-Coming%20Soon-lightgrey?logo=google-chrome&logoColor=white)](#)
  [![Version](https://img.shields.io/badge/version-1.0.5-green.svg)](https://github.com/KartikHalkunde/LockedIn-YT/releases)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  
</div>

---

## About

LockedIn is an open-source browser extension that helps you focus on YouTube by removing distracting elements. 

**Compatible with:** Firefox, Microsoft Edge, and Chromium-based browsers

**Features:**
- 🎯 Hide Homepage Feed & Explore Pages
- 📺 Hide Recommended Videos & End Screen Cards
- 🎬 Block YouTube Shorts everywhere
- 💬 Hide Live Chat
- ⚙️ Disable Autoplay
- 🔌 Power button to quickly toggle entire extension

**Privacy:** Zero data collection. No external network requests. All processing happens locally in your browser.

---

## Download

- **Firefox**: [Get it on Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/lockedin-yt/)
- **Edge**: Available on Edge Add-ons (link coming soon)
- **Chrome**: Coming soon to Chrome Web Store

---

## How It Works

**Content Script ([`content.js`](content.js))**  
Runs on YouTube pages and handles element hiding using MutationObserver to detect dynamic content.

**Popup Interface ([`popup/`](popup/))**  
Simple toggle switches for each feature. Settings are saved instantly and synced across your devices.

---

## Important Links

- 📖 [Building from Source](BUILDING.md)
- 🤝 [Contributing Guide](CONTRIBUTING.md)
- 🔒 [Privacy Policy](PRIVACY.md)
- 📋 [Changelog](#changelog)
- 🐛 [Report Issues](https://github.com/KartikHalkunde/LockedIn-YT/issues)
- 💬 [Discussions](https://github.com/KartikHalkunde/LockedIn-YT/discussions)

---

## Permissions

| Permission | Why It's Needed |
|------------|-----------------|
| `storage` | Saves your preferences across browser sessions |
| `*://www.youtube.com/*` | Allows the extension to modify YouTube pages |

**No tracking. No data collection. No external servers.**

---

## Changelog

### Version 1.0.5 (October 29, 2025)
- **Cross-Browser Support**: Now compatible with Firefox, Edge, and Chrome
- **Edge Add-ons**: Available on Microsoft Edge Add-ons store
- **Multi-Platform**: Single codebase works across all browsers

### Version 1.0.4 (October 29, 2025)
- **Performance**: Removed Google Fonts dependency for faster load times
- **Size Optimization**: Extension package reduced by 95% (1.1 MB → 55 KB)
- **Icons**: Optimized PNG files (700 KB → 48 KB total)

### Version 1.0.3 (October 29, 2025)
- **Power Button**: Quick enable/disable toggle in extension popup
- **Enhanced Blocking**: Improved Shorts hiding across homepage, sidebar, and tab
- **UI Improvements**: Reorganized settings, faster toggle animations

[Full Changelog](https://github.com/KartikHalkunde/LockedIn-YT/releases)

---

## Tech Stack

![Stack](https://img.shields.io/badge/Stack-Vanilla%20JS-yellow?style=flat-square)
![Dependencies](https://img.shields.io/badge/Dependencies-Zero-success?style=flat-square)
![Size](https://img.shields.io/badge/Size-56KB-success?style=flat-square)

- **Manifest V3** - Latest extension standard
- **Vanilla JavaScript** - No frameworks or libraries
- **No build tools** - Code you see is what runs in the browser
- **MutationObserver API** - Dynamic content detection

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Contact & Support

- **Bug Reports**: [GitHub Issues](https://github.com/KartikHalkunde/LockedIn-YT/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/KartikHalkunde/LockedIn-YT/discussions)
- **Email**: kartikhalkunde26@gmail.com

---

<div align="center">

Made with ☕ by [Kartik Halkunde](https://github.com/KartikHalkunde)

If this helps you stay focused, consider [⭐ starring the repo](https://github.com/KartikHalkunde/LockedIn-YT)!

</div>
i