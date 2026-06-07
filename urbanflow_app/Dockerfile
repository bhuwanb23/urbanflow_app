# ---- Stage 1: deps ----
FROM node:18-alpine AS deps

WORKDIR /app

# Install all deps (incl. devDeps needed by Metro/Expo)
COPY package*.json ./
RUN npm ci --legacy-peer-deps \
    && npm cache clean --force

# ---- Stage 2: dev runtime (current behavior) ----
# Per Phase 6 Q2=C the frontend Dockerfile stays dev-oriented
# (mobile testing requires Metro hot reload via volume mount).
# The hardening applied here is:
#  - non-root USER node
#  - npm cache clean (smaller image)
#  - .dockerignore excludes node_modules so COPY works
FROM node:18-alpine AS runtime

WORKDIR /app

ENV EXPO_NO_TELEMETRY=1 \
    CI=true

# Allow override of API base at build/run time
ARG EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
ENV EXPO_PUBLIC_API_URL=${EXPO_PUBLIC_API_URL}

# Copy from deps stage (already cleaned cache)
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .

USER node

EXPOSE 8081

# Dev mode: Metro bundler; bind to all interfaces so host can reach it
CMD ["npm", "run", "start", "--", "--host", "lan"]
