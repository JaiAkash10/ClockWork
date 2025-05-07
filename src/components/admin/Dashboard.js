import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { useUsers } from '../../context/UserContext';

const Dashboard = () => {
  const { orders } = useOrders();
  const { users } = useUsers();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    revenue: 0,
    notifications: []
  });

  // Calculate metrics from real data
  useEffect(() => {
    // Calculate order metrics
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending' || order.status === 'preparing').length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    
    // Calculate total revenue
    const revenue = orders.reduce((total, order) => total + order.total, 0);
    
    // Generate notifications from recent orders and activities
    const notifications = [];
    
    // Add recent orders to notifications
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime))
      .slice(0, 3);
      
    recentOrders.forEach((order, index) => {
      const timeAgo = getTimeAgo(new Date(order.orderTime));
      // Convert order.id to string before using it
      const orderId = String(order.id);
      notifications.push({
        id: `order_${orderId}`,
        message: `New order #${orderId} received`,
        time: timeAgo
      });
    });
    
    // Add low stock alerts if we had inventory data
    // This would be replaced with actual inventory checks
    if (orders.length > 0) {
      notifications.push({
        id: 'inventory_1',
        message: 'Low stock alert: Filter Coffee',
        time: '1 hour ago'
      });
    }
    
    setMetrics({
      totalOrders,
      pendingOrders,
      completedOrders,
      revenue,
      notifications: notifications.slice(0, 5) // Limit to 5 notifications
    });
  }, [orders, users]);
  
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
  
  // Navigation handlers for quick action buttons
  const handleNavigateToMenu = () => navigate('/admin/menu');
  const handleNavigateToOrders = () => navigate('/admin/orders');
  const handleNavigateToInventory = () => navigate('/admin/inventory');

  return (
    <div className="min-h-screen bg-[#FAF5F0] transition-all duration-300">
      {/* Admin Navbar */}
      <nav className="bg-[#4A3C31] text-white p-4 shadow-lg backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-semibold hover:text-[#E6D5C3] transition-colors duration-300">Clockwork Admin</div>
          <div className="space-x-6">
            <Link to="/admin" className="text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-full after:bg-[#E6D5C3]">Dashboard</Link>
            <Link to="/admin/menu" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Menu</Link>
            <Link to="/admin/orders" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Orders</Link>
            <Link to="/admin/customers" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Customers</Link>
            <Link to="/admin/inventory" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Inventory</Link>
            <Link to="/admin/analytics" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Analytics</Link>
            <Link to="/admin/settings" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Settings</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-[#4A3C31]">Dashboard Overview</h1>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <h3 className="text-lg font-semibold text-[#4A3C31] mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-[#557C55]">{metrics.totalOrders}</p>
          </div>

          {/* Pending Orders */}
          <div className="bg-white p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <h3 className="text-lg font-semibold text-[#4A3C31] mb-2">Pending Orders</h3>
            <p className="text-3xl font-bold text-[#E6D5C3]">{metrics.pendingOrders}</p>
          </div>

          {/* Completed Orders */}
          <div className="bg-white p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <h3 className="text-lg font-semibold text-[#4A3C31] mb-2">Completed Orders</h3>
            <p className="text-3xl font-bold text-[#557C55]">{metrics.completedOrders}</p>
          </div>

          {/* Revenue */}
          <div className="bg-white p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <h3 className="text-lg font-semibold text-[#4A3C31] mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-[#557C55]">₹{metrics.revenue}</p>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#4A3C31]">Recent Notifications</h2>
            <button 
              onClick={() => navigate('/admin/notifications')} 
              className="text-sm bg-[#E6D5C3] px-4 py-2 rounded-lg hover:bg-[#D4C3B1] transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4A3C31] focus:ring-offset-2"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {metrics.notifications.map(notification => (
              <div key={notification.id} className="flex items-center justify-between p-4 bg-[#FAF5F0] rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-[#557C55] rounded-full"></div>
                  <p className="text-[#4A3C31]">{notification.message}</p>
                </div>
                <span className="text-sm text-gray-500">{notification.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button 
            onClick={handleNavigateToMenu}
            className="bg-white p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4A3C31] focus:ring-offset-2"
          >
            <h3 className="text-lg font-semibold text-[#4A3C31] mb-2">Add New Menu Item</h3>
            <p className="text-gray-600">Create and publish new menu items</p>
          </button>
          <button 
            onClick={handleNavigateToOrders}
            className="bg-white p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4A3C31] focus:ring-offset-2"
          >
            <h3 className="text-lg font-semibold text-[#4A3C31] mb-2">View Orders</h3>
            <p className="text-gray-600">Manage pending and completed orders</p>
          </button>
          <button 
            onClick={handleNavigateToInventory}
            className="bg-white p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4A3C31] focus:ring-offset-2"
          >
            <h3 className="text-lg font-semibold text-[#4A3C31] mb-2">Update Inventory</h3>
            <p className="text-gray-600">Check and update stock levels</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;