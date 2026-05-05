'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';

function formatPrice(p) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p);
}

export default function ItemDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getItem(id)
      .then(d => setItem(d.payload || d.data || d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: '24px' }}>Loading...</div>;
  if (error || !item) return <div style={{ padding: '24px' }}><p className="error">{error || 'Item not found'}</p></div>;

  return (
    <div style={{ maxWidth: 800, margin: '24px auto', padding: '0 16px' }}>
      <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '14px', marginBottom: '16px', padding: 0 }}>
        ← Back to items
      </button>

      <div className="card">
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          <div style={{ width: 200, height: 200, background: '#e0e7ff', borderRadius: '6px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {item.image
              ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ color: '#2563eb', fontSize: '13px' }}>No image</span>
            }
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>{item.name}</h1>
            <p style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '20px', marginBottom: '10px' }}>
              {item.price ? formatPrice(item.price) : '—'}
            </p>
            {item.stock !== undefined && (
              <span style={{ fontSize: '12px', background: item.stock > 0 ? '#dcfce7' : '#fee2e2', color: item.stock > 0 ? '#15803d' : '#dc2626', padding: '3px 8px', borderRadius: '3px', display: 'inline-block', marginBottom: '12px' }}>
                {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
              </span>
            )}
            {item.category && <p style={{ fontSize: '13px', color: '#888', marginBottom: '12px' }}>Category: {item.category}</p>}
            {item.description && (
              <>
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '4px' }}>Description</p>
                <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.6' }}>{item.description}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
