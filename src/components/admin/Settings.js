import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [generalSettings, setGeneralSettings] = useState({
    cafeName: 'Clockwork Cafe',
    address: '123 Coffee Lane, Bangalore, India',
    phone: '+91 9876543210',
    email: 'info@clockworkcafe.com',
    openingTime: '07:00',
    closingTime: '20:00',
    weekendOpeningTime: '08:00',
    weekendClosingTime: '21:00'
  });
  const [notificationSettings, setNotificationSettings] = useState({
    orderNotifications: true,
    inventoryAlerts: true,
    customerFeedback: true,
    marketingEmails: false
  });
  const [userAccounts, setUserAccounts] = useState([
    { id: 1, name: 'Admin User', email: 'admin@clockworkcafe.com', role: 'Admin', lastLogin: '2024-01-20 09:30 AM' },
    { id: 2, name: 'Staff Member', email: 'staff@clockworkcafe.com', role: 'Staff', lastLogin: '2024-01-19 02:15 PM' }
  ]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Staff', password: '' });
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const handleGeneralSettingsChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationSettingsChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddUser = () => {
    const newId = userAccounts.length > 0 ? Math.max(...userAccounts.map(user => user.id)) + 1 : 1;
    const currentDate = new Date().toLocaleString();
    
    setUserAccounts([...userAccounts, {
      id: newId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      lastLogin: 'Never'
    }]);
    
    setNewUser({ name: '', email: '', role: 'Staff', password: '' });
    setShowAddUserModal(false);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUserAccounts(userAccounts.filter(user => user.id !== id));
    }
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to a database
    alert('Settings saved successfully!');
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
            <Link to="/admin/analytics" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Analytics</Link>
            <Link to="/admin/settings" className="text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-full after:bg-[#E6D5C3]">Settings</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#4A3C31] mb-8">Settings</h1>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-3 text-lg font-medium ${activeTab === 'general' ? 'text-[#557C55] border-b-2 border-[#557C55]' : 'text-gray-500 hover:text-[#4A3C31]'}`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-6 py-3 text-lg font-medium ${activeTab === 'notifications' ? 'text-[#557C55] border-b-2 border-[#557C55]' : 'text-gray-500 hover:text-[#4A3C31]'}`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 text-lg font-medium ${activeTab === 'users' ? 'text-[#557C55] border-b-2 border-[#557C55]' : 'text-gray-500 hover:text-[#4A3C31]'}`}
            >
              User Accounts
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#4A3C31] mb-4">General Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Cafe Name</label>
                    <input
                      type="text"
                      name="cafeName"
                      value={generalSettings.cafeName}
                      onChange={handleGeneralSettingsChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={generalSettings.address}
                      onChange={handleGeneralSettingsChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={generalSettings.phone}
                      onChange={handleGeneralSettingsChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={generalSettings.email}
                      onChange={handleGeneralSettingsChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                    />
                  </div>
                </div>

                <h3 className="text-xl font-medium text-[#4A3C31] mt-6 mb-4">Business Hours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Weekday Opening Time</label>
                    <input
                      type="time"
                      name="openingTime"
                      value={generalSettings.openingTime}
                      onChange={handleGeneralSettingsChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Weekday Closing Time</label>
                    <input
                      type="time"
                      name="closingTime"
                      value={generalSettings.closingTime}
                      onChange={handleGeneralSettingsChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Weekend Opening Time</label>
                    <input
                      type="time"
                      name="weekendOpeningTime"
                      value={generalSettings.weekendOpeningTime}
                      onChange={handleGeneralSettingsChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Weekend Closing Time</label>
                    <input
                      type="time"
                      name="weekendClosingTime"
                      value={generalSettings.weekendClosingTime}
                      onChange={handleGeneralSettingsChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#4A3C31] mb-4">Notification Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="orderNotifications"
                      name="orderNotifications"
                      checked={notificationSettings.orderNotifications}
                      onChange={handleNotificationSettingsChange}
                      className="w-5 h-5 text-[#557C55] rounded focus:ring-[#557C55]"
                    />
                    <label htmlFor="orderNotifications" className="ml-2 text-gray-700">Order Notifications</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="inventoryAlerts"
                      name="inventoryAlerts"
                      checked={notificationSettings.inventoryAlerts}
                      onChange={handleNotificationSettingsChange}
                      className="w-5 h-5 text-[#557C55] rounded focus:ring-[#557C55]"
                    />
                    <label htmlFor="inventoryAlerts" className="ml-2 text-gray-700">Inventory Alerts</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="customerFeedback"
                      name="customerFeedback"
                      checked={notificationSettings.customerFeedback}
                      onChange={handleNotificationSettingsChange}
                      className="w-5 h-5 text-[#557C55] rounded focus:ring-[#557C55]"
                    />
                    <label htmlFor="customerFeedback" className="ml-2 text-gray-700">Customer Feedback Alerts</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="marketingEmails"
                      name="marketingEmails"
                      checked={notificationSettings.marketingEmails}
                      onChange={handleNotificationSettingsChange}
                      className="w-5 h-5 text-[#557C55] rounded focus:ring-[#557C55]"
                    />
                    <label htmlFor="marketingEmails" className="ml-2 text-gray-700">Marketing Emails</label>
                  </div>
                </div>
              </div>
            )}

            {/* User Accounts */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-[#4A3C31]">User Accounts</h2>
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="px-4 py-2 bg-[#557C55] text-white rounded-lg hover:bg-[#446644] transition-colors duration-300"
                  >
                    Add New User
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#E6D5C3]">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#4A3C31] uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#4A3C31] uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#4A3C31] uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#4A3C31] uppercase tracking-wider">Last Login</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-[#4A3C31] uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userAccounts.map(user => (
                        <tr key={user.id} className="hover:bg-[#FAF5F0] transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-[#4A3C31]">{user.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{user.lastLogin}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-500 hover:text-red-700"
                              disabled={user.role === 'Admin'}
                            >
                              {user.role === 'Admin' ? '' : 'Delete'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSaveSettings}
                className="px-6 py-3 bg-[#557C55] text-white rounded-lg hover:bg-[#446644] transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#557C55] focus:ring-offset-2"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-semibold text-[#4A3C31] mb-6">Add New User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleNewUserChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleNewUserChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Role</label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleNewUserChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                >
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleNewUserChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-[#557C55] text-white rounded-lg hover:bg-[#446644] transition-colors duration-300"
                disabled={!newUser.name || !newUser.email || !newUser.password}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;