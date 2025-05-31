import React, { createContext, useState, useEffect, useContext } from 'react';
import { categories, addOns } from '../components/customer/data/menuData';

// Create the context
const MenuContext = createContext();

// Create a provider component
export const MenuProvider = ({ children }) => {
  // Initialize state with data from menuData.js and localStorage
  const [menuCategories, setMenuCategories] = useState(() => {
    const savedCategories = localStorage.getItem('menuCategories');
    if (savedCategories) {
      return JSON.parse(savedCategories);
    }
    // Initialize with default available state
    return categories.map(category => ({
      ...category,
      items: category.items.map(item => ({ ...item, available: false }))
    }));
  });
  const [menuAddOns, setMenuAddOns] = useState(addOns);

  // Function to add a new menu item
  const addMenuItem = (categoryId, newItem) => {
    setMenuCategories(prevCategories => {
      return prevCategories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            items: [...category.items, newItem]
          };
        }
        return category;
      });
    });
  };

  // Function to update an existing menu item
  const updateMenuItem = (categoryId, updatedItem) => {
    setMenuCategories(prevCategories => {
      const newCategories = prevCategories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            items: category.items.map(item => 
              item.id === updatedItem.id ? updatedItem : item
            )
          };
        }
        return category;
      });
      // Save to localStorage after update
      localStorage.setItem('menuCategories', JSON.stringify(newCategories));
      return newCategories;
    });
  };

  // Function to delete a menu item
  const deleteMenuItem = (categoryId, itemId) => {
    setMenuCategories(prevCategories => {
      return prevCategories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            items: category.items.filter(item => item.id !== itemId)
          };
        }
        return category;
      });
    });
  };

  // Function to add a new add-on
  const addAddOn = (newAddOn) => {
    setMenuAddOns(prevAddOns => [...prevAddOns, newAddOn]);
  };

  // Function to update an existing add-on
  const updateAddOn = (updatedAddOn) => {
    setMenuAddOns(prevAddOns => 
      prevAddOns.map(addOn => 
        addOn.id === updatedAddOn.id ? updatedAddOn : addOn
      )
    );
  };

  // Function to delete an add-on
  const deleteAddOn = (addOnId) => {
    setMenuAddOns(prevAddOns => 
      prevAddOns.filter(addOn => addOn.id !== addOnId)
    );
  };

  // Find category by item id
  const findCategoryByItemId = (itemId) => {
    for (const category of menuCategories) {
      if (category.items.some(item => item.id === itemId)) {
        return category.id;
      }
    }
    return null;
  };

  return (
    <MenuContext.Provider value={{
      menuCategories,
      menuAddOns,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      addAddOn,
      updateAddOn,
      deleteAddOn,
      findCategoryByItemId
    }}>
      {children}
    </MenuContext.Provider>
  );
};

// Custom hook to use the menu context
export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};