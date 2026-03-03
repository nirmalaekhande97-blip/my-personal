// integrations/thingsboard/usage.examples.ts

/**
 * ThingsBoard Integration Usage Examples
 * 
 * This file demonstrates production-ready patterns for using the ThingsBoard authentication module.
 * These examples show real-world usage scenarios with proper error handling and TypeScript typing.
 */

import { 
  thingsBoardClient,
  tbClient,
  authenticate,
  isAuthenticated,
  getTokenInfo,
  initialize,
  healthCheck,
  logout,
  getAccessToken,
  getAuthHeaders,
  type Attribute,
  type TelemetryAttributesPayload
} from './index';
import { Request, Response } from 'express';

// =============================================================================
// EXAMPLE 1: Basic API Usage with Automatic Authentication
// =============================================================================

/**
 * Get all tenant devices - Authentication is handled automatically
 */
export async function getAllDevices(): Promise<any[]> {
  try {
    // The client automatically handles authentication, token refresh, etc.
    const devices = await thingsBoardClient.get('/api/tenant/devices');
    return devices;
  } catch (error) {
    console.error('Failed to fetch devices:', error);
    throw error;
  }
}

/**
 * Get all tenant assets - Prepared for asset-level telemetry/alarms
 */
export async function getAllAssets(): Promise<any[]> {
  try {
    const assets = await thingsBoardClient.get('/api/tenant/assets');
    console.log(`Retrieved ${assets.length} assets`);
    return assets;
  } catch (error) {
    console.error('Failed to fetch assets:', error);
    throw error;
  }
}

/**
 * Create a new device with proper error handling
 */
export async function createDevice(deviceData: {
  name: string;
  type: string;
  label?: string;
}): Promise<any> {
  try {
    const device = await thingsBoardClient.post('/api/device', deviceData);
    console.log(`Device created: ${device.name} (ID: ${device.id.id})`);
    return device;
  } catch (error) {
    console.error('Failed to create device:', error);
    throw error;
  }
}

/**
 * Create a new asset for telemetry collection
 */
