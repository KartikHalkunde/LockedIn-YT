#!/usr/bin/env bash
set -Eeuo pipefail

###############################################################################
# LockedIn CHANGELOG Generator
#
# Generates a human-readable CHANGELOG entry from everything changed since
# the latest Git release tag.
#
# The LLM is used only to understand and summarize the changes. Git,
# manifest.json, and CHANGELOG.md remain the sources of truth.
#
# Usage:
#   ./scripts/changelog.sh
#   ./scripts/changelog.sh --dry-run
#   ./scripts/changelog.sh --apply
#   ./scripts/changelog.sh --no-ai
###############################################################################

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MANIFEST="$ROOT_DIR/src/manifest.json"
CHANGELOG="$ROOT_DIR/CHANGELOG.md"

REPO="KartikHalkunde/LockedIn-YT"
DEFAULT_BRANCH="main"
GEMINI_MODEL="${GEMINI_MODEL:-gemini-2.5-flash}"

DRY_RUN=false
APPLY=false
NO_AI=false

usage() {
    cat <<'EOF'

LockedIn CHANGELOG Generator

Usage:
  ./scripts/changelog.sh [options]

Options:
  --dry-run
      Generate and display the proposed entry without changing CHANGELOG.md.

  --apply
      Generate the entry and write it to CHANGELOG.md after confirmation.

  --no-ai
      Skip Gemini and generate a basic changelog from commit messages.

  -h, --help
      Show this help.

Environment:
  GEMINI_API_KEY
      Required unless --no-ai is used.

  GEMINI_MODEL
      Optional. Defaults to gemini-2.5-flash.

Recommended workflow:
  1. Bump the version in src/manifest.json.
  2. Make and commit your code changes.
  3. Run ./scripts/changelog.sh --apply.
  4. Review CHANGELOG.md.
  5. Commit the changelog.
  6. Run your release script.

EOF
}

die() {
    echo "ERROR: $*" >&2
    exit 1
}

log() {
    echo "==> $*"
}

success() {
    echo "OK: $*"
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --apply)
            APPLY=true
            shift
            ;;
        --no-ai)
            NO_AI=true
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            usage
            die "Unknown option: $1"
            ;;
    esac
done

command -v git >/dev/null 2>&1 || die "git is required."
command -v python3 >/dev/null 2>&1 || die "python3 is required."
command -v curl >/dev/null 2>&1 || die "curl is required."

cd "$ROOT_DIR"

[[ -f "$MANIFEST" ]] || die "Missing $MANIFEST"
[[ -f "$CHANGELOG" ]] || die "Missing $CHANGELOG"

###############################################################################
# Repository validation
###############################################################################

BRANCH="$(git branch --show-current)"
[[ "$BRANCH" == "$DEFAULT_BRANCH" ]] || \
    die "Run this script from '$DEFAULT_BRANCH'. Current branch: $BRANCH"

if [[ -n "$(git status --porcelain)" ]]; then
    die "Working tree must be clean before generating a release changelog."
fi

###############################################################################
# Read current version
###############################################################################

CURRENT_VERSION="$(
    python3 - "$MANIFEST" <<'PY'
import json
import sys

with open(sys.argv[1], encoding="utf-8") as f:
    data = json.load(f)

version = data.get("version")

if not isinstance(version, str):
    raise SystemExit("manifest.json does not contain a valid version.")

print(version)
PY
)"

