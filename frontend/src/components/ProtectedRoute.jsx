import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const tokenExpiry = localStorage.getItem('tokenExpiry');
  const isTokenValid = token && tokenExpiry && Date.now() < tokenExpiry;

  return isTokenValid ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;
