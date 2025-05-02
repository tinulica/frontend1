import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, login } from '../services/api';

export default function Auth({ mode }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const fn = mode === 'register' ? register : login;
      const { data } = await fn({ fullName, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <main>
      <h2>{mode === 'register' ? 'Register' : 'Login'}</h2>
      <form onSubmit={onSubmit}>
        {mode === 'register' && (
          <input
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        )}
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{mode}</button>
      </form>
    </main>
  );
}
