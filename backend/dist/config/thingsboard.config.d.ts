/**
 * ThingsBoard Configuration Interface
 */
export interface ThingsBoardConfig {
    baseUrl: string;
    auth: {
        username?: string;
        password?: string;
        accessToken?: string;
    };
    timeouts: {
        auth: number;
        request: number;
    };
    token: {
        refreshThresholdMinutes: number;
        maxRetries: number;
    };
}
/**
 * Global ThingsBoard configuration instance
 * Validates environment variables on import
 */
export declare const THINGSBOARD_CONFIG: ThingsBoardConfig;
/**
 * Utility function to check if using username/password authentication
 */
export declare function isUsernamePasswordAuth(): boolean;
/**
 * Utility function to check if using static token authentication
 */
export declare function isAccessTokenAuth(): boolean;
/**
 * Get the preferred authentication method
 */
export declare function getAuthMethod(): 'username-password' | 'access-token';
/**
 * Configuration validation summary for debugging
 */
export declare function getConfigSummary(): {
    baseUrl: string;
    authMethod: string;
    hasCredentials: boolean;
    hasToken: boolean;
};
//# sourceMappingURL=thingsboard.config.d.ts.map