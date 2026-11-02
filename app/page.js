'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const CUSTOM_IMAGES = {
  "AFA Sweater": ["/sweater vorne.jpg"],
  "FldsF Hoodie": ["/normaler hoodie vorne.jpg"],
  "FldsF T-Shirt": ["/normi shirt vorne.jpg"],
  "FldsF Zipper": ["/zipper vorne.jpg"],
  "FldsF Kinder Hoodie": ["/kinder hoodie.jpg"],
  "FldsF Kinder T-Shirt": ["/kinder shirt.jpg"],
  "Jocelyn Hampel Hoodie": ["/hampel hoodie.jpg"],
  "Arminia Logo Cap": ["/logo cap.jpg"],
  "Jocelyn Hampel T-Shirt": ["/hampel shirt.jpg"]
};

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          const mapped = data.products.map(p => ({
            ...p,
            image: (CUSTOM_IMAGES[p.name] && CUSTOM_IMAGES[p.name][0]) || "/logo cap.jpg"
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', fontFamily: 'monospace', fontWeight: 'bold' }}>// LADEN...</div>;
  }

  return (
    <div style={{ fontFamily: 'monospace', paddingBottom: '40px' }}>
      
      {/* Ticket-Kopfleiste / Banner */}
      <div style={{
        background: '#ffffff',
        color: '#000000',
        border: '3px solid #000000',
        padding: '20px',
        marginBottom: '30px',
        boxShadow: '6px 6px 0px #002D62',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px dashed #000000', paddingBottom: '8px', marginBottom: '12px', fontSize: '12px', fontWeight: 'bold' }}>
          <span>STKL: AFA-05 // SEKTOR F</span>
          <span>SAISON 2026/27</span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '900', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '-1px' }}>
          ARMINIA FRAUEN ALLESFAHRER
        </h1>
        <p style={{ fontSize: '12px', margin: 0, textTransform: 'uppercase', color: '#334155' }}>
          [ OFFIZIELLER DIREKTVERKAUF — KEIN KOMMERZ ]
        </p>
      </div>

      <div style={{ borderBottom: '3px solid #000000', paddingBottom: '6px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '900', margin: 0, textTransform: 'uppercase' }}>
          // SPIELTAGS-SORTIMENT
        </h2>
        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
          ({products.length} ARTIKEL)
        </span>
      </div>

      {/* Ticket-Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {products.map(p => (
          <Link key={p.id} href={`/products/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ 
              background: '#ffffff', 
              border: '3px solid #000000', 
              padding: '14px', 
              boxShadow: '4px 4px 0px #000000',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              height: '100%',
              boxSizing: 'border-box',
              position: 'relative'
            }}>
              
              {/* Ticket-Einkerbung oben rechts */}
              <div style={{
                position: 'absolute',
                top: '-1px',
                right: '-1px',
                width: '12px',
                height: '12px',
                background: '#f4f6f8',
                borderBottom: '3px solid #000000',
                borderLeft: '3px solid #000000'
              }} />

              <div>
                <div style={{ 
                  background: '#f8fafc', 
                  border: '2px solid #000000', 
                  height: '160px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: '10px', 
                  marginBottom: '12px' 
                }}>
                  <img src={p.image} alt={p.name} style={{ maxHeight: '140px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', color: '#000000' }}>
                  {p.name}
                </h3>
              </div>

              <div>
                {/* Perforierte Trennlinie */}
                <div style={{ borderTop: '2px dashed #94a3b8', margin: '12px 0 8px 0' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', fontWeight: '900', color: '#002D62' }}>
                    {p.price} €
                  </span>
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: '900', 
                    background: '#002D62', 
                    color: '#ffffff', 
                    padding: '4px 8px', 
                    border: '2px solid #000000',
                    textTransform: 'uppercase' 
                  }}>
                    EINLÖSEN &rarr;
                  </span>
                </div>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}