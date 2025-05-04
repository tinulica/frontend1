// src/components/ProfileModal.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './ProfileModal.css';

export default function ProfileModal() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [ownerId, setOwnerId] = useState(user.orgId);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setError('');
    try {
      const { data } = await api.put('/organization/owner', { newOwnerId: ownerId });
      setOwnerId(data.ownerId);
      setSuccess('Ownership updated successfully');
      if (user.id === data.ownerId) {
        logout();
      }
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
          <button className="pm-close" onClick={close}><X size={20} /></button>
        </header>

        <div className="pm-body">
          <div className="pm-column">
            <div className="pm-field">
              <label>Full Name</label>
              <input value={user.fullName} readOnly />
            </div>
            <div className="pm-field">
              <label>Email</label>
              <input value={user.email} readOnly />
            </div>
          </div>

          <div className="pm-column">
            {loading
              ? <p>Loading members…</p>
              : (
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
                    )
                    : (
                      <input
                        value={members.find(m => m.id === ownerId)?.fullName || ''}
                        readOnly
                      />
                    )
                  }
                </div>
              )
            }
          </div>
        </div>

        {(error || success) && (
          <div className={`pm-feedback ${error ? 'error' : 'success'}`}>
            {error || success}
          </div>
        )}

        <footer className="pm-actions">
          <button onClick={close} className="pm-btn cancel">Close</button>
          {user.isOwner && (
            <button
              onClick={handleSave}
              className="pm-btn save"
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
