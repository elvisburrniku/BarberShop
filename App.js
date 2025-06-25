import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';

// Error boundary to catch React Native runtime errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Native Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>RestaurantX</Text>
          <Text style={styles.errorText}>Loading restaurants safely...</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

// Simple Restaurant Card Component
const RestaurantCard = ({ restaurant, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(restaurant)}>
    <View style={styles.cardContent}>
      <Text style={styles.restaurantName}>{restaurant.name}</Text>
      <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
      <Text style={styles.description}>{restaurant.description}</Text>
      <View style={styles.ratingContainer}>
        <Text style={styles.rating}>★ {restaurant.rating}</Text>
        <Text style={styles.priceLevel}>{'$'.repeat(restaurant.priceLevel)}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

// API Service
const ApiService = {
  async getRestaurants() {
    try {
      const response = await fetch('http://localhost:3001/api/restaurants');
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.log('Using fallback data due to API error:', error.message);
      return [
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
        }
      ];
    }
  }
};

function RestaurantApp() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const data = await ApiService.getRestaurants();
      setRestaurants(data);
    } catch (error) {
      console.error('Error loading restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantPress = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleBackPress = () => {
    setSelectedRestaurant(null);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>RestaurantX</Text>
        <Text style={styles.loading}>Loading restaurants...</Text>
      </View>
    );
  }

  if (selectedRestaurant) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Restaurant Details</Text>
        </View>
        <ScrollView style={styles.detailsContainer}>
          <Text style={styles.detailName}>{selectedRestaurant.name}</Text>
          <Text style={styles.detailCuisine}>{selectedRestaurant.cuisine}</Text>
          <Text style={styles.detailDescription}>{selectedRestaurant.description}</Text>
          <View style={styles.detailRating}>
            <Text style={styles.rating}>★ {selectedRestaurant.rating}</Text>
            <Text style={styles.priceLevel}>{'$'.repeat(selectedRestaurant.priceLevel)}</Text>
          </View>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Make Reservation</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>RestaurantX</Text>
        <Text style={styles.subtitle}>Discover Amazing Restaurants</Text>
      </View>
      
      <ScrollView style={styles.restaurantList}>
        {restaurants.map(restaurant => (
          <RestaurantCard 
            key={restaurant.id}
            restaurant={restaurant}
            onPress={handleRestaurantPress}
          />
        ))}
      </ScrollView>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {restaurants.length} restaurants available
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 50,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  loading: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  restaurantList: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    } : {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }),
  },
  cardContent: {
    padding: 20,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cuisine: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    color: '#FF9500',
    fontWeight: 'bold',
  },
  priceLevel: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 1,
  },
  backText: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
  },
  detailName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  detailCuisine: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
    marginBottom: 15,
  },
  detailDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  detailRating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  bookButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 15,
    paddingHorizontal: 30,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// Export wrapped component with error boundary
export default function App() {
  return (
    <ErrorBoundary>
      <RestaurantApp />
    </ErrorBoundary>
  );
}