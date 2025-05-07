import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context
const OrderContext = createContext();

// Create a provider component
export const OrderProvider = ({ children }) => {
  // Initialize state with data from localStorage
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      return JSON.parse(savedOrders);
    }
    return [];
  });

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // Function to add a new order
  const addOrder = (newOrder) => {
    // Generate a unique ID for the order
    const orderId = `order_${Date.now()}`;
    const orderWithId = {
      ...newOrder,
      id: orderId,
      status: newOrder.status || 'pending',
      orderTime: newOrder.orderTime || new Date().toISOString(),
    };
    
    // Create a new array instead of modifying the existing one
    const updatedOrders = [...orders, orderWithId];
    
    // Update state with the new array
    setOrders(updatedOrders);
    
    // Immediately save to localStorage to ensure persistence
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    return orderId; // Return the order ID for reference
  };

  // Function to update an existing order
  const updateOrder = (orderId, updatedFields) => {
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order => 
        order.id === orderId ? { ...order, ...updatedFields } : order
      );
      return updatedOrders;
    });
  };

  // Function to update order status
  const updateOrderStatus = (orderId, newStatus) => {
    updateOrder(orderId, { status: newStatus });
  };

  // Function to get orders by customer ID
  const getOrdersByCustomer = (customerId) => {
    return orders.filter(order => order.customerId === customerId);
  };

  // Function to get orders by status
  const getOrdersByStatus = (status) => {
    return status === 'all' ? orders : orders.filter(order => order.status === status);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      updateOrder,
      updateOrderStatus,
      getOrdersByCustomer,
      getOrdersByStatus
    }}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook to use the order context
export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};