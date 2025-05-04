import React, { useState, useContext, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, User } from 'lucide-react';
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

  const goTo = path => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Brand: replace this <span> with an <img> once you add src/assets/logo.svg */}
        <button className="logo-btn" onClick={() => navigate('/')}>
          <span className="brand">Glovo HR</span>
        </button>

        <div className="nav-links">
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
          <NavLink to="/dashboard" className="nav-link">
            Dashboard
          </NavLink>
          <NavLink to="/entries" className="nav-link">
            Entries
          </NavLink>
        </div>

        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search…"
            className="search-input"
            onFocus={() => navigate('/entries')}
          />
        </div>
      </div>

      <div className="navbar-right">
        <button className="icon-btn">
          <Bell size={20} />
        </button>
        <button className="icon-btn">
          <Settings size={20} />
        </button>

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
                   <div className="dropdown-item" onClick={() => goTo('/profile')}>
                    Profile
                  </div>
                  <div className="dropdown-item" onClick={() => logout()}>
                    Logout
                  </div>
                </>
              ) : (
                <>
                  <div className="dropdown-item" onClick={() => goTo('/auth?mode=login')}>
                    Login
                  </div>
                  <div className="dropdown-item" onClick={() => goTo('/auth?mode=register')}>
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
