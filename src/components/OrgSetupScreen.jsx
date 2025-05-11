import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function OrgSetupScreen({ token }) {
  const [orgName, setOrgName] = useState('');
  const [orgBio, setOrgBio] = useState('');
  const [users, setUsers] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleUserChange = (i, value) => {
    const updated = [...users];
    updated[i] = value;
    setUsers(updated);
  };

  const addUserField = () => setUsers([...users, '']);

  const submitSetup = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        '/api/organization/setup',
        { name: orgName, bio: orgBio, invites: users.filter(u => u.trim()) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setup-container">
      <h2>Set Up Your Organization</h2>
      <label>Organization Name<input value={orgName} onChange={e => setOrgName(e.target.value)} /></label>
      <label>Organization Bio<textarea value={orgBio} onChange={e => setOrgBio(e.target.value)} /></label>

      <h4>Invite Users</h4>
      {users.map((u, i) => (
        <input
          key={i}
          placeholder="user@example.com"
          value={u}
          onChange={e => handleUserChange(i, e.target.value)}
        />
      ))}
      <button type="button" onClick={addUserField}>+ Add Another</button>

      {error && <p className="error-msg">{error}</p>}
      <button className="btn-primary" disabled={loading} onClick={submitSetup}>
        {loading ? 'Saving...' : 'Finish Setup'}
      </button>
    </div>
  );
}
