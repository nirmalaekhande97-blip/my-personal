/**
 * ThingsBoard Authentication Interfaces
 *
 * This module contains all TypeScript interfaces related to ThingsBoard authentication,
 * following the principle of separating data contracts from implementation.
 */
/**
 * Login request payload for username/password authentication
 */
export interface LoginRequest {
    username: string;
    password: string;
}
/**
 * JWT authentication response from ThingsBoard
 */
export interface AuthResponse {
    token: string;
    refreshToken: string;
}
/**
 * Token refresh request payload
 */
export interface RefreshTokenRequest {
    refreshToken: string;
}
/**
 * In-memory token storage interface
 */
export interface TokenStorage {
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: number | null;
    issuedAt: number;
}
/**
 * Authentication method enumeration
 */
export declare enum AuthMethod {
    USERNAME_PASSWORD = "username_password",
    STATIC_TOKEN = "static_token"
}
/**
 * Authentication service interface following SOLID principles
 */
export interface IThingsBoardAuth {
    /**
     * Authenticate with ThingsBoard using configured method
     */
    authenticate(): Promise<string>;
    /**
     * Get current valid access token (refreshes if needed)
     */
    getAccessToken(): Promise<string>;
    /**
     * Check if current token is valid and not expiring soon
     */
    isTokenValid(): boolean;
    /**
     * Force refresh the access token
     */
    refreshAccessToken(): Promise<string>;
    /**
     * Clear stored tokens (for logout)
     */
    clearTokens(): void;
    /**
     * Get authentication headers for API requests
     */
    getAuthHeaders(): Promise<Record<string, string>>;
}
/**
 * ThingsBoard API error response interface
 */
export interface ThingsBoardError {
    status: number;
    message: string;
    errorCode?: string;
    timestamp?: number;
}
/**
 * Authentication configuration interface
 */
export interface AuthConfig {
    useStaticToken: boolean;
    staticToken?: string;
    username?: string;
    password?: string;
    baseURL: string;
    timeouts: {
        auth: number;
        request: number;
    };
    refreshThresholdMinutes: number;
}
//# sourceMappingURL=auth.interfaces.d.ts.map