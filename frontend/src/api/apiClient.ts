// api/apiClient.ts
// Pre-configured Axios instance that points to our backend.
// Automatically attaches the JWT token stored in localStorage to every request.

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor — attach stored token on every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tb_token');
    if (token) {
      config.headers['X-Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale credentials and redirect to login
      localStorage.removeItem('tb_token');
      localStorage.removeItem('tb_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
