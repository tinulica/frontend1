import React, { useState, useContext, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, User, Home, FileText, BarChart2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-logo">
        <div className="logo-placeholder">L</div>
        <span className="logo-text">Ledgerix</span>
      </div>

      {/* Nav links with icons */}
      <div className="navbar-menu">
        <NavLink to="/dashboard" className="nav-item">
          <Home size={16} className="nav-icon" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/entries" className="nav-item">
          <FileText size={16} className="nav-icon" />
          <span>Entries</span>
        </NavLink>
        <NavLink to="/reports" className="nav-item">
          <BarChart2 size={16} className="nav-icon" />
          <span>Reports</span>
        </NavLink>
      </div>

      {/* Search & icons & user */}
      <div className="navbar-actions">
        <div className="search-box">
          <Search size={16} />
          <input type="text" placeholder="Search..." />
        </div>
        <button className="icon-btn"><Bell size={20} /></button>
        <button className="icon-btn"><Settings size={20} /></button>

        <div className="user-menu" ref={menuRef}>
          <button
            className="avatar-btn"
            onClick={() => setMenuOpen(o => !o)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <User size={20} />
          </button>
          {menuOpen && (
            <div className="dropdown-menu">
              {user ? (
                <>
                  <div className="dropdown-item" onClick={() => navigate('/profile')}>Profile</div>
                  <div className="dropdown-item" onClick={logout}>Logout</div>
                </>
              ) : (
                <>
                  <div className="dropdown-item" onClick={() => navigate('/login')}>Login</div>
                  <div className="dropdown-item" onClick={() => navigate('/register')}>Register</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
