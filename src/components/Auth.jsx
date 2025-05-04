// src/components/Auth.jsx
import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

export default function Auth({ mode: initialMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useContext(AuthContext);

  const [mode, setMode] = useState(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [inviteToken, setInviteToken] = useState('');
  const [error, setError]       = useState(null);
  const [info, setInfo]         = useState('');

  // On mount: read query for ?token=... and any state.success message
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token  = params.get('token');
    if (token) {
      setInviteToken(token);
      setMode('register');
    }
    if (location.state?.success) {
      setInfo(location.state.success);
    }
  }, [location]);

  const onSubmit = async e => {
    e.preventDefault();
    setError(null);
    setInfo('');

    try {
      if (mode === 'register') {
        await register({ fullName, email, password, inviteToken });
        if (inviteToken) {
          // After accepting an invite, send user to login
          navigate('/login', {
            state: { success: 'Registration successful! Please log in.' }
          });
        }
      } else {
        await login({ email, password });
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
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
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-message" role="alert">{error}</p>}

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
              onClick={() => {
                setMode('login');
                setError(null);
                navigate('/login');
              }}
            >
              Sign In
            </button>
          </>
        ) : (
          <>
            Don’t have an account?{' '}
            <button
              className="switch-btn"
              onClick={() => {
                setMode('register');
                setError(null);
                navigate('/register');
              }}
            >
              Register
            </button>
          </>
        )}
      </div>
    </main>
  );
}
