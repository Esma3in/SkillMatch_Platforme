import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedCandidateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('candidate_id') 

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />; // Redirect to login if not authenticated
  }

  return children; // Return children if user is authenticated
};

export default ProtectedCandidateRoute;
