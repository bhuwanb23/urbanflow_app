# UrbanFlow Phase 3 - Quick Test Guide

## Prerequisites ✅
- Backend server running on `http://localhost:3000`
- OTP graph built (optional, for journey planning)
- React Native development environment set up

---

## Step 1: Verify Backend Health

```powershell
# Test backend server health
curl http://localhost:3000/health

# Expected response:
# {"success":true,"message":"UrbanFlow backend is healthy","timestamp":"..."}
```

**If backend not responding:**
```powershell
cd d:\projects\apps\urbanflow_app\backend
npm run dev
```

---

## Step 2: Test Journey Planning API

```powershell
$body = @{
    fromPlace = "Koramangala"
    toPlace = "Silk Board"
    modes = "BUS,WALK"
    time = "0800"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/plan" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -UseBasicParsing
    
    $data = $response.Content | ConvertFrom-Json
    
    Write-Host "`n✅ Journey Planning API Working!" -ForegroundColor Green
    Write-Host "Status: $($data.success)" -ForegroundColor Cyan
    Write-Host "Itineraries found: $($data.count)" -ForegroundColor Cyan
    
    if ($data.count -gt 0) {
        $first = $data.data.itineraries[0]
        Write-Host "`nFirst Itinerary:" -ForegroundColor Yellow
        Write-Host "  Duration: $($first.durationMinutes) min" -ForegroundColor White
        Write-Host "  Distance: $($first.totalDistanceKm) km" -ForegroundColor White
        Write-Host "  Fare: ₹$($first.fare)" -ForegroundColor White
        Write-Host "  Carbon Saved: $($first.carbonSaved) kg CO₂" -ForegroundColor White
        Write-Host "  Eco Score: $($first.ecoScore}" -ForegroundColor White
        Write-Host "  Legs: $($first.legs.Count)" -ForegroundColor White
        
        # Show first leg details
        if ($first.legs.Count -gt 0) {
            $leg = $first.legs[0]
            Write-Host "`n  First Leg:" -ForegroundColor Gray
            Write-Host "    Mode: $($leg.mode)" -ForegroundColor Gray
            Write-Host "    Distance: $(($leg.distance / 1000).ToString('0.0')) km" -ForegroundColor Gray
            Write-Host "    Icon: $($leg.iconName)" -ForegroundColor Gray
            Write-Host "    Color: #$($leg.color)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "`n❌ API Test Failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`nNote: If OTP is not running, journey planning will fail." -ForegroundColor Yellow
}
```

---

## Step 3: Start Frontend App

### Option A: Using Expo Go (Recommended for Testing)

```powershell
cd d:\projects\apps\urbanflow_app\urbanflow_app
npm start

# Then:
# 1. Install Expo Go app on your phone (iOS/Android)
# 2. Scan the QR code shown in terminal
# 3. App will load on your phone
```

### Option B: Android Emulator

```powershell
cd d:\projects\apps\urbanflow_app\urbanflow_app
npm run android
```

### Option C: iOS Simulator (Mac only)

```powershell
cd d:\projects\apps\urbanflow_app\urbanflow_app
npm run ios
```

---

## Step 4: Test Frontend Features

### 1. **Planner Screen** (Main Tab)
- ✅ Open app → Should land on Planner tab
- ✅ Check search bar appears
- ✅ Verify mode filters display (Bus, Metro, Walk, etc.)
- ✅ Test search: Type "Koramangala to Silk Board"
- ✅ Wait for results to load
- ✅ Pull down to refresh

**Expected Behavior:**
- Loading spinner appears while fetching data
- Routes display with duration, distance, fare
- If backend unavailable, shows fallback mock data
- Error message appears temporarily

### 2. **Route Details Screen**
- ✅ Tap on any route card
- ✅ Verify Journey Overview displays:
  - Distance in km
  - Fare in INR (₹)
  - Eco Score with color indicator
  - Carbon savings badge (if eco-friendly)

**Expected Display:**
```
UrbanFlow
⏱️ 45 min • Arriving Soon

┌─────────────────────────────────┐
│ 📍 12.5 km  │  ₹45  │  🌿 A/10 │
└─────────────────────────────────┘
🌱 Saved 2.45 kg CO₂
```

### 3. **Segment Details**
- ✅ Scroll down to see journey segments
- ✅ Each segment should show:
  - Transport mode icon
  - Distance and duration
  - Carbon badge (green sprout icon)
  - Fare badge (₹ symbol)
  - Route color (if applicable)

**Example Segment Card:**
```
╭────────────────────────────╮
│ 🚌 Bus Route 500A          │
│ 12.5 km • 35 min           │
│ 🌱 2.30 kg CO₂  │  ₹35     │
╰────────────────────────────╯
```

### 4. **Live Screen**
- ⏳ Switch to Live tab
- ⏳ Check traffic conditions display
- ⏳ Verify popular routes section

### 5. **EcoStats Screen**
- ⏳ Navigate to EcoStats tab
- ⏳ Check carbon footprint charts
- ⏳ Verify eco-score display

### 6. **Profile Screen**
- ✅ Navigate to Profile tab
- ✅ Verify profile card displays
- ✅ Test navigation to sub-screens:
  - Edit Profile
  - Language & Region
  - Notifications
  - Privacy Settings

---

## Step 5: Debug Common Issues

### Issue: "Unable to connect to backend"

**Check 1:** Is backend running?
```powershell
curl http://localhost:3000/health
```

**Check 2:** Is firewall blocking port 3000?
```powershell
netstat -ano | findstr :3000
```

**Solution:** Restart backend:
```powershell
# Kill all node processes
Get-Process node | Stop-Process -Force

# Restart backend
cd d:\projects\apps\urbanflow_app\backend
npm run dev
```

---

### Issue: "App shows only mock data"

**Cause:** Backend API not responding or OTP not running

**Solution:**
1. Check backend logs for errors
2. Verify OTP server running on port 8080:
   ```powershell
   curl http://localhost:8080/routers/default
   ```
3. If OTP not running, journey planning uses mock data as fallback

---

### Issue: "Expo won't start"

**Solution 1:** Clear cache
```powershell
cd urbanflow_app
npx expo start -c
```

**Solution 2:** Reinstall dependencies
```powershell
cd urbanflow_app
rm -r node_modules
rm package-lock.json
npm install
npm start
```

---

### Issue: "CORS errors in browser"

**Only applies to:** Web version testing

**Solution:** Backend already configured with CORS:
```javascript
// backend/server.js
app.use(cors({
  origin: '*', // Development mode
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
```

---

## Step 6: Performance Testing

### Test Loading States
1. ✅ Clear app cache
2. ✅ Launch app cold start
3. ✅ Measure time to first render (< 2s expected)
4. ✅ Navigate between tabs (should be instant)
5. ✅ Pull-to-refresh routes (< 3s load time expected)

### Test API Response Times
```powershell
Measure-Command {
    Invoke-WebRequest -Uri "http://localhost:3000/api/v1/plan" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -UseBasicParsing
} | Select-Object TotalSeconds
```

**Expected Times:**
- Health check: < 100ms
- Popular routes: < 500ms
- Journey planning (with OTP): 2-5 seconds
- Journey planning (without OTP): Fallback immediately

---

## Success Criteria ✅

### Backend Verification:
- ✅ Health endpoint responds
- ✅ Journey planning returns valid itineraries
- ✅ Carbon scores calculated correctly
- ✅ Fares calculated in INR
- ✅ Mode icons mapped properly

### Frontend Verification:
- ✅ App launches without errors
- ✅ All 5 main tabs accessible
- ✅ Search functionality works
- ✅ Route cards display enriched data
- ✅ Route details show Phase 2 fields:
  - Distance (km)
  - Fare (₹)
  - Eco Score (grade)
  - Carbon savings (kg CO₂)
- ✅ Loading states appear during API calls
- ✅ Error handling graceful (fallback to mock data)

---

## Quick Commands Reference

### Backend Management
```powershell
# Start backend
cd d:\projects\apps\urbanflow_app\backend
npm run dev

# Check health
curl http://localhost:3000/health

# View logs
Get-Content d:\projects\apps\urbanflow_app\backend\logs\app.log -Tail 50 -Wait
```

### Frontend Management
```powershell
# Start Expo
cd d:\projects\apps\urbanflow_app\urbanflow_app
npm start

# Run tests
npm test

# Build APK (production)
eas build --platform android
```

### OTP Management
```powershell
# Start OTP server
cd d:\projects\apps\urbanflow_app\backend\otp
powershell -ExecutionPolicy Bypass -File start-otp.ps1

# Check OTP status
curl http://localhost:8080/routers/default

# Rebuild graph (if OSM data changed)
java -Xmx10G -jar otp-2.5.0-shaded.jar --build --save ./graph
```

---

## Next Steps After Testing

1. ✅ Document any bugs found
2. ✅ Fix API integration issues
3. ✅ Optimize loading times
4. ✅ Add offline caching
5. ✅ Implement real-time updates
6. ✅ Complete remaining screens (Live, EcoStats, Trips)

---

**Testing Status:** Ready for manual testing  
**Last Updated:** 2026-03-19  
**Phase:** 3 (Frontend Integration)
