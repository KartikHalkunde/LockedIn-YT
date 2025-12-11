<div align="center">
  <img src="assets/logo.png" alt="LockedIn Logo" width="500"/>
  
  **Stay focused. Get things done.**
  
  [![Firefox Add-ons](https://img.shields.io/badge/Firefox-Available-orange?logo=firefox-browser&logoColor=white)](https://addons.mozilla.org/firefox/addon/lockedin-yt/)
  [![Edge Add-ons](https://img.shields.io/badge/Edge-Available-blue?logo=microsoft-edge&logoColor=white)](https://microsoftedge.microsoft.com/addons/detail/hibjbjgfbmhpiaapeccnfddnpabnlklj)
  [![Chrome Web Store](https://img.shields.io/badge/Chrome-Coming%20Soon-lightgrey?logo=google-chrome&logoColor=white)](#)
  [![Version](https://img.shields.io/badge/version-1.0.90-green.svg)](https://github.com/KartikHalkunde/LockedIn-YT/releases)
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

### Version 1.0.90 (December 11, 2025)
- **Multi-Language Popup Support**: Extension popup now supports 9+ languages (English, German, French, Spanish, Italian, Arabic, Turkish, Korean, Chinese)
- **Automatic Theme Detection**: Popup automatically switches between light/dark mode based on browser theme
- **Hide Subscriptions Toggle**: New toggle to hide the Subscriptions section from YouTube sidebar
- **Language-Independent Detection**: Multi-layered detection system for Explore/Trending/MoreFromYT toggles
- **URL-Based Primary Detection**: Works across all languages using URL patterns as primary identifier
- **Confidence Scoring System**: Combines URL, text (9+ languages), and structural position detection
- **Dynamic Sidebar Monitoring**: MutationObserver continuously applies hiding rules when sidebar updates
- **Firefox Compliance**: Removed service_worker field and all innerHTML usage for Mozilla security requirements

### Version 1.0.82 (November 27, 2025)
- **Menu Tab**: New menu interface with enhanced navigation and controls
- **Light Mode Theme**: Optional light theme for better visibility
- **Take a Break Feature**: Background alarm-based timer with auto-redirect and flash notifications
- **Instant CSS Hiding**: Pre-render hiding eliminates distraction flicker
- **Context-Aware Toggles**: Parent/child toggles appear only when relevant
- **Popup Refinements**: Improved layout spacing and clearer section dividers

### Version 1.0.75 (November 15, 2025)
- **Livestream Fix**: Fixed sidebar recommendations not hiding on YouTube livestream pages
- **UI Layer Fix**: Improved meme overlay z-index to prevent covering search suggestions
- **Toggle Independence**: Fixed Shorts toggle cross-interference between homepage and search
- **Enhanced Detection**: Better livestream video renderer detection (ytd-compact-autoplay-renderer)
- **Stability**: Strengthened sidebar hiding logic and improved page-type detection

### Version 1.0.7 (November 5, 2025)
- **Smart Sidebar**: Improved video page sidebar controls
  - New toggle to show/hide playlists separately
  - Refined recommended videos hiding to preserve playlists
  - Better user control over sidebar content
- **UI Enhancements**: Optimized popup interface dimensions
- **Technical**: Updated internal version references

### Version 1.0.6 (October 31, 2025)
- **UI Overhaul**: Complete popup redesign with 4 logical groups and thread-line styling
- **New Features**: Added hide comments, search recommendations, and "More From YouTube" filters
- **Split Controls**: Separate toggles for homepage and search Shorts hiding
- **Motivational Memes**: Display random meme when homepage feed is hidden
- **Footer Updates**: GitHub and Support links with auto-version display
- **Bug Fixes**: Fixed homepage feed hiding and search recommendations filtering
- **Optimization**: Compressed meme images (1.7MB → 188KB total extension size)

### Version 1.0.5 (October 29, 2025)
- **Cross-Browser Support**: Now compatible with Firefox, Edge, and Chrome
- **Edge Add-ons**: Available on Microsoft Edge Add-ons store
- **Multi-Platform**: Single codebase works across all browsers

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
