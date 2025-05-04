// src/components/ProfileModal.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Camera, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './ProfileModal.css';

export default function ProfileModal() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInput = useRef();

  const [activeTab, setActiveTab]         = useState('profile'); // 'profile' | 'invites'
  const [members, setMembers]             = useState([]);
  const [ownerId, setOwnerId]             = useState(user.organizationId);
  const [invites, setInvites]             = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingInvites, setLoadingInvites] = useState(false);
  const [saving, setSaving]               = useState(false);
  const [error, setError]                 = useState('');
  const [success, setSuccess]             = useState('');
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl || '');
  const [passwords, setPasswords]         = useState({ current: '', next: '', confirm: '' });

  // Load org info + members
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

  // Load invites when tab switches
  useEffect(() => {
    if (activeTab !== 'invites') return;
    setLoadingInvites(true);
    (async () => {
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
  const onAvatarChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setSaving(true);
    const form = new FormData();
    form.append('avatar', file);
    try {
      const { data } = await api.put('/auth/avatar', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
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
        newPassword: next
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
      const { data } = await api.put('/organization/owner', {
        newOwnerId: ownerId
      });
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

  // **New** Remove a team member
  const handleMemberRemove = async memberId => {
    if (!window.confirm('Remove this team member?')) return;
    try {
      await api.delete(`/organization/members/${memberId}`);
      setMembers(members.filter(m => m.id !== memberId));
      setSuccess('Member removed');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="pm-backdrop" onClick={close}>
      <div className="pm-modal" onClick={e => e.stopPropagation()}>
        <header className="pm-header">
          <h2>Settings &amp; Profile</h2>
          <button className="pm-close" onClick={close}><X size={20}/></button>
        </header>

        <nav className="pm-tabs">
          <button
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >Profile</button>
          <button
            className={activeTab === 'invites' ? 'active' : ''}
            onClick={() => setActiveTab('invites')}
          >Invited Employees</button>
        </nav>

        <section className="pm-body">
          {activeTab === 'profile' && (
            <div className="pm-grid">
              {/* Left column */}
              <div className="pm-column">
                <div className="pm-avatar-section">
                  <img src={avatarPreview} alt="Avatar" className="pm-avatar"/>
                  <button
                    className="pm-avatar-btn"
                    onClick={() => fileInput.current.click()}
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

              {/* Right column */}
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
                        >Update Owner</button>
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
                    onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                    disabled={saving}
                  />
                </div>
                <div className="pm-field">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwords.next}
                    onChange={e => setPasswords(p => ({ ...p, next: e.target.value }))}
                    disabled={saving}
                  />
                </div>
                <div className="pm-field">
                  <label>Confirm New</label>
                  <input
                    type="password"
                    value={passwords.confirm}
                    onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                    disabled={saving}
                  />
                </div>
                <button
                  className="pm-btn"
                  onClick={handlePasswordChange}
                  disabled={saving}
                >
                  {saving ? 'Saving…' : 'Update Password'}
                </button>

                {/* ——— New: Team Members List ——— */}
                <hr className="pm-separator" />
                <h3>Team Members</h3>
                {loadingMembers ? (
                  <p>Loading members…</p>
                ) : (
                  <ul className="pm-members-list">
                    {members.map(m => (
                      <li key={m.id}>
                        <span>
                          {m.fullName} <small>({m.email})</small>
                        </span>
                        {user.isOwner && m.id !== user.id && (
                          <button
                            className="icon-btn"
                            onClick={() => handleMemberRemove(m.id)}
                            title="Remove member"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {activeTab === 'invites' && (
            <div className="pm-invites">
              {loadingInvites ? (
                <p>Loading…</p>
              ) : invites.length === 0 ? (
                <p>No pending invitations.</p>
              ) : (
                <table className="pm-invites-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Invited On</th>
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
                            title="Delete invite"
                          >
                            <Trash2 size={16}/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
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
