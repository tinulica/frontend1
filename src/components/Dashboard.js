import React, { useEffect, useState } from 'react';
import api     from '../services/api';
import Navbar  from './Navbar';
import Sidebar from './Sidebar';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUser(res.data.user))
      .catch(() => { /* could redirect */ });
  }, []);

  if (!user) return <div className="container">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="content">
          <h1>Welcome, {user.fullName}</h1>
          <p>Your organization ID: {user.organizationId}</p>
        </main>
      </div>
    </>
  );
}
