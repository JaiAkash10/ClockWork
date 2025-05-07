import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMenu } from '../../context/MenuContext';

const MenuManagement = () => {
  const { menuCategories, addMenuItem, updateMenuItem, deleteMenuItem } = useMenu();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formErrors, setFormErrors] = useState({ name: '', price: '', category: '' });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    available: true,
    allowsAddOns: true,
    variants: []
  });
  
  // Flatten menu items for display
  const menuItems = menuCategories.flatMap(category => 
    category.items.map(item => ({
      ...item,
      categoryId: category.id,
      categoryName: category.name
    }))
  );

  // This function is intentionally left empty as it's redefined below with validation
  // The actual implementation is after validateForm function

  // This function is intentionally left empty as it's redefined below with validation
  // The actual implementation is after validateForm function

  const handleDeleteItem = (item) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteMenuItem(item.categoryId, item.id);
      
      // Save to localStorage to ensure real-time sync
      const savedCategories = localStorage.getItem('menuCategories');
      if (savedCategories) {
        const parsedCategories = JSON.parse(savedCategories);
        const updatedCategories = parsedCategories.map(category => {
          if (category.id === item.categoryId) {
            return {
              ...category,
              items: category.items.filter(menuItem => menuItem.id !== item.id)
            };
          }
          return category;
        });
        localStorage.setItem('menuCategories', JSON.stringify(updatedCategories));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      available: false,
      allowsAddOns: true,
      variants: []
    });
    setSelectedItem(null);
    // No need to reset selectedCategory as it's not defined
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.categoryId,
      image: item.image || '',
      available: item.available !== undefined ? item.available : true,
      allowsAddOns: item.allowsAddOns !== undefined ? item.allowsAddOns : true,
      variants: item.variants || []
    });
    setFormErrors({ name: '', price: '', category: '' });
    setShowEditModal(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.price) errors.price = 'Price is required';
    if (!formData.category) errors.category = 'Category is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddItem = () => {
    if (!validateForm()) return;
    
    const newItem = {
      id: `${formData.category.charAt(0)}${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      image: formData.image || '/default.svg',
      available: formData.available,
      allowsAddOns: formData.allowsAddOns,
      variants: formData.variants
    };
    addMenuItem(formData.category, newItem);
    
    // Save to localStorage to ensure real-time sync
    const savedCategories = localStorage.getItem('menuCategories');
    if (savedCategories) {
      const parsedCategories = JSON.parse(savedCategories);
      const updatedCategories = parsedCategories.map(category => {
        if (category.id === formData.category) {
          return {
            ...category,
            items: [...category.items, newItem]
          };
        }
        return category;
      });
      localStorage.setItem('menuCategories', JSON.stringify(updatedCategories));
    }
    
    setShowAddModal(false);
    resetForm();
  };

  const handleEditItem = () => {
    if (!validateForm()) return;
    
    const updatedItem = {
      ...selectedItem,
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      image: formData.image,
      available: formData.available,
      allowsAddOns: formData.allowsAddOns,
      variants: formData.variants
    };
    updateMenuItem(selectedItem.categoryId, updatedItem);
    
    // Save to localStorage to ensure real-time sync
    const savedCategories = localStorage.getItem('menuCategories');
    if (savedCategories) {
      const parsedCategories = JSON.parse(savedCategories);
      const updatedCategories = parsedCategories.map(category => {
        if (category.id === selectedItem.categoryId) {
          return {
            ...category,
            items: category.items.map(item => 
              item.id === updatedItem.id ? updatedItem : item
            )
          };
        }
        return category;
      });
      localStorage.setItem('menuCategories', JSON.stringify(updatedCategories));
    }
    
    setShowEditModal(false);
    resetForm();
  };


  return (
    <div className="min-h-screen bg-[#FAF5F0] transition-all duration-300">
      {/* Admin Navbar */}
      <nav className="bg-[#4A3C31] text-white p-4 shadow-lg backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-semibold hover:text-[#E6D5C3] transition-colors duration-300">Clockwork Admin</div>
          <div className="space-x-6">
            <Link to="/admin" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Dashboard</Link>
            <Link to="/admin/menu" className="text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-full after:bg-[#E6D5C3]">Menu</Link>
            <Link to="/admin/orders" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Orders</Link>
            <Link to="/admin/customers" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Customers</Link>
            <Link to="/admin/inventory" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Inventory</Link>
            <Link to="/admin/analytics" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Analytics</Link>
            <Link to="/admin/settings" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Settings</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#4A3C31]">Menu Management</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-[#557C55] text-white rounded-lg hover:bg-[#446644] transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#557C55] focus:ring-offset-2"
          >
            Add New Item
          </button>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-[#4A3C31]">{item.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 text-[#557C55] hover:bg-[#557C55] hover:text-white rounded-lg transition-all duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item)}
                    className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{item.description}</p>
              
              {/* Display variants if any */}
              {item.variants && item.variants.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-[#4A3C31] mb-2">
                    {item.variants[0].type === 'flavor' ? 'Available Flavors:' : 
                     item.variants[0].type === 'size' ? 'Available Sizes:' : 'Variants:'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {item.variants.map((variant, index) => (
                      <span key={index} className="text-xs bg-[#FAF5F0] px-2 py-1 rounded">
                        {variant.name} {variant.price > 0 && `(+₹${variant.price})`}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <p className="text-lg font-medium text-[#557C55]">₹{item.price}</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={item.available || false}
                    onChange={() => {
                      const updatedItem = { ...item, available: !item.available };
                      updateMenuItem(item.categoryId, updatedItem);
                    }}
                  />
                  <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-${item.available ? 'green' : 'red'}-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${item.available ? 'peer-checked:bg-green-600' : 'bg-red-600'}`}></div>
                  <span className="ms-3 text-sm font-medium text-gray-900">{item.available ? 'Available' : 'Unavailable'}</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Add Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-semibold text-[#4A3C31] mb-6">Add New Menu Item</h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55] ${formErrors.name ? 'border-red-500' : ''}`}
                    aria-label="Item name"
                    aria-required="true"
                    aria-invalid={!!formErrors.name}
                  />
                  {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
                </div>
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                ></textarea>
                <div className="space-y-1">
                  <input
                    type="number"
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55] ${formErrors.price ? 'border-red-500' : ''}`}
                    min="0"
                    step="0.01"
                    aria-label="Item price"
                    aria-required="true"
                    aria-invalid={!!formErrors.price}
                  />
                  {formErrors.price && <p className="text-red-500 text-sm">{formErrors.price}</p>}
                </div>
                <div className="space-y-1">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55] ${formErrors.category ? 'border-red-500' : ''}`}
                    aria-label="Item category"
                    aria-required="true"
                    aria-invalid={!!formErrors.category}
                  >
                    <option value="">Select Category</option>
                    {menuCategories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  {formErrors.category && <p className="text-red-500 text-sm">{formErrors.category}</p>}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="available"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="w-4 h-4 text-[#557C55] rounded focus:ring-[#557C55]"
                    aria-label="Item availability"
                  />
                  <label htmlFor="available">Available</label>
                </div>
                
                {/* Variants Section */}
                <div className="mt-6 border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-[#4A3C31]">Variants (Flavors, Sizes, etc.)</h3>
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        variants: [...formData.variants, { type: 'flavor', name: '', price: 0 }]
                      })}
                      className="text-sm bg-[#E6D5C3] px-3 py-1 rounded-lg hover:bg-[#D4C3B1] transition-all duration-300"
                    >
                      Add Variant
                    </button>
                  </div>
                  
                  {formData.variants.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No variants added yet. Add variants like different flavors, sizes, or types.</p>
                  ) : (
                    <div className="space-y-3">
                      {formData.variants.map((variant, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-[#FAF5F0] p-3 rounded-lg">
                          <div className="flex-1">
                            <select
                              value={variant.type || 'flavor'}
                              onChange={(e) => {
                                const updatedVariants = [...formData.variants];
                                updatedVariants[index] = { ...variant, type: e.target.value };
                                setFormData({ ...formData, variants: updatedVariants });
                              }}
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55] mb-2"
                            >
                              <option value="flavor">Flavor</option>
                              <option value="size">Size</option>
                              <option value="temperature">Temperature</option>
                              <option value="other">Other</option>
                            </select>
                            <input
                              type="text"
                              placeholder={`${variant.type || 'Variant'} name`}
                              value={variant.name || ''}
                              onChange={(e) => {
                                const updatedVariants = [...formData.variants];
                                updatedVariants[index] = { ...variant, name: e.target.value };
                                setFormData({ ...formData, variants: updatedVariants });
                              }}
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                            />
                          </div>
                          <div className="w-24">
                            <label className="block text-xs text-gray-500 mb-1">Extra Price</label>
                            <input
                              type="number"
                              value={variant.price || 0}
                              onChange={(e) => {
                                const updatedVariants = [...formData.variants];
                                updatedVariants[index] = { ...variant, price: parseFloat(e.target.value) || 0 };
                                setFormData({ ...formData, variants: updatedVariants });
                              }}
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedVariants = [...formData.variants];
                              updatedVariants.splice(index, 1);
                              setFormData({ ...formData, variants: updatedVariants });
                            }}
                            className="text-red-600 hover:text-red-800 transition-colors duration-300"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border-2 border-[#4A3C31] text-[#4A3C31] rounded-lg hover:bg-[#4A3C31] hover:text-white transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  className="px-6 py-2 bg-[#557C55] text-white rounded-lg hover:bg-[#446644] transition-all duration-300"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Item Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-semibold text-[#4A3C31] mb-6">Edit Menu Item</h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55] ${formErrors.name ? 'border-red-500' : ''}`}
                    aria-label="Item name"
                    aria-required="true"
                    aria-invalid={!!formErrors.name}
                  />
                  {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
                </div>
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                ></textarea>
                <div className="space-y-1">
                  <input
                    type="number"
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55] ${formErrors.price ? 'border-red-500' : ''}`}
                    min="0"
                    step="0.01"
                    aria-label="Item price"
                    aria-required="true"
                    aria-invalid={!!formErrors.price}
                  />
                  {formErrors.price && <p className="text-red-500 text-sm">{formErrors.price}</p>}
                </div>
                <div className="space-y-1">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55] ${formErrors.category ? 'border-red-500' : ''}`}
                    aria-label="Item category"
                    aria-required="true"
                    aria-invalid={!!formErrors.category}
                  >
                    <option value="">Select Category</option>
                    {menuCategories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  {formErrors.category && <p className="text-red-500 text-sm">{formErrors.category}</p>}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="available"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="w-4 h-4 text-[#557C55] rounded focus:ring-[#557C55]"
                    aria-label="Item availability"
                  />
                  <label htmlFor="available">Available</label>
                </div>
                
                {/* Variants Section */}
                <div className="mt-6 border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-[#4A3C31]">Variants (Flavors, Sizes, etc.)</h3>
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        variants: [...formData.variants, { type: 'flavor', name: '', price: 0 }]
                      })}
                      className="text-sm bg-[#E6D5C3] px-3 py-1 rounded-lg hover:bg-[#D4C3B1] transition-all duration-300"
                    >
                      Add Variant
                    </button>
                  </div>
                  
                  {formData.variants.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No variants added yet. Add variants like different flavors, sizes, or types.</p>
                  ) : (
                    <div className="space-y-3">
                      {formData.variants.map((variant, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-[#FAF5F0] p-3 rounded-lg">
                          <div className="flex-1">
                            <select
                              value={variant.type || 'flavor'}
                              onChange={(e) => {
                                const updatedVariants = [...formData.variants];
                                updatedVariants[index] = { ...variant, type: e.target.value };
                                setFormData({ ...formData, variants: updatedVariants });
                              }}
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55] mb-2"
                            >
                              <option value="flavor">Flavor</option>
                              <option value="size">Size</option>
                              <option value="temperature">Temperature</option>
                              <option value="other">Other</option>
                            </select>
                            <input
                              type="text"
                              placeholder={`${variant.type || 'Variant'} name`}
                              value={variant.name || ''}
                              onChange={(e) => {
                                const updatedVariants = [...formData.variants];
                                updatedVariants[index] = { ...variant, name: e.target.value };
                                setFormData({ ...formData, variants: updatedVariants });
                              }}
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                            />
                          </div>
                          <div className="w-24">
                            <label className="block text-xs text-gray-500 mb-1">Extra Price</label>
                            <input
                              type="number"
                              value={variant.price || 0}
                              onChange={(e) => {
                                const updatedVariants = [...formData.variants];
                                updatedVariants[index] = { ...variant, price: parseFloat(e.target.value) || 0 };
                                setFormData({ ...formData, variants: updatedVariants });
                              }}
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedVariants = [...formData.variants];
                              updatedVariants.splice(index, 1);
                              setFormData({ ...formData, variants: updatedVariants });
                            }}
                            className="text-red-600 hover:text-red-800 transition-colors duration-300"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border-2 border-[#4A3C31] text-[#4A3C31] rounded-lg hover:bg-[#4A3C31] hover:text-white transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditItem}
                  className="px-6 py-2 bg-[#557C55] text-white rounded-lg hover:bg-[#446644] transition-all duration-300"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;