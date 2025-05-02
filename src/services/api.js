import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

// Automatically attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth
export const register   = (payload) => api.post('/auth/register', payload);
export const login      = (payload) => api.post('/auth/login',    payload);

// Entries
export const getEntries      = () => api.get('/entries');
export const addEntry        = (payload) => api.post('/entries',               payload);
export const updateEntry     = (id, payload) => api.put(`/entries/${id}`,     payload);
export const deleteEntry     = (id) => api.delete(`/entries/${id}`);
export const importEntries   = (formData) => api.post('/entries/import',      formData);
export const exportEntries   = (params) => api.post('/entries/export',        params, { responseType: 'arraybuffer' });
export const emailSalaryById = (id) => api.post(`/entries/email/salary/${id}`);

// Dashboard
export const getDashboardSummary = () => api.get('/dashboard/summary');

export default api;
