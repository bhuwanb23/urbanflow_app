# UrbanFlow Quick Start Guide - Phase 3

## 🚀 Get Started in 5 Minutes

### Prerequisites Check ✅
- [ ] Node.js 18+ installed
- [ ] Java 21 installed (for OTP)
- [ ] Expo CLI installed (`npm install -g expo-cli`)
- [ ] Android Studio OR physical Android device with Expo Go

---

## Step 1: Start Backend Server (2 minutes)

```powershell
# Terminal 1
cd d:\projects\apps\urbanflow_app\backend
npm run dev
```

**Expected Output:**
```
✅ UrbanFlow backend running on port 3000
✅ Database connected
✅ Routes loaded: 450
✅ Stops loaded: 1,234
```

**Verify:**
```powershell
curl http://localhost:3000/health
```

Should return: `{"success":true,"message":"UrbanFlow backend is healthy"}`

---

## Step 2: Start Frontend App (2 minutes)

```powershell
# Terminal 2
cd d:\projects\apps\urbanflow_app\urbanflow_app
npm start
```

**Expected Output:**
```
┌─────────────────────────────────────┐
│  Metro DevTools                    │
│  Running at http://localhost:19002 │
│                                     │
│  Press 'a' for Android              │
│  Press 'i' for iOS                  │
│  Press 'w' for Web                  │
│                                     │
│  Scan QR code with Expo Go app      │
└─────────────────────────────────────┘
```

**On Your Phone:**
1. Install **Expo Go** from Play Store/App Store
2. Open Expo Go app
3. Scan the QR code shown in terminal
4. App loads on your phone!

---

## Step 3: Test Journey Planning (1 minute)

**In the App:**
1. You should see **Planner** tab (compass icon)
2. Tap search bar
3. Type: `Koramangala to Silk Board`
4. Wait for results to load
5. See routes with:
   - ⏱️ Duration (e.g., "45 min")
   - 📍 Distance (e.g., "12.5 km")
   - 💰 Fare (e.g., "₹45")
   - 🌿 Eco Score (e.g., "A/10")

**Tap a Route:**
- See detailed journey breakdown
- Each segment shows:
  - Transport mode (🚌 Bus, 🚶 Walk, 🚇 Metro)
  - Distance & duration
  - Carbon savings badge 🌱
  - Fare badge ₹

---

## 🎯 What You Should See

### Planner Screen (Main Tab)
```
┌─────────────────────────────────┐
│  UrbanFlow                      │
│                                 │
│  🔍 Search for routes...        │
│                                 │
│  [All] [Bus] [Metro] [Walk]    │
│                                 │
│  Popular Routes                 │
│  ┌──────────────────────────┐  │
│  │ 🚌 Koramangala → Silk   │  │
│  │    Board                 │  │
│  │  ⏱️ 45 min  💰 ₹45      │  │
│  │  📍 12.5 km  🌿 A/10     │  │
│  └──────────────────────────┘  │
└─────────────────────────────────┘
```

### Route Details Screen
```
┌─────────────────────────────────┐
│  ← UrbanFlow            ▶️      │
│                                 │
│  ⏱️ 45 min • Arriving Soon     │
│                                 │
│  ┌──────────────────────────┐  │
│  │ 📍     │  💰   │  🌿    │  │
│  │12.5 km │  ₹45  │  A/10  │  │
│  └──────────────────────────┘  │
│                                 │
│  🌱 Saved 2.45 kg CO₂           │
│                                 │
│  Journey Steps:                 │
│  ┌──────────────────────────┐  │
│  │ 🚌 Bus Route 500A       │  │
│  │ 10.5 km • 35 min         │  │
│  │ 🌱 2.30 kg CO₂  │  ₹35   │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │ 🚶 Walk to destination  │  │
│  │ 2.0 km • 10 min          │  │
│  │ 🌱 0.15 kg CO₂  │  Free  │  │
│  └──────────────────────────┘  │
└─────────────────────────────────┘
```

---

## 🧪 Quick Tests

### Test 1: Backend Health
```powershell
curl http://localhost:3000/health
# Should return success: true
```

### Test 2: Journey Planning API
```powershell
$body = @{
    fromPlace = "Koramangala"
    toPlace = "Silk Board"
    modes = "BUS,WALK"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/v1/plan" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Test 3: App Navigation
- [ ] Tap each bottom tab (Planner, Live, EcoStats, Trips, Profile)
- [ ] Each screen should load without errors
- [ ] Back navigation works correctly

---

## 🐛 Troubleshooting

### Problem: "Can't connect to backend"

**Solution:**
```powershell
# Check if backend is running
netstat -ano | findstr :3000

# If not found, restart backend
cd backend
npm run dev
```

---

### Problem: "App shows only mock data"

**Cause:** Backend API not responding or slow

**Solution:**
1. Verify backend is running (see above)
2. Check network connectivity
3. Restart Expo: `Ctrl+C` then `npm start`

---

### Problem: "Expo won't connect to phone"

**Solution:**
1. Ensure phone and computer on same WiFi
2. Try tunnel mode: `npx expo start --tunnel`
3. Or use Android emulator instead

---

### Problem: "QR code won't scan"

**Solutions:**
- Increase screen brightness
- Hold phone steady over QR code
- Or type manual connection address shown in terminal

---

## 📱 Testing on Emulator (Alternative)

### Android Emulator
```powershell
# Start Android Studio emulator first
# Then in terminal:
cd urbanflow_app
npm run android
```

### iOS Simulator (Mac only)
```powershell
cd urbanflow_app
npm run ios
```

---

## 📊 Expected Performance

### Load Times:
- App cold start: < 3 seconds
- Tab switching: Instant
- Route search: < 2 seconds
- Journey planning: 2-5 seconds (with OTP)

### Network Requests:
- Health check: < 100ms
- Popular routes: < 500ms
- Journey planning: 2-5s (OTP processing)

---

## ✅ Success Indicators

You know it's working when:

1. ✅ Backend health endpoint responds
2. ✅ App launches on device/emulator
3. ✅ All 5 bottom tabs accessible
4. ✅ Search returns real routes (not just mock)
5. ✅ Route cards show INR fares (₹)
6. ✅ Eco scores display (A/10, B/10, etc.)
7. ✅ Carbon badges visible on segments

---

## 📚 Full Documentation

For detailed testing and troubleshooting:

1. **Phase 3 Integration Guide**  
   `backend/PHASE3_FRONTEND_INTEGRATION.md`

2. **Detailed Testing Steps**  
   `TEST_FRONTEND.md`

3. **Completion Summary**  
   `backend/PHASE3_COMPLETION_SUMMARY.md`

---

## 🎉 You're Ready!

If everything above works:

✅ Backend server operational  
✅ Frontend app connected  
✅ Journey planning functional  
✅ Phase 2 data displaying correctly  
✅ **Ready for full testing!**

---

**Next Steps:**
1. Follow comprehensive tests in `TEST_FRONTEND.md`
2. Document any bugs or issues found
3. Report feedback for improvements
4. Plan next phase features

**Created:** 2026-03-19  
**Version:** 1.0  
**Phase:** 3 (Frontend Integration)
