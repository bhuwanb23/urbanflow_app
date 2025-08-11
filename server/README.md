# UrbanFlow Backend Server

A Node.js/Express backend server for the UrbanFlow mobile app with authentication and API endpoints.

## Features

- 🔐 JWT-based authentication (login/register)
- 👤 User profile management
- 🚗 Demo traffic data endpoints
- 🛣️ Route suggestions API
- 🔒 Secure password hashing with bcrypt
- 🌐 CORS enabled for mobile app integration

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
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

3. Start the server:
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
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

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <jwt_token>
```

### User Profile

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
  "email": "johnsmith@example.com"
}
```

### Demo Data

#### Traffic Conditions
```
GET /api/demo/traffic
```

#### Route Suggestions
```
GET /api/demo/routes
```

### Health Check
```
GET /api/health
```

## Demo Credentials

For testing purposes, you can use these demo credentials:

- **Email:** demo@urbanflow.com
- **Password:** password

## Environment Variables

Create a `.env` file in the server directory:

```env
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ CORS protection
- ✅ Input validation
- ✅ Error handling

## Development

### Project Structure
```
server/
├── server.js          # Main server file
├── package.json       # Dependencies
├── README.md         # This file
└── .env              # Environment variables (create this)
```

### Adding New Endpoints

1. Add your route in `server.js`
2. Use the `authenticateToken` middleware for protected routes
3. Follow the existing error handling pattern

### Database Integration

Currently using in-memory storage. For production, integrate with:
- MongoDB with Mongoose
- PostgreSQL with Sequelize
- MySQL with Prisma

## Mobile App Integration

The mobile app should:

1. Store JWT tokens in AsyncStorage
2. Include token in Authorization header for API calls
3. Handle token expiration gracefully
4. Implement automatic logout on 401 responses

## Production Deployment

1. Set proper environment variables
2. Use a production database
3. Enable HTTPS
4. Set up proper logging
5. Configure rate limiting
6. Use PM2 or similar process manager

## License

MIT License - see LICENSE file for details 