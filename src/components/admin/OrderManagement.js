import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { useUsers } from '../../context/UserContext';
import { useOrderTracking } from '../../context/OrderTrackingContext';

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5F0] transition-all duration-300">
      {/* Admin Navbar */}
      <nav className="bg-[#4A3C31] text-white p-4 shadow-lg backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-semibold hover:text-[#E6D5C3] transition-colors duration-300">Clockwork Admin</div>
          <div className="space-x-6">
            <Link to="/admin" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Dashboard</Link>
            <Link to="/admin/menu" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Menu</Link>
            <Link to="/admin/orders" className="text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-full after:bg-[#E6D5C3]">Orders</Link>
            <Link to="/admin/customers" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Customers</Link>
            <Link to="/admin/inventory" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Inventory</Link>
            <Link to="/admin/analytics" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Analytics</Link>
            <Link to="/admin/settings" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Settings</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#4A3C31]">Order Management</h1>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-[#4A3C31] focus:border-[#4A3C31]"
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
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-[#4A3C31] mb-2">Order #{String(order.id).replace('order_', '')}</h3>
                  <p className="text-gray-600">{order.customerName}</p>
                  <p className="text-sm text-gray-500">Order Time: {new Date(order.orderTime).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Pickup Time: {new Date(order.pickupTime).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <p className="mt-2 text-lg font-medium text-[#557C55]">₹{order.total}</p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowOrderDetails(true);
                  }}
                  className="text-[#4A3C31] hover:text-[#557C55] transition-colors duration-300"
                >
                  View Details
                </button>
                <div className="space-x-2">
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="p-2 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-semibold text-[#4A3C31]">Order Details {selectedOrder.id.replace('order_', '#')}</h2>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-[#4A3C31]">Customer Information</h3>
                  <p>Name: {selectedOrder.customerName}</p>
                  <p>Phone: {selectedOrder.customerPhone}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-[#4A3C31]">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="mb-2">
                        <div className="flex justify-between">
                          <span>{item.name} × {item.quantity}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                        
                        {/* Show customizations */}
                        <div className="text-sm text-[#6B4F36] mt-1">
                          {item.size && <span className="mr-2">Size: {item.size}</span>}
                          {item.temperature && <span className="mr-2">Temp: {item.temperature}</span>}
                          {item.flavor && <span className="mr-2">Flavor: {item.flavor}</span>}
                          {item.addOns && item.addOns.length > 0 && (
                            <div className="mt-1">
                              Add-ons: {item.addOns.map(addon => addon.name).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{selectedOrder.total}</span>
                  </div>
                </div>
                
                {selectedOrder.specialInstructions && (
                  <div>
                    <h3 className="font-medium text-[#4A3C31]">Special Instructions</h3>
                    <p>{selectedOrder.specialInstructions}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="font-medium text-[#4A3C31]">Timing</h3>
                  <p>Order Time: {selectedOrder.orderTime}</p>
                  <p>Pickup Time: {selectedOrder.pickupTime}</p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="px-6 py-2 bg-[#4A3C31] text-white rounded-lg hover:bg-[#3A2C21] transition-all duration-300"
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