export async function createAsset(assetData: {
  name: string;
  type: string;
  label?: string;
}): Promise<any> {
  try {
    const asset = await thingsBoardClient.post('/api/asset', assetData);
    console.log(`Asset created: ${asset.name} (ID: ${asset.id.id})`);
    return asset;
  } catch (error) {
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
export async function advancedDeviceQuery(limit: number = 10): Promise<any> {
  try {
    // Using tbClient directly gives you access to all Axios features
    const response = await tbClient.get('/api/tenant/devices', {
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
  } catch (error) {
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
export async function initializeApp(): Promise<void> {
  try {
    console.log('🚀 Starting application initialization...');
    
    // Initialize ThingsBoard connection
    await initialize();
    
    // Verify token info
    const tokenInfo = getTokenInfo();
    console.log('🔐 Authentication details:', {
      authMethod: tokenInfo.authMethod,
      tokenValid: tokenInfo.isValid,
      expiresInMinutes: tokenInfo.expiresIn ? Math.round(tokenInfo.expiresIn / 60000) : null
    });
    
    console.log('✅ Application initialization complete');
    
  } catch (error) {
    console.error('❌ Application initialization failed:', error);
    process.exit(1);
  }
}

/**
 * Graceful application shutdown
 */
export function shutdownApp(): void {
  try {
    console.log('🔄 Shutting down application...');
    
    // Clear ThingsBoard tokens
    logout();
    
    console.log('✅ Application shutdown complete');
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
  }
}

/**
 * Check authentication status with detailed logging
 */
export async function checkAuthStatus(): Promise<boolean> {
  try {
    const isAuth = isAuthenticated();
    console.log(`🔐 Authentication status: ${isAuth ? 'AUTHENTICATED' : 'NOT AUTHENTICATED'}`);
    
    if (isAuth) {
      const tokenInfo = getTokenInfo();
      const expiresInMinutes = tokenInfo.expiresIn ? Math.round(tokenInfo.expiresIn / 60000) : null;
      console.log(`⏰ Token expires in: ${expiresInMinutes} minutes`);
    }
    
    return isAuth;
  } catch (error) {
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
export function ensureThingsBoardAuth() {
  return async (req: Request, res: Response, next: any) => {
    try {
      if (!isAuthenticated()) {
        console.log('🔐 Triggering ThingsBoard authentication...');
        await authenticate();
      }
      next();
    } catch (error) {
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
export const thingsBoardRoutes = {
  /**
   * GET /api/devices - Get all devices
   */
  getDevices: async (req: Request, res: Response) => {
    try {
      const devices = await getAllDevices();
      res.json({
        success: true,
        data: devices,
        count: devices.length
      });
    } catch (error) {
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
  getAssets: async (req: Request, res: Response) => {
    try {
      const assets = await getAllAssets();
      res.json({
        success: true,
        data: assets,
        count: assets.length
      });
    } catch (error) {
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
  createDevice: async (req: Request, res: Response): Promise<void> => {
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
    } catch (error) {
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
  healthCheck: async (req: Request, res: Response) => {
    try {
      const isHealthy = await healthCheck();
      const tokenInfo = getTokenInfo();
      
      if (isHealthy) {
        res.json({
          status: 'healthy',
          service: 'ThingsBoard',
          authenticated: tokenInfo.isValid,
          authMethod: tokenInfo.authMethod,
          tokenExpiresIn: tokenInfo.expiresIn
        });
      } else {
        res.status(503).json({
          status: 'unhealthy',
          service: 'ThingsBoard',
          authenticated: false,
          error: 'Health check failed'
        });
      }
    } catch (error) {
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
export async function getAssetAttributes(
  assetId: string,
  scope: 'CLIENT_SCOPE' | 'SERVER_SCOPE' | 'SHARED_SCOPE' = 'SERVER_SCOPE'
): Promise<Record<string, any>> {
  try {
    const attributes = await thingsBoardClient.get(
      `/api/plugins/telemetry/ASSET/${assetId}/keys/attributes/${scope}`
    );
    return attributes;
  } catch (error) {
    console.error(`Failed to get asset attributes for ${assetId}:`, error);
    throw error;
  }
}

/**
 * Set asset attributes - prepared for asset management
 */
export async function setAssetAttributes(
  assetId: string,
  attributes: Record<string, any>,
  scope: 'CLIENT_SCOPE' | 'SERVER_SCOPE' | 'SHARED_SCOPE' = 'SERVER_SCOPE'
): Promise<void> {
  try {
    await thingsBoardClient.post(
      `/api/plugins/telemetry/ASSET/${assetId}/attributes/${scope}`,
      attributes
    );
    console.log(`Asset attributes updated for ${assetId}`);
  } catch (error) {
    console.error(`Failed to set asset attributes for ${assetId}:`, error);
    throw error;
  }
}

/**
 * Get asset telemetry keys - ready for telemetry data collection
 */
export async function getAssetTelemetryKeys(assetId: string): Promise<string[]> {
  try {
    const keys = await thingsBoardClient.get(
      `/api/plugins/telemetry/ASSET/${assetId}/keys/timeseries`
    );
    return keys;
  } catch (error) {
    console.error(`Failed to get telemetry keys for asset ${assetId}:`, error);
    throw error;
  }
}

/**
 * Get asset alarms - ready for alarm management
 */
export async function getAssetAlarms(
  assetId: string,
  status?: 'ACTIVE' | 'CLEARED' | 'ACK' | 'UNACK'
): Promise<any[]> {
  try {
    const params: any = {};
    if (status) {
      params.status = status;
    }
    
    const alarms = await thingsBoardClient.get(
      `/api/alarm/ASSET/${assetId}`,
      { params }
    );
    return alarms.data || [];
  } catch (error) {
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
export async function robustApiCall<T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error as Error;
      
      console.warn(`API call attempt ${attempt + 1} failed:`, error);
      
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
}

/**
 * Example of using robust API calls
 */
export async function reliableDeviceFetch(): Promise<any[]> {
  return await robustApiCall(
    () => getAllDevices(),
    3,
    2000
  );
}

// =============================================================================
// EXAMPLE 7: Batch Operations
// =============================================================================

/**
 * Process multiple assets in parallel
 */
export async function batchAssetOperations(assetIds: string[]): Promise<any[]> {
  try {
    const results = await Promise.allSettled(
      assetIds.map(async (assetId) => {
        const asset = await thingsBoardClient.get(`/api/asset/${assetId}`);
        const telemetryKeys = await getAssetTelemetryKeys(assetId);
        const alarms = await getAssetAlarms(assetId, 'ACTIVE');
        
        return {
          assetId,
          asset,
          telemetryKeys,
          activeAlarms: alarms.length
        };
      })
    );
    
    // Separate successful and failed results
    const successful = results
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value);
    
    const failed = results
      .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
      .map(result => result.reason);
    
    if (failed.length > 0) {
      console.warn(`${failed.length} batch operations failed:`, failed);
    }
    
    console.log(`Batch operations completed: ${successful.length} successful, ${failed.length} failed`);
    
    return successful;
  } catch (error) {
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
export async function useWithExternalClient(): Promise<void> {
  try {
    // Get auth headers for use with external HTTP clients
    const headers = await getAuthHeaders();
    
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
    
  } catch (error) {
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
export function debugTokenInfo(): void {
  const tokenInfo = getTokenInfo();
  
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
export async function debugForceTokenRefresh(): Promise<string> {
  try {
    console.log('🔄 Forcing token refresh...');
    const newToken = await thingsBoardClient.refreshToken();
    console.log('✅ Token refresh successful');
    debugTokenInfo();
    return newToken;
  } catch (error) {
    console.error('❌ Token refresh failed:', error);
    throw error;
  }
}