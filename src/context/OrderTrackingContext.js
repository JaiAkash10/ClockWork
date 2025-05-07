import React, { createContext, useState, useEffect, useContext } from 'react';
import { useOrders } from './OrderContext';

// Create the context
const OrderTrackingContext = createContext();

// Create a provider component
export const OrderTrackingProvider = ({ children }) => {
  const { orders, updateOrderStatus } = useOrders();
  const [activeOrder, setActiveOrder] = useState(() => {
    const savedOrderId = localStorage.getItem('activeOrderId');
    if (savedOrderId) {
      const order = orders.find(order => order.id === savedOrderId);
      return order || null;
    }
    return null;
  });
  const [remainingTime, setRemainingTime] = useState(() => {
    const savedRemainingTime = localStorage.getItem('orderRemainingTime');
    return savedRemainingTime ? parseInt(savedRemainingTime, 10) : 0;
  });
  const [isTimerActive, setIsTimerActive] = useState(() => {
    return localStorage.getItem('orderTimerActive') === 'true';
  });
  const [isVisible, setIsVisible] = useState(() => {
    const savedVisibility = localStorage.getItem('orderTrackerVisible');
    return savedVisibility !== null ? savedVisibility === 'true' : true;
  });

  // Function to set the active order for tracking
  const startOrderTracking = (orderId) => {
    const order = orders.find(order => order.id === orderId);
    if (order) {
      // Calculate pickup time as current time + 30 minutes (preparation time)
      const currentTime = new Date().getTime();
      const preparationTimeMs = 30 * 60 * 1000; // 30 minutes in milliseconds
      const calculatedPickupTime = new Date(currentTime + preparationTimeMs);
      
      // Update the order with the calculated pickup time
      const updatedOrder = {
        ...order,
        pickupTime: calculatedPickupTime.toISOString()
      };
      
      setActiveOrder(updatedOrder);
      localStorage.setItem('activeOrderId', orderId);
      
      // Set remaining time to preparation time (30 minutes)
      setRemainingTime(preparationTimeMs);
      localStorage.setItem('orderRemainingTime', preparationTimeMs.toString());
      
      setIsTimerActive(true);
      localStorage.setItem('orderTimerActive', 'true');
      
      setIsVisible(true);
      localStorage.setItem('orderTrackerVisible', 'true');
    }
  };

  // Function to stop tracking the current order
  const stopOrderTracking = () => {
    setActiveOrder(null);
    setIsTimerActive(false);
    setRemainingTime(0);
    localStorage.removeItem('activeOrderId');
    localStorage.removeItem('orderTimerActive');
    localStorage.removeItem('orderRemainingTime');
    localStorage.removeItem('orderTrackerVisible');
  };
  
  // Function to toggle visibility of the tracker
  const toggleTrackerVisibility = () => {
    setIsVisible(prev => {
      const newValue = !prev;
      localStorage.setItem('orderTrackerVisible', newValue.toString());
      return newValue;
    });
  };

  // Function to mark order as completed (for admin)
  const completeOrder = (orderId) => {
    updateOrderStatus(orderId, 'completed');
    if (activeOrder && activeOrder.id === orderId) {
      stopOrderTracking();
    }
  };

  // Timer effect to count down remaining time
  useEffect(() => {
    let timer;
    if (isTimerActive && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prev => {
          const newTime = prev - 1000;
          if (newTime <= 0) {
            clearInterval(timer);
            localStorage.setItem('orderRemainingTime', '0');
            return 0;
          }
          localStorage.setItem('orderRemainingTime', newTime.toString());
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerActive, remainingTime]);

  // Effect to update active order when orders change
  useEffect(() => {
    if (activeOrder) {
      const updatedOrder = orders.find(order => order.id === activeOrder.id);
      if (updatedOrder) {
        setActiveOrder(updatedOrder);
        
        // If order is completed, stop tracking
        if (updatedOrder.status === 'completed') {
          stopOrderTracking();
        }
      }
    }
  }, [orders, activeOrder]);
  
  // Effect to update localStorage when timer state changes
  useEffect(() => {
    localStorage.setItem('orderTimerActive', isTimerActive.toString());
  }, [isTimerActive]);

  // Format remaining time as minutes and seconds
  const formatRemainingTime = () => {
    if (!remainingTime) return '00:00';
    
    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <OrderTrackingContext.Provider value={{
      activeOrder,
      remainingTime,
      isTimerActive,
      isVisible,
      formattedTime: formatRemainingTime(),
      startOrderTracking,
      stopOrderTracking,
      completeOrder,
      toggleTrackerVisibility
    }}>
      {children}
    </OrderTrackingContext.Provider>
  );
};

// Custom hook to use the order tracking context
export const useOrderTracking = () => {
  const context = useContext(OrderTrackingContext);
  if (!context) {
    throw new Error('useOrderTracking must be used within an OrderTrackingProvider');
  }
  return context;
};