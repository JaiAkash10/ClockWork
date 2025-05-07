import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
    if (item.quantity <= item.threshold / 2) {
      return { status: 'Low Stock', color: 'bg-red-100 text-red-800' };
    } else if (item.quantity <= item.threshold) {
      return { status: 'Warning', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: 'In Stock', color: 'bg-green-100 text-green-800' };
    }
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
            <Link to="/admin/inventory" className="text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-full after:bg-[#E6D5C3]">Inventory</Link>
            <Link to="/admin/analytics" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Analytics</Link>
            <Link to="/admin/settings" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Settings</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#4A3C31]">Inventory Management</h1>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 p-2 pl-8 border rounded-lg focus:ring-2 focus:ring-[#4A3C31] focus:border-[#4A3C31]"
              />
              <svg
                className="w-4 h-4 absolute left-2 top-3 text-gray-500"
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
              className="px-4 py-2 bg-[#557C55] text-white rounded-lg hover:bg-[#446644] transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#557C55] focus:ring-offset-2"
            >
              Add New Item
            </button>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#E6D5C3]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4A3C31] uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4A3C31] uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4A3C31] uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4A3C31] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4A3C31] uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4A3C31] uppercase tracking-wider">Last Restocked</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#4A3C31] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map(item => {
                const stockStatus = getStockStatus(item);
                return (
                  <tr key={item.id} className="hover:bg-[#FAF5F0] transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#4A3C31]">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{item.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{item.quantity} {item.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${stockStatus.color}`}>
                        {stockStatus.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{item.supplier}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{item.lastRestocked}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-[#557C55] hover:text-[#446644] mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-500 hover:text-red-700"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
              <h2 className="text-2xl font-semibold text-[#4A3C31] mb-6">Add New Inventory Item</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                >
                  <option value="">Select Category</option>
                  <option value="beans">Coffee Beans</option>
                  <option value="dairy">Dairy</option>
                  <option value="sweeteners">Sweeteners</option>
                  <option value="packaging">Packaging</option>
                  <option value="equipment">Equipment</option>
                </select>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55] w-2/3"
                  />
                  <input
                    type="text"
                    placeholder="Unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55] w-1/3"
                  />
                </div>
                <input
                  type="number"
                  placeholder="Threshold Level"
                  value={formData.threshold}
                  onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                />
                <input
                  type="text"
                  placeholder="Supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                />
                <input
                  type="date"
                  placeholder="Last Restocked"
                  value={formData.lastRestocked}
                  onChange={(e) => setFormData({ ...formData, lastRestocked: e.target.value })}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-[#557C55] text-white rounded-lg hover:bg-[#446644] transition-colors duration-300"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Item Modal */}
        {showEditModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
              <h2 className="text-2xl font-semibold text-[#4A3C31] mb-6">Edit Inventory Item</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                >
                  <option value="">Select Category</option>
                  <option value="beans">Coffee Beans</option>
                  <option value="dairy">Dairy</option>
                  <option value="sweeteners">Sweeteners</option>
                  <option value="packaging">Packaging</option>
                  <option value="equipment">Equipment</option>
                </select>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55] w-2/3"
                  />
                  <input
                    type="text"
                    placeholder="Unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55] w-1/3"
                  />
                </div>
                <input
                  type="number"
                  placeholder="Threshold Level"
                  value={formData.threshold}
                  onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                />
                <input
                  type="text"
                  placeholder="Supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                />
                <input
                  type="date"
                  placeholder="Last Restocked"
                  value={formData.lastRestocked}
                  onChange={(e) => setFormData({ ...formData, lastRestocked: e.target.value })}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditItem}
                  className="px-4 py-2 bg-[#557C55] text-white rounded-lg hover:bg-[#446644] transition-colors duration-300"
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