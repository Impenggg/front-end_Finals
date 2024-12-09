import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, role, userRole }) {
  const isAuthenticated = localStorage.getItem('token');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role && role !== userRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

export default ProtectedRoute; 