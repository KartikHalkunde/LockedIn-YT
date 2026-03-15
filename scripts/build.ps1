# LockedIn Extension - Build Script (PowerShell)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Src = Join-Path $Root "src"
$Dist = Join-Path $Root "dist"

$manifestPath = Join-Path $Src "manifest.json"
$manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
$version = $manifest.version

$firefoxZip = Join-Path $Dist "lockedin-v$version-firefox.zip"
$chromiumZip = Join-Path $Dist "lockedin-v$version-chromium.zip"
$sourceZip = Join-Path $Dist "lockedin-v$version-source.zip"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Building LockedIn Extension v$version" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

New-Item -ItemType Directory -Force -Path $Dist | Out-Null
Get-ChildItem -Path $Dist -Filter "lockedin-*.zip" -ErrorAction SilentlyContinue | Remove-Item -Force

Write-Host "Verifying source files..." -ForegroundColor White
$requiredFiles = @(
    "manifest.json",
    "background.js",
    "content/index.js",
    "popup/popup.html",
    "popup/popup.css",
    "popup/popup.js",
    "assets/icons/icon48.png"
)

foreach ($file in $requiredFiles) {
    $fullPath = Join-Path $Src $file
    if (-Not (Test-Path $fullPath)) {
        Write-Host "ERROR: Required file missing: src/$file" -ForegroundColor Red
        exit 1
    }
    Write-Host "  ✓ src/$file" -ForegroundColor Green
}

Write-Host "Creating extension ZIP from src/..." -ForegroundColor White
Push-Location $Src
Compress-Archive -Path * -DestinationPath $firefoxZip -Force
Pop-Location

Write-Host "Creating source ZIP..." -ForegroundColor White
$sourceItems = @(
    "src",
    "scripts",
    "project-docs",
    "README.md",
    "CHANGELOG.md",
    "CONTRIBUTING.md",
    "PRIVACY.md",
    "LICENSE",
    ".gitignore"
)

Push-Location $Root
Compress-Archive -Path $sourceItems -DestinationPath $sourceZip -Force
Pop-Location

Write-Host "Creating Chromium extension ZIP from chromium-build/..." -ForegroundColor White
Push-Location (Join-Path $Root "chromium-build")
Compress-Archive -Path * -DestinationPath $chromiumZip -Force
Pop-Location

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✓ Build complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "📦 Firefox Extension: $firefoxZip" -ForegroundColor White
Write-Host "📦 Source Code: $sourceZip" -ForegroundColor White
Write-Host "📦 Chromium Extension: $chromiumZip" -ForegroundColor White
