# Quick Submission Guide

## 1) Build packages

### Linux/macOS
```bash
./scripts/build.sh
```

### Windows (PowerShell)
```powershell
.\scripts\build.ps1
```

Generated files are in `dist/`:

- `lockedin-v<version>-firefox.zip`
- `lockedin-v<version>-chromium.zip`
- `lockedin-v<version>-source.zip`

## 2) Smoke test in Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select `dist/lockedin-v<version>-firefox.zip`
4. Open YouTube and verify core toggles

## 3) Submit to AMO

1. Go to https://addons.mozilla.org/developers/addon/submit/upload-listed
2. Upload `dist/lockedin-v<version>-firefox.zip`
3. If requested/recommended, upload `dist/lockedin-v<version>-source.zip`
4. Add reviewer notes from `SOURCE_SUBMISSION.md`

## 4) Submit to Chromium-based stores

- Upload `dist/lockedin-v<version>-chromium.zip`

## 5) Common pitfalls

- Version mismatch between listing and `src/manifest.json`
- Uploading old ZIPs from outside `dist/`
- Missing reviewer notes when source package is attached
