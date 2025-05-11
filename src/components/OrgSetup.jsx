// src/components/OrgSetup.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { setupOrganization } from '../services/api';
import './OrgSetup.css';

export default function OrgSetup() {
  const navigate = useNavigate();
  const { refreshUser } = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [orgName, setOrgName] = useState('');
  const [orgBio, setOrgBio] = useState('');
  const [addUserEmails, setAddUserEmails] = useState(['']);
  const [error, setError] = useState(null);

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
      const res = await setupOrganization({
        name: orgName,
        bio: orgBio,
        invites: addUserEmails.filter((e) => e.trim()),
      });

      if (res.data.success) {
        await refreshUser?.();
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete organization setup.');
    }
  };

  return (
    <div className="org-setup-wrapper">
      <div className="org-setup-box">
        <h2 className="org-setup-title">Setup Your Organization</h2>

        <div className="stepper">
          <div className={`step ${step === 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-title">Organization</div>
          </div>
          <div className={`step ${step === 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-title">Invite Users</div>
          </div>
        </div>

        <form className="org-setup-form" onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <label>
                Organization Name
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  required
                />
              </label>

              <label>
                Organization Bio
                <textarea
                  value={orgBio}
                  onChange={(e) => setOrgBio(e.target.value)}
                  placeholder="Tell us about your team or company"
                />
              </label>
            </>
          )}

          {step === 2 && (
            <>
              <h4>Invite Other Users</h4>
              {addUserEmails.map((email, index) => (
                <input
                  key={index}
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  placeholder="user@example.com"
                />
              ))}
              <button type="button" className="btn-secondary" onClick={addMoreEmails}>
                Add another
              </button>
            </>
          )}

          {error && <p className="error-message">{error}</p>}

          <div className="org-setup-buttons">
            {step > 1 && (
              <button type="button" className="btn-secondary" onClick={() => setStep(step - 1)}>
                Back
              </button>
            )}
            {step < 2 ? (
              <button type="button" className="btn-primary" onClick={() => setStep(step + 1)}>
                Next
              </button>
            ) : (
              <button type="submit" className="btn-primary">
                Submit & Continue
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
