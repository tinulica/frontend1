// src/services/api.js
import axios from 'axios';
mport {
  getEntries,
  getEntry,
  addEntry,
  updateEntry,
  deleteEntry,
  getSalaryHistory,
  importEntries,
  exportEntries,
  exportSalaryById,
  emailSalaryById
} from '../services/api';
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Automatically attach JWT to every request
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
export const register               = (payload) => api.post('/auth/register', payload);
export const login                  = (payload) => api.post('/auth/login', payload);

// Dashboard
export const getDashboardSummary    = () => api.get('/dashboard/summary');

// Entries
export const getEntries             = () => api.get('/entries');
export const getEntry               = (id) => api.get(`/entries/${id}`);
export const addEntry               = (data) => api.post('/entries', data);
export const updateEntry            = (id, data) => api.put(`/entries/${id}`, data);
export const deleteEntry            = (id) => api.delete(`/entries/${id}`);

// Salary history
export const getSalaryHistory       = (id) => api.get(`/entries/salary-history/${id}`);

// Bulk import/export
export const importEntries          = (formData) =>
  api.post('/entries/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const exportEntries          = () =>
  api.post('/entries/export', {}, { responseType: 'blob' });

// Per‑entry export/email
export const exportSalaryById       = (id) =>
  api.get(`/entries/export/salary/${id}`, { responseType: 'blob' });
export const emailSalaryById        = (id) =>
  api.post(`/entries/email/salary/${id}`);

// Default export of the configured axios instance
export default api;
