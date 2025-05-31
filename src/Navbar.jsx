import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './App.css'; // Styles are now in App.css

const Navbar = ({ userType }) => {
  const location = useLocation();

  const getNavLinks = () => {
    // Default to customer links or a common set if no userType is specified
    let links = [
      { path: "/", text: "Home" },
      { path: "/menu", text: "Menu" },
      { path: "/profile", text: "Profile" },
      { path: "/cart", text: "Cart" },
      { path: "/contact", text: "Contact Us" }
    ];

    if (userType === 'admin') {
      links = [
        { path: "/admin/dashboard", text: "Dashboard" },
        { path: "/admin/menu", text: "Menu" },
        { path: "/admin/orders", text: "Orders" },
        { path: "/admin/customers", text: "Customers" },
        { path: "/admin/inventory", text: "Inventory" },
        { path: "/admin/analytics", text: "Analytics" },
        { path: "/admin/settings", text: "Settings" } // Updated path for admin settings
      ];
    } else if (userType === 'customer') {
      // Customer links are the default, but explicitly defined here for clarity
      links = [
        { path: "/", text: "Home" },
        { path: "/menu", text: "Menu" },
        { path: "/profile", text: "Profile" },
        { path: "/cart", text: "Cart" },
        { path: "/contact", text: "Contact Us" }
      ];
    } else {
      // Links for common pages or when userType is not defined (e.g., login, signup)
      // For now, let's assume common pages might not need a full navbar or a different one.
      // Or, they might use customer links by default if not logged in.
      // This part can be adjusted based on specific requirements for common/unauthenticated pages.
      links = [
        { path: "/", text: "Home" },
        { path: "/menu", text: "Menu" },
        { path: "/login", text: "Login" },
        { path: "/signup", text: "Sign Up" }
      ];
    }
    return links;
  };

  const navLinks = getNavLinks();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">Clockwork</div>
        <div className="navbar-links">
          {navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}>
              {link.text}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;