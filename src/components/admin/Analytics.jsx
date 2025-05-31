import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import Navbar from '../../Navbar'; // Import the Navbar component
import '../../styles/Analytics.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const Analytics = () => {
  const [orderData, setOrderData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  
  const [popularItems, setPopularItems] = useState([]);
  const [customerStats, setCustomerStats] = useState({
    totalCustomers: 0,
    newCustomers: 0,
    returningCustomers: 0
  });
  
  const [timeRange, setTimeRange] = useState('week');
  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: []
  });
  
  const [itemPopularityData, setItemPopularityData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    // Load real data from localStorage
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = () => {
    try {
      // Get orders from localStorage
      const savedOrders = localStorage.getItem('orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      
      // Get users from localStorage
      const savedUsers = localStorage.getItem('users');
      const currentUser = localStorage.getItem('currentUser');
      let users = savedUsers ? JSON.parse(savedUsers) : [];
      
      // If no users found in users array, check for current user
      if (users.length === 0 && currentUser) {
        users = [JSON.parse(currentUser)];
      }
      
      // Calculate order statistics
      calculateOrderStats(orders);
      
      // Calculate popular items
      calculatePopularItems(orders);
      
      // Calculate customer statistics
      calculateCustomerStats(users, orders);
      
      // Generate sales data for charts
      generateSalesData(orders);
      
      // Generate item popularity data
      generateItemPopularityData(orders);
      
    } catch (error) {
      console.error("Error loading analytics data:", error);
    }
  };

  const calculateOrderStats = (orders) => {
    const completed = orders.filter(order => order.status === 'completed' || order.status === 'delivered');
    const pending = orders.filter(order => order.status === 'pending' || order.status === 'processing');
    
    const totalRevenue = orders.reduce((sum, order) => {
      // Calculate total from items if available, otherwise use order.total
      const orderTotal = order.items 
        ? order.items.reduce((itemSum, item) => itemSum + (item.totalPrice * item.quantity), 0)
        : (order.total || 0);
      return sum + orderTotal;
    }, 0);
    
    setOrderData({
      totalOrders: orders.length,
      totalRevenue,
      averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
      pendingOrders: pending.length,
      completedOrders: completed.length
    });
  };

  const calculatePopularItems = (orders) => {
    // Create a map to count item occurrences
    const itemCounts = {};
    
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const itemName = item.name;
          if (itemCounts[itemName]) {
            itemCounts[itemName].count += item.quantity || 1;
            itemCounts[itemName].revenue += (item.totalPrice * (item.quantity || 1));
          } else {
            itemCounts[itemName] = {
              name: itemName,
              count: item.quantity || 1,
              revenue: (item.totalPrice * (item.quantity || 1))
            };
          }
        });
      }
    });
    
    // Convert to array and sort by count
    const sortedItems = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 items
    
    setPopularItems(sortedItems);
  };

  const calculateCustomerStats = (users, orders) => {
    // Get unique customer IDs from orders
    const customerIds = [...new Set(orders.map(order => order.customerId))];
    
    // Count returning customers (those with more than one order)
    const orderCountByCustomer = {};
    orders.forEach(order => {
      if (order.customerId) {
        orderCountByCustomer[order.customerId] = (orderCountByCustomer[order.customerId] || 0) + 1;
      }
    });
    
    const returningCustomers = Object.values(orderCountByCustomer).filter(count => count > 1).length;
    
    setCustomerStats({
      totalCustomers: users.length || customerIds.length,
      newCustomers: customerIds.length - returningCustomers,
      returningCustomers
    });
  };

  const generateSalesData = (orders) => {
    // Filter orders based on selected time range
    const now = new Date();
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.orderTime);
      if (timeRange === 'week') {
        // Last 7 days
        return (now - orderDate) / (1000 * 60 * 60 * 24) <= 7;
      } else if (timeRange === 'month') {
        // Last 30 days
        return (now - orderDate) / (1000 * 60 * 60 * 24) <= 30;
      } else {
        // Last 365 days
        return (now - orderDate) / (1000 * 60 * 60 * 24) <= 365;
      }
    });
    
    // Group orders by date
    const salesByDate = {};
    filteredOrders.forEach(order => {
      const date = new Date(order.orderTime).toLocaleDateString();
      const orderTotal = order.items 
        ? order.items.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0)
        : (order.total || 0);
      
      salesByDate[date] = (salesByDate[date] || 0) + orderTotal;
    });
    
    // Create labels and data for chart
    const labels = Object.keys(salesByDate);
    const data = Object.values(salesByDate);
    
    setSalesData({
      labels,
      datasets: [
        {
          label: 'Sales (₹)',
          data,
          borderColor: '#557C55',
          backgroundColor: 'rgba(85, 124, 85, 0.2)',
          tension: 0.4
        }
      ]
    });
  };

  const generateItemPopularityData = (orders) => {
    // Create a map to count item occurrences
    const itemCounts = {};
    
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const itemName = item.name;
          itemCounts[itemName] = (itemCounts[itemName] || 0) + (item.quantity || 1);
        });
      }
    });
    
    // Get top 5 items
    const topItems = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    setItemPopularityData({
      labels: topItems.map(item => item[0]),
      datasets: [
        {
          label: 'Orders',
          data: topItems.map(item => item[1]),
          backgroundColor: [
            '#557C55',
            '#7D9D9C',
            '#E6D5C3',
            '#4A3C31',
            '#D0B49F'
          ],
          borderWidth: 1
        }
      ]
    });
  };

  return (
    <div className="analytics-dashboard">
      <Navbar userType="admin" />
      {/* Main Content */}
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Analytics Dashboard</h1>
          <div className="time-range-buttons">
            <button 
              onClick={() => setTimeRange('week')} 
              className={`time-btn ${timeRange === 'week' ? 'active' : ''}`}
            >
              Week
            </button>
            <button 
              onClick={() => setTimeRange('month')} 
              className={`time-btn ${timeRange === 'month' ? 'active' : ''}`}
            >
              Month
            </button>
            <button 
              onClick={() => setTimeRange('year')} 
              className={`time-btn ${timeRange === 'year' ? 'active' : ''}`}
            >
              Year
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {/* Total Orders */}
          <div className="stat-card">
            <h3 className="card-title">Total Orders</h3>
            <p className="stat-value">{orderData.totalOrders}</p>
            <div className="stat-details">
              <span>Pending: {orderData.pendingOrders}</span> | <span>Completed: {orderData.completedOrders}</span>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="stat-card">
            <h3 className="card-title">Total Revenue</h3>
            <p className="stat-value">₹{orderData.totalRevenue.toFixed(2)}</p>
            <p className="stat-details">Avg. Order: ₹{orderData.averageOrderValue.toFixed(2)}</p>
          </div>

          {/* Customers */}
          <div className="stat-card">
            <h3 className="card-title">Customers</h3>
            <p className="stat-value">{customerStats.totalCustomers}</p>
            <div className="stat-details">
              <span>New: {customerStats.newCustomers}</span> | <span>Returning: {customerStats.returningCustomers}</span>
            </div>
          </div>

          {/* Most Popular Item */}
          <div className="stat-card">
            <h3 className="card-title">Most Popular</h3>
            <p className="stat-value popular-item-name">
              {popularItems.length > 0 ? popularItems[0].name : 'N/A'}
            </p>
            <p className="stat-details">
              {popularItems.length > 0 ? `${popularItems[0].count} orders` : ''}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          {/* Sales Trend Chart */}
          <div className="chart-card">
            <h3 className="chart-title">Sales Trend</h3>
            {salesData.labels.length > 0 ? (
              <Line 
                data={salesData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: false,
                    }
                  }
                }}
              />
            ) : (
              <div className="no-data-message">No sales data for selected period.</div>
            )}
          </div>

          {/* Item Popularity Chart */}
          <div className="chart-card">
            <h3 className="chart-title">Popular Items</h3>
            {itemPopularityData.labels.length > 0 ? (
              <Pie 
                data={itemPopularityData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right',
                    }
                  }
                }}
              />
            ) : (
              <div className="no-data-message">No item data available.</div>
            )}
          </div>
        </div>

        {/* Popular Items Table */}
        <div className="table-card">
          <h3 className="table-title">Top Selling Items</h3>
          {popularItems.length > 0 ? (
            <div className="table-wrapper">
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Orders</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {popularItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.count}</td>
                      <td>₹{item.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data-message">No popular items data available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;