# ✅ Submission Checklist (Current)

Use this checklist before any store submission.

## 1) Version and build

- [ ] `src/manifest.json` version updated for this release
- [ ] `CHANGELOG.md` updated
- [ ] Build passes on your platform:
  - [ ] `./scripts/build.sh` (Linux/macOS)
  - [ ] `./scripts/build.ps1` (Windows)
- [ ] Build artifacts exist in `dist/`:
  - [ ] `lockedin-v<version>-firefox.zip`
  - [ ] `lockedin-v<version>-chromium.zip`
  - [ ] `lockedin-v<version>-source.zip`

## 2) Package sanity checks

- [ ] Main package contains expected extension files (manifest, background, content, popup, icons)
- [ ] Source package includes `src/`, `scripts/`, `project-docs/`, and root docs
- [ ] Chromium package is auto-generated with `browser_specific_settings` removed from manifest
- [ ] Firefox package retains `browser_specific_settings` for stable extension ID
- [ ] Both packages use `service_worker` for background script
- [ ] No unexpected private/temp files in ZIPs

## 3) Functional smoke test

- [ ] Load `dist/lockedin-v<version>-firefox.zip` as temporary add-on in Firefox
- [ ] Verify popup opens and toggles save correctly
- [ ] Validate core flows on YouTube:
  - [ ] Homepage/feed controls
  - [ ] Shorts controls
  - [ ] Watch page recommendation/sidebar controls
  - [ ] Search page cleanup
  - [ ] Autoplay controls
  - [ ] Take a Break mode

## 4) Security and privacy

- [ ] No remote code execution (`eval`, dynamic script injection)
- [ ] No new unnecessary permissions
- [ ] No analytics/tracking additions
- [ ] Privacy claims in `PRIVACY.md` still accurate

## 5) Store submission prep

- [ ] Firefox upload file: `lockedin-v<version>-firefox.zip`
- [ ] Source upload file (if requested/recommended): `lockedin-v<version>-source.zip`
- [ ] Chromium-based stores upload file: `lockedin-v<version>-chromium.zip`
- [ ] Reviewer notes prepared (see `SOURCE_SUBMISSION.md`)

## 6) Final release hygiene

- [ ] Git status clean
- [ ] Tag/release notes prepared
- [ ] Post-release sanity check on installed package completed
