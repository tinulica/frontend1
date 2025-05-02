import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/">Profile</Link></li>
        {/* add more links here */}
      </ul>
    </aside>
  );
}
