// src/pages/OrgSetup.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupOrganization, getCurrentUser } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function OrgSetup() {
  const navigate = useNavigate();
  const { refreshUser } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [invites, setInvites] = useState(['']);
  const [error, setError] = useState('');

  useEffect(() => {
    getCurrentUser().then(res => {
      if (res.data.user?.organizationId) {
        navigate('/dashboard');
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setupOrganization({ name, bio, invites: invites.filter(i => i.trim()) });
      await refreshUser?.();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set up organization.');
    }
  };

  return (
    <div className="container">
      <h2>Set up your organization</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Organization Name:
          <input value={name} onChange={e => setName(e.target.value)} required />
        </label>
        <label>
          Bio (optional):
          <textarea value={bio} onChange={e => setBio(e.target.value)} />
        </label>
        <label>
          Invite Members:
          {invites.map((email, idx) => (
            <input key={idx} type="email" value={email} onChange={e => {
              const list = [...invites];
              list[idx] = e.target.value;
              setInvites(list);
            }} placeholder="email@example.com" />
          ))}
        </label>
        <button type="button" onClick={() => setInvites([...invites, ''])}>+ Add another</button>

        {error && <p className="error">{error}</p>}

        <button type="submit">Finish Setup</button>
      </form>
    </div>
  );
}