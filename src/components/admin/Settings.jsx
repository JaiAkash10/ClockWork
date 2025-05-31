import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../Navbar'; // Import the Navbar component
import './Settings.css'; // Styles for this component

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
    <div className="settings-container"> {/* Updated */} 
      <Navbar userType="admin" />
      {/* Main Content */}
      <div className="main-content-settings"> {/* Updated */} 
        <h1 className="page-title-settings">Settings</h1> {/* Updated */} 

        <div className="settings-card"> {/* Updated */} 
          {/* Tabs */}
          <div className="tabs-container"> {/* Updated */} 
            <button
              onClick={() => setActiveTab('general')}
              className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            >
              User Accounts
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content"> {/* Updated */} 
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="form-section"> {/* Updated */} 
                <h2 className="section-title-settings">General Settings</h2> {/* Updated */} 
                <div className="form-grid"> {/* Updated */} 
                  <div>
                    <label className="form-label">Cafe Name</label>
                    <input
                      type="text"
                      name="cafeName"
                      value={generalSettings.cafeName}
                      onChange={handleGeneralSettingsChange}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={generalSettings.address}
                      onChange={handleGeneralSettingsChange}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={generalSettings.phone}
                      onChange={handleGeneralSettingsChange}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={generalSettings.email}
                      onChange={handleGeneralSettingsChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <h3 className="subsection-title-settings">Business Hours</h3> {/* Updated */} 
                <div className="form-grid"> {/* Updated */} 
                  <div>
                    <label className="form-label">Weekday Opening Time</label>
                    <input
                      type="time"
                      name="openingTime"
                      value={generalSettings.openingTime}
                      onChange={handleGeneralSettingsChange}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Weekday Closing Time</label>
                    <input
                      type="time"
                      name="closingTime"
                      value={generalSettings.closingTime}
                      onChange={handleGeneralSettingsChange}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Weekend Opening Time</label>
                    <input
                      type="time"
                      name="weekendOpeningTime"
                      value={generalSettings.weekendOpeningTime}
                      onChange={handleGeneralSettingsChange}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Weekend Closing Time</label>
                    <input
                      type="time"
                      name="weekendClosingTime"
                      value={generalSettings.weekendClosingTime}
                      onChange={handleGeneralSettingsChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="form-section"> {/* Updated */} 
                <h2 className="section-title-settings">Notification Settings</h2> {/* Updated */} 
                <div className="notification-options"> {/* Updated */} 
                  <div className="checkbox-group"> {/* Updated */} 
                    <input
                      type="checkbox"
                      id="orderNotifications"
                      name="orderNotifications"
                      checked={notificationSettings.orderNotifications}
                      onChange={handleNotificationSettingsChange}
                      className="form-checkbox"
                    />
                    <label htmlFor="orderNotifications" className="checkbox-label">Order Notifications</label>
                  </div>
                  <div className="checkbox-group"> {/* Updated */} 
                    <input
                      type="checkbox"
                      id="inventoryAlerts"
                      name="inventoryAlerts"
                      checked={notificationSettings.inventoryAlerts}
                      onChange={handleNotificationSettingsChange}
                      className="form-checkbox"
                    />
                    <label htmlFor="inventoryAlerts" className="checkbox-label">Inventory Alerts</label>
                  </div>
                  <div className="checkbox-group"> {/* Updated */} 
                    <input
                      type="checkbox"
                      id="customerFeedback"
                      name="customerFeedback"
                      checked={notificationSettings.customerFeedback}
                      onChange={handleNotificationSettingsChange}
                      className="form-checkbox"
                    />
                    <label htmlFor="customerFeedback" className="checkbox-label">Customer Feedback Alerts</label>
                  </div>
                  <div className="checkbox-group"> {/* Updated */} 
                    <input
                      type="checkbox"
                      id="marketingEmails"
                      name="marketingEmails"
                      checked={notificationSettings.marketingEmails}
                      onChange={handleNotificationSettingsChange}
                      className="form-checkbox"
                    />
                    <label htmlFor="marketingEmails" className="checkbox-label">Marketing Emails</label>
                  </div>
                </div>
              </div>
            )}

            {/* User Accounts */}
            {activeTab === 'users' && (
              <div className="form-section"> {/* Updated */} 
                <div className="section-header-settings"> {/* Updated */} 
                  <h2 className="section-title-settings">User Accounts</h2>
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="add-user-button"
                  >
                    Add New User
                  </button>
                </div>
                
                <div className="table-container-settings"> {/* Updated */} 
                  <table className="user-accounts-table"> {/* Updated */} 
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Last Login</th>
                        <th className="actions-column">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userAccounts.map(user => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`role-badge ${user.role.toLowerCase()}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>{user.lastLogin}</td>
                          <td className="actions-column">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="delete-user-button"
                              disabled={user.role === 'Admin'}
                            >
                              {user.role === 'Admin' ? 'Protected' : 'Delete'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="save-settings-container"> {/* Updated */} 
              <button
                onClick={handleSaveSettings}
                className="save-settings-button"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="modal-overlay-settings"> {/* Updated */} 
          <div className="modal-container-settings"> {/* Updated */} 
            <h2 className="modal-title-settings">Add New User</h2> {/* Updated */} 
            <div className="modal-form-settings"> {/* Updated */} 
              <div>
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleNewUserChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleNewUserChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Role</label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleNewUserChange}
                  className="form-select"
                >
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleNewUserChange}
                  className="form-input"
                />
              </div>
            </div>
            <div className="modal-actions-settings"> {/* Updated */} 
              <button
                onClick={() => setShowAddUserModal(false)}
                className="cancel-button-settings"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="submit-button-settings"
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