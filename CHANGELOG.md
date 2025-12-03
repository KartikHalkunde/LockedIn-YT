# Changelog

All notable changes to the LockedIn extension will be documented in this file.

## [1.0.85] - 2025-12-03
### Added
- **Granular Video Sidebar Controls**: New sub-toggles under Video Sidebar for Hide Recommended Videos, Hide Shorts, and Hide Playlists
- **hideAll() Function**: When Video Sidebar toggle is ON, hides everything including playlists; sub-toggles work independently when parent is OFF
- **Feedback Page**: New feedback overlay accessible from popup footer
- **Sponsor Page**: New sponsor overlay with GitHub Sponsors, UPI, Firefox Add-ons, and MS Edge links
- **UPI Payment Page**: Dedicated payment page at docs/upi.html with modern glassmorphism design

### Changed
- **Sidebar Shorts Detection**: Enhanced detection using URL patterns, overlay badges, and metadata badges
- **Search Shorts CSS Scoping**: Fixed CSS to only affect search pages, preventing sidebar Shorts from being hidden unintentionally
- **Playlist Preservation**: Sub-toggles now properly preserve playlist content when hiding recommendations or shorts
- **Stats Tracking**: Improved counting for hidden recommendations and shorts

### Fixed
- **Sidebar Restore Bug**: Fixed issue where sidebar wouldn't reappear after turning off Video Sidebar toggle
- **collapseSidebarIfEmpty Typo**: Fixed attribute check from 'sidebar-recommendation' to 'sidebar-recommended'
- **hideAll Restore Logic**: Properly restores all hidden elements when toggle is turned off

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
- New playlist toggle in Video Page section for granular sidebar control
- Smart sidebar detection that preserves playlist panels

### Fixed
- Sidebar recommendations now properly hidden on all video types
- Improved detection of dynamically loaded content

## [1.0.6] - 2025-10-20
### Added
- Break timer with customizable duration
- Custom meme uploader for homepage placeholder
- Stats tracking for blocked content

### Fixed
- Various UI improvements and bug fixes
