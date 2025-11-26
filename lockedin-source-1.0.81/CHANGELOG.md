# Changelog

All notable changes to the LockedIn extension will be documented in this file.

## [1.0.81] - 2025-11-26
### Added
- Custom Feed Images section that lets users upload up to five memes with in-popup previews and deletion controls
- Stats dashboard (time saved, Shorts avoided, days active) with animated counters and menu integration
- “Take a Break” timer that automatically re-enables the extension after 5/10/15 minutes

### Changed
- Refined light-mode palette and header logo handling so the LightOff variant appears whenever the extension is disabled
- Improved popup menu flow with redirect-to-subs sub-toggle visibility, break timer messaging, and stats animation trigger
- Homepage placeholder now prioritizes custom uploads and uses blob URLs to stay compatible with stricter CSPs

### Fixed
- Addressed custom meme upload race conditions so previews render instantly and gallery updates even if storage briefly fails
- Ensured custom image data loads on YouTube by converting data URLs to blob URLs with cleanup
- Resolved cases where power state toggles failed to update icons or reapply hideFeed logic across tabs

## [1.0.75] - 2025-11-15
### Fixed
- Fixed sidebar recommendations not hiding on YouTube livestream pages
- Improved meme overlay z-index to prevent covering search suggestions and menus
- Fixed Shorts toggle cross-interference between homepage and search pages
- Enhanced livestream video renderer detection (ytd-compact-autoplay-renderer)
- Added comprehensive container hiding for all livestream recommendation types

### Changed
- Strengthened sidebar hiding logic for better livestream compatibility
- Improved page-type detection for more reliable toggle behavior

## [1.0.7] - 2025-11-05
### Added
- New toggle to hide/show playlists in the video sidebar
- More granular control over recommended videos

### Changed
- Improved recommended videos toggle logic - now only hides recommended videos while keeping playlists visible
- Enhanced UI scaling for better visibility
- Optimized popup interface dimensions

### Fixed
- Fixed video sidebar behavior to maintain playlist visibility when hiding recommended videos

## [1.0.6] - Previous Release
### Added
- New organized UI with 4 logical groups
- Power button to quickly toggle entire extension
- Separate controls for homepage & search Shorts

### Changed
- More compact and organized popup interface
- Enhanced UI elements and toggles
- Improved user feedback and visual indicators