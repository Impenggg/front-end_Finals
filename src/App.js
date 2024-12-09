import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import Signup from './Components/Signup';
import AdminDashboard from './Components/AdminDashboard';
import CustomerDashboard from './Components/CustomerDashboard';
import ProtectedRoute from './Components/ProtectedRoute';
import { Box } from '@mui/material';
import { CartProvider } from './contexts/CartContext';
import Checkout from './Components/Checkout';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <CartProvider>
      <Router>
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            padding: '20px',
          }}
        >
          <Routes>
            <Route path="/login" element={
              user ? (
                <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />
              ) : (
                <Login onLogin={handleLogin} />
              )
            } />
            
            <Route path="/signup" element={
              user ? (
                <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />
              ) : (
                <Signup />
              )
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute role="admin" userRole={user?.role}>
                <AdminDashboard onLogout={handleLogout} />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute role="customer" userRole={user?.role}>
                <CustomerDashboard onLogout={handleLogout} />
              </ProtectedRoute>
            } />
            
            <Route path="/checkout" element={<Checkout />} />
            
            <Route path="/" element={
              <Navigate to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'} />
            } />
          </Routes>
        </Box>
      </Router>
    </CartProvider>
  );
}

export default App;
