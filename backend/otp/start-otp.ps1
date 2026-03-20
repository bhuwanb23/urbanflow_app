# UrbanFlow OpenTripPlanner Startup Script (PowerShell)
# Starts OTP on port 8080 with optimized memory settings

$ErrorActionPreference = "Continue"

$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$OTP_JAR = "otp-2.5.0-shaded.jar"
$GRAPH_DIR = ".\graph"
$LOG_DIR = ".\logs"

# Memory configuration - increased to 6GB for Southern Zone
$XMX = "6G"

Write-Host "Starting OpenTripPlanner v2.5..." -ForegroundColor Cyan
Write-Host "Working directory: $SCRIPT_DIR" -ForegroundColor Yellow
Write-Host "Heap size: $XMX" -ForegroundColor Yellow
Write-Host "Port: 8080" -ForegroundColor Yellow

# Create logs directory if it doesn't exist
New-Item -ItemType Directory -Force -Path "$LOG_DIR" | Out-Null

# Check if OTP jar exists
if (!(Test-Path "$SCRIPT_DIR\$OTP_JAR")) {
    Write-Host "❌ Error: $OTP_JAR not found!" -ForegroundColor Red
    Write-Host "Please run: .\download-data.ps1" -ForegroundColor Yellow
    exit 1
}

# Check if graph exists
$graphEmpty = !(Test-Path "$GRAPH_DIR") -or ((Get-ChildItem "$GRAPH_DIR" -Recurse -File).Count -eq 0)
if ($graphEmpty) {
    Write-Host "Building graph with 6G heap..." -ForegroundColor Yellow
    
    # Build graph and save
    & java -Xmx6G -jar "$OTP_JAR" --build --save "$GRAPH_DIR"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Graph build failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "Graph built successfully!" -ForegroundColor Green
}

# Start OTP server
Write-Host ""
Write-Host "Starting OTP server..." -ForegroundColor Green
Write-Host "Logs: $LOG_DIR\otp-$(Get-Date -Format 'yyyyMMdd').log" -ForegroundColor Yellow

$logFile = "$LOG_DIR\otp-$(Get-Date -Format 'yyyyMMdd').log"

$startArgs = @(
    "-Xmx$XMX",
    "-Dfile.encoding=UTF-8",
    "-Dlogback.configurationFile=logback.xml",
    "-jar", "`"$OTP_JAR`"",
    "--server",
    "--basePath", "`"$GRAPH_DIR`"",
    "--port", "8080"
)

# Start OTP as background process
Start-Process java -ArgumentList $startArgs -NoNewWindow -RedirectStandardOutput "$logFile" -RedirectStandardError "$logFile"

Write-Host ""
Write-Host "OTP server starting in background..." -ForegroundColor Green
Write-Host "PID: $PID" -ForegroundColor Yellow
Write-Host ""
Write-Host "Wait ~30 seconds, then test with:" -ForegroundColor Cyan
Write-Host "  curl http://localhost:8080/routers/default" -ForegroundColor White
Write-Host ""
Write-Host "To stop OTP, run: .\stop-otp.ps1" -ForegroundColor Cyan
