import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav>
      <Link to="/">Home</Link>
      {user ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/entries">Entries</Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/auth" className="get-started-button">Get Started</Link>
      )}
    </nav>
}
