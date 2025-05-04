import React, { useState, useContext, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.svg';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // close user dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <nav className="navbar">
      {/* Logo + Brand */}
      <div className="navbar-logo">
        <img src={logo} alt="Ledgerix Logo" />
        <span className="logo-text">Ledgerix</span>
      </div>

      {/* Main menu */}
      <div className="navbar-menu">
        <NavLink to="/dashboard"    className="nav-item">Dashboard</NavLink>
        <NavLink to="/entries"      className="nav-item">Entries</NavLink>
        <NavLink to="/reports"      className="nav-item">Reports</NavLink>
      </div>

      {/* Actions: search, icons, user */}
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
                  <div className="dropdown-item" onClick={() => navigate('/profile')}>
                    Profile
                  </div>
                  <div className="dropdown-item" onClick={logout}>
                    Logout
                  </div>
                </>
              ) : (
                <>
                  <div className="dropdown-item" onClick={() => navigate('/login')}>
                    Login
                  </div>
                  <div className="dropdown-item" onClick={() => navigate('/register')}>
                    Register
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
