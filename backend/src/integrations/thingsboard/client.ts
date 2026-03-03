// integrations/thingsboard/client.ts

import { AxiosInstance } from 'axios';
import { ThingsBoardAuthService } from './auth.service';

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
export class ThingsBoardClient {
  private static instance: ThingsBoardClient;
  private readonly authService: ThingsBoardAuthService;
  private readonly httpClient: AxiosInstance;

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    this.authService = ThingsBoardAuthService.getInstance();
    this.httpClient = this.authService.getAxiosInstance();
  }

  /**
   * Get singleton instance of ThingsBoard client
   * 
   * @returns ThingsBoardClient - Singleton instance
   */
  public static getInstance(): ThingsBoardClient {
    if (!ThingsBoardClient.instance) {
      ThingsBoardClient.instance = new ThingsBoardClient();
    }
    return ThingsBoardClient.instance;
  }

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
  public getAxiosInstance(): AxiosInstance {
    return this.httpClient;
  }

  /**
   * Perform manual authentication
   * Useful for initialization or when you need to ensure authentication is complete
   * 
   * @returns Promise<string> - Access token
   * @throws Error if authentication fails
   */
  public async login(): Promise<string> {
    return await this.authService.login();
  }

  /**
   * Get current valid access token
   * Automatically refreshes if needed
   * 
   * @returns Promise<string> - Valid access token
   * @throws Error if unable to get token
   */
  public async getToken(): Promise<string> {
    return await this.authService.getToken();
  }

  /**
   * Get authentication headers for external use
   * 
   * @returns Promise<Record<string, string>> - Headers with Authorization
   */
  public async getAuthHeaders(): Promise<Record<string, string>> {
    return await this.authService.getAuthHeaders();
  }

  /**
   * Check if currently authenticated with valid token
   * 
   * @returns boolean - True if authenticated and token is valid
   */
  public isAuthenticated(): boolean {
    return this.authService.isTokenValid();
  }

  /**
   * Clear all authentication tokens (logout)
   * 
   * Call this when user logs out or when switching tenants
   */
  public logout(): void {
    this.authService.clearTokens();
  }

  /**
   * Get token information for debugging
   * 
   * @returns Object with token status information
   */
  public getTokenInfo(): {
    hasToken: boolean;
    isValid: boolean;
    expiresIn: number | null;
    authMethod: string;
  } {
    return this.authService.getTokenInfo();
  }

  /**
   * Force refresh of access token
   * 
   * @returns Promise<string> - New access token
   * @throws Error if refresh fails
   */
  public async refreshToken(): Promise<string> {
    return await this.authService.refreshAccessToken();
  }

  // ========== Convenience Methods for Common API Patterns ==========

  /**
   * Make GET request with automatic authentication
   * 
   * @param url - API endpoint
   * @param config - Optional Axios config
   */
  public async get<T = any>(url: string, config?: any): Promise<T> {
    const response = await this.httpClient.get(url, config);
    return response.data;
  }

  /**
   * Make POST request with automatic authentication
   * 
   * @param url - API endpoint
   * @param data - Request payload
   * @param config - Optional Axios config
   */
  public async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.httpClient.post(url, data, config);
    return response.data;
  }

  /**
   * Make PUT request with automatic authentication
   * 
   * @param url - API endpoint
   * @param data - Request payload
   * @param config - Optional Axios config
   */
  public async put<T = any>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.httpClient.put(url, data, config);
    return response.data;
  }

  /**
   * Make DELETE request with automatic authentication
   * 
   * @param url - API endpoint
   * @param config - Optional Axios config
   */
  public async delete<T = any>(url: string, config?: any): Promise<T> {
    const response = await this.httpClient.delete(url, config);
    return response.data;
  }

  /**
   * Make PATCH request with automatic authentication
   * 
   * @param url - API endpoint
   * @param data - Request payload
   * @param config - Optional Axios config
   */
  public async patch<T = any>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.httpClient.patch(url, data, config);
    return response.data;
  }
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
export const thingsBoardClient = ThingsBoardClient.getInstance();

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
export const tbClient = thingsBoardClient.getAxiosInstance();

// Export the auth service for advanced usage
export { ThingsBoardAuthService } from './auth.service';