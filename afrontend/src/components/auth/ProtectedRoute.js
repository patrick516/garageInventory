import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';


const ProtectedRoute = ({ children }) => {
  const user = authService.getCurrentUser();
  console.log('Current User:', user); // For debugging

  return user ? children : <Navigate to="/login" />;
};
 
export default ProtectedRoute;
