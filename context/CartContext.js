'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

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

    const existingIndex = cart.findIndex(
      item => String(item.id) === String(product.id) && item.size === size
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

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalAmount, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}