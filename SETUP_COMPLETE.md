# Release Setup Complete! 🎉

Your LockedIn-YT project is now fully set up for creating releases.

## What Was Added

### 1. Automated Release Workflow
**File**: `.github/workflows/release.yml`

A GitHub Actions workflow that automatically:
- Builds your extension when you push a version tag
- Verifies the version matches between the tag and manifest.json
- Creates a GitHub release
- Attaches the built ZIP file
- Adds release notes

### 2. Documentation Files

- **QUICK_START_RELEASE.md** - Simple guide for creating your first release (START HERE!)
- **RELEASE_GUIDE.md** - Comprehensive guide covering all release processes
- **CHANGELOG.md** - Track all changes between versions
- **RELEASE_NOTES.md** - Template for describing what's in each release

### 3. Updated Build Scripts

Both `build.sh` and `build.ps1` now:
- Automatically extract the version from `manifest.json`
- Build the ZIP file with the correct version number
- No need to manually update version strings in multiple places

### 4. Updated README

Added sections about:
- How to download releases
- How to create releases (for maintainers)
- Link to quick start guide

## How to Create Your First Release (v1.0.2)

Since your extension is already at version 1.0.2, here's how to create the first release:

### Quick Method (Recommended)

```bash
# Make sure all changes are committed and pushed
git add -A
git commit -m "Prepare for first release"
git push origin main

# Create and push the version tag
git tag -a v1.0.2 -m "Release version 1.0.2"
git push origin v1.0.2
```

That's it! In a few minutes:
1. Check https://github.com/KartikHalkunde/LockedIn-YT/actions to see the build progress
2. Check https://github.com/KartikHalkunde/LockedIn-YT/releases to see your release

### What Happens Automatically

When you push the tag, GitHub Actions will:
1. ✅ Check out your code
2. ✅ Verify version numbers match
3. ✅ Run the build script
4. ✅ Create `lockedin-1.0.2.zip`
5. ✅ Create a GitHub release
6. ✅ Attach the ZIP file
7. ✅ Add release notes from `RELEASE_NOTES.md`

## Creating Future Releases

For version 1.0.3 (or any future version):

1. **Update version in `manifest.json`**:
   ```json
   {
     "version": "1.0.3"
   }
   ```

2. **Update `CHANGELOG.md`** with your changes

3. **Update `RELEASE_NOTES.md`** with details about this version

4. **Commit and push**:
   ```bash
   git add manifest.json CHANGELOG.md RELEASE_NOTES.md
   git commit -m "Bump version to 1.0.3"
   git push origin main
   ```

5. **Create and push the tag**:
   ```bash
   git tag -a v1.0.3 -m "Release version 1.0.3"
   git push origin v1.0.3
   ```

6. **Wait for the release** - GitHub Actions does the rest!

## Version Numbering Guide

Follow [Semantic Versioning](https://semver.org/):

- **Major (X.0.0)**: Breaking changes
  - Example: 1.x.x → 2.0.0
  
- **Minor (x.X.0)**: New features (backwards-compatible)
  - Example: 1.0.x → 1.1.0
  
- **Patch (x.x.X)**: Bug fixes
  - Example: 1.0.2 → 1.0.3

## Files to Update for Each Release

When releasing a new version, update these files:

1. ✅ `manifest.json` - Version number
2. ✅ `CHANGELOG.md` - Add entry for new version
3. ✅ `RELEASE_NOTES.md` - Describe this specific release

The build scripts and GitHub Actions handle everything else!

## Where to Go From Here

1. **Read the Quick Start**: [QUICK_START_RELEASE.md](QUICK_START_RELEASE.md)
2. **Create your first release**: Follow the steps above
3. **Bookmark for future releases**: [RELEASE_GUIDE.md](RELEASE_GUIDE.md)

## Common Questions

**Q: Do I need to manually create the ZIP file?**
A: No! GitHub Actions builds it automatically when you push a tag.

**Q: What if I mess up a release?**
A: You can delete the tag and release, then recreate them. See the troubleshooting section in RELEASE_GUIDE.md.

**Q: Can I still create releases manually?**
A: Yes! The RELEASE_GUIDE.md has instructions for manual releases too.

**Q: Where do people download releases?**
A: From your GitHub releases page: https://github.com/KartikHalkunde/LockedIn-YT/releases

**Q: Do I need to update the build scripts anymore?**
A: No! They now automatically read the version from manifest.json.

## Testing the Workflow

Before creating your real v1.0.2 release, you could test with a beta version:

```bash
# Update manifest.json to "1.0.3-beta"
git commit -am "Test release"
git tag -a v1.0.3-beta -m "Test release"
git push origin v1.0.3-beta
```

Then check if the workflow works. If it does, you can delete the beta release and tag, then create the real v1.0.2 release.

## Need Help?

- **Quick questions**: Check [QUICK_START_RELEASE.md](QUICK_START_RELEASE.md)
- **Detailed info**: See [RELEASE_GUIDE.md](RELEASE_GUIDE.md)
- **GitHub Actions issues**: Check https://github.com/KartikHalkunde/LockedIn-YT/actions
- **Stuck?**: Open an issue on GitHub

---

**You're all set!** Your release workflow is ready to go. Happy releasing! 🚀
