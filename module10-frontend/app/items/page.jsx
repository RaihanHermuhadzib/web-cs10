'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

function formatPrice(p) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p);
}

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.getItems()
      .then(d => setItems(d.payload || d.data || d || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(i =>
    i.name?.toLowerCase().includes(search.toLowerCase()) ||
    i.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px' }}>All Items</h1>

      <input
        style={{ width: '100%', maxWidth: 400, padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', marginBottom: '16px', outline: 'none' }}
        placeholder="Search items..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p style={{ color: '#888' }}>Loading items...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: '#888' }}>No items found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
          {filtered.map(item => (
            <Link key={item.id} href={`/items/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ padding: '0', overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ height: 120, background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.image
                    ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ color: '#2563eb', fontSize: '13px' }}>No image</span>
                  }
                </div>
                <div style={{ padding: '12px' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>{item.name}</p>
                  <p style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '15px', marginBottom: '4px' }}>
                    {item.price ? formatPrice(item.price) : '—'}
                  </p>
                  {item.stock !== undefined && (
                    <span style={{ fontSize: '11px', background: item.stock > 0 ? '#dcfce7' : '#fee2e2', color: item.stock > 0 ? '#15803d' : '#dc2626', padding: '2px 6px', borderRadius: '3px' }}>
                      {item.stock > 0 ? `${item.stock} left` : 'Out of stock'}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
