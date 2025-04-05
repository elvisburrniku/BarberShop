import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';

const API_BASE_URL = 'http://localhost:5001/api';

const BarbersPage = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter and pagination states
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchBarbers();
  }, [statusFilter, searchTerm, currentPage, itemsPerPage, sortField, sortOrder]);

  const fetchBarbers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('adminToken');
      let url = `${API_BASE_URL}/barbers?page=${currentPage}&limit=${itemsPerPage}&sortBy=${sortField}&order=${sortOrder}`;
      
      if (statusFilter !== 'all') {
        url += `&status=${statusFilter}`;
      }
      
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch barbers');
      }
      
      const data = await response.json();
      setBarbers(data.barbers || []);
      setTotalItems(data.total || 0);
      
    } catch (err) {
      console.error('Error fetching barbers:', err);
      setError('Failed to load barbers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on search
  };

  const handleSort = (field) => {
    if (field === sortField) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for new sort field
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1); // Reset to first page on sort change
  };

  const getSortIndicator = (field) => {
    if (field === sortField) {
      return sortOrder === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  if (loading && barbers.length === 0) {
    return <div className="loading-container">Loading barbers...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Barber Management</h1>
      
      <div className="filters-container">
        <div className="status-filter">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search barbers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>
      
      <div className="barbers-table-container">
        {loading && <div>Updating results...</div>}
        
        <table className="barbers-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>
                Name{getSortIndicator('name')}
              </th>
              <th onClick={() => handleSort('email')}>
                Email{getSortIndicator('email')}
              </th>
              <th onClick={() => handleSort('phone')}>
                Phone{getSortIndicator('phone')}
              </th>
              <th onClick={() => handleSort('status')}>
                Status{getSortIndicator('status')}
              </th>
              <th onClick={() => handleSort('createdAt')}>
                Applied Date{getSortIndicator('createdAt')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {barbers.length > 0 ? (
              barbers.map((barber) => (
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
                <td colSpan="6" className="no-data">
                  {statusFilter !== 'all' || searchTerm
                    ? 'No barbers match the current filters'
                    : 'No barbers found in the system'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
};

export default BarbersPage;