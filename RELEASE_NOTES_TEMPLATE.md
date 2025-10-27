# Release Notes Template

Copy this template to `RELEASE_NOTES.md` when preparing a new release, then fill in the details.

---

## What's New in v[VERSION]

### 🎉 New Features
- Add new feature descriptions here
- Each feature on its own line
- Use clear, user-friendly language

### 🐛 Bug Fixes
- Describe what was broken
- Explain how it's fixed now
- Reference issue numbers if applicable (e.g., "Fixes #123")

### ⚡ Improvements
- Performance enhancements
- Code quality improvements
- UI/UX improvements
- Better error handling

### 🔧 Technical Changes
- Dependency updates
- Build system changes
- Internal refactoring

### 🚨 Breaking Changes (if any)
- List any breaking changes
- Explain migration path if needed
- Only for major version updates

---

## Installation

### Firefox Users
Install directly from the [Firefox Add-ons Store](https://addons.mozilla.org/en-US/firefox/addon/lockedin-yt/)

### Chrome Users  
Install from the [Chrome Web Store](https://chrome.google.com/webstore) _(update link when available)_

### Manual Installation
1. Download `lockedin-[VERSION].zip` from this release
2. In Firefox: Go to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on" and select the ZIP file

---

## All Features

✅ Hide Homepage Feed  
✅ Hide Explore Pages  
✅ Hide Recommended Videos  
✅ Hide End Screen Cards  
✅ Hide Live Chat  
✅ Block Shorts on homepage  
✅ Remove Shorts Tab  
✅ Disable Autoplay  

---

## What's Next?

Share your roadmap or upcoming features:
- Feature planned for next release
- Long-term goals
- Community requests being considered

---

## Support

- 🐛 [Report a bug](https://github.com/KartikHalkunde/LockedIn-YT/issues)
- 💡 [Request a feature](https://github.com/KartikHalkunde/LockedIn-YT/discussions)
- 📧 Email: kartikhalkunde26@gmail.com

---

**Full Changelog**: https://github.com/KartikHalkunde/LockedIn-YT/blob/main/CHANGELOG.md

---

## Tips for Writing Release Notes

1. **Be user-focused**: Write for users, not developers
2. **Be specific**: Instead of "Fixed bugs", say "Fixed issue where videos wouldn't hide on slow connections"
3. **Group related changes**: Keep similar items together
4. **Use emojis sparingly**: They can help with scanning but don't overdo it
5. **Thank contributors**: If others contributed, acknowledge them
6. **Link to issues**: Reference GitHub issues for more context
7. **Keep it scannable**: Use bullet points and clear headings
8. **Highlight important changes**: Make breaking changes or major features stand out

## Example Release Notes

Here's an example for v1.1.0:

```markdown
## What's New in v1.1.0

### 🎉 New Features
- **Dark Mode Support**: The popup now respects your browser's dark mode setting
- **Custom Element Hiding**: Advanced users can now hide custom elements using CSS selectors

### 🐛 Bug Fixes
- Fixed issue where recommended videos would reappear after navigating (Fixes #42)
- Resolved popup not saving settings on Firefox Mobile

### ⚡ Improvements
- 30% faster element detection on page load
- Reduced memory usage by 15%
- Updated popup design for better clarity

### 🔧 Technical Changes
- Migrated to Manifest V3 best practices
- Updated MutationObserver debouncing algorithm
- Added comprehensive error logging

---

## Installation

[... rest of template ...]
```
