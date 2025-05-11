import axios from 'axios'
import { getAuth, clearAuth } from '../utils/auth'

// Create Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false
})

// Request interceptor: attach JWT token if available
api.interceptors.request.use(
  config => {
    const auth = getAuth()
    if (auth && auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Response interceptor: auto-logout on 401
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ───── Auth ────────────────────────────────────────────────────────────────
export const register       = payload => api.post('/auth/register', payload)
export const login          = payload => api.post('/auth/login', payload)
export const getCurrentUser = ()      => api.get('/auth/me')

// ───── Entries ─────────────────────────────────────────────────────────────
export const getEntries      = ()                => api.get('/entries')
export const addEntry        = payload           => api.post('/entries', payload)
export const updateEntry     = (id, payload)     => api.put(`/entries/${id}`, payload)
export const deleteEntry     = id                => api.delete(`/entries/${id}`)
export const importEntries   = formData          => api.post('/entries/import', formData)
export const exportEntries   = params            => api.post('/entries/export', params, { responseType: 'arraybuffer' })
export const emailSalaryById = id                => api.post(`/entries/email/salary/${id}`)
export const getSalaryHistory= id                => api.get(`/entries/${id}/history`)

// ───── Dashboard ───────────────────────────────────────────────────────────
export const getDashboardSummary = ()           => api.get('/dashboard/summary')

// ───── Invitations ─────────────────────────────────────────────────────────
export const getInvitations   = ()               => api.get('/invitations')
export const sendInvitation   = payload          => api.post('/invitations', payload)
export const deleteInvitation = id               => api.delete(`/invitations/${id}`)

// ───── Organization ─────────────────────────────────────────────────────────
export const getOrgInfo           = ()               => api.get('/organization/info')
export const getOrgMembers        = ()               => api.get('/organization/members')
export const changeOrgOwner       = newOwnerId       => api.put('/organization/owner', { newOwnerId })
export const removeMember         = memberId         => api.delete(`/organization/members/${memberId}`)
export const getAllOrganizations  = () => api.get('/organizations')
export const setupOrganization    = payload => api.post('/organizations/setup', payload)

// ───── Profile ──────────────────────────────────────────────────────────────
// Change avatar (multipart)
export const updateAvatar     = formData          =>
  api.put('/auth/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

// Change password
export const changePassword   = payload           => api.put('/auth/password', payload)

// ───── Notifications ────────────────────────────────────────────────────────
export const getNotifications         = ()    => api.get('/notifications')
export const markNotificationRead     = id    => api.put(`/notifications/${id}/read`)
export const markAllNotificationsRead = ()    => api.put('/notifications/read-all')

export default api
