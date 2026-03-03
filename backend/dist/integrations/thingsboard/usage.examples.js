"use strict";
// integrations/thingsboard/usage.examples.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.thingsBoardRoutes = void 0;
exports.getAllDevices = getAllDevices;
exports.getAllAssets = getAllAssets;
exports.createDevice = createDevice;
exports.createAsset = createAsset;
exports.advancedDeviceQuery = advancedDeviceQuery;
exports.initializeApp = initializeApp;
exports.shutdownApp = shutdownApp;
exports.checkAuthStatus = checkAuthStatus;
exports.ensureThingsBoardAuth = ensureThingsBoardAuth;
exports.getAssetAttributes = getAssetAttributes;
exports.setAssetAttributes = setAssetAttributes;
exports.getAssetTelemetryKeys = getAssetTelemetryKeys;
exports.getAssetAlarms = getAssetAlarms;
exports.robustApiCall = robustApiCall;
exports.reliableDeviceFetch = reliableDeviceFetch;
exports.batchAssetOperations = batchAssetOperations;
exports.useWithExternalClient = useWithExternalClient;
exports.debugTokenInfo = debugTokenInfo;
exports.debugForceTokenRefresh = debugForceTokenRefresh;
/**
 * ThingsBoard Integration Usage Examples
 *
 * This file demonstrates production-ready patterns for using the ThingsBoard authentication module.
 * These examples show real-world usage scenarios with proper error handling and TypeScript typing.
 */
const index_1 = require("./index");
// =============================================================================
// EXAMPLE 1: Basic API Usage with Automatic Authentication
// =============================================================================
/**
 * Get all tenant devices - Authentication is handled automatically
 */
async function getAllDevices() {
    try {
        // The client automatically handles authentication, token refresh, etc.
        const devices = await index_1.thingsBoardClient.get('/api/tenant/devices');
        return devices;
    }
    catch (error) {
        console.error('Failed to fetch devices:', error);
        throw error;
    }
}
/**
 * Get all tenant assets - Prepared for asset-level telemetry/alarms
 */
async function getAllAssets() {
    try {
        const assets = await index_1.thingsBoardClient.get('/api/tenant/assets');
        console.log(`Retrieved ${assets.length} assets`);
        return assets;
    }
    catch (error) {
        console.error('Failed to fetch assets:', error);
        throw error;
    }
}
/**
 * Create a new device with proper error handling
 */
async function createDevice(deviceData) {
    try {
        const device = await index_1.thingsBoardClient.post('/api/device', deviceData);
        console.log(`Device created: ${device.name} (ID: ${device.id.id})`);
        return device;
    }
    catch (error) {
        console.error('Failed to create device:', error);
        throw error;
    }
}
/**
 * Create a new asset for telemetry collection
 */
async function createAsset(assetData) {
    try {
        const asset = await index_1.thingsBoardClient.post('/api/asset', assetData);
        console.log(`Asset created: ${asset.name} (ID: ${asset.id.id})`);
        return asset;
    }
    catch (error) {
        console.error('Failed to create asset:', error);
        throw error;
    }
}
// =============================================================================
// EXAMPLE 2: Using Direct Axios Instance
// =============================================================================
/**
 * Example using the raw Axios instance for advanced usage
 */
async function advancedDeviceQuery(limit = 10) {
    try {
        // Using tbClient directly gives you access to all Axios features
        const response = await index_1.tbClient.get('/api/tenant/devices', {
            params: {
                pageSize: limit,
                sortOrder: 'ASC',
                sortProperty: 'name'
            },
            timeout: 15000,
            headers: {
                'X-Custom-Header': 'custom-value'
            }
        });
        return response.data;
    }
    catch (error) {
        console.error('Advanced device query failed:', error);
        throw error;
    }
}
// =============================================================================
// EXAMPLE 3: Authentication Management
// =============================================================================
/**
 * Application initialization with ThingsBoard connection
 */
async function initializeApp() {
    try {
        console.log('🚀 Starting application initialization...');
        // Initialize ThingsBoard connection
        await (0, index_1.initialize)();
        // Verify token info
        const tokenInfo = (0, index_1.getTokenInfo)();
        console.log('🔐 Authentication details:', {
            authMethod: tokenInfo.authMethod,
            tokenValid: tokenInfo.isValid,
            expiresInMinutes: tokenInfo.expiresIn ? Math.round(tokenInfo.expiresIn / 60000) : null
        });
        console.log('✅ Application initialization complete');
    }
    catch (error) {
        console.error('❌ Application initialization failed:', error);
        process.exit(1);
    }
}
/**
 * Graceful application shutdown
 */
