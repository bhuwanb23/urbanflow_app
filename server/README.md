# UrbanFlow Backend Server

A Node.js/Express backend server for the UrbanFlow mobile app with SQLite database, authentication, and urban mobility data management.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn**

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Initialize the project:**
```bash
# Creates directories and copies environment file
npm run init
```

3. **Start the server:**
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

**Note:** The init script will create necessary directories (`data/`, `logs/`, `uploads/`) and copy `env.example` to `.env` if they don't already exist.

## 📊 Database

The server uses **SQLite** by default for simplicity. The database file will be automatically created at `./data/urbanflow.db` on first run.

### Sample Data
```bash
# Populate with sample data
npm run seed
```

## 🔐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/verify` - Verify token

### User Management
- `GET /api/v1/user/profile` - Get user profile
- `PUT /api/v1/user/profile` - Update profile

### Trips & Routes
- `GET /api/v1/trips` - Get user trips
- `POST /api/v1/trips` - Create trip
- `GET /api/v1/routes` - Get routes
- `POST /api/v1/routes` - Create route

### Eco-Stats & Analytics
- `GET /api/v1/ecostats` - Get user stats
- `GET /api/v1/ecostats/weekly` - Weekly stats

### Live Data
- `GET /api/v1/traffic` - Traffic conditions
- `GET /api/v1/notifications` - User notifications

### Health & Status
- `GET /health` - Server health check
- `GET /api/v1` - API information

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📁 Project Structure

```
server/
├── server.js              # Main server file
├── package.json           # Dependencies & scripts
├── env.example            # Environment template
├── .gitignore            # Git ignore rules
├── routes/                # API route handlers
│   ├── auth.js           # Authentication routes
│   ├── user.js           # User management
│   ├── trips.js          # Trip tracking
│   ├── routes.js         # Route planning
│   ├── ecostats.js       # Environmental stats
│   ├── traffic.js        # Live traffic data
│   ├── notifications.js  # User notifications
│   └── health.js         # Health checks
├── models/                # Database models
│   ├── User.js           # User model
│   ├── Trip.js           # Trip model
│   ├── Route.js          # Route model
│   ├── EcoStats.js       # Eco-stats model
│   ├── Notification.js   # Notification model
│   └── LiveTraffic.js    # Traffic model
├── config/                # Configuration
│   └── database.js       # Database setup
├── seeders/               # Sample data
│   └── sampleData.js     # Database seeder
├── scripts/               # Utility scripts
│   └── init.js           # Initialization script
├── data/                  # SQLite database files
├── logs/                  # Application logs
└── uploads/               # File uploads
```

## 🔧 Environment Variables

Key environment variables in `.env`:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_TYPE=sqlite
SQLITE_PATH=./data/urbanflow.db

# Authentication
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# API
API_VERSION=v1
CORS_ORIGIN=http://localhost:3000
```

## 🚀 Development

### Adding New Routes
1. Create route file in `routes/` directory
2. Add route handlers with proper validation
3. Use authentication middleware for protected routes
4. Update this README with new endpoints

### Database Operations
1. Use Sequelize models in `models/` directory
2. Implement proper error handling
3. Add validation for all inputs

## 📱 Mobile App Integration

The mobile app should:
1. Store JWT tokens securely
2. Include token in `Authorization: Bearer <token>` header
3. Handle 401 responses (token expired)
4. Use the API endpoints for all data operations

## 🔒 Security Features

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Input validation
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Security headers (Helmet)

## 📄 License

MIT License

---

**UrbanFlow Backend** - Powering sustainable urban mobility 🌱🚗📱 