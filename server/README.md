# UrbanFlow Backend Server

A comprehensive Node.js/Express backend server for the UrbanFlow mobile app with MongoDB database integration, authentication, and full urban mobility data management.

## 🚀 Features

- 🔐 JWT-based authentication (login/register)
- 👤 Complete user profile management with sustainability goals
- 🗄️ MongoDB database with Mongoose ODM
- 🚗 Trip tracking and environmental impact calculation
- 🛣️ Route planning and optimization
- 🌱 Eco-stats and sustainability metrics
- 🔔 Advanced notification system
- 🚦 Real-time traffic and transit data
- 🔒 Secure password hashing with bcrypt
- 🌐 CORS enabled for mobile app integration
- 📊 Comprehensive data analytics and insights

## 🗄️ Database Models

The backend includes comprehensive MongoDB models for all aspects of urban mobility:

- **User** - User profiles, preferences, and sustainability goals
- **Trip** - Individual journey tracking with environmental impact
- **Route** - Planned and saved routes with optimization
- **EcoStats** - Environmental impact aggregation and analytics
- **Notification** - User alerts and communication system
- **LiveTraffic** - Real-time traffic and transit information

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. Navigate to the server directory:
```bash
cd urbanflow_app/server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file
cp .env.example .env
# Edit .env with your configuration
```

4. Start MongoDB service (if running locally)

5. Start the server:
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## 📊 Database Setup

### MongoDB Connection

The server automatically connects to MongoDB using the connection string from your environment variables:

```env
MONGODB_URI=mongodb://localhost:27017/urbanflow
```

### Sample Data Seeding

Populate the database with sample data for development:

```bash
# Run the seeder script
node -e "require('./seeders/sampleData').seedSampleData()"
```

This creates:
- Sample users with authentication
- Example trips and routes
- Eco-stats and achievements
- Notifications and live traffic data

## 🔐 API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "location": {
    "city": "Mumbai",
    "country": "India"
  }
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Verify Token
```
GET /api/auth/verify
Authorization: Bearer <jwt_token>
```

### User Management

#### Get Profile
```
GET /api/user/profile
Authorization: Bearer <jwt_token>
```

#### Update Profile
```
PUT /api/user/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "John Smith",
  "sustainabilityGoals": {
    "dailyCO2Target": 5.0,
    "weeklyWalkingTarget": 50
  }
}
```

### Trip Management

#### Create Trip
```
POST /api/trips
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "from": {
    "name": "Home",
    "coordinates": { "latitude": 19.0760, "longitude": 72.8777 }
  },
  "to": {
    "name": "Office",
    "coordinates": { "latitude": 19.0896, "longitude": 72.8656 }
  },
  "modes": ["walk", "train", "walk"],
  "startTime": "2024-01-15T08:30:00Z"
}
```

#### Get User Trips
```
GET /api/trips
Authorization: Bearer <jwt_token>
```

### Eco-Stats

#### Get User Stats
```
GET /api/ecostats
Authorization: Bearer <jwt_token>
```

#### Get Weekly Stats
```
GET /api/ecostats/weekly
Authorization: Bearer <jwt_token>
```

### Route Planning

#### Create Route
```
POST /api/routes
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Daily Commute",
  "origin": { "name": "Home", "coordinates": {...} },
  "destination": { "name": "Office", "coordinates": {...} },
  "preferences": {
    "preferPublicTransport": true,
    "avoidHighways": false
  }
}
```

### Live Traffic

#### Get Traffic Conditions
```
GET /api/traffic
```

#### Get Traffic by Location
```
GET /api/traffic?city=Mumbai&area=Downtown
```

### Notifications

#### Get User Notifications
```
GET /api/notifications
Authorization: Bearer <jwt_token>
```

#### Mark as Read
```
PUT /api/notifications/:id/read
Authorization: Bearer <jwt_token>
```

## 🧪 Demo Credentials

For testing purposes, you can use these demo credentials:

- **Alex Johnson** - `alex@urbanflow.com` / `password123`
- **Bhuwan B** - `bhuwan.b@urbanflow.com` / `password123`

## 📝 Environment Variables

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/urbanflow

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Optional: External Services
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
WEATHER_API_KEY=your_weather_api_key
```

## 🏗️ Project Structure

```
server/
├── models/                 # Database models
│   ├── User.js           # User management
│   ├── Trip.js           # Trip tracking
│   ├── Route.js          # Route planning
│   ├── EcoStats.js       # Environmental stats
│   ├── Notification.js   # User notifications
│   ├── LiveTraffic.js    # Real-time traffic
│   └── index.js          # Model exports
├── config/                # Configuration files
│   └── database.js       # MongoDB connection
├── seeders/               # Sample data
│   └── sampleData.js     # Database seeder
├── routes/                # API route handlers
├── middleware/            # Custom middleware
├── utils/                 # Utility functions
├── server.js              # Main server file
├── package.json           # Dependencies
└── README.md             # This file
```

## 🔒 Security Features

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT token authentication with configurable expiration
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ Rate limiting support
- ✅ Data privacy controls
- ✅ Secure database connections

## 📱 Mobile App Integration

The mobile app should:

1. Store JWT tokens in AsyncStorage
2. Include token in Authorization header for API calls
3. Handle token expiration gracefully
4. Implement automatic logout on 401 responses
5. Use the comprehensive API endpoints for all data operations

## 🚀 Development

### Adding New Endpoints

1. Create route handlers in the appropriate route files
2. Use the `authenticateToken` middleware for protected routes
3. Follow the existing error handling pattern
4. Add input validation using express-validator
5. Update the API documentation

### Database Operations

1. Use the Mongoose models for all database operations
2. Implement proper error handling and validation
3. Use transactions for complex operations
4. Implement caching for frequently accessed data

### Testing

1. Use the sample data seeder for development
2. Test all API endpoints with Postman or similar tools
3. Verify database operations and relationships
4. Test authentication and authorization flows

## 📊 Performance Optimization

- **Database Indexes**: Comprehensive indexing for fast queries
- **Geospatial Queries**: 2dsphere indexes for location-based searches
- **Connection Pooling**: Optimized MongoDB connections
- **Caching**: Support for Redis caching (can be added)
- **Compression**: Response compression for large datasets

## 🚀 Production Deployment

1. Set proper environment variables
2. Use a production MongoDB instance (Atlas, etc.)
3. Enable HTTPS
4. Set up proper logging and monitoring
5. Configure rate limiting and security headers
6. Use PM2 or similar process manager
7. Set up database backups and monitoring
8. Implement health checks and status endpoints

## 🔮 Future Enhancements

- **Machine Learning**: Route optimization and traffic prediction
- **Real-time Updates**: WebSocket support for live data
- **Social Features**: User sharing and community features
- **Advanced Analytics**: Detailed insights and recommendations
- **External APIs**: Integration with transport and weather services
- **Mobile Push**: Push notification support
- **Offline Support**: Data synchronization and offline capabilities

## 📚 Additional Resources

- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas) - Cloud database service
- [JWT.io](https://jwt.io/) - JWT token debugging
- [Express.js](https://expressjs.com/) - Web framework documentation
- [UrbanFlow Mobile App](../../urbanflow_app/) - React Native frontend

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Add comprehensive error handling
3. Include input validation for all endpoints
4. Update documentation for new features
5. Test thoroughly before submitting changes

---

**UrbanFlow Backend** - Powering sustainable urban mobility with comprehensive data management and real-time insights. 🌱🚗📱 