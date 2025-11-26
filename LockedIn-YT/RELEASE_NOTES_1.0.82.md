# LockedIn v1.0.82 Release Notes

**Release Date:** November 26, 2025

---

## Highlights

- **Break Timer 2.0** – Take a Break now runs entirely through a background alarm so the countdown survives popup closes, browser restarts, and instantly re-enables focus mode when time is up.
- **“Time’s Up” Flash Overlay** – Every open YouTube tab now flashes a high-contrast overlay and force-redirects to `youtube.com` the moment a break expires.
- **Navigation Hygiene** – Instant CSS hides the Home and Shorts tabs in both the guide and mini-guide as soon as YouTube renders, while sub-toggles stay hidden unless their parent switch is active.
- **Custom Feed Pause** – The custom uploader is temporarily disabled with a Coming Soon banner so the homepage placeholder stays stable while the feature is rebuilt.

## Improvements & Fixes

- Break countdown text in the popup header resets automatically after the timer fires, even if the popup was closed mid-break.
- Redirect-to-Subscriptions and Hide Playlists sub-toggles now mirror their parent switches so the menu stays tidy and avoids stray redirects.
- Forced redirect to the YouTube homepage after a break prevents lingering on watch pages once the flash overlay appears.
- Instant nav-hiding CSS uses new root attributes so tabs never “blink” back into view when pages rerender.
- Custom feed upload inputs are disabled client-side, eliminating the partially uploaded gallery bug.

---

## Package Information

**Extension Package:**
- File: `lockedin-1.0.82.zip`
- Size: 235 KB
- Platform: Firefox (primary target) – Chromium builds also supported via same ZIP

**Source Code:**
- File: `lockedin-source-1.0.82.zip`
- Size: 4.2 MB
- Includes: All source files, documentation, build scripts, and deployment notes

---

## Deployment Checklist

- [x] manifest.json bumped to 1.0.82
- [x] README badge + changelog updated with break timer overhaul details
- [x] build.sh / build.ps1 output filenames = `lockedin-1.0.82.zip`
- [x] DEPLOY_NOW.md + DEPLOYMENT_1.0.82.md refreshed
- [x] Documentation set (CHECKLIST, SOURCE_SUBMISSION, SUBMISSION_GUIDE)
- [x] Extension package built (lockedin-1.0.82.zip)
- [x] Source package created (lockedin-source-1.0.82.zip)

All deployment prerequisites checked.

---

## Release Notes for Store Submission

### Title
```
Version 1.0.82 - Break Timer Overhaul
```

### Description
```
New
- Take a Break now runs in the background so it always reenables focus mode when the countdown ends.
- A bright “Time’s Up” overlay and instant redirect to youtube.com snap you out of breaks immediately.
- Popup housekeeping: redirect sub-toggle only appears when Hide Feed is on, and the custom feed uploader now shows a Coming Soon card.

Improvements
- Home/Shorts navigation targets are hidden instantly with new CSS root flags, eliminating flicker.
- Break countdown text and logo states reset reliably even if the popup is closed mid-break.
```

---
## 🔍 Testing Performed

- Break timer start/stop flow while closing + reopening the popup – pass
- Background alarm triggers overlay + forced redirect across multiple tabs – pass
- Redirect-to-Subscriptions sub-toggle visibility + auto-disable – pass
- Instant Home/Shorts navigation hiding on homepage, subscriptions, and search – pass
- Custom feed uploader disabled state + Coming Soon messaging – pass
- Regression on existing toggles (feed, Shorts, sidebar, comments, autoplay) – pass

---

## GitHub Release Template

### Title
```
v1.0.82 - Break Timer Overhaul
```

### Description
```markdown
## What's New
- **Background Break Timer** – Take a Break now uses a background alarm so it survives popup closes and automatically reenables focus mode when time is up.
- **Time's Up Overlay** – Every YouTube tab flashes a warning and immediately jumps back to the homepage once your break expires.
- **Popup Housekeeping** – Redirect sub-toggle only appears with Hide Feed, while the custom feed uploader now shows a Coming Soon card instead of a broken form.

## Improvements
- Instant CSS hides Home/Shorts navigation items before YouTube finishes rendering, eliminating distracting flicker.
- Break countdown text/branding resets automatically after each timer.
- Custom feed uploader disabled to avoid corrupt placeholders.

## Downloads
- Extension: `lockedin-1.0.82.zip`
- Source: `lockedin-source-1.0.82.zip`

See [CHANGELOG.md](CHANGELOG.md#1082---2025-11-26) for more details.
```

---

## Microsoft Edge Certification Notes

```
Version 1.0.82 focuses on the Take a Break workflow:
1. Added background alarm handling plus lightweight messaging (alarms API already declared).
2. Introduced a client-side overlay + redirect when breaks end; no new permissions or network calls.
3. Popup UI now hides dependent toggles until parent switches are enabled.
4. Custom feed uploader disabled; only static messaging is shown.

Testing performed on Firefox Developer Edition and Edge Beta to ensure parity.
No new host or optional permissions were requested. Source archive includes full documentation and build scripts.
```

---

**Prepared by:** LockedIn Team  
**Date:** November 26, 2025  
**Status:** Ready for release
