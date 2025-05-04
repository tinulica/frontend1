// src/components/ProfileModal.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate }                 from 'react-router-dom';
import { X, Camera, Trash2 }           from 'lucide-react';
import { AuthContext }                 from '../context/AuthContext';
import api                             from '../services/api';
import './ProfileModal.css';

export default function ProfileModal() {
  const { user, logout } = useContext(AuthContext);
  const navigate         = useNavigate();
  const fileInput        = useRef();

  const [activeTab, setActiveTab]       = useState('profile'); // 'profile' | 'invites'
  const [members, setMembers]           = useState([]);
  const [ownerId, setOwnerId]           = useState(user.organizationId);
  const [invites, setInvites]           = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingInvites, setLoadingInvites] = useState(true);
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState('');
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl || '');
  const [passwords, setPasswords]       = useState({ current: '', next: '', confirm: '' });

  // Fetch organization info & members
  useEffect(() => {
    (async () => {
      try {
        const [{ data: org }, { data: membersData }] = await Promise.all([
          api.get('/organization/info'),
          api.get('/organization/members')
        ]);
        setOwnerId(org.ownerId);
        setMembers(membersData.members);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoadingMembers(false);
      }
    })();
  }, []);

  // Fetch pending invitations
  useEffect(() => {
    if (activeTab !== 'invites') return;
    (async () => {
      setLoadingInvites(true);
      try {
        const { data } = await api.get('/invitations');
        setInvites(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoadingInvites(false);
      }
    })();
  }, [activeTab]);

  const close = () => navigate(-1);

  // Avatar upload
  const handleAvatarClick = () => fileInput.current.click();
  const onAvatarChange = async e => {
    const file = e.target.files[0]; if (!file) return;
    const form = new FormData();
    form.append('avatar', file);
    setSaving(true);
    try {
      const { data } = await api.put('/auth/avatar', form);
      setAvatarPreview(data.avatarUrl);
      setSuccess('Avatar updated');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  // Change password
  const handlePasswordChange = async () => {
    const { current, next, confirm } = passwords;
    if (next !== confirm) {
      setError('New passwords do not match');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await api.put('/auth/password', {
        currentPassword: current,
        newPassword:     next
      });
      setSuccess('Password changed');
      setPasswords({ current: '', next: '', confirm: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  // Change organization owner
  const handleOwnerSave = async () => {
    setSaving(true);
    setError('');
    try {
      const { data } = await api.put('/organization/owner', { newOwnerId: ownerId });
      setOwnerId(data.ownerId);
      setSuccess('Ownership updated');
      if (user.id === data.ownerId) logout();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete an invitation
  const handleInviteDelete = async id => {
    if (!window.confirm('Delete this invitation?')) return;
    try {
      await api.delete(`/invitations/${id}`);
      setInvites(invites.filter(inv => inv.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="pm-backdrop" onClick={close}>
      <div className="pm-modal" onClick={e => e.stopPropagation()}>
        <header className="pm-header">
          <h2>My Profile</h2>
          <button className="pm-close" onClick={close}><X size={20} /></button>
        </header>

        <nav className="pm-tabs">
          <button
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={activeTab === 'invites' ? 'active' : ''}
            onClick={() => setActiveTab('invites')}
          >
            Invited Employees
          </button>
        </nav>

        <section className="pm-body">
          {activeTab === 'profile' && (
            <div className="pm-grid">
              {/* Avatar & basic info */}
              <div className="pm-column">
                <div className="pm-avatar-section">
                  <img src={avatarPreview} alt="Avatar" className="pm-avatar"/>
                  <button
                    className="pm-avatar-btn"
                    onClick={handleAvatarClick}
                    disabled={saving}
                  >
                    <Camera size={16}/> Change
                  </button>
                  <input
                    type="file"
                    ref={fileInput}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={onAvatarChange}
                  />
                </div>
                <div className="pm-field">
                  <label>Full Name</label>
                  <input value={user.fullName} readOnly/>
                </div>
                <div className="pm-field">
                  <label>Email</label>
                  <input value={user.email} readOnly/>
                </div>
              </div>

              {/* Ownership & password */}
              <div className="pm-column">
                {!loadingMembers && (
                  <div className="pm-field">
                    <label>Organization Owner</label>
                    {user.isOwner ? (
                      <>
                        <select
                          value={ownerId}
                          onChange={e => setOwnerId(e.target.value)}
                          disabled={saving}
                        >
                          {members.map(m => (
                            <option key={m.id} value={m.id}>
                              {m.fullName} ({m.email})
                            </option>
                          ))}
                        </select>
                        <button
                          className="pm-small-btn"
                          onClick={handleOwnerSave}
                          disabled={saving}
                        >
                          Save Owner
                        </button>
                      </>
                    ) : (
                      <input
                        value={members.find(m => m.id === ownerId)?.fullName || ''}
                        readOnly
                      />
                    )}
                  </div>
                )}

                <hr className="pm-separator"/>

                <h3>Change Password</h3>
                <div className="pm-field">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwords.current}
                    onChange={e => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                    disabled={saving}
                  />
                </div>
                <div className="pm-field">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwords.next}
                    onChange={e => setPasswords(prev => ({ ...prev, next: e.target.value }))}
                    disabled={saving}
                  />
                </div>
                <div className="pm-field">
                  <label>Confirm New</label>
                  <input
                    type="password"
                    value={passwords.confirm}
                    onChange={e => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                    disabled={saving}
                  />
                </div>
                <button
                  className="pm-btn save-pw"
                  onClick={handlePasswordChange}
                  disabled={saving}
                >
                  {saving ? 'Saving…' : 'Update Password'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'invites' && (
            <div className="pm-invites">
              {loadingInvites
                ? <p>Loading invitations…</p>
                : invites.length === 0
                  ? <p>No pending invitations.</p>
                  : (
                    <table className="pm-invites-table">
                      <thead>
                        <tr>
                          <th>Email</th>
                          <th>Invited At</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {invites.map(inv => (
                          <tr key={inv.id}>
                            <td>{inv.invitedEmail}</td>
                            <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                            <td>
                              <button
                                className="icon-btn"
                                onClick={() => handleInviteDelete(inv.id)}
                                title="Delete invitation"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
              }
            </div>
          )}
        </section>

        {(error || success) && (
          <div className={`pm-feedback ${error ? 'error' : 'success'}`}>
            {error || success}
          </div>
        )}

        <footer className="pm-actions">
          <button onClick={close} className="pm-btn cancel">Close</button>
        </footer>
      </div>
    </div>
  );
}
