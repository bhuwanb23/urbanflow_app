# ---- Stage 1: dependencies ----
FROM node:18-alpine AS deps

WORKDIR /app

# Install only production deps
COPY package*.json ./
RUN npm ci --omit=dev \
    && npm cache clean --force

# ---- Stage 2: runtime ----
FROM node:18-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000

# Create non-root user (node:alpine ships with built-in `node` user, uid 1000)
# We use it directly; no need to adduser.

# Copy production node_modules from deps stage
COPY --from=deps --chown=node:node /app/node_modules ./node_modules

# Copy application source
COPY --chown=node:node . .

# Create data + log directories owned by node user
RUN mkdir -p data/output logs \
    && chown -R node:node data logs

USER node

EXPOSE 3000

# Health check against /health endpoint (busybox wget lacks --spider, use node)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health',(r)=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

# Use direct node invocation (avoids npm-script fork)
CMD ["node", "server.js"]
