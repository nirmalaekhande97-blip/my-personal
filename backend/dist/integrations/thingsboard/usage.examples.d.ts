import { Request, Response } from 'express';
/**
 * Get all tenant devices - Authentication is handled automatically
 */
export declare function getAllDevices(): Promise<any[]>;
/**
 * Get all tenant assets - Prepared for asset-level telemetry/alarms
 */
export declare function getAllAssets(): Promise<any[]>;
/**
 * Create a new device with proper error handling
 */
export declare function createDevice(deviceData: {
    name: string;
    type: string;
    label?: string;
}): Promise<any>;
/**
 * Create a new asset for telemetry collection
 */
export declare function createAsset(assetData: {
    name: string;
    type: string;
    label?: string;
}): Promise<any>;
/**
 * Example using the raw Axios instance for advanced usage
 */
export declare function advancedDeviceQuery(limit?: number): Promise<any>;
/**
 * Application initialization with ThingsBoard connection
 */
export declare function initializeApp(): Promise<void>;
/**
 * Graceful application shutdown
 */
export declare function shutdownApp(): void;
/**
 * Check authentication status with detailed logging
 */
export declare function checkAuthStatus(): Promise<boolean>;
/**
 * Express middleware to ensure ThingsBoard authentication
 */
export declare function ensureThingsBoardAuth(): (req: Request, res: Response, next: any) => Promise<void>;
/**
 * Express route handlers with ThingsBoard integration
 */
export declare const thingsBoardRoutes: {
    /**
     * GET /api/devices - Get all devices
     */
    getDevices: (req: Request, res: Response) => Promise<void>;
    /**
     * GET /api/assets - Get all assets
     */
    getAssets: (req: Request, res: Response) => Promise<void>;
    /**
     * POST /api/devices - Create device
     */
    createDevice: (req: Request, res: Response) => Promise<void>;
    /**
     * GET /health/thingsboard - Health check endpoint
     */
    healthCheck: (req: Request, res: Response) => Promise<void>;
};
/**
 * Get asset attributes - prepared for telemetry operations
 */
export declare function getAssetAttributes(assetId: string, scope?: 'CLIENT_SCOPE' | 'SERVER_SCOPE' | 'SHARED_SCOPE'): Promise<Record<string, any>>;
/**
 * Set asset attributes - prepared for asset management
 */
export declare function setAssetAttributes(assetId: string, attributes: Record<string, any>, scope?: 'CLIENT_SCOPE' | 'SERVER_SCOPE' | 'SHARED_SCOPE'): Promise<void>;
/**
 * Get asset telemetry keys - ready for telemetry data collection
 */
export declare function getAssetTelemetryKeys(assetId: string): Promise<string[]>;
/**
 * Get asset alarms - ready for alarm management
 */
export declare function getAssetAlarms(assetId: string, status?: 'ACTIVE' | 'CLEARED' | 'ACK' | 'UNACK'): Promise<any[]>;
/**
 * Robust API call with custom retry logic
 */
export declare function robustApiCall<T>(apiCall: () => Promise<T>, maxRetries?: number, baseDelay?: number): Promise<T>;
/**
 * Example of using robust API calls
 */
export declare function reliableDeviceFetch(): Promise<any[]>;
/**
 * Process multiple assets in parallel
 */
export declare function batchAssetOperations(assetIds: string[]): Promise<any[]>;
/**
 * Use ThingsBoard auth headers with external HTTP client
 */
export declare function useWithExternalClient(): Promise<void>;
/**
 * Debug token information
 */
export declare function debugTokenInfo(): void;
/**
 * Force token refresh for testing
 */
export declare function debugForceTokenRefresh(): Promise<string>;
//# sourceMappingURL=usage.examples.d.ts.map