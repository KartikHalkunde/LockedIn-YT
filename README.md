<div align="center">
  <img src="icons/iconFull.png" alt="LockedIn Logo" width="400"/>

  
  **Stay focused. Get things done.**
  
  A lightweight browser extension for reclaiming your productivity by removing distracting elements from YouTube.
  
  [![Firefox Add-ons](https://img.shields.io/badge/Firefox-Available-orange?logo=firefox-browser&logoColor=white)](https://addons.mozilla.org/firefox/)
  [![Chrome Web Store](https://img.shields.io/badge/Chrome-Coming%20Soon-blue?logo=google-chrome&logoColor=white)](#)
  [![Version](https://img.shields.io/badge/version-1.0.2-green.svg)](https://github.com/KartikHalkunde/LockedIn-YT/releases)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## Features

<table>
<tr>
<td width="50%">

### 🎯 **Homepage & Feed**
- Hide Homepage Feed
- Hide Explore Pages

### 📺 **Video Page**
- Hide Recommended Videos 
- Hide End Screen Cards
- Hide Live Chat

</td>
<td width="50%">

### 🎬 **Content Types**
- Block Shorts on homepage
- Removes Shorts Tab 

### ⚙️ **Playback**
- Disable Autoplay
- Control video suggestions

</td>
</tr>
</table>

---
</div>

## Installation

### 🦊 Firefox (Available Now)

![Firefox](https://img.shields.io/badge/Firefox-Install%20Now-orange?style=flat-square&logo=firefox-browser&logoColor=white)

The easiest way to get started:

1. Visit the [Firefox Add-ons Store](https://addons.mozilla.org/en-US/firefox/addon/lockedin-yt/)
2. Click "Add to Firefox"
3. You're done! Click the extension icon to configure your preferences.

### Chrome (Coming Soon)

![Chrome](https://img.shields.io/badge/Chrome-Under%20Review-lightgrey?style=flat-square&logo=google-chrome&logoColor=white)

Currently under review for the Chrome Web Store. Check back soon!

---
### Building from Source

![Build](https://img.shields.io/badge/Build-Manual-blue?style=flat-square)

If you prefer to build and install manually:

**1. Clone the repository**
```bash
git clone https://github.com/KartikHalkunde/LockedIn-YT.git
cd LockedIn-YT
```

**2. Build the extension**

Linux/macOS:
```bash
chmod +x build.sh
./build.sh
```

Windows (PowerShell):
```powershell
.\build.ps1
```

**3. Load in your browser**

*For Firefox:*
- Navigate to `about:debugging#/runtime/this-firefox`
- Click "Load Temporary Add-on"
- Select the generated `lockedin-1.0.2.zip` file

*For Chrome:*
- Go to `chrome://extensions/`
- Enable "Developer mode" (top right)
- Click "Load unpacked"
- Select the project folder

---

## How It Works

LockedIn is built with simplicity and privacy in mind. Here's what's under the hood:

**Content Script (`content.js`)**

The main script runs on YouTube pages and handles the actual element hiding. It uses a MutationObserver to detect when YouTube adds new content dynamically (which happens a lot), and applies your preferences in real-time. The observer is debounced to avoid performance issues.

**Popup Interface (`popup/`)**

A simple, clean interface with toggle switches for each feature. When you flip a switch, the setting is immediately saved to browser storage and applied to any open YouTube tabs. Settings are synced across your devices using Firefox Sync.

**Privacy**

Everything happens locally in your browser. The extension doesn't make any network requests, doesn't collect any data, and doesn't use analytics. Your settings are stored in your browser's sync storage - that's it.

---

## Project Structure

```
LockedIn-YT/
├── manifest.json          # Extension configuration
├── content.js             # Main functionality (YouTube element hiding)
├── icons/
│   ├── icon48.png         # Toolbar icon
│   └── iconFull.png       # Full logo
├── popup/
│   ├── popup.html         # Settings UI structure
│   ├── popup.css          # Styling
│   └── popup.js           # Settings logic
├── build.sh               # Build script (Linux/macOS)
├── build.ps1              # Build script (Windows)
└── README.md              # This file
```

---

## Development

### Tech Stack

![Stack](https://img.shields.io/badge/Stack-Vanilla%20JS-yellow?style=flat-square)
![Dependencies](https://img.shields.io/badge/Dependencies-Zero-success?style=flat-square)

This extension is intentionally simple - no build pipeline, no dependencies, just vanilla web technologies:

- **Manifest V3** - Latest extension standard
- **Vanilla JavaScript** - No frameworks or libraries
- **CSS3** - Modern styling
- **browser.storage.sync API** - Settings synchronization
- **MutationObserver API** - Dynamic content detection

### No Build Tools

Unlike most modern extensions, this project doesn't use webpack, Rollup, Babel, TypeScript, or any other build tools. The code you see in the repository is exactly what runs in the browser. This makes the extension:

- Easy to audit and review
- Simple to contribute to
- Fast to build (just zip the files)
- Transparent - no hidden compilation steps

### Contributing

![Contributions](https://img.shields.io/badge/Contributions-Welcome-brightgreen?style=flat-square)

Want to help improve LockedIn? Here's how:

1. Fork this repository
2. Create a branch for your feature (`git checkout -b feature/your-feature`)
3. Make your changes
4. Test by loading the extension in Firefox/Chrome
5. Commit your changes (`git commit -m 'Add your feature'`)
6. Push to your fork (`git push origin feature/your-feature`)
7. Open a Pull Request

### Local Development

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/LockedIn-YT.git
cd LockedIn-YT

# Make your changes...

# Build
./build.sh

# Load in Firefox for testing
# Go to about:debugging#/runtime/this-firefox
# Click "Load Temporary Add-on" and select the ZIP file
```

---

## Bug Reports & Feature Requests

![Issues](https://img.shields.io/badge/Issues-Open-blue?style=flat-square&logo=github)
![Discussions](https://img.shields.io/badge/Discussions-Join-purple?style=flat-square&logo=github)

If something isn't working right or you have an idea for improvement:

- **Bugs**: [Open an issue](https://github.com/KartikHalkunde/LockedIn-YT/issues) with details about what happened and what you expected
- **Features**: Start a [discussion](https://github.com/KartikHalkunde/LockedIn-YT/discussions) to talk about your idea

When reporting bugs, please include:
- Your browser and version
- Steps to reproduce the issue
- What you expected vs what actually happened
- Screenshots if relevant

---

## Permissions

![Privacy](https://img.shields.io/badge/Privacy-First-success?style=flat-square&logo=shield)
![Data Collection](https://img.shields.io/badge/Data%20Collection-None-brightgreen?style=flat-square)

LockedIn only requests the permissions it actually needs:

| Permission | Why It's Needed |
|------------|-----------------|
| `storage` | Saves your preferences so they persist across browser sessions |
| `*://www.youtube.com/*` | Allows the extension to modify YouTube pages |

That's it. No tracking, no data collection, no network requests to external servers.

---

## Changelog

![Release](https://img.shields.io/badge/Latest-v1.0.2-green?style=flat-square)

### Version 1.0.2 (October 26, 2025)
- Updated extension icons with new branding
- Stable release with performance optimizations

### Version 1.0.1 (October 25, 2025)
- Fixed default toggle behavior
- Added comprehensive error handling
- Performance improvements with debounced MutationObserver
- Improved settings initialization

### Version 1.0.0 (October 21, 2025)
- Initial release
- Core YouTube distraction hiding features
- Settings popup with toggle controls
- Cross-device settings sync

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Contact & Support

![GitHub Issues](https://img.shields.io/badge/GitHub-Issues-red?style=flat-square&logo=github)
![Email](https://img.shields.io/badge/Email-Contact-blue?style=flat-square&logo=gmail)

- **Bug Reports**: [GitHub Issues](https://github.com/KartikHalkunde/LockedIn-YT/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/KartikHalkunde/LockedIn-YT/discussions)
- **Email**: kartikhalkunde26@gmail.com 

---

## For Extension Reviewers

![Code Quality](https://img.shields.io/badge/Code-Readable-success?style=flat-square)
![Build](https://img.shields.io/badge/Build-Reproducible-blue?style=flat-square)

If you're reviewing this extension for Mozilla or Chrome:

**Build Verification**

This extension uses no build tools, minification, or obfuscation. To verify:

```bash
# Clone the repo
git clone https://github.com/KartikHalkunde/LockedIn-YT.git
cd LockedIn-YT

# Build (just creates a zip file)
./build.sh

# The resulting lockedin-1.0.2.zip contains the exact same code
# you see in the repository - no compilation or transformation
```

**What to expect:**
- No minified code
- No external dependencies
- No build pipeline
- Human-readable source code
- Deterministic builds (same input = same output)

All code is vanilla JavaScript and can be reviewed directly in the repository.

---

<div align="center">

Made by ☕ and [Kartik Halkunde](https://github.com/KartikHalkunde)

If this helps you stay focused, consider starring the repo!

</div>
