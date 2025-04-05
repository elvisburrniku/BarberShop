import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './assets/styles.css';

// Pages
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import BarbersPage from './pages/BarbersPage';
import BarberDetailPage from './pages/BarberDetailPage';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/barbers" 
            element={
              <ProtectedRoute>
                <BarbersPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/barbers/:id" 
            element={
              <ProtectedRoute>
                <BarberDetailPage />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;