# Changelog

All notable changes to the LockedIn extension will be documented in this file.

## [1.0.93] - 2025-12-25
### Added
- Popup footer version display now uses a bundled Santa hat SVG with accessible markup for a holiday refresh

### Changed
- Updated build scripts to package the new assets directory for Firefox/Chrome and Edge distributions

## [1.0.92] - 2025-12-11
### Fixed
- Popup sponsor and feedback texts now render HTML translations properly (no more raw markup shown)
- Carried forward localization robustness for Explore/More from YouTube/Subscriptions and transcript auto-unhide observer improvements

## [1.0.91] - 2025-12-11
### Added
- Expanded localization coverage and URL-based detection for Explore/Trending/More from YouTube/Subscriptions so toggles work across all YouTube languages

### Fixed
- Transcript and engagement panels now auto-unhide in any language via a global observer, keeping the sidebar visible when transcripts load
- Prevented the “You” section from being hidden by the More from YouTube toggle and hardened sidebar section matching

## [1.0.90] - 2025-12-10
### Added
- **Hide Subscriptions Toggle**: New toggle in YouTube Sidebar section to hide subscription recommendations
- **Instant CSS Hiding**: Implemented CSS-based instant hiding for recommendations to eliminate 0.5-1s delay
- **Live Chat Support**: Extended recommendations hiding to work properly in live chat layout (#below container)
- **Engagement Panel Protection**: Transcripts and other engagement panels now properly excluded from sidebar hiding
- **Menu Page UI Enhancements**: Improved spacing, backgrounds, shadows, and overall visual polish
- **Compact Power Dropdown**: Redesigned power dropdown with rounded corners, better positioning, and refined colors
- **Break Timer Update**: Changed timer text from "Back in" to "See you in"
- **Disabled State Icon**: Changed from power icon to ":( " emoticon in red
- **Show Stats Toggle Resize**: Made Show Stats toggle match main page toggle size for consistency
- **Translation Updates**: Added full translations for all new features across 6 languages (English, Spanish, Hindi, Portuguese, French, German)

### Changed
- **Power Dropdown Styling**: More compact design with 96px min-width, repositioned to top-right, rounded corners
- **Menu Header Behavior**: Header now stays visible behind menu with z-index instead of hiding completely
- **Menu Title Styling**: Updated to match feedback page font style (17.5px Segoe UI Semibold)
- **Footer Sizing**: Optimized footer padding and text sizes for better visual balance
- **Hover Colors**: Updated power dropdown hover to lighter grey (rgba 255,255,255,0.85)

### Fixed
- **Transcript Visibility**: Transcripts now always visible regardless of sidebar/recommendations toggles
- **Live Chat Recommendations**: Fixed recommendations not hiding in live chat layout
- **Element Hiding Delay**: Eliminated 0.5-1 second delay when hiding recommendations
- **Stats Accuracy**: Verified and confirmed stats tracking logic is accurate and properly gated by page activity

### Technical
- Added `isEngagementPanel()` helper function to exclude engagement panels from hiding
- Implemented `setInstantRecsHiding()` with dynamic CSS injection for instant hiding
- Extended `hideRecommendedVideos()` to handle #below container for live chat
- Updated all translation dictionaries with new keys

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
