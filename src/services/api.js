// src/services/api.js
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

// Auth
export const register             = payload => api.post('/auth/register', payload);
export const login                = payload => api.post('/auth/login',    payload);

// Entries
export const getEntries           = () => api.get('/entries');
export const addEntry             = payload => api.post('/entries',               payload);
export const updateEntry          = (id, payload) => api.put(`/entries/${id}`,     payload);
export const deleteEntry          = id => api.delete(`/entries/${id}`);
export const importEntries        = formData => api.post('/entries/import',      formData);
export const exportEntries        = params => api.post('/entries/export',        params, { responseType: 'arraybuffer' });
export const emailSalaryById      = id => api.post(`/entries/email/salary/${id}`);

// Dashboard
export const getDashboardSummary  = () => api.get('/dashboard/summary');

// Invitations
export const getInvitations       = () => api.get('/invites');
export const sendInvitation       = payload => api.post('/invites', payload);

export default api;


// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { getDashboardSummary, getInvitations } from '../services/api';
import InvitationModal from './InvitationModal';
import './Dashboard.css';

export default function Dashboard() {
  const [summary, setSummary]         = useState(null);
  const [invites, setInvites]         = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingInvites, setLoadingInvites] = useState(true);
  const [error, setError]             = useState(null);
  const [showInvite, setShowInvite]   = useState(false);

  useEffect(() => {
    fetchSummary();
    fetchInvites();
  }, []);

  async function fetchSummary() {
    setLoadingSummary(true);
    try {
      const { data } = await getDashboardSummary();
      setSummary(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoadingSummary(false);
    }
  }

  async function fetchInvites() {
    setLoadingInvites(true);
    try {
      const { data } = await getInvitations();
      setInvites(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoadingInvites(false);
    }
  }

  if (loadingSummary || !summary) return <p>Loading dashboard…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <main className="dashboard-container">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Employees</h3>
          <p>{summary.totalEmployees}</p>
        </div>
        <div className="stat-card">
          <h3>Total Entries</h3>
          <p>{summary.totalEntries}</p>
        </div>
        <div className="stat-card">
          <h3>Total Payroll</h3>
          <p>{summary.totalPayroll.toFixed(2)} EUR</p>
        </div>
        <div className="stat-card">
          <h3>Average Salary</h3>
          <p>{summary.averageSalary.toFixed(2)} EUR</p>
        </div>
      </div>

      <section className="invites-section">
        <div className="invites-header">
          <h2>Invitations</h2>
          <button onClick={() => setShowInvite(true)}>Invite Employee</button>
        </div>

        {loadingInvites ? (
          <p>Loading invites…</p>
        ) : (
          <table className="invites-table">
            <thead>
              <tr><th>Email</th><th>Status</th><th>Sent At</th><th>Accepted At</th></tr>
            </thead>
            <tbody>
              {invites.map(inv => (
                <tr key={inv.id}>
                  <td>{inv.invitedEmail}</td>
                  <td>{inv.acceptedAt ? 'Registered' : 'Pending'}</td>
                  <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td>{inv.acceptedAt ? new Date(inv.acceptedAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <InvitationModal
        isOpen={showInvite}
        onClose={() => setShowInvite(false)}
        onSent={() => { setShowInvite(false); fetchInvites(); }}
      />
    </main>
  );
}
