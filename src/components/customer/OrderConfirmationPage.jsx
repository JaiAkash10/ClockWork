import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { useOrderTracking } from '../../context/OrderTrackingContext';
import Navbar from '../../Navbar'; // Import the Navbar component
import './OrderConfirmationPage.css'; // Import the CSS file

const OrderConfirmationPage = () => {
  const location = useLocation();
  const { orders } = useOrders();
  const { 
    activeOrder, 
    startOrderTracking, 
    formattedTime, 
    isTimerActive 
  } = useOrderTracking();
  
  // Get orderId from location state or localStorage
  const orderId = location.state?.orderId || localStorage.getItem('activeOrderId');
  
  // Start tracking the order when component mounts
  useEffect(() => {
    if (orderId) {
      startOrderTracking(orderId);
    }
  }, [orderId, startOrderTracking]);
  
  // Find the order details
  const orderDetails = activeOrder || orders.find(order => order.id === orderId);

  return (
    <div className="order-confirmation-container">
      <Navbar userType="customer" />
      {/* Main Content */}
      <main className="main-content">
        <div className="order-card">
          <div className="order-icon">☕</div>
          <h2 className="order-heading">Thank you for your order!</h2>

          {orderDetails ? (
            <>
              <div className="order-id">
                Order ID: {orderId && orderId.replace('order_', '#')}
              </div>

              <p className="order-note">We'll notify you when it's ready for pickup.</p>

              {isTimerActive && (
                <div className="order-timer">
                  <div className="order-timer-label">Estimated time remaining:</div>
                  <div className="order-timer-value">{formattedTime}</div>
                </div>
              )}

              <div className="order-details">
                <h3 className="order-details-heading">Order Details</h3>

                {orderDetails.items && orderDetails.items.map((item, index) => (
                  <div key={index} className={`order-item ${index < orderDetails.items.length - 1 ? 'order-item-border' : ''}`}>
                    <div className="order-item-header">
                      <span className="order-item-name">{item.name} × {item.quantity}</span>
                      <span className="order-item-price">₹{item.price * item.quantity}</span>
                    </div>

                    {/* Show customizations */}
                    <div className="order-item-customizations">
                      {item.size && <span className="customization">Size: {item.size}</span>}
                      {item.temperature && <span className="customization">Temp: {item.temperature}</span>}
                      {item.flavor && <span className="customization">Flavor: {item.flavor}</span>}
                      {item.addOns && item.addOns.length > 0 && (
                        <div className="customization-addons">
                          Add-ons: {item.addOns.map(addon => addon.name).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="order-total">
                  <span>Total</span>
                  <span>₹{orderDetails.total}</span>
                </div>
              </div>

              <div className="order-status">
                <div className="order-status-title">Order Status</div>
                <div className="order-status-value">
                  {orderDetails.status || 'Pending'}
                </div>
              </div>
            </>
          ) : (
            <p className="order-loading">Loading order details...</p>
          )}

          <div className="order-actions">
            <Link to="/" className="action-link">
              <button className="action-btn-primary">
                Return Home
              </button>
            </Link>
            <Link to="/menu" className="action-link">
              <button className="action-btn-secondary">
                Browse Menu Again
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmationPage;