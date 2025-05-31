import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { useUsers } from '../../context/UserContext';
import { useOrderTracking } from '../../context/OrderTrackingContext';
import Navbar from '../../Navbar'; // Import the Navbar component
import '../../styles/OrderManagement.css';

const OrderManagement = () => {
  const { orders, updateOrderStatus } = useOrders();
  const { users } = useUsers();
  const { completeOrder } = useOrderTracking();
  const [filterStatus, setFilterStatus] = useState('all');
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(order => order.status === filterStatus);

  const handleStatusChange = (orderId, newStatus) => {
    // Update order status in context
    updateOrderStatus(orderId, newStatus);
    
    // If status is completed, also update in OrderTracking context
    if (newStatus === 'completed') {
      completeOrder(orderId);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
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
        return 'status-completed';
    }
  };

  return (
    <div className="order-management-container">
      <Navbar userType="admin" />
      {/* Main Content */}
      <div className="order-management-content">
        <div className="order-management-header">
          <h1 className="order-management-title">Order Management</h1>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="order-filter"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {filteredOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3 className="order-id">Order #{String(order.id).replace('order_', '')}</h3>
                  <p className="customer-name">{order.customerName}</p>
                  <p className="order-time">Order Time: {new Date(order.orderTime).toLocaleString()}</p>
                  <p className="pickup-time">Pickup Time: {new Date(order.pickupTime).toLocaleString()}</p>
                </div>
                <div className="order-status-price">
                  <span className={`status-badge ${getStatusClass(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <p className="order-price">₹{order.total}</p>
                </div>
              </div>
              
              <div className="order-actions">
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowOrderDetails(true);
                  }}
                  className="view-details-btn"
                >
                  View Details
                </button>
                <div>
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="order-modal-overlay">
            <div className="order-modal-content">
              <div className="order-modal-header">
                <h2 className="order-modal-title">Order Details {selectedOrder.id.replace('order_', '#')}</h2>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="order-modal-close"
                >
                  ×
                </button>
              </div>
              
              <div className="order-sections">
                <div className="order-section">
                  <h3 className="order-section-title">Customer Information</h3>
                  <p>Name: {selectedOrder.customerName}</p>
                  <p>Phone: {selectedOrder.customerPhone}</p>
                </div>
                
                <div className="order-section">
                  <h3 className="order-section-title">Order Items</h3>
                  <div className="order-items">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="order-item-header">
                          <span>{item.name} × {item.quantity}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                        
                        {/* Show customizations */}
                        <div className="order-item-customizations">
                          {item.size && <span className="mr-2">Size: {item.size}</span>}
                          {item.temperature && <span className="mr-2">Temp: {item.temperature}</span>}
                          {item.flavor && <span className="mr-2">Flavor: {item.flavor}</span>}
                          {item.addOns && item.addOns.length > 0 && (
                            <div>
                              Add-ons: {item.addOns.map(addon => addon.name).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="order-total">
                    <span>Total</span>
                    <span>₹{selectedOrder.total}</span>
                  </div>
                </div>
                
                {selectedOrder.specialInstructions && (
                  <div className="order-section">
                    <h3 className="order-section-title">Special Instructions</h3>
                    <p>{selectedOrder.specialInstructions}</p>
                  </div>
                )}
                
                <div className="order-section">
                  <h3 className="order-section-title">Timing</h3>
                  <p>Order Time: {selectedOrder.orderTime}</p>
                  <p>Pickup Time: {selectedOrder.pickupTime}</p>
                </div>
              </div>
              
              <div className="order-modal-footer">
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="order-modal-close-btn"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;