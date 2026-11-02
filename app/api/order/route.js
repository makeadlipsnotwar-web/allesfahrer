import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { shippingAddress, items, paypalOrderId, paymentStatus } = body;

    // Sicherheits-Check: Ohne erfolgreiche Bezahlung geht gar nichts raus!
    if (paymentStatus !== 'COMPLETED') {
      return NextResponse.json({ error: 'Zahlung nicht bestätigt. Bestellung abgebrochen.' }, { status: 400 });
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Warenkorb ist leer.' }, { status: 400 });
    }

    // 1. Payload für DreamPrint zusammenbauen
    const dreamPrintPayload = {
      shipping_address: {
        name: shippingAddress.name,
        street: shippingAddress.street,
        zip: shippingAddress.zip,
        city: shippingAddress.city,
        country: "DE"
      },
      line_items: items.map(item => ({
        variant_id: item.variantId || item.id,
        quantity: item.quantity,
        size: item.size,
        price: item.price // Endkundenpreis für Statistik
      })),
      external_order_id: paypalOrderId // Verknüpft die DreamPrint-Bestellung mit der PayPal-Transaktion
    };

    // 2. Automatisch an DreamPrint senden
    const dpResponse = await fetch('https://api.dreamprint.de/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DREAMPRINT_API_KEY}`
      },
      body: JSON.stringify(dreamPrintPayload)
    });

    const dpData = await dpResponse.json();

    if (!dpResponse.ok) {
      console.error('DreamPrint API Fehler nach Zahlung:', dpData);
      // Hier greift im Ernstfall der Support, da das Geld aber bereits da ist, 
      // kannst du den Auftrag manuell mit der PayPal-ID bei DreamPrint anstoßen.
      return NextResponse.json(
        { error: 'Zahlung erfolgreich, aber Fehler bei der DreamPrint-Übertragung. Wir kümmern uns darum.' }, 
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: dpData.id || paypalOrderId
    });

  } catch (err) {
    console.error('Server-Fehler:', err);
    return NextResponse.json({ error: 'Interner Serverfehler.' }, { status: 500 });
  }
}