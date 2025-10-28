#!/bin/bash

# LockedIn Firefox Extension - Build Script
# This script packages the extension into a ZIP file ready for submission

set -e  # Exit on any error

echo "========================================="
echo "Building LockedIn Firefox Extension v1.0.4"
echo "========================================="
echo ""

# Define output filename
OUTPUT_FILE="lockedin-1.0.4.zip"

# Remove existing build if present
if [ -f "$OUTPUT_FILE" ]; then
    echo "Removing existing build: $OUTPUT_FILE"
    rm "$OUTPUT_FILE"
fi

# Check if required files exist
echo "Verifying source files..."
required_files=(
    "manifest.json"
    "content.js"
    "icons/icon48.png"
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

# Create the ZIP file
# Check if zip is available, otherwise use Python
if command -v zip &> /dev/null; then
    # Use system zip command
    zip -r "$OUTPUT_FILE" \
        manifest.json \
        content.js \
        icons/ \
        popup/ \
        -x "*.DS_Store" "*/__MACOSX/*" "*/.git/*" "*.gitignore" "build.sh" "build.ps1" "README.md"
else
    # Fallback to Python zipfile
    echo "  (using Python zipfile - zip command not found)"
    python3 << 'PYEOF'
import zipfile
import os

output_file = "lockedin-1.0.4.zip"
exclude_patterns = ['.DS_Store', '__MACOSX', '.git', '.gitignore', 'build.sh', 'build.ps1', 'README.md', 'SOURCE_SUBMISSION.md']

with zipfile.ZipFile(output_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk('.'):
        # Filter out excluded directories
        dirs[:] = [d for d in dirs if d not in exclude_patterns]
        
        for file in files:
            # Skip if filename matches exclude patterns
            if any(pattern in file for pattern in exclude_patterns):
                continue
            if any(pattern in root for pattern in exclude_patterns):
                continue
                
            file_path = os.path.join(root, file)
            arcname = file_path[2:] if file_path.startswith('./') else file_path
            
            # Only include extension files
            if arcname in ['manifest.json', 'content.js'] or \
               arcname.startswith('icons/') or arcname.startswith('popup/'):
                zipf.write(file_path, arcname)
                print(f"  Adding: {arcname}")
PYEOF
fi

echo ""
echo "========================================="
echo "✓ Build complete!"
echo "========================================="
echo ""
echo "Output file: $OUTPUT_FILE"
echo "File size: $(du -h "$OUTPUT_FILE" | cut -f1)"
echo ""
echo "Next steps:"
echo "  1. Test the extension:"
echo "     - Open Firefox"
echo "     - Go to about:debugging#/runtime/this-firefox"
echo "     - Click 'Load Temporary Add-on'"
echo "     - Select the generated $OUTPUT_FILE"
echo ""
echo "  2. Submit to Mozilla:"
echo "     - Go to https://addons.mozilla.org/developers/"
echo "     - Upload $OUTPUT_FILE"
echo "     - Provide source code if requested (this entire directory)"
echo ""
