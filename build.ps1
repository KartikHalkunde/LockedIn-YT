# LockedIn Firefox Extension - Build Script (PowerShell)
# This script packages the extension into a ZIP file ready for submission

$ErrorActionPreference = "Stop"

Write-Host "========================================="-ForegroundColor Cyan
Write-Host "Building LockedIn Firefox Extension v1.0.98" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Define output filename
$outputFile = "lockedin-1.0.98.zip"

# Remove existing build if present
if (Test-Path $outputFile) {
    Write-Host "Removing existing build: $outputFile" -ForegroundColor Yellow
    Remove-Item $outputFile
}

# Check if required files exist
Write-Host "Verifying source files..." -ForegroundColor White
$requiredFiles = @(
    "manifest.json",
    "content.js",
    "background.js",
    "icons/icon48.png",
    "popup/popup.html",
    "popup/popup.css",
    "popup/popup.js"
    "icons/santa-hat.svg"
)

foreach ($file in $requiredFiles) {
    if (-Not (Test-Path $file)) {
        Write-Host "ERROR: Required file missing: $file" -ForegroundColor Red
        exit 1
    }
    Write-Host "  ✓ $file" -ForegroundColor Green
}

Write-Host ""
Write-Host "Creating ZIP package..." -ForegroundColor White

# Create the ZIP file using PowerShell
$filesToZip = @(
    "manifest.json",
    "content.js",
    "background.js",
    "icons",
    "popup",
    "homepage"
)

Compress-Archive -Path $filesToZip -DestinationPath $outputFile -Force

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✓ Build complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Output file: $outputFile" -ForegroundColor White
Write-Host "File size: $((Get-Item $outputFile).Length / 1KB) KB" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Test the extension:" -ForegroundColor White
Write-Host "     - Open Firefox" -ForegroundColor Gray
Write-Host "     - Go to about:debugging#/runtime/this-firefox" -ForegroundColor Gray
Write-Host "     - Click 'Load Temporary Add-on'" -ForegroundColor Gray
Write-Host "     - Select the generated $outputFile" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Submit to Mozilla:" -ForegroundColor White
Write-Host "     - Go to https://addons.mozilla.org/developers/" -ForegroundColor Gray
Write-Host "     - Upload $outputFile" -ForegroundColor Gray
Write-Host "     - Provide source code if requested (this entire directory)" -ForegroundColor Gray
Write-Host ""
