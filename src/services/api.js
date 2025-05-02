import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Automatically attach JWT
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

export const register   = payload => api.post('/auth/register', payload);
export const login      = payload => api.post('/auth/login', payload);
export const getEntries = () => api.get('/entries');
export const getDashboardSummary = () => api.get('/dashboard/summary');

export default api;
