import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import Navbar from '../../Navbar'; // Import the Navbar component
import './CartPage.css'; // Import the CSS file
import { useCart } from '../../context/CartContext'; // Import useCart hook
import { useOrders } from '../../context/OrderContext'; // Import useOrders hook
import { useUsers } from '../../context/UserContext'; // Import useUsers hook

const CartPage = () => {
  const {
    cartItems,
    updateQuantity: updateCartQuantity, // Rename to avoid conflict if a local updateQuantity exists
    removeFromCart: removeFromCartContext,
    getCartTotal,
    clearCart
  } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();
  const { addOrder } = useOrders();
  const { currentUser, updateOrderHistory } = useUsers();

  const getUniqueKey = (item) => {
    // Handle different item types safely
    let variantInfo = '';
    
    if (item.id === 'b1') {
      // For filter coffee (b1), use size
      variantInfo = item.size || '';
    } else if (item.flavor) {
      // For items with flavor
      variantInfo = item.flavor || '';
    } else if (item.temperature) {
      // For items with temperature
      variantInfo = item.temperature || '';
    }
    
    // Create unique key with item id, add-ons, and variant info
    return `${item.id}-${item.addOns ? item.addOns.map(a => a.name).join(',') : ''}-${variantInfo}`;
  };

  const handleQuantityChange = (uniqueKey, delta) => {
    const itemToUpdate = cartItems.find(item => getUniqueKey(item) === uniqueKey);
    if (itemToUpdate) {
      const newQuantity = Math.max(1, (itemToUpdate.quantity || 1) + delta);
      updateCartQuantity(itemToUpdate.id, itemToUpdate.size, itemToUpdate.selectedAddOns || itemToUpdate.addOns, newQuantity);
    }
  };

  const handleRemoveItem = (uniqueKey) => {
    const itemToRemove = cartItems.find(item => getUniqueKey(item) === uniqueKey);
    if (itemToRemove) {
      removeFromCartContext(itemToRemove.id, itemToRemove.size, itemToRemove.selectedAddOns || itemToRemove.addOns);
      setToastMessage('Item removed from cart');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  // getTotal is now getCartTotal from context


  const handlePlaceOrder = () => {
    // Create order object
    const order = {
      customerName: currentUser ? currentUser.name : 'Guest User',
      customerId: currentUser ? currentUser.id : 'guest',
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity || 1,
        price: item.totalPrice || item.price,
        addOns: item.addOns || [],
        size: item.size,
        temperature: item.temperature,
        flavor: item.flavor
      })),
      total: getCartTotal(),
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
    clearCart();
    
    // Show toast and navigate
    setToastMessage('Order placed!');
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate('/order-confirmation', { state: { orderId } });
    }, 1500);
  };

  return (
    <div className="cart-container">
      <Navbar userType="customer" />
      {/* Main Content */}
      <main className="cart-main">
        <h2 className="cart-heading">Your Cart</h2>
        {cartItems.length === 0 ? (
          <div className="empty-cart">Your cart is empty.</div>
        ) : (
          <div>
            {cartItems.map((item) => {
              const uniqueKey = getUniqueKey(item);
              return (
                <div key={uniqueKey} className="cart-item">
                  <div>
                    <div className="item-name">
                      {item.name}{' '}
                      {/* Safely display variant information */}
                      {item.id === 'b1' && item.size && `(${item.size})`}
                      {item.id !== 'b1' && item.flavor && `(${item.flavor})`}
                      {item.id !== 'b1' && !item.flavor && item.temperature && `(${item.temperature})`}
                    </div>
                    <div className="item-price">₹{item.totalPrice || item.price}</div>
                    {item.addOns && item.addOns.length > 0 && (
                      <div className="item-addons">
                        Add-ons: {item.addOns.map((a) => a.name).join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="item-actions">
                    <button onClick={() => handleQuantityChange(uniqueKey, -1)} className="qty-btn">-</button>
                    <span>{item.quantity || 1}</span>
                    <button onClick={() => handleQuantityChange(uniqueKey, 1)} className="qty-btn">+</button>
                    <button onClick={() => handleRemoveItem(uniqueKey)} className="remove-btn">
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="cart-total">
              <span>Total:</span>
              <span>₹{getCartTotal()}</span>
            </div>
            <button onClick={handlePlaceOrder} className="place-order-btn">
              Place Order
            </button>
          </div>
        )}
      </main>

      {showToast && (
        <div className="toast">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default CartPage;
