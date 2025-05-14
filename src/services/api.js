// src/services/api.js
import axios from 'axios';
import { getAuth, clearAuth } from '../utils/auth';

const api = axios.create({
  baseURL: 'https://glovo-hr-backend6.onrender.com',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

api.interceptors.request.use(
  config => {
    const auth = getAuth();
    if (auth && auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const register = payload => api.post('/auth/register', payload);
export const login = payload => api.post('/auth/login', payload);
export const getCurrentUser = () => api.get('/auth/me');

// Display Org Name
export const updateDisplayOrgName = payload => api.put('/user/display-org-name', payload);

export default api;