import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const { pathname } = location;

  const isActive = (path) => {
    return pathname === path ? 'active' : '';
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>BarberX</h2>
        <p>Admin Portal</p>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/" className={`nav-item ${isActive('/')}`}>
              <span className="nav-icon">📊</span>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/barbers" className={`nav-item ${isActive('/barbers')}`}>
              <span className="nav-icon">💇</span>
              Barbers
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <p>BarberX Admin v1.0</p>
        <p>&copy; {new Date().getFullYear()} BarberX</p>
      </div>
    </aside>
  );
};

export default Sidebar;