# Phase 4 Implementation Plan - Real-Time GTFS-RT Integration

## Executive Summary

**Goal:** Replace mock live data with real GTFS-RT feeds from DULT portal to add live bus positions, real-time delay predictions, and dynamic incident alerts.

**Duration:** 1-2 weeks  
**Priority:** High - Core differentiator for UrbanFlow  
**Dependencies:** Phase 3 completion ✅, DULT API access, Backend infrastructure

---

## Technical Architecture

### Data Flow
```
DULT Portal (tdh.dult-karnataka.com)
    ↓
GTFS-RT Protobuf Feeds
    ↓
Backend Parser (gtfs-realtime-bindings)
    ↓
REST API + WebSocket
    ↓
Frontend (React Native)
    ↓
Live Map Markers + Status Badges + Feed Items
```

### Components Overview

1. **DULT API Integration Layer** - Fetches GTFS-RT feeds
2. **GTFS-RT Parser** - Decodes protobuf VehiclePositions & TripUpdates
3. **REST Endpoints** - Serve live data on-demand
4. **WebSocket Server** - Push updates every 30 seconds
5. **Prediction Engine** - ML-based disruption warnings
6. **Frontend Live Map** - Display moving buses
7. **Status Integration** - Real-time delay badges
8. **Live Feed** - Real incidents and alerts

---

## Implementation Tasks

### Task 1: DULT Portal Registration (1 hour)

**Objective:** Obtain API key for accessing DULT GTFS-RT feeds

**Steps:**
1. Visit https://tdh.dult-karnataka.com
2. Create developer account
3. Register application for API access
4. Request GTFS-RT feed access (VehiclePositions + TripUpdates)
5. Store API key securely in environment variables

**Output:** 
- API key stored in `.env` as `DULT_API_KEY`
- API documentation downloaded

**Files Modified:**
- `urbanflow_backend/.env.example` - Add DULT_API_KEY

---

### Task 2: GTFS-RT Parser Setup (3 hours)

**Objective:** Parse GTFS-RT protobuf feeds into usable JSON

**Dependencies:** npm package `gtfs-realtime-bindings`

**Steps:**
1. Install dependencies:
   ```bash
   npm install gtfs-realtime-bindings protobuf
   ```

2. Create parser module: `services/gtfsRealtimeParser.js`

3. Implement parsing functions:
   - `parseVehiclePositions(protobufBuffer)` → Array of bus locations
   - `parseTripUpdates(protobufBuffer)` → Array of delay predictions
   - `parseAlerts(protobufBuffer)` → Array of service alerts

**Technical Details:**
```javascript
// VehiclePosition entity structure
{
  vehicle: { id: "BMTC-123", label: "500A" },
  position: { latitude: 12.9716, longitude: 77.5946, bearing: 45 },
  timestamp: 1234567890,
  stopId: "STOP_001",
  currentStatus: "IN_TRANSIT_TO"
}

// TripUpdate entity structure
{
  trip: { id: "TRIP_500A_1", routeId: "500A" },
  stopTimeUpdate: [
    { stopId: "STOP_001", arrival: { delay: 120, time: 1234567890 } }
  ]
}
```

**Files Created:**
- `urbanflow_backend/services/gtfsRealtimeParser.js`

---

### Task 3: Vehicle Positions Endpoint (3 hours)

**Objective:** REST API endpoint returning all BMTC bus positions

**Endpoint:** `GET /api/v1/live/vehicles`

**Response Format:**
```json
{
  "success": true,
  "data": {
    "vehicles": [
      {
        "id": "BMTC-123",
        "routeId": "500A",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "bearing": 45,
        "speed": 25.5,
        "timestamp": 1234567890,
        "status": "on-time" | "delayed" | "early"
      }
    ],
    "lastUpdated": 1234567890,
    "nextUpdate": 1234567920
  }
}
```

**Implementation:**
1. Create route file: `routes/liveVehicles.js`
2. Fetch GTFS-RT feed from DULT every 30 seconds
3. Cache latest positions in memory
4. Return cached data on API request
5. Add rate limiting (max 1 request per 5 seconds per IP)

