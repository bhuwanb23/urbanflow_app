# UrbanFlow Backend API Documentation

## 📍 Overview

UrbanFlow is a multimodal urban transport system built for Bengaluru, India. This API serves GTFS (General Transit Feed Specification) data including buses, metro, and walking routes.

**Base URL:** `http://localhost:3000`  
**API Version:** `v1`  
**Data Format:** JSON  

---

## 🚀 Quick Start

### Health Check
```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-03-19T10:30:00.000Z",
  "uptime": 12345.67
}
```

---

## 📊 API Statistics

### GET `/api/stats`
Returns server statistics and data summary.

**Response:**
```json
{
  "success": true,
  "data": {
    "version": "v1",
    "uptime": 12345.67,
    "timestamp": "2026-03-19T10:30:00.000Z",
    "data": {
      "total_stops": 8540,
      "total_routes": 4283,
      "total_shapes": 7168,
      "total_transfers": 0,
      "modes": ["bus"],
      "city": "Bengaluru"
    }
  }
}
```

---

## 🛑 Stops API

### GET `/api/v1/stops`
Returns all bus/metro stops.

**Query Parameters:**
- `bbox` (optional): Filter by bounding box in format `minLat,minLon,maxLat,maxLon`

**Example:**
```bash
curl "http://localhost:3000/api/v1/stops"
curl "http://localhost:3000/api/v1/stops?bbox=12.9,77.5,13.0,77.7"
```

**Response:**
```json
{
  "success": true,
  "count": 8540,
  "data": [
    {
      "id": "stop_001",
      "name": "MG Road",
      "lat": 12.9716,
      "lon": 77.5946,
      "mode": "bus",
      "code": "BMTC001",
      "desc": "MG Road Metro Station",
      "color": "#16a34a"
    }
  ]
}
```

---

### GET `/api/v1/stops/:id`
Returns a single stop by ID.

**Example:**
```bash
curl "http://localhost:3000/api/v1/stops/stop_001"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "stop_001",
    "name": "MG Road",
    "lat": 12.9716,
    "lon": 77.5946,
    "mode": "bus",
    "code": "BMTC001",
    "desc": "MG Road Metro Station",
    "color": "#16a34a"
  }
}
```

---

### GET `/api/v1/stops/nearby`
Returns stops within a specified radius.

**Query Parameters:**
- `lat` (required): Latitude
- `lon` (required): Longitude  
- `radius` (optional): Radius in meters (default: 500)

**Example:**
```bash
curl "http://localhost:3000/api/v1/stops/nearby?lat=12.9716&lon=77.5946&radius=1000"
```

