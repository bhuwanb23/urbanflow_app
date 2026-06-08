# 🐳 UrbanFlow Docker Setup Guide

This guide explains how to run UrbanFlow using Docker containers for easy development and deployment.

---

## 📋 Prerequisites

- **Docker** (v20.10+) and **Docker Compose** (v2.0+)
- **Git** for cloning the repository
- **Expo Go** app (optional, for mobile testing)

### Installation

1. **Install Docker Desktop:**
   - [Windows](https://docs.docker.com/desktop/install/windows-install/)
   - [macOS](https://docs.docker.com/desktop/install/mac-install/)
   - [Linux](https://docs.docker.com/engine/install/)

2. **Verify Installation:**
   ```bash
   docker --version
   docker compose version
   ```

---

## 🚀 Quick Start with Docker

### Option 1: Backend Only (Recommended for API Development)

```bash
# Clone the repository
git clone https://github.com/yourusername/urbanflow.git
cd urbanflow

# Copy environment example from root
cp .env.example .env

# Edit .env and add your API keys (optional — static data works without)
# See docs/API_KEYS.md for sign-up URLs and free-tier limits

# Start backend container
docker compose up backend

# Or start in detached mode (background)
docker compose up -d backend
```

**Access the API:** http://localhost:3000

### Option 2: Full Stack (Backend + Frontend)

```bash
# Start all services
docker compose up

# Or in detached mode
docker compose up -d
```

**Services:**
- Backend API: http://localhost:3000
- Frontend Expo: http://localhost:8081

---

## 🔧 Docker Commands

### Starting Services

```bash
# Start all services
docker compose up

# Start specific service
docker compose up backend
docker compose up frontend

# Start in background (detached mode)
docker compose up -d
```

### Stopping Services

```bash
# Stop all services
docker compose down

# Stop specific service
docker compose stop backend

# Stop and remove volumes (clean slate)
docker compose down -v
```

### Viewing Logs

```bash
# View all logs
docker compose logs

# View specific service logs
docker compose logs backend
docker compose logs -f backend  # Follow logs

# View last 50 lines
docker compose logs --tail=50 backend
```

### Rebuilding Containers

```bash
# Rebuild after code changes
docker compose build

# Rebuild without cache
docker compose build --no-cache

# Rebuild and restart
docker compose up -d --build
```

### Accessing Containers

```bash
# Execute command in running container
docker compose exec backend sh
docker compose exec backend npm run seed

# Access container shell interactively
docker compose exec backend /bin/sh

# View running containers
docker compose ps
```

---

## 🗄️ Database Management

### Initialize Database

```bash
# Seed database with demo data
docker compose exec backend npm run seed
```

### Backup Database

```bash
# Copy SQLite database from container
docker cp urbanflow-backend:/app/data/urbanflow.sqlite ./backup.db
```

### Reset Database

```bash
# Stop containers
docker compose down

# Remove volumes
docker compose down -v

# Restart and reinitialize
docker compose up -d
docker compose exec backend npm run seed
```

---

## 🌐 Network & Ports

| Service | Port | Protocol | Description |
|---------|------|----------|-------------|
| **Backend API** | 3000 | HTTP | REST API server |
| **Frontend Expo** | 8081 | HTTP | Expo dev server |

### Accessing Services

- **From Host Machine:** `http://localhost:3000`
- **From Other Containers:** `http://backend:3000`
- **From Mobile Device:** Use your computer's IP address

---

## ⚙️ Configuration

### Environment Variables

Edit `.env` file at project root (copy from `.env.example`):

```bash
cp .env.example .env
```

See `.env.example` for all available variables and [docs/API_KEYS.md](API_KEYS.md) for sign-up URLs and free-tier limits. Unset keys gracefully disable features.

### Volume Mounts

The Docker Compose uses volumes for:

- **Code Sync:** Live code updates without rebuild
- **Data Persistence:** Database survives container restarts
- **Logs:** Centralized log storage

```yaml
volumes:
  - ./backend:/app          # Code sync
  - ./data:/app/data        # Database persistence
  - backend_logs:/app/logs  # Log storage
```

---

## 🧪 Testing & Development

### Running Tests

```bash
# Run tests inside container
docker compose exec backend npm test

# Run with coverage
docker compose exec backend npm run test:coverage
```

### Development Workflow

1. **Make code changes** on your host machine
2. **Changes auto-sync** to containers (via volumes)
3. **Nodemon restarts** backend automatically
4. **Refresh** frontend to see changes

### Debugging

```bash
# Access backend container
docker compose exec backend sh

# Check Node.js version
node --version

# Check if server is running
curl http://localhost:3000/health

# View environment variables
printenv
```

---

## 🚨 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker compose logs backend

# Verify ports aren't in use
netstat -ano | findstr :3000

# Remove conflicting containers
docker rm -f urbanflow-backend
```

### Volume Permission Errors (Linux/Mac)

```bash
# Problem: Container logs show 'EACCES: permission denied'
# Solution: Fix ownership of mounted directories

# Find the container user ID (often 1000)
docker compose exec backend id -u

# Fix ownership on host
sudo chown -R 1000:1000 ./data
sudo chown -R 1000:1000 ./backend

# On SELinux-enabled systems, also run:
sudo chcon -Rt svirt_sandbox_file_t ./data
```

### Database Connection Errors

```bash
# Ensure data directory exists
mkdir -p data/output

# Check permissions
chmod -R 755 data/

# Re-seed database
docker compose exec backend npm run seed
```

### API Not Responding

```bash
# Check health endpoint
curl http://localhost:3000/health

# Restart backend
docker compose restart backend

# Rebuild container
docker compose up -d --build backend
```

### Expo Issues

```bash
# Clear Expo cache
docker compose exec frontend npx expo start -c

# Use local Expo instead of Docker
cd urbanflow_app
npm start
```

---

## 📦 Production Deployment

### Build for Production

```bash
# Build optimized images
docker compose build

# Start in production mode
docker compose up -d
```

### Security Considerations

- Change default passwords
- Use secrets management for API keys
- Enable HTTPS/TLS
- Restrict CORS origins
- Set appropriate rate limits

### Scaling

For production scaling, use a reverse proxy:

```bash
# Use with nginx or traefik in front of the backend
# (SQLite is single-instance — scale with read-replica or switch to PostgreSQL)
```

---

## 🎯 Next Steps

### Add OpenTripPlanner (Future)

Uncomment OTP service in `docker-compose.yml`:

```yaml
otp:
  image: opentripplanner/opentripplanner:latest
  ports:
    - "8020:8020"
  volumes:
    - ./data/otp:/var/opentripplanner
```

### Add PostgreSQL (Future)

Replace SQLite with PostgreSQL:

```yaml
postgres:
  image: postgres:14-alpine
  environment:
    POSTGRES_DB: urbanflow
    POSTGRES_USER: urbanflow
    POSTGRES_PASSWORD: secure_password
  volumes:
    - postgres_data:/var/lib/postgresql/data
```

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Expo Docker Setup](https://docs.expo.dev/workflow/docker/)

---

## 🤝 Contributing

Found issues with Docker setup? Please open an issue or submit a PR!

---

**Made with ❤️ for easier UrbanFlow deployment**
