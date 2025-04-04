import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Title, Text, Card, Button, useTheme, ActivityIndicator, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import BarberCard from '../components/BarberCard';
import AppointmentCard from '../components/AppointmentCard';

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const [error, setError] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Welcome header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user.firstName}</Text>
            <Title style={styles.titleText}>Find your barber today</Title>
          </View>
        </View>

        {/* Upcoming appointments section */}
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Upcoming Appointments</Title>
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
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text>No upcoming appointments</Text>
                <Button 
                  mode="contained" 
                  style={styles.button}
                  onPress={() => navigation.navigate('DiscoveryStack')}
                >
                  Book Now
                </Button>
              </Card.Content>
            </Card>
          )}
        </View>

        {/* Top rated barbers section */}
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Top Rated Barbers</Title>
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
          <Card style={styles.ctaCard}>
            <Card.Content style={styles.ctaContent}>
              <Title style={styles.ctaTitle}>Need a fresh cut?</Title>
              <Text style={styles.ctaText}>Discover barbers nearby and book your appointment today!</Text>
              <Button 
                mode="contained" 
                style={styles.ctaButton}
                onPress={() => navigation.navigate('DiscoveryStack')}
              >
                Find Barbers Near Me
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
      
      {/* Error message Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={dismissSnackbar}
        duration={4000}
        action={{
          label: 'OK',
          onPress: dismissSnackbar,
        }}
      >
        {error}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 16,
    opacity: 0.7,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 15,
  },
  horizontalBarberCard: {
    width: 250,
    marginRight: 15,
  },
  emptyCard: {
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  button: {
    marginTop: 15,
  },
  ctaSection: {
    padding: 20,
    marginBottom: 20,
  },
  ctaCard: {
    backgroundColor: '#2c3e50',
  },
  ctaContent: {
    padding: 10,
  },
  ctaTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  ctaText: {
    color: '#fff',
    marginBottom: 15,
  },
  ctaButton: {
    marginTop: 10,
  },
});

export default HomeScreen;
