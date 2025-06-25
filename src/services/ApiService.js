const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  // Restaurant endpoints
  static async getRestaurants(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.cuisine) params.append('cuisine', filters.cuisine);
      if (filters.city) params.append('city', filters.city);
      if (filters.search) params.append('search', filters.search);
      
      const url = `${API_BASE_URL}/restaurants${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }
  }

  static async getRestaurantById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/restaurants/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      throw error;
    }
  }

  // Booking endpoints
  static async createBooking(restaurantId, bookingData) {
    try {
      const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  static async getBookingsByEmail(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings?email=${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  // Review endpoints
  static async submitReview(restaurantId, reviewData) {
    try {
      const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  }

  // Utility endpoints
  static async getCuisines() {
    try {
      const response = await fetch(`${API_BASE_URL}/cuisines`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching cuisines:', error);
      throw error;
    }
  }

  static async checkApiHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API health check failed:', error);
      throw error;
    }
  }

  static async testDatabaseConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/db-test`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Database connection test failed:', error);
      throw error;
    }
  }
}

export default ApiService;