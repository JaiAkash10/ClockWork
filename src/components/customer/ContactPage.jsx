import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ContactPage.css'; // Import the CSS file
import Navbar from '../../Navbar'; // Import the Navbar component

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
    <div className="contact-page">
      <Navbar userType="customer" />
      <main className="contact-main">
        <h2 className="contact-title">Contact Us</h2>

        {submitted ? (
          <div className="success-message">
            Thank you for your message! We'll get back to you soon.
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="contact-form">
          <div>
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'input-error' : ''}`}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'input-error' : ''}`}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="message" className="form-label">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className={`form-textarea ${errors.message ? 'input-error' : ''}`}
            ></textarea>
            {errors.message && <p className="error-text">{errors.message}</p>}
          </div>

          <button type="submit" className="submit-button">
            Send Message
          </button>
        </form>

        <div className="contact-info">
          <h3 className="info-title">Visit Us</h3>
          <p className="info-text">123 Coffee Lane, Bangalore, India</p>
          <p className="info-text">Phone: +91 9876543210</p>
          <p className="info-text">Email: info@clockworkcafe.com</p>

          <div className="hours">
            <h3 className="info-title">Hours</h3>
            <p className="info-text">Monday - Friday: 7:00 AM - 8:00 PM</p>
            <p className="info-text">Saturday - Sunday: 8:00 AM - 9:00 PM</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;