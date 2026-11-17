import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Storage access blocked or restricted
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config?._retry) {
      try {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
      } catch {
        // Safe fail
      }
      // Note: ProtectedRoute handles redirect smoothly via React Router state
      // Hard window.location.href is avoided to prevent crashing automated audits (Lighthouse / Web Crawlers)
    }
    return Promise.reject(error);
  }
);

export default api;
