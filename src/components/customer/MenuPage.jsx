import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import Navbar from '../../Navbar'; // Import the Navbar component
import './MenuPage.css'; // Import the CSS file
import { useCart } from '../../context/CartContext'; // Import useCart hook
import { useMenu } from '../../context/MenuContext'; // Import useMenu hook

const MenuPage = () => {
  const { addToCart } = useCart(); // Get addToCart from useCart
  const { menuCategories, menuAddOns } = useMenu(); // Get menuCategories and menuAddOns from useMenu
  
  const [activeCategory, setActiveCategory] = useState(() => {
    return menuCategories.length > 0 ? menuCategories[0].id : '';
  });
  const [selectedAddOns, setSelectedAddOns] = useState({});
  const [showAddOns, setShowAddOns] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedTemperatures, setSelectedTemperatures] = useState({});
  const [selectedFlavors, setSelectedFlavors] = useState({});
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Update activeCategory when menuCategories changes
  useEffect(() => {
    if (menuCategories.length > 0 && !menuCategories.find(c => c.id === activeCategory)) {
      setActiveCategory(menuCategories[0].id);
    }
  }, [menuCategories, activeCategory]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const toggleFavorite = (item) => {
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.id === item.id);
      const newFavorites = isFavorite
        ? prev.filter(fav => fav.id !== item.id)
        : [...prev, { id: item.id, name: item.name, image: item.image }];
      
      // Show toast notification
      setToastMessage(isFavorite ? `${item.name} removed from favorites` : `${item.name} added to favorites`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      
      return newFavorites;
    });
  };

  // Update the calculateItemPrice function to include variant pricing
  const calculateItemPrice = (item, selectedAddOns = []) => {
    let basePrice = item.price;
    
    // Add variant price if a variant is selected
    if (item.variants && item.variants.length > 0) {
      const variantType = item.variants[0].type;
      let selectedVariant = '';
      
      if (variantType === 'size') {
        selectedVariant = selectedSizes[item.id];
      } else if (variantType === 'flavor') {
        selectedVariant = selectedFlavors[item.id];
      } else if (variantType === 'temperature') {
        selectedVariant = selectedTemperatures[item.id];
      }
      
      // Find the selected variant and add its price
      if (selectedVariant) {
        const variant = item.variants.find(v => v.name === selectedVariant);
        if (variant && variant.price) {
          basePrice += variant.price;
        }
      }
    }
    
    // Add prices of selected add-ons
    const addOnsTotal = selectedAddOns ? selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0) : 0;
    
    return basePrice + addOnsTotal;
  }

  const handleAddToCart = (item) => {
    const itemAddOns = selectedAddOns[item.id] || [];
    let selectedSize = null;
    let selectedFlavor = null;
    let temperature = null;
    
    // Handle variants safely
    if (item.variants && item.variants.length > 0) {
      const variantType = item.variants[0].type;
      if (variantType === 'size') {
        selectedSize = selectedSizes[item.id] || 'Regular';
      } else if (variantType === 'flavor') {
        selectedFlavor = selectedFlavors[item.id];
      } else if (variantType === 'temperature') {
        temperature = selectedTemperatures[item.id] || 'Hot';
      }
    } else {
      // Default values for items without variants
      if (item.id === 'b1') {
        selectedSize = 'Regular';
      } else {
        temperature = 'Hot';
      }
    }
    
    // Unique key must include size for filter coffee (b1)
    const uniqueKey = item.id === 'b1'
      ? `${item.id}-${itemAddOns.map(a => a.id).join('-')}-${selectedSize}`
      : `${item.id}-${itemAddOns.map(a => a.id).join('-')}-${temperature}-${selectedFlavor || ''}`;

    const cartItem = {
      ...item,
      addOns: itemAddOns.map(a => ({ ...a })),
      totalPrice: calculateItemPrice(item, itemAddOns),
      uniqueKey,
      size: selectedSize,
      temperature: temperature,
      flavor: selectedFlavor
    };

    addToCart(cartItem); // Use addToCart from context

    setToastMessage(`${item.name} added to cart`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  

  const handleAddOnToggle = (itemId, addOn) => {
    setSelectedAddOns(prev => {
      const currentAddOns = prev[itemId] || [];
      const exists = currentAddOns.some(a => a.id === addOn.id);

      const updatedAddOns = exists
        ? currentAddOns.filter(a => a.id !== addOn.id)
        : [...currentAddOns, addOn];

      return {
        ...prev,
        [itemId]: updatedAddOns
      };
    });
  };

  return (
    <div className="menu-container">
      <Navbar userType="customer" />
      {/* Main Content */}
      <div className="category-wrapper">
        <div className="category-tabs">
          {menuCategories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`category-button ${activeCategory === category.id ? 'active-category' : 'inactive-category'}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="product-grid">
          {menuCategories.find(c => c.id === activeCategory)?.items
            .filter(item => item.available)
            .map(item => (
            <div key={item.id} className="product-card">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(item);
                }}
                className="favorite-button"
              >
                {favorites.some(fav => fav.id === item.id) ? '❤️' : '🤍'}
              </button>
              <div className="product-content">
                <div className="product-info">
                  <h3 className="product-title">{item.name}</h3>
                  <div className="product-description">
                    {item.description && (
                      <p className="description-text">{item.description}</p>
                    )}
                  </div>
                  <div className="product-price">
                    <p className="price-text">
                      ₹{calculateItemPrice(item, selectedAddOns[item.id])}
                    </p>
                  </div>

                  {/* Size/Temperature/Flavor Selection or Spacer */}
                  <div className="variant-selector">
                    {item.variants && item.variants.length > 0 ? (
                      <div>
                        <label className="variant-label">
                          {item.variants[0].type === 'flavor' ? 'Select Flavor:' : 
                            item.variants[0].type === 'size' ? 'Select Size:' : 
                            item.variants[0].type === 'temperature' ? 'Select Temperature:' : 'Select Option:'}
                        </label>
                        <select
                          value={
                            item.variants[0].type === 'flavor' ? (selectedFlavors[item.id] || '') :
                            item.variants[0].type === 'size' ? (selectedSizes[item.id] || '') :
                            item.variants[0].type === 'temperature' ? (selectedTemperatures[item.id] || '') : ''
                          }
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            if (item.variants[0].type === 'size') {
                              setSelectedSizes(prev => ({ ...prev, [item.id]: selectedValue }));
                            } else if (item.variants[0].type === 'flavor') {
                              setSelectedFlavors(prev => ({ ...prev, [item.id]: selectedValue }));
                            } else if (item.variants[0].type === 'temperature') {
                              setSelectedTemperatures(prev => ({ ...prev, [item.id]: selectedValue }));
                            }
                            setSelectedAddOns(prev => ({ ...prev }));
                          }}
                          className="variant-select"
                        >
                          <option value="">Select {item.variants[0].type}</option>
                          {item.variants.map((variant, index) => (
                            <option key={index} value={variant.name}>
                              {variant.name} {variant.price > 0 ? `(+₹${variant.price})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="variant-spacer"></div>
                    )}
                  </div>

                  {/* Add-ons Section */}
                  <div className="addons-section">
                    {item.allowsAddOns && (
                      <div className="addons-button-container">
                        <button
                          onClick={() => setShowAddOns(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                          className="addons-button"
                        >
                          Toppings
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="add-to-cart-button"
                  style={{ marginTop: 'auto' }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toppings Modal */}
      {Object.entries(showAddOns).map(([itemId, show]) => show && (
        <div key={itemId} className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Select Toppings</h3>
            <div className="modal-options">
              {menuAddOns.map(addOn => (
                <label key={addOn.id} className="modal-option">
                  <input
                    type="checkbox"
                    checked={selectedAddOns[itemId]?.some(a => a.id === addOn.id) || false}
                    onChange={() => handleAddOnToggle(itemId, addOn)}
                    className="modal-checkbox"
                  />
                  <span className="modal-option-text">
                    {addOn.name} (+₹{addOn.price})
                  </span>
                </label>
              ))}
            </div>
            <button
              onClick={() => setShowAddOns(prev => ({ ...prev, [itemId]: false }))}
              className="modal-close-button"
            >
              Done
            </button>
          </div>
        </div>
      ))}

      {/* Toast Notification */}
      {showToast && (
        <div className="toast">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
