"use strict";
// integrations/thingsboard/index.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheck = exports.initialize = exports.getTokenInfo = exports.logout = exports.getAuthHeaders = exports.getAccessToken = exports.authenticate = exports.isAuthenticated = exports.TB_ENDPOINTS = exports.getTimeseriesKeys = exports.postTelemetryAttributes = exports.getAttributeList = exports.AuthMethod = exports.getConfigSummary = exports.getAuthMethod = exports.isAccessTokenAuth = exports.isUsernamePasswordAuth = exports.THINGSBOARD_CONFIG = exports.ThingsBoardAuthService = exports.ThingsBoardClient = exports.tbClient = exports.thingsBoardClient = void 0;
/**
 * ThingsBoard Integration Module
 *
 * Production-ready ThingsBoard integration with:
 * - JWT authentication with automatic refresh
 * - Singleton pattern for consistent state
 * - Support for username/password and static token auth
 * - Comprehensive error handling and retry logic
 * - Full TypeScript support
 * - Asset-level telemetry and alarm support (ready for future use)
 *
 * @example Basic Usage
 * ```typescript
 * import { thingsBoardClient } from './integrations/thingsboard';
 *
 * // The client automatically handles authentication
 * const devices = await thingsBoardClient.get('/api/tenant/devices');
 * const assets = await thingsBoardClient.get('/api/tenant/assets');
 * ```
 *
 * @example Advanced Authentication Control
 * ```typescript
 * import { thingsBoardClient, ThingsBoardAuthService } from './integrations/thingsboard';
 *
 * // Check authentication status
 * const isAuth = thingsBoardClient.isAuthenticated();
 *
 * // Manually trigger authentication
 * await thingsBoardClient.login();
 *
 * // Get token info for debugging
 * const tokenInfo = thingsBoardClient.getTokenInfo();
 * ```
 */
// ========== Main Exports ==========
// Primary client exports - Use these for all ThingsBoard API calls
var client_1 = require("./client");
Object.defineProperty(exports, "thingsBoardClient", { enumerable: true, get: function () { return client_1.thingsBoardClient; } });
Object.defineProperty(exports, "tbClient", { enumerable: true, get: function () { return client_1.tbClient; } });
Object.defineProperty(exports, "ThingsBoardClient", { enumerable: true, get: function () { return client_1.ThingsBoardClient; } });
Object.defineProperty(exports, "ThingsBoardAuthService", { enumerable: true, get: function () { return client_1.ThingsBoardAuthService; } }); // Authentication service class
// Configuration exports
var thingsboard_config_1 = require("../../config/thingsboard.config");
Object.defineProperty(exports, "THINGSBOARD_CONFIG", { enumerable: true, get: function () { return thingsboard_config_1.THINGSBOARD_CONFIG; } });
Object.defineProperty(exports, "isUsernamePasswordAuth", { enumerable: true, get: function () { return thingsboard_config_1.isUsernamePasswordAuth; } });
Object.defineProperty(exports, "isAccessTokenAuth", { enumerable: true, get: function () { return thingsboard_config_1.isAccessTokenAuth; } });
Object.defineProperty(exports, "getAuthMethod", { enumerable: true, get: function () { return thingsboard_config_1.getAuthMethod; } });
Object.defineProperty(exports, "getConfigSummary", { enumerable: true, get: function () { return thingsboard_config_1.getConfigSummary; } });
// Interface and type exports
var auth_interfaces_1 = require("./auth.interfaces");
Object.defineProperty(exports, "AuthMethod", { enumerable: true, get: function () { return auth_interfaces_1.AuthMethod; } });
// Entity management exports (updated to use new client)
var entity_management_1 = require("./entity_management");
Object.defineProperty(exports, "getAttributeList", { enumerable: true, get: function () { return entity_management_1.getAttributeList; } });
Object.defineProperty(exports, "postTelemetryAttributes", { enumerable: true, get: function () { return entity_management_1.postTelemetryAttributes; } });
Object.defineProperty(exports, "getTimeseriesKeys", { enumerable: true, get: function () { return entity_management_1.getTimeseriesKeys; } });
// Legacy endpoints - keeping for backward compatibility
var endpoints_1 = require("./endpoints");
Object.defineProperty(exports, "TB_ENDPOINTS", { enumerable: true, get: function () { return endpoints_1.TB_ENDPOINTS; } });
// ========== Convenience Functions ==========
// Import the client instance for convenience functions
const client_2 = require("./client");
/**
 * Check if ThingsBoard client is currently authenticated
 *
 * @returns boolean - True if authenticated with valid token
 */
const isAuthenticated = () => {
    return client_2.thingsBoardClient.isAuthenticated();
};
exports.isAuthenticated = isAuthenticated;
/**
 * Perform manual authentication
 * Useful for application startup or when ensuring authentication
 *
 * @returns Promise<string> - Access token
 * @throws Error if authentication fails
 */
const authenticate = async () => {
    return await client_2.thingsBoardClient.login();
};
exports.authenticate = authenticate;
/**
 * Get current valid access token
 * Automatically refreshes if needed
 *
 * @returns Promise<string> - Valid access token
 */
const getAccessToken = async () => {
    return await client_2.thingsBoardClient.getToken();
};
exports.getAccessToken = getAccessToken;
/**
 * Get authentication headers for external HTTP clients
 *
 * @returns Promise<Record<string, string>> - Headers with Authorization
 */
const getAuthHeaders = async () => {
    return await client_2.thingsBoardClient.getAuthHeaders();
};
exports.getAuthHeaders = getAuthHeaders;
/**
 * Clear all authentication tokens (logout)
 */
const logout = () => {
    client_2.thingsBoardClient.logout();
};
exports.logout = logout;
/**
 * Get token information for debugging and monitoring
 *
 * @returns Object with token status and metadata
 */
const getTokenInfo = () => {
    return client_2.thingsBoardClient.getTokenInfo();
};
exports.getTokenInfo = getTokenInfo;
/**
 * Initialize ThingsBoard connection with authentication
 * Call this during application startup
 *
 * @returns Promise<void>
 * @throws Error if initialization fails
 */
const initialize = async () => {
    try {
        console.log('🔌 Initializing ThingsBoard connection...');
        // Trigger authentication
        await client_2.thingsBoardClient.login();
        // Verify connection with a simple API call
        await client_2.thingsBoardClient.get('/api/auth/user');
        console.log('✅ ThingsBoard connection initialized successfully');
        // Log authentication method for debugging
        const config = await Promise.resolve().then(() => __importStar(require('../../config/thingsboard.config')));
        console.log(`🔐 Using ${config.getAuthMethod()} authentication`);
    }
    catch (error) {
        console.error('❌ ThingsBoard initialization failed:', error);
        throw new Error(`ThingsBoard initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
exports.initialize = initialize;
/**
 * Health check for ThingsBoard connection
 * Useful for monitoring and health endpoints
 *
 * @returns Promise<boolean> - True if connection is healthy
 */
const healthCheck = async () => {
    try {
        // Check if authenticated
        if (!client_2.thingsBoardClient.isAuthenticated()) {
            await client_2.thingsBoardClient.login();
        }
        // Test API call
        await client_2.thingsBoardClient.get('/api/auth/user');
        return true;
    }
    catch (error) {
        console.error('ThingsBoard health check failed:', error);
        return false;
    }
};
exports.healthCheck = healthCheck;
//# sourceMappingURL=index.js.map