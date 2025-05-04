import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

export default function Auth({ mode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useContext(AuthContext);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteToken, setInviteToken] = useState('');
  const [error, setError] = useState(null);
  const [info, setInfo] = useState('');

  // Pre-fill invite token or info messages
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      setInviteToken(token);
      // Force to register view if coming via invite
      if (mode !== 'register') {
        navigate('/register', { replace: true });
      }
    }
    if (location.state?.success) {
      setInfo(location.state.success);
    }
  }, [location, mode, navigate]);

  const onSubmit = async e => {
    e.preventDefault();
    setError(null);
    setInfo('');

    try {
      if (mode === 'register') {
        await register({ fullName, email, password, inviteToken });
        // After invite registration, redirect to login
        if (inviteToken) {
          navigate('/login', {
            state: { success: 'Registration successful! Please log in.' }
          });
        }
      } else {
        await login({ email, password });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="auth-container">
      <h2>{mode === 'register' ? 'Create an Account' : 'Welcome Back'}</h2>
      {info && <p className="info-message">{info}</p>}

      <form onSubmit={onSubmit}>
        {mode === 'register' && (
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Your full name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="submit-button">
          {mode === 'register' ? 'Register' : 'Login'}
        </button>
      </form>

      <div className="auth-footer">
        {mode === 'register' ? (
          <>
            Already have an account?{' '}
            <button
              className="switch-btn"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          </>
        ) : (
          <>
            Don’t have an account?{' '}
            <button
              className="switch-btn"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
          </>
        )}
      </div>
    </main>
  );
}
