// integrations/thingsboard/index.ts

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
export { 
  thingsBoardClient,     // Singleton client with convenience methods
  tbClient,              // Pre-configured Axios instance
  ThingsBoardClient,     // Client class (for advanced usage)
  ThingsBoardAuthService // Authentication service class
} from './client';

// Configuration exports
export { 
  THINGSBOARD_CONFIG,
  isUsernamePasswordAuth,
  isAccessTokenAuth,
  getAuthMethod,
  getConfigSummary
} from '../../config/thingsboard.config';

export type { ThingsBoardConfig } from '../../config/thingsboard.config';

// Interface and type exports
export {
  AuthMethod,
  type IThingsBoardAuth,
  type LoginRequest,
  type AuthResponse,
  type RefreshTokenRequest,
  type TokenStorage,
  type ThingsBoardError,
  type AuthConfig,
} from './auth.interfaces';

// Entity management exports (updated to use new client)
export {
  getAttributeList,
  postTelemetryAttributes,
  getTimeseriesKeys,
  type Attribute,
  type AttributeListResponse,
  type TelemetryAttributesPayload,
} from './entity_management';

// Legacy endpoints - keeping for backward compatibility
export { TB_ENDPOINTS } from './endpoints';
export type { EntityType, AttributeScope } from './endpoints';

// ========== Convenience Functions ==========

// Import the client instance for convenience functions
import { thingsBoardClient } from './client';

/**
 * Check if ThingsBoard client is currently authenticated
 * 
 * @returns boolean - True if authenticated with valid token
 */
export const isAuthenticated = (): boolean => {
  return thingsBoardClient.isAuthenticated();
};

/**
 * Perform manual authentication
 * Useful for application startup or when ensuring authentication
 * 
 * @returns Promise<string> - Access token
 * @throws Error if authentication fails
 */
export const authenticate = async (): Promise<string> => {
  return await thingsBoardClient.login();
};

/**
 * Get current valid access token
 * Automatically refreshes if needed
 * 
 * @returns Promise<string> - Valid access token
 */
export const getAccessToken = async (): Promise<string> => {
  return await thingsBoardClient.getToken();
};

/**
 * Get authentication headers for external HTTP clients
 * 
 * @returns Promise<Record<string, string>> - Headers with Authorization
 */
export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  return await thingsBoardClient.getAuthHeaders();
};

/**
 * Clear all authentication tokens (logout)
 */
export const logout = (): void => {
  thingsBoardClient.logout();
};

/**
 * Get token information for debugging and monitoring
 * 
 * @returns Object with token status and metadata
 */
export const getTokenInfo = (): {
  hasToken: boolean;
  isValid: boolean;
  expiresIn: number | null;
  authMethod: string;
} => {
  return thingsBoardClient.getTokenInfo();
};

/**
 * Initialize ThingsBoard connection with authentication
 * Call this during application startup
 * 
 * @returns Promise<void>
 * @throws Error if initialization fails
 */
export const initialize = async (): Promise<void> => {
  try {
    console.log('🔌 Initializing ThingsBoard connection...');
    
    // Trigger authentication
    await thingsBoardClient.login();
    
    // Verify connection with a simple API call
    await thingsBoardClient.get('/api/auth/user');
    
    console.log('✅ ThingsBoard connection initialized successfully');
    
    // Log authentication method for debugging
    const config = await import('../../config/thingsboard.config');
    console.log(`🔐 Using ${config.getAuthMethod()} authentication`);
    
  } catch (error) {
    console.error('❌ ThingsBoard initialization failed:', error);
    throw new Error(`ThingsBoard initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Health check for ThingsBoard connection
 * Useful for monitoring and health endpoints
 * 
 * @returns Promise<boolean> - True if connection is healthy
 */
export const healthCheck = async (): Promise<boolean> => {
  try {
    // Check if authenticated
    if (!thingsBoardClient.isAuthenticated()) {
      await thingsBoardClient.login();
    }
    
    // Test API call
    await thingsBoardClient.get('/api/auth/user');
    
    return true;
  } catch (error) {
    console.error('ThingsBoard health check failed:', error);
    return false;
  }
};