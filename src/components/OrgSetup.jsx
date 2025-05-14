// src/pages/OrgSetup.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDisplayOrgName, setDisplayOrgName } from '../services/api';

export default function OrgSetup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true); // initial loading while checking
  const [error, setError] = useState('');

  // ✅ Check if user already has a display name
  useEffect(() => {
    getDisplayOrgName()
      .then(res => {
        if (res.data.displayOrgName) {
          navigate('/dashboard'); // 👈 auto-redirect if already named
        } else {
          setLoading(false); // show form
        }
      })
      .catch(() => {
        navigate('/login'); // 👈 token expired or invalid
      });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await setDisplayOrgName({ name });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="org-setup-page">
      <h2>Name Your Organization</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Display Name
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ex: HR - Tazz Oradea"
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Continue to Dashboard</button>
      </form>
    </div>
  );
}
