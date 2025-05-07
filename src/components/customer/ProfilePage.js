import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Settings from '../common/Settings';

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
    <div className="min-h-screen bg-[#FAF5F0] transition-all duration-300">
      {/* Navbar */}
      <nav className="bg-[#4A3C31] text-white p-4 shadow-lg backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-semibold hover:text-[#E6D5C3] transition-colors duration-300">Clockwork</div>
          <div className="space-x-6">
            <a href="/" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Home</a>
            <a href="/menu" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Menu</a>
            <a href="/profile" className="text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-full after:bg-[#E6D5C3]">Profile</a>
            <a href="/cart" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Cart</a>
            <a href="/contact" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Contact Us</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-[#4A3C31] transition-all duration-300">Your Profile</h1>

          {/* User Info */}
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 transform transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-[#E6D5C3] flex items-center justify-center text-2xl font-semibold text-[#4A3C31] transition-all duration-300 hover:bg-[#D4C3B1]">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1">
                {editMode ? (
                  <div className="space-y-4">
                    <input 
                      className="w-full border-2 p-3 rounded-lg focus:ring-2 focus:ring-[#4A3C31] focus:border-[#4A3C31] transition-all duration-300" 
                      value={user.name} 
                      onChange={e => setUser({ ...user, name: e.target.value })} 
                      placeholder="Your Name"
                    />
                    <input 
                      className="w-full border-2 p-3 rounded-lg focus:ring-2 focus:ring-[#4A3C31] focus:border-[#4A3C31] transition-all duration-300" 
                      value={user.email} 
                      onChange={e => setUser({ ...user, email: e.target.value })} 
                      placeholder="Your Email"
                    />
                    <input 
                      className="w-full border-2 p-3 rounded-lg focus:ring-2 focus:ring-[#4A3C31] focus:border-[#4A3C31] transition-all duration-300" 
                      value={user.phone} 
                      onChange={e => setUser({ ...user, phone: e.target.value })} 
                      placeholder="Your Phone"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="font-semibold text-xl text-[#4A3C31]">{user.name}</p>
                    <p className="text-gray-600 transition-all duration-300">{user.email}</p>
                    <p className="text-gray-600 transition-all duration-300">{user.phone}</p>
                  </div>
                )}
              </div>
              <button 
                onClick={handleEditToggle} 
                className="px-6 py-3 bg-[#4A3C31] text-white rounded-lg hover:bg-[#3A2C21] transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4A3C31] focus:ring-offset-2"
              >
                {editMode ? 'Save' : 'Edit'}
              </button>
            </div>
          </div>

          {/* Order History */}
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 transform transition-all duration-300 hover:shadow-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-[#4A3C31]">Order History</h2>
              <button 
                onClick={() => navigate('/order-history')}
                className="text-sm bg-[#E6D5C3] px-4 py-2 rounded-lg hover:bg-[#D4C3B1] transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4A3C31] focus:ring-offset-2"
              >
                View All Orders
              </button>
            </div>
          </div>

          {/* Settings Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 transform transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 text-[#4A3C31]">Settings</h2>
            <Settings />
          </div>

          {/* Favorites */}
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 transform transition-all duration-300 hover:shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-[#4A3C31]">Favorites</h2>
              <button 
                onClick={() => setShowFavorites(!showFavorites)}
                className="text-sm bg-[#E6D5C3] px-4 py-2 rounded-lg hover:bg-[#D4C3B1] transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4A3C31] focus:ring-offset-2"
              >
                {showFavorites ? 'Hide Favorites' : 'Show Favorites'}
              </button>
            </div>
          </div>

          {/* Loyalty/Rewards */}
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 transform transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 text-[#4A3C31]">Loyalty Program</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#FAF5F0] p-4 rounded-lg">
                <div>
                  <p className="font-semibold text-[#4A3C31]">Loyalty Points</p>
                  <p className="text-2xl font-bold text-[#557C55]">250 points</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Next Reward at</p>
                  <p className="font-medium text-[#4A3C31]">500 points</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  if (window.confirm('Would you like to redeem 250 points for a free beverage?')) {
                    alert('Points redeemed successfully! A free beverage coupon has been added to your account.');
                  }
                }} 
                className="w-full px-6 py-3 bg-[#557C55] text-white rounded-lg hover:bg-[#446644] transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#557C55] focus:ring-offset-2"
              >
                Redeem Points
              </button>
            </div>
          </div>

          {/* Support/Help */}
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 transform transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 text-[#4A3C31]">Support & Help</h2>
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/faq')} 
                className="w-full px-6 py-3 border-2 border-[#4A3C31] text-[#4A3C31] rounded-lg hover:bg-[#4A3C31] hover:text-white transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4A3C31] focus:ring-offset-2"
              >
                FAQ
              </button>
              <button 
                onClick={() => navigate('/contact')} 
                className="w-full px-6 py-3 border-2 border-[#4A3C31] text-[#4A3C31] rounded-lg hover:bg-[#4A3C31] hover:text-white transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4A3C31] focus:ring-offset-2"
              >
                Contact Support
              </button>
            </div>
          </div>



          {/* Favorites Modal */}
          {showFavorites && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto transform transition-all duration-300 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-semibold text-[#4A3C31]">Your Favorite Items</h3>
                  <button 
                    onClick={() => setShowFavorites(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map(fav => (
                    <div key={fav.id} className="bg-[#FAF5F0] p-6 rounded-xl shadow-md flex flex-col items-center transform transition-all duration-300 hover:shadow-lg hover:scale-105">
                      <div className="w-24 h-24 rounded-full overflow-hidden mb-4 ring-4 ring-[#E6D5C3] transition-all duration-300 hover:ring-[#D4C3B1]">
                        <img src={fav.image} alt={fav.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="font-medium text-lg text-[#4A3C31] mb-4">{fav.name}</p>
                      <div className="flex gap-3 w-full">
                        <button 
                          onClick={() => navigate('/menu')} 
                          className="flex-1 text-sm bg-[#4A3C31] text-white px-4 py-2 rounded-lg hover:bg-[#3A2C21] transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4A3C31] focus:ring-offset-2"
                        >
                          Add to Cart
                        </button>
                        <button 
                          onClick={() => setFavorites(prevFavs => prevFavs.filter(f => f.id !== fav.id))} 
                          className="text-sm bg-red-100 text-red-500 px-4 py-2 rounded-lg hover:bg-red-200 transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
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
