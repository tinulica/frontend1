import React, { useEffect, useState } from 'react';
import {
  getDashboardSummary,
  getInvitations,
  sendInvitation,
+ deleteInvitation
} from '../services/api';
import InvitationModal from './InvitationModal';
import './Dashboard.css';
import { Trash2 } from 'lucide-react';

export default function Dashboard() {
  const [summary, setSummary]   = useState(null);
  const [invites, setInvites]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [error, setError]       = useState(null);

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
      }
      setLoading(false);
    })();
  }, []);

  const refreshInvites = async () => {
    const { data } = await getInvitations();
    setInvites(data);
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

  if (loading) return <p>Loading...</p>;
  if (error)   return <p className="error">{error}</p>;

  return (
    <main className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="dashboard-stats">
        {/* … your cards … */}
      </div>

      <section className="invites-section">
        <div className="invites-header">
          <h2>Invited Employees</h2>
          <button onClick={() => setInviteOpen(true)} className="btn-invite">
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
                  <button
                    onClick={() => handleDelete(inv.id)}
                    title="Delete invite"
                    className="icon-btn"
                  >
                    <Trash2 size={14} />
                  </button>
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
