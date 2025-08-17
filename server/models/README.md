# UrbanFlow Database Models

This directory contains the MongoDB/Mongoose models for the UrbanFlow mobile application. The models are designed to handle all aspects of urban mobility, including user management, trip tracking, environmental impact, and real-time traffic data.

## 🗄️ Database Schema Overview

### Core Models

#### 1. **User** (`User.js`)
The central user model that stores user profiles, preferences, and sustainability goals.

**Key Features:**
- User authentication and profile information
- Location and transport preferences
- Sustainability goals and current statistics
- Notification preferences and privacy settings

**Relationships:**
- Has many: Trips, Routes, EcoStats, Notifications
- One-to-many with other models

#### 2. **Trip** (`Trip.js`)
Tracks individual user journeys with detailed transportation information.

**Key Features:**
- Complete route information (origin, destination, waypoints)
- Multi-modal transportation details
- Environmental impact calculations
- Real-time updates and live alerts
- User feedback and ratings

**Relationships:**
- Belongs to: User
- Has many: LiveUpdates, Alternatives
- Referenced by: EcoStats

#### 3. **Route** (`Route.js`)
Stores planned and saved routes for future use.

**Key Features:**
- Route planning and optimization
- Transportation mode preferences
- Environmental impact analysis
- Sharing and collaboration features
- Route history and analytics

**Relationships:**
- Belongs to: User
- Can be shared with other users
- Has many: Segments, Alternatives

#### 4. **EcoStats** (`EcoStats.js`)
Aggregates environmental impact data and sustainability metrics.

**Key Features:**
- Time-based statistics (daily, weekly, monthly, yearly)
- CO2 savings calculations
- Distance and transport mode analytics
- Achievement tracking and goal progress
- Insights and recommendations

**Relationships:**
- Belongs to: User
- References: Trips
- Calculated from: Trip data

#### 5. **Notification** (`Notification.js`)
Manages all user notifications and alerts.

**Key Features:**
- Multiple notification types and categories
- Actionable notifications with navigation
- Delivery tracking and user interaction
- Scheduling and recurring notifications
- Analytics and engagement metrics

**Relationships:**
- Belongs to: User
- Can reference: Trips, Routes, Achievements

#### 6. **LiveTraffic** (`LiveTraffic.js`)
Real-time traffic and transit information.

**Key Features:**
- Live traffic conditions and metrics
- Public transport status updates
- Weather and event impact analysis
- Predictive analytics and alerts
- Alternative route suggestions

**Relationships:**
- Independent model (city-wide data)
- Can reference: Routes, Events

## 🔗 Data Relationships

```
User (1) ──→ (Many) Trips
User (1) ──→ (Many) Routes  
User (1) ──→ (Many) EcoStats
User (1) ──→ (Many) Notifications

Trip (Many) ──→ (1) User
Trip (1) ──→ (Many) LiveUpdates
Trip (1) ──→ (Many) Alternatives

Route (Many) ──→ (1) User
Route (1) ──→ (Many) Segments
Route (1) ──→ (Many) Alternatives

EcoStats (Many) ──→ (1) User
EcoStats (1) ──→ (Many) Trips (referenced)

Notification (Many) ──→ (1) User
Notification (1) ──→ (0..1) Trip (optional reference)
Notification (1) ──→ (0..1) Route (optional reference)

LiveTraffic (Independent) ──→ (0..Many) Routes (optional reference)
```

## 📊 Key Features

### Environmental Impact Tracking
- CO2 savings calculations
- Eco-score algorithms
- Sustainability goal tracking
- Achievement systems

### Real-time Data
- Live traffic conditions
- Public transport status
- Weather impact analysis
- Predictive analytics

### User Experience
- Personalized recommendations
- Multi-modal route planning
- Social features and sharing
- Comprehensive analytics

### Performance Optimization
- Geospatial indexing
- Compound indexes for queries
- Efficient data aggregation
- Caching strategies

## 🚀 Getting Started

### Prerequisites
- MongoDB 4.4+
- Node.js 14+
- Mongoose 8.0+

### Installation
```bash
npm install
```

### Database Connection
```javascript
const { connectDB } = require('./config/database');
await connectDB();
```

### Sample Data
```javascript
const { seedSampleData } = require('./seeders/sampleData');
await seedSampleData();
```

## 🔧 Model Methods

### User Methods
- `comparePassword(candidatePassword)` - Password verification
- `updateStats(tripData)` - Update statistics from trip

### Trip Methods
- `calculateEcoScore()` - Calculate environmental impact score
- `addUpdate(updateData)` - Add live update

### Route Methods
- `calculateEcoScore()` - Calculate route eco score
- `incrementUsage()` - Track route usage
- `addRating(rating)` - Add user rating

### EcoStats Methods
- `updateFromTrip(trip)` - Update stats from new trip

### Notification Methods
- `markAsRead()` - Mark notification as read
- `toggleImportant()` - Toggle importance
- `togglePin()` - Pin/unpin notification
- `dismiss()` - Dismiss notification

### LiveTraffic Methods
- `addUpdate(updateData)` - Add live update
- `updateConditions(newConditions)` - Update traffic conditions
- `markResolved()` - Mark issue as resolved

## 📈 Indexes

### Performance Indexes
- User: email, location (2dsphere), createdAt
- Trip: userId + createdAt, status, coordinates (2dsphere)
- Route: userId + createdAt, coordinates (2dsphere), ecoScore
- EcoStats: userId + period, ecoScore
- Notification: userId + createdAt, type, category
- LiveTraffic: coordinates (2dsphere), traffic level, city

### Geospatial Indexes
- 2dsphere indexes for location-based queries
- Efficient proximity searches
- Route optimization support

## 🧪 Testing

### Sample Data
The `seeders/sampleData.js` file provides comprehensive sample data for development and testing.

### Test Users
- **Alex Johnson** - `alex@urbanflow.com` / `password123`
- **Bhuwan B** - `bhuwan.b@urbanflow.com` / `password123`

## 📝 Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/urbanflow
NODE_ENV=development
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Rate limiting support
- Data privacy controls

## 📱 Mobile App Integration

These models are designed to work seamlessly with the React Native mobile application:

- **Home Screen** - User profile, quick actions
- **Trips Screen** - Trip history, favorites
- **EcoStats Screen** - Environmental impact, achievements
- **Live Screen** - Real-time traffic, transit status
- **Planner Screen** - Route planning, saved routes
- **Notifications Screen** - User alerts, updates
- **Profile Screen** - User settings, preferences

## 🚀 Future Enhancements

- Machine learning for route optimization
- Social features and community sharing
- Advanced analytics and insights
- Integration with external transport APIs
- Real-time collaboration features
- Advanced notification systems

## 📚 Additional Resources

- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Geospatial Queries](https://docs.mongodb.com/manual/geospatial-queries/)
- [UrbanFlow API Documentation](./../README.md)
- [Mobile App Documentation](../../urbanflow_app/README.md)
