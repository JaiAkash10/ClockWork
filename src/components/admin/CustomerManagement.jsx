import React, { useState, useEffect } from 'react';
import Navbar from '../../Navbar'; // Import the Navbar component
import '../../styles/CustomerManagement.css'; // Import the CSS file

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
    <div className="customer-management-container">
      <Navbar userType="admin" />
      {/* Main Content */}
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Customer Management</h1>
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <svg
              className="search-icon"
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
        <div className="customers-grid">
          {filteredCustomers.map(customer => (
            <div
              key={customer.id}
              onClick={() => handleCustomerClick(customer)}
              className="customer-card"
            >
              <div className="customer-header">
                <div className="customer-avatar">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="customer-name">{customer.name}</h3>
                  <p className="customer-email">{customer.email}</p>
                </div>
              </div>
              <div className="customer-info">
                <p className="info-item">Total Orders: {customer.totalOrders}</p>
                <p className="info-item">Total Spent: ₹{customer.totalSpent.toFixed(2)}</p>
                <p className="info-item">Joined: {customer.joinDate}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Details Modal */}
        {showCustomerDetails && selectedCustomer && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <div className="customer-profile">
                  <div className="profile-avatar">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="profile-name">{selectedCustomer.name}</h2>
                    <p className="profile-email">{selectedCustomer.email}</p>
                    <p className="profile-phone">{selectedCustomer.phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCustomerDetails(false)}
                  className="close-button"
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                {/* Customer Stats */}
                <div className="stats-section">
                  <div>
                    <h3 className="section-title">Customer Stats</h3>
                    <div className="stats-card">
                      <p>Join Date: {selectedCustomer.joinDate}</p>
                      <p>Total Orders: {selectedCustomer.totalOrders}</p>
                      <p>Total Spent: ₹{selectedCustomer.totalSpent.toFixed(2)}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="section-title">Favorite Items</h3>
                    <div className="favorites-card">
                      <ul className="favorites-list">
                        {selectedCustomer.favoriteItems.length > 0 ? (
                          selectedCustomer.favoriteItems.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))
                        ) : (
                          <p>No favorite items.</p>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Order History */}
                <div>
                  <h3 className="section-title">Order History</h3>
                  <div className="orders-list">
                    {selectedCustomer.orderHistory.length > 0 ? (
                      selectedCustomer.orderHistory.map(order => (
                        <div key={order.id} className="order-card">
                          <div className="order-details">
                            <div>
                              <p className="order-id">Order #{order.id}</p>
                              <p className="order-date">{order.date}</p>
                              <p className="order-items">{order.items}</p>
                            </div>
                            <div className="order-summary">
                              <p className="order-total">₹{order.total.toFixed(2)}</p>
                              <span className={`order-status status-${order.status?.toLowerCase()}`}>{order.status}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No order history.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Requests/Complaints */}
              {selectedCustomer.requests && selectedCustomer.requests.length > 0 && (
                <div className="requests-section">
                  <h3 className="section-title">Customer Requests</h3>
                  <div className="requests-list">
                    {selectedCustomer.requests.map(request => (
                      <div key={request.id} className="request-card">
                        <div className="request-header">
                          <div>
                            <p className="request-type">{request.type}</p>
                            <p className="request-date">{request.date}</p>
                          </div>
                          <span className={`status-badge ${
                            request.status === 'Resolved'
                              ? 'status-resolved'
                              : 'status-pending'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        <p className="request-message">{request.message}</p>
                        {request.response ? (
                          <p className="request-response">Response: {request.response}</p>
                        ) : (
                          <div className="response-form">
                            <textarea
                              placeholder="Type your response..."
                              className="response-textarea"
                            />
                            <button
                              onClick={() => handleAddResponse(selectedCustomer.id, request.id, 'Thank you for your feedback. We will look into this.')}
                              className="send-button"
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