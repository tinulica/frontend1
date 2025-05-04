// src/components/ProfileModal.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Camera } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './ProfileModal.css';

export default function ProfileModal() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInput = useRef();
  const [members, setMembers]     = useState([]);
  const [ownerId, setOwnerId]     = useState(user.organizationId);
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl || '');
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');

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
        setLoading(false);
      }
    })();
  }, []);

  const handleAvatarClick = () => fileInput.current.click();
  const onAvatarChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
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

  const handlePasswordChange = async () => {
    const { current, next, confirm } = passwords;
    if (next !== confirm) {
      setError('New passwords do not match');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await api.put('/auth/password', { currentPassword: current, newPassword: next });
      setSuccess('Password changed');
      setPasswords({ current: '', next: '', confirm: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

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

  const close = () => navigate(-1);

  return (
    <div className="pm-backdrop" onClick={close}>
      <div className="pm-modal" onClick={e => e.stopPropagation()}>
        <header className="pm-header">
          <h2>My Profile</h2>
          <button className="pm-close" onClick={close}><X size={20}/></button>
        </header>

        <div className="pm-body">
          {/* Left column: avatar & info */}
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

          {/* Right column: owner select & password */}
          <div className="pm-column">
            {!loading && (
              <div className="pm-field">
                <label>Organization Owner</label>
                {user.isOwner
                  ? (
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
                  ) : (
                    <input
                      value={members.find(m => m.id === ownerId)?.fullName || ''}
                      readOnly
                    />
                  )
                }
                {user.isOwner && (
                  <button
                    className="pm-small-btn"
                    onClick={handleOwnerSave}
                    disabled={saving}
                  >
                    Save Owner
                  </button>
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
