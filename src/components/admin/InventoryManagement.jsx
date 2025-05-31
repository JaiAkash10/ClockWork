import React, { useState, useEffect } from 'react';
import Navbar from '../../Navbar'; // Import the Navbar component
import '../../styles/InventoryManagement.css'; // Import the CSS file

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    threshold: '',
    supplier: '',
    lastRestocked: ''
  });

  // Mock data for demonstration
  useEffect(() => {
    setInventory([
      {
        id: '001',
        name: 'Coffee Beans (Arabica)',
        category: 'beans',
        quantity: 25,
        unit: 'kg',
        threshold: 10,
        supplier: 'Mountain Coffee Co.',
        lastRestocked: '2024-01-15'
      },
      {
        id: '002',
        name: 'Milk',
        category: 'dairy',
        quantity: 40,
        unit: 'liters',
        threshold: 15,
        supplier: 'Local Dairy Farm',
        lastRestocked: '2024-01-18'
      },
      {
        id: '003',
        name: 'Sugar',
        category: 'sweeteners',
        quantity: 30,
        unit: 'kg',
        threshold: 10,
        supplier: 'Sweet Supplies Inc.',
        lastRestocked: '2024-01-10'
      },
      {
        id: '004',
        name: 'Paper Cups (Medium)',
        category: 'packaging',
        quantity: 500,
        unit: 'pieces',
        threshold: 100,
        supplier: 'EcoPack Solutions',
        lastRestocked: '2024-01-05'
      }
    ]);
  }, []);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = () => {
    const newItem = {
      id: `item${inventory.length + 1}`,
      ...formData,
      quantity: Number(formData.quantity),
      threshold: Number(formData.threshold)
    };
    setInventory([...inventory, newItem]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditItem = () => {
    const updatedItems = inventory.map(item =>
      item.id === selectedItem.id ? { 
        ...item, 
        ...formData,
        quantity: Number(formData.quantity),
        threshold: Number(formData.threshold)
      } : item
    );
    setInventory(updatedItems);
    setShowEditModal(false);
    resetForm();
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setInventory(inventory.filter(item => item.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      quantity: '',
      unit: '',
      threshold: '',
      supplier: '',
      lastRestocked: ''
    });
    setSelectedItem(null);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      threshold: item.threshold,
      supplier: item.supplier,
      lastRestocked: item.lastRestocked
    });
    setShowEditModal(true);
  };

  const getStockStatus = (item) => {
    if (item.quantity <= 0) {
      return { status: 'Out of Stock', className: 'status-out-of-stock' };
    } else if (item.quantity <= item.threshold) {
      return { status: 'Low Stock', className: 'status-low-stock' };
    } else {
      return { status: 'In Stock', className: 'status-in-stock' };
    }
  };

  return (
    <div className="inventory-management-container">
      <Navbar userType="admin" />
      {/* Main Content */}
      <div className="inventory-content">
        <div className="inventory-header">
          <h1 className="inventory-title">Inventory Management</h1>
        </div>

        <div className="inventory-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search inventory..."
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
          <button
            onClick={() => setShowAddModal(true)}
            className="add-item-button"
          >
            <span>Add New Item</span>
          </button>
        </div>

        {/* Inventory Table */}
        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Supplier</th>
                <th>Last Restocked</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map(item => {
                const stockStatus = getStockStatus(item);
                return (
                  <tr key={item.id}>
                    <td>
                      <div className="item-name">{item.name}</div>
                    </td>
                    <td>
                      <div className="item-category">{item.category}</div>
                    </td>
                    <td>
                      <div className="item-quantity">{item.quantity} {item.unit}</div>
                    </td>
                    <td>
                      <span className={`stock-status ${stockStatus.className}`}>
                        {stockStatus.status}
                      </span>
                    </td>
                    <td>
                      <div className="item-supplier">{item.supplier}</div>
                    </td>
                    <td>
                      <div className="item-date">{item.lastRestocked}</div>
                    </td>
                    <td className="action-buttons">
                      <button
                        onClick={() => openEditModal(item)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Add Item Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-container">
              <h2 className="modal-title">Add New Inventory Item</h2>
              <div className="modal-form-grid">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="form-select"
                >
                  <option value="">Select Category</option>
                  <option value="beans">Coffee Beans</option>
                  <option value="dairy">Dairy</option>
                  <option value="sweeteners">Sweeteners</option>
                  <option value="packaging">Packaging</option>
                  <option value="equipment">Equipment</option>
                </select>
                <div className="quantity-unit-container">
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="form-input quantity-input"
                  />
                  <input
                    type="text"
                    placeholder="Unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="form-input unit-input"
                  />
                </div>
                <input
                  type="number"
                  placeholder="Threshold Level"
                  value={formData.threshold}
                  onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="form-input"
                />
                <input
                  type="date"
                  placeholder="Last Restocked"
                  value={formData.lastRestocked}
                  onChange={(e) => setFormData({ ...formData, lastRestocked: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="modal-actions">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  className="submit-button"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Item Modal */}
        {showEditModal && selectedItem && (
          <div className="modal-overlay">
            <div className="modal-container">
              <h2 className="modal-title">Edit Inventory Item</h2>
              <div className="modal-form-grid">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="form-select"
                >
                  <option value="">Select Category</option>
                  <option value="beans">Coffee Beans</option>
                  <option value="dairy">Dairy</option>
                  <option value="sweeteners">Sweeteners</option>
                  <option value="packaging">Packaging</option>
                  <option value="equipment">Equipment</option>
                </select>
                <div className="quantity-unit-container">
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="form-input quantity-input"
                  />
                  <input
                    type="text"
                    placeholder="Unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="form-input unit-input"
                  />
                </div>
                <input
                  type="number"
                  placeholder="Threshold Level"
                  value={formData.threshold}
                  onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="form-input"
                />
                <input
                  type="date"
                  placeholder="Last Restocked"
                  value={formData.lastRestocked}
                  onChange={(e) => setFormData({ ...formData, lastRestocked: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="modal-actions">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditItem}
                  className="submit-button"
                >
                  Update Item
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;