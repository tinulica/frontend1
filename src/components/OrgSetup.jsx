import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDisplayOrgName, setDisplayOrgName } from '../services/api';
import { getAuth } from '../utils/auth';

export default function OrgSetup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [checking, setChecking] = useState(true); // for initial check
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Check auth and existing display name
  useEffect(() => {
    const checkSetup = async () => {
      const auth = getAuth();
      if (!auth?.token) {
        navigate('/login'); // no token
        return;
      }

      try {
        const res = await getDisplayOrgName();
        if (res.data.displayOrgName) {
          navigate('/dashboard'); // ✅ already set
        } else {
          setChecking(false); // show form
        }
      } catch (err) {
        console.error('Display name check failed:', err);
        navigate('/login'); // invalid token, fail safe
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
