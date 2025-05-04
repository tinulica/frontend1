// src/components/Navbar.jsx
import React, { useState, useContext, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import {
  Search,
  Bell,
  Settings,
  User,
  Home,
  FileText,
  BarChart2,
  Trash2,
} from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const navigate         = useNavigate()
  const menuRef          = useRef()
  const notifRef         = useRef()

  const [menuOpen, setMenuOpen]     = useState(false)
  const [notifOpen, setNotifOpen]   = useState(false)
  const [notifications, setNotifications] = useState([])

  // close ANY dropdown on outside click
  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  // connect socket, join room, listen for accept events
  useEffect(() => {
    if (!user) return
    const socket = io(process.env.REACT_APP_API_URL, {
      auth: { token: localStorage.getItem('token') }
    })
    socket.emit('joinRoom', user.id)
    socket.on('invitationAccepted', payload => {
      setNotifications(n => [
        { ...payload, id: payload.invitationId },
        ...n
      ])
    })
    return () => socket.disconnect()
  }, [user])

  const handleBellClick = () => {
    setNotifOpen(o => !o)
    setMenuOpen(false)
  }

  const clearOne = id => {
    setNotifications(n => n.filter(x => x.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
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

      {/* Search / Icons / User */}
      <div className="navbar-actions">
        <div className="search-box">
          <Search size={16} />
          <input type="text" placeholder="Search..." />
        </div>

        <div className="notifications" ref={notifRef}>
          <button
            className="icon-btn notification-btn"
            onClick={handleBellClick}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="notification-badge">
                {notifications.length}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="notifications-dropdown">
              <div className="notif-header">
                <span>Notifications</span>
                {notifications.length > 0 && (
                  <button
                    className="clear-all"
                    onClick={clearAll}
                    title="Clear all"
                  >
                    <Trash2 size={14}/>
                  </button>
                )}
              </div>
              {notifications.length === 0
                ? <div className="notif-empty">No new notifications</div>
                : notifications.map(n => (
                  <div key={n.id} className="notif-item">
                    <div className="notif-text">
                      {n.invitedEmail
                        ? `${n.invitedEmail} accepted your invite`
                        : 'Notification'}
                    </div>
                    <button
                      className="notif-clear"
                      onClick={() => clearOne(n.id)}
                      title="Dismiss"
                    >
                      ×
                    </button>
                  </div>
                ))
              }
            </div>
          )}
        </div>

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
