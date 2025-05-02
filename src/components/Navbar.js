import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">Glovo HR</Link>

      {user ? (
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/entries">Entries</Link>
          <button onClick={logout} className="nav-logout">Logout</button>
        </div>
      ) : (
        <div className="nav-links">
          <Link to="/auth" className="nav-start">Get Started</Link>
        </div>
      )}
    </nav>
  );
}
