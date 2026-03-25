# Building from Source

This project builds directly from the `src/` folder and outputs packages to `dist/`.

## 1) Clone

```bash
git clone https://github.com/KartikHalkunde/LockedIn-YT.git
cd LockedIn-YT
```

## 2) Build

### Linux/macOS
```bash
chmod +x scripts/build.sh
./scripts/build.sh
```

### Windows (PowerShell)
```powershell
.\scripts\build.ps1
```

## 3) Build outputs

Generated in `dist/` using the version from `src/manifest.json`:

- `lockedin-v<version>-firefox.zip` (Firefox package)
- `lockedin-v<version>-chromium.zip` (Chromium package)
- `lockedin-v<version>-source.zip` (source package)

## 4) Load for local testing

### Firefox
- Open `about:debugging#/runtime/this-firefox`
- Select **Load Temporary Add-on**
- Choose `dist/lockedin-v<version>-firefox.zip`

### Chrome / Edge (Chromium)
- Open `chrome://extensions/` or `edge://extensions/`
- Enable Developer Mode
- Click **Load unpacked**
- Extract `dist/lockedin-v<version>-chromium.zip` to a folder and select that folder

## Current project layout

```text
LockedIn-YT/
├── src/                 # Single source of truth for all extension code
├── scripts/             # Build scripts (bash + powershell)
├── dist/                # Generated ZIP packages
├── project-docs/        # Build/submission docs
└── docs/                # Public website/docs assets
```

## How the build works

- **Firefox**: Zips `src/` directly (uses `service_worker` + keeps `browser_specific_settings`)
- **Chrome**: Creates temporary folder, copies `src/`, removes Firefox-specific metadata, then zips
- **Key difference**: Chrome version has `browser_specific_settings` block removed from manifest
- Both versions use `service_worker` for background script (Manifest V3 standard)

## Notes

- No minification or obfuscation is used.
- Build scripts package existing files; there is no bundler/transpiler pipeline.
- A temporary `temp-chrome-build/` folder may be created during Chromium packaging and is removed automatically.
