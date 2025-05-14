import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupOrganization } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './OrgSetup.css';

export default function OrgSetup() {
  const navigate = useNavigate();
  const { refreshUser } = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [orgName, setOrgName] = useState('');
  const [orgBio, setOrgBio] = useState('');
  const [invites, setInvites] = useState(['']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInviteChange = (index, value) => {
    const updated = [...invites];
    updated[index] = value;
    setInvites(updated);
  };

  const addInviteField = () => setInvites([...invites, '']);
  const prevStep = () => setStep(prev => prev - 1);
  const nextStep = () => setStep(prev => prev + 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await setupOrganization({
        name: orgName,
        bio: orgBio,
        invites: invites.filter(email => email.trim()),
      });

      console.log('✅ API response:', res.data);

      if (res.data.success) {
        try {
          if (refreshUser) await refreshUser();
        } catch (err) {
          console.warn('⚠️ refreshUser failed:', err);
        }
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('❌ Submission failed:', err);
      setError(err.response?.data?.message || 'Failed to complete organization setup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="org-setup-wrapper">
      <div className="org-setup-card">
        <div className="step-indicator">
          <div className={`step ${step === 1 ? 'active' : ''}`}>
            <span>1</span> Organization Info
          </div>
          <div className={`step ${step === 2 ? 'active' : ''}`}>
            <span>2</span> Invite Users
          </div>
        </div>

        {/* Step 1: Org Info */}
        {step === 1 && (
          <div className="org-form">
            <h2>Tell us about your organization</h2>
            <label>
              Organization Name
              <input
                type="text"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                required
              />
            </label>
            <label>
              Short Bio (optional)
              <textarea
                value={orgBio}
                onChange={e => setOrgBio(e.target.value)}
                placeholder="What does your team do?"
              />
            </label>
            <div className="actions">
              <button type="button" className="btn next" onClick={nextStep}>
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Invites + Final Submit */}
        {step === 2 && (
          <form className="org-form" onSubmit={handleSubmit}>
            <h2>Invite team members</h2>
            {invites.map((email, idx) => (
              <input
                key={idx}
                type="email"
                value={email}
                onChange={e => handleInviteChange(idx, e.target.value)}
                placeholder="user@example.com"
              />
            ))}
            <button type="button" className="btn add-btn" onClick={addInviteField}>
              + Add Another
            </button>

            {error && <p className="error">{error}</p>}

            <div className="actions">
              <button type="button" className="btn back" onClick={prevStep}>
                Back
              </button>
              <button type="submit" className="btn submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Finish Setup'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
