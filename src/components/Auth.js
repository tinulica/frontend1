// src/components/Auth.js
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as apiRegister, login as apiLogin } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

export default function Auth({ mode }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);
  const navigate = useNavigate();
  const { login: contextLogin, register: contextRegister } = useContext(AuthContext);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (mode === 'register') {
        const { data } = await apiRegister({ fullName, email, password });
        const { token, user } = data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        contextRegister(fullName, email, password); // updates context and redirects
      } else {
        const { data } = await apiLogin({ email, password });
        const { token, user } = data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        contextLogin(email, password); // updates context and redirects
      }
    } catch (err) {
      const status = err.response?.status;
      const serverMsg = err.response?.data?.message;

      if (mode === 'register') {
        if (status === 409 || serverMsg === 'User already exists') {
          setError('That email is already registered. Please log in instead.');
        } else if (status === 400) {
          setError('Invalid input. Please check your details and try again.');
        } else {
          setError(serverMsg || 'Registration failed. Please try again later.');
        }
      } else {
        if (status === 400 || serverMsg === 'Invalid credentials') {
          setError('Email or password is incorrect.');
        } else if (status === 404) {
          setError('User not found. Please register first.');
        } else {
          setError(serverMsg || 'Login failed. Please try again later.');
        }
      }
    }
  };

  return (
    <main className="auth-container">
      <h2>{mode === 'register' ? 'Register' : 'Login'}</h2>
      <form onSubmit={onSubmit}>
        {mode === 'register' && (
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-message" role="alert">{error}</p>}

        <button type="submit" className="submit-button">
          {mode === 'register' ? 'Register' : 'Login'}
        </button>
      </form>
    </main>
  );
}
