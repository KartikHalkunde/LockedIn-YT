# 🔒 LockedIn

> **Hide YouTube distractions. Stay focused. Get things done.**

A lightweight browser extension that helps you reclaim your productivity by removing distracting elements from YouTube.

[![Firefox Add-ons](https://img.shields.io/badge/Firefox-Available-orange?logo=firefox-browser&logoColor=white)](https://addons.mozilla.org/firefox/)
[![Chrome Web Store](https://img.shields.io/badge/Chrome-Coming%20Soon-blue?logo=google-chrome&logoColor=white)](#)
[![Version](https://img.shields.io/badge/version-1.0.2-green.svg)](https://github.com/YOUR_USERNAME/LockedIn/releases)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎯 **Homepage & Feed**
- Hide YouTube Homepage Feed
- Hide Explore & Trending Pages

### 📺 **Video Page**
- Hide Recommended Videos Sidebar
- Hide End Screen Cards
- Hide Live Chat

</td>
<td width="50%">

### 🎬 **Content Types**
- Hide YouTube Shorts (everywhere)
- Block Shorts on homepage
- Remove Shorts from search

### ⚙️ **Playback**
- Disable Autoplay
- Control video suggestions

</td>
</tr>
</table>

---

## 📥 Installation

### 🦊 **Firefox** (Available Now)

<a href="https://addons.mozilla.org/firefox/" target="_blank">
  <img src="https://img.shields.io/badge/Get%20for-Firefox-orange?style=for-the-badge&logo=firefox-browser&logoColor=white" alt="Get LockedIn for Firefox" height="50">
</a>

1. Visit the [Firefox Add-ons Store](https://addons.mozilla.org/firefox/)
2. Click "Add to Firefox"
3. Enjoy distraction-free YouTube! 🎉

---

### 🌐 **Chrome** (Coming Soon)

<img src="https://img.shields.io/badge/Chrome-Coming%20Soon-lightgrey?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Coming to Chrome Web Store" height="50">

*Currently in review. Check back soon!*

---

### 🛠️ **Install from Source**

Want to build it yourself? Follow these steps:

#### **1. Clone the Repository**
```bash
git clone https://github.com/YOUR_USERNAME/LockedIn.git
cd LockedIn
```

#### **2. Build the Extension**

**Linux/macOS:**
```bash
chmod +x build.sh
./build.sh
```

**Windows:**
```powershell
.\build.ps1
```

#### **3. Load in Browser**

**Firefox:**
1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `lockedin-1.0.2.zip`

**Chrome:**
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the project folder

---

## 🎨 Screenshots

<table>
<tr>
<td align="center">
<img src="https://via.placeholder.com/300x200?text=Clean+Homepage" alt="Clean Homepage" width="300"/>
<br/>
<b>Clean Homepage</b><br/>
<sub>No distracting feed</sub>
</td>
<td align="center">
<img src="https://via.placeholder.com/300x200?text=Focused+Watching" alt="Focused Video" width="300"/>
<br/>
<b>Focused Video Watching</b><br/>
<sub>No recommendations sidebar</sub>
</td>
</tr>
</table>

---

## 🚀 How It Works

### **Content Script** (`content.js`)
- 🎯 Runs on all YouTube pages
- 🔄 Dynamically hides elements based on your preferences
- 💾 Syncs settings across devices using browser storage
- ⚡ Uses debounced MutationObserver for optimal performance

### **Popup UI** (`popup/`)
- 🎛️ Simple toggle switches for each feature
- 💾 Auto-save preferences
- 🌐 Settings sync across all your devices
- 🎨 Clean, minimal design

### **Privacy First** 🔒
- ✅ No data collection
- ✅ No analytics or tracking
- ✅ No external requests
- ✅ All processing happens locally
- ✅ Settings stored in your browser only

---

## 📁 Project Structure

```
LockedIn/
├── 📄 manifest.json       # Extension configuration
├── 📜 content.js          # Main functionality (YouTube element hiding)
├── 🖼️  icons/             # Extension icons
│   ├── icon48.png         # 48x48 icon
│   └── iconFull.png       # Full-size icon
├── 🎨 popup/              # Popup UI
│   ├── popup.html         # UI structure
│   ├── popup.css          # Styling
│   └── popup.js           # Settings logic
├── 🔧 build.sh            # Build script (Linux/macOS)
├── 🔧 build.ps1           # Build script (Windows)
└── 📖 README.md           # You are here!
```

---

## 🛠️ Development

### **No Build Tools Required!**

This extension is built with **zero dependencies**:

- ✅ **Pure JavaScript** - No webpack, Rollup, or Parcel
- ✅ **No Transpilers** - No Babel, TypeScript compilation
- ✅ **No Minification** - Code is readable and auditable
- ✅ **No External Libraries** - Just vanilla JS and browser APIs

**What you see is what you get.** All code is human-readable and matches the packaged extension exactly.

### **Tech Stack**
- 🌐 **Manifest V3** - Modern extension architecture
- 💾 **browser.storage.sync** - Cross-device settings sync
- 👁️ **MutationObserver** - Dynamic content detection
- 🎨 **CSS3** - Modern styling
- ⚡ **Vanilla JavaScript** - No frameworks

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

### **How to Contribute:**

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### **Development Setup:**
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/LockedIn.git
cd LockedIn

# Make changes to the code
# Test by loading as temporary extension in Firefox/Chrome

# Build
./build.sh

# Test the built extension
```

---

## 🐛 Bug Reports

Found a bug? Please [open an issue](https://github.com/YOUR_USERNAME/LockedIn/issues) with:
- 🖥️ Browser & version
- 📝 Steps to reproduce
- 📸 Screenshots (if applicable)
- 🔍 Expected vs actual behavior

---

## 📜 Permissions

This extension requires minimal permissions:

| Permission | Reason |
|------------|--------|
| `storage` | Save your preferences locally |
| `*://www.youtube.com/*` | Access YouTube to hide distracting elements |

**That's it!** No tracking, no data collection, no network requests.

---

## 📊 Changelog

### **Version 1.0.2** - *October 26, 2025*
- 🎨 Updated extension icons with new branding
- ✅ Stable release with optimizations
- 🦊 Published to Firefox Add-ons
- 🌐 Submitted to Chrome Web Store

### **Version 1.0.1** - *October 25, 2025*
- 🐛 Fixed default toggle behavior
- 🛡️ Added comprehensive error handling
- ⚡ Performance improvements with debounced MutationObserver
- 🔄 Improved settings initialization

### **Version 1.0.0** - *October 21, 2025*
- 🎉 Initial release
- ✨ Core YouTube distraction hiding features
- 🎛️ Settings popup with toggle controls
- 💾 Cross-device settings sync

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/YOUR_USERNAME/LockedIn/issues)
- 💡 **Feature Requests:** [GitHub Discussions](https://github.com/YOUR_USERNAME/LockedIn/discussions)
- 📧 **Contact:** kartik@lockedin.com

---

## 🌟 Acknowledgments

Built with ❤️ for people who want to focus.

**Special thanks to:**
- The open-source community
- Firefox Add-ons reviewers
- Early users and testers

---

## 🔍 For Mozilla/Chrome Reviewers

**Build Verification:**

This extension is designed for easy review:

✅ **No minification or obfuscation** - All code is readable  
✅ **No build tools required** - Pure JavaScript, no bundlers  
✅ **No external dependencies** - Zero npm packages  
✅ **Complete source included** - What you see is what you get  
✅ **Reproducible builds** - Run `./build.sh` to verify  

**Build Instructions:**
```bash
# Linux/macOS
./build.sh

# Windows
.\build.ps1
```

The generated `lockedin-1.0.2.zip` will match the submitted package byte-for-byte.

---

<div align="center">

**[⬆ Back to Top](#-lockedin)**

Made with ☕ by **[Kartik](https://github.com/YOUR_USERNAME)**

⭐ **Star this repo** if it helps you stay focused!

</div>
