import React from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';
import Navbar from '../../Navbar'; // Adjusted path to src/Navbar.jsx

const HomePage = () => {
  return (
    <div className="homepage">
      <Navbar userType="customer" />
      <main className="hero">
        <h1>Welcome to Clockwork</h1>
        <p className="tagline">Order your favorite brew and pick it up fresh!</p>
        <Link to="/menu"><button className="cta-button">Order Now</button></Link>
      </main>
    </div>
  );
};

export default HomePage;