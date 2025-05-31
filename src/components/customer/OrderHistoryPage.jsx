import React from 'react';
import { Link } from 'react-router-dom';
import OrderHistory from './OrderHistory'; // Import the OrderHistory component
import './OrderHistoryPage.css'; // Import the CSS file
import Navbar from '../../Navbar'; // Import the Navbar component

const OrderHistoryPage = () => {
  return (
    <div className="page-wrapper">
      <Navbar userType="customer" />
      <div className="main-content">
        <div className="content-container">
          <div className="header-row">
            <div className="header-title">
              <h1 className="order-history-title">Order History</h1>
            </div>
            <Link 
              to="/profile" 
              className="back-button"
            >
              <span>←</span>
              <span>Back to Profile</span>
            </Link>
          </div>

          {/* Replace hardcoded history with the OrderHistory component */}
          <div className="order-history-card">
            <OrderHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;