'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      await api.register({ name: form.name, email: form.email, password: form.password });
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: '0 16px' }}>
      <div className="card">
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>Register</h2>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>Create a new account</p>

        <form onSubmit={handleSubmit}>
          <label className="label">Full Name</label>
          <input className="input" type="text" placeholder="Tung tung" required value={form.name} onChange={set('name')} />

          <label className="label">Email</label>
          <input className="input" type="email" placeholder="you@email.com" required value={form.email} onChange={set('email')} />

          <label className="label">Password</label>
          <input className="input" type="password" placeholder="••••••••" required value={form.password} onChange={set('password')} />

          <label className="label">Confirm Password</label>
          <input className="input" type="password" placeholder="••••••••" required value={form.confirmPassword} onChange={set('confirmPassword')} />

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: '#555' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#2563eb' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
}
