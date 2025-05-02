// src/components/Home.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Home.css';

export default function Home() {
  // allow override mode via query param, but Home just links
  return (
    <div className="home-hero">
      <div className="home-content">
        <h1>Welcome to Glovo HR</h1>
        <p>Your centralized hub for HR management—
           manage employees, payroll, and more with ease.</p>
        <div className="home-buttons">
          <Link to="/auth?mode=login" className="btn btn-primary">
            Login
          </Link>
          <Link to="/auth?mode=register" className="btn btn-secondary">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
