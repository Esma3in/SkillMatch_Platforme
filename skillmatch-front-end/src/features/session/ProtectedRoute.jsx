import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('candidate_id') || localStorage.getItem('admin_id') || localStorage.getItem('company_id'); // Check for user session

  if (!isAuthenticated) {
    return <Navigate to="/" replace />; // Redirect to login if not authenticated
  }

  return children; // Return children if user is authenticated
};

export default ProtectedRoute;
