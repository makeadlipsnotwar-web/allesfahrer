'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

// Hier kannst du die Versandkostenpauschale anpassen (z. B. 4.95)
const SHIPPING_COST = 4.99;

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Warenkorb aus localStorage laden beim Start
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('afa_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Fehler beim Laden des Warenkorbs', e);
    }
  }, []);

  // Speichern im localStorage bei Änderungen
  const updateCart = (newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem('afa_cart', JSON.stringify(newCart));
    } catch (e) {
      console.error('Fehler beim Speichern des Warenkorbs', e);
    }
  };

  const addToCart = (product, size, quantity = 1) => {
    const itemImage = Array.isArray(product.images) && product.images.length > 0 
      ? product.images[0] 
      : (product.image || "/logo cap.jpg");

    // Falls Produktvarianten oder Farben gewählt wurden, diese im Warenkorb-Item eindeutig halten
    const selectedColor = product.selectedColor || null;

    const existingIndex = cart.findIndex(
      item => String(item.id) === String(product.id) && item.size === size && item.selectedColor === selectedColor
    );

    let updatedCart;
    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart = [
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image: itemImage,
          size: size || 'M',
          selectedColor: selectedColor,
          quantity: quantity
        }
      ];
    }
    updateCart(updatedCart);
  };

  const removeFromCart = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    updateCart(updated);
  };

  const clearCart = () => {
    updateCart([]);
  };

  // Berechnungen für Zwischensumme, Versand und Gesamtsumme
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Versandkosten fallen nur an, wenn sich auch Artikel im Warenkorb befinden
  const shippingCost = totalItems > 0 ? SHIPPING_COST : 0;
  const totalAmount = subtotal + shippingCost;

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      subtotal, 
      shippingCost, 
      totalAmount, 
      totalItems 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}