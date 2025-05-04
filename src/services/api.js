import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { 'Content-Type': 'application/json' }
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

// ───── Auth ────────────────────────────────────────────────────────────────

// Register new user (optionally with invite token)
export const register = payload =>
  api.post('/auth/register', payload);

// Login existing user
export const login = payload =>
  api.post('/auth/login', payload);

// Fetch current user (after page reload)
export const getCurrentUser = () =>
  api.get('/auth/me');

// ───── Entries ─────────────────────────────────────────────────────────────

export const getEntries      = () => api.get('/entries');
export const addEntry        = payload => api.post('/entries', payload);
export const updateEntry     = (id, payload) => api.put(`/entries/${id}`, payload);
export const deleteEntry     = id => api.delete(`/entries/${id}`);
export const importEntries   = formData => api.post('/entries/import', formData);
export const exportEntries   = params => api.post(
  '/entries/export',
  params,
  { responseType: 'arraybuffer' }
);
export const emailSalaryById = id => api.post(`/entries/email/salary/${id}`);

// ───── Dashboard ───────────────────────────────────────────────────────────

export const getDashboardSummary = () =>
  api.get('/dashboard/summary');

// ───── Invitations ─────────────────────────────────────────────────────────

export const getInvitations   = () => api.get('/invitations');
export const sendInvitation   = payload => api.post('/invitations', payload);
export const deleteInvitation = id => api.delete(`/invitations/${id}`);

// ───── Organization ─────────────────────────────────────────────────────────

export const getOrgInfo     = () => api.get('/organization/info');
export const getOrgMembers  = () => api.get('/organization/members');
export const changeOrgOwner = newOwnerId =>
  api.put('/organization/owner', { newOwnerId });

// Remove a member from the org (only owner)
export const removeMember = memberId =>
  api.delete(`/organization/members/${memberId}`);

// ───── Profile ──────────────────────────────────────────────────────────────

// Change avatar (multipart)
export const updateAvatar = formData =>
  api.put('/auth/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

// Change password
export const changePassword = payload =>
  api.put('/auth/password', payload);

export default api;