[[ "$CURRENT_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || \
    die "Invalid manifest version: $CURRENT_VERSION"

CURRENT_TAG="v$CURRENT_VERSION"

###############################################################################
# Find latest release tag
###############################################################################

LATEST_TAG="$(
    git tag --sort=-version:refname |
    grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' |
    head -n 1 || true
)"

[[ -n "$LATEST_TAG" ]] || \
    die "No previous semantic-version Git tag was found."

LATEST_VERSION="${LATEST_TAG#v}"

if [[ "$CURRENT_VERSION" == "$LATEST_VERSION" ]]; then
    die "Current manifest version $CURRENT_VERSION matches the latest release $LATEST_TAG. Bump src/manifest.json first."
fi

log "Latest release: $LATEST_TAG"
log "Current version: $CURRENT_VERSION"

###############################################################################
# Collect Git evidence
###############################################################################

COMMIT_RANGE="${LATEST_TAG}..HEAD"

COMMIT_COUNT="$(git rev-list --count "$COMMIT_RANGE")"
FILE_COUNT="$(git diff --name-only "$COMMIT_RANGE" | wc -l | tr -d ' ')"

[[ "$COMMIT_COUNT" -gt 0 ]] || \
    die "There are no commits after $LATEST_TAG."

log "Commits since $LATEST_TAG: $COMMIT_COUNT"
log "Files changed: $FILE_COUNT"

COMMITS="$(git log "$COMMIT_RANGE" --no-merges --format='- %h %s%n  Author: %an%n  Date: %ad' --date=short)"

FILES="$(git diff --stat "$COMMIT_RANGE")"

NAME_STATUS="$(git diff --name-status "$COMMIT_RANGE")"

###############################################################################
# Get GitHub PR information when available
###############################################################################

PR_INFO=""

if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
    PR_INFO="$(
        gh pr list \
            --repo "$REPO" \
            --state merged \
            --limit 100 \
            --json number,title,body,mergedAt,author \
            2>/dev/null || true
    )"
fi

###############################################################################
# Read previous changelog style
###############################################################################

PREVIOUS_CHANGELOG="$(
    python3 - "$CHANGELOG" <<'PY'
import pathlib
import re
import sys

text = pathlib.Path(sys.argv[1]).read_text(encoding="utf-8")

matches = list(re.finditer(
    r"(?ms)^## \[[0-9]+\.[0-9]+\.[0-9]+\].*?(?=^## \[|\Z)",
    text
))

if matches:
    print(matches[0].group(0).strip())
PY
)"

###############################################################################
# Build deterministic fallback
###############################################################################

FALLBACK_ENTRY="$(
    python3 - "$CURRENT_VERSION" "$COMMITS" <<'PY'
import re
import sys
from datetime import date

version = sys.argv[1]
commits = sys.argv[2]

fixed = []
added = []
changed = []
removed = []
security = []

for line in commits.splitlines():
    if not line.startswith("- "):
        continue

    message = re.sub(r"^-\s+[0-9a-f]+\s+", "", line).strip()

    if not message:
        continue

    lower = message.lower()

    # Remove conventional commit prefixes.
    clean = re.sub(
        r"^(feat|feature|fix|bugfix|refactor|chore|docs|style|perf|security|remove|breaking)(\([^)]+\))?!?:\s*",
        "",
        message,
        flags=re.I
    )

    if re.search(r"\b(security|vulnerability|xss|csrf|permission)\b", lower):
        security.append(clean)
    elif re.search(r"\b(fix|fixed|bug|issue|prevent|resolve)\b", lower):
        fixed.append(clean)
    elif re.search(r"\b(add|added|new|introduce|introduced)\b", lower):
        added.append(clean)
    elif re.search(r"\b(remove|removed|delete|deleted)\b", lower):
        removed.append(clean)
    else:
        changed.append(clean)

def unique(items):
    seen = set()
    result = []
    for item in items:
        key = item.lower()
        if key not in seen:
            seen.add(key)
            result.append(item)
    return result

sections = [
    ("Added", unique(added)),
    ("Changed", unique(changed)),
    ("Fixed", unique(fixed)),
    ("Removed", unique(removed)),
    ("Security", unique(security)),
]

out = [f"## [{version}] - {date.today().isoformat()}", ""]

for name, items in sections:
    if not items:
        continue

    out += [f"### {name}", ""]
    for item in items:
        out.append(f"- {item[0].upper() + item[1:]}.")
    out.append("")

if len(out) == 2:
    out += ["### Changed", "", "- Updated the project.", ""]

print("\n".join(out).strip())
PY
)"

###############################################################################
# AI generation
###############################################################################

AI_ENTRY=""

