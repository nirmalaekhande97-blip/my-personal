/**
 * Simple device retrieval - authentication is handled automatically
 */
export declare function getDevices(): Promise<any>;
/**
 * Create a new device - POST request example
 */
export declare function createDevice(deviceData: any): Promise<any>;
/**
 * Service initialization with authentication check
 */
export declare function initializeThingsBoardService(): Promise<void>;
/**
 * Service cleanup on application shutdown
 */
export declare function cleanupThingsBoardService(): void;
/**
 * Manual authentication with error handling
 */
export declare function manualAuthentication(): Promise<{
    token: any;
    isAuthenticated: boolean;
}>;
/**
 * Force logout and re-authentication
 */
export declare function forceReAuthentication(): Promise<boolean>;
/**
 * Robust API call with comprehensive error handling
 */
export declare function robustApiCall(endpoint: string, data?: any): Promise<{
    success: boolean;
    data: any;
    error?: undefined;
} | {
    success: boolean;
    error: string;
    data?: undefined;
}>;
/**
 * Batch device operations with authentication management
 */
export declare function batchDeviceOperations(deviceIds: string[]): Promise<({
    deviceId: string;
    success: boolean;
    data: any;
    error?: undefined;
} | {
    deviceId: string;
    success: boolean;
    error: unknown;
    data?: undefined;
})[]>;
/**
 * API call with custom headers
 */
export declare function customHeadersExample(): Promise<any>;
/**
 * Express route handler example
 */
export declare const deviceController: {
    getDevices(req: any, res: any): Promise<void>;
    createDevice(req: any, res: any): Promise<void>;
    healthCheck(req: any, res: any): Promise<void>;
};
/**
 * Application startup sequence with ThingsBoard initialization
 */
export declare function startupSequence(): Promise<void>;
/**
 * Graceful shutdown sequence
 */
export declare function shutdownSequence(): void;
//# sourceMappingURL=examples.d.ts.map