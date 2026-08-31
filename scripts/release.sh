#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MANIFEST="$ROOT_DIR/src/manifest.json"
CHANGELOG="$ROOT_DIR/CHANGELOG.md"
DIST_DIR="$ROOT_DIR/dist"
TEMPLATE="$ROOT_DIR/.github/release-template.md"

usage() {
  cat <<'EOF'
Usage: ./scripts/release.sh [--skip-build] [--dry-run]

Builds the current manifest version, validates its changelog entry, creates a
matching Git tag, and publishes a GitHub release with all current ZIP files.

Options:
  --skip-build  Reuse existing dist ZIP files instead of running build.sh.
  --dry-run     Validate inputs and print the release plan without publishing.
EOF
}

skip_build=false
dry_run=false
while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-build) skip_build=true; shift ;;
    --dry-run) dry_run=true; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "ERROR: Unknown option: $1" >&2; usage >&2; exit 1 ;;
  esac
done

command -v git >/dev/null || { echo "ERROR: git is required." >&2; exit 1; }
command -v gh >/dev/null || { echo "ERROR: GitHub CLI (gh) is required. Install it from https://cli.github.com/." >&2; exit 1; }
command -v python3 >/dev/null || { echo "ERROR: python3 is required." >&2; exit 1; }

cd "$ROOT_DIR"
gh auth status >/dev/null 2>&1 || {
  echo "ERROR: GitHub CLI is not authenticated. Run: gh auth login" >&2
  exit 1
}

VERSION="$(python3 - "$MANIFEST" <<'PY'
import json
import sys
with open(sys.argv[1], encoding="utf-8") as manifest_file:
    print(json.load(manifest_file)["version"])
PY
)"
TAG="v$VERSION"

CHANGELOG_ENTRY="$(awk -v version="$VERSION" '
  $0 ~ "^## \\[" version "\\]" { found=1; print; next }
  found && /^## \[/ { exit }
  found { print }
' "$CHANGELOG")"

if [[ -z "$CHANGELOG_ENTRY" ]]; then
  echo "ERROR: No CHANGELOG.md entry found for [$VERSION]." >&2
  exit 1
fi

if [[ "$CHANGELOG_ENTRY" == "## [$VERSION]" ]]; then
  echo "ERROR: CHANGELOG.md entry for [$VERSION] has no release details." >&2
  exit 1
fi

if [[ ! -f "$TEMPLATE" ]]; then
  echo "ERROR: Release template not found: ${TEMPLATE#$ROOT_DIR/}" >&2
  exit 1
fi

if [[ "$skip_build" == false ]]; then
  "$ROOT_DIR/scripts/build.sh"
fi

mapfile -t ASSETS < <(find "$DIST_DIR" -maxdepth 1 -type f -name "lockedin-v${VERSION}-*.zip" -print | sort)
if [[ "${#ASSETS[@]}" -eq 0 ]]; then
  echo "ERROR: No dist ZIP files found for version $VERSION." >&2
  exit 1
fi

if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "ERROR: Git tag $TAG already exists." >&2
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "ERROR: Working tree has uncommitted changes. Commit the version and changelog changes first." >&2
  exit 1
fi

NOTES_FILE="$(mktemp)"
cleanup() { rm -f "$NOTES_FILE"; }
trap cleanup EXIT

CHANGELOG_BODY="$(printf '%s\n' "$CHANGELOG_ENTRY" | tail -n +2)"
python3 - "$TEMPLATE" "$NOTES_FILE" "$VERSION" "$CHANGELOG_BODY" <<'PY'
import pathlib
import sys

template_path, notes_path, version, changelog = sys.argv[1:]
template = pathlib.Path(template_path).read_text(encoding="utf-8")
notes = template.replace("{{VERSION}}", version).replace("{{CHANGELOG}}", changelog.rstrip())
pathlib.Path(notes_path).write_text(notes.rstrip() + "\n", encoding="utf-8")
PY

if [[ "$dry_run" == true ]]; then
  echo "Release validation passed for $TAG."
  echo "Assets:"
  printf '  %s\n' "${ASSETS[@]#$ROOT_DIR/}"
  echo "Generated notes:"
  cat "$NOTES_FILE"
  exit 0
fi

echo "Creating GitHub release $TAG with ${#ASSETS[@]} asset(s)..."
gh release create "$TAG" "${ASSETS[@]}" \
  --title "LockedIn $TAG" \
  --notes-file "$NOTES_FILE"

echo "Release published: $TAG"