**Files Created:**
- `urbanflow_backend/routes/liveVehicles.js`
- `urbanflow_backend/services/vehiclePositionService.js`

---

### Task 4: Trip Updates Endpoint (3 hours)

**Objective:** REST API endpoint returning delay predictions per trip

**Endpoint:** `GET /api/v1/live/delays`

**Response Format:**
```json
{
  "success": true,
  "data": {
    "delays": [
      {
        "tripId": "TRIP_500A_1",
        "routeId": "500A",
        "stopId": "STOP_001",
        "delaySeconds": 120,
        "prediction": "delayed", // on-time, delayed, early
        "confidence": 0.85,
        "lastUpdated": 1234567890
      }
    ],
    "forecastHours": 1
  }
}
```

**Implementation:**
1. Create route file: `routes/liveDelays.js`
2. Parse TripUpdates feed
3. Calculate delay status (>5 min = delayed, <-5 min = early)
4. Store predictions for next 1 hour
5. Update every 30 seconds

**Files Created:**
- `urbanflow_backend/routes/liveDelays.js`
- `urbanflow_backend/services/tripUpdateService.js`

---

### Task 5: Live Bus Markers on Map (4 hours)

**Objective:** Display moving BMTC buses on dashboard map with color-coded delay status

**Frontend Component:** `LiveMapWithBuses.js`

**Features:**
- Bus icons/markers updated every 30 seconds
- Color coding: Green (on-time), Amber (delayed), Red (severe delay)
- Click marker to see route number and destination
- Filter by route number
- Smooth animation between positions

**Implementation:**
1. Create map component using react-leaflet (web) or react-native-maps (mobile)
2. Poll `/api/v1/live/vehicles` every 30 seconds
3. Render bus markers at positions
4. Animate movement between updates
5. Add click handlers for bus info popups

**Mock Data Fallback:** If backend unavailable, use mock bus positions

**Files Created:**
- `urbanflow_app/pages/live/components/LiveMapWithBuses.js`
- `urbanflow_app/hooks/useLiveVehicles.js`

---

### Task 6: Route Status Integration (3 hours)

**Objective:** Update status badges on Route Details page with real delay data

**Current Component:** `LiveStatusBadge.js`

**Enhancement:**
- Fetch real-time delays from `/api/v1/live/delays`
- Match trip IDs from planned journey with real-time data
- Display actual On Time / Delayed / Cancelled status
- Show delay amount in minutes

**Implementation:**
1. Update `SegmentItem.js` to accept real-time delay prop
2. Modify `LiveStatusBadge.js` to fetch from API
3. Add polling interval (30 seconds)
4. Handle loading/error states
5. Fallback to scheduled time if no real-time data

**Files Modified:**
- `urbanflow_app/pages/route/components/LiveStatusBadge.js`
- `urbanflow_app/pages/route/components/SegmentItem.js`

**Files Created:**
- `urbanflow_app/hooks/useTripDelays.js`

---

### Task 7: Live Feed Integration (3 hours)

**Objective:** Replace mock feed items with real DULT incidents and alerts

**Current Component:** `LiveDashboard.js` feed section

**Data Source:** `/api/v1/live/alerts` (from GTFS-RT Alerts feed)

**Alert Types:**
- Service disruptions
- Route diversions
- Stop closures
- Special schedules
- Weather impacts

**Implementation:**
1. Create alerts endpoint in backend
2. Parse GTFS-RT Alerts feed
3. Transform alerts into feed item format
4. Update frontend to fetch from API
5. Add urgency badges (CRITICAL, WARNING, INFO)
6. Timestamp formatting (relative time ago)

**Files Created:**
- `urbanflow_backend/routes/liveAlerts.js`
- `urbanflow_backend/services/alertsService.js`

**Files Modified:**
- `urbanflow_app/pages/live/components/LiveDashboard.js`
- `urbanflow_app/pages/live/components/RecentUpdates.js`

---

### Task 8: Disruption Prediction ML Model (6 hours)

**Objective:** Proactive warnings based on historical delay patterns

**Algorithm:** Simple rule-based prediction (can be enhanced later)

