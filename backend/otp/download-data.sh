#!/bin/bash

# UrbanFlow OTP Data Download Script
# Downloads OpenTripPlanner binary and Karnataka OSM data

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OTP_VERSION="2.5.0"
OTP_JAR="otp-${OTP_VERSION}-shaded.jar"
OTP_URL="https://github.com/opentripplanner/OpenTripPlanner/releases/download/v${OTP_VERSION}/${OTP_JAR}"

OSM_URL="https://download.geofabrik.de/asia/india/karnataka-latest.osm.pbf"
OSM_FILE="data/karnataka.osm.pbf"

echo "🚀 UrbanFlow OTP Data Download"
echo "=============================="
echo ""

# Create directories
mkdir -p "$SCRIPT_DIR/data"
mkdir -p "$SCRIPT_DIR/graph"

# Download OTP jar
echo "📦 Downloading OpenTripPlanner v${OTP_VERSION}..."
if [ ! -f "$SCRIPT_DIR/$OTP_JAR" ]; then
    curl -L -o "$SCRIPT_DIR/$OTP_JAR" "$OTP_URL"
    echo "✅ OTP downloaded successfully"
else
    echo "✅ OTP already exists, skipping download"
fi

# Download Karnataka OSM data
echo ""
echo "🗺️  Downloading Karnataka OSM data..."
if [ ! -f "$SCRIPT_DIR/$OSM_FILE" ]; then
    curl -L -o "$SCRIPT_DIR/$OSM_FILE" "$OSM_URL"
    echo "✅ OSM data downloaded successfully"
else
    echo "✅ OSM data already exists, skipping download"
fi

# Verify downloads
echo ""
echo "📊 Download Summary:"
echo "==================="
echo "OTP JAR: $(ls -lh "$SCRIPT_DIR/$OTP_JAR" | awk '{print $5}')"
echo "OSM PBF: $(ls -lh "$SCRIPT_DIR/$OSM_FILE" | awk '{print $5}')"

echo ""
echo "✅ All downloads complete!"
echo ""
echo "Next steps:"
echo "1. Review config/build-config.json"
echo "2. Run: ./start-otp.sh (this will build the graph)"
echo "3. Wait ~10 minutes for graph build"
echo "4. Test: curl http://localhost:8080/routers/default"
