import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, you would send this data to a server
      console.log('Form submitted:', formData);
      setSubmitted(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5F0]">
      <nav className="bg-[#4A3C31] text-white p-4 shadow-lg backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-semibold hover:text-[#E6D5C3] transition-colors duration-300">Clockwork</div>
          <div className="space-x-6">
            <Link to="/" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Home</Link>
            <Link to="/menu" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Menu</Link>
            <Link to="/profile" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Profile</Link>
            <Link to="/cart" className="hover:text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#E6D5C3] after:transition-all hover:after:w-full">Cart</Link>
            <Link to="/contact" className="text-[#E6D5C3] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-full after:bg-[#E6D5C3]">Contact Us</Link>
          </div>
        </div>
      </nav>
      
      <main className="max-w-2xl mx-auto my-8 bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-serif mb-6 text-[#4A3C31]">Contact Us</h2>
        
        {submitted ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6">
            Thank you for your message! We'll get back to you soon.
          </div>
        ) : null}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-[#4A3C31] mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#557C55] ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-[#4A3C31] mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#557C55] ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="message" className="block text-[#4A3C31] mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#557C55] ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
            ></textarea>
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#557C55] text-white py-3 rounded-full shadow hover:bg-[#446644] transition-colors duration-300"
          >
            Send Message
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-[#4A3C31] mb-4">Visit Us</h3>
          <p className="text-gray-600 mb-2">123 Coffee Lane, Bangalore, India</p>
          <p className="text-gray-600 mb-2">Phone: +91 9876543210</p>
          <p className="text-gray-600">Email: info@clockworkcafe.com</p>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-[#4A3C31] mb-4">Hours</h3>
            <p className="text-gray-600 mb-2">Monday - Friday: 7:00 AM - 8:00 PM</p>
            <p className="text-gray-600">Saturday - Sunday: 8:00 AM - 9:00 PM</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;