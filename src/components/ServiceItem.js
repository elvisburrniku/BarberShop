import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import { formatCurrency } from '../utils/DateTimeUtils';

const ServiceItem = ({ service, onPress, selected, selectable }) => {
  const theme = useTheme();

  if (!service) return null;

  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <Card 
        style={[
          styles.card, 
          selected && { borderColor: theme.colors.primary, borderWidth: 2 }
        ]} 
        elevation={2}
      >
        <Card.Content style={styles.cardContent}>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceDuration}>{service.duration} min</Text>
            <Text style={styles.serviceDescription} numberOfLines={2}>
              {service.description}
            </Text>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.servicePrice}>{formatCurrency(service.price)}</Text>
            {selectable && (
              <View 
                style={[
                  styles.checkbox, 
                  selected && { backgroundColor: theme.colors.primary }
                ]}
              >
                {selected && <Icon name="check" size={16} color="#fff" />}
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  serviceInfo: {
    flex: 1,
    marginRight: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  serviceDuration: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#444',
  },
  priceContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ServiceItem;
