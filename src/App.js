import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { MenuProvider } from './context/MenuContext';
import { OrderProvider } from './context/OrderContext';
import { UserProvider } from './context/UserContext';
import { OrderTrackingProvider } from './context/OrderTrackingContext';
import OrderTracker from './components/OrderTracker';

// Lazy load components
const HomePage = lazy(() => import('./components/HomePage'));
const MenuPage = lazy(() => import('./components/MenuPage'));
const CartPage = lazy(() => import('./components/CartPage'));
const ProfilePage = lazy(() => import('./components/ProfilePage'));
const OrderConfirmationPage = lazy(() => import('./components/OrderConfirmationPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));
const OrderHistoryPage = lazy(() => import('./components/OrderHistoryPage'));

// Lazy load admin components
const AdminDashboard = lazy(() => import('./components/admin/Dashboard'));
const MenuManagement = lazy(() => import('./components/admin/MenuManagement'));
const OrderManagement = lazy(() => import('./components/admin/OrderManagement'));
const CustomerManagement = lazy(() => import('./components/admin/CustomerManagement'));
const InventoryManagement = lazy(() => import('./components/admin/InventoryManagement'));
const Analytics = lazy(() => import('./components/admin/Analytics'));
const Settings = lazy(() => import('./components/admin/Settings'));
const NotificationsPage = lazy(() => import('./components/admin/NotificationsPage'));

function App() {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // 🛒 Persist cart updates
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <MenuProvider>
      <OrderProvider>
        <UserProvider>
          <OrderTrackingProvider>
            <BrowserRouter>
              <div className="App">
                <OrderTracker />
                <Suspense fallback={<div className="loading">Loading...</div>}>
                  <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage cart={cart} setCart={setCart} />} />
              <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/order-history" element={<OrderHistoryPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/menu" element={<MenuManagement />} />
              <Route path="/admin/orders" element={<OrderManagement />} />
              <Route path="/admin/customers" element={<CustomerManagement />} />
              <Route path="/admin/inventory" element={<InventoryManagement />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/settings" element={<Settings />} />
              <Route path="/admin/notifications" element={<NotificationsPage />} />
                  </Routes>
                </Suspense>
              </div>
            </BrowserRouter>
          </OrderTrackingProvider>
        </UserProvider>
      </OrderProvider>
    </MenuProvider>
  );
}

export default App;
