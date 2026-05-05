'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, isAuth } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuth) { router.push('/login'); return; }
    if (user) setForm(p => ({ ...p, name: user.name || '', email: user.email || '' }));
  }, [isAuth, user, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    const body = { name: form.name, email: form.email };
    if (form.password) body.password = form.password;
    try {
      await api.updateProfile(body);
      setSuccess('Profile updated!');
      setForm(p => ({ ...p, password: '' }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div style={{ maxWidth: 400, margin: '24px auto', padding: '0 16px' }}>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p style={{ fontWeight: 'bold', fontSize: '16px' }}>My Profile</p>
            <p style={{ fontSize: '13px', color: '#888' }}>{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="label">Full Name</label>
          <input className="input" type="text" value={form.name} onChange={set('name')} />

          <label className="label">Email</label>
          <input className="input" type="email" value={form.email} onChange={set('email')} />

          <label className="label">New Password</label>
          <input className="input" type="password" placeholder="Leave blank to keep current" value={form.password} onChange={set('password')} />
          <p style={{ fontSize: '12px', color: '#888', marginBottom: '12px', marginTop: '-8px' }}>Only fill if you want to change your password.</p>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
