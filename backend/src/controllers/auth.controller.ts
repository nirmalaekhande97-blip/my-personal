// controllers/auth.controller.ts

import type { Request, Response } from 'express';
import axios from 'axios';
import { THINGSBOARD_CONFIG } from '../config/thingsboard.config';

interface TBLoginResponse {
  token: string;
  refreshToken: string;
}

interface TBUserResponse {
  id: { id: string; entityType: string };
  email: string;
  firstName: string;
  lastName: string;
  authority: string;
  tenantId?: { id: string; entityType: string };
}

function decodeJwt(token: string): Record<string, unknown> {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
  } catch {
    return {};
  }
}

export const authController = {
  async login(req: Request, res: Response) {
    const { username, password } = req.body as {
      username?: string;
      password?: string;
    };

    if (!username || !password) {
      res.status(400).json({ error: 'username and password are required' });
      return;
    }

    try {
      // 1. Obtain JWT from ThingsBoard
      const tbBase = THINGSBOARD_CONFIG.baseUrl;

      const { data: tokenData } = await axios.post<TBLoginResponse>(
        `${tbBase}/api/auth/login`,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { token, refreshToken } = tokenData;

      // 2. Fetch full user profile
      const { data: userData } = await axios.get<TBUserResponse>(
        `${tbBase}/api/auth/user`,
        { headers: { 'X-Authorization': `Bearer ${token}` } }
      );

      // 3. Decode JWT for extra claims (tenantId, customerId, etc.)
      const claims = decodeJwt(token);

      const user = {
        id: userData.id?.id ?? (claims['userId'] as string) ?? '',
        email: userData.email,
        firstName: userData.firstName ?? '',
        lastName: userData.lastName ?? '',
        authority: userData.authority ?? (claims['scopes'] as string[])?.[0] ?? '',
        tenantId: userData.tenantId?.id ?? (claims['tenantId'] as string) ?? '',
      };

      res.json({ token, refreshToken, user });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status ?? 500;
        if (status === 401 || status === 403) {
          res.status(401).json({ error: 'Invalid credentials' });
        } else {
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

  async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body as { refreshToken?: string };

    if (!refreshToken) {
      res.status(400).json({ error: 'refreshToken is required' });
      return;
    }

    try {
      const tbBase = THINGSBOARD_CONFIG.baseUrl;

      const { data } = await axios.post<TBLoginResponse>(
        `${tbBase}/api/auth/token`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      );

      res.json({ token: data.token, refreshToken: data.refreshToken });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        res
          .status(err.response?.status ?? 502)
          .json({ error: 'Token refresh failed', detail: err.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};
