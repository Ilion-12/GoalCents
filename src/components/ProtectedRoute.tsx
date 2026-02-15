import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthenticationManager } from '../services/AuthenticationManager';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authManager = AuthenticationManager.getInstance();
  
  // Check authentication dynamically on each render
  if (!authManager.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
