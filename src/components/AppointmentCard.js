import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Text, Button, Avatar, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import { formatAppointmentDate, formatCurrency } from '../utils/DateTimeUtils';

const AppointmentCard = ({ appointment, barbers, onPress, showActions, onCancel, onReschedule }) => {
  const theme = useTheme();

  // Find the barber for this appointment
  const barber = barbers.find(b => b.id === appointment.barberId);
  
  // Get status color
  const getStatusColor = () => {
    switch (appointment.status) {
      case 'upcoming':
        return theme.colors.primary;
      case 'completed':
        return theme.colors.success;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.text;
    }
  };
  
  if (!barber) return null;

  return (
    <Card 
      style={styles.card} 
      elevation={2}
      onPress={onPress}
    >
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.barberInfo}>
            <Avatar.Image 
              source={{ uri: barber.coverImage }} 
              size={50}
              style={styles.barberAvatar} 
            />
            <View>
              <Title style={styles.barberName}>{barber.name}</Title>
              <Text style={styles.address} numberOfLines={1}>
                {barber.location.address}
              </Text>
            </View>
          </View>
          <View style={[styles.statusChip, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.appointmentDetails}>
          <View style={styles.detailItem}>
            <Icon name="calendar" size={16} color="#666" />
            <Text style={styles.detailText}>
              {formatAppointmentDate(new Date(appointment.date))}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="clock" size={16} color="#666" />
            <Text style={styles.detailText}>
              {new Date(appointment.date).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
        </View>

        {appointment.services && appointment.services.length > 0 && (
          <View style={styles.servicesContainer}>
            <Text style={styles.servicesLabel}>Services:</Text>
            {appointment.services.map((serviceId, index) => {
              const service = barber.services?.find(s => s.id === serviceId);
              if (!service) return null;

              return (
                <View key={serviceId} style={styles.serviceItem}>
                  <Text>{service.name}</Text>
                  <Text>{formatCurrency(service.price)}</Text>
                </View>
              );
            })}
          </View>
        )}

        {showActions && (
          <View style={styles.actions}>
            <Button 
              mode="outlined" 
              onPress={onCancel}
              style={[styles.actionButton, styles.cancelButton]}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={onReschedule}
              style={styles.actionButton}
            >
              Reschedule
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  barberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  barberAvatar: {
    marginRight: 12,
  },
  barberName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 12,
    color: '#666',
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  appointmentDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    marginLeft: 4,
    fontSize: 14,
  },
  servicesContainer: {
    marginBottom: 12,
  },
  servicesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  cancelButton: {
    borderColor: 'red',
  },
});

export default AppointmentCard;
