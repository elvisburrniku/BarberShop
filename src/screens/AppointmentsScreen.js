import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { 
  Title, 
  Chip, 
  Text, 
  Button, 
  useTheme, 
  Portal, 
  Dialog,
  Paragraph
} from 'react-native-paper';
import { useAppContext } from '../context/AppContext';
import AppointmentCard from '../components/AppointmentCard';

const AppointmentsScreen = ({ navigation }) => {
  const theme = useTheme();
  const { appointments, barberShops, cancelAppointment } = useAppContext();
  
  const [filter, setFilter] = useState('upcoming');
  const [cancelDialogVisible, setCancelDialogVisible] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  // Filter appointments based on selected filter
  const filteredAppointments = appointments.filter(appointment => {
    switch (filter) {
      case 'upcoming':
        return appointment.status === 'upcoming';
      case 'past':
        return appointment.status === 'completed';
      case 'cancelled':
        return appointment.status === 'cancelled';
      default:
        return true;
    }
  });

  // Show cancel confirmation dialog
  const showCancelDialog = (appointment) => {
    setAppointmentToCancel(appointment);
    setCancelDialogVisible(true);
  };

  // Handle appointment cancellation
  const handleCancelAppointment = () => {
    if (appointmentToCancel) {
      cancelAppointment(appointmentToCancel.id);
    }
    setCancelDialogVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Filter pills */}
      <View style={styles.filtersContainer}>
        <Chip
          selected={filter === 'upcoming'}
          onPress={() => setFilter('upcoming')}
          style={[
            styles.filterChip,
            filter === 'upcoming' && { backgroundColor: theme.colors.primary }
          ]}
          textStyle={filter === 'upcoming' ? { color: '#fff' } : {}}
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
          textStyle={filter === 'past' ? { color: '#fff' } : {}}
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
          textStyle={filter === 'cancelled' ? { color: '#fff' } : {}}
        >
          Cancelled
        </Chip>
      </View>

      <View style={styles.contentContainer}>
        <Title style={styles.title}>
          {filter.charAt(0).toUpperCase() + filter.slice(1)} Appointments
        </Title>

        {filteredAppointments.length > 0 ? (
          <FlatList
            data={filteredAppointments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <AppointmentCard 
                appointment={item}
                barbers={barberShops}
                showActions={filter === 'upcoming'}
                onCancel={() => showCancelDialog(item)}
                onReschedule={() => navigation.navigate('DiscoveryStack', {
                  screen: 'Booking',
                  params: { 
                    barberId: item.barberId,
                    rescheduleAppointmentId: item.id
                  }
                })}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No {filter} appointments found
            </Text>
            {filter === 'upcoming' && (
              <Button 
                mode="contained" 
                style={styles.bookButton}
                onPress={() => navigation.navigate('DiscoveryStack')}
              >
                Book an Appointment
              </Button>
            )}
          </View>
        )}
      </View>

      {/* Cancel Appointment Dialog */}
      <Portal>
        <Dialog
          visible={cancelDialogVisible}
          onDismiss={() => setCancelDialogVisible(false)}
        >
          <Dialog.Title>Cancel Appointment</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setCancelDialogVisible(false)}>No, Keep It</Button>
            <Button onPress={handleCancelAppointment} color={theme.colors.error}>
              Yes, Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filtersContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterChip: {
    marginRight: 8,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
    fontSize: 18,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
  },
  bookButton: {
    marginTop: 16,
  },
});

export default AppointmentsScreen;
