import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiToken = process.env.DREAMPRINT_API_KEY;
    const shopId = process.env.DREAMPRINT_SHOP_ID;

    const response = await fetch('https://api.dream-print.de/v1/shop/products', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken.trim()}`,
        'X-DreamPrint-Shop-Id': shopId.trim(),
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    const rawList = Array.isArray(data) ? data : (data.products || data.items || data.data || []);

    const products = rawList.map((item, index) => {
      // Preis ermitteln (entweder direkt oder aus den Varianten)
      let price = item.gross_price || item.price || item.retail_price;
      if (!price && item.variants && item.variants.length > 0) {
        price = item.variants[0].gross_price || item.variants[0].price;
      }

      // Bild primär aus den Varianten ziehen (da dort laut deinem JSON das Bild liegt)
      let image = item.image || item.image_url;
      if (!image && item.variants && item.variants.length > 0) {
        // Suche die erste Variante mit einem Bild
        const variantWithImage = item.variants.find(v => v.image);
        image = variantWithImage ? variantWithImage.image : item.variants[0].image;
      }

      return {
        id: item.id || item.variant_id || index,
        name: item.name || item.title || `Artikel #${index + 1}`,
        price: price ? Number(price).toFixed(2) : '0.00',
        image: image || ''
      };
    });

    return NextResponse.json({ success: true, products });

  } catch (error) {
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
