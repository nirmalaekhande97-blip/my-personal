# ---- Base Node Image ----
FROM node:20-alpine

# Install build tools needed by some native modules
RUN apk add --no-cache python3 make g++

# Create app directory
WORKDIR /app

# Install ALL dependencies (including devDeps needed for TypeScript build)
COPY backend/package*.json ./
RUN npm ci

# Copy source code
COPY backend/ .

# Compile TypeScript → dist/
RUN npm run build

# Expose API port
EXPOSE 4000

# Production start: runs the compiled JS
CMD ["npm", "start"]
