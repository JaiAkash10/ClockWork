import React, { useState, useEffect, useRef } from 'react';
import { useOrderTracking } from '../../context/OrderTrackingContext';
import Draggable from 'react-draggable';
import { useLocation } from 'react-router-dom';
import { useWindowSize } from '../../hooks/useWindowSize';
import './OrderTracker.css'; // Import the CSS file

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
  const contentRef = useRef(null);
  const windowSize = useWindowSize();
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
  
  // Only hide if there's no active order, or if on an admin page
  // We want to show the tracker on all non-admin pages when there's an active order
  // The tracker will persist until the order is completed by an admin
  const isAdminPage = location.pathname.startsWith('/admin');

  if (!activeOrder || !isTimerActive || isAdminPage) {
    return null;
  }
  
  // Function to ensure tracker stays within viewport boundaries
  const handleDragStop = (e, data) => {
    // Get tracker dimensions
    const trackerWidth = nodeRef.current?.offsetWidth || 0;
    const trackerHeight = nodeRef.current?.offsetHeight || 0;
    
    // Calculate maximum allowed positions
    const maxX = windowSize.width - trackerWidth;
    const maxY = windowSize.height - trackerHeight;
    
    // Ensure position stays within bounds
    const boundedX = Math.min(Math.max(0, data.x), maxX);
    const boundedY = Math.min(Math.max(0, data.y), maxY);
    
    setPosition({ x: boundedX, y: boundedY });
  };
  
  // Function to toggle expanded state
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Function to determine if expanded content should open upward
  const shouldOpenUpward = () => {
    if (!nodeRef.current || !contentRef.current) return false;
    
    const trackerRect = nodeRef.current.getBoundingClientRect();
    const contentHeight = contentRef.current.scrollHeight;
    const viewportHeight = windowSize.height;
    
    // If there's not enough space below, open upward
    return viewportHeight - trackerRect.bottom < contentHeight + 20; // 20px buffer
  };
  
  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-handle"
      defaultPosition={position}
      position={position}
      onStop={handleDragStop}
      bounds="body"
    >
      <div
        ref={nodeRef}
        className={`tracker-wrapper ${isExpanded ? 'tracker-expanded' : 'tracker-collapsed'}`}
      >
        <div className="tracker-container">
          {/* Header - Always visible */}
          <div
            className="tracker-header drag-handle"
            onClick={toggleExpand}
          >
            <div className="tracker-header-left">
              <div className="tracker-icon">☕</div>
              <div>
                <div className="tracker-title">Order Tracking</div>
                <div className="tracker-subtitle">
                  {activeOrder.id.replace('order_', '#')}
                </div>
              </div>
            </div>
            <div className="tracker-timer">
              {formattedTime}
            </div>
          </div>

          {/* Status Bar */}
          <div className="tracker-status-bar">
            <span>Status:</span>
            <span className="tracker-status">{activeOrder.status}</span>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div
              ref={contentRef}
              className={`tracker-content ${shouldOpenUpward() ? 'tracker-up' : 'tracker-down'}`}
            >
              <div className="tracker-items-list">
                <div>
                  <div className="tracker-items-label">Items:</div>
                  <div className="tracker-item-group">
                    {activeOrder.items.map((item, index) => (
                      <div key={index} className="tracker-item">
                        <div className="tracker-item-header">
                          <span>{item.name} × {item.quantity}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                        {/* Show customizations */}
                        {(item.size || item.temperature || item.flavor || (item.addOns && item.addOns.length > 0)) && (
                          <div className="tracker-customizations">
                            {item.size && <span className="tracker-customization">Size: {item.size}</span>}
                            {item.temperature && <span className="tracker-customization">Temp: {item.temperature}</span>}
                            {item.flavor && <span className="tracker-customization">Flavor: {item.flavor}</span>}
                            {item.addOns && item.addOns.length > 0 && (
                              <div className="tracker-addons">
                                Add-ons: {item.addOns.map(addon => addon.name).join(', ')}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="tracker-total-row">
                  <span>Total:</span>
                  <span>₹{activeOrder.total}</span>
                </div>

                <div className="tracker-pickup">
                  <div className="tracker-pickup-label">Pickup Time:</div>
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