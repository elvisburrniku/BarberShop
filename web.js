import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// Pure web-based RestaurantX app to avoid React Native C++ issues
const WebApp = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const response = await fetch('/api/restaurants');
      if (!response.ok) throw new Error('API not available');
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.log('Using fallback data:', error.message);
      setRestaurants([
        {
          id: 1,
          name: "Bella Italia",
          description: "Authentic Italian cuisine in the heart of downtown",
          cuisine: "Italian",
          rating: 4.5,
          priceLevel: 3
        },
        {
          id: 2,
          name: "Sakura Sushi",
          description: "Fresh sushi and Japanese cuisine",
          cuisine: "Japanese", 
          rating: 4.7,
          priceLevel: 4
        },
        {
          id: 3,
          name: "The Garden Café",
          description: "Farm-to-table dining with organic ingredients",
          cuisine: "American",
          rating: 4.3,
          priceLevel: 2
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#2196F3',
      margin: '0 0 10px 0'
    },
    subtitle: {
      fontSize: '16px',
      color: '#666',
      margin: '0'
    },
    loading: {
      textAlign: 'center',
      fontSize: '18px',
      color: '#666',
      padding: '40px'
    },
    restaurantGrid: {
      display: 'grid',
      gap: '20px',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      transition: 'transform 0.2s, boxShadow 0.2s',
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }
    },
    restaurantName: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#333',
      margin: '0 0 8px 0'
    },
    cuisine: {
      fontSize: '14px',
      color: '#2196F3',
      fontWeight: '600',
      margin: '0 0 10px 0'
    },
    description: {
      fontSize: '14px',
      color: '#666',
      lineHeight: '1.4',
      margin: '0 0 15px 0'
    },
    ratingContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    rating: {
      fontSize: '16px',
      color: '#FF9500',
      fontWeight: 'bold'
    },
    priceLevel: {
      fontSize: '16px',
      color: '#4CAF50',
      fontWeight: 'bold'
    },
    backButton: {
      background: '#2196F3',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      marginBottom: '20px'
    },
    detailContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    detailName: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#333',
      margin: '0 0 10px 0'
    },
    detailCuisine: {
      fontSize: '16px',
      color: '#2196F3',
      fontWeight: '600',
      margin: '0 0 15px 0'
    },
    detailDescription: {
      fontSize: '16px',
      color: '#666',
      lineHeight: '1.5',
      margin: '0 0 20px 0'
    },
    bookButton: {
      background: '#2196F3',
      color: 'white',
      border: 'none',
      padding: '15px 30px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      marginTop: '20px'
    }
  };

  const handleCardClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleBackClick = () => {
    setSelectedRestaurant(null);
  };

  const handleBookClick = () => {
    alert(`Booking feature for ${selectedRestaurant.name} - Coming soon!`);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>RestaurantX</h1>
          <div style={styles.loading}>Loading restaurants...</div>
        </div>
      </div>
    );
  }

  if (selectedRestaurant) {
    return (
      <div style={styles.container}>
        <button style={styles.backButton} onClick={handleBackClick}>
          ← Back to Restaurants
        </button>
        <div style={styles.detailContainer}>
          <h1 style={styles.detailName}>{selectedRestaurant.name}</h1>
          <div style={styles.detailCuisine}>{selectedRestaurant.cuisine}</div>
          <p style={styles.detailDescription}>{selectedRestaurant.description}</p>
          <div style={styles.ratingContainer}>
            <span style={styles.rating}>★ {selectedRestaurant.rating}</span>
            <span style={styles.priceLevel}>{'$'.repeat(selectedRestaurant.priceLevel)}</span>
          </div>
          <button style={styles.bookButton} onClick={handleBookClick}>
            Make Reservation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>RestaurantX</h1>
        <p style={styles.subtitle}>Discover Amazing Restaurants</p>
      </div>

      <div style={styles.restaurantGrid}>
        {restaurants.map(restaurant => (
          <div 
            key={restaurant.id} 
            style={styles.card}
            onClick={() => handleCardClick(restaurant)}
          >
            <h3 style={styles.restaurantName}>{restaurant.name}</h3>
            <div style={styles.cuisine}>{restaurant.cuisine}</div>
            <p style={styles.description}>{restaurant.description}</p>
            <div style={styles.ratingContainer}>
              <span style={styles.rating}>★ {restaurant.rating}</span>
              <span style={styles.priceLevel}>{'$'.repeat(restaurant.priceLevel)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Initialize the web app
if (typeof document !== 'undefined') {
  const container = document.getElementById('root') || document.body;
  const root = createRoot(container);
  root.render(<WebApp />);
}

export default WebApp;