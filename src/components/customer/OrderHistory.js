import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { useUsers } from '../../context/UserContext';

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
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A3C31]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-semibold text-[#4A3C31] mb-4">Order History</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
          <Link 
            to="/menu" 
            className="inline-block bg-[#4A3C31] text-white px-6 py-2 rounded-lg hover:bg-[#5D4B3C] transition-colors duration-300"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#4A3C31]">Order #{order.id.slice(-6)}</h3>
                  <p className="text-sm text-gray-600">{formatDate(order.orderTime)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Processing'}
                </span>
              </div>
              
              <div className="space-y-2">
                {order.items && order.items.map((item, index) => (
                  <div key={index} className="flex justify-between py-2 border-t border-gray-100">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      {item.size && <span className="text-gray-600 ml-2">({item.size})</span>}
                      {item.temperature && <span className="text-gray-600 ml-2">({item.temperature})</span>}
                      {item.flavor && <span className="text-gray-600 ml-2">({item.flavor})</span>}
                      {item.addOns && item.addOns.length > 0 && (
                        <div className="text-sm text-gray-500 ml-4">
                          + {item.addOns.map(addon => addon.name).join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div>x{item.quantity}</div>
                      <div className="font-medium">₹{(item.totalPrice * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg text-[#4A3C31]">
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