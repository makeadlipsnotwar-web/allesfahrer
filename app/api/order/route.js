import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { shippingAddress, items, paypalOrderId, paymentStatus } = body;

    if (paymentStatus !== 'COMPLETED') {
      return NextResponse.json({ error: 'Zahlung nicht bestätigt.' }, { status: 400 });
    }

    console.log("--> SUCCESS: PayPal-Zahlung erhalten! Order-ID:", paypalOrderId);

    // 1. Daten für die DreamPrint-API aufbereiten
    // Wichtig: Je nach DreamPrint API-Doku müssen die Items die korrekte Varianten-ID / SKU enthalten.
    const dreamPrintPayload = {
      external_order_id: paypalOrderId,
      shipping_address: {
        name: shippingAddress.name,
        street: shippingAddress.street,
        zip: shippingAddress.zip,
        city: shippingAddress.city,
        country: "DE" // Standardmäßig Deutschland
      },
      items: items.map(item => ({
        variant_id: item.selectedVariantId || item.id, // Nutzt die Varianten-ID falls vorhanden, sonst die ID
        quantity: item.quantity
      }))
    };

    console.log("Sende Bestellung an DreamPrint...", JSON.stringify(dreamPrintPayload, null, 2));

    // 2. Echter API-Call an DreamPrint
    const dreamPrintRes = await fetch('https://api.dream-print.de/v1/shop/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DREAMPRINT_API_KEY}` // Zieht deinen API-Key aus den Env-Variablen
      },
      body: JSON.stringify(dreamPrintPayload)
    });

    const dreamPrintResult = await dreamPrintRes.json();

    if (!dreamPrintRes.ok) {
      console.error("DreamPrint API Fehler:", dreamPrintResult);
      return NextResponse.json({ 
        error: `Zahlung erfolgreich, aber DreamPrint hat die Bestellung abgelehnt: ${JSON.stringify(dreamPrintResult)}` 
      }, { status: 400 });
    }

    console.log("--> SUCCESS: Bestellung erfolgreich an DreamPrint übergeben!", dreamPrintResult);

    return NextResponse.json({
      success: true,
      orderId: paypalOrderId,
      dreamPrintResponse: dreamPrintResult
    });

  } catch (err) {
    console.error('Server-Fehler in /api/order:', err);
    return NextResponse.json({ error: 'Interner Serverfehler beim Verarbeiten der Bestellung.' }, { status: 500 });
  }
}