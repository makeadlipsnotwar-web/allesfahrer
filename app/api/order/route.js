import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { shippingAddress, items, paypalOrderId, paymentStatus } = body;

    if (paymentStatus !== 'COMPLETED') {
      return NextResponse.json({ error: 'Zahlung nicht bestätigt.' }, { status: 400 });
    }

    console.log("--> SUCCESS: PayPal-Zahlung erhalten! Order-ID:", paypalOrderId);

    // DreamPrint wird für diesen Test kurz übersprungen, 
    // um zu sehen, ob der PayPal-Checkout alleine stabil läuft.
    return NextResponse.json({
      success: true,
      orderId: paypalOrderId
    });

  } catch (err) {
    console.error('Server-Fehler in /api/order:', err);
    return NextResponse.json({ error: 'Interner Serverfehler.' }, { status: 500 });
  }
}