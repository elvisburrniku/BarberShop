import React, { createContext, useState, useEffect, useContext } from 'react';
import * as Location from 'expo-location';
import { mockBarberShops, mockServices, mockAppointments, mockUser } from '../utils/MockData';

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
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permission to access location was denied');
        setLoading(false);
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        setLocationError('Error getting location');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Find nearby barber shops based on user location
  const findNearbyBarberShops = () => {
    // In a real app, we would call an API to get nearby shops
    // For this MVP, we're just returning all mock shops
    return barberShops;
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
