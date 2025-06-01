import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedCompanyRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('company_id'); // Check for user session

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />; // Redirect to login if not authenticated
  }

  return children; // Return children if user is authenticated
};

export default ProtectedCompanyRoute;
