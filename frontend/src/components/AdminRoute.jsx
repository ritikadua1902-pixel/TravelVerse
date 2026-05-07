import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const userStr = localStorage.getItem('user');
  let user = null;
  try {
    user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  } catch (e) {
    user = null;
  }

  // Check if user is logged in and role is admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/explore" />;
  }

  return children;
};

export default AdminRoute;
