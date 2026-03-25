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

Write-Host "Preparing Chromium build in a temporary folder..." -ForegroundColor White
$tempChromeBuild = Join-Path $Root "temp-chrome-build"
if (Test-Path $tempChromeBuild) {
    Remove-Item -Recurse -Force $tempChromeBuild
}

New-Item -ItemType Directory -Path $tempChromeBuild | Out-Null
Copy-Item -Path (Join-Path $Src "*") -Destination $tempChromeBuild -Recurse -Force

# Convert manifest to Chromium-safe JSON (service_worker + remove Firefox-only keys)
$tempManifestPath = Join-Path $tempChromeBuild "manifest.json"
$chromeManifest = Get-Content $tempManifestPath -Raw | ConvertFrom-Json

if ($null -eq $chromeManifest.background) {
    $chromeManifest | Add-Member -NotePropertyName background -NotePropertyValue ([pscustomobject]@{ service_worker = "background.js" }) -Force
}
elseif ($chromeManifest.background.PSObject.Properties.Name -contains "scripts" -and $chromeManifest.background.scripts.Count -gt 0) {
    $chromeManifest.background = [pscustomobject]@{ service_worker = $chromeManifest.background.scripts[0] }
}
elseif (-not ($chromeManifest.background.PSObject.Properties.Name -contains "service_worker")) {
    $chromeManifest.background = [pscustomobject]@{ service_worker = "background.js" }
}

if ($chromeManifest.PSObject.Properties.Name -contains "browser_specific_settings") {
    $chromeManifest.PSObject.Properties.Remove("browser_specific_settings")
}

$chromeManifest | ConvertTo-Json -Depth 100 | Set-Content -Path $tempManifestPath -Encoding UTF8

Write-Host "Creating Chromium extension ZIP..." -ForegroundColor White
Push-Location $tempChromeBuild
Compress-Archive -Path * -DestinationPath $chromiumZip -Force
Pop-Location

Remove-Item -Recurse -Force $tempChromeBuild
Write-Host "  ✓ Cleaned up temporary build files." -ForegroundColor Green

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✓ Build complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "📦 Firefox Extension: $firefoxZip" -ForegroundColor White
Write-Host "📦 Source Code: $sourceZip" -ForegroundColor White
Write-Host "📦 Chromium Extension: $chromiumZip" -ForegroundColor White
