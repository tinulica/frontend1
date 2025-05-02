import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Bell, Settings, User } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="brand">
          <img src="/logo.png" alt="Logo" className="logo" />
          <span className="app-name">Glovo HR</span>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
          />
          <Search size={16} className="search-icon" />
        </div>
        <ul className="nav-links">
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/entries" className={({ isActive }) => isActive ? 'active' : ''}>
              Entries
            </NavLink>
          </li>
          <li>
            <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>
              Reports
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="navbar-right">
        <button className="icon-btn"><Bell size={20} /></button>
        <button className="icon-btn"><Settings size={20} /></button>
        <button className="avatar-btn"><User size={20} /></button>
      </div>
    </nav>
  );
}
