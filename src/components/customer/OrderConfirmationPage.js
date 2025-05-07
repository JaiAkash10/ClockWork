import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { useOrderTracking } from '../../context/OrderTrackingContext';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const { orders } = useOrders();
  const { 
    activeOrder, 
    startOrderTracking, 
    formattedTime, 
    isTimerActive 
  } = useOrderTracking();
  
  // Get orderId from location state or localStorage
  const orderId = location.state?.orderId || localStorage.getItem('activeOrderId');
  
  // Start tracking the order when component mounts
  useEffect(() => {
    if (orderId) {
      startOrderTracking(orderId);
    }
  }, [orderId, startOrderTracking]);
  
  // Find the order details
  const orderDetails = activeOrder || orders.find(order => order.id === orderId);

  return (
    <div className="min-h-screen bg-[#FAF5F0] flex flex-col">
      <nav className="bg-[#4A3C31] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-semibold">Clockwork</div>
          <div className="space-x-6">
            <Link to="/" className="hover:text-[#E6D5C3] transition-colors duration-300">Home</Link>
            <Link to="/menu" className="hover:text-[#E6D5C3] transition-colors duration-300">Menu</Link>
            <Link to="/profile" className="hover:text-[#E6D5C3] transition-colors duration-300">Profile</Link>
            <Link to="/cart" className="hover:text-[#E6D5C3] transition-colors duration-300">Cart</Link>
            <Link to="/contact" className="hover:text-[#E6D5C3] transition-colors duration-300">Contact Us</Link>
          </div>
        </div>
      </nav>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center mx-auto">
          <div className="text-5xl mb-4 text-[#4A3C31]">☕</div>
          <h2 className="text-3xl font-serif mb-3 text-[#4A3C31]">Thank you for your order!</h2>
          
          {orderDetails ? (
            <>
              <div className="bg-[#557C55] text-white rounded-lg py-2 px-4 mb-3 font-semibold">
                Order ID: {orderId && orderId.replace('order_', '#')}
              </div>
              
              <p className="text-[#6B4F36] mb-3">We'll notify you when it's ready for pickup.</p>
              
              {isTimerActive && (
                <div className="bg-[#FAE7D6] text-[#4A3C31] rounded-lg p-3 mb-4 font-medium shadow-sm">
                  <div className="mb-1">Estimated time remaining:</div>
                  <div className="text-2xl font-bold">{formattedTime}</div>
                </div>
              )}
              
              <div className="bg-gray-50 rounded-lg p-4 mb-5 text-left">
                <h3 className="text-lg text-[#4A3C31] mb-3 pb-2 border-b border-[#E6D5C3]">Order Details</h3>
                
                {orderDetails.items && orderDetails.items.map((item, index) => (
                  <div key={index} className={`mb-3 pb-2 ${index < orderDetails.items.length - 1 ? 'border-b border-dashed border-gray-200' : ''}`}>
                    <div className="flex justify-between">
                      <span className="font-medium">{item.name} × {item.quantity}</span>
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
                
                <div className="flex justify-between font-semibold mt-3 pt-2 border-t border-[#E6D5C3]">
                  <span>Total</span>
                  <span>₹{orderDetails.total}</span>
                </div>
              </div>
              
              <div className="bg-[#F0F7F0] rounded-lg p-3 mb-5 text-sm">
                <div className="font-medium text-[#557C55] mb-1">Order Status</div>
                <div className="capitalize">
                  {orderDetails.status || 'Pending'}
                </div>
              </div>
            </>
          ) : (
            <p className="text-[#6B4F36] mb-4">Loading order details...</p>
          )}
          
          <div className="flex flex-col gap-3">
            <Link to="/" className="w-full">
              <button className="w-full bg-[#4A3C31] text-white py-3 rounded-lg shadow hover:bg-[#3A2C21] transform transition-all duration-300 hover:scale-105">
                Return Home
              </button>
            </Link>
            <Link to="/menu" className="w-full">
              <button className="w-full bg-[#E6D5C3] text-[#4A3C31] py-3 rounded-lg shadow hover:bg-[#D4C3B1] transform transition-all duration-300 hover:scale-105">
                Browse Menu Again
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmationPage;