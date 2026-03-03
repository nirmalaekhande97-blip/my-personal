# ThingsBoard Authentication Module - Production Ready

## 🎯 Overview

Production-ready ThingsBoard authentication module with JWT token management, automatic refresh, singleton pattern, and comprehensive TypeScript support. Built according to specifications with environment variables:

```env
THINGSBOARD_BASE_URL=http://localhost:8080
THINGSBOARD_USERNAME=tenant@thingsboard.org
THINGSBOARD_PASSWORD=tenant
THINGSBOARD_ACCESS_TOKEN=OPTIONAL_STATIC_TOKEN
```

## 📁 Project Structure

```
backend/src/
├── config/
│   └── thingsboard.config.ts           ← Environment loading & validation
├── integrations/thingsboard/
│   ├── auth.service.ts                 ← Core authentication service
│   ├── auth.interfaces.ts              ← TypeScript interfaces
│   ├── client.ts                       ← Singleton HTTP client
│   ├── index.ts                        ← Main exports
│   ├── entity_management.ts            ← Entity operations (updated)
│   ├── endpoints.ts                    ← API endpoints
│   └── usage.examples.ts               ← Usage examples
└── index.ts                           ← Application entry point
```

## 🔑 Core Deliverables Implemented

### ✅ auth.service.ts
- **login()** - JWT/static token authentication with retry logic
- **getToken()** - Current valid token with auto-refresh
- **getAuthHeaders()** - Authorization headers for HTTP requests
- **getAxiosInstance()** - Pre-configured Axios with interceptors
- **Auto refresh token logic** - Seamless token renewal before expiration
- **Error handling** - Comprehensive error management with typed responses

### ✅ config/thingsboard.config.ts
- **Environment loading** - dotenv integration with validation
- **Validation** - Required field checks and format validation
- **Configuration summary** - Debug utilities for auth method detection

### ✅ integrations/thingsboard/index.ts
- **Exported initialized client** - Ready-to-use singleton client
- **Convenience functions** - Helper functions for common operations
- **Example usage** - Complete integration examples

## 🚀 Quick Start

### 1. Environment Configuration
```bash
# Copy and configure environment variables
cp .env.example .env
```

```env
THINGSBOARD_BASE_URL=http://localhost:8080
THINGSBOARD_USERNAME=tenant@thingsboard.org
THINGSBOARD_PASSWORD=tenant
```

### 2. Basic Usage
```typescript
import { thingsBoardClient } from './integrations/thingsboard';

// Automatic authentication - ready to use
const devices = await thingsBoardClient.get('/api/tenant/devices');
const assets = await thingsBoardClient.get('/api/tenant/assets');
```

### 3. Application Integration
```typescript
import { initialize, healthCheck } from './integrations/thingsboard';

// In your app startup
await initialize();

// Health check for monitoring
const isHealthy = await healthCheck();
```

## 🏗️ Production Features

### 🔒 Authentication
- **Singleton Pattern** - Consistent state across application
- **JWT Token Management** - Automatic refresh with expiration detection
- **Multiple Auth Methods** - Username/password (preferred) + static token fallback
- **Retry Logic** - Exponential backoff for failed authentication attempts
- **Concurrent Safety** - Prevents duplicate authentication attempts

### 🌐 HTTP Client
- **Pre-configured Axios Instance** - Ready for ThingsBoard API calls
- **Request Interceptors** - Automatic token attachment
- **Response Interceptors** - Auto-retry on 401/403 with token refresh
- **Error Handling** - Typed error responses with context
- **Timeout Management** - Configurable timeouts for auth and requests

### 📊 Asset-Level Support
- **Asset Operations** - Ready for telemetry and alarm collection
- **Batch Processing** - Parallel asset operations with error handling
- **Attribute Management** - Server/client/shared scope support
- **Telemetry Keys** - Discovery of available telemetry data
- **Alarm Management** - Active/cleared alarm filtering

## 🎯 API Reference

### Core Client
```typescript
import { thingsBoardClient } from './integrations/thingsboard';

// HTTP methods with auto-authentication
await thingsBoardClient.get(url, config?)
await thingsBoardClient.post(url, data?, config?)
await thingsBoardClient.put(url, data?, config?)
await thingsBoardClient.delete(url, config?)
await thingsBoardClient.patch(url, data?, config?)

// Authentication control
await thingsBoardClient.login()
const token = await thingsBoardClient.getToken()
const headers = await thingsBoardClient.getAuthHeaders()
const isAuth = thingsBoardClient.isAuthenticated()
thingsBoardClient.logout()
```

