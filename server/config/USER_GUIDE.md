# UrbanFlow Backend Configuration User Guide

This guide will help you set up and configure the UrbanFlow backend server for development and production use.

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn** package manager
- **Database** (MongoDB, PostgreSQL, MySQL, or SQLite)

### 2. Installation
```bash
cd server
npm install
```

### 3. Environment Setup
```bash
# Copy the example environment file
cp .env.example .env

# Edit with your configuration
nano .env
```

## 🗄️ Database Configuration

### Option 1: MongoDB (Recommended)
```env
# MongoDB Configuration
DB_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/urbanflow
MONGODB_OPTIONS="useNewUrlParser=true&useUnifiedTopology=true"
```

### Option 2: PostgreSQL
```env
# PostgreSQL Configuration
DB_TYPE=postgresql
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=urbanflow
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
```

### Option 3: MySQL
```env
# MySQL Configuration
DB_TYPE=mysql
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DB=urbanflow
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
```

### Option 4: SQLite (Development Only)
```env
# SQLite Configuration
DB_TYPE=sqlite
SQLITE_PATH=./data/urbanflow.db
```

## 🔐 Authentication Configuration

```env
# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Password Security
BCRYPT_ROUNDS=12
```

## 🌐 Server Configuration

```env
# Server Settings
PORT=3000
NODE_ENV=development
HOST=localhost

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📱 Mobile App Integration

```env
# API Configuration
API_VERSION=v1
API_PREFIX=/api

# Mobile App Settings
MOBILE_APP_ID=com.urbanflow.app
MOBILE_APP_VERSION=1.0.0
```

## 🔒 Security Configuration

```env
# Security Headers
HELMET_ENABLED=true
CSP_ENABLED=true

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif

# Session Management
SESSION_SECRET=your_session_secret_here
SESSION_MAX_AGE=86400000
```

## 📊 External Services (Optional)

```env
# Google Services
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_PLACES_API_KEY=your_google_places_api_key

# Weather Services
OPENWEATHER_API_KEY=your_openweather_api_key
WEATHER_API_KEY=your_weather_api_key

# Payment Services
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Email Services
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 🧪 Development Configuration

```env
# Development Settings
NODE_ENV=development
DEBUG=urbanflow:*
LOG_LEVEL=debug

# Database Seeding
SEED_SAMPLE_DATA=true
SEED_USERS_COUNT=5
SEED_TRIPS_COUNT=20

# Testing
TEST_DATABASE_URL=your_test_database_url
JEST_TIMEOUT=10000
```

## 🚀 Production Configuration

```env
# Production Settings
NODE_ENV=production
LOG_LEVEL=info
DEBUG=false

# Performance
CLUSTER_MODE=true
WORKER_PROCESSES=4

# Monitoring
ENABLE_METRICS=true
METRICS_PORT=9090

# Health Checks
HEALTH_CHECK_INTERVAL=30000
HEALTH_CHECK_TIMEOUT=5000
```

## 📁 Configuration Files

### Database Configuration
```javascript
// config/database.js
const config = {
  mongodb: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    }
  },
  postgresql: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
  }
};
```

### Server Configuration
```javascript
// config/server.js
const config = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  environment: process.env.NODE_ENV || 'development',
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: process.env.CORS_CREDENTIALS === 'true'
  }
};
```

## 🔧 Configuration Management

### Environment-Specific Configs
```bash
# Development
cp .env.example .env.development

# Production
cp .env.example .env.production

# Testing
cp .env.example .env.test
```

### Loading Configuration
```javascript
// config/index.js
const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`)
});

module.exports = {
  database: require('./database'),
  server: require('./server'),
  auth: require('./auth'),
  security: require('./security')
};
```

## 🧪 Testing Configuration

```env
# Test Database
TEST_DB_TYPE=sqlite
TEST_SQLITE_PATH=./test/data/test.db

# Test Environment
NODE_ENV=test
JEST_ENV=node
```

## 📊 Monitoring & Logging

```env
# Logging
LOG_LEVEL=info
LOG_FORMAT=json
LOG_FILE=./logs/urbanflow.log

# Monitoring
ENABLE_METRICS=true
METRICS_PORT=9090
PROMETHEUS_ENABLED=true

# Health Checks
HEALTH_CHECK_ENDPOINT=/health
HEALTH_CHECK_INTERVAL=30000
```

## 🚨 Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check if database service is running
sudo systemctl status mongodb
sudo systemctl status postgresql
sudo systemctl status mysql

# Check connection string
echo $MONGODB_URI
echo $POSTGRES_HOST
```

#### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm start
```

#### Environment Variables Not Loading
```bash
# Check if .env file exists
ls -la .env*

# Verify environment loading
node -e "console.log(process.env.NODE_ENV)"
```

## 📚 Configuration Examples

### Minimal Configuration
```env
# .env.minimal
NODE_ENV=development
PORT=3000
JWT_SECRET=your_secret_key
DB_TYPE=sqlite
SQLITE_PATH=./data/urbanflow.db
```

### Full Production Configuration
```env
# .env.production
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database
DB_TYPE=mongodb
MONGODB_URI=mongodb://user:pass@cluster.mongodb.net/urbanflow

# Security
JWT_SECRET=your_production_secret_key
JWT_EXPIRES_IN=1d
BCRYPT_ROUNDS=12

# Performance
CLUSTER_MODE=true
WORKER_PROCESSES=4

# Monitoring
ENABLE_METRICS=true
LOG_LEVEL=warn
```

## 🔄 Configuration Updates

### Hot Reload Configuration
```javascript
// config/hotReload.js
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../.env');
let lastModified = fs.statSync(configPath).mtime;

setInterval(() => {
  const currentModified = fs.statSync(configPath).mtime;
  if (currentModified > lastModified) {
    console.log('Configuration changed, reloading...');
    delete require.cache[require.resolve('./index')];
    require('./index');
    lastModified = currentModified;
  }
}, 5000);
```

## 📋 Configuration Checklist

- [ ] Environment variables set up
- [ ] Database connection configured
- [ ] JWT secrets configured
- [ ] CORS settings configured
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] Logging configured
- [ ] Health checks enabled
- [ ] Monitoring configured
- [ ] Test environment set up

## 🆘 Getting Help

### Support Resources
- **Documentation**: Check the main README.md
- **Issues**: Report bugs on GitHub
- **Discussions**: Ask questions in GitHub Discussions
- **Wiki**: Check the project wiki for detailed guides

### Contact Information
- **Email**: support@urbanflow.com
- **GitHub**: github.com/urbanflow/urbanflow_app
- **Discord**: Join our community server

---

**Need help?** Check the troubleshooting section or reach out to our support team! 🚀
