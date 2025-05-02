// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import {
  getDashboardSummary,
  getInvitations,
  sendInvitation,
  deleteInvitation
} from '../services/api';
import InvitationModal from './InvitationModal';
import './Dashboard.css';
import { Trash2 } from 'lucide-react';

export default function Dashboard() {
  const [summary, setSummary] = useState({});
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [sumRes, invRes] = await Promise.all([
          getDashboardSummary(),
          getInvitations()
        ]);
        setSummary(sumRes.data);
        setInvites(invRes.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const refreshInvites = async () => {
    try {
      const { data } = await getInvitations();
      setInvites(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (email) => {
    await sendInvitation({ email });
    await refreshInvites();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this invitation?')) return;
    await deleteInvitation(id);
    await refreshInvites();
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error)   return <div className="error">{error}</div>;

  return (
    <main className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="dashboard-stats">
        <div className="card">
          <div className="card-title">Total Employees</div>
          <div className="card-value">{summary.totalEmployees}</div>
        </div>
        <div className="card">
          <div className="card-title">Total Entries</div>
          <div className="card-value">{summary.totalEntries}</div>
        </div>
        <div className="card">
          <div className="card-title">Total Payroll</div>
          <div className="card-value">{summary.totalPayroll.toFixed(2)} EUR</div>
        </div>
        <div className="card">
          <div className="card-title">Average Salary</div>
          <div className="card-value">{summary.averageSalary.toFixed(2)} EUR</div>
        </div>
      </div>

      <section className="invites-section">
        <div className="invites-header">
          <h2>Invited Employees</h2>
          <button
            onClick={() => setInviteOpen(true)}
            className="btn-invite"
          >
            Invite Employee
          </button>
        </div>

        <table className="invites-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Invited At</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {invites.map(inv => (
              <tr key={inv.id}>
                <td>{inv.invitedEmail}</td>
                <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                <td>
                  {inv.acceptedAt
                    ? <span className="badge accepted">Registered</span>
                    : <span className="badge pending">Pending</span>}
                </td>
                <td>
                  {!inv.acceptedAt && (
                    <button
                      onClick={() => handleDelete(inv.id)}
                      title="Delete invite"
                      className="icon-btn"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <InvitationModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSent={handleSend}
      />
    </main>
  );
}
