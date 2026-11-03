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
  "Allesfahrer OG Kinder-Shirt": ["/og kind vorne.jpg", "og kind hinten.jpg"]
};

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id;
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
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
            found.images = CUSTOM_IMAGES[found.name] || ["/logo cap.jpg"];
            setProduct(found);
            if (found.name.includes("Cap")) {
              setSelectedSize("One Size");
            }
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

  const handleAddToCart = () => {
    addToCart(product, selectedSize, 1);
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
        
        <div>
          <div style={{ 
            background: '#fafafa', 
            border: '1px solid #ccc', 
            borderRadius: '0px', 
            padding: '24px', 
            textAlign: 'center'
          }}>
            <img 
              src={product.images[activeImageIndex]} 
              alt={product.name} 
              style={{ maxWidth: '100%', maxHeight: '280px', objectFit: 'contain' }} 
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

        <div>
          <div style={{ color: '#002D62', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Arminia-Frauen-Allesfahrer
          </div>
          <h1 style={{ margin: '4px 0 8px 0', fontSize: '26px', color: '#111', fontWeight: '900', textTransform: 'uppercase' }}>
            {product.name}
          </h1>
          
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#002D62', marginBottom: '16px' }}>
            {product.price} €
          </div>

          <div style={{ 
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
          }}>
            {product.description || `Offizieller ${product.name} der Arminia-Frauen-Allesfahrer.`}
          </div>

          {!product.name.includes("Cap") ? (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: '800', fontSize: '13px', color: '#111', marginBottom: '8px', textTransform: 'uppercase' }}>Größe:</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {SIZES.map(size => (
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
                ))}
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
