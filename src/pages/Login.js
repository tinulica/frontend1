import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const nav = useNavigate();
  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };
  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      nav('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed');
    }
  };
  return (
    <div style={{padding:20}}>
      <h2>Log In</h2>
      <form onSubmit={submit}>
        <div><label>Email</label><input name="email" onChange={handle} value={form.email} /></div>
        <div><label>Password</label><input name="password" type="password" onChange={handle} value={form.password} /></div>
        {error && <div style={{color:'red'}}>{error}</div>}
        <button type="submit">Log In</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
}
