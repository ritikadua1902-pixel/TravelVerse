import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Global axios configuration
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Explore from './pages/Explore';
import Places from './pages/Places';
import PlaceDetail from './pages/PlaceDetail';
import './index.css';
import { SafetyProvider } from './context/SafetyContext';
import LocationPermissionModal from './components/LocationPermissionModal';
import SOSWarningModal from './components/SOSWarningModal';
import AdminRoute from './components/AdminRoute';
import Dashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManagePlaces from './pages/admin/ManagePlaces';
import SafetyAlertSystem from './components/SafetyAlertSystem';
import { Toaster } from 'react-hot-toast';

// Simple auth check for protected routes
const PrivateRoute = ({ children }) => {
  const userStr = localStorage.getItem('user');
  let user = null;
  try {
    user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  } catch (e) {
    user = null;
  }
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <SafetyProvider>
      <Router>
        <Toaster position="top-center" />
        <SafetyAlertSystem />
        <Navbar />
        <LocationPermissionModal />
        <SOSWarningModal />
      <div className="page-wrapper">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/explore" 
            element={
              <PrivateRoute>
                <Explore />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/places" 
            element={
              <PrivateRoute>
                <Places />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/places/:id" 
            element={
              <PrivateRoute>
                <PlaceDetail />
              </PrivateRoute>
            } 
          />
          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={<AdminRoute><Dashboard /></AdminRoute>} 
          />
          <Route 
            path="/admin/users" 
            element={<AdminRoute><ManageUsers /></AdminRoute>} 
          />
          <Route 
            path="/admin/places" 
            element={<AdminRoute><ManagePlaces /></AdminRoute>} 
          />
        </Routes>
      </div>
    </Router>
    </SafetyProvider>
  );
}

export default App;