function shutdownApp() {
    try {
        console.log('🔄 Shutting down application...');
        // Clear ThingsBoard tokens
        (0, index_1.logout)();
        console.log('✅ Application shutdown complete');
    }
    catch (error) {
        console.error('❌ Error during shutdown:', error);
    }
}
/**
 * Check authentication status with detailed logging
 */
async function checkAuthStatus() {
    try {
        const isAuth = (0, index_1.isAuthenticated)();
        console.log(`🔐 Authentication status: ${isAuth ? 'AUTHENTICATED' : 'NOT AUTHENTICATED'}`);
        if (isAuth) {
            const tokenInfo = (0, index_1.getTokenInfo)();
            const expiresInMinutes = tokenInfo.expiresIn ? Math.round(tokenInfo.expiresIn / 60000) : null;
            console.log(`⏰ Token expires in: ${expiresInMinutes} minutes`);
        }
        return isAuth;
    }
    catch (error) {
        console.error('Failed to check auth status:', error);
        return false;
    }
}
// =============================================================================
// EXAMPLE 4: Express.js Integration
// =============================================================================
/**
 * Express middleware to ensure ThingsBoard authentication
 */
function ensureThingsBoardAuth() {
    return async (req, res, next) => {
        try {
            if (!(0, index_1.isAuthenticated)()) {
                console.log('🔐 Triggering ThingsBoard authentication...');
                await (0, index_1.authenticate)();
            }
            next();
        }
        catch (error) {
            console.error('ThingsBoard authentication middleware failed:', error);
            res.status(503).json({
                error: 'ThingsBoard service unavailable',
                message: 'Failed to authenticate with ThingsBoard'
            });
        }
    };
}
/**
 * Express route handlers with ThingsBoard integration
 */
