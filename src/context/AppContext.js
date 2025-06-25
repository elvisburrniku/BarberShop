import React, { createContext, useState, useEffect, useContext } from 'react';
import { mockRestaurants, mockMenuItems, mockReservations, mockUser, mockFeaturedRestaurants, mockCuisineCategories } from '../utils/RestaurantMockData';
import { getCurrentLocation, requestLocationPermission, calculateDistance } from '../utils/LocationService';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(mockUser);
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [menuItems, setMenuItems] = useState(mockMenuItems);
  const [reservations, setReservations] = useState(mockReservations);
  const [featuredRestaurants, setFeaturedRestaurants] = useState(mockFeaturedRestaurants);
  const [cuisineCategories, setCuisineCategories] = useState(mockCuisineCategories);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [partySize, setPartySize] = useState(2);

  // Get the user's location when the app starts
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // Check if we have permission first
        const hasPermission = await requestLocationPermission();
        
        if (!hasPermission) {
          console.log('Location permission denied');
          setLocationError('Permission to access location was denied');
          // Set a default location but mark error state
          setUserLocation({
            latitude: 40.7128,
            longitude: -74.0060, // New York coordinates as fallback
          });
          return;
        }

        try {
          // Use our improved getCurrentLocation function
          const location = await getCurrentLocation();
          
          if (location) {
            console.log('Got location:', location);
            setUserLocation({
              lat: location.lat,
              lng: location.lng,
            });
          } else {
            throw new Error('Failed to get location');
          }
        } catch (error) {
          console.log('Error getting location:', error);
          setLocationError('Error getting location');
          // Provide default location to prevent app crashes
          setUserLocation({
            lat: 40.7128,
            lng: -74.0060, // New York coordinates as fallback
          });
        }
      } catch (error) {
        console.log('Error in location effect:', error);
        setLocationError('Error with location services');
        // Provide default location to prevent app crashes
        setUserLocation({
          lat: 40.7128,
          lng: -74.0060, // New York coordinates as fallback
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Find nearby restaurants based on user location
  const findNearbyRestaurants = async () => {
    try {
      setLoading(true);
      
      // Check if we have a user location
      if (!userLocation && !locationError) {
        const location = await getCurrentLocation();
        
        if (location) {
          setUserLocation({
            lat: location.lat,
            lng: location.lng
          });
        } else {
          setLocationError('Could not determine your location');
        }
      }
      
      // Calculate distance for each restaurant from user's location
      if (userLocation) {
        const restaurantsWithDistance = restaurants.map(restaurant => {
          const distance = calculateDistance(
            { lat: userLocation.lat, lng: userLocation.lng },
            { lat: restaurant.location.lat, lng: restaurant.location.lng }
          );
          
          return {
            ...restaurant,
            distance: parseFloat(distance.toFixed(1))
          };
        });
        
        // Sort by distance
        const sortedRestaurants = [...restaurantsWithDistance].sort((a, b) => a.distance - b.distance);
        setRestaurants(sortedRestaurants);
      }
      
      return restaurants;
    } catch (error) {
      console.log('Error finding nearby restaurants:', error);
      setLocationError('Error finding nearby restaurants');
      return restaurants;
    } finally {
      setLoading(false);
    }
  };

  // Make a reservation
  const makeReservation = (reservationData) => {
    const newReservation = {
      id: `res-${reservations.length + 1}`,
      userId: user.id,
      restaurantId: reservationData.restaurantId,
      date: `${reservationData.date}T${reservationData.time}:00Z`,
      partySize: reservationData.partySize,
      specialRequests: reservationData.specialRequests,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    setReservations([...reservations, newReservation]);
    return newReservation;
  };

  // Cancel a reservation
  const cancelReservation = (reservationId) => {
    const updatedReservations = reservations.map(res => 
      res.id === reservationId ? { ...res, status: 'cancelled' } : res
    );
    setReservations(updatedReservations);
  };

  // Add a restaurant to favorites
  const toggleFavoriteRestaurant = (restaurantId) => {
    const updatedRestaurants = restaurants.map(restaurant => {
      if (restaurant.id === restaurantId) {
        return { ...restaurant, isFavorite: !restaurant.isFavorite };
      }
      return restaurant;
    });
    setRestaurants(updatedRestaurants);
  };

  // Get available time slots for a specific date and restaurant
  const getAvailableTimeSlots = (restaurantId, date) => {
    const timeSlots = [];
    const startHour = 11; // 11 AM
    const endHour = 22; // 10 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour > 12 ? hour - 12 : hour}:${minute === 0 ? '00' : minute} ${hour >= 12 ? 'PM' : 'AM'}`;
        timeSlots.push({
          time: timeString,
          available: Math.random() > 0.4 // Randomly mark some as unavailable
        });
      }
    }
    
    return timeSlots;
  };

  // Search restaurants by name, cuisine, or location
  const searchRestaurants = (query) => {
    if (!query.trim()) {
      return restaurants;
    }
    
    const searchTerm = query.toLowerCase();
    return restaurants.filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchTerm) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm) ||
      restaurant.location.address.toLowerCase().includes(searchTerm)
    );
  };

  // Reset the reservation form
  const resetReservation = () => {
    setSelectedRestaurant(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setPartySize(2);
  };

  return (
    <AppContext.Provider value={{
      user,
      restaurants,
      menuItems,
      reservations,
      featuredRestaurants,
      cuisineCategories,
      userLocation,
      locationError,
      loading,
      selectedRestaurant,
      selectedDate,
      selectedTime,
      partySize,
      setUser,
      setSelectedRestaurant,
      setSelectedDate,
      setSelectedTime,
      setPartySize,
      findNearbyRestaurants,
      makeReservation,
      cancelReservation,
      toggleFavoriteRestaurant,
      getAvailableTimeSlots,
      searchRestaurants,
      resetReservation
    }}>
      {children}
    </AppContext.Provider>
  );
};
