"use strict";
// integrations/thingsboard/examples.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceController = void 0;
exports.getDevices = getDevices;
exports.createDevice = createDevice;
exports.initializeThingsBoardService = initializeThingsBoardService;
exports.cleanupThingsBoardService = cleanupThingsBoardService;
exports.manualAuthentication = manualAuthentication;
exports.forceReAuthentication = forceReAuthentication;
exports.robustApiCall = robustApiCall;
exports.batchDeviceOperations = batchDeviceOperations;
exports.customHeadersExample = customHeadersExample;
exports.startupSequence = startupSequence;
exports.shutdownSequence = shutdownSequence;
/**
 * ThingsBoard Authentication Examples
 *
 * This file demonstrates various usage patterns for the ThingsBoard authentication module.
 * Copy these examples into your actual service files.
 */
const index_1 = require("./index");
// =============================================================================
// EXAMPLE 1: Basic API Calls (Recommended Pattern)
// =============================================================================
/**
 * Simple device retrieval - authentication is handled automatically
 */
async function getDevices() {
    try {
        const response = await index_1.tbClient.get('/api/tenant/devices');
        return response.data;
    }
    catch (error) {
        console.error('Failed to fetch devices:', error);
        throw error;
    }
}
/**
 * Create a new device - POST request example
 */
async function createDevice(deviceData) {
    try {
        const response = await index_1.tbClient.post('/api/device', deviceData);
        return response.data;
    }
    catch (error) {
        console.error('Failed to create device:', error);
        throw error;
    }
}
// =============================================================================
// EXAMPLE 2: Authentication State Management
// =============================================================================
/**
 * Service initialization with authentication check
 */
async function initializeThingsBoardService() {
    try {
        console.log('Initializing ThingsBoard service...');
        // Check if already authenticated
        if ((0, index_1.isThingsBoardAuthenticated)()) {
            console.log('Already authenticated, ready to make API calls');
            return;
        }
        // Trigger authentication
        console.log('Not authenticated, logging in...');
        await (0, index_1.authenticateThingsBoard)();
        console.log('Authentication successful');
    }
    catch (error) {
        console.error('Failed to initialize ThingsBoard service:', error);
        throw error;
    }
}
/**
 * Service cleanup on application shutdown
 */
function cleanupThingsBoardService() {
    console.log('Cleaning up ThingsBoard service...');
    (0, index_1.logoutThingsBoard)();
    console.log('Logged out successfully');
}
// =============================================================================
// EXAMPLE 3: Advanced Authentication Control
// =============================================================================
/**
 * Manual authentication with error handling
 */
async function manualAuthentication() {
    try {
        // Get current authentication status
        const isAuth = index_1.thingsBoardClientInstance.isAuthenticated();
        console.log('Current auth status:', isAuth);
        if (!isAuth) {
            // Manual authentication trigger
            await index_1.thingsBoardClientInstance.authenticate();
            console.log('Manual authentication completed');
        }
        // Get access token for external use
        const token = await index_1.thingsBoardClientInstance.getAccessToken();
        console.log('Current access token available');
        return { token, isAuthenticated: true };
    }
    catch (error) {
        console.error('Manual authentication failed:', error);
        return { token: null, isAuthenticated: false };
    }
}
/**
 * Force logout and re-authentication
 */
async function forceReAuthentication() {
    try {
        console.log('Forcing re-authentication...');
        // Clear existing tokens
        index_1.thingsBoardClientInstance.logout();
        // Re-authenticate
        await index_1.thingsBoardClientInstance.authenticate();
        console.log('Re-authentication completed successfully');
        return true;
    }
    catch (error) {
        console.error('Re-authentication failed:', error);
        return false;
    }
}
// =============================================================================
// EXAMPLE 4: Error Handling Patterns
// =============================================================================
/**
 * Robust API call with comprehensive error handling
 */
async function robustApiCall(endpoint, data) {
    try {
        const response = await index_1.tbClient.post(endpoint, data);
        return { success: true, data: response.data };
    }
    catch (error) {
        console.error(`API call to ${endpoint} failed:`, error);
        // Handle specific HTTP error codes
        if (error.response) {
            const { status, data } = error.response;
            switch (status) {
                case 401:
                    console.error('Unauthorized - authentication may have failed');
                    return { success: false, error: 'Authentication required' };
                case 403:
                    console.error('Forbidden - insufficient permissions');
                    return { success: false, error: 'Insufficient permissions' };
                case 404:
                    console.error('Not found - endpoint or resource does not exist');
                    return { success: false, error: 'Resource not found' };
                case 429:
                    console.error('Rate limited - too many requests');
                    return { success: false, error: 'Rate limit exceeded' };
                case 500:
                    console.error('Server error - ThingsBoard internal error');
                    return { success: false, error: 'Server error' };
                default:
                    console.error(`HTTP error ${status}:`, data);
                    return { success: false, error: `HTTP ${status} error` };
            }
        }
        else if (error.request) {
            // Network error
            console.error('Network error - could not reach ThingsBoard server');
            return { success: false, error: 'Network error' };
        }
        else {
            // Other error
            console.error('Unexpected error:', error.message);
            return { success: false, error: 'Unexpected error' };
        }
    }
}
// =============================================================================
// EXAMPLE 5: Batch Operations
// =============================================================================
/**
 * Batch device operations with authentication management
 */
