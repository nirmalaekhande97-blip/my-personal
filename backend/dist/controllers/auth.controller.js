"use strict";
// controllers/auth.controller.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const axios_1 = __importDefault(require("axios"));
const thingsboard_config_1 = require("../config/thingsboard.config");
function decodeJwt(token) {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    }
    catch {
        return {};
    }
}
exports.authController = {
    async login(req, res) {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ error: 'username and password are required' });
            return;
        }
        try {
            // 1. Obtain JWT from ThingsBoard
            const tbBase = thingsboard_config_1.THINGSBOARD_CONFIG.baseUrl;
            const { data: tokenData } = await axios_1.default.post(`${tbBase}/api/auth/login`, { username, password }, { headers: { 'Content-Type': 'application/json' } });
            const { token, refreshToken } = tokenData;
            // 2. Fetch full user profile
            const { data: userData } = await axios_1.default.get(`${tbBase}/api/auth/user`, { headers: { 'X-Authorization': `Bearer ${token}` } });
            // 3. Decode JWT for extra claims (tenantId, customerId, etc.)
            const claims = decodeJwt(token);
            const user = {
                id: userData.id?.id ?? claims['userId'] ?? '',
                email: userData.email,
                firstName: userData.firstName ?? '',
                lastName: userData.lastName ?? '',
                authority: userData.authority ?? claims['scopes']?.[0] ?? '',
                tenantId: userData.tenantId?.id ?? claims['tenantId'] ?? '',
            };
            res.json({ token, refreshToken, user });
        }
        catch (err) {
            if (axios_1.default.isAxiosError(err)) {
                const status = err.response?.status ?? 500;
                if (status === 401 || status === 403) {
                    res.status(401).json({ error: 'Invalid credentials' });
                }
                else {
                    res.status(502).json({
                        error: 'ThingsBoard unreachable',
                        detail: err.message,
                    });
                }
                return;
            }
            console.error('[auth.controller] login error:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async refresh(req, res) {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({ error: 'refreshToken is required' });
            return;
        }
        try {
            const tbBase = thingsboard_config_1.THINGSBOARD_CONFIG.baseUrl;
            const { data } = await axios_1.default.post(`${tbBase}/api/auth/token`, { refreshToken }, { headers: { 'Content-Type': 'application/json' } });
            res.json({ token: data.token, refreshToken: data.refreshToken });
        }
        catch (err) {
            if (axios_1.default.isAxiosError(err)) {
                res
                    .status(err.response?.status ?? 502)
                    .json({ error: 'Token refresh failed', detail: err.message });
                return;
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    },
};
//# sourceMappingURL=auth.controller.js.map