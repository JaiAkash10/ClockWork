import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMenu } from '../../context/MenuContext';
import Navbar from '../../Navbar'; // Import the Navbar component

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
    <div className="admin-container">
      <Navbar userType="admin" />
      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-header">
          <h1 className="admin-title">Menu Management</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="add-item-btn"
          >
            Add New Item
          </button>
        </div>

        {/* Menu Items Grid */}
        <div className="menu-items-grid">
          {menuItems.map(item => (
            <div key={item.id} className="menu-item-card">
              <div className="menu-item-header">
                <h3 className="menu-item-name">{item.name}</h3>
                <div className="menu-item-actions">
                  <button
                    onClick={() => openEditModal(item)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="menu-item-description">{item.description}</p>
              
              {/* Display variants if any */}
              {item.variants && item.variants.length > 0 && (
                <div className="menu-item-variants">
                  <h4 className="variants-title">
                    {item.variants[0].type === 'flavor' ? 'Available Flavors:' : 
                     item.variants[0].type === 'size' ? 'Available Sizes:' : 'Variants:'}
                  </h4>
                  <div className="variants-list">
                    {item.variants.map((variant, index) => (
                      <span key={index} className="variant-tag">
                        {variant.name} {variant.price > 0 && `(+₹${variant.price})`}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="menu-item-footer">
                <p className="menu-item-price">₹{item.price}</p>
                <label className="toggle-container">
                  <input
                    type="checkbox"
                    className="toggle-input"
                    checked={item.available || false}
                    onChange={() => {
                      const updatedItem = { ...item, available: !item.available };
                      updateMenuItem(item.categoryId, updatedItem);
                    }}
                  />
                  <div className={`toggle-switch ${item.available ? 'active' : 'inactive'}`}></div>
                  <span className="toggle-label">{item.available ? 'Available' : 'Unavailable'}</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Add Item Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">Add New Menu Item</h2>
              <div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`form-input ${formErrors.name ? 'error' : ''}`}
                    aria-label="Item name"
                    aria-required="true"
                    aria-invalid={!!formErrors.name}
                  />
                  {formErrors.name && <p className="error-message">{formErrors.name}</p>}
                </div>
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                ></textarea>
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className={`form-input ${formErrors.price ? 'error' : ''}`}
                    min="0"
                    step="0.01"
                    aria-label="Item price"
                    aria-required="true"
                    aria-invalid={!!formErrors.price}
                  />
                  {formErrors.price && <p className="error-message">{formErrors.price}</p>}
                </div>
                <div className="form-group">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`form-select ${formErrors.category ? 'error' : ''}`}
                    aria-label="Item category"
                    aria-required="true"
                    aria-invalid={!!formErrors.category}
                  >
                    <option value="">Select Category</option>
                    {menuCategories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  {formErrors.category && <p className="error-message">{formErrors.category}</p>}
                </div>
                <div className="form-checkbox-group">
                  <input
                    type="checkbox"
                    id="available"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="form-checkbox"
                    aria-label="Item availability"
                  />
                  <label htmlFor="available" className="checkbox-label">Available</label>
                </div>
                
                {/* Variants Section */}
                <div className="variants-section">
                  <div className="variants-header">
                    <h3 className="variants-title-form">Variants (Flavors, Sizes, etc.)</h3>
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        variants: [...formData.variants, { type: 'flavor', name: '', price: 0 }]
                      })}
                      className="add-variant-btn"
                    >
                      Add Variant
                    </button>
                  </div>
                  
                  {formData.variants.length === 0 ? (
                    <p style={{color: '#6b7280', fontSize: '0.875rem', fontStyle: 'italic'}}>No variants added yet. Add variants like different flavors, sizes, or types.</p>
                  ) : (
                    <div>
                      {formData.variants.map((variant, index) => (
                        <div key={index} className="variant-item">
                          <div style={{flex: 1}}>
                            <select
                              value={variant.type || 'flavor'}
                              onChange={(e) => {
                                const updatedVariants = [...formData.variants];
                                updatedVariants[index] = { ...variant, type: e.target.value };
                                setFormData({ ...formData, variants: updatedVariants });
                              }}
                              className="variant-input"
                              style={{marginBottom: '0.5rem'}}
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
                              className="variant-input"
                            />
                          </div>
                          <div style={{width: '6rem'}}>
                            <label style={{display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem'}}>Extra Price</label>
                            <input
                              type="number"
                              value={variant.price || 0}
                              onChange={(e) => {
                                const updatedVariants = [...formData.variants];
                                updatedVariants[index] = { ...variant, price: parseFloat(e.target.value) || 0 };
                                setFormData({ ...formData, variants: updatedVariants });
                              }}
                              className="variant-input"
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
                            className="remove-variant-btn"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-actions">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  className="submit-btn"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Item Modal */}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">Edit Menu Item</h2>
              <div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`form-input ${formErrors.name ? 'error' : ''}`}
                    aria-label="Item name"
                    aria-required="true"
                    aria-invalid={!!formErrors.name}
                  />
                  {formErrors.name && <p className="error-message">{formErrors.name}</p>}
                </div>
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                ></textarea>
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className={`form-input ${formErrors.price ? 'error' : ''}`}
                    min="0"
                    step="0.01"
                    aria-label="Item price"
                    aria-required="true"
                    aria-invalid={!!formErrors.price}
                  />
                  {formErrors.price && <p className="error-message">{formErrors.price}</p>}
                </div>
                <div className="form-group">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`form-select ${formErrors.category ? 'error' : ''}`}
                    aria-label="Item category"
                    aria-required="true"
                    aria-invalid={!!formErrors.category}
                  >
                    <option value="">Select Category</option>
                    {menuCategories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  {formErrors.category && <p className="error-message">{formErrors.category}</p>}
                </div>
                <div className="form-checkbox-group">
                  <input
                    type="checkbox"
                    id="available"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="form-checkbox"
                    aria-label="Item availability"
                  />
                  <label htmlFor="available" className="checkbox-label">Available</label>
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