#!/bin/bash

# LockedIn Firefox Extension - Build Script
# This script packages the extension into a ZIP file ready for submission

set -e  # Exit on any error

echo "========================================="
echo "Building LockedIn Firefox Extension v1.0.97"
echo "========================================="
echo ""

# Define output filenames
MAIN_ZIP="lockedin-1.0.97.zip"
SOURCE_ZIP="lockedin-source-1.0.97.zip"
EDGE_ZIP="lockedin-edge-1.0.97.zip"

# Remove existing builds if present
echo "Cleaning previous builds..."
for file in "$MAIN_ZIP" "$SOURCE_ZIP" "$EDGE_ZIP"; do
    if [ -f "$file" ]; then
        echo "  Removing: $file"
        rm "$file"
    fi
done
echo ""

# Check if required files exist
echo "Verifying source files..."
required_files=(
    "manifest.json"
    "content.js"
    "background.js"
    "icons/icon48.png"
    "icons/santa-hat.svg"
    "popup/popup.html"
    "popup/popup.css"
    "popup/popup.js"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "ERROR: Required file missing: $file"
        exit 1
    fi
    echo "  ✓ $file"
done

echo ""
echo "Creating ZIP package..."

# 1. Main Extension ZIP (Firefox/Chrome)
echo "Building main extension package..."
if command -v zip &> /dev/null; then
    zip -r "$MAIN_ZIP" \
        background.js \
        manifest.json \
        content.js \
        icons/ \
        popup/ \
        homepage/ \
        -x "*.DS_Store" "*/__MACOSX/*" "*/.git/*" "*.gitignore" "assets/*"
    echo "  ✓ $MAIN_ZIP created"
else
    echo "ERROR: zip command not found. Please install zip."
    exit 1
fi

# 2. Source Code ZIP (for Firefox review)
echo "Building source code package..."
zip -r "$SOURCE_ZIP" \
    background.js \
    manifest.json \
    content.js \
    icons/ \
    popup/ \
    homepage/ \
    edge-build/ \
    build.sh \
    build.ps1 \
    README.md \
    BUILDING.md \
    CHECKLIST.md \
    CONTRIBUTING.md \
    DEPLOY_NOW.md \
    DEPLOYMENT_1.0.6.md \
    LICENSE \
    PACKAGE_SUMMARY.md \
    PRIVACY.md \
    SOURCE_SUBMISSION.md \
    SUBMISSION_GUIDE.md \
    SUPPORT.md \
    docs/ \
    -x "*.DS_Store" "*/__MACOSX/*" "*/.git/*" "*.gitignore" "node_modules/*" "assets/*"
echo "  ✓ $SOURCE_ZIP created"

# 3. Edge Extension ZIP
echo "Building Edge extension..."
cd edge-build
zip -r "../$EDGE_ZIP" \
    background.js \
    manifest.json \
    content.js \
    icons/ \
    popup/ \
    homepage/ \
    -x "*.DS_Store" "*/__MACOSX/*" "assets/*"
cd ..
echo "  ✓ $EDGE_ZIP created"

echo ""
echo "========================================="
echo "✓ All builds complete!"
echo "========================================="
echo ""
echo "📦 Main Extension: $MAIN_ZIP ($(du -h "$MAIN_ZIP" | cut -f1))"
echo "📦 Source Code: $SOURCE_ZIP ($(du -h "$SOURCE_ZIP" | cut -f1))"
echo "📦 Edge Extension: $EDGE_ZIP ($(du -h "$EDGE_ZIP" | cut -f1))"
echo ""
echo "Next steps:"
echo ""
echo "Firefox (addons.mozilla.org):"
echo "  1. Upload: $MAIN_ZIP"
echo "  2. Source: $SOURCE_ZIP (if requested)"
echo ""
echo "Chrome Web Store:"
echo "  1. Upload: $MAIN_ZIP"
echo ""
echo "Edge (partner.microsoft.com):"
echo "  1. Upload: $EDGE_ZIP"
echo ""
