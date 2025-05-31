import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('cartItems');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id && i.size === item.size && JSON.stringify(i.selectedAddOns) === JSON.stringify(item.selectedAddOns));
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id && i.size === item.size && JSON.stringify(i.selectedAddOns) === JSON.stringify(item.selectedAddOns)
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      } else {
        return [...prevItems, { ...item, quantity: item.quantity || 1 }];
      }
    });
  };

  const removeFromCart = (itemId, itemSize, itemAddOns) => {
    setCartItems(prevItems => 
      prevItems.filter(item => 
        !(item.id === itemId && item.size === itemSize && JSON.stringify(item.selectedAddOns) === JSON.stringify(itemAddOns))
      )
    );
  };

  const updateQuantity = (itemId, itemSize, itemAddOns, quantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId && item.size === itemSize && JSON.stringify(item.selectedAddOns) === JSON.stringify(itemAddOns)
          ? { ...item, quantity: Math.max(1, quantity) } // Ensure quantity is at least 1
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      let itemPrice = parseFloat(item.price) || 0;
      const addOnsPrice = item.selectedAddOns && Array.isArray(item.selectedAddOns) 
        ? item.selectedAddOns.reduce((acc, addon) => acc + (parseFloat(addon.price) || 0), 0)
        : 0;
      return total + (itemPrice + addOnsPrice) * item.quantity;
    }, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getItemCount }}>
      {children}
    </CartContext.Provider>
  );
};