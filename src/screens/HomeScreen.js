import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { Title, Text, useTheme, ActivityIndicator, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import BarberCard from '../components/BarberCard';
import AppointmentCard from '../components/AppointmentCard';
import MaterialCard from '../components/MaterialCard';
import MaterialButton from '../components/MaterialButton';
import FloatingActionButton from '../components/FloatingActionButton';
import RippleEffect from '../components/RippleEffect';

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const [error, setError] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  // Animation values
  const [scrollY] = useState(new Animated.Value(0));
  
  const { 
    user, 
    barberShops, 
    appointments, 
    loading,
    locationError,
    findNearbyBarberShops 
  } = useAppContext();

  // Get nearby shops when the screen loads
  useEffect(() => {
    try {
      findNearbyBarberShops();
      
      // Show location error message if there was a problem
      if (locationError) {
        setError("Location services unavailable. Showing all barbers instead.");
        setSnackbarVisible(true);
      }
    } catch (err) {
      console.log('Error loading home data:', err);
      setError("There was a problem loading data. Please try again.");
      setSnackbarVisible(true);
    }
  }, [locationError]);

  // Safe access to filter appointments (handle potential null values)
  const upcomingAppointments = appointments ? 
    appointments
      .filter(app => app && app.status === 'upcoming')
      .slice(0, 2) 
    : [];

  // Safely get top rated barber shops
  const topRatedBarbers = barberShops ? 
    [...barberShops]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3)
    : [];
  
  const dismissSnackbar = () => setSnackbarVisible(false);
  
  // Header animation styles
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });
  
  const headerElevation = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 3],
    extrapolate: 'clamp',
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View 
        style={[
          styles.header, 
          { 
            backgroundColor: theme.colors.surface,
            opacity: headerOpacity,
            elevation: headerElevation,
            ...theme.shadows.medium,
          }
        ]}
      >
        <View>
          <Text style={[styles.greeting, { color: theme.colors.placeholder }]}>
            Hello, {user.firstName}
          </Text>
          <Title style={[styles.titleText, { color: theme.colors.text }]}>
            Find your barber today
          </Title>
        </View>
        <RippleEffect
          onPress={() => navigation.navigate('Profile')}
          borderless
        >
          <View style={styles.profileButton}>
            <MaterialIcons name="account-circle" size={24} color={theme.colors.primary} />
          </View>
        </RippleEffect>
      </Animated.View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Space for fixed header */}
        <View style={{ height: 80 }} />

        {/* Upcoming appointments section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Upcoming Appointments
            </Title>
            <RippleEffect
              onPress={() => navigation.navigate('Appointments')}
              borderless
            >
              <Text style={{ color: theme.colors.primary }}>See All</Text>
            </RippleEffect>
          </View>
          
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(appointment => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment}
                barbers={barberShops}
                onPress={() => navigation.navigate('Appointments')}
              />
            ))
          ) : (
            <MaterialCard 
              elevation={1} 
              style={styles.emptyCard}
            >
              <View style={styles.emptyCardContent}>
                <Text style={{ color: theme.colors.placeholder, marginBottom: 16 }}>
                  No upcoming appointments
                </Text>
                <MaterialButton 
                  label="Book Now"
                  mode="filled"
                  iconName="calendar-plus"
                  onPress={() => navigation.navigate('DiscoveryStack')}
                />
              </View>
            </MaterialCard>
          )}
        </View>

        {/* Top rated barbers section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Top Rated Barbers
            </Title>
            <RippleEffect
              onPress={() => navigation.navigate('DiscoveryStack')}
              borderless
            >
              <Text style={{ color: theme.colors.primary }}>View All</Text>
            </RippleEffect>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {topRatedBarbers.map(barber => (
              <BarberCard 
                key={barber.id} 
                barber={barber} 
                onPress={() => {
                  navigation.navigate('DiscoveryStack', {
                    screen: 'BarberDetail',
                    params: { barberId: barber.id }
                  });
                }}
                style={styles.horizontalBarberCard}
              />
            ))}
          </ScrollView>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <MaterialCard 
            elevation={3}
            style={styles.ctaCard}
          >
            <View style={styles.ctaContent}>
              <Title style={styles.ctaTitle}>Need a fresh cut?</Title>
              <Text style={styles.ctaText}>
                Discover barbers nearby and book your appointment today!
              </Text>
              <MaterialButton 
                label="Find Barbers Near Me"
                mode="filled"
                iconName="place"
                onPress={() => navigation.navigate('DiscoveryStack')}
                color={theme.colors.secondary}
              />
            </View>
          </MaterialCard>
        </View>
        
        {/* Extra space at bottom for FAB */}
        <View style={{ height: 80 }} />
      </ScrollView>
      
      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <FloatingActionButton
          iconName="add"
          onPress={() => navigation.navigate('DiscoveryStack')}
          extended={true}
          label="Book Now"
        />
      </View>
      
      {/* Error message Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={dismissSnackbar}
        duration={4000}
        action={{
          label: 'OK',
          onPress: dismissSnackbar,
        }}
        style={{ backgroundColor: theme.colors.error }}
      >
        {error}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Animated fixed header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: 80,
  },
  greeting: {
    fontSize: 16,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Content sections
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  horizontalBarberCard: {
    width: 250,
    marginRight: 15,
  },
  // Empty state card
  emptyCard: {
    padding: 16,
    marginBottom: 15,
  },
  emptyCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  // Call to action section
  ctaSection: {
    padding: 16,
    marginBottom: 20,
  },
  ctaCard: {
    padding: 0,
  },
  ctaContent: {
    padding: 24,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  ctaText: {
    color: '#fff',
    marginBottom: 20,
    fontSize: 16,
    opacity: 0.9,
  },
  // Floating action button
  fabContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 999,
  },
});

export default HomeScreen;
