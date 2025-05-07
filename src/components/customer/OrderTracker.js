import React, { useState, useEffect, useRef } from 'react';
import { useOrderTracking } from '../../context/OrderTrackingContext';
import Draggable from 'react-draggable';
import { useLocation } from 'react-router-dom';

const OrderTracker = () => {
  const { 
    activeOrder, 
    remainingTime, 
    isTimerActive, 
    formattedTime,
    toggleTrackerVisibility // Add this to get the function from context
  } = useOrderTracking();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState(() => {
    const savedPosition = localStorage.getItem('orderTrackerPosition');
    return savedPosition ? JSON.parse(savedPosition) : { x: 0, y: 0 };
  });
  
  const nodeRef = useRef(null);
  // Move useLocation to the top level - not inside conditional
  const location = useLocation();
  
  // Save position to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('orderTrackerPosition', JSON.stringify(position));
  }, [position]);
  
  // Add effect to ensure tracker visibility is maintained across page navigation
  // Move this useEffect before any conditional returns
  useEffect(() => {
    // If we have an active order, make sure the tracker is visible
    if (activeOrder && isTimerActive) {
      // Use toggleTrackerVisibility instead of setIsVisible
      // or just remove this if not needed
      // toggleTrackerVisibility();
    }
  }, [location, activeOrder, isTimerActive]);
  
  // Only hide if there's no active order
  // We want to show the tracker on all pages when there's an active order
  // The tracker will persist until the order is completed by an admin
  if (!activeOrder || !isTimerActive) {
    return null;
  }
  
  const handleDragStop = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-handle"
      defaultPosition={position}
      onStop={handleDragStop}
      bounds="body"
    >
      <div 
        ref={nodeRef}
        className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${isExpanded ? 'w-80' : 'w-64'}`}
      >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header - Always visible */}
          <div 
            className="bg-[#4A3C31] text-white p-3 flex justify-between items-center cursor-pointer drag-handle"
            onClick={toggleExpand}
          >
            <div className="flex items-center">
              <div className="text-xl mr-2">☕</div>
              <div>
                <div className="font-medium">Order Tracking</div>
                <div className="text-xs opacity-80">
                  {activeOrder.id.replace('order_', '#')}
                </div>
              </div>
            </div>
            <div className="text-sm font-bold bg-[#557C55] px-2 py-1 rounded">
              {formattedTime}
            </div>
          </div>
          
          {/* Status Bar */}
          <div className="bg-[#E6D5C3] px-3 py-1 text-sm flex justify-between items-center">
            <span>Status:</span>
            <span className="font-medium capitalize">{activeOrder.status}</span>
          </div>
          
          {/* Expanded Content */}
          {isExpanded && (
            <div className="p-3 bg-[#FAF5F0]">
              <div className="space-y-2">
                <div>
                  <div className="text-sm text-[#6B4F36]">Items:</div>
                  <div className="space-y-1 mt-1">
                    {activeOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} × {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between pt-2 border-t border-[#E6D5C3] font-medium">
                  <span>Total:</span>
                  <span>₹{activeOrder.total}</span>
                </div>
                
                <div className="text-sm">
                  <div className="text-[#6B4F36]">Pickup Time:</div>
                  <div>{new Date(activeOrder.pickupTime).toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Draggable>
  );
};

export default OrderTracker;