if [[ "$NO_AI" == false ]]; then

    [[ -n "${GEMINI_API_KEY:-}" ]] || {
        die "GEMINI_API_KEY is not set. Export it before running this script, or use --no-ai."
    }

    log "Sending Git changes to Gemini ($GEMINI_MODEL)..."

    PROMPT_FILE="$(mktemp)"
    RESPONSE_FILE="$(mktemp)"

    cleanup_ai() {
        rm -f "$PROMPT_FILE" "$RESPONSE_FILE"
    }

    trap cleanup_ai EXIT

    cat > "$PROMPT_FILE" <<EOF
You are the release-notes writer for LockedIn, an open-source browser
extension that improves the YouTube viewing experience.

Your job is to create a factual, concise, human-readable CHANGELOG entry
for the next release.

PROJECT:
LockedIn

PREVIOUS RELEASE:
$LATEST_TAG

CURRENT VERSION:
$CURRENT_VERSION

CURRENT DATE:
$(date +%Y-%m-%d)

PREVIOUS CHANGELOG ENTRY STYLE:
$PREVIOUS_CHANGELOG

COMMITS SINCE PREVIOUS RELEASE:
$COMMITS

CHANGED FILES:
$NAME_STATUS

DIFF STATISTICS:
$FILES

MERGED GITHUB PR DATA, IF AVAILABLE:
$PR_INFO

IMPORTANT RULES:

1. Use the Git evidence above as the only source of truth.
2. Do not invent features, fixes, behavior, performance improvements, or
   user benefits that are not supported by the evidence.
3. Describe user-visible behavior rather than internal implementation details.
4. Use the actual diff and PR information to understand what changed.
5. Do not simply list filenames.
6. Do not mention commit hashes.
7. Do not mention internal development work unless it affects users.
8. Combine related commits into one clear changelog item.
9. Avoid duplicate items describing the same change.
10. If a change is unclear from the evidence, describe it conservatively.
11. Do not claim a bug was fixed unless the evidence supports that.
12. Keep each bullet concise, normally one sentence.
13. Use only sections that contain real changes.
14. Allowed sections are:
    Added
    Changed
    Fixed
    Removed
    Security
15. Preserve the existing CHANGELOG.md style.
16. Do not use emojis.
17. Do not include a "Summary" section.
18. Do not include Downloads, Updating, Full Changelog, or issue links.
19. Return ONLY the complete new CHANGELOG entry.
20. The first line must be exactly:
    ## [$CURRENT_VERSION] - $(date +%Y-%m-%d)

QUALITY STANDARD:

Bad:
- Changed subscriptions.js
- Updated popup.js
- Fixed observer

Good:
- Added an option to hide live streams from the subscriptions feed.
- Improved subscription filtering so hidden streams remain filtered while
  navigating between YouTube pages.
- Fixed an issue that caused filtered videos to reappear after page updates.
EOF

    python3 - "$PROMPT_FILE" "$RESPONSE_FILE" "$GEMINI_MODEL" <<'PY'
import json
import pathlib
import subprocess
import sys
import urllib.request
import urllib.error
import os

prompt_path = pathlib.Path(sys.argv[1])
response_path = pathlib.Path(sys.argv[2])
model = sys.argv[3]
api_key = os.environ["GEMINI_API_KEY"]

prompt = prompt_path.read_text(encoding="utf-8")

payload = {
    "contents": [
        {
            "parts": [
                {
                    "text": prompt
                }
            ]
        }
    ],
    "generationConfig": {
        "temperature": 0.2,
        "maxOutputTokens": 2000
    }
}

request = urllib.request.Request(
    f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
    data=json.dumps(payload).encode("utf-8"),
    headers={
        "Content-Type": "application/json",
        "x-goog-api-key": api_key,
    },
    method="POST",
)

try:
    with urllib.request.urlopen(request, timeout=90) as response:
        data = json.load(response)
except urllib.error.HTTPError as e:
    body = e.read().decode("utf-8", errors="replace")
    print(f"Gemini API request failed ({e.code}): {body}", file=sys.stderr)
    sys.exit(1)
except Exception as e:
    print(f"Gemini API request failed: {e}", file=sys.stderr)
    sys.exit(1)

