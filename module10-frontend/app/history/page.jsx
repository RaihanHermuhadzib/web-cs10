'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

function formatPrice(p) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p);
}

export default function HistoryPage() {
  const { isAuth } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuth) { router.push('/login'); return; }
    api.getHistory()
      .then(d => setHistory(d.payload || d.data || d || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [isAuth, router]);

  return (
    <div style={{ maxWidth: 800, margin: '24px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px' }}>Order History</h1>

      {error && <p className="error">{error}</p>}
      {loading && <p style={{ color: '#888' }}>Loading...</p>}

      {!loading && history.length === 0 && (
        <div className="card" style={{ textAlign: 'center', color: '#888' }}>No transactions yet.</div>
      )}

      {history.map((tx, i) => (
        <div key={tx.id || i} className="card" style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{tx.item?.name || tx.itemName || `Order #${tx.id}`}</span>
              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '3px', fontWeight: 'bold', background: tx.status === 'completed' ? '#dcfce7' : '#fef9c3', color: tx.status === 'completed' ? '#15803d' : '#854d0e' }}>
                {tx.status || 'Pending'}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#888' }}>
              {tx.quantity && `Qty: ${tx.quantity} · `}
              {tx.createdAt && new Date(tx.createdAt).toLocaleDateString('en-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
          <p style={{ fontWeight: 'bold', color: '#2563eb', fontSize: '15px' }}>
            {tx.totalPrice || tx.total ? formatPrice(tx.totalPrice || tx.total) : '—'}
          </p>
        </div>
      ))}
    </div>
  );
}
