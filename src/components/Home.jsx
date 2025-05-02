// src/components/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <section className="hero">
      <h1>Welcome to Glovo HR</h1>
      <p>Streamline your payroll and employee management with our intuitive platform. Sign in to access your dashboard or register to get started.</p>
      <div className="buttons">
        <Link to="/auth?mode=login" className="btn">Login</Link>
        <Link to="/auth?mode=register" className="btn">Register</Link>
      </div>
    </section>
  );
}
