import React, { useEffect, useState } from 'react';
import {
  getDashboardSummary,
  getInvitations,
  sendInvitation
} from '../services/api';
import InvitationModal from './InvitationModal';
import './Dashboard.css';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
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
      }
      setLoading(false);
    })();
  }, []);

  const handleSend = async email => {
    await sendInvitation({ email });
    const { data } = await getInvitations();
    setInvites(data);
  };

  if (loading) return <p>Loading…</p>;
  if (error)   return <p className="error">{error}</p>;

  return (
    <main className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="dashboard-stats">
        <div><h2>Total Employees</h2><p>{summary.totalEmployees}</p></div>
        <div><h2>Total Entries</h2><p>{summary.totalEntries}</p></div>
        <div><h2>Total Payroll</h2><p>{summary.totalPayroll.toFixed(2)} EUR</p></div>
        <div><h2>Average Salary</h2><p>{summary.averageSalary.toFixed(2)} EUR</p></div>
      </div>

      <section className="invites-section">
        <h2>Invited Employees</h2>
        <button onClick={() => setInviteOpen(true)}>Invite Employee</button>

        <table className="invites-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Invited At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {invites.map(inv => (
              <tr key={inv.id}>
                <td>{inv.invitedEmail}</td>
                <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                <td>{inv.acceptedAt ? 'Registered' : 'Pending'}</td>
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
