'use client';
import { useState, useEffect } from 'react';
import { useCart } from '../../../context/CartContext';
import { useRouter, useParams } from 'next/navigation';

const CUSTOM_IMAGES = {
  "AFA Sweater": ["/sweater vorne.jpg", "/sweater hinten.jpg"],
  "FldsF Hoodie": ["/normaler hoodie vorne.jpg", "/normaler hoodie hinten.jpg"],
  "FldsF T-Shirt": ["/normi shirt vorne.jpg", "/normi shirt hinten.jpg"],
  "FldsF Zipper": ["/zipper vorne.jpg", "/zipper hinten.jpg"],
  "FldsF Kinder Hoodie": ["/kinder hoodie.jpg", "/kinder hoodie hinten.jpg"],
  "FldsF Kinder T-Shirt": ["/kinder shirt.jpg", "/kinder shirt hinten.jpg"],
  "Jocelyn Hampel Hoodie": ["/hampel hoodie.jpg"],
  "Arminia Logo Cap": ["/logo cap.jpg"],
  "Jocelyn Hampel T-Shirt": ["/hampel shirt.jpg"],
  "Allesfahrer OG Shirt": ["/og shirt vorne.jpg", "/og shirt hinten.jpg"],
  "Allesfahrer OG Kinder-Shirt": ["/og kind vorne.jpg", "og kind hinten.jpg"],
  "FldsF T-Shirt Alternate Design": ["/alternate schwarz v.jpg", "/alternate schwarz h.jpg", "/alternate blau v.jpg", "/alternate blau h.jpg"]
};

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', '2XL', 'XXL', '3XL', '4XL', '5XL', 'One Size'];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id;
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!productId) return;

    async function loadProduct() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          const found = data.products.find(p => String(p.id) === String(productId));
          if (found) {
            // Bilder zuweisen (CUSTOM_IMAGES hat Priorität)
            found.images = CUSTOM_IMAGES[found.name] || (found.image ? [found.image] : ["/logo cap.jpg"]);
            
            // Initiale Farbe & Variante setzen
            if (found.variants && found.variants.length > 0) {
              const firstColor = found.variants[0].color;
              setSelectedColor(firstColor);
              const colorVariants = found.variants.filter(v => v.color === firstColor);
              if (colorVariants.length > 0) {
                setSelectedSize(colorVariants[0].size);
                setSelectedVariant(colorVariants[0]);
              }
            } else if (found.name.includes("Cap")) {
              setSelectedSize("One Size");
            }

            setProduct(found);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  if (loading) return <div style={{ textAlign: 'center', padding: '60px 0', color: '#002D62', fontWeight: '700' }}>Produktdetails laden...</div>;
  if (!product) return <div style={{ textAlign: 'center', padding: '60px 0', color: '#c5221f' }}>Produkt nicht gefunden.</div>;

  // Einzigartige Farben aus den Varianten ziehen
  const availableColors = product.variants 
    ? Array.from(new Set(product.variants.map(v => v.color))).map(color => {
        const variant = product.variants.find(v => v.color === color);
        return { color, hex: variant?.color_hex || '#000000', image: variant?.image };
      })
    : [];

  // Größen für die gewählte Farbe filtern und exakt nach SIZE_ORDER sortieren
  const availableVariantSizes = product.variants && selectedColor
    ? product.variants
        .filter(v => v.color === selectedColor)
        .sort((a, b) => {
          const indexA = SIZE_ORDER.indexOf(a.size);
          const indexB = SIZE_ORDER.indexOf(b.size);
          return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
        })
    : [];

  const handleColorChange = (color) => {
    setSelectedColor(color);
    const colorVariants = product.variants.filter(v => v.color === color);
    const matchingVariant = colorVariants.find(v => v.size === selectedSize) || colorVariants[0];
    if (matchingVariant) {
      setSelectedSize(matchingVariant.size);
      setSelectedVariant(matchingVariant);
    }

    // Wenn es sich um das Alternate Design handelt, Bilder passend zur Farbe umschalten
    if (product.name === "FldsF T-Shirt Alternate Design") {
      if (color.toLowerCase().includes('black') || color.toLowerCase().includes('schwarz')) {
        setActiveImageIndex(0); // Zeigt das erste Bild (Schwarz Vorn)
      } else if (color.toLowerCase().includes('cobalt') || color.toLowerCase().includes('blau')) {
        setActiveImageIndex(2); // Zeigt das dritte Bild im Array (Blau Vorn)
      }
    }
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    if (product.variants) {
      const variant = product.variants.find(v => v.color === selectedColor && v.size === size);
      if (variant) setSelectedVariant(variant);
    }
  };

  // Korrekten Preis ermitteln (Priorität: gross_price -> variant.price -> produkt.price)
  const rawPrice = selectedVariant?.gross_price || selectedVariant?.price || product.price || 0;
  const currentPrice = Number(rawPrice).toFixed(2);

  const handleAddToCart = () => {
    const itemToAdd = {
      ...product,
      price: currentPrice,
      selectedColor: selectedColor || null,
      selectedVariantId: selectedVariant?.id || null
    };
    addToCart(itemToAdd, selectedSize, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ background: '#ffffff', borderRadius: '0px', padding: '28px', border: '2px solid #002D62' }}>
      
      <button 
        onClick={() => router.back()} 
        style={{ 
          background: '#f0f0f0', 
          border: '1px solid #ccc', 
          borderRadius: '0px',
          padding: '6px 12px',
          cursor: 'pointer', 
          color: '#002D62', 
          fontWeight: '700', 
          marginBottom: '20px', 
          fontSize: '13px',
          textTransform: 'uppercase'
        }}
      >
        ← Zurück zur Übersicht
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'start' }}>
        
        {/* Bilder-Galerie */}
        <div>
          <div style={{ 
            background: '#fafafa', 
            border: '1px solid #ccc', 
            borderRadius: '0px', 
            padding: '24px', 
            textAlign: 'center'
          }}>
            <img 
              src={product.images[activeImageIndex] || product.images[0]} 
              alt={product.name} 
              style={{ maxWidth: '100%', maxHeight: '320px', objectFit: 'contain' }} 
            />
          </div>

          {product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'center' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  style={{
                    border: activeImageIndex === idx ? '2px solid #002D62' : '1px solid #ccc',
                    borderRadius: '0px',
                    padding: '2px',
                    background: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <img src={img} style={{ width: '48px', height: '48px', objectFit: 'contain', display: 'block' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Produktdetails */}
        <div>
          <div style={{ color: '#002D62', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Arminia-Frauen-Allesfahrer
          </div>
          <h1 style={{ margin: '4px 0 8px 0', fontSize: '26px', color: '#111', fontWeight: '900', textTransform: 'uppercase' }}>
            {product.name}
          </h1>
          
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#002D62', marginBottom: '16px' }}>
            {currentPrice} €
          </div>

          {/* HTML-Beschreibung aus der API sauber gerendert */}
          <div 
            style={{ 
              background: '#f8f8f8', 
              padding: '12px 14px', 
              borderRadius: '0px', 
              color: '#333', 
              fontSize: '13px', 
              lineHeight: '1.5', 
              marginBottom: '20px', 
              borderLeft: '3px solid #002D62',
              borderRight: '1px solid #ddd',
              borderTop: '1px solid #ddd',
              borderBottom: '1px solid #ddd'
            }}
            dangerouslySetInnerHTML={{ 
              __html: product.description || `Offizieller ${product.name} der Arminia-Frauen-Allesfahrer.` 
            }}
          />

          {/* Farbauswahl */}
          {availableColors.length > 1 && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '800', fontSize: '13px', color: '#111', marginBottom: '8px', textTransform: 'uppercase' }}>
                Farbe: <span style={{ color: '#002D62' }}>{selectedColor}</span>
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {availableColors.map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => handleColorChange(c.color)}
                    style={{
                      padding: '6px 12px',
                      border: selectedColor === c.color ? '2px solid #002D62' : '1px solid #ccc',
                      background: selectedColor === c.color ? '#002D62' : '#ffffff',
                      color: selectedColor === c.color ? '#ffffff' : '#111',
                      fontWeight: '700',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: c.hex, border: '1px solid #aaa', display: 'inline-block' }} />
                    {c.color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sortierte Größenauswahl */}
          {!product.name.includes("Cap") ? (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: '800', fontSize: '13px', color: '#111', marginBottom: '8px', textTransform: 'uppercase' }}>Größe:</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {availableVariantSizes.length > 0 ? (
                  availableVariantSizes.map((v) => (
                    <button
                      key={v.size}
                      type="button"
                      disabled={!v.in_stock}
                      onClick={() => handleSizeChange(v.size)}
                      style={{
                        minWidth: '44px',
                        padding: '10px 12px',
                        border: selectedSize === v.size ? '2px solid #002D62' : '1px solid #ccc',
                        background: selectedSize === v.size ? '#002D62' : v.in_stock ? '#ffffff' : '#f0f0f0',
                        color: selectedSize === v.size ? '#ffffff' : v.in_stock ? '#111' : '#aaa',
                        textDecoration: v.in_stock ? 'none' : 'line-through',
                        borderRadius: '0px',
                        fontWeight: '800',
                        fontSize: '13px',
                        cursor: v.in_stock ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {v.size}
                    </button>
                  ))
                ) : (
                  SIZE_ORDER.slice(1, 6).map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      style={{
                        flex: '1',
                        minWidth: '44px',
                        padding: '10px 0',
                        border: selectedSize === size ? '2px solid #002D62' : '1px solid #ccc',
                        background: selectedSize === size ? '#002D62' : '#ffffff',
                        color: selectedSize === size ? '#ffffff' : '#111',
                        borderRadius: '0px',
                        fontWeight: '800',
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      {size}
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div style={{ padding: '10px 12px', background: '#eee', borderRadius: '0px', fontWeight: '700', color: '#333', fontSize: '13px', marginBottom: '20px', border: '1px solid #ccc' }}>
              Größe: Einheitsgröße (One Size)
            </div>
          )}

          <button
            onClick={handleAddToCart}
            style={{
              width: '100%',
              padding: '16px',
              background: added ? '#15803d' : '#002D62',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0px',
              fontWeight: '800',
              fontSize: '15px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {added ? '✓ IN DEN WARENKORB GELEGT' : 'IN DEN WARENKORB'}
          </button>

        </div>
      </div>
    </div>
  );
}