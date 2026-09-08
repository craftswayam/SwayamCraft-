import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('swayamcraft_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);
  const [generalGiftNote, setGeneralGiftNote] = useState('');

  // Save cart locally for guest browsing
  useEffect(() => {
    localStorage.setItem('swayamcraft_cart', JSON.stringify(items));
  }, [items]);

  // Sync with backend when user is logged in
  useEffect(() => {
    if (user) {
      const syncWithServer = async () => {
        try {
          // If we had local items before logging in, push them to server
          if (items.length > 0) {
            for (const item of items) {
              await api.addToCart({
                productId: item.product.id,
                quantity: item.quantity,
                customGiftMessage: item.customGiftMessage,
              }).catch(() => null);
            }
          }
          const serverItems = await api.getCart();
          if (serverItems && serverItems.length > 0) {
            setItems(serverItems);
          }
        } catch (err) {
          console.error('Cart sync error:', err);
        }
      };
      syncWithServer();
    }
  }, [user]);

  const addToCart = async (product, quantity = 1, customGiftMessage = '') => {
    setItems((prevItems) => {
      const existingIdx = prevItems.findIndex((i) => i.product.id === product.id);
      if (existingIdx > -1) {
        const updated = [...prevItems];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity,
          customGiftMessage: customGiftMessage || updated[existingIdx].customGiftMessage,
        };
        return updated;
      } else {
        return [...prevItems, { id: Date.now(), product, quantity, customGiftMessage }];
      }
    });

    if (user) {
      try {
        await api.addToCart({ productId: product.id, quantity, customGiftMessage });
      } catch (err) {
        console.error('Failed to add to server cart:', err);
      }
    }

    setIsDrawerOpen(true);
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );

    if (user) {
      const item = items.find((i) => i.product.id === productId);
      if (item && item.id) {
        try {
          await api.updateCartQuantity(item.id, quantity);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  const removeFromCart = async (productId) => {
    const itemToRemove = items.find((i) => i.product.id === productId);
    setItems((prev) => prev.filter((item) => item.product.id !== productId));

    if (user && itemToRemove && itemToRemove.id) {
      try {
        await api.removeFromCart(itemToRemove.id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const clearCart = async () => {
    setItems([]);
    if (user) {
      try {
        await api.clearCart();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = items.reduce((acc, item) => {
    const price = item.product.discountPrice || item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const giftWrapFee = giftWrap ? 50 : 0;
  const shippingFee = subtotal >= 999 || subtotal === 0 ? 0 : 70;
  const grandTotal = subtotal + giftWrapFee + shippingFee;

  return (
    <CartContext.Provider
      value={{
        items,
        totalItemsCount,
        subtotal,
        shippingFee,
        giftWrap,
        setGiftWrap,
        giftWrapFee,
        grandTotal,
        generalGiftNote,
        setGeneralGiftNote,
        isDrawerOpen,
        setIsDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
