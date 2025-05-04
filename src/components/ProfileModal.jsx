// src/components/ProfileModal.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './ProfileModal.css';

export default function ProfileModal() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [ownerId, setOwnerId] = useState(user.organizationId);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // fetch all members + current owner
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/organization/members');
        setMembers(data.members);
        setOwnerId(data.ownerId);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const { data } = await api.put('/organization/owner', { newOwnerId: ownerId });
      setOwnerId(data.ownerId);
      setSuccess('Ownership updated');
      // if you just demoted yourself:
      if (user.id === ownerId) {
        logout();
      }
      setTimeout(() => setSuccess(null), 3000);
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
        <h2>My Profile</h2>

        <div className="pm-field">
          <label>Full Name</label>
          <input type="text" value={user.fullName} readOnly />
        </div>
        <div className="pm-field">
          <label>Email</label>
          <input type="email" value={user.email} readOnly />
        </div>

        {loading
          ? <p>Loading members…</p>
          : user.isOwner
            ? (
              <div className="pm-field">
                <label>Organization Owner</label>
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
              </div>
            )
            : (
              <div className="pm-field">
                <label>Organization Owner</label>
                <input
                  type="text"
                  value={
                    members.find(m => m.id === ownerId)?.fullName
                      || ''
                  }
                  readOnly
                />
              </div>
            )
        }

        {error && <p className="pm-error">{error}</p>}
        {success && <p className="pm-success">{success}</p>}

        <div className="pm-actions">
          <button onClick={close} className="pm-cancel">Close</button>
          {user.isOwner && (
            <button
              onClick={handleSave}
              className="pm-save"
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
