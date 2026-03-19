# UrbanFlow OTP Data Download Script (PowerShell)
# Downloads OpenTripPlanner binary and Karnataka OSM data

$ErrorActionPreference = "Stop"

$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$OTP_VERSION = "2.5.0"
$OTP_JAR = "otp-${OTP_VERSION}-shaded.jar"
$OTP_URL = "https://github.com/opentripplanner/OpenTripPlanner/releases/download/v${OTP_VERSION}/${OTP_JAR}"

$OSM_URL = "https://download.geofabrik.de/asia/india/karnataka-latest.osm.pbf"
$OSM_FILE = "data\karnataka.osm.pbf"

Write-Host "🚀 UrbanFlow OTP Data Download" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Create directories
New-Item -ItemType Directory -Force -Path "$SCRIPT_DIR\data" | Out-Null
New-Item -ItemType Directory -Force -Path "$SCRIPT_DIR\graph" | Out-Null

# Download OTP jar
Write-Host "📦 Downloading OpenTripPlanner v${OTP_VERSION}..." -ForegroundColor Yellow
if (!(Test-Path "$SCRIPT_DIR\$OTP_JAR")) {
    Invoke-WebRequest -Uri $OTP_URL -OutFile "$SCRIPT_DIR\$OTP_JAR" -UseBasicParsing
    Write-Host "✅ OTP downloaded successfully" -ForegroundColor Green
} else {
    Write-Host "✅ OTP already exists, skipping download" -ForegroundColor Green
}

# Download Karnataka OSM data
Write-Host ""
Write-Host "🗺️  Downloading Karnataka OSM data..." -ForegroundColor Yellow
if (!(Test-Path "$SCRIPT_DIR\$OSM_FILE")) {
    Invoke-WebRequest -Uri $OSM_URL -OutFile "$SCRIPT_DIR\$OSM_FILE" -UseBasicParsing
    Write-Host "✅ OSM data downloaded successfully" -ForegroundColor Green
} else {
    Write-Host "✅ OSM data already exists, skipping download" -ForegroundColor Green
}

# Verify downloads
Write-Host ""
Write-Host "📊 Download Summary:" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
if (Test-Path "$SCRIPT_DIR\$OTP_JAR") {
    $otpSize = (Get-Item "$SCRIPT_DIR\$OTP_JAR").Length / 1MB
    Write-Host "OTP JAR: $([math]::Round($otpSize, 2)) MB" -ForegroundColor Green
}
if (Test-Path "$SCRIPT_DIR\$OSM_FILE") {
    $osmSize = (Get-Item "$SCRIPT_DIR\$OSM_FILE").Length / 1MB
    Write-Host "OSM PBF: $([math]::Round($osmSize, 2)) MB" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ All downloads complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Review config\build-config.json"
Write-Host "2. Run graph build (first time takes ~10 min):"
Write-Host "   java -Xmx4G -jar otp-2.5.0-shaded.jar --build ./graph"
Write-Host "3. Start OTP: .\start-otp.ps1"
Write-Host "4. Test: curl http://localhost:8080/routers/default"
