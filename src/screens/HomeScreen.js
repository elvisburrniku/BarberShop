import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Title, Text, useTheme, ActivityIndicator, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import RestaurantCard from '../components/RestaurantCard';
import MaterialCard from '../components/MaterialCard';
import MaterialButton from '../components/MaterialButton';
import FloatingActionButton from '../components/FloatingActionButton';
import RippleEffect from '../components/RippleEffect';

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const [error, setError] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  
  const { 
    user, 
    restaurants, 
    reservations, 
    featuredRestaurants,
    loading,
    locationError,
    findNearbyRestaurants 
  } = useAppContext();

  // Get nearby restaurants when the screen loads
  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        await findNearbyRestaurants();
      } catch (err) {
        console.log('Error loading home data:', err);
        setError("There was a problem loading data. Please try again.");
        setSnackbarVisible(true);
      }
    };
    
    loadRestaurants();
  }, []);
  
  // Show error message when location error changes
  useEffect(() => {
    if (locationError) {
      setError("Location services unavailable. Showing all restaurants instead.");
      setSnackbarVisible(true);
    }
  }, [locationError]);

  // Filter and sort nearby restaurants
  const nearbyRestaurants = restaurants
    .filter(restaurant => restaurant.distance && restaurant.distance <= 10)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5);

  // Get upcoming reservations
  const upcomingReservations = reservations
    .filter(res => res.status === 'confirmed')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
            Loading restaurants...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.onBackground }]}>
              Welcome back, {user.firstName}!
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Discover amazing restaurants nearby
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={[styles.profileButton, { backgroundColor: theme.colors.primaryContainer }]}
          >
            <MaterialIcons name="person" size={24} color={theme.colors.onPrimaryContainer} />
          </TouchableOpacity>
        </View>

        {/* Quick Action Cards */}
        <View style={styles.quickActionsContainer}>
          <MaterialCard
            title="Reserve Table"
            subtitle="Find restaurants"
            icon="restaurant"
            onPress={() => navigation.navigate('DiscoveryStack')}
            style={[styles.quickActionCard, { backgroundColor: theme.colors.primaryContainer }]}
            titleColor={theme.colors.onPrimaryContainer}
            subtitleColor={theme.colors.onPrimaryContainer}
            iconColor={theme.colors.onPrimaryContainer}
          />

          <MaterialCard
            title="My Reservations"
            subtitle={`${upcomingReservations.length} upcoming`}
            icon="calendar"
            onPress={() => navigation.navigate('Reservations')}
            style={[styles.quickActionCard, { backgroundColor: theme.colors.secondaryContainer }]}
            titleColor={theme.colors.onSecondaryContainer}
            subtitleColor={theme.colors.onSecondaryContainer}
            iconColor={theme.colors.onSecondaryContainer}
          />
        </View>

        {/* Featured Restaurants */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Title style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
              Featured Restaurants
            </Title>
            <MaterialButton
              title="See All"
              onPress={() => navigation.navigate('DiscoveryStack')}
              mode="text"
              compact
            />
          </View>

          {featuredRestaurants.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContainer}
            >
              {featuredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: restaurant.id })}
                  style={styles.horizontalCard}
                />
              ))}
            </ScrollView>
          ) : (
            <MaterialCard
              title="No restaurants found"
              subtitle="Try expanding your search area"
              icon="restaurant"
              style={[styles.emptyCard, { backgroundColor: theme.colors.surfaceVariant }]}
              titleColor={theme.colors.onSurfaceVariant}
              subtitleColor={theme.colors.onSurfaceVariant}
              iconColor={theme.colors.onSurfaceVariant}
            />
          )}
        </View>

        {/* Upcoming Reservations */}
        {upcomingReservations.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Title style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
                Upcoming Reservations
              </Title>
              <MaterialButton
                title="View All"
                onPress={() => navigation.navigate('Reservations')}
                mode="text"
                compact
              />
            </View>

            <View style={styles.reservationsContainer}>
              {upcomingReservations.map((reservation) => {
                const restaurant = restaurants.find(r => r.id === reservation.restaurantId);
                return (
                  <MaterialCard
                    key={reservation.id}
                    title={restaurant?.name || 'Restaurant'}
                    subtitle={new Date(reservation.date).toLocaleDateString()}
                    icon="event"
                    onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: reservation.restaurantId })}
                    style={styles.reservationCard}
                  />
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Snackbar for errors */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
      >
        {error}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  horizontalScrollContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  horizontalCard: {
    width: 280,
    marginRight: 8,
  },
  emptyCard: {
    marginHorizontal: 16,
  },
  reservationsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  reservationCard: {
    marginBottom: 8,
  },
});

export default HomeScreen;