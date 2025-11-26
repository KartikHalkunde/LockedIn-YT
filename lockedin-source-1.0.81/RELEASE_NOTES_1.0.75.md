# LockedIn v1.0.75 Release Notes

**Release Date:** November 15, 2025

---

## 🐛 Bug Fixes

### Critical Fixes
- **Fixed livestream sidebar bug**: Sidebar recommendations now properly hide on YouTube livestream pages
- **Fixed meme overlay z-index**: Meme images no longer cover search suggestions, menus, or interactive UI elements
- **Fixed Shorts toggle interference**: Homepage and search Shorts toggles now work independently without cross-page interference

### Technical Improvements
- Enhanced livestream video renderer detection (`ytd-compact-autoplay-renderer`, `ytd-continuation-item-renderer`)
- Improved page-type detection for more reliable toggle behavior across YouTube's SPA navigation
- Strengthened sidebar hiding logic with comprehensive container detection
- Better mobile support with improved layout detection

---

## 📦 Package Information

**Extension Package:**
- File: `lockedin-1.0.75.zip`
- Size: 193 KB
- Platform: Firefox, Edge, Chrome (ready)

**Source Code:**
- File: `lockedin-source-1.0.75.zip`
- Size: 3.9 MB
- Includes: All source files, documentation, build scripts

---

## 🚀 Deployment Checklist

- [x] Version updated in manifest.json (1.0.75)
- [x] Version updated in README.md badge
- [x] Version updated in build scripts (build.sh, build.ps1)
- [x] CHANGELOG.md updated with v1.0.75 changes
- [x] DEPLOY_NOW.md updated
- [x] BUILDING.md updated
- [x] Extension package built (lockedin-1.0.75.zip)
- [x] Source package created (lockedin-source-1.0.75.zip)

---

## 📝 Release Notes for Store Submission

### Title
```
Version 1.0.75 - Livestream Sidebar & Toggle Fixes
```

### Description
```
Bug Fixes:
• Fixed sidebar recommendations not hiding on YouTube livestreams
• Fixed meme overlay covering search suggestions and UI elements
• Fixed Shorts toggle interference between homepage and search pages
• Enhanced livestream compatibility with improved renderer detection

Technical Improvements:
• Strengthened sidebar hiding logic for better livestream support
• Improved page-type detection for more reliable toggle behavior
• Better mobile layout detection and support
• Comprehensive container hiding for all livestream recommendation types
```

---

## 🔍 Testing Performed

✅ Regular videos - sidebar hiding works
✅ Livestream pages - sidebar now properly hides
✅ Homepage Shorts toggle - works independently
✅ Search Shorts toggle - works independently
✅ Meme overlay - stays behind UI elements
✅ Mobile compatibility - improved detection
✅ All existing features - functional

---

## 📊 Comparison with Previous Version

| Feature | v1.0.7 | v1.0.75 |
|---------|--------|---------|
| Livestream sidebar hiding | ❌ Broken | ✅ Fixed |
| Meme overlay z-index | ⚠️ Issues | ✅ Fixed |
| Shorts toggle independence | ⚠️ Interference | ✅ Fixed |
| Mobile support | ✅ Good | ✅ Better |
| Package size | 192 KB | 193 KB |

---

## 🌐 GitHub Release

### Title
```
v1.0.75 - Livestream & Toggle Fixes
```

### Description
```markdown
## What's Fixed

- **Livestream sidebar bug**: Recommended videos now properly hide on livestream pages
- **Meme overlay z-index**: Fixed positioning so memes don't cover search suggestions or menus
- **Shorts toggle conflicts**: Homepage and search Shorts toggles now work independently

## Technical Details

This release focuses on stability and reliability improvements:

- Enhanced livestream detection with `ytd-compact-autoplay-renderer` support
- Added `ytd-continuation-item-renderer` targeting for dynamic content
- Improved page-type detection to prevent toggle cross-interference
- Lowered meme z-index from max value to 0 for proper layering
- Page-scoped instant CSS gating for better SPA navigation support

## Download

- **Extension Package**: `lockedin-1.0.75.zip` (193 KB)
- **Source Code**: `lockedin-source-1.0.75.zip` (3.9 MB)

See [CHANGELOG.md](CHANGELOG.md) for full version history.
```

---

## 💬 LinkedIn Post Caption

```
🔒 LockedIn v1.0.75 is now available!

This update fixes critical issues for a smoother experience:
• ✅ Livestream sidebar recommendations now hide properly
• ✅ Meme overlays no longer cover UI elements
• ✅ Homepage & search Shorts toggles work independently

Stay focused on what matters! 🎯

Available on:
🦊 Firefox Add-ons
🌐 Microsoft Edge Add-ons
(Chrome coming soon!)

#ProductivityTools #BrowserExtension #OpenSource #WebDevelopment
```

---

## 📧 Microsoft Edge Certification Notes

```
Technical Notes for Certification Team:

Version 1.0.75 includes bug fixes and stability improvements:

1. Livestream Compatibility Fix
   - Added support for ytd-compact-autoplay-renderer elements
   - Enhanced sidebar hiding logic for livestream pages
   - Improved dynamic content container detection

2. UI Layer Fix
   - Adjusted meme placeholder z-index to prevent overlay issues
   - Changed from z-index: 2147483647 to z-index: 0
   - Maintains pointer-events: none for non-interactive display

3. Toggle Reliability
   - Implemented page-scoped instant CSS gating
   - Added isYouTubeHomePage() and isYouTubeSearchPage() detection
   - Prevents cross-page toggle interference

Testing performed:
- All features verified on Edge Canary, Dev, and Stable
- No new permissions required
- Backwards compatible with user settings
- No breaking changes to existing functionality

File changes:
- content.js: Enhanced selectors and page detection logic
- manifest.json: Version bump only (1.0.7 → 1.0.81)

Total package size: 193 KB (1 KB increase due to code additions)
```

---

**Prepared by:** Development Team  
**Date:** November 15, 2025  
**Status:** ✅ Ready for Release
