import React from 'react';
import { Link } from 'react-router-dom';
import NotificationCenter from './NotificationCenter';
import { useAuth } from '../context/AuthContext'; // Assuming you have an auth context

const Navbar = ({ cartItemCount }) => {
  const { currentUser } = useAuth(); // Get current user from auth context
  
  return (
    <nav className="bg-[#4A3C31] text-white p-4 shadow-lg backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-semibold hover:text-[#E6D5C3] transition-colors duration-300">Clockwork</div>
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Home</Link>
          <Link to="/menu" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Menu</Link>
          <Link to="/profile" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Profile</Link>
          <Link to="/cart" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">
            Cart ({cartItemCount})
          </Link>
          <Link to="/contact" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Contact Us</Link>
          
          {/* Add Notification Center */}
          {currentUser && <NotificationCenter customerId={currentUser.id} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;