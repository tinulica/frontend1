import axios from 'axios'
import { getAuth, clearAuth } from '../utils/auth'

// Axios instance
const api = axios.create({
  baseURL: 'https://glovo-hr-backend6.onrender.com',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false
})

// Request interceptor: adds token
api.interceptors.request.use(
  config => {
    const auth = getAuth()
    if (auth?.token) {
      config.headers.Authorization = `Bearer ${auth.token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Response interceptor: global 401 handler
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ───── Auth ────────────────────────────────────────────────────────────────
export const register = payload => api.post('/auth/register', payload)
export const login = payload => api.post('/auth/login', payload)
export const getCurrentUser = () => api.get('/auth/me')
export const updateAvatar = formData =>
  api.put('/auth/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const changePassword = payload => api.put('/auth/password', payload)

// ───── Organization ────────────────────────────────────────────────────────
export const getOrgInfo = () => api.get('/organization/info')
export const getOrgMembers = () => api.get('/organization/members')
export const changeOrgOwner = id => api.put('/organization/owner', { newOwnerId: id })
export const removeMember = id => api.delete(`/organization/members/${id}`)
export const getAllOrganizations = () => api.get('/api/organizations')
export const setupOrganization = payload => api.post('/api/organizations', payload)
export const updateOrganization = payload => api.put('/organization', payload)
export const updateDisplayOrgName = payload => api.put('/user/display-org-name', payload)
export const getDisplayOrgName = () => api.get('/user/display-org-name')

// ───── Dashboard ───────────────────────────────────────────────────────────
export const getDashboardSummary = () => api.get('/dashboard/summary')

// ───── Entries ─────────────────────────────────────────────────────────────
export const getEntries = () => api.get('/entries')
export const addEntry = payload => api.post('/entries', payload)
export const updateEntry = (id, payload) => api.put(`/entries/${id}`, payload)
export const deleteEntry = id => api.delete(`/entries/${id}`)
export const importEntries = formData => api.post('/entries/import', formData)
export const exportEntries = params =>
  api.post('/entries/export', params, { responseType: 'arraybuffer' })
export const emailSalaryById = id => api.post(`/entries/email/salary/${id}`)
export const getSalaryHistory = id => api.get(`/entries/salary-history/${id}`)
export const exportSalaryById = id => api.get(`/entries/export/salary/${id}`)

// ───── Invitations ─────────────────────────────────────────────────────────
export const getInvitations = () => api.get('/invitations')
export const sendInvitation = payload => api.post('/invitations', payload)
export const deleteInvitation = id => api.delete(`/invitations/${id}`)

// ───── Notifications ───────────────────────────────────────────────────────
export const getNotifications = () => api.get('/notifications')
export const markNotificationRead = id => api.put(`/notifications/${id}/read`)
export const markAllNotificationsRead = () => api.put('/notifications/read-all')

export default api