import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

// Automatically attach JWT
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

// --- Auth ---
export const register = payload => api.post('/auth/register', payload);
export const login    = payload => api.post('/auth/login',    payload);

// --- Entries ---
export const getEntries      = () => api.get('/entries');
export const addEntry        = payload => api.post('/entries',               payload);
export const updateEntry     = (id, payload) => api.put(`/entries/${id}`,     payload);
export const deleteEntry     = id => api.delete(`/entries/${id}`);
export const importEntries   = formData => api.post('/entries/import',      formData);
export const exportEntries   = params => api.post('/entries/export',        params, { responseType: 'arraybuffer' });
export const emailSalaryById = id => api.post(`/entries/email/salary/${id}`);

// --- Dashboard ---
export const getDashboardSummary = () => api.get('/dashboard/summary');

// --- Invitations ---
export const getInvitations   = () => api.get('/invitations');
export const sendInvitation   = payload => api.post('/invitations', payload);
export const deleteInvitation = id => api.delete(`/invitations/${id}`);

// --- Organization & Owner management ---
export const getOrganizationInfo    = () => api.get('/organization');
export const getOrganizationMembers = () => api.get('/organization/members');
export const changeOrganizationOwner = newOwnerId =>
  api.put('/organization/owner', { newOwnerId });

// --- Profile (you can wire these up in your ProfileModal later) ---
export const updateAvatar   = formData =>
  api.post('/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const changePassword = payload =>
  api.put('/profile/password', payload);

export default api;