try:
    text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
except (KeyError, IndexError, TypeError):
    print("Gemini returned an unexpected response:", file=sys.stderr)
    print(json.dumps(data, indent=2), file=sys.stderr)
    sys.exit(1)

# Remove accidental fenced Markdown.
if text.startswith("```"):
    lines = text.splitlines()

    if lines and lines[0].strip().startswith("```"):
        lines = lines[1:]

    if lines and lines[-1].strip() == "```":
        lines = lines[:-1]

    text = "\n".join(lines).strip()

response_path.write_text(text + "\n", encoding="utf-8")
PY

    AI_ENTRY="$(cat "$RESPONSE_FILE")"

    rm -f "$PROMPT_FILE" "$RESPONSE_FILE"
    trap - EXIT

    ############################################################################
    # Validate AI output
    ############################################################################

    EXPECTED_HEADER="## [$CURRENT_VERSION] - $(date +%Y-%m-%d)"

    grep -Fxq "$EXPECTED_HEADER" <<< "$AI_ENTRY" || {
        warn "Gemini returned an invalid changelog header."
        warn "Falling back to deterministic changelog generation."
        AI_ENTRY=""
    }

    if grep -qE '[✨🔄⚡🐛🔒🗑🛠️⚠️]' <<< "$AI_ENTRY"; then
        warn "Gemini returned emoji. Falling back to deterministic output."
        AI_ENTRY=""
    fi

    if grep -qE '^## (Downloads|Updating|Full Changelog|Found a problem)' <<< "$AI_ENTRY"; then
        warn "Gemini returned unsupported sections. Falling back."
        AI_ENTRY=""
    fi
fi

###############################################################################
# Select generated entry
###############################################################################

if [[ -n "$AI_ENTRY" ]]; then
    GENERATED_ENTRY="$AI_ENTRY"
    success "AI changelog generated."
else
    GENERATED_ENTRY="$FALLBACK_ENTRY"
    success "Deterministic changelog generated."
fi

###############################################################################
# Show result
###############################################################################

echo
echo "============================================================"
echo "              PROPOSED CHANGELOG ENTRY"
echo "============================================================"
echo
echo "$GENERATED_ENTRY"
echo
echo "============================================================"
echo

if [[ "$DRY_RUN" == true ]]; then
    success "Dry run complete. CHANGELOG.md was not modified."
    exit 0
fi

###############################################################################
# Apply
###############################################################################

if [[ "$APPLY" == false ]]; then
    read -r -p "Apply this entry to CHANGELOG.md? [y/N] " CONFIRM

    if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
        echo "No changes made."
        exit 0
    fi
fi

###############################################################################
# Prevent duplicate version
###############################################################################

if grep -qE "^## \[$CURRENT_VERSION\]" "$CHANGELOG"; then
    die "CHANGELOG.md already contains an entry for [$CURRENT_VERSION]."
fi

###############################################################################
# Insert after CHANGELOG title
###############################################################################

python3 - "$CHANGELOG" "$GENERATED_ENTRY" <<'PY'
import pathlib
import sys

path = pathlib.Path(sys.argv[1])
entry = sys.argv[2].strip()

text = path.read_text(encoding="utf-8")

lines = text.splitlines()

if not lines:
    raise SystemExit("CHANGELOG.md is empty.")

# Insert the new release immediately after the document title.
insert_at = 1

# Preserve one blank line after the title.
while insert_at < len(lines) and not lines[insert_at].strip():
    insert_at += 1

new_lines = (
    lines[:insert_at]
    + ["", entry, ""]
    + lines[insert_at:]
)

# Remove excessive blank lines.
output = "\n".join(new_lines)
output = output.replace("\n\n\n", "\n\n")

path.write_text(output.rstrip() + "\n", encoding="utf-8")
PY

success "CHANGELOG.md updated with v$CURRENT_VERSION."

echo
echo "Next:"
echo "  1. Review CHANGELOG.md"
echo "  2. Commit the changelog"
echo "  3. Run ./scripts/release.sh --dry-run"
echo "  4. Run ./scripts/release.sh"
