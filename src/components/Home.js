import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container">
      <h1>Glovo HR App</h1>
      <nav>
        <Link to="/login">Log In</Link>
        <Link to="/register">Register</Link>
      </nav>
    </div>
  );
}
