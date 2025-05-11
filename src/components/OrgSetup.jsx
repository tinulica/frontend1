import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { setupOrganization } from '../services/api';
import './OrgSetup.css';

export default function OrgSetup() {
  const navigate = useNavigate();
  const { token, refreshUser } = useContext(AuthContext);

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
        invites: addUserEmails.filter(e => e.trim())
      });

      if (res.data.success) {
        await refreshUser?.();
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to complete organization setup.');
    }
  };

  return (
    <div className="org-setup-container">
      <div className="org-setup-card">
        <div className="step-indicator">
          <div className={step >= 1 ? 'active' : ''}>1</div>
          <div className={step >= 2 ? 'active' : ''}>2</div>
          <div className={step === 3 ? 'active' : ''}>3</div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="step">
              <h2>Step 1: Organization Info</h2>
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
                Organization Bio
                <textarea
                  value={orgBio}
                  onChange={e => setOrgBio(e.target.value)}
                  placeholder="Tell us about your team or company"
                />
              </label>
              <button type="button" className="btn-primary" onClick={() => setStep(2)}>Next</button>
            </div>
          )}

          {step === 2 && (
            <div className="step">
              <h2>Step 2: Invite Team Members</h2>
              {addUserEmails.map((email, index) => (
                <input
                  key={index}
                  type="email"
                  value={email}
                  onChange={e => handleEmailChange(index, e.target.value)}
                  placeholder="user@example.com"
                />
              ))}
              <button type="button" className="btn-secondary" onClick={addMoreEmails}>Add another</button>
              <div className="step-buttons">
                <button type="button" className="btn-secondary" onClick={() => setStep(1)}>Back</button>
                <button type="button" className="btn-primary" onClick={() => setStep(3)}>Next</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step">
              <h2>Step 3: Confirm & Submit</h2>
              <p><strong>Org Name:</strong> {orgName}</p>
              <p><strong>Bio:</strong> {orgBio}</p>
              <p><strong>Invites:</strong></p>
              <ul>
                {addUserEmails.filter(e => e.trim()).map((email, i) => (
                  <li key={i}>{email}</li>
                ))}
              </ul>
              {error && <p className="error-message">{error}</p>}
              <div className="step-buttons">
                <button type="button" className="btn-secondary" onClick={() => setStep(2)}>Back</button>
                <button type="submit" className="btn-primary">Submit & Continue</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
