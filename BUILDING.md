# Building from Source

If you prefer to build and install manually:

## 1. Clone the repository

```bash
git clone https://github.com/KartikHalkunde/LockedIn-YT.git
cd LockedIn-YT
```

## 2. Build the extension

**Linux/macOS:**
```bash
chmod +x build.sh
./build.sh
```

**Windows (PowerShell):**
```powershell
.\build.ps1
```

## 3. Load in your browser

### Firefox:
- Navigate to `about:debugging#/runtime/this-firefox`
- Click "Load Temporary Add-on"
- Select the generated `lockedin-1.0.5.zip` file

### Edge/Chrome:
- Go to `edge://extensions/` (Edge) or `chrome://extensions/` (Chrome)
- Enable "Developer mode" (bottom left for Edge, top right for Chrome)
- Click "Load unpacked"
- Select the project folder

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
└── README.md              # Main documentation
```

---

## Tech Stack

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

---

## For Extension Reviewers

If you're reviewing this extension for Mozilla, Edge, or Chrome:

### Build Verification

This extension uses no build tools, minification, or obfuscation. To verify:

```bash
# Clone the repo
git clone https://github.com/KartikHalkunde/LockedIn-YT.git
cd LockedIn-YT

# Build (just creates a zip file)
./build.sh

# The resulting lockedin-1.0.5.zip contains the exact same code
# you see in the repository - no compilation or transformation
```

### What to expect:
- No minified code
- No external dependencies
- No build pipeline
- Human-readable source code
- Deterministic builds (same input = same output)

All code is vanilla JavaScript and can be reviewed directly in the repository.
