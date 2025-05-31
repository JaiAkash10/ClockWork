import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { useUsers } from '../../context/UserContext';
import Navbar from '../../Navbar';

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
    <div className="min-h-screen bg-beige transition-all duration-300">
      {/* Admin NavBar */}
      <Navbar userType="admin" />

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-dark-brown">Dashboard Overview</h1>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          {/* Total Orders */}
          <div className="metric-card">
            <h3 className="metric-title">Total Orders</h3>
            <p className="metric-value text-green">{metrics.totalOrders}</p>
          </div>

          {/* Pending Orders */}
          <div className="metric-card">
            <h3 className="metric-title">Pending Orders</h3>
            <p className="metric-value text-light-beige">{metrics.pendingOrders}</p>
          </div>

          {/* Completed Orders */}
          <div className="metric-card">
            <h3 className="metric-title">Completed Orders</h3>
            <p className="metric-value text-green">{metrics.completedOrders}</p>
          </div>

          {/* Revenue */}
          <div className="metric-card">
            <h3 className="metric-title">Total Revenue</h3>
            <p className="metric-value text-green">₹{metrics.revenue}</p>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="card mb-8">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-dark-brown">Recent Notifications</h2>
              <button 
                onClick={() => navigate('/admin/notifications')} 
                className="btn btn-secondary"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {metrics.notifications.map(notification => (
                <div key={notification.id} className="notification-item">
                  <div className="notification-content">
                    <div className="notification-dot"></div>
                    <p className="notification-message">{notification.message}</p>
                  </div>
                  <span className="notification-time">{notification.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button 
            onClick={handleNavigateToMenu}
            className="quick-action-btn"
          >
            <h3 className="quick-action-title">Add New Menu Item</h3>
            <p className="quick-action-desc">Create and publish new menu items</p>
          </button>
          <button 
            onClick={handleNavigateToOrders}
            className="quick-action-btn"
          >
            <h3 className="quick-action-title">View Orders</h3>
            <p className="quick-action-desc">Manage pending and completed orders</p>
          </button>
          <button 
            onClick={handleNavigateToInventory}
            className="quick-action-btn"
          >
            <h3 className="quick-action-title">Update Inventory</h3>
            <p className="quick-action-desc">Check and update stock levels</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;