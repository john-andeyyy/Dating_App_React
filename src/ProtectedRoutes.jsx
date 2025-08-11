import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const ProtectedRoutes = () => {
  const { user } = useAuth();
  const auth =  true;
  if (auth) {
    return <Outlet />;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoutes;
