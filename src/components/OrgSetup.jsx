// src/pages/OrgSetup.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDisplayOrgName, setDisplayOrgName } from '../services/api';

export default function OrgSetup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-redirect if display name already set
  useEffect(() => {
    getDisplayOrgName()
      .then(res => {
        if (res.data.displayOrgName) {
          navigate('/dashboard'); // already named
        }
      })
      .catch(() => {
        // ignore errors here
      });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await setDisplayOrgName({ name });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="org-setup-container">
      <h2>Welcome! Name your organization</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Display Name:
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ex: Glovo HR Iași"
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Continue to Dashboard'}
        </button>
      </form>
    </div>
  );
}
