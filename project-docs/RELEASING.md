# Releasing LockedIn

This repository uses `scripts/release.sh` to build and publish GitHub releases.

## One-time setup

Install and authenticate the GitHub CLI:

```bash
# Fedora
sudo dnf install gh

# Authenticate once
gh auth login
```

The account must have permission to create releases in the repository.

## Standard release workflow

1. Update the version in `src/manifest.json`.
2. Add a matching entry at the top of `CHANGELOG.md` using the existing format:

   ```markdown
   ## [1.2.1] - 2026-09-01
   ### Added
   - Describe the user-visible change.

   ### Fixed
   - Describe the bug fix.
   ```

3. Test the changes.
4. Commit the version, changelog, and source changes.
5. Push the commit to GitHub.
6. Build and publish the release:

   ```bash
   ./scripts/release.sh
   ```

The command reads the version from `src/manifest.json`, verifies the matching changelog section, runs `scripts/build.sh`, creates tag `v<version>`, generates notes from `.github/release-template.md`, and uploads every matching ZIP from `dist/`.

The release command intentionally requires a clean working tree and refuses to reuse an existing tag. This prevents a release from being made from uncommitted or incorrectly versioned files.

## Reuse existing ZIPs

If the build was already completed and the `dist/` files are correct, skip rebuilding:

```bash
./scripts/release.sh --skip-build
```

## Release template

Edit `.github/release-template.md` to change the release format. These placeholders are replaced automatically:

- `{{VERSION}}` becomes the manifest version without the `v` prefix.
- `{{CHANGELOG}}` becomes the matching version section from `CHANGELOG.md`, excluding its `## [version]` heading.

## Instructions for an AI coding agent

For a release request, read this file first. Inspect `src/manifest.json` and `CHANGELOG.md`, confirm the version and changelog entry match, run the relevant tests, commit and push the prepared changes if requested, then run `./scripts/release.sh`. Do not create a release if the working tree is dirty, the changelog entry is missing, the build fails, or the tag already exists. Never use `--skip-build` unless the user explicitly confirms that the existing `dist/` ZIP files are the intended release artifacts.

The script publishes to the GitHub repository configured as the current git remote using the authenticated `gh` account. It does not commit source changes automatically.