### Convenience Functions
```typescript
import { 
  authenticate,
  isAuthenticated,
  getTokenInfo,
  initialize,
  healthCheck 
} from './integrations/thingsboard';

// Application lifecycle
await initialize()              // Startup initialization
const isAuth = isAuthenticated() // Quick auth check
const info = getTokenInfo()     // Debug information
const healthy = await healthCheck() // Service health
```

### Express Integration
```typescript
import { ensureThingsBoardAuth, thingsBoardRoutes } from './integrations/thingsboard/usage.examples';

// Middleware
app.use(ensureThingsBoardAuth());

// Route handlers
app.get('/api/devices', thingsBoardRoutes.getDevices);
app.get('/api/assets', thingsBoardRoutes.getAssets);
app.post('/api/devices', thingsBoardRoutes.createDevice);
app.get('/health/thingsboard', thingsBoardRoutes.healthCheck);
```

## 🔧 TypeScript Support

### Full Type Coverage
- **Configuration Types** - Environment and config interfaces
- **Authentication Types** - Login, token, and response interfaces
- **Error Types** - Comprehensive error handling with context
- **API Types** - Request/response typing for ThingsBoard APIs

### Interface Examples
```typescript
// Authentication configuration
interface ThingsBoardConfig {
  baseUrl: string;
  auth: {
    username?: string;
    password?: string;
    accessToken?: string;
  };
  timeouts: {
    auth: number;
    request: number;
  };
  token: {
    refreshThresholdMinutes: number;
    maxRetries: number;
  };
}

// Token information
interface TokenInfo {
  hasToken: boolean;
  isValid: boolean;
  expiresIn: number | null;
  authMethod: string;
}
```

## 🎯 Asset-Level Telemetry & Alarms (Ready)

```typescript
import { 
  getAssetAttributes,
  setAssetAttributes,
  getAssetTelemetryKeys,
  getAssetAlarms 
} from './integrations/thingsboard/usage.examples';

// Asset attribute management
const attrs = await getAssetAttributes(assetId, 'SERVER_SCOPE');
await setAssetAttributes(assetId, { status: 'active' });

// Telemetry discovery
const telemetryKeys = await getAssetTelemetryKeys(assetId);

// Alarm monitoring
const activeAlarms = await getAssetAlarms(assetId, 'ACTIVE');

// Batch asset operations
const results = await batchAssetOperations([assetId1, assetId2, assetId3]);
```

## 🛠️ Development Tools

### Build & Development
```bash
npm run build       # TypeScript compilation
npm run dev         # Development server
npm run build:watch # Watch mode compilation
npm run clean       # Clean build artifacts
```

### Debug Utilities
```typescript
import { debugTokenInfo, debugForceTokenRefresh } from './integrations/thingsboard/usage.examples';

// Debug current token state
debugTokenInfo();

// Force token refresh for testing
await debugForceTokenRefresh();
```

## ✅ Production Checklist

- ✅ **Singleton pattern** implementation
- ✅ **Async/await** throughout codebase
- ✅ **Environment variable** configuration
- ✅ **JWT token management** with auto-refresh
- ✅ **Comprehensive error handling**
- ✅ **TypeScript typing** everywhere
- ✅ **Clear comments** explaining logic
- ✅ **Asset-level** operations ready
- ✅ **Reusable across** all ThingsBoard API calls
- ✅ **Production-ready** patterns and practices

## 📈 Performance Features

- **Connection Pooling** - Reused Axios instance
- **Token Caching** - In-memory storage with expiration
- **Concurrent Safety** - Prevents duplicate auth attempts
- **Retry Logic** - Exponential backoff for failed requests
- **Batch Operations** - Parallel processing with error isolation

## 🔒 Security Features

- **Token Expiration** - Automatic renewal before expiry
- **Secure Storage** - In-memory storage (no persistence)
- **Error Sanitization** - No credential exposure in logs
- **Timeout Protection** - Prevents hanging requests
- **Input Validation** - Environment variable validation

The module is now production-ready and can be used across your entire IIoT platform for ThingsBoard integration! 🚀