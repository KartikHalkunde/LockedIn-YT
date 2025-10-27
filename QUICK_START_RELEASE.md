# Quick Start: Creating Your First Release

This guide will help you create your first GitHub release for LockedIn v1.0.2.

## What are GitHub Releases?

GitHub Releases are a way to package and distribute versions of your software. Each release:
- Has a version number (like v1.0.2)
- Includes release notes describing what changed
- Can attach downloadable files (like your extension ZIP)
- Appears on your repository's main page
- Makes it easy for users to download specific versions

## Creating the v1.0.2 Release

Since your extension is already at version 1.0.2, here's how to create the first release:

### Option 1: Automatic Release (Recommended)

The repository is now set up for automatic releases. Simply push a tag:

```bash
# Make sure all changes are committed
git add -A
git commit -m "Add release automation"
git push origin main

# Create and push the version tag
git tag -a v1.0.2 -m "Release version 1.0.2"
git push origin v1.0.2
```

That's it! GitHub Actions will automatically:
1. Build your extension
2. Create a release
3. Attach the `lockedin-1.0.2.zip` file
4. Add release notes from `RELEASE_NOTES.md`

Check the progress at: https://github.com/KartikHalkunde/LockedIn-YT/actions

### Option 2: Manual Release (If needed)

If you prefer to do it manually:

1. **Build the extension**:
   ```bash
   ./build.sh
   ```

2. **Go to GitHub**:
   - Visit: https://github.com/KartikHalkunde/LockedIn-YT/releases/new

3. **Fill in the release form**:
   - **Tag**: Create a new tag `v1.0.2`
   - **Title**: `LockedIn v1.0.2`
   - **Description**: Copy the content from `RELEASE_NOTES.md`
   - **Attach file**: Upload the `lockedin-1.0.2.zip` file

4. **Publish**: Click "Publish release"

## For Future Releases

When you're ready to release version 1.0.3 (or any future version):

1. **Update the version** in `manifest.json`:
   ```json
   {
     "version": "1.0.3"
   }
   ```

2. **Update CHANGELOG.md** with your changes

3. **Update RELEASE_NOTES.md** with details about this version

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

6. **Wait for GitHub Actions** to build and publish your release automatically!

## Understanding Version Numbers

Follow [Semantic Versioning](https://semver.org/):

- **1.0.X** (Patch): Bug fixes, small improvements
  - Example: 1.0.2 → 1.0.3
  
- **1.X.0** (Minor): New features, backwards-compatible
  - Example: 1.0.3 → 1.1.0
  
- **X.0.0** (Major): Breaking changes, major rewrites
  - Example: 1.1.0 → 2.0.0

## Troubleshooting

**Problem**: "Tag already exists"
```bash
# Delete the tag locally and remotely
git tag -d v1.0.2
git push --delete origin v1.0.2

# Recreate it
git tag -a v1.0.2 -m "Release version 1.0.2"
git push origin v1.0.2
```

**Problem**: "GitHub Actions failed"
- Check: https://github.com/KartikHalkunde/LockedIn-YT/actions
- Common causes: Version mismatch between tag and manifest.json

**Problem**: "Build script fails"
- Make sure you're in the project directory
- Check that all required files exist
- On Linux/Mac: `chmod +x build.sh`

## Need More Help?

- Read the full guide: `RELEASE_GUIDE.md`
- Check GitHub's documentation: https://docs.github.com/en/repositories/releasing-projects-on-github
- Open an issue: https://github.com/KartikHalkunde/LockedIn-YT/issues

---

**Ready to create your first release?** Just run:

```bash
git tag -a v1.0.2 -m "Release version 1.0.2"
git push origin v1.0.2
```

Then check https://github.com/KartikHalkunde/LockedIn-YT/releases in a few minutes!
