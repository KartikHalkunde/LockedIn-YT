# LockedIn v1.0.81 Release Notes

**Release Date:** November 26, 2025

---

## Highlights

- **Custom Feed Gallery** - Upload up to five personal images (PNG/JPG/GIF/WebP < 500 KB) that replace the default homepage placeholder when the feed is hidden. Includes inline previews, delete controls, and persistence across sessions.
- **Focus Stats Dashboard** - Optional slide-out panel now displays animated counters for minutes saved, Shorts avoided, and days focused so users can see their progress at a glance.
- **Take a Break Timer** - Temporarily disable the extension for 5/10/15 minutes and let it automatically re-enable itself once the timer expires.

## Improvements & Fixes

- Light mode palette tuned for better contrast along with a clearer disabled-state indicator in the header.
- Custom uploads now render immediately via blob URLs and respect the user-provided order.
- Redirect-to-subs fires instantly whenever homepage feed hiding is active.
- General popup polish plus minor code cleanup noted in CHANGELOG.md.

---

## Package Information

**Extension Package:**
- File: `lockedin-1.0.81.zip`
- Size: 235 KB
- Platform: Firefox (primary target) – Chromium builds also supported via same ZIP

**Source Code:**
- File: `lockedin-source-1.0.81.zip`
- Size: 4.2 MB
- Includes: All source files, documentation, build scripts, and deployment notes

---

## Deployment Checklist

- [x] manifest.json bumped to 1.0.81
- [x] README badge + changelog updated
- [x] build.sh / build.ps1 output filenames = `lockedin-1.0.81.zip`
- [x] DEPLOY_NOW.md + DEPLOYMENT_1.0.81.md refreshed
- [x] Documentation set (CHECKLIST, SOURCE_SUBMISSION, SUBMISSION_GUIDE)
- [x] Extension package built (lockedin-1.0.81.zip)
- [x] Source package created (lockedin-source-1.0.81.zip)

All deployment prerequisites checked.

---

## Release Notes for Store Submission

### Title
```
Version 1.0.81 - Custom Feeds & Focus Stats
```

### Description
```
New
- Replace the homepage grid with up to five custom motivational images.
- See your productivity streak with the optional stats dashboard (minutes saved, Shorts avoided, and days focused).
- Take a Break timer pauses the extension for 5, 10, or 15 minutes before it automatically resumes.

Improvements
- Light mode palette + disabled indicator are cleaner and easier to read.
- Custom uploads now preview instantly and stay pinned to the homepage placeholder.
- Redirect-to-subs triggers immediately when hiding the feed.
```

---
## Testing Performed
## 🔍 Testing Performed

Custom gallery upload/delete flows (PNG, JPG, GIF, WebP) - pass
Stats toggle on/off persistence via `storage.sync` - pass
Break timer start/cancel/resume states - pass
Homepage redirect timing - pass
Popup layout in both dark and light modes - pass
Legacy toggles regression pass (homepage, shorts, video page, search results, sidebar) - pass

---

## GitHub Release Template

### Title
```
v1.0.81 - Custom Feeds & Focus Stats
```

### Description
```markdown
## What's New
- **Custom Feed Images** – Upload a personal meme gallery and display it whenever the homepage feed is hidden.
- **Focus Stats** – Track estimated minutes saved, Shorts avoided, and days focused from the popup menu.
- **Take a Break** – Temporarily pause LockedIn for 5/10/15 minutes; it reactivates automatically.

## Improvements
- Light mode polish, refreshed disabled indicator, and softer accent colors.
- Custom uploads now preview instantly and respect user ordering.
- Redirect-to-subs fires immediately for a snappier distraction-free start.

## Downloads
- Extension: `lockedin-1.0.81.zip`
- Source: `lockedin-source-1.0.81.zip`

See [CHANGELOG.md](CHANGELOG.md#version-108-november-26-2025) for details.
```

---

## Microsoft Edge Certification Notes

```
Version 1.0.81 adds UI-only improvements:
1. Custom feed gallery (client-side image uploads stored via browser storage; no network requests).
2. Stats view and break timer use existing storage permissions; no new capabilities added.
3. Light mode palette and disabled indicator updates touch popup HTML/CSS only.
4. Redirect-to-subs timing fix simply executes earlier in the content script lifecycle.

Testing performed on Firefox Developer Edition and Edge Beta to ensure parity.
No new permissions requested. Source archive includes full documentation and build scripts.
```

---

**Prepared by:** LockedIn Team  
**Date:** November 26, 2025  
**Status:** Ready for release