**Response:**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "id": "stop_001",
      "name": "MG Road",
      "lat": 12.9716,
      "lon": 77.5946,
      "mode": "bus",
      "code": "BMTC001",
      "desc": "MG Road Metro Station",
      "color": "#16a34a"
    }
  ]
}
```

---

## 🚌 Routes API

### GET `/api/v1/routes`
Returns all routes.

**Query Parameters:**
- `limit` (optional): Limit number of results

**Example:**
```bash
curl "http://localhost:3000/api/v1/routes"
curl "http://localhost:3000/api/v1/routes?limit=10"
```

**Response:**
```json
{
  "success": true,
  "count": 4283,
  "data": [
    {
      "id": "route_001",
      "short_name": "500-A",
      "long_name": "Silk Board to MG Road",
      "type": 3,
      "mode": "bus",
      "color": "#16a34a",
      "text_color": "#ffffff",
      "agency_id": "BMTC",
      "fare": {
        "min_fare": 10,
        "max_fare": 50,
        "currency": "INR"
      },
      "map_color": "#16a34a"
    }
  ]
}
```

---

### GET `/api/v1/routes/:id`
Returns detailed information about a specific route.

**Example:**
```bash
curl "http://localhost:3000/api/v1/routes/route_001"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "route_001",
    "short_name": "500-A",
    "long_name": "Silk Board to MG Road",
    "type": 3,
    "mode": "bus",
    "color": "#16a34a",
    "text_color": "#ffffff",
    "agency_id": "BMTC",
    "fare": {
      "min_fare": 10,
      "max_fare": 50,
      "currency": "INR"
    },
    "map_color": "#16a34a"
  }
}
```

---

### GET `/api/v1/routes/popular`
Returns popular routes (top 20 by default).

**Example:**
```bash
curl "http://localhost:3000/api/v1/routes/popular"
```

---

## ⏰ Schedule API

### GET `/api/v1/schedule/:routeId`
Returns schedule/timetable for a specific route. Lazy loads from disk with caching.

**Example:**
```bash
curl "http://localhost:3000/api/v1/schedule/route_001"
```

**Response:**
```json
{
  "success": true,
  "routeId": "route_001",
  "data": {
    "trip_001": {
      "direction": "0",
      "stops": [
        {
          "stop_id": "stop_001",
          "arrival": "08:00:00",
          "departure": "08:01:00",
          "sequence": 1
        },
        {
          "stop_id": "stop_002",
          "arrival": "08:15:00",
          "departure": "08:16:00",
          "sequence": 2
        }
      ]
    }
  }
}
```

---

## 🗺️ Shapes API

### GET `/api/v1/shapes/:shapeId`
Returns shape GeoJSON for map visualization.

**Example:**
```bash
curl "http://localhost:3000/api/v1/shapes/shape_001"
```

**Response:**
```json
{
  "success": true,
  "shapeId": "shape_001",
  "data": {
    "type": "LineString",
    "coordinates": [
      [77.5946, 12.9716],
      [77.5950, 12.9720],
      [77.5955, 12.9725]
    ],
    "mode": "bus"
  }
}
```

---

## 🔍 Search API

### GET `/api/v1/search`
Fuzzy search across stops and routes.

**Query Parameters:**
- `q` (required): Search query
- `limit` (optional): Maximum results (default: 10)

**Example:**
```bash
curl "http://localhost:3000/api/v1/search?q=MG%20Road"
curl "http://localhost:3000/api/v1/search?q=500&limit=5"
```

**Response:**
```json
{
  "success": true,
  "query": "MG Road",
  "count": 10,
  "data": [
    {
      "id": "stop_001",
      "name": "MG Road",
      "type": "stop",
      "mode": "bus",
      "lat": 12.9716,
      "lon": 77.5946
    },
    {
      "id": "route_001",
      "name": "Silk Board to MG Road",
      "type": "route",
      "mode": "bus"
    }
  ]
}
```

---

## 🗺️ Plan API (Journey Planning)

### POST `/api/v1/plan`
Returns multimodal journey plans with carbon scores and fare calculations.

**Request Body:**
```json
{
  "fromPlace": "12.9716,77.5946",
  "toPlace": "12.9352,77.6245",
  "modes": "BUS,WALK",
  "time": "0800",
  "date": "20-03-2026",
  "numItineraries": 3,
  "wheelchair": false,
  "optimize": "QUICK"
}
```

**Request Parameters:**
- `fromPlace` (required): Starting location as `latitude,longitude`
- `toPlace` (required): Destination as `latitude,longitude`
- `modes` (optional): Comma-separated transport modes (default: `BUS,WALK`)
  - Available modes: `BUS`, `SUBWAY`, `RAIL`, `WALK`, `BICYCLE`
- `time` (optional): Departure time in HHMM format (default: `0800`)
- `date` (optional): Travel date in DD-MM-YYYY format (default: today)
- `numItineraries` (optional): Number of route options (default: 3)
- `wheelchair` (optional): Accessible routes only (default: false)
- `optimize` (optional): Optimization preference
  - `QUICK`: Fastest route
  - `TRIANGLE`: Balanced route
  - `GREENWAYS`: Greenest route

**Example:**
```bash
curl -X POST "http://localhost:3000/api/v1/plan" \
  -H "Content-Type: application/json" \
  -d '{
    "fromPlace": "12.9716,77.5946",
    "toPlace": "12.9352,77.6245",
    "modes": "BUS,WALK",
    "time": "0800",
    "date": "20-03-2026"
  }'
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": {
    "itineraries": [
      {
        "duration": 2700,
        "startTime": "2026-03-20T08:00:00+05:30",
        "endTime": "2026-03-20T08:45:00+05:30",
        "totalDistanceKm": 12.5,
        "carbonSaved": 1.85,
        "formattedCarbonSaved": "1.85 kg CO₂",
        "ecoScore": "A",
        "ecoScorePercentage": 85,
        "fare": 45,
        "formattedFare": "₹45",
        "legs": [
          {
            "mode": "WALK",
            "modeKey": "walk",
            "icon": "walk",
            "color": "#6b7280",
            "bgColor": "#F3F4F6",
            "from": {
              "name": "MG Road",
              "lat": 12.9716,
              "lon": 77.5946
            },
            "to": {
              "name": "Trinity Metro Station",
              "lat": 12.9720,
              "lon": 77.5950
            },
            "distance": 350,
            "duration": 260,
            "startTime": "08:00:00",
            "endTime": "08:04:20",
            "instructions": "Walk towards Trinity Metro Station"
          },
          {
            "mode": "BUS",
            "modeKey": "bus",
            "icon": "bus",
            "color": "#16a34a",
            "bgColor": "#DCFCE7",
            "route": "500-A",
            "routeShortName": "500-A",
            "agencyName": "BMTC",
            "from": {
              "name": "Trinity Metro Station",
              "lat": 12.9720,
              "lon": 77.5950
            },
            "to": {
              "name": "Silk Board",
              "lat": 12.9352,
              "lon": 77.6245
            },
            "distance": 12000,
            "duration": 2340,
            "startTime": "08:05:00",
            "endTime": "08:44:00",
            "headsign": "Silk Board",
            "realTime": false,
            "fare": 45,
            "carbonSaved": 1.92
          }
        ]
      }
    ]
  }
}
```

**Response Fields:**
- `duration`: Total journey duration in seconds
- `startTime`/`endTime`: Journey timing with timezone
- `totalDistanceKm`: Total distance in kilometers
- `carbonSaved`: CO₂ saved vs private car (kg)
- `ecoScore`: Environmental grade (A+ to E)
- `ecoScorePercentage`: Eco-score as percentage (0-100)
- `fare`: Total fare in INR
- `legs`: Array of journey segments

**Leg Object:**
- `mode`: Transport mode (OTP standard)
- `modeKey`: Normalized mode key for UI
- `icon`: Material Community Icon name
- `color`: Primary color for UI styling
- `bgColor`: Background color for UI elements
- `from`/`to`: Location details with coordinates
- `distance`: Leg distance in meters
- `duration`: Leg duration in seconds
- `startTime`/`endTime`: Leg timing
- `route`: Route number (for transit)
- `agencyName`: Operator name (BMTC/BMRCL)
- `fare`: Leg fare in INR
- `carbonSaved`: CO₂ saved for this leg (kg)
- `realTime`: Real-time data availability

**Carbon Scoring:**
- Based on emission factors for Indian transport modes
- Compares against private car baseline (0.192 kg CO₂/km)
- Grades: A+ (90-100%), A (75-89%), B (60-74%), C (45-59%), D (30-44%), E (<30%)

**Fare Calculation:**
- BMTC bus fares: ₹10-75 based on distance
- BMRCL metro fares: ₹10-60 distance-based
- 10% transfer discount for multi-leg journeys
- All fares in Indian Rupees (INR)

**Error Responses:**
```json
{
  "success": false,
  "error": "No route found between the specified locations"
}
```

```json
{
  "success": false,
  "error": "Invalid coordinates: latitude must be between -90 and 90"
}
```

---

## 🌐 API Information

### GET `/api/v1`
Returns API metadata and available endpoints.

**Response:**
```json
{
  "success": true,
  "name": "UrbanFlow API",
  "version": "v1",
  "description": "Multimodal Urban Transport System for Bengaluru",
  "endpoints": {
    "stops": "/api/v1/stops",
    "routes": "/api/v1/routes",
    "schedule": "/api/v1/schedule/:routeId",
    "shapes": "/api/v1/shapes/:shapeId",
    "search": "/api/v1/search?q=query",
    "plan": "/api/v1/plan (POST)"
  }
}
```

---

## 🔒 Rate Limiting

- **Window:** 15 minutes
- **Max Requests:** 100 per IP per window
- **Limit Exceeded Response:** HTTP 429

---

## ❌ Error Handling

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Common Status Codes:**
- `200` - Success
- `400` - Bad Request (missing parameters)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

---

## 🚦 Running Locally

### Installation
```bash
cd backend
npm install
```

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Test Server
```bash
curl http://localhost:3000/health
```

---

## 📝 Data Source

- **City:** Bengaluru, India
- **Bus Routes:** 4,283 (BMTC)
- **Bus Stops:** 8,540 stops
- **Map Shapes:** 7,168 polylines
- **Data Format:** GTFS (General Transit Feed Specification)
- **Preprocessing:** Python script (`../data/preprocess.py`)

---

## 🛠️ Technology Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Security:** Helmet, CORS
- **Rate Limiting:** express-rate-limit
- **Search:** Fuse.js (fuzzy search)
- **Logging:** Winston
- **Compression:** compression

---

## 📖 Additional Resources

- **GTFS Specification:** https://gtfs.org/
- **BMTC GTFS Data:** https://github.com/Vonter/bmtc-gtfs
- **OpenTripPlanner:** https://www.opentripplanner.org/
- **Journey Planning API:** See [Plan API](#️-plan-api-journey-planning) section above
- **Journey Planning API:** See [Plan API](#️-plan-api-journey-planning) section above

---

## 🤝 Contributing

This is an open-source project under MIT License. Contributions welcome!

---

**Last Updated:** March 19, 2026
