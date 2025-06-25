import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, RefreshControl, Alert } from 'react-native';
import { Title, Text, useTheme, Card, Button, Chip, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import MaterialButton from '../components/MaterialButton';

const ReservationsScreen = ({ navigation }) => {
  const theme = useTheme();
  const { reservations, restaurants, cancelReservation } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('upcoming'); // 'upcoming', 'past', 'all'

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getFilteredReservations = () => {
    const now = new Date();
    
    return reservations.filter(reservation => {
      const reservationDate = new Date(reservation.date);
      
      switch (filter) {
        case 'upcoming':
          return reservationDate >= now && reservation.status !== 'cancelled';
        case 'past':
          return reservationDate < now || reservation.status === 'completed';
        case 'cancelled':
          return reservation.status === 'cancelled';
        default:
          return true;
      }
    });
  };

  const handleCancelReservation = (reservationId) => {
    Alert.alert(
      'Cancel Reservation',
      'Are you sure you want to cancel this reservation?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            cancelReservation(reservationId);
            Alert.alert('Success', 'Your reservation has been cancelled.');
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#2ecc71';
      case 'pending':
        return '#f39c12';
      case 'cancelled':
        return '#e74c3c';
      case 'completed':
        return '#95a5a6';
      default:
        return theme.colors.onSurface;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredReservations = getFilteredReservations();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Title style={[styles.title, { color: theme.colors.onBackground }]}>
          My Reservations
        </Title>
        
        {/* Filter Chips */}
        <View style={styles.filterContainer}>
          <Chip
            selected={filter === 'upcoming'}
            onPress={() => setFilter('upcoming')}
            style={[
              styles.filterChip,
              filter === 'upcoming' && { backgroundColor: theme.colors.primary }
            ]}
            textStyle={{
              color: filter === 'upcoming' ? theme.colors.onPrimary : theme.colors.onSurface
            }}
          >
            Upcoming
          </Chip>
          <Chip
            selected={filter === 'past'}
            onPress={() => setFilter('past')}
            style={[
              styles.filterChip,
              filter === 'past' && { backgroundColor: theme.colors.primary }
            ]}
            textStyle={{
              color: filter === 'past' ? theme.colors.onPrimary : theme.colors.onSurface
            }}
          >
            Past
          </Chip>
          <Chip
            selected={filter === 'cancelled'}
            onPress={() => setFilter('cancelled')}
            style={[
              styles.filterChip,
              filter === 'cancelled' && { backgroundColor: theme.colors.primary }
            ]}
            textStyle={{
              color: filter === 'cancelled' ? theme.colors.onPrimary : theme.colors.onSurface
            }}
          >
            Cancelled
          </Chip>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredReservations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="event-busy" size={64} color={theme.colors.onSurfaceVariant} />
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
              No reservations found
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.onSurfaceVariant }]}>
              {filter === 'upcoming' 
                ? "You don't have any upcoming reservations"
                : filter === 'past'
                ? "You don't have any past reservations"
                : "You don't have any cancelled reservations"
              }
            </Text>
          </View>
        ) : (
          filteredReservations.map((reservation) => {
            const restaurant = restaurants.find(r => r.id === reservation.restaurantId);
            
            return (
              <Card key={reservation.id} style={[styles.reservationCard, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.cardContent}>
                  <View style={styles.reservationHeader}>
                    <View style={styles.restaurantInfo}>
                      <Text style={[styles.restaurantName, { color: theme.colors.onSurface }]}>
                        {restaurant?.name || 'Unknown Restaurant'}
                      </Text>
                      <Text style={[styles.restaurantCuisine, { color: theme.colors.onSurfaceVariant }]}>
                        {restaurant?.cuisine}
                      </Text>
                    </View>
                    
                    <Chip
                      style={[styles.statusChip, { backgroundColor: getStatusColor(reservation.status) + '20' }]}
                      textStyle={{ color: getStatusColor(reservation.status), fontWeight: '600' }}
                    >
                      {getStatusText(reservation.status)}
                    </Chip>
                  </View>

                  <View style={styles.reservationDetails}>
                    <View style={styles.detailRow}>
                      <MaterialIcons name="event" size={16} color={theme.colors.onSurfaceVariant} />
                      <Text style={[styles.detailText, { color: theme.colors.onSurfaceVariant }]}>
                        {formatDate(reservation.date)}
                      </Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <MaterialIcons name="access-time" size={16} color={theme.colors.onSurfaceVariant} />
                      <Text style={[styles.detailText, { color: theme.colors.onSurfaceVariant }]}>
                        {formatTime(reservation.date)}
                      </Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <MaterialIcons name="people" size={16} color={theme.colors.onSurfaceVariant} />
                      <Text style={[styles.detailText, { color: theme.colors.onSurfaceVariant }]}>
                        {reservation.partySize} {reservation.partySize === 1 ? 'Guest' : 'Guests'}
                      </Text>
                    </View>
                  </View>

                  {reservation.specialRequests && (
                    <View style={styles.specialRequestsContainer}>
                      <Text style={[styles.specialRequestsLabel, { color: theme.colors.onSurfaceVariant }]}>
                        Special Requests:
                      </Text>
                      <Text style={[styles.specialRequestsText, { color: theme.colors.onSurface }]}>
                        {reservation.specialRequests}
                      </Text>
                    </View>
                  )}

                  <View style={styles.actionsContainer}>
                    {reservation.status === 'confirmed' && (
                      <>
                        <Button
                          mode="outlined"
                          onPress={() => handleCancelReservation(reservation.id)}
                          style={styles.actionButton}
                          textColor={theme.colors.error}
                        >
                          Cancel
                        </Button>
                        <Button
                          mode="contained"
                          onPress={() => navigation.navigate('RestaurantDetail', { 
                            restaurantId: reservation.restaurantId 
                          })}
                          style={styles.actionButton}
                        >
                          View Restaurant
                        </Button>
                      </>
                    )}
                    
                    {reservation.status === 'pending' && (
                      <Button
                        mode="outlined"
                        onPress={() => handleCancelReservation(reservation.id)}
                        style={styles.actionButton}
                        textColor={theme.colors.error}
                      >
                        Cancel
                      </Button>
                    )}
                  </View>
                </View>
              </Card>
            );
          })
        )}
      </ScrollView>

      {/* FAB for new reservation */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('DiscoveryStack')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  reservationCard: {
    marginBottom: 16,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '600',
  },
  restaurantCuisine: {
    fontSize: 14,
    marginTop: 2,
  },
  statusChip: {
    marginLeft: 12,
  },
  reservationDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
  },
  specialRequestsContainer: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  specialRequestsLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  specialRequestsText: {
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default ReservationsScreen;