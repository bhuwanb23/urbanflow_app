#!/bin/bash

# UrbanFlow OpenTripPlanner Shutdown Script
# Gracefully stops OTP server running on port 8080

echo "🛑 Stopping OpenTripPlanner..."

# Find OTP process
OTP_PID=$(lsof -ti:8080)

if [ -z "$OTP_PID" ]; then
    echo "⚠️  No OTP process found on port 8080"
    exit 0
fi

echo "✅ Found OTP process: $OTP_PID"
echo "⏳ Sending SIGTERM..."

# Send graceful shutdown signal
kill -15 $OTP_PID

# Wait for process to stop (max 30 seconds)
for i in {1..30}; do
    if ! kill -0 $OTP_PID 2>/dev/null; then
        echo "✅ OTP stopped gracefully"
        exit 0
    fi
    sleep 1
done

# Force kill if still running
echo "⚠️  Force stopping OTP..."
kill -9 $OTP_PID
echo "✅ OTP stopped forcefully"
