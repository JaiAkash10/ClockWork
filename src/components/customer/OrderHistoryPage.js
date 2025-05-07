import React from 'react';
import { Link } from 'react-router-dom';

const OrderHistoryPage = () => {
  const orderHistory = [
    {
      id: 101,
      date: '2025-04-15',
      items: 'Filter Coffee x1',
      price: 40,
      status: 'Delivered'
    },
    {
      id: 102,
      date: '2025-04-18',
      items: 'Cold Brew x2',
      price: 100,
      status: 'Delivered'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF5F0] transition-all duration-300">
      <nav className="bg-[#4A3C31] text-white p-4 shadow-lg backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-semibold hover:text-[#E6D5C3] transition-colors duration-300">Clockwork</div>
          <div className="space-x-6">
            <Link to="/" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Home</Link>
            <Link to="/menu" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Menu</Link>
            <Link to="/profile" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Profile</Link>
            <Link to="/cart" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Cart</Link>
            <Link to="/contact" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Contact Us</Link>
          </div>
        </div>
      </nav>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold text-[#4A3C31] transition-all duration-300">Order History</h1>
            </div>
            <Link 
              to="/profile" 
              className="px-6 py-3 bg-[#4A3C31] text-white rounded-lg hover:bg-[#3A2C21] transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4A3C31] focus:ring-offset-2 flex items-center gap-2"
            >
              <span>←</span>
              <span>Back to Profile</span>
            </Link>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
            {orderHistory.length === 0 ? (
              <p className="text-center text-gray-600">No orders found.</p>
            ) : (
              <div className="space-y-6">
                {orderHistory.map(order => (
                  <div 
                    key={order.id} 
                    className="border-b border-gray-100 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transform transition-all duration-300 hover:bg-[#FAF5F0] rounded-lg px-6"
                  >
                    <div>
                      <p className="font-medium text-lg text-[#4A3C31]">{order.items}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Order ID: #{order.id}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.date} • ₹{order.price}
                      </p>
                      <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        {order.status}
                      </span>
                    </div>
                    <div className="flex gap-3 sm:flex-col items-stretch sm:items-end">
                      <Link 
                        to="/menu" 
                        className="text-sm bg-[#4A3C31] text-white px-6 py-2 rounded-lg hover:bg-[#3A2C21] transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4A3C31] focus:ring-offset-2"
                      >
                        Reorder
                      </Link>
                      <button 
                        className="text-sm bg-[#E6D5C3] px-6 py-2 rounded-lg hover:bg-[#D4C3B1] transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4A3C31] focus:ring-offset-2"
                        onClick={() => window.print()}
                      >
                        Download Invoice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;