#!/bin/bash

# UrbanFlow OpenTripPlanner Startup Script
# Starts OTP on port 8080 with optimized memory settings

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OTP_JAR="otp-2.5.0-shaded.jar"
GRAPH_DIR="./graph"
LOG_DIR="./logs"

# Memory configuration
XMX=${XMX:-4G}  # Default 4GB heap

echo "🚀 Starting OpenTripPlanner v2.5..."
echo "📍 Working directory: $SCRIPT_DIR"
echo "💾 Heap size: $XMX"
echo "🌐 Port: 8080"

# Create logs directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Check if OTP jar exists
if [ ! -f "$OTP_JAR" ]; then
    echo "❌ Error: $OTP_JAR not found!"
    echo "Please download OTP from: https://github.com/opentripplanner/OpenTripPlanner/releases"
    exit 1
fi

# Check if graph exists
if [ ! -d "$GRAPH_DIR" ] || [ -z "$(ls -A $GRAPH_DIR)" ]; then
    echo "⚠️  Graph directory is empty. Building graph first..."
    java -Xmx${XMX} -jar "$OTP_JAR" --build "$GRAPH_DIR"
fi

# Start OTP server
echo "✅ Starting OTP server..."
java -Xmx${XMX} \
     -Dfile.encoding=UTF-8 \
     -Dlogback.configurationFile=logback.xml \
     -jar "$OTP_JAR" \
     --server \
     --basePath "$GRAPH_DIR" \
     --port 8080 \
     2>&1 | tee "$LOG_DIR/otp-$(date +%Y%m%d).log"

echo "🛑 OTP server stopped"
