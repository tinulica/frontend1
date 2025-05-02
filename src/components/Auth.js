import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, login } from '../services/api';

export default function Auth({ mode }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);  // reset previous errors

    try {
      const fn = mode === 'register' ? register : login;
      const { data } = await fn({ fullName, email, password });
      // on successful register/login:
      localStorage.setItem('token',    data.token);
      localStorage.setItem('user',     JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      // If the server provided a JSON error message, read it:
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message;

      if (status === 409) {
        setError('That email is already registered. Please log in or use another address.');
      } else if (status === 400) {
        setError('Invalid credentials—please check your email and password.');
      } else {
        setError('Something went wrong. Please try again later.');
      }
    }
  };

  return (
    <main>
      <h2>{mode === 'register' ? 'Register' : 'Login'}</h2>
      <form onSubmit={onSubmit}>
        {mode === 'register' && (
          <div>
            <label>Full Name</label>
            <input
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label>Email</label>
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">{mode === 'register' ? 'Register' : 'Login'}</button>
      </form>
    </main>
  );
}
