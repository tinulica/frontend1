import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './OrgSetup.css';

export default function OrgSetup() {
  const navigate = useNavigate();
  const { token, refreshUser } = useContext(AuthContext);

  const [orgName, setOrgName] = useState('');
  const [orgBio, setOrgBio] = useState('');
  const [addUserEmails, setAddUserEmails] = useState(['']);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleEmailChange = (index, value) => {
    const updated = [...addUserEmails];
    updated[index] = value;
    setAddUserEmails(updated);
  };

  const addMoreEmails = () => {
    setAddUserEmails([...addUserEmails, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post('/api/organizations/setup', {
        name: orgName,
        bio: orgBio,
        invites: addUserEmails.filter(e => e.trim())
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        await refreshUser();
        setSuccess(true);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create organization');
    }
  };

  return (
    <div className="org-setup-container">
      <div className="org-setup-card">
        <h2>Complete Your Organization Setup</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Organization Name
            <input value={orgName} onChange={e => setOrgName(e.target.value)} required />
          </label>

          <label>
            Organization Bio
            <textarea value={orgBio} onChange={e => setOrgBio(e.target.value)} />
          </label>

          <h4>Invite Other Users</h4>
          {addUserEmails.map((email, index) => (
            <input
              key={index}
              value={email}
              onChange={e => handleEmailChange(index, e.target.value)}
              placeholder="user@example.com"
            />
          ))}
          <button type="button" className="btn-secondary" onClick={addMoreEmails}>Add another</button>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="btn-primary">Submit & Continue</button>
        </form>
      </div>
    </div>
  );
}
