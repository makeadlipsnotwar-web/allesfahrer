'use client';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <header style={{ 
      background: '#002D62', 
      color: '#fff', 
      padding: '14px 20px', 
      borderBottom: '3px solid #001B3A',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#fff' }}>
          <img 
            src="/allesfahrer logo.png" 
            alt="Allesfahrer Logo" 
            style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; }} 
          />
          <span style={{ fontSize: '19px', fontWeight: '800', letterSpacing: '-0.3px', textTransform: 'uppercase' }}>
            Arminia-Frauen-Allesfahrer
          </span>
        </Link>
        
        <Link 
          href="/cart" 
          style={{ 
            color: '#fff', 
            textDecoration: 'none', 
            fontWeight: '700', 
            background: '#001B3A', 
            padding: '8px 16px', 
            borderRadius: '2px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            border: '1px solid #004085',
            fontSize: '14px'
          }}
        >
          🛒 WARENKORB ({totalItems})
        </Link>
      </div>
    </header>
  );
}
