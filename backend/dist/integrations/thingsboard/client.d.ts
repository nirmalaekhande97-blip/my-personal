import { AxiosInstance } from 'axios';
/**
 * ThingsBoard HTTP Client
 *
 * Production-ready singleton client for ThingsBoard API integration.
 *
 * Features:
 * - Singleton pattern for consistent authentication state across the application
 * - Automatic JWT token management with refresh
 * - Support for username/password and static token authentication
 * - Pre-configured Axios instance with interceptors
 * - Comprehensive error handling and retry logic
 * - TypeScript typing throughout
 *
 * Usage:
 * ```typescript
 * import { thingsBoardClient } from './integrations/thingsboard/client';
 *
 * // The client automatically handles authentication
 * const devices = await thingsBoardClient.get('/api/tenant/devices');
 * ```
 */
export declare class ThingsBoardClient {
    private static instance;
    private readonly authService;
    private readonly httpClient;
    /**
     * Private constructor for singleton pattern
     */
    private constructor();
    /**
     * Get singleton instance of ThingsBoard client
     *
     * @returns ThingsBoardClient - Singleton instance
     */
    static getInstance(): ThingsBoardClient;
    /**
     * Get the pre-configured Axios instance
     *
     * This instance includes:
     * - Automatic token attachment via request interceptors
     * - Automatic token refresh on 401/403 responses
     * - Comprehensive error handling
     * - Proper TypeScript typing
     *
     * @returns AxiosInstance - Configured Axios client
     */
    getAxiosInstance(): AxiosInstance;
    /**
     * Perform manual authentication
     * Useful for initialization or when you need to ensure authentication is complete
     *
     * @returns Promise<string> - Access token
     * @throws Error if authentication fails
     */
    login(): Promise<string>;
    /**
     * Get current valid access token
     * Automatically refreshes if needed
     *
     * @returns Promise<string> - Valid access token
     * @throws Error if unable to get token
     */
    getToken(): Promise<string>;
    /**
     * Get authentication headers for external use
     *
     * @returns Promise<Record<string, string>> - Headers with Authorization
     */
    getAuthHeaders(): Promise<Record<string, string>>;
    /**
     * Check if currently authenticated with valid token
     *
     * @returns boolean - True if authenticated and token is valid
     */
    isAuthenticated(): boolean;
    /**
     * Clear all authentication tokens (logout)
     *
     * Call this when user logs out or when switching tenants
     */
    logout(): void;
    /**
     * Get token information for debugging
     *
     * @returns Object with token status information
     */
    getTokenInfo(): {
        hasToken: boolean;
        isValid: boolean;
        expiresIn: number | null;
        authMethod: string;
    };
    /**
     * Force refresh of access token
     *
     * @returns Promise<string> - New access token
     * @throws Error if refresh fails
     */
    refreshToken(): Promise<string>;
    /**
     * Make GET request with automatic authentication
     *
     * @param url - API endpoint
     * @param config - Optional Axios config
     */
    get<T = any>(url: string, config?: any): Promise<T>;
    /**
     * Make POST request with automatic authentication
     *
     * @param url - API endpoint
     * @param data - Request payload
     * @param config - Optional Axios config
     */
    post<T = any>(url: string, data?: any, config?: any): Promise<T>;
    /**
     * Make PUT request with automatic authentication
     *
     * @param url - API endpoint
     * @param data - Request payload
     * @param config - Optional Axios config
     */
    put<T = any>(url: string, data?: any, config?: any): Promise<T>;
    /**
     * Make DELETE request with automatic authentication
     *
     * @param url - API endpoint
     * @param config - Optional Axios config
     */
    delete<T = any>(url: string, config?: any): Promise<T>;
    /**
     * Make PATCH request with automatic authentication
     *
     * @param url - API endpoint
     * @param data - Request payload
     * @param config - Optional Axios config
     */
    patch<T = any>(url: string, data?: any, config?: any): Promise<T>;
}
/**
 * Singleton instance of ThingsBoard client
 *
 * Use this for all ThingsBoard API calls throughout your application.
 * The client automatically handles authentication, token refresh, and error handling.
 *
 * @example
 * ```typescript
 * import { thingsBoardClient } from './integrations/thingsboard/client';
 *
 * // All these calls automatically handle authentication:
 * const devices = await thingsBoardClient.get('/api/tenant/devices');
 * const asset = await thingsBoardClient.post('/api/asset', assetData);
 * await thingsBoardClient.delete(`/api/device/${deviceId}`);
 * ```
 */
export declare const thingsBoardClient: ThingsBoardClient;
/**
 * Pre-configured Axios instance with ThingsBoard authentication
 *
 * Use this if you need direct access to the Axios instance for advanced usage.
 *
 * @example
 * ```typescript
 * import { tbClient } from './integrations/thingsboard/client';
 *
 * const response = await tbClient.get('/api/tenant/devices');
 * ```
 */
export declare const tbClient: AxiosInstance;
export { ThingsBoardAuthService } from './auth.service';
//# sourceMappingURL=client.d.ts.map