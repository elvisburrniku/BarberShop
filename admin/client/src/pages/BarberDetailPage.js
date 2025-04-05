import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5001/api';

const BarberDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [barber, setBarber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState(null);

  useEffect(() => {
    fetchBarberDetails();
  }, [id]);

  const fetchBarberDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/barbers/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Barber not found');
        }
        throw new Error('Failed to fetch barber details');
      }
      
      const data = await response.json();
      setBarber(data);
      
    } catch (err) {
      console.error('Error fetching barber details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateBarberStatus = async (status) => {
    setStatusUpdateLoading(true);
    setStatusUpdateSuccess(false);
    setStatusUpdateError(null);
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/barbers/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update barber status');
      }
      
      const updatedBarber = await response.json();
      setBarber(updatedBarber);
      setStatusUpdateSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatusUpdateSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Error updating barber status:', err);
      setStatusUpdateError(err.message);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading barber details...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error: {error}</h2>
        <Link to="/barbers" className="back-button">
          Back to Barbers List
        </Link>
      </div>
    );
  }

  if (!barber) {
    return (
      <div className="not-found-container">
        <h2>Barber not found</h2>
        <Link to="/barbers" className="back-button">
          Back to Barbers List
        </Link>
      </div>
    );
  }

  return (
    <div className="barber-detail-page">
      <div className="page-header">
        <Link to="/barbers" className="back-button">
          ← Back to Barbers
        </Link>
        <h1>Barber Details</h1>
      </div>
      
      {statusUpdateSuccess && (
        <div className="success-message">
          Status successfully updated to {barber.status}
        </div>
      )}
      
      {statusUpdateError && (
        <div className="error-message">
          Error: {statusUpdateError}
        </div>
      )}
      
      <div className="barber-detail-content">
        <div>
          <div className="status-card">
            <h3>Application Status</h3>
            <p>Current Status:</p>
            <span className={`status-badge ${barber.status.toLowerCase()}`}>
              {barber.status}
            </span>
            
            <div className="status-actions">
              <button
                className="approve-button"
                onClick={() => updateBarberStatus('approved')}
                disabled={statusUpdateLoading || barber.status === 'approved'}
              >
                Approve
              </button>
              
              <button
                className="reject-button"
                onClick={() => updateBarberStatus('rejected')}
                disabled={statusUpdateLoading || barber.status === 'rejected'}
              >
                Reject
              </button>
              
              <button
                className="pending-button"
                onClick={() => updateBarberStatus('pending')}
                disabled={statusUpdateLoading || barber.status === 'pending'}
              >
                Set as Pending
              </button>
            </div>
          </div>
        </div>
        
        <div className="barber-info">
          <div className="info-section">
            <h2>Personal Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <h4>Full Name</h4>
                <p>{barber.name}</p>
              </div>
              
              <div className="info-item">
                <h4>Email</h4>
                <p>{barber.email}</p>
              </div>
              
              <div className="info-item">
                <h4>Phone</h4>
                <p>{barber.phone}</p>
              </div>
              
              <div className="info-item">
                <h4>Application Date</h4>
                <p>{new Date(barber.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          
          <div className="info-section">
            <h2>Professional Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <h4>Years of Experience</h4>
                <p>{barber.yearsOfExperience || 'Not specified'}</p>
              </div>
              
              <div className="info-item">
                <h4>Specialties</h4>
                <p>{barber.specialties || 'None specified'}</p>
              </div>
              
              <div className="info-item">
                <h4>Location</h4>
                <p>{barber.location || 'Not specified'}</p>
              </div>
              
              <div className="info-item">
                <h4>Portfolio</h4>
                <p>{barber.portfolio ? 'Available' : 'Not provided'}</p>
              </div>
            </div>
          </div>
          
          {barber.bio && (
            <div className="info-section">
              <h2>Biography</h2>
              <p>{barber.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarberDetailPage;