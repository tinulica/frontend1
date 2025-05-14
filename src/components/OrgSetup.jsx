import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateDisplayOrgName, getCurrentUser } from '../services/api';

export default function OrgSetup() {
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
    if (!orgName.trim()) return setError('Name is required');
    try {
      await updateDisplayOrgName({ displayOrgName: orgName.trim() });
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to set organization name:', err);
      setError('Could not save name. Try again.');
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
        {error && <p className="error">{error}</p>}
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}