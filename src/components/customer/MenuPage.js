import React, { useState, useEffect } from 'react';
import { useMenu } from '../../context/MenuContext';
import { Link } from 'react-router-dom';

const MenuPage = ({ cart, setCart }) => {
  const { menuCategories, menuAddOns } = useMenu();
  const [activeCategory, setActiveCategory] = useState(menuCategories[0].id);
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
    const selectedSize = item.id === 'b1' ? (selectedSizes[item.id] || 'Regular') : null;
    const selectedFlavor = selectedFlavors[item.id];
    const temperature = item.id === 'b1' ? null : (selectedTemperatures[item.id] || 'Hot');
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

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.uniqueKey === uniqueKey);
      if (existingItemIndex !== -1) {
        // If item exists, increase quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        // Add new item to cart
        return [...prevCart, { ...cartItem, quantity: 1 }];
      }
    });

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
    <div className="min-h-screen bg-[#FAF5F0] transition-all duration-300">
      <nav className="bg-[#4A3C31] text-white p-4 shadow-lg backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-semibold hover:text-[#E6D5C3] transition-colors duration-300">Clockwork</div>
          <div className="space-x-6">
            <Link to="/" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Home</Link>
            <Link to="/menu" className="text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-full after:bg-[#E6D5C3]">Menu</Link>
            <Link to="/profile" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Profile</Link>
            <Link to="/cart" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Cart ({cart.length})</Link>
            <Link to="/contact" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Contact Us</Link>
          </div>
        </div>
      </nav>
      
      

      {/* Category Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
          {menuCategories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-6 py-2 rounded-full whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${activeCategory === category.id ? 'bg-[#4A3C31] text-white shadow-lg' : 'bg-[#E6D5C3] text-[#4A3C31] hover:bg-[#D4C3B1]'}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {menuCategories.find(c => c.id === activeCategory)?.items
            .filter(item => item.available)
            .map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col h-full group relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(item);
                }}
                className="absolute top-4 right-4 z-10 text-2xl transition-transform duration-300 hover:scale-110 focus:outline-none"
              >
                {favorites.some(fav => fav.id === item.id) ? '❤️' : '🤍'}
              </button>
              <div className="p-6 flex flex-col flex-1 justify-between h-full">
                <div className="flex flex-col flex-1">
                  <h3 className="text-xl font-semibold text-[#4A3C31] group-hover:text-[#557C55] transition-colors duration-300">{item.name}</h3>
                  <div className="mt-1 min-h-[24px]">
                    {item.description && (
                      <p className="text-gray-600">{item.description}</p>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-lg font-medium text-[#4A3C31]">
                      ₹{calculateItemPrice(item, selectedAddOns[item.id])}
                    </p>
                  </div>

                  {/* Size/Temperature/Flavor Selection or Spacer */}
                  <div className="mt-4 min-h-[52px]">
                    {item.variants && item.variants.length > 0 ? (
                      <div>
                        <label className="block text-sm font-medium text-[#4A3C31] mb-1">
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
                            // Force re-render to update price
                            setSelectedAddOns(prev => ({ ...prev }));
                          }}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#557C55] focus:border-[#557C55]"
                        >
                          <option value="">Select {item.variants[0].type}</option>
                          {item.variants.map((variant, index) => (
                            <option key={index} value={variant.name}>
                              {variant.name} {variant.price > 0 && `(+₹${variant.price})`}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="h-[42px]"></div>
                    )}
                  </div>

                  {/* Add-ons Section */}
                  <div className="min-h-[88px] flex flex-col justify-start">
                    {item.allowsAddOns && (
                      <div className="mt-4">
                        <button
                          onClick={() => setShowAddOns(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                          className="mt-2 w-full bg-[#E6D5C3] text-[#4A3C31] py-2 rounded-md hover:bg-[#D4C3B1] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4A3C31]"
                        >
                          Toppings
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="mt-6 w-full bg-[#4A3C31] text-white py-2 rounded-md hover:bg-[#3A2C21] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4A3C31]"
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
        <div key={itemId} className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-[90%] transform transition-all duration-300 scale-100 opacity-100">
            <h3 className="text-xl font-semibold text-[#4A3C31] mb-4">Select Toppings</h3>
            <div className="space-y-3">
              {menuAddOns.map(addOn => (
                <label key={addOn.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedAddOns[itemId]?.some(a => a.id === addOn.id) || false}
                    onChange={() => handleAddOnToggle(itemId, addOn)}
                    className="rounded text-[#4A3C31]"
                  />
                  <span className="text-gray-700">
                    {addOn.name} (+₹{addOn.price})
                  </span>
                </label>
              ))}
            </div>
            <button
              onClick={() => setShowAddOns(prev => ({ ...prev, [itemId]: false }))}
              className="mt-6 w-full bg-[#4A3C31] text-white py-2 rounded-md hover:bg-[#3A2C21] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      ))}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-[#4A3C31] text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
