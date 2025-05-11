import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { setupOrganization } from '../services/api';
import './OrgSetup.css';

export default function OrgSetup() {
  const navigate = useNavigate();
  const { token, refreshUser } = useContext(AuthContext);

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
    <div className="org-setup-wrapper">
      <div className="org-stepper">
        <div className="step active">1</div>
        <div className="step">2</div>
        <div className="step">3</div>
      </div>
      <div className="org-setup-card">
        <h2 className="org-title">Complete Your Organization Setup</h2>
        <form onSubmit={handleSubmit} className="org-form">
          <div className="form-group">
            <label>Organization Name</label>
            <input
              type="text"
              value={orgName}
              onChange={e => setOrgName(e.target.value)}
              required
              placeholder="e.g. Glovo HR Team"
            />
          </div>

          <div className="form-group">
            <label>Organization Bio</label>
            <textarea
              value={orgBio}
              onChange={e => setOrgBio(e.target.value)}
              placeholder="Tell us about your team or company"
            />
          </div>

          <div className="form-group">
            <label>Invite Other Users</label>
            {Array.isArray(addUserEmails) && addUserEmails.map((email, index) => (
              <input
                key={index}
                type="email"
                value={email}
                onChange={e => handleEmailChange(index, e.target.value)}
                placeholder="user@example.com"
              />
            ))}
            <button type="button" className="btn-secondary" onClick={addMoreEmails}>
              + Add another
            </button>
          </div>

          {error && <p className="org-error-message">{error}</p>}

          <button type="submit" className="btn-primary">Submit & Continue</button>
        </form>
      </div>
    </div>
  );
}
