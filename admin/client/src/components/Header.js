import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  return (
    <header className="admin-header">
      <div>
        <h1>BarberX Admin</h1>
      </div>
      
      <div className="profile-dropdown">
        <button className="profile-button" onClick={toggleProfileMenu}>
          <span className="user-name">{currentUser?.name || 'Admin User'}</span>
          <span className="user-role">{currentUser?.role || 'Administrator'}</span>
        </button>
        
        {showProfileMenu && (
          <div className="profile-menu">
            <div className="menu-header">
              <span className="user-name">{currentUser?.name || 'Admin User'}</span>
              <span className="menu-email">{currentUser?.email || 'admin@barberx.com'}</span>
            </div>
            <button className="menu-item" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;