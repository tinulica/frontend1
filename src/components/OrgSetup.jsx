// src/pages/OrgSetup.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setDisplayOrgName, getDisplayOrgName } from '../services/api';

export default function OrgSetup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getDisplayOrgName().then(res => {
      if (res.data.displayOrgName) {
        navigate('/dashboard'); // already set, skip setup
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDisplayOrgName({ name });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save name');
    }
  };

  return (
    <div className="container">
      <h2>Name Your Organization</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Display Name:
          <input value={name} onChange={e => setName(e.target.value)} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}
