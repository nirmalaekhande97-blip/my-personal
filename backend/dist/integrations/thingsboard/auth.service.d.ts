import { AxiosInstance } from 'axios';
import { type IThingsBoardAuth } from './auth.interfaces';
/**
 * ThingsBoard Authentication Service
 *
 * Provides production-ready authentication with:
 * - JWT token management with automatic refresh
 * - Support for username/password and static token authentication
 * - Singleton pattern for consistent state
 * - Comprehensive error handling
 * - TypeScript typing throughout
 */
export declare class ThingsBoardAuthService implements IThingsBoardAuth {
    private static instance;
    private tokenStorage;
    private authInProgress;
    private refreshInProgress;
    private readonly authRetryDelays;
    private constructor();
    /**
     * Get singleton instance of the authentication service
     */
    static getInstance(): ThingsBoardAuthService;
    /**
     * Perform login authentication
     * Automatically chooses between username/password or static token based on configuration
     *
     * @returns Promise<string> - The access token
     * @throws Error if authentication fails
     */
    login(): Promise<string>;
    /**
     * Get current valid access token
     * Automatically refreshes token if expired or expiring soon
     *
     * @returns Promise<string> - Valid access token
     * @throws Error if unable to obtain valid token
     */
    getToken(): Promise<string>;
    /**
     * Get authentication headers for API requests
     *
     * @returns Promise<Record<string, string>> - Headers object with authorization
     */
    getAuthHeaders(): Promise<Record<string, string>>;
    /**
     * Get pre-configured Axios instance with authentication interceptors
     * This instance automatically handles token attachment and refresh
     *
     * @returns AxiosInstance - Configured Axios instance
     */
    getAxiosInstance(): AxiosInstance;
    /**
     * Check if current token is valid and not expiring soon
     */
    isTokenValid(): boolean;
    /**
     * Force refresh of access token using refresh token
     *
     * @returns Promise<string> - New access token
     * @throws Error if refresh fails
     */
    refreshAccessToken(): Promise<string>;
    /**
     * Clear all stored tokens (for logout)
     */
    clearTokens(): void;
    /**
     * Authenticate with ThingsBoard using configured method (alias for login)
     */
    authenticate(): Promise<string>;
    /**
     * Get current valid access token (alias for getToken)
     */
    getAccessToken(): Promise<string>;
    /**
     * Get current token storage summary (for debugging)
     */
    getTokenInfo(): {
        hasToken: boolean;
        isValid: boolean;
        expiresIn: number | null;
        authMethod: string;
    };
    /**
     * Perform JWT login using username/password
     */
    private performJwtLogin;
    /**
     * Perform static token authentication
     */
    private performTokenLogin;
    /**
     * Store JWT tokens with proper expiration extraction
     */
    private storeJwtTokens;
    /**
     * Extract expiration timestamp from JWT token
     */
    private extractTokenExpiration;
    /**
     * Initialize empty token storage
     */
    private initializeTokenStorage;
    /**
     * Handle authentication errors with proper typing and context
     */
    private handleAuthError;
    /**
     * Wait for ongoing authentication to complete
     */
    private waitForAuth;
    /**
     * Wait for ongoing token refresh to complete
     */
    private waitForRefresh;
    /**
     * Sleep utility for delays
     */
    private sleep;
}
//# sourceMappingURL=auth.service.d.ts.map