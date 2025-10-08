# Backend Dockerfile
FROM node:18-alpine AS base

WORKDIR /app

# Install dependencies
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy source
COPY backend/. .

# Ensure storage directories exist
RUN mkdir -p /app/storage/logs && mkdir -p /app/storage/uploads

ENV NODE_ENV=production \
    PORT=3000 \
    APP_URL=http://localhost:3000

EXPOSE 3000

# Start API
CMD ["node", "server.js"]

