// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react'
import {
  getDashboardSummary,
  getInvitations,
  sendInvitation,
  deleteInvitation
} from '../services/api'
import InvitationModal from './InvitationModal'
import {
  DollarSign,
  FileText,
  Users,
  BarChart2,
  Trash2,
  Bell
} from 'lucide-react'
import './Dashboard.css'

export default function Dashboard() {
  const [summary, setSummary] = useState({})
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(true)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const [sumRes, invRes] = await Promise.all([
          getDashboardSummary(),
          getInvitations()
        ])
        setSummary(sumRes.data)
        setInvites(invRes.data)
      } catch (err) {
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const refreshInvites = async () => {
    try {
      const { data } = await getInvitations()
      setInvites(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSend = async email => {
    await sendInvitation({ email })
    await refreshInvites()
  }

  const handleDelete = async id => {
    if (!window.confirm('Delete this invitation?')) return
    await deleteInvitation(id)
    await refreshInvites()
  }

  if (loading) return <div className="loading">Loading…</div>
  if (error) return <div className="error">{error}</div>

  const stats = [
    {
      icon: <DollarSign />,
      label: 'Total Payroll',
      value: `€${summary.totalPayroll.toFixed(2)}`
    },
    {
      icon: <FileText />,
      label: 'Total Entries',
      value: summary.totalEntries
    },
    {
      icon: <Users />,
      label: 'Total Employees',
      value: summary.totalEmployees
    },
    {
      icon: <BarChart2 />,
      label: 'Average Salary',
      value: `€${summary.averageSalary.toFixed(2)}`
    }
  ]

  return (
    <div className="dashboard">
      <header className="dash-header">
        <h1>Dashboard</h1>
        <button className="notification-btn">
          <Bell />
          <span className="badge">3</span>
        </button>
      </header>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div>
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="chart-section">
        <h2>Payroll Trend</h2>
        <div className="chart-placeholder">
          {/* Replace with your actual chart */}
          <p>📈 Chart placeholder</p>
        </div>
      </section>

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
                  {inv.acceptedAt ? (
                    <span className="badge accepted">Registered</span>
                  ) : (
                    <span className="badge pending">Pending</span>
                  )}
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
    </div>
  )
}
