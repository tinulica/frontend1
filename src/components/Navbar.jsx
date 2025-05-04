// src/components/Navbar.jsx
import React, { useState, useContext, useRef, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { io } from 'socket.io-client'
import {
  Search,
  Bell,
  Settings,
  User,
  Home,
  FileText,
  BarChart2
} from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const navigate         = useNavigate()
  const location         = useLocation()
  const [menuOpen, setMenuOpen]           = useState(false)
  const [notifications, setNotifications] = useState(0)
  const menuRef         = useRef()

  useEffect(() => {
    // close dropdown on outside click
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => {
    if (!user) return
    const socket = io(process.env.REACT_APP_API_URL, {
      auth: { token: localStorage.getItem('token') }
    })
    // join our personal room
    socket.emit('joinRoom', user.id)
    // listen for invitationAccepted
    socket.on('invitationAccepted', () => {
      setNotifications(n => n + 1)
    })
    return () => {
      socket.disconnect()
    }
  }, [user])

  const handleBellClick = () => {
    // clear notifications and navigate to invitations page
    setNotifications(0)
    navigate('/dashboard') // or wherever you show invitation status
  }

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-logo" onClick={() => navigate('/dashboard')}>
        <div className="logo-placeholder">L</div>
        <span className="logo-text">Ledgerix</span>
      </div>

      {/* Main menu */}
      <div className="navbar-menu">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `nav-item${isActive ? ' active' : ''}`
          }
        >
          <Home size={16} className="nav-icon" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/entries"
          className={({ isActive }) =>
            `nav-item${isActive ? ' active' : ''}`
          }
        >
          <FileText size={16} className="nav-icon" />
          <span>Entries</span>
        </NavLink>
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `nav-item${isActive ? ' active' : ''}`
          }
        >
          <BarChart2 size={16} className="nav-icon" />
          <span>Reports</span>
        </NavLink>
      </div>

      {/* Search / Icons / User */}
      <div className="navbar-actions">
        <div className="search-box">
          <Search size={16} />
          <input type="text" placeholder="Search..." />
        </div>

        <button
          className="icon-btn notification-btn"
          onClick={handleBellClick}
          aria-label="Notifications"
        >
          <Bell size={20} />
          {notifications > 0 && (
            <span className="notification-badge">{notifications}</span>
          )}
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
              <div
                className="dropdown-item"
                onClick={() => {
                  setMenuOpen(false)
                  navigate('/profile')
                }}
              >
                Profile
              </div>
              <div
                className="dropdown-item"
                onClick={() => {
                  logout()
                  setMenuOpen(false)
                }}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