**Logic:**
```javascript
IF (bus was late >5 min in last 3 days at this time AND day-of-week)
THEN show proactive warning
```

**Data Requirements:**
- Historical delay data (stored in database)
- Time-of-day patterns
- Day-of-week patterns
- Route-specific trends

**Implementation:**
1. Create database table for delay history
2. Log delays per trip per day
3. Build prediction function:
   ```javascript
   predictDisruption(routeId, stopId, timeOfDay, dayOfWeek)
   ```
4. Return probability score (0-1)
5. Show warning if probability > 0.7

**Backend Files Created:**
- `urbanflow_backend/services/disruptionPredictionService.js`
- `urbanflow_backend/models/DelayHistory.js`

**API Endpoint:**
- `GET /api/v1/live/predictions?routeId=500A&stopId=STOP_001`

**Frontend Integration:**
- Show warning badge in route planning
- Display in segment cards: "Likely delays based on recent patterns"

**Files Modified:**
- `urbanflow_app/pages/route/components/SegmentItem.js`

---

### Task 9: WebSocket Push Notifications (4 hours)

**Objective:** Push live bus positions via WebSocket instead of polling

**Technology:** Socket.io

**Benefits:**
- Lower latency (real-time updates)
- Reduced server load (no repeated polling)
- Better battery life on mobile

**Implementation:**

**Backend:**
1. Install socket.io:
   ```bash
   npm install socket.io
   ```

2. Setup WebSocket server in `server.js`:
   ```javascript
   const io = require('socket.io')(server, {
     cors: { origin: '*' }
   });

   io.on('connection', (socket) => {
     socket.join('bengaluru-live');
     
     // Push vehicle positions every 30 seconds
     const interval = setInterval(() => {
       const vehicles = getLatestVehiclePositions();
       io.to('bengaluru-live').emit('vehicle-positions', vehicles);
     }, 30000);

     socket.on('disconnect', () => {
       clearInterval(interval);
     });
   });
   ```

3. Emit events:
   - `vehicle-positions` - Bus locations
   - `trip-delays` - Delay updates
   - `service-alerts` - New incidents

**Frontend:**
1. Install socket.io client:
   ```bash
   npm install socket.io-client
   ```

2. Create WebSocket hook: `hooks/useLiveSocket.js`

3. Connect and subscribe:
   ```javascript
   const socket = io('http://localhost:3000');
   socket.emit('subscribe', 'bengaluru-live');
   
   socket.on('vehicle-positions', (data) => {
     setVehicles(data);
   });
   ```

**Files Created:**
- `urbanflow_backend/websocket/vehicleSocketHandler.js`
- `urbanflow_app/hooks/useLiveSocket.js`

**Files Modified:**
- `urbanflow_backend/server.js` - Add WebSocket server

---

### Task 10: Frontend WebSocket Client Integration (2 hours)

**Objective:** Integrate WebSocket client into React Native app

**Implementation:**
1. Create reusable hook: `useLiveSocket.js`
2. Handle connection lifecycle (connect, disconnect, reconnect)
3. Listen for events:
   - `vehicle-positions` → Update map markers
   - `trip-delays` → Update status badges
   - `service-alerts` → Update live feed
4. Add fallback to HTTP polling if WebSocket unavailable
5. Show connection status indicator

**Files Created:**
- `urbanflow_app/hooks/useLiveSocket.js`
- `urbanflow_app/components/LiveConnectionStatus.js`

**Files Modified:**
- `urbanflow_app/pages/live/LiveScreen.js` - Initialize WebSocket
- `urbanflow_app/pages/route/RouteDetailsScreen.js` - Subscribe to delays

---

## Deliverables Checklist

### ✅ Backend Deliverables

- [ ] DULT API key obtained and configured
- [ ] GTFS-RT parser working (VehiclePositions, TripUpdates, Alerts)
- [ ] `GET /api/v1/live/vehicles` endpoint operational
- [ ] `GET /api/v1/live/delays` endpoint operational
- [ ] `GET /api/v1/live/alerts` endpoint operational
- [ ] `GET /api/v1/live/predictions` endpoint operational
- [ ] WebSocket server pushing real-time updates
- [ ] Disruption prediction model implemented
- [ ] Database schema for delay history

