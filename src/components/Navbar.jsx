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

  // Close dropdown on outside click
  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleAvatarClick = () => {
    setMenuOpen(o => !o);
  };

  const goTo = path => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* ... brand, search, links as before ... */}
      </div>

      <div className="navbar-right">
        <button className="icon-btn"><Bell size={20} /></button>
        <button className="icon-btn"><Settings size={20} /></button>

        <div className="user-menu" ref={menuRef}>
          <button
            className="avatar-btn"
            onClick={handleAvatarClick}
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
                  <div className="dropdown-item" onClick={() => { logout(); }}>
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
