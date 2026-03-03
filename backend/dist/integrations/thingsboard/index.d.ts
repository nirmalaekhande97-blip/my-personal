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
export { thingsBoardClient, // Singleton client with convenience methods
tbClient, // Pre-configured Axios instance
ThingsBoardClient, // Client class (for advanced usage)
ThingsBoardAuthService } from './client';
export { THINGSBOARD_CONFIG, isUsernamePasswordAuth, isAccessTokenAuth, getAuthMethod, getConfigSummary } from '../../config/thingsboard.config';
export type { ThingsBoardConfig } from '../../config/thingsboard.config';
export { AuthMethod, type IThingsBoardAuth, type LoginRequest, type AuthResponse, type RefreshTokenRequest, type TokenStorage, type ThingsBoardError, type AuthConfig, } from './auth.interfaces';
export { getAttributeList, postTelemetryAttributes, getTimeseriesKeys, type Attribute, type AttributeListResponse, type TelemetryAttributesPayload, } from './entity_management';
export { TB_ENDPOINTS } from './endpoints';
export type { EntityType, AttributeScope } from './endpoints';
/**
 * Check if ThingsBoard client is currently authenticated
 *
 * @returns boolean - True if authenticated with valid token
 */
export declare const isAuthenticated: () => boolean;
/**
 * Perform manual authentication
 * Useful for application startup or when ensuring authentication
 *
 * @returns Promise<string> - Access token
 * @throws Error if authentication fails
 */
export declare const authenticate: () => Promise<string>;
/**
 * Get current valid access token
 * Automatically refreshes if needed
 *
 * @returns Promise<string> - Valid access token
 */
export declare const getAccessToken: () => Promise<string>;
/**
 * Get authentication headers for external HTTP clients
 *
 * @returns Promise<Record<string, string>> - Headers with Authorization
 */
export declare const getAuthHeaders: () => Promise<Record<string, string>>;
/**
 * Clear all authentication tokens (logout)
 */
export declare const logout: () => void;
/**
 * Get token information for debugging and monitoring
 *
 * @returns Object with token status and metadata
 */
export declare const getTokenInfo: () => {
    hasToken: boolean;
    isValid: boolean;
    expiresIn: number | null;
    authMethod: string;
};
/**
 * Initialize ThingsBoard connection with authentication
 * Call this during application startup
 *
 * @returns Promise<void>
 * @throws Error if initialization fails
 */
export declare const initialize: () => Promise<void>;
/**
 * Health check for ThingsBoard connection
 * Useful for monitoring and health endpoints
 *
 * @returns Promise<boolean> - True if connection is healthy
 */
export declare const healthCheck: () => Promise<boolean>;
//# sourceMappingURL=index.d.ts.map