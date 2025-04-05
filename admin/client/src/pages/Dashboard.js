import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5001/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBarbers: 0,
    pendingBarbers: 0,
    approvedBarbers: 0,
    rejectedBarbers: 0,
    totalAppointments: 0,
    activeUsers: 0
  });
  const [recentBarbers, setRecentBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('adminToken');
        
        // Fetch dashboard stats
        const statsResponse = await fetch(`${API_BASE_URL}/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!statsResponse.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }
        
        const statsData = await statsResponse.json();
        setStats(statsData);
        
        // Fetch recent barbers
        const barbersResponse = await fetch(`${API_BASE_URL}/barbers?limit=5&sortBy=createdAt&order=desc`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!barbersResponse.ok) {
          throw new Error('Failed to fetch recent barbers');
        }
        
        const barbersData = await barbersResponse.json();
        setRecentBarbers(barbersData.barbers || []);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading-container">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Barbers</h3>
          <div className="stat-value">{stats.totalBarbers}</div>
        </div>
        
        <div className="stat-card pending">
          <h3>Pending Approval</h3>
          <div className="stat-value">{stats.pendingBarbers}</div>
        </div>
        
        <div className="stat-card approved">
          <h3>Approved Barbers</h3>
          <div className="stat-value">{stats.approvedBarbers}</div>
        </div>
        
        <div className="stat-card rejected">
          <h3>Rejected Barbers</h3>
          <div className="stat-value">{stats.rejectedBarbers}</div>
        </div>
      </div>
      
      <div className="section-header">
        <h2>Recent Barber Applications</h2>
        <Link to="/barbers" className="view-all-link">View All</Link>
      </div>
      
      <div className="barbers-table-container">
        <table className="barbers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Applied Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentBarbers.length > 0 ? (
              recentBarbers.map((barber) => (
                <tr key={barber.id}>
                  <td>{barber.name}</td>
                  <td>{barber.email}</td>
                  <td>{barber.phone}</td>
                  <td>
                    <span className={`status-badge ${barber.status.toLowerCase()}`}>
                      {barber.status}
                    </span>
                  </td>
                  <td>{new Date(barber.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/barbers/${barber.id}`} className="view-button">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">No recent barber applications found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;