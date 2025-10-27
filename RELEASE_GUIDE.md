# Release Guide

This guide explains how to create releases for the LockedIn browser extension.

## Prerequisites

Before creating a release, ensure:
- All changes are committed and pushed to the main branch
- The extension has been tested locally
- The version number has been updated in `manifest.json`

## Release Process

### Method 1: Automated Release (Recommended)

The automated release process uses GitHub Actions to build and publish releases.

#### Steps:

1. **Update the version number** in `manifest.json`:
   ```json
   {
     "version": "1.0.3"
   }
   ```

2. **Update CHANGELOG.md** with the new version and changes (see below)

3. **Create release notes** in `RELEASE_NOTES.md` with details about this version:
   ```markdown
   ## What's New in v1.0.3
   
   ### Features
   - Add new feature descriptions here
   
   ### Bug Fixes
   - List bug fixes here
   
   ### Improvements
   - List improvements here
   ```

4. **Commit your changes**:
   ```bash
   git add manifest.json CHANGELOG.md RELEASE_NOTES.md
   git commit -m "Bump version to 1.0.3"
   git push origin main
   ```

5. **Create and push a git tag**:
   ```bash
   git tag -a v1.0.3 -m "Release version 1.0.3"
   git push origin v1.0.3
   ```

6. **Wait for the release** - GitHub Actions will automatically:
   - Verify the version matches between the tag and manifest.json
   - Build the extension ZIP file
   - Create a GitHub release with the built artifact
   - Attach release notes from RELEASE_NOTES.md

7. **Check the release** at: https://github.com/KartikHalkunde/LockedIn-YT/releases

### Method 2: Manual Release

If you prefer to create releases manually:

1. **Update version** in `manifest.json`

2. **Build the extension**:
   ```bash
   ./build.sh  # or build.ps1 on Windows
   ```

3. **Create a tag**:
   ```bash
   git tag -a v1.0.3 -m "Release version 1.0.3"
   git push origin v1.0.3
   ```

4. **Create release on GitHub**:
   - Go to https://github.com/KartikHalkunde/LockedIn-YT/releases/new
   - Select the tag you just created (v1.0.3)
   - Title: `LockedIn v1.0.3`
   - Description: Copy content from RELEASE_NOTES.md
   - Upload the built `lockedin-1.0.3.zip` file
   - Click "Publish release"

## Version Numbering

This project follows [Semantic Versioning](https://semver.org/):

- **Major version (X.0.0)**: Incompatible changes or major rewrites
- **Minor version (0.X.0)**: New features in a backwards-compatible manner
- **Patch version (0.0.X)**: Backwards-compatible bug fixes

Examples:
- `1.0.0` → `1.0.1`: Bug fix
- `1.0.1` → `1.1.0`: New feature added
- `1.1.0` → `2.0.0`: Major breaking change

## Checklist for Each Release

- [ ] Update version in `manifest.json`
- [ ] Update version in `build.sh` (line 9 and 14)
- [ ] Update version in `build.ps1` (if applicable)
- [ ] Update `CHANGELOG.md` with changes
- [ ] Create/update `RELEASE_NOTES.md` for this release
- [ ] Update version badge in `README.md` (line 11)
- [ ] Update ZIP filename in `README.md` (line 98)
- [ ] Test the extension locally
- [ ] Commit all changes
- [ ] Create and push git tag
- [ ] Verify release on GitHub
- [ ] Update browser store listings (Firefox Add-ons, Chrome Web Store)

## Creating Your First Release (v1.0.2)

Since the current version is 1.0.2 and no releases exist yet, here's how to create the first release:

1. **Create RELEASE_NOTES.md**:
   ```bash
   cat > RELEASE_NOTES.md << 'EOF'
   ## What's New in v1.0.2
   
   ### Features
   - Updated extension icons with new branding
   - Hide Homepage Feed
   - Hide Explore Pages
   - Hide Recommended Videos
   - Hide End Screen Cards
   - Hide Live Chat
   - Block Shorts on homepage
   - Removes Shorts Tab
   - Disable Autoplay
   
   ### Improvements
   - Performance optimizations
   - Stable release with improved reliability
   
   This is the first stable release of LockedIn for YouTube!
   EOF
   ```

2. **Create the tag and push**:
   ```bash
   git tag -a v1.0.2 -m "Release version 1.0.2"
   git push origin v1.0.2
   ```

3. **Watch the release being created** at:
   https://github.com/KartikHalkunde/LockedIn-YT/actions

## Troubleshooting

### Tag already exists
If you need to update a tag:
```bash
git tag -d v1.0.3                    # Delete locally
git push --delete origin v1.0.3      # Delete remotely
git tag -a v1.0.3 -m "Release 1.0.3" # Create again
git push origin v1.0.3               # Push again
```

### Build fails
- Ensure all required files exist (check build.sh for the list)
- Verify manifest.json is valid JSON
- Check file permissions on build.sh

### Version mismatch error
The tag version must match the version in manifest.json:
- Tag: `v1.0.3`
- manifest.json: `"version": "1.0.3"`

## Additional Resources

- [GitHub Releases Documentation](https://docs.github.com/en/repositories/releasing-projects-on-github)
- [Semantic Versioning](https://semver.org/)
- [Firefox Extension Publishing](https://extensionworkshop.com/documentation/publish/)
- [Chrome Extension Publishing](https://developer.chrome.com/docs/webstore/publish/)
