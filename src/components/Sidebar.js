import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside>
      <nav>
        <ul>
          <li><Link to="/dashboard">Overview</Link></li>
          <li><Link to="/entries">Entries</Link></li>
          <li><Link to="/import-sessions">Imports</Link></li>
        </ul>
      </nav>
    </aside>
  );
}
