# Changelog

All notable changes to the LockedIn extension will be documented in this file.

## [1.0.82] - 2025-11-26
### Added
- Background alarm + messaging pipeline for Take a Break so timers keep running even if the popup or browser is closed and every YouTube tab knows when focus mode is back on.
- High-contrast “Time’s Up” overlay that flashes across each YouTube tab and force-redirects back to `youtube.com` the moment a break ends.

### Changed
- Take a Break UI now revolves around 5/10/15 minute presets, shows a live countdown in the header, and automatically restores the normal logo when the timer expires.
- Redirect-to-Subscriptions and Hide Playlists sub-toggles only appear while their parent toggles are enabled, keeping the popup compact and preventing stray redirects.
- Instant CSS now hides Home/Shorts navigation targets in both the full guide and mini guide as soon as the page loads, eliminating the previous “blink” of distraction.

### Fixed
- Break timers could get stuck disabled if the popup closed mid-session; the new background alarm + overlay flow clears the state reliably.
- Break countdown text sometimes lingered after returning to focus; it now resets the header instantly.
- Custom feed uploader is temporarily disabled with a Coming Soon notice to prevent partially uploaded galleries from corrupting the homepage placeholder.

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