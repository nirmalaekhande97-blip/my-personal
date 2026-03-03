"use strict";
// integrations/thingsboard/auth.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThingsBoardAuthService = void 0;
const axios_1 = __importDefault(require("axios"));
const thingsboard_config_1 = require("../../config/thingsboard.config");
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
class ThingsBoardAuthService {
    constructor() {
        this.authInProgress = false;
        this.refreshInProgress = false;
        this.authRetryDelays = [1000, 2000, 5000]; // Exponential backoff
        this.tokenStorage = this.initializeTokenStorage();
    }
    /**
     * Get singleton instance of the authentication service
     */
    static getInstance() {
        if (!ThingsBoardAuthService.instance) {
            ThingsBoardAuthService.instance = new ThingsBoardAuthService();
        }
        return ThingsBoardAuthService.instance;
    }
    /**
     * Perform login authentication
     * Automatically chooses between username/password or static token based on configuration
     *
     * @returns Promise<string> - The access token
     * @throws Error if authentication fails
     */
    async login() {
        // Prevent concurrent authentication attempts
        if (this.authInProgress) {
            await this.waitForAuth();
            if (this.isTokenValid()) {
                return this.tokenStorage.accessToken;
            }
        }
        this.authInProgress = true;
        try {
            let token;
            if ((0, thingsboard_config_1.isUsernamePasswordAuth)()) {
                token = await this.performJwtLogin();
            }
            else if ((0, thingsboard_config_1.isAccessTokenAuth)()) {
                token = await this.performTokenLogin();
            }
            else {
                throw new Error('No valid authentication method configured');
            }
            return token;
        }
        catch (error) {
            this.clearTokens();
            throw this.handleAuthError('Login failed', error);
        }
        finally {
            this.authInProgress = false;
        }
    }
    /**
     * Get current valid access token
     * Automatically refreshes token if expired or expiring soon
     *
     * @returns Promise<string> - Valid access token
     * @throws Error if unable to obtain valid token
     */
    async getToken() {
        // Return valid token if available
        if (this.isTokenValid()) {
            return this.tokenStorage.accessToken;
        }
        // Try to refresh token if refresh token is available
        if (this.tokenStorage.refreshToken && !this.refreshInProgress) {
            try {
                return await this.refreshAccessToken();
            }
            catch (error) {
                console.warn('Token refresh failed, attempting new login:', error);
            }
        }
        // Fallback to new login
        return await this.login();
    }
    /**
     * Get authentication headers for API requests
     *
     * @returns Promise<Record<string, string>> - Headers object with authorization
     */
    async getAuthHeaders() {
        const token = await this.getToken();
        return {
            'X-Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    }
    /**
     * Get pre-configured Axios instance with authentication interceptors
     * This instance automatically handles token attachment and refresh
     *
     * @returns AxiosInstance - Configured Axios instance
     */
    getAxiosInstance() {
        const axiosInstance = axios_1.default.create({
            baseURL: thingsboard_config_1.THINGSBOARD_CONFIG.baseUrl,
            timeout: thingsboard_config_1.THINGSBOARD_CONFIG.timeouts.request,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Request interceptor - Automatically attach authentication headers
        axiosInstance.interceptors.request.use(async (config) => {
            try {
                const authHeaders = await this.getAuthHeaders();
                Object.assign(config.headers, authHeaders);
                return config;
            }
            catch (error) {
                console.error('Failed to attach authentication headers:', error);
                return Promise.reject(error);
            }
        }, (error) => {
            return Promise.reject(error);
        });
        // Response interceptor - Automatically handle token refresh on 401/403
        axiosInstance.interceptors.response.use((response) => response, async (error) => {
            const originalRequest = error.config;
            // Handle authentication errors with automatic retry
            if ((error.response?.status === 401 || error.response?.status === 403) &&
                !originalRequest._isRetry) {
                originalRequest._isRetry = true;
                try {
                    // Clear current tokens and re-authenticate
                    this.clearTokens();
                    await this.login();
                    // Update headers for retry
                    const authHeaders = await this.getAuthHeaders();
                    Object.assign(originalRequest.headers, authHeaders);
                    // Retry the original request
                    return axiosInstance(originalRequest);
                }
                catch (authError) {
                    console.error('Authentication retry failed:', authError);
                    return Promise.reject(authError);
                }
            }
            return Promise.reject(error);
        });
        return axiosInstance;
    }
    /**
     * Check if current token is valid and not expiring soon
     */
    isTokenValid() {
        const { accessToken, expiresAt } = this.tokenStorage;
        if (!accessToken || !expiresAt) {
            return false;
        }
        const now = Date.now();
        const thresholdMs = thingsboard_config_1.THINGSBOARD_CONFIG.token.refreshThresholdMinutes * 60 * 1000;
        return expiresAt > (now + thresholdMs);
    }
    /**
     * Force refresh of access token using refresh token
     *
     * @returns Promise<string> - New access token
     * @throws Error if refresh fails
     */
    async refreshAccessToken() {
        if (this.refreshInProgress) {
            await this.waitForRefresh();
            if (this.isTokenValid()) {
                return this.tokenStorage.accessToken;
            }
        }
        if (!this.tokenStorage.refreshToken) {
            throw new Error('No refresh token available');
        }
        this.refreshInProgress = true;
        try {
            const response = await axios_1.default.post(`${thingsboard_config_1.THINGSBOARD_CONFIG.baseUrl}/api/auth/token`, { refreshToken: this.tokenStorage.refreshToken }, {
                timeout: thingsboard_config_1.THINGSBOARD_CONFIG.timeouts.auth,
                headers: { 'Content-Type': 'application/json' }
            });
            this.storeJwtTokens(response.data);
            return response.data.token;
        }
        catch (error) {
            this.clearTokens();
            throw this.handleAuthError('Token refresh failed', error);
        }
        finally {
            this.refreshInProgress = false;
        }
    }
    /**
     * Clear all stored tokens (for logout)
     */
    clearTokens() {
        this.tokenStorage = this.initializeTokenStorage();
    }
    /**
     * Authenticate with ThingsBoard using configured method (alias for login)
     */
    async authenticate() {
        return await this.login();
    }
    /**
     * Get current valid access token (alias for getToken)
     */
    async getAccessToken() {
        return await this.getToken();
    }
    /**
     * Get current token storage summary (for debugging)
     */
    getTokenInfo() {
        const expiresIn = this.tokenStorage.expiresAt
            ? Math.max(0, this.tokenStorage.expiresAt - Date.now())
            : null;
        return {
            hasToken: !!this.tokenStorage.accessToken,
            isValid: this.isTokenValid(),
            expiresIn,
            authMethod: (0, thingsboard_config_1.isUsernamePasswordAuth)() ? 'username-password' : 'access-token',
        };
    }
    // ========== Private Implementation Methods ==========
    /**
     * Perform JWT login using username/password
     */
    async performJwtLogin() {
        const loginData = {
            username: thingsboard_config_1.THINGSBOARD_CONFIG.auth.username,
            password: thingsboard_config_1.THINGSBOARD_CONFIG.auth.password,
        };
        let lastError = null;
        for (let attempt = 0; attempt < thingsboard_config_1.THINGSBOARD_CONFIG.token.maxRetries; attempt++) {
            try {
                const response = await axios_1.default.post(`${thingsboard_config_1.THINGSBOARD_CONFIG.baseUrl}/api/auth/login`, loginData, {
                    timeout: thingsboard_config_1.THINGSBOARD_CONFIG.timeouts.auth,
                    headers: { 'Content-Type': 'application/json' }
                });
                this.storeJwtTokens(response.data);
                return response.data.token;
            }
            catch (error) {
                lastError = error;
                if (attempt < thingsboard_config_1.THINGSBOARD_CONFIG.token.maxRetries - 1) {
                    const delay = this.authRetryDelays[attempt] || 5000;
                    console.warn(`Login attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
                    await this.sleep(delay);
                }
            }
        }
        throw lastError || new Error('Login failed after retries');
    }
    /**
     * Perform static token authentication
     */
    async performTokenLogin() {
        const staticToken = thingsboard_config_1.THINGSBOARD_CONFIG.auth.accessToken;
        try {
            // Validate token by making a test request
            await axios_1.default.get(`${thingsboard_config_1.THINGSBOARD_CONFIG.baseUrl}/api/auth/user`, {
                headers: { 'X-Authorization': `Bearer ${staticToken}` },
                timeout: thingsboard_config_1.THINGSBOARD_CONFIG.timeouts.auth,
            });
            // Store static token with generous expiration
            this.tokenStorage = {
                accessToken: staticToken,
                refreshToken: null,
                expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
                issuedAt: Date.now(),
            };
            return staticToken;
        }
        catch (error) {
            throw this.handleAuthError('Static token validation failed', error);
        }
    }
    /**
     * Store JWT tokens with proper expiration extraction
     */
    storeJwtTokens(loginResponse) {
        const { token, refreshToken } = loginResponse;
        const expiresAt = this.extractTokenExpiration(token);
        this.tokenStorage = {
            accessToken: token,
            refreshToken,
            expiresAt,
            issuedAt: Date.now(),
        };
    }
    /**
     * Extract expiration timestamp from JWT token
     */
    extractTokenExpiration(token) {
        try {
            // JWT format: header.payload.signature
            const tokenParts = token.split('.');
            if (tokenParts.length !== 3) {
                throw new Error('Invalid JWT format');
            }
            // Decode base64 payload
            const payload = JSON.parse(atob(tokenParts[1]));
            if (!payload.exp) {
                throw new Error('Token missing expiration claim');
            }
            // Convert from seconds to milliseconds
            return payload.exp * 1000;
        }
        catch (error) {
            console.warn('Failed to extract token expiration, using default:', error);
            // Default to 1 hour if extraction fails
            return Date.now() + (60 * 60 * 1000);
        }
    }
    /**
     * Initialize empty token storage
     */
    initializeTokenStorage() {
        return {
            accessToken: null,
            refreshToken: null,
            expiresAt: null,
            issuedAt: null,
        };
    }
    /**
     * Handle authentication errors with proper typing and context
     */
    handleAuthError(context, error) {
        if (axios_1.default.isAxiosError(error)) {
            const axiosError = error;
            const status = axiosError.response?.status;
            const message = axiosError.response?.data?.message || axiosError.message;
            switch (status) {
                case 401:
                    return new Error(`${context}: Invalid credentials or expired token`);
                case 403:
                    return new Error(`${context}: Access denied - insufficient permissions`);
                case 404:
                    return new Error(`${context}: ThingsBoard endpoint not found`);
                case 429:
                    return new Error(`${context}: Rate limit exceeded`);
                case 500:
                    return new Error(`${context}: ThingsBoard server error`);
                default:
                    return new Error(`${context}: ${message || 'Unknown server error'}`);
            }
        }
        if (error instanceof Error) {
            return new Error(`${context}: ${error.message}`);
        }
        return new Error(`${context}: Unknown error occurred`);
    }
    /**
     * Wait for ongoing authentication to complete
     */
    async waitForAuth() {
        const maxWaitTime = 30000; // 30 seconds
        const checkInterval = 100; // 100ms
        let waitTime = 0;
        while (this.authInProgress && waitTime < maxWaitTime) {
            await this.sleep(checkInterval);
            waitTime += checkInterval;
        }
        if (waitTime >= maxWaitTime) {
            throw new Error('Authentication timeout');
        }
    }
    /**
     * Wait for ongoing token refresh to complete
     */
    async waitForRefresh() {
        const maxWaitTime = 15000; // 15 seconds
        const checkInterval = 100; // 100ms
        let waitTime = 0;
        while (this.refreshInProgress && waitTime < maxWaitTime) {
            await this.sleep(checkInterval);
            waitTime += checkInterval;
        }
    }
    /**
     * Sleep utility for delays
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.ThingsBoardAuthService = ThingsBoardAuthService;
//# sourceMappingURL=auth.service.js.map