import React from 'react';
import { logout, getAuth } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = getAuth();
  const nav      = useNavigate();

  const onLogout = () => {
    logout();
    nav('/login');
  };

  return (
    <div className="container">
      <h1>Welcome, {user.fullName}!</h1>
      <p>Your email: {user.email}</p>
      <p>Your organization ID: {user.organizationId}</p>
      <button onClick={onLogout}>Log Out</button>
    </div>
  );
}
