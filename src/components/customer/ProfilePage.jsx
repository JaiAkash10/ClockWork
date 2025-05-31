import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Settings from '../admin/Settings';
import Navbar from '../../Navbar'; // Import the Navbar component
import './ProfilePage.css'; // Import the CSS file

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210'
    };
  });
  const [editMode, setEditMode] = useState(false);
  const [pickupTime, setPickupTime] = useState(() => localStorage.getItem('pickupTime') || '10:00 AM');
  const [reminders, setReminders] = useState(() => localStorage.getItem('reminders') === 'true');
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Removed hardcoded orderHistory state

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [orderHistory] = useState([
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
  ]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('pickupTime', pickupTime);
  }, [pickupTime]);

  useEffect(() => {
    localStorage.setItem('reminders', reminders);
  }, [reminders]);

  const handleEditToggle = () => {
    if (editMode) {
      if (!user.name || !user.email || !user.phone) {
        alert('Please fill in all fields');
        return;
      }
      if (!user.email.includes('@')) {
        alert('Please enter a valid email address');
        return;
      }
    }
    setEditMode(!editMode);
  };

  return (
    <div className="profile-container">
      <Navbar userType="customer" />
      {/* Main Content */}
      <div className="main-content">
        <div className="profile-content">
          <h1 className="profile-title">Your Profile</h1>

          {/* User Info */}
          <div className="user-info">
            <div className="user-details">
              <div className="user-avatar">
                {user.name.charAt(0)}
              </div>
              <div className="user-data">
                {editMode ? (
                  <div className="user-edit-form">
                    <input 
                      className="input-name"
                      value={user.name}
                      onChange={e => setUser({ ...user, name: e.target.value })} 
                      placeholder="Your Name"
                    />
                    <input 
                      className="input-email"
                      value={user.email}
                      onChange={e => setUser({ ...user, email: e.target.value })} 
                      placeholder="Your Email"
                    />
                    <input 
                      className="input-phone"
                      value={user.phone}
                      onChange={e => setUser({ ...user, phone: e.target.value })} 
                      placeholder="Your Phone"
                    />
                  </div>
                ) : (
                  <div className="user-display-info">
                    <p className="display-name">{user.name}</p>
                    <p className="display-email">{user.email}</p>
                    <p className="display-phone">{user.phone}</p>
                  </div>
                )}
              </div>
              <button onClick={handleEditToggle} className="edit-btn">
                {editMode ? 'Save' : 'Edit'}
              </button>
            </div>
          </div>

          {/* Order History */}
          <div className="order-history-section">
            <div className="order-history-header">
              <h2 className="order-history-title">Order History</h2>
              <button onClick={() => navigate('/order-history')} className="view-orders-btn">
                View All Orders
              </button>
            </div>
          </div>

          {/* Settings Section */}
          <div className="settings-section">
            <h2 className="settings-title">Settings</h2>
            <Settings />
          </div>

          {/* Favorites */}
          <div className="favorites-section">
            <div className="favorites-header">
              <h2 className="favorites-title">Favorites</h2>
              <button onClick={() => setShowFavorites(!showFavorites)} className="toggle-favorites-btn">
                {showFavorites ? 'Hide Favorites' : 'Show Favorites'}
              </button>
            </div>
          </div>

          {/* Loyalty/Rewards */}
          <div className="loyalty-section">
            <h2 className="loyalty-title">Loyalty Program</h2>
            <div className="loyalty-box">
              <div className="loyalty-info">
                <div>
                  <p className="points-label">Loyalty Points</p>
                  <p className="points-value">250 points</p>
                </div>
                <div className="next-reward">
                  <p className="next-label">Next Reward at</p>
                  <p className="next-value">500 points</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Would you like to redeem 250 points for a free beverage?')) {
                    alert('Points redeemed successfully! A free beverage coupon has been added to your account.');
                  }
                }}
                className="redeem-btn"
              >
                Redeem Points
              </button>
            </div>
          </div>

          {/* Support/Help */}
          <div className="support-section">
            <h2 className="support-title">Support & Help</h2>
            <div className="support-buttons">
              <button onClick={() => navigate('/faq')} className="faq-btn">
                FAQ
              </button>
              <button onClick={() => navigate('/contact')} className="contact-support-btn">
                Contact Support
              </button>
            </div>
          </div>

          {/* Favorites Modal */}
          {showFavorites && (
            <div className="favorites-modal">
              <div className="favorites-modal-content">
                <div className="favorites-modal-header">
                  <h3 className="favorites-modal-title">Your Favorite Items</h3>
                  <button onClick={() => setShowFavorites(false)} className="favorites-close-btn">
                    <svg className="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="favorites-list">
                  {favorites.map(fav => (
                    <div key={fav.id} className="favorite-item">
                      <div className="favorite-img-container">
                        <img src={fav.image} alt={fav.name} className="favorite-img" />
                      </div>
                      <p className="favorite-name">{fav.name}</p>
                      <div className="favorite-actions">
                        <button onClick={() => navigate('/menu')} className="add-to-cart-btn">
                          Add to Cart
                        </button>
                        <button onClick={() => setFavorites(prevFavs => prevFavs.filter(f => f.id !== fav.id))} className="remove-favorite-btn">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
