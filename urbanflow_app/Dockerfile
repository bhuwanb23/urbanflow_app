# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Create expo configuration
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1

# Expose port for Expo
EXPOSE 8081

# Start Expo in development mode
CMD ["npm", "start"]
