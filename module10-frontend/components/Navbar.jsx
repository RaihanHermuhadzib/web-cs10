'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { logout, isAuth } = useAuth();
  const path = usePathname();

  const links = isAuth
    ? [{ href: '/items', label: 'Shop' }, { href: '/history', label: 'Orders' }, { href: '/profile', label: 'Profile' }]
    : [{ href: '/items', label: 'Shop' }, { href: '/login', label: 'Login' }, { href: '/register', label: 'Register' }];

  return (
    <nav style={{ background: '#2563eb', color: 'white', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Link href="/items" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '20px' }}>
        ShopHub
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {links.map(l => (
          <Link key={l.href} href={l.href} style={{
            color: 'white', textDecoration: 'none',
            padding: '6px 12px', borderRadius: '4px', fontSize: '14px',
            background: path === l.href ? 'rgba(255,255,255,0.2)' : 'transparent',
          }}>{l.label}</Link>
        ))}
        {isAuth && (
          <button onClick={logout} style={{ marginLeft: '8px', padding: '6px 12px', borderRadius: '4px', fontSize: '14px', color: '#fca5a5', background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer' }}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
