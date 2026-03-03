"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TB_CONFIG = void 0;
exports.TB_CONFIG = {
    host: process.env.TB_HOST,
    auth: {
        username: process.env.TB_USERNAME,
        password: process.env.TB_PASSWORD,
        staticToken: process.env.TB_API_KEY,
    },
    timeouts: {
        auth: 10000, // 10 seconds for auth requests
        request: 30000, // 30 seconds for general requests
    },
    token: {
        refreshThresholdMinutes: 5, // Refresh if token expires within 5 minutes
    },
};
// Validate configuration
if (!exports.TB_CONFIG.host) {
    throw new Error('Missing required environment variable: TB_HOST');
}
if (!exports.TB_CONFIG.auth.username && !exports.TB_CONFIG.auth.staticToken) {
    throw new Error('Authentication configuration required: Either set TB_USERNAME/TB_PASSWORD or TB_API_KEY');
}
if (exports.TB_CONFIG.auth.username && !exports.TB_CONFIG.auth.password) {
    throw new Error('TB_PASSWORD is required when TB_USERNAME is provided');
}
//# sourceMappingURL=thingsboard.js.map