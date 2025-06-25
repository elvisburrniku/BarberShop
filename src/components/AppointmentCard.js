import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, useTheme, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const AppointmentCard = ({ appointment, onPress, style }) => {
  const theme = useTheme();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#2ecc71';
      case 'pending':
        return '#f39c12';
      case 'cancelled':
        return '#e74c3c';
      default:
        return theme.colors.onSurface;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.cardContent}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="event" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.appointmentInfo}>
              <Text style={[styles.title, { color: theme.colors.onSurface }]}>
                Reservation
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                {formatDate(appointment.date)} at {formatTime(appointment.date)}
              </Text>
            </View>
            <Chip
              style={[styles.statusChip, { backgroundColor: getStatusColor(appointment.status) + '20' }]}
              textStyle={{ color: getStatusColor(appointment.status), fontWeight: '600' }}
            >
              {appointment.status}
            </Chip>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  card: {
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  statusChip: {
    height: 28,
  },
});

export default AppointmentCard;