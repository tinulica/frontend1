// src/pages/OrgSetup.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateDisplayOrgName, getCurrentUser } from '../services/api';

export default function OrgSetup() {
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser()
      .then(({ data }) => {
        if (data.user.displayOrgName) {
          navigate('/dashboard');
        } else {
          setLoading(false);
        }
      })
      .catch(() => navigate('/login'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orgName.trim()) return;
    try {
      await updateDisplayOrgName({ displayOrgName: orgName.trim() });
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to set organization name:', err);
    }
  };

  if (loading) return <div>Loading organization info...</div>;

  return (
    <div className="org-setup-page">
      <form onSubmit={handleSubmit}>
        <h2>Name your organization</h2>
        <input
          type="text"
          placeholder="Display Name"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          required
        />
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}