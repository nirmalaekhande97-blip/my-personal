// config/thingsboard.ts
export interface ThingsBoardConfig {
  host: string;
  // Authentication options - use either username/password OR static token
  auth: {
    // Preferred method: username/password
    username?: string;
    password?: string;
    // Fallback method: static access token
    staticToken?: string;
  };
  // Request timeout configurations
  timeouts: {
    auth: number;      // Authentication request timeout
    request: number;   // General request timeout
  };
  // JWT token refresh settings
  token: {
    refreshThresholdMinutes: number; // Refresh token if expiring within this time
  };
}

export const TB_CONFIG: ThingsBoardConfig = {
  host: process.env.TB_HOST!,
  auth: {
    username: process.env.TB_USERNAME,
    password: process.env.TB_PASSWORD,
    staticToken: process.env.TB_API_KEY,
  },
  timeouts: {
    auth: 10000,      // 10 seconds for auth requests
    request: 30000,   // 30 seconds for general requests
  },
  token: {
    refreshThresholdMinutes: 5, // Refresh if token expires within 5 minutes
  },
};

// Validate configuration
if (!TB_CONFIG.host) {
  throw new Error('Missing required environment variable: TB_HOST');
}

if (!TB_CONFIG.auth.username && !TB_CONFIG.auth.staticToken) {
  throw new Error(
    'Authentication configuration required: Either set TB_USERNAME/TB_PASSWORD or TB_API_KEY'
  );
}

if (TB_CONFIG.auth.username && !TB_CONFIG.auth.password) {
  throw new Error('TB_PASSWORD is required when TB_USERNAME is provided');
}