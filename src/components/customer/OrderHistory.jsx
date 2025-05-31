import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { useUsers } from '../../context/UserContext';
import './OrderHistory.css'; // Import the CSS file

const OrderHistory = () => {
  const { orders: allOrders } = useOrders();
  const { currentUser } = useUsers();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && allOrders.length > 0) {
      // Filter orders for the current user
      const userOrders = allOrders.filter(order => order.customerId === currentUser.id);
      
      // Sort orders by date (newest first)
      userOrders.sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime));
      
      setOrders(userOrders);
    }
    setLoading(false);
  }, [currentUser, allOrders]);

  // Format date to a readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status color based on order status
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'preparing':
        return 'status-preparing';
      case 'ready':
        return 'status-ready';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-unknown'; // Default class for unknown statuses
    }
  };

  if (loading) {
    return (
      <div className="loading-container"> {/* Updated class for loading */} 
        <div className="loading-spinner"></div> {/* Updated class for spinner */} 
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <h2 className="order-history-heading">Order History</h2>
      
      {orders.length === 0 ? (
        <div className="order-history-empty">
          <p className="order-history-empty-text">You haven't placed any orders yet.</p>
          <Link 
            to="/menu" 
            className="browse-menu-btn"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="order-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div>
                  <h3 className="order-id">Order #{order.id.slice(-6)}</h3>
                  <p className="order-date">{formatDate(order.orderTime)}</p>
                </div>
                <span className={`order-status-badge ${getStatusClass(order.status)}`}>
                  {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Processing'}
                </span>
              </div>
              
              <div className="order-item-list">
                {order.items && order.items.map((item, index) => (
                  <div key={index} className="order-item-row">
                    <div>
                      <span className="item-name">{item.name}</span>
                      {item.size && <span className="item-detail">({item.size})</span>}
                      {item.temperature && <span className="item-detail">({item.temperature})</span>}
                      {item.flavor && <span className="item-detail">({item.flavor})</span>}
                      {item.addOns && item.addOns.length > 0 && (
                        <div className="item-addons">
                          + {item.addOns.map(addon => addon.name).join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="item-quantity-price">
                      <div>x{item.quantity}</div>
                      <div className="item-price">₹{(item.totalPrice * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-total-section">
                <span className="order-total-label">Total</span>
                <span className="order-total-value">
                  ₹{order.items ? order.items.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
</div>

  );
};

export default OrderHistory;