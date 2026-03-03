// config/thingsboard.config.ts

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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
 * ThingsBoard Environment Variables
 */
interface ThingsBoardEnv {
  THINGSBOARD_BASE_URL: string;
  THINGSBOARD_USERNAME?: string;
  THINGSBOARD_PASSWORD?: string;
  THINGSBOARD_ACCESS_TOKEN?: string;
}

/**
 * Validate required environment variables
 */
function validateEnvironment(): ThingsBoardEnv {
  const baseUrl = process.env.THINGSBOARD_BASE_URL;
  const username = process.env.THINGSBOARD_USERNAME;
  const password = process.env.THINGSBOARD_PASSWORD;
  const accessToken = process.env.THINGSBOARD_ACCESS_TOKEN;

  // Validate base URL
  if (!baseUrl) {
    throw new Error('THINGSBOARD_BASE_URL environment variable is required');
  }

  // Validate URL format
  try {
    new URL(baseUrl);
  } catch (error) {
    throw new Error('THINGSBOARD_BASE_URL must be a valid URL format');
  }

  // Validate authentication credentials
  const hasCredentials = username && password;
  const hasToken = accessToken && accessToken !== 'OPTIONAL_STATIC_TOKEN';

  if (!hasCredentials && !hasToken) {
    throw new Error(
      'Authentication required: Either set THINGSBOARD_USERNAME/THINGSBOARD_PASSWORD or THINGSBOARD_ACCESS_TOKEN'
    );
  }

  // Show warning if both methods are provided
  if (hasCredentials && hasToken) {
    console.warn(
      'Both username/password and access token provided. Username/password will be preferred.'
    );
  }

  return {
    THINGSBOARD_BASE_URL: baseUrl,
    THINGSBOARD_USERNAME: username,
    THINGSBOARD_PASSWORD: password,
    THINGSBOARD_ACCESS_TOKEN: hasToken ? accessToken : undefined,
  };
}

/**
 * Create ThingsBoard configuration from environment
 */
function createConfig(): ThingsBoardConfig {
  const env = validateEnvironment();

  return {
    baseUrl: env.THINGSBOARD_BASE_URL,
    auth: {
      username: env.THINGSBOARD_USERNAME,
      password: env.THINGSBOARD_PASSWORD,
      accessToken: env.THINGSBOARD_ACCESS_TOKEN,
    },
    timeouts: {
      auth: 10000,      // 10 seconds for authentication requests
      request: 30000,   // 30 seconds for general API requests
    },
    token: {
      refreshThresholdMinutes: 5,  // Refresh token when it expires within 5 minutes
      maxRetries: 3,               // Maximum authentication retries
    },
  };
}

/**
 * Global ThingsBoard configuration instance
 * Validates environment variables on import
 */
export const THINGSBOARD_CONFIG: ThingsBoardConfig = createConfig();

/**
 * Utility function to check if using username/password authentication
 */
export function isUsernamePasswordAuth(): boolean {
  return !!(THINGSBOARD_CONFIG.auth.username && THINGSBOARD_CONFIG.auth.password);
}

/**
 * Utility function to check if using static token authentication
 */
export function isAccessTokenAuth(): boolean {
  return !!THINGSBOARD_CONFIG.auth.accessToken;
}

/**
 * Get the preferred authentication method
 */
export function getAuthMethod(): 'username-password' | 'access-token' {
  return isUsernamePasswordAuth() ? 'username-password' : 'access-token';
}

/**
 * Configuration validation summary for debugging
 */
export function getConfigSummary(): {
  baseUrl: string;
  authMethod: string;
  hasCredentials: boolean;
  hasToken: boolean;
} {
  return {
    baseUrl: THINGSBOARD_CONFIG.baseUrl,
    authMethod: getAuthMethod(),
    hasCredentials: isUsernamePasswordAuth(),
    hasToken: isAccessTokenAuth(),
  };
}