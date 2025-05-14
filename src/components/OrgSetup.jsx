import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDisplayOrgName, setDisplayOrgName } from '../services/api';
import { getAuth } from '../utils/auth';

export default function OrgSetup() {
  const navigate = useNavigate();
  const hasChecked = useRef(false); // ✅ Prevent repeated requests
  const [name, setName] = useState('');
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasChecked.current) return; // ✅ Avoid re-running
    hasChecked.current = true;

    const checkSetup = async () => {
      const auth = getAuth();
      if (!auth?.token) {
        navigate('/login');
        return;
      }

      try {
        const res = await getDisplayOrgName();
        if (res.data.displayOrgName) {
          navigate('/dashboard');
        } else {
          setChecking(false); // Show form
        }
      } catch (err) {
        navigate('/login');
      }
    };

    checkSetup();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await setDisplayOrgName({ name });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (checking) return <p>Loading organization info...</p>;

  return (
    <div className="org-setup-page">
      <h2>Set your Organization Display Name</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Display Name (e.g. HR Tazz Cluj)"
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Continue to Dashboard'}
        </button>
      </form>
    </div>
  );
}
