import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';

const NotificationsPage = () => {
  const { orders } = useOrders();
  const [notifications, setNotifications] = useState([]);
  const [filterType, setFilterType] = useState('all');

  // Generate notifications from orders and other activities
  useEffect(() => {
    const allNotifications = [];
    
    // Add notifications from orders
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime));
      
    recentOrders.forEach((order) => {
      const timeAgo = getTimeAgo(new Date(order.orderTime));
      const orderId = String(order.id);
      allNotifications.push({
        id: `order_${orderId}`,
        type: 'order',
        message: `New order #${orderId} received`,
        time: timeAgo,
        timestamp: new Date(order.orderTime),
        details: `Customer: ${order.customerName}, Total: ₹${order.total}`
      });

      // Add status change notifications
      if (order.status === 'completed') {
        allNotifications.push({
          id: `status_${orderId}`,
          type: 'status',
          message: `Order #${orderId} marked as completed`,
          time: timeAgo,
          timestamp: new Date(order.orderTime),
          details: `Completed at: ${new Date(order.orderTime).toLocaleString()}`
        });
      }
    });
    
    // Add inventory notifications (mock data)
    allNotifications.push({
      id: 'inventory_1',
      type: 'inventory',
      message: 'Low stock alert: Filter Coffee',
      time: '1 hour ago',
      timestamp: new Date(Date.now() - 3600000),
      details: 'Current stock: 2 units, Reorder threshold: 5 units'
    });
    
    allNotifications.push({
      id: 'inventory_2',
      type: 'inventory',
      message: 'Low stock alert: Milk',
      time: '3 hours ago',
      timestamp: new Date(Date.now() - 10800000),
      details: 'Current stock: 1 liter, Reorder threshold: 3 liters'
    });
    
    // Sort all notifications by timestamp (newest first)
    allNotifications.sort((a, b) => b.timestamp - a.timestamp);
    
    setNotifications(allNotifications);
  }, [orders]);
  
  // Filter notifications based on type
  const filteredNotifications = filterType === 'all' 
    ? notifications 
    : notifications.filter(notification => notification.type === filterType);
  
  // Helper function to format time ago
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
    
    return 'just now';
  };

  // Get notification color based on type
  const getNotificationColor = (type) => {
    switch (type) {
      case 'order':
        return 'bg-[#557C55]'; // Green dot for orders
      case 'inventory':
        return 'bg-[#E6A23C]'; // Yellow/orange dot for inventory alerts
      case 'status':
        return 'bg-[#409EFF]'; // Blue dot for status updates
      default:
        return 'bg-[#557C55]';
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
            <Link to="/admin/orders" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Orders</Link>
            <Link to="/admin/customers" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Customers</Link>
            <Link to="/admin/inventory" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Inventory</Link>
            <Link to="/admin/analytics" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Analytics</Link>
            <Link to="/admin/notifications" className="text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-full after:bg-[#E6D5C3]">Notifications</Link>
            <Link to="/admin/settings" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Settings</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#4A3C31]">Notifications</h1>
          <div className="flex space-x-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-[#4A3C31] focus:border-[#4A3C31]"
            >
              <option value="all">All Notifications</option>
              <option value="order">Orders</option>
              <option value="inventory">Inventory Alerts</option>
              <option value="status">Status Updates</option>
            </select>
            <button 
              className="px-4 py-2 bg-[#557C55] text-white rounded-lg hover:bg-[#446644] transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#557C55] focus:ring-offset-2"
              onClick={() => setNotifications([])}
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 transform transition-all duration-300 hover:shadow-xl">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No notifications to display</div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map(notification => (
                <div key={notification.id} className="flex flex-col p-4 bg-[#FAF5F0] rounded-lg hover:bg-[#F0EBE6] transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-2 h-2 ${getNotificationColor(notification.type)} rounded-full`}></div>
                      <p className="text-[#4A3C31] font-medium">{notification.message}</p>
                    </div>
                    <span className="text-sm text-gray-500">{notification.time}</span>
                  </div>
                  {notification.details && (
                    <div className="mt-2 ml-6 text-sm text-gray-600">
                      {notification.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;