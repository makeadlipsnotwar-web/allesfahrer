'use client';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, subtotal, shippingCost, totalAmount } = useCart();
  const [address, setAddress] = useState({ name: '', street: '', zip: '', city: '' });
  const [addressSaved, setAddressSaved] = useState(false);
  const [status, setStatus] = useState(null);

  // PayPal Client ID (aus Umgebungsvariablen)
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test";

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!address.name || !address.street || !address.zip || !address.city) return;
    setAddressSaved(true);
  };

  if (status && status.success) {
    return (
      <div style={{ fontFamily: 'monospace', background: '#ffffff', border: '3px solid #000000', padding: '30px', boxShadow: '6px 6px 0px #002D62' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', color: '#166534', margin: '0 0 10px 0' }}>
          // BESTELLUNG ERFOLGREICH & BEZAHLT!
        </h2>
        <p style={{ fontSize: '13px', color: '#334155', marginBottom: '20px', lineHeight: '1.5' }}>
          Zahlung eingegangen. Der Auftrag wurde vollautomatisch an DreamPrint zur Produktion übergeben.
        </p>
        <Link href="/" style={{ display: 'inline-block', background: '#002D62', color: '#ffffff', padding: '10px 20px', border: '2px solid #000000', textDecoration: 'none', fontWeight: '900', textTransform: 'uppercase', fontSize: '13px' }}>
          &larr; ZURÜCK ZUR STARTSEITE
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{ fontFamily: 'monospace', background: '#ffffff', padding: '40px 20px', border: '3px solid #000000', boxShadow: '6px 6px 0px #002D62', textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', margin: '0 0 10px 0' }}>// WARENKORB IST LEER</h2>
        <p style={{ color: '#475569', fontSize: '13px', margin: '0 0 20px 0' }}>KEINE ARTIKEL FÜR DEN SPIELTAG AUSGEWÄHLT.</p>
        <Link href="/" style={{ display: 'inline-block', background: '#002D62', color: '#ffffff', padding: '10px 20px', border: '2px solid #000000', textDecoration: 'none', fontWeight: '900', textTransform: 'uppercase' }}>
          &larr; ZURÜCK ZUM KATALOG
        </Link>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'monospace', background: '#ffffff', border: '3px solid #000000', padding: '24px', boxShadow: '6px 6px 0px #002D62' }}>
      <h1 style={{ color: '#000000', marginTop: 0, marginBottom: '20px', fontSize: '22px', fontWeight: '900', textTransform: 'uppercase', borderBottom: '3px solid #000000', paddingBottom: '8px' }}>
        // WARENKORB & KASSE
      </h1>

      <div style={{ marginBottom: '24px' }}>
        {cart.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed #000000', padding: '12px 0', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src={item.image} 
                alt={item.name} 
                style={{ width: '48px', height: '48px', objectFit: 'contain', border: '1px solid #000', padding: '2px', background: '#f8fafc' }} 
              />
              <div>
                <div style={{ fontWeight: '900', color: '#000000', fontSize: '14px', textTransform: 'uppercase' }}>{item.name}</div>
                <div style={{ color: '#475569', fontSize: '12px', marginTop: '2px' }}>
                  GRÖSSE: {item.size} {item.selectedColor ? `| FARBE: ${item.selectedColor}` : ''} | MENGE: {item.quantity}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontWeight: '900', color: '#002D62', fontSize: '16px' }}>{(item.price * item.quantity).toFixed(2)} €</span>
              <button 
                onClick={() => removeFromCart(idx)} 
                style={{ background: '#000000', color: '#ffffff', border: 'none', padding: '4px 8px', cursor: 'pointer', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase' }}
              >
                X
              </button>
            </div>
          </div>
        ))}

        {/* Preisaufschlüsselung (Zwischensumme, Versand, Gesamt) */}
        <div style={{ marginTop: '20px', borderTop: '2px solid #000000', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'right' }}>
          <div style={{ fontSize: '14px', color: '#334155' }}>
            Zwischensumme: <strong>{subtotal.toFixed(2)} €</strong>
          </div>
          <div style={{ fontSize: '14px', color: '#334155' }}>
            Versandkosten: <strong>{shippingCost.toFixed(2)} €</strong>
          </div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#002D62', marginTop: '4px' }}>
            GESAMTSUMME: {totalAmount.toFixed(2)} €
          </div>
        </div>
      </div>

      {!addressSaved ? (
        <form onSubmit={handleAddressSubmit} style={{ borderTop: '3px solid #000000', paddingTop: '20px' }}>
          <h2 style={{ fontSize: '15px', color: '#000000', marginTop: 0, marginBottom: '14px', fontWeight: '900', textTransform: 'uppercase' }}>
            // 1. LIEFERADRESSE EINGEBEN
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            <input type="text" placeholder="VOLLSTÄNDIGER NAME" required value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} style={{ padding: '10px', border: '2px solid #000000', fontFamily: 'monospace', fontSize: '13px' }} />
            <input type="text" placeholder="STRASSE UND HAUSNUMMER" required value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} style={{ padding: '10px', border: '2px solid #000000', fontFamily: 'monospace', fontSize: '13px' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" placeholder="PLZ" required value={address.zip} onChange={e => setAddress({ ...address, zip: e.target.value })} style={{ width: '30%', padding: '10px', border: '2px solid #000000', fontFamily: 'monospace', fontSize: '13px' }} />
              <input type="text" placeholder="STADT" required value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} style={{ width: '70%', padding: '10px', border: '2px solid #000000', fontFamily: 'monospace', fontSize: '13px' }} />
            </div>
          </div>

          <button type="submit" style={{ width: '100%', padding: '14px', background: '#002D62', color: '#ffffff', border: '2px solid #000000', fontWeight: '900', fontSize: '14px', cursor: 'pointer', textTransform: 'uppercase' }}>
            ADRESSE BESTÄTIGEN & ZUR BEZAHLUNG &rarr;
          </button>
        </form>
      ) : (
        <div style={{ borderTop: '3px solid #000000', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: '#f8fafc', padding: '10px', border: '2px solid #000' }}>
            <span style={{ fontSize: '12px' }}><strong>Lieferadresse:</strong> {address.name}, {address.street}, {address.zip} {address.city}</span>
            <button onClick={() => setAddressSaved(false)} style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>ÄNDERN</button>
          </div>

          <h2 style={{ fontSize: '15px', color: '#000000', marginTop: 0, marginBottom: '14px', fontWeight: '900', textTransform: 'uppercase' }}>
            // 2. SICHER BEZAHLEN & AUTOMATISCH BESTELLEN
          </h2>

          <PayPalScriptProvider options={{ "client-id": paypalClientId, currency: "EUR" }}>
            <PayPalButtons
              style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: totalAmount.toFixed(2), // Übergibt den korrekten Endbetrag inkl. Versand an PayPal
                      },
                    },
                  ],
                });
              }}
              onApprove={async (data, actions) => {
                const details = await actions.order.capture();
                
                const res = await fetch('/api/order', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    shippingAddress: address,
                    items: cart.map(item => ({
                      variantId: item.id,
                      quantity: item.quantity,
                      size: item.size,
                      price: item.price
                    })),
                    paypalOrderId: details.id,
                    paymentStatus: details.status
                  })
                });

                const result = await res.json();
                if (res.ok) {
                  setStatus({ success: true });
                  clearCart();
                } else {
                  alert(result.error || 'Fehler beim Auslösen der Bestellung.');
                }
              }}
            />
          </PayPalScriptProvider>
        </div>
      )}

      {status && !status.success && (
        <div style={{ marginTop: '20px', padding: '12px', background: '#fee2e2', color: '#991b1b', border: '2px solid #000000', fontWeight: '900', fontSize: '13px' }}>
          {status.msg}
        </div>
      )}
    </div>
  );
}