async function batchDeviceOperations(deviceIds) {
    try {
        // Ensure authentication before batch operations
        if (!(0, index_1.isThingsBoardAuthenticated)()) {
            await (0, index_1.authenticateThingsBoard)();
        }
        const results = [];
        for (const deviceId of deviceIds) {
            try {
                const device = await index_1.tbClient.get(`/api/device/${deviceId}`);
                results.push({ deviceId, success: true, data: device.data });
            }
            catch (error) {
                console.error(`Failed to fetch device ${deviceId}:`, error);
                results.push({ deviceId, success: false, error: error });
            }
        }
        return results;
    }
    catch (error) {
        console.error('Batch operations failed:', error);
        throw error;
    }
}
// =============================================================================
// EXAMPLE 6: Custom Headers and Configuration
// =============================================================================
/**
 * API call with custom headers
 */
async function customHeadersExample() {
    try {
        // The authentication headers will be automatically added
        const response = await index_1.tbClient.get('/api/tenant/devices', {
            headers: {
                'Custom-Header': 'custom-value',
                'X-Request-ID': 'unique-request-id'
            },
            timeout: 15000 // Custom timeout
        });
        return response.data;
    }
    catch (error) {
        console.error('Custom headers request failed:', error);
        throw error;
    }
}
// =============================================================================
// EXAMPLE 7: Integration with Express Routes
// =============================================================================
/**
 * Express route handler example
 */
exports.deviceController = {
    async getDevices(req, res) {
        try {
            const devices = await getDevices();
            res.json({ success: true, data: devices });
        }
        catch (error) {
            console.error('Get devices endpoint failed:', error);
            res.status(500).json({ success: false, error: 'Failed to fetch devices' });
        }
    },
    async createDevice(req, res) {
        try {
            const deviceData = req.body;
            const result = await createDevice(deviceData);
            res.json({ success: true, data: result });
        }
        catch (error) {
            console.error('Create device endpoint failed:', error);
            res.status(500).json({ success: false, error: 'Failed to create device' });
        }
    },
    async healthCheck(req, res) {
        try {
            // Check ThingsBoard connectivity and authentication
            const isAuth = (0, index_1.isThingsBoardAuthenticated)();
            if (!isAuth) {
                await (0, index_1.authenticateThingsBoard)();
            }
            // Simple API call to verify connectivity
            await index_1.tbClient.get('/api/auth/user');
            res.json({
                success: true,
                message: 'ThingsBoard connection is healthy',
                authenticated: true
            });
        }
        catch (error) {
            console.error('Health check failed:', error);
            res.status(503).json({
                success: false,
                message: 'ThingsBoard connection is unhealthy',
                authenticated: false
            });
        }
    }
};
// =============================================================================
// EXAMPLE 8: Application Startup Integration
// =============================================================================
/**
 * Application startup sequence with ThingsBoard initialization
 */
async function startupSequence() {
    console.log('Starting application...');
    try {
        // Step 1: Initialize ThingsBoard connection
        await initializeThingsBoardService();
        console.log('✓ ThingsBoard service initialized');
        // Step 2: Verify connectivity with a simple API call
        await index_1.tbClient.get('/api/auth/user');
        console.log('✓ ThingsBoard connectivity verified');
        // Step 3: Your other startup tasks...
        console.log('✓ Application startup completed successfully');
    }
    catch (error) {
        console.error('❌ Application startup failed:', error);
        throw error;
    }
}
/**
 * Graceful shutdown sequence
 */
function shutdownSequence() {
    console.log('Shutting down application...');
    try {
        // Clean up ThingsBoard connections
        cleanupThingsBoardService();
        console.log('✓ ThingsBoard service cleaned up');
        // Your other cleanup tasks...
        console.log('✓ Application shutdown completed successfully');
    }
    catch (error) {
        console.error('❌ Error during shutdown:', error);
    }
}
//# sourceMappingURL=examples.js.map