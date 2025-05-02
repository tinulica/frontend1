// Home.jsx
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="home-title">Welcome to Glovo HR</h1>
        <p className="home-subtitle">
          Securely manage your team’s payroll, workflows, and more—all in one place.
        </p>
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
