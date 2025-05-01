import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const [form, setForm] = useState({ email:'', password:'', fullName:'' });
  const [error, setError] = useState('');
  const nav = useNavigate();
  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };
  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      nav('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed');
    }
  };
  return (
    <div style={{padding:20}}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <div><label>Full Name</label><input name="fullName" onChange={handle} value={form.fullName} /></div>
        <div><label>Email</label><input name="email" onChange={handle} value={form.email} /></div>
        <div><label>Password</label><input name="password" type="password" onChange={handle} value={form.password} /></div>
        {error && <div style={{color:'red'}}>{error}</div>}
        <button type="submit">Sign Up</button>
      </form>
      <p>Have an account? <Link to="/">Log In</Link></p>
    </div>
  );
}
