// src/components/OrgSetup.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, updateDisplayOrgName } from '../services/api';

export default function OrgSetup() {
  const navigate = useNavigate();
  const [displayOrgName, setDisplayOrgName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch user info and redirect if already completed
  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await getCurrentUser();
        if (data.user.hasCompletedSetup) {
          navigate('/dashboard');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error loading user info:', err);
        navigate('/login');
      }
    }

    fetchUser();
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!displayOrgName.trim()) {
      setError('Please enter a name');
      setSubmitting(false);
      return;
    }

    try {
      await updateDisplayOrgName({ displayOrgName });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="setup-container">Loading organization info...</div>;
  }

  return (
    <div className="setup-container">
      <form className="setup-form" onSubmit={handleSubmit}>
        <h2>Name Your Organization</h2>
        <input
          type="text"
          placeholder="e.g. Dare Academy Romania"
          value={displayOrgName}
          onChange={e => setDisplayOrgName(e.target.value)}
        />
        {error && <p className="error-msg">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save and Continue'}
        </button>
      </form>
    </div>
  );
}