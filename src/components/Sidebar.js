import { NavLink } from 'react-router-dom';
export default function Sidebar() {
  return (
    <div className="sidebar">
      <NavLink to="/dashboard" end>Dashboard</NavLink>
      <NavLink to="/dashboard/entries">Entries</NavLink>
      <button onClick={() => { localStorage.removeItem('token'); window.location='/'; }}>Log Out</button>
    </div>
  );
}