### ✅ Frontend Deliverables

- [ ] Live bus markers displayed on map
- [ ] Bus markers color-coded by delay status
- [ ] Real-time status badges in Route Details
- [ ] Live feed showing real DULT alerts
- [ ] Proactive disruption warnings displayed
- [ ] WebSocket client receiving live updates
- [ ] Connection status indicator
- [ ] Fallback to polling if WebSocket fails

---

## Testing Strategy

### Backend Testing

1. **Unit Tests:**
   - GTFS-RT parser accuracy
   - Delay calculation logic
   - Prediction algorithm

2. **Integration Tests:**
   - DULT API connectivity
   - WebSocket message delivery
   - Database read/write

3. **Load Tests:**
   - 100 concurrent WebSocket connections
   - API response time < 200ms
   - Memory usage under load

### Frontend Testing

1. **Component Tests:**
   - Map marker rendering
   - Status badge updates
   - Feed item display

2. **Integration Tests:**
   - WebSocket connection stability
   - Auto-reconnection
   - Data synchronization

3. **User Testing:**
   - Map interaction smoothness
   - Alert notification timing
   - Battery consumption impact

---

## Performance Considerations

### Optimization Strategies

1. **Caching:**
   - Redis cache for vehicle positions
   - In-memory cache for recent delays
   - CDN for static assets

2. **Throttling:**
   - Rate limit API endpoints (10 req/min per IP)
   - Debounce WebSocket messages (max 1 per 5 seconds)
   - Batch database writes

3. **Data Efficiency:**
   - Compress WebSocket payloads
   - Send only delta updates (changed positions)
   - Lazy load historical data

4. **Client-Side:**
   - Reduce re-renders with React.memo
   - Virtualize long lists (react-window)
   - Optimize map marker count (cluster nearby buses)

---

## Security Considerations

1. **API Key Protection:**
   - Store DULT API key in environment variables
   - Never expose API key in frontend code
   - Rotate keys periodically

2. **Rate Limiting:**
   - Prevent abuse with rate limits
   - Implement exponential backoff
   - Block suspicious IPs

3. **Data Validation:**
   - Sanitize all input parameters
   - Validate GTFS-RT data structure
   - Handle malformed data gracefully

4. **WebSocket Security:**
   - Authenticate WebSocket connections
   - Validate subscription requests
   - Prevent unauthorized access

---

## Rollout Plan

### Phase 4A - Core Infrastructure (Week 1)
- DULT registration
- GTFS-RT parser
- Basic REST endpoints
- Simple map markers

### Phase 4B - Enhanced Features (Week 2)
- WebSocket integration
- Disruption predictions
- Live feed integration
- Status badge updates

### Phase 4C - Polish & Optimization (Week 3)
- Performance tuning
- Error handling improvements
- User testing feedback
- Documentation

---

## Success Metrics

### Quantitative Metrics
- **Latency:** < 3 seconds from DULT update to app display
- **Accuracy:** > 95% match with actual bus positions
- **Uptime:** 99% availability of real-time feeds
- **Battery:** < 5% additional battery drain per hour

### Qualitative Metrics
- User confidence in arrival times
- Perceived reliability of app
- Satisfaction with live tracking
- Trust in disruption warnings

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| DULT API downtime | Medium | High | Cache last known state, graceful degradation |
| GTFS-RT feed format changes | Low | High | Version detection, alerting system |
| WebSocket connection instability | Medium | Medium | Automatic reconnection, fallback to polling |
| High server resource usage | Medium | Medium | Load balancing, horizontal scaling |
| Inaccurate predictions | High | Low | Clear disclaimers, continuous model improvement |

---

## Next Steps

1. **Immediate:** Start DULT registration process (Task 1)
2. **Parallel:** Setup development environment for GTFS-RT parsing
3. **Sequential:** Implement tasks in order (1 → 10)
4. **Iterative:** Test each component before moving to next

---

**Created:** 2026-03-19  
**Estimated Duration:** 1-2 weeks  
**Complexity:** High  
**Business Value:** Critical Differentiator
