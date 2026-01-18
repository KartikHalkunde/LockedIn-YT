<div align="center">
  <img src="assets/logo.png" alt="LockedIn Logo" width="500"/>
  
  **Stay focused. Get things done.**
  
  [![Firefox Add-ons](https://img.shields.io/badge/Firefox-Available-orange?logo=firefox-browser&logoColor=white)](https://addons.mozilla.org/firefox/addon/lockedin-yt/)
  [![Edge Add-ons](https://img.shields.io/badge/Edge-Available-blue?logo=microsoft-edge&logoColor=white)](https://microsoftedge.microsoft.com/addons/detail/hibjbjgfbmhpiaapeccnfddnpabnlklj)
  [![Chrome Web Store](https://img.shields.io/badge/Chrome-Coming%20Soon-lightgrey?logo=google-chrome&logoColor=white)](#)
  [![Version](https://img.shields.io/badge/version-1.0.97-green.svg)](https://github.com/KartikHalkunde/LockedIn-YT/releases)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  
</div>

---

## About

LockedIn is an open-source browser extension that helps you focus on YouTube by removing distracting elements. 

**Compatible with:** Firefox, Microsoft Edge, and Chromium-based browsers

**Features:**
-  Hide Homepage Feed with motivational memes
-  Smart Video Sidebar Controls:
   - Hide Recommended Videos while keeping playlists visible
   - Separate toggle for playlists visibility
-  Block YouTube Shorts (separate controls for homepage & search)
-  Hide Comments & Live Chat
-  Hide Search Recommendations, Subscriptions & "More From YouTube"
-  Disable Autoplay
-  Instant element hiding with zero delays
-  New organized UI with 4 logical groups
-  Power button to quickly toggle entire extension
-  "Take a Break" mode that temporarily disables the extension, flashes a warning when time is up, and auto-redirects you back to the homepage
-  Stats tracking for time saved and content blocked

**Privacy:** Zero data collection. No external network requests. All processing happens locally in your browser.

---

## Download

- **Firefox**: [Get it on Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/lockedin-yt/)
- **Edge**: [Get it on Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/hibjbjgfbmhpiaapeccnfddnpabnlklj)
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
- 🌐 [Website](https://kartikhalkunde.github.io/LockedIn-YT/)

---

## Permissions

| Permission | Why It's Needed |
|------------|-----------------|
| `storage` | Saves your preferences across browser sessions |
| `*://www.youtube.com/*` | Allows the extension to modify YouTube pages |

**No tracking. No data collection. No external servers.**

---

## Changelog

### Version 1.0.97 (January 18, 2026)
- **Bug Fix**: Fixed flickering issue around the like button area when "Hide Video Side Bar" toggle is enabled.
- **Performance**: Removed CSS variable manipulation that was causing layout recalculation loops.

### Version 1.0.96 (January 10, 2026)
- **Bug Fix**: Fixed search results page breaking when Hide Recommended Videos or Hide Sidebar toggle is enabled.
- **Bug Fix**: Fixed video player persisting on homepage/search pages when Hide Recommended is toggled.
- **Enhancement**: Added page-specific CSS scoping to prevent layout issues during navigation.

### Version 1.0.95 (January 2, 2026)
- **Bug Fix**: Fixed video thumbnail hover previews showing black screen when "Hide End Screen Cards" toggle is enabled.

For more updates, check out the complete [CHANGELOG](CHANGELOG.md).

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
