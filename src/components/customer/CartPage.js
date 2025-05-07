import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { useUsers } from '../../context/UserContext';

const CartPage = ({ cart, setCart }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();
  const { addOrder } = useOrders();
  const { currentUser, updateOrderHistory } = useUsers();

  const getUniqueKey = (item) => {
    return `${item.id}-${item.addOns ? item.addOns.map(a => a.name).join(',') : ''}-${item.id === 'b1' ? item.size : item.variants?.[0]?.flavor || item.variants?.[0]?.type ? item.flavor : item.temperature || ''}`;
  };

  const handleQuantityChange = (uniqueKey, delta) => {
    setCart(prevCart =>
      prevCart.map(item =>
        getUniqueKey(item) === uniqueKey
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
          : item
      )
    );
  };

  const handleRemoveItem = (uniqueKey) => {
    setCart(prevCart => prevCart.filter(item => getUniqueKey(item) !== uniqueKey));
    setToastMessage('Item removed from cart');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const getTotal = () => {
    return cart.reduce(
      (sum, item) =>
        sum + (item.totalPrice || item.price) * (item.quantity || 1),
      0
    );
  };

  const handlePlaceOrder = () => {
    // Create order object
    const order = {
      customerName: currentUser ? currentUser.name : 'Guest User',
      customerId: currentUser ? currentUser.id : 'guest',
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity || 1,
        price: item.totalPrice || item.price,
        addOns: item.addOns || [],
        size: item.size,
        temperature: item.temperature,
        flavor: item.flavor
      })),
      total: getTotal(),
      status: 'pending',
      orderTime: new Date().toISOString(),
      pickupTime: new Date(Date.now() + 30 * 60000).toISOString(), // 30 minutes from now
      specialInstructions: ''
    };
    
    // Add order to context
    const orderId = addOrder(order);
    
    // Update user's order history if logged in
    if (currentUser) {
      updateOrderHistory(currentUser.id, {
        id: orderId,
        date: order.orderTime,
        items: order.items.map(item => `${item.name} x${item.quantity}`).join(', '),
        total: order.total,
        status: order.status
      });
    }
    
    // Store order ID in localStorage for tracking
    localStorage.setItem('activeOrderId', orderId);
    
    // Clear cart
    localStorage.removeItem('cart');
    setCart([]);
    
    // Show toast and navigate
    setToastMessage('Order placed!');
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate('/order-confirmation', { state: { orderId } });
    }, 1500);
  };

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <div className="min-h-screen bg-[#FAF5F0]">
      <nav className="bg-[#4A3C31] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-semibold">Clockwork</div>
          <div className="space-x-6">
            <a href="/" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Home</a>
            <a href="/menu" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Menu</a>
            <a href="/profile" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Profile</a>
            <a href="/cart" className="text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-full after:bg-[#E6D5C3]">Cart ({cart.length})</a>
            <a href="/contact" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Contact Us</a>
          </div>
        </div>
      </nav>
      <main className="max-w-2xl mx-auto my-8 bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-serif mb-6 text-[#4A3C31]">Your Cart</h2>
        {cart.length === 0 ? (
          <div className="text-center text-[#6B4E3D]">Your cart is empty.</div>
        ) : (
          <div>
            {cart.map((item) => {
              const uniqueKey = getUniqueKey(item);
              return (
                <div
                  key={uniqueKey}
                  className="flex items-center justify-between mb-6 border-b pb-3"
                >
                  <div>
                  <div className="font-semibold text-lg">
                    {item.name} {item.id === 'b1' ? item.size && `(${item.size})` : item.variants?.[0]?.flavor || item.variants?.[0]?.type ? `(${item.flavor})` : item.temperature && `(${item.temperature})`}
                  </div>
                    <div className="text-[#6B4E3D] text-sm">₹{item.totalPrice || item.price}</div>
                    {item.addOns && item.addOns.length > 0 && (
                      <div className="text-sm text-[#557C55]">
                        Add-ons: {item.addOns.map((a) => a.name).join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(uniqueKey, -1)}
                      className="bg-[#557C55] text-white rounded w-7 h-7 text-lg hover:bg-[#446644] transform transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#557C55] focus:ring-offset-2"
                    >-</button>
                    <span>{item.quantity || 1}</span>
                    <button
                      onClick={() => handleQuantityChange(uniqueKey, 1)}
                      className="bg-[#557C55] text-white rounded w-7 h-7 text-lg hover:bg-[#446644] transform transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#557C55] focus:ring-offset-2"
                    >+</button>
                    <button
                      onClick={() => handleRemoveItem(uniqueKey)}
                      className="ml-3 bg-[#4A3C31] text-white rounded px-3 py-1 hover:bg-[#3A2C21] transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4A3C31] focus:ring-offset-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="flex justify-between font-semibold text-lg mt-6">
              <span>Total:</span>
              <span>₹{getTotal()}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="mt-6 w-full bg-[#557C55] text-white py-3 rounded-full shadow hover:bg-[#446644] transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#557C55] focus:ring-offset-2"
            >
              Place Order
            </button>
          </div>
        )}
      </main>
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-[#4A3C31] text-white py-3 px-6 rounded-lg shadow-lg text-sm z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default CartPage;
