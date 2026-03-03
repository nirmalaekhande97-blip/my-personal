// services/auth.service.ts
// Handles all authentication API calls to the backend.

import apiClient from '../api/apiClient';
import type { LoginRequest, LoginResponse, AuthUser } from '../types/auth';

const TOKEN_KEY = 'tb_token';
const REFRESH_KEY = 'tb_refresh_token';
const USER_KEY = 'tb_user';

const AuthService = {
  /**
   * Login with username and password.
   * Stores token and user in localStorage on success.
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/api/auth/login', credentials);
    AuthService.saveSession(data.token, data.refreshToken, data.user);
    return data;
  },

  /**
   * Logout — clear all stored credentials.
   */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Save token, refresh token and user to localStorage.
   */
  saveSession(token: string, refreshToken: string, user: AuthUser): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /**
   * Get stored access token.
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get stored user object.
   */
  getUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  /**
   * Check whether a valid session exists.
   */
  isAuthenticated(): boolean {
    return !!AuthService.getToken();
  },
};

export default AuthService;
