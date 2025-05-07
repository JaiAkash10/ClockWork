import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

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
            <Link to="/admin/analytics" className="text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-full after:bg-[#E6D5C3]">Analytics</Link>
            <Link to="/admin/settings" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Settings</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#4A3C31]">Analytics Dashboard</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                timeRange === 'week' ? 'bg-[#4A3C31] text-white' : 'bg-[#E6D5C3] text-[#4A3C31] hover:bg-[#D4C3B1]'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                timeRange === 'month' ? 'bg-[#4A3C31] text-white' : 'bg-[#E6D5C3] text-[#4A3C31] hover:bg-[#D4C3B1]'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                timeRange === 'year' ? 'bg-[#4A3C31] text-white' : 'bg-[#E6D5C3] text-[#4A3C31] hover:bg-[#D4C3B1]'
              }`}
            >
              Year
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-[#4A3C31] mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-[#557C55]">{orderData.totalOrders}</p>
            <div className="flex justify-between mt-4">
              <span className="text-sm text-gray-600">Pending: {orderData.pendingOrders}</span>
              <span className="text-sm text-gray-600">Completed: {orderData.completedOrders}</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-[#4A3C31] mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-[#557C55]">₹{orderData.totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-gray-600 mt-4">Avg. Order: ₹{orderData.averageOrderValue.toFixed(2)}</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-[#4A3C31] mb-2">Customers</h3>
            <p className="text-3xl font-bold text-[#557C55]">{customerStats.totalCustomers}</p>
            <div className="flex justify-between mt-4">
              <span className="text-sm text-gray-600">New: {customerStats.newCustomers}</span>
              <span className="text-sm text-gray-600">Returning: {customerStats.returningCustomers}</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-[#4A3C31] mb-2">Most Popular</h3>
            <p className="text-xl font-bold text-[#557C55]">
              {popularItems.length > 0 ? popularItems[0].name : 'No data'}
            </p>
            <p className="text-sm text-gray-600 mt-4">
              {popularItems.length > 0 ? `${popularItems[0].count} orders` : ''}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-[#4A3C31] mb-4">Sales Trend</h3>
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
                      display: false
                    }
                  }
                }}
              />
            ) : (
              <div className="flex justify-center items-center h-64 text-gray-500">
                No sales data available for the selected period
              </div>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-[#4A3C31] mb-4">Popular Items</h3>
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
              <div className="flex justify-center items-center h-64 text-gray-500">
                No item data available
              </div>
            )}
          </div>
        </div>

        {/* Popular Items Table */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <h3 className="text-lg font-semibold text-[#4A3C31] mb-4">Top Selling Items</h3>
          {popularItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {popularItems.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.count}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{item.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">No data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;