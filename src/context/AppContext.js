import React, { createContext, useState, useEffect, useContext } from 'react';
import { mockBarberShops, mockServices, mockAppointments, mockUser } from '../utils/MockData';
import { getCurrentLocation, requestLocationPermission, calculateDistance } from '../utils/LocationService';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(mockUser);
  const [barberShops, setBarberShops] = useState(mockBarberShops);
  const [services, setServices] = useState(mockServices);
  const [appointments, setAppointments] = useState(mockAppointments);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDateTime, setSelectedDateTime] = useState(null);

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

  // Find nearby barber shops based on user location
  const findNearbyBarberShops = async () => {
    try {
      setLoading(true);
      
      // In a real app, we would call an API to get nearby shops
      // based on the user's location coordinates
      
      // Check if we have a user location
      if (!userLocation && !locationError) {
        // Try to get location again if we don't have it yet
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
      
      // For this MVP with mock data, we filter by distance from user
      if (userLocation) {
        // Calculate distance for each barber shop from user's location
        const shopsWithDistance = barberShops.map(shop => {
          const distance = calculateDistance(
            { lat: userLocation.lat, lng: userLocation.lng },
            { lat: shop.location.lat, lng: shop.location.lng }
          );
          
          return {
            ...shop,
            distance: parseFloat(distance.toFixed(1))
          };
        });
        
        // Sort by distance
        const sortedShops = [...shopsWithDistance].sort((a, b) => a.distance - b.distance);
        setBarberShops(sortedShops);
      }
      
      return barberShops;
    } catch (error) {
      console.log('Error finding nearby barber shops:', error);
      setLocationError('Error finding nearby barber shops');
      return barberShops;
    } finally {
      setLoading(false);
    }
  };

  // Book an appointment
  const bookAppointment = (barberId, date, services) => {
    const newAppointment = {
      id: `app-${appointments.length + 1}`,
      barberId,
      date,
      services,
      status: 'upcoming',
    };

    setAppointments([...appointments, newAppointment]);
    return newAppointment;
  };

  // Cancel an appointment
  const cancelAppointment = (appointmentId) => {
    const updatedAppointments = appointments.map(app => 
      app.id === appointmentId ? { ...app, status: 'cancelled' } : app
    );
    setAppointments(updatedAppointments);
  };

  // Add a barber to favorites
  const toggleFavoriteBarber = (barberId) => {
    const updatedBarberShops = barberShops.map(shop => {
      if (shop.id === barberId) {
        return { ...shop, isFavorite: !shop.isFavorite };
      }
      return shop;
    });
    setBarberShops(updatedBarberShops);
  };

  // Get available time slots for a specific date and barber
  const getAvailableTimeSlots = (barberId, date) => {
    // In a real app, this would query the backend
    // For MVP, we'll generate some time slots
    const timeSlots = [];
    const startHour = 9; // 9 AM
    const endHour = 18; // 6 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        timeSlots.push({
          time: `${hour}:${minute === 0 ? '00' : minute}`,
          available: Math.random() > 0.3 // Randomly mark some as unavailable
        });
      }
    }
    
    return timeSlots;
  };

  // Calculate total price for selected services
  const calculateTotalPrice = (serviceIds) => {
    return serviceIds.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service ? service.price : 0);
    }, 0);
  };

  // Reset the booking form
  const resetBooking = () => {
    setSelectedBarber(null);
    setSelectedServices([]);
    setSelectedDateTime(null);
  };

  return (
    <AppContext.Provider value={{
      user,
      barberShops,
      services,
      appointments,
      userLocation,
      locationError,
      loading,
      selectedBarber,
      selectedServices,
      selectedDateTime,
      setUser,
      setSelectedBarber,
      setSelectedServices,
      setSelectedDateTime,
      findNearbyBarberShops,
      bookAppointment,
      cancelAppointment,
      toggleFavoriteBarber,
      getAvailableTimeSlots,
      calculateTotalPrice,
      resetBooking
    }}>
      {children}
    </AppContext.Provider>
  );
};