exports.thingsBoardRoutes = {
    /**
     * GET /api/devices - Get all devices
     */
    getDevices: async (req, res) => {
        try {
            const devices = await getAllDevices();
            res.json({
                success: true,
                data: devices,
                count: devices.length
            });
        }
        catch (error) {
            console.error('Get devices endpoint failed:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch devices',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    },
    /**
     * GET /api/assets - Get all assets
     */
    getAssets: async (req, res) => {
        try {
            const assets = await getAllAssets();
            res.json({
                success: true,
                data: assets,
                count: assets.length
            });
        }
        catch (error) {
            console.error('Get assets endpoint failed:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch assets',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    },
    /**
     * POST /api/devices - Create device
     */
    createDevice: async (req, res) => {
        try {
            const deviceData = req.body;
            // Basic validation
            if (!deviceData.name || !deviceData.type) {
                res.status(400).json({
                    success: false,
                    error: 'Missing required fields: name and type'
                });
                return;
            }
            const device = await createDevice(deviceData);
            res.status(201).json({
                success: true,
                data: device
            });
        }
        catch (error) {
            console.error('Create device endpoint failed:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create device',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    },
    /**
     * GET /health/thingsboard - Health check endpoint
     */
    healthCheck: async (req, res) => {
        try {
            const isHealthy = await (0, index_1.healthCheck)();
            const tokenInfo = (0, index_1.getTokenInfo)();
            if (isHealthy) {
                res.json({
                    status: 'healthy',
                    service: 'ThingsBoard',
                    authenticated: tokenInfo.isValid,
                    authMethod: tokenInfo.authMethod,
                    tokenExpiresIn: tokenInfo.expiresIn
                });
            }
            else {
                res.status(503).json({
                    status: 'unhealthy',
                    service: 'ThingsBoard',
                    authenticated: false,
                    error: 'Health check failed'
                });
            }
        }
        catch (error) {
            res.status(503).json({
                status: 'unhealthy',
                service: 'ThingsBoard',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
};
// =============================================================================
// EXAMPLE 5: Asset-Level Operations (Ready for Telemetry/Alarms)
// =============================================================================
/**
 * Get asset attributes - prepared for telemetry operations
 */
async function getAssetAttributes(assetId, scope = 'SERVER_SCOPE') {
    try {
        const attributes = await index_1.thingsBoardClient.get(`/api/plugins/telemetry/ASSET/${assetId}/keys/attributes/${scope}`);
        return attributes;
    }
    catch (error) {
        console.error(`Failed to get asset attributes for ${assetId}:`, error);
        throw error;
    }
}
/**
 * Set asset attributes - prepared for asset management
 */
async function setAssetAttributes(assetId, attributes, scope = 'SERVER_SCOPE') {
    try {
        await index_1.thingsBoardClient.post(`/api/plugins/telemetry/ASSET/${assetId}/attributes/${scope}`, attributes);
        console.log(`Asset attributes updated for ${assetId}`);
    }
    catch (error) {
        console.error(`Failed to set asset attributes for ${assetId}:`, error);
        throw error;
    }
}
/**
 * Get asset telemetry keys - ready for telemetry data collection
 */
async function getAssetTelemetryKeys(assetId) {
    try {
        const keys = await index_1.thingsBoardClient.get(`/api/plugins/telemetry/ASSET/${assetId}/keys/timeseries`);
        return keys;
    }
    catch (error) {
        console.error(`Failed to get telemetry keys for asset ${assetId}:`, error);
        throw error;
    }
}
/**
 * Get asset alarms - ready for alarm management
 */
async function getAssetAlarms(assetId, status) {
    try {
        const params = {};
        if (status) {
            params.status = status;
        }
        const alarms = await index_1.thingsBoardClient.get(`/api/alarm/ASSET/${assetId}`, { params });
        return alarms.data || [];
    }
    catch (error) {
        console.error(`Failed to get alarms for asset ${assetId}:`, error);
        throw error;
    }
}
// =============================================================================
// EXAMPLE 6: Error Handling and Retry Patterns
// =============================================================================
/**
 * Robust API call with custom retry logic
 */
async function robustApiCall(apiCall, maxRetries = 3, baseDelay = 1000) {
    let lastError;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await apiCall();
        }
        catch (error) {
            lastError = error;
            console.warn(`API call attempt ${attempt + 1} failed:`, error);
            if (attempt < maxRetries - 1) {
                const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    throw lastError;
}
/**
 * Example of using robust API calls
 */
async function reliableDeviceFetch() {
    return await robustApiCall(() => getAllDevices(), 3, 2000);
}
// =============================================================================
// EXAMPLE 7: Batch Operations
// =============================================================================
/**
 * Process multiple assets in parallel
 */
async function batchAssetOperations(assetIds) {
    try {
        const results = await Promise.allSettled(assetIds.map(async (assetId) => {
            const asset = await index_1.thingsBoardClient.get(`/api/asset/${assetId}`);
            const telemetryKeys = await getAssetTelemetryKeys(assetId);
            const alarms = await getAssetAlarms(assetId, 'ACTIVE');
            return {
                assetId,
                asset,
                telemetryKeys,
                activeAlarms: alarms.length
            };
        }));
        // Separate successful and failed results
        const successful = results
            .filter((result) => result.status === 'fulfilled')
            .map(result => result.value);
        const failed = results
            .filter((result) => result.status === 'rejected')
            .map(result => result.reason);
        if (failed.length > 0) {
            console.warn(`${failed.length} batch operations failed:`, failed);
        }
        console.log(`Batch operations completed: ${successful.length} successful, ${failed.length} failed`);
        return successful;
    }
    catch (error) {
        console.error('Batch asset operations failed:', error);
        throw error;
    }
}
// =============================================================================
// EXAMPLE 8: External HTTP Client Integration
// =============================================================================
/**
 * Use ThingsBoard auth headers with external HTTP client
 */
async function useWithExternalClient() {
    try {
        // Get auth headers for use with external HTTP clients
        const headers = await (0, index_1.getAuthHeaders)();
        // Example with native fetch API
        const response = await fetch(`${process.env.THINGSBOARD_BASE_URL}/api/auth/user`, {
            headers: {
                ...headers,
                'Custom-External-Header': 'external-value'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const userData = await response.json();
        console.log('User data from external client:', userData);
    }
    catch (error) {
        console.error('External client request failed:', error);
        throw error;
    }
}
// =============================================================================
// EXAMPLE 9: Development and Debugging Utilities
// =============================================================================
/**
 * Debug token information
 */
function debugTokenInfo() {
    const tokenInfo = (0, index_1.getTokenInfo)();
    console.log('=== ThingsBoard Token Debug Info ===');
    console.log(`Has Token: ${tokenInfo.hasToken}`);
    console.log(`Is Valid: ${tokenInfo.isValid}`);
    console.log(`Auth Method: ${tokenInfo.authMethod}`);
    if (tokenInfo.expiresIn !== null) {
        const expiresInMinutes = Math.round(tokenInfo.expiresIn / 60000);
        const expiresInHours = Math.round(expiresInMinutes / 60);
        console.log(`Expires In: ${expiresInMinutes} minutes (${expiresInHours} hours)`);
    }
    console.log('=====================================');
}
/**
 * Force token refresh for testing
 */
async function debugForceTokenRefresh() {
    try {
        console.log('🔄 Forcing token refresh...');
        const newToken = await index_1.thingsBoardClient.refreshToken();
        console.log('✅ Token refresh successful');
        debugTokenInfo();
        return newToken;
    }
    catch (error) {
        console.error('❌ Token refresh failed:', error);
        throw error;
    }
}
//# sourceMappingURL=usage.examples.js.map