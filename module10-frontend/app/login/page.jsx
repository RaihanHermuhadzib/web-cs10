'use client';
import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = await api.login(form);
      login(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: '0 16px' }}>
      <div className="card">
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>Login</h2>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>Welcome back to ShopHub</p>

        <form onSubmit={handleSubmit}>
          <label className="label">Email</label>
          <input className="input" type="email" placeholder="you@email.com" required
            value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />

          <label className="label">Password</label>
          <input className="input" type="password" placeholder="••••••••" required
            value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />

          {error && <p className="error">{error}</p>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: '#555' }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: '#2563eb' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}
