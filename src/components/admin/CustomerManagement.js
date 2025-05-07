import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Remove the import that's causing the error
// import { useAuth } from '../../context/AuthContext';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  // Remove the line that uses useAuth
  // const { users } = useAuth();

  // Load real customer data from localStorage
  useEffect(() => {
    // Get users from localStorage
    const savedUsers = localStorage.getItem('users');
    const savedOrders = localStorage.getItem('orders');
    const savedFavorites = localStorage.getItem('favorites');
    
    let parsedUsers = [];
    let parsedOrders = [];
    let parsedFavorites = [];
    
    try {
      if (savedUsers) parsedUsers = JSON.parse(savedUsers);
      if (savedOrders) parsedOrders = JSON.parse(savedOrders);
      if (savedFavorites) parsedFavorites = JSON.parse(savedFavorites);
      
      // If no users found, check for current user
      if (parsedUsers.length === 0) {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
          parsedUsers = [JSON.parse(currentUser)];
        }
      }
      
      // Map users to the format expected by the component
      const mappedCustomers = parsedUsers.map(user => {
        // Find orders for this user
        const userOrders = parsedOrders.filter(order => order.customerId === user.id);
        // Find favorites for this user
        const userFavorites = parsedFavorites || [];
        
        return {
          id: user.id,
          name: user.name || user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous',
          email: user.email || 'No email',
          phone: user.phone || 'No phone number',
          joinDate: user.createdAt || new Date().toISOString().split('T')[0],
          totalOrders: userOrders.length,
          totalSpent: userOrders.reduce((sum, order) => sum + (order.total || 0), 0),
          favoriteItems: userFavorites.map(fav => fav.name || 'Unknown item'),
          orderHistory: userOrders.map(order => ({
            id: order.id,
            date: new Date(order.orderTime).toISOString().split('T')[0],
            items: order.items?.map(item => `${item.name} x${item.quantity}`).join(', ') || 'No items',
            total: order.total || 0,
            status: order.status || 'Unknown'
          })),
          requests: user.requests || []
        };
      });
      
      setCustomers(mappedCustomers);
    } catch (error) {
      console.error("Error parsing user data:", error);
      // Fallback to empty array if parsing fails
      setCustomers([]);
    }
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetails(true);
  };

  const handleAddResponse = (customerId, requestId, response) => {
    setCustomers(customers.map(customer => {
      if (customer.id === customerId) {
        return {
          ...customer,
          requests: customer.requests.map(request =>
            request.id === requestId
              ? { ...request, response, status: 'Resolved' }
              : request
          )
        };
      }
      return customer;
    }));
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
            <Link to="/admin/customers" className="text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-full after:bg-[#E6D5C3]">Customers</Link>
            <Link to="/admin/inventory" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Inventory</Link>
            <Link to="/admin/analytics" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Analytics</Link>
            <Link to="/admin/settings" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Settings</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#4A3C31]">Customer Management</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 p-2 pl-8 border rounded-lg focus:ring-2 focus:ring-[#4A3C31] focus:border-[#4A3C31]"
            />
            <svg
              className="w-4 h-4 absolute left-2 top-3 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Customers List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map(customer => (
            <div
              key={customer.id}
              onClick={() => handleCustomerClick(customer)}
              className="bg-white p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#E6D5C3] flex items-center justify-center text-xl font-semibold text-[#4A3C31]">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#4A3C31]">{customer.name}</h3>
                  <p className="text-sm text-gray-600">{customer.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Total Orders: {customer.totalOrders}</p>
                <p className="text-sm text-gray-600">Total Spent: ₹{customer.totalSpent}</p>
                <p className="text-sm text-gray-600">Joined: {customer.joinDate}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Details Modal */}
        {showCustomerDetails && selectedCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#E6D5C3] flex items-center justify-center text-2xl font-semibold text-[#4A3C31]">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-[#4A3C31]">{selectedCustomer.name}</h2>
                    <p className="text-gray-600">{selectedCustomer.email}</p>
                    <p className="text-gray-600">{selectedCustomer.phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCustomerDetails(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer Stats */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#4A3C31] mb-3">Customer Stats</h3>
                    <div className="bg-[#FAF5F0] p-4 rounded-lg space-y-2">
                      <p>Join Date: {selectedCustomer.joinDate}</p>
                      <p>Total Orders: {selectedCustomer.totalOrders}</p>
                      <p>Total Spent: ₹{selectedCustomer.totalSpent}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#4A3C31] mb-3">Favorite Items</h3>
                    <div className="bg-[#FAF5F0] p-4 rounded-lg">
                      <ul className="list-disc list-inside">
                        {selectedCustomer.favoriteItems.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Order History */}
                <div>
                  <h3 className="text-lg font-semibold text-[#4A3C31] mb-3">Order History</h3>
                  <div className="space-y-3">
                    {selectedCustomer.orderHistory.map(order => (
                      <div key={order.id} className="bg-[#FAF5F0] p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-gray-600">{order.date}</p>
                            <p className="text-sm">{order.items}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{order.total}</p>
                            <p className="text-sm text-green-600">{order.status}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Customer Requests/Complaints */}
              {selectedCustomer.requests.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-[#4A3C31] mb-3">Customer Requests</h3>
                  <div className="space-y-4">
                    {selectedCustomer.requests.map(request => (
                      <div key={request.id} className="bg-[#FAF5F0] p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{request.type}</p>
                            <p className="text-sm text-gray-600">{request.date}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-sm ${
                            request.status === 'Resolved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{request.message}</p>
                        {request.response ? (
                          <p className="text-sm text-gray-600">Response: {request.response}</p>
                        ) : (
                          <div className="mt-2">
                            <textarea
                              placeholder="Type your response..."
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#4A3C31] focus:border-[#4A3C31]"
                            />
                            <button
                              onClick={() => handleAddResponse(selectedCustomer.id, request.id, 'Thank you for your feedback. We will improve our service.')}
                              className="mt-2 px-4 py-2 bg-[#557C55] text-white rounded-lg hover:bg-[#446644] transition-all duration-300"
                            >
                              Send Response
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;