import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { Title, Text, useTheme, Card, TextInput, Button, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import MaterialButton from '../components/MaterialButton';
import TimeSlotPicker from '../components/TimeSlotPicker';
import CalendarView from '../components/CalendarView';

const ReservationScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { restaurants, makeReservation } = useAppContext();
  const { restaurantId } = route.params;
  
  const restaurant = restaurants.find(r => r.id === restaurantId);
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [partySize, setPartySize] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);

  const partySizes = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleConfirmReservation = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Missing Information', 'Please select both date and time for your reservation.');
      return;
    }

    setLoading(true);
    
    try {
      // Create reservation object
      const reservationData = {
        restaurantId: restaurant.id,
        date: selectedDate,
        time: selectedTime,
        partySize,
        specialRequests: specialRequests.trim(),
      };

      const newReservation = await makeReservation(reservationData);
      
      Alert.alert(
        'Reservation Confirmed!',
        `Your table for ${partySize} at ${restaurant.name} has been booked for ${selectedDate} at ${selectedTime}.`,
        [
          {
            text: 'View Reservations',
            onPress: () => navigation.navigate('Reservations')
          },
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to make reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!restaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Restaurant not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Restaurant Info */}
        <Card style={[styles.restaurantCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.restaurantInfo}>
            <MaterialIcons name="restaurant" size={24} color={theme.colors.primary} />
            <View style={styles.restaurantDetails}>
              <Title style={[styles.restaurantName, { color: theme.colors.onSurface }]}>
                {restaurant.name}
              </Title>
              <Text style={[styles.restaurantCuisine, { color: theme.colors.onSurfaceVariant }]}>
                {restaurant.cuisine} • {restaurant.location.address}
              </Text>
            </View>
          </View>
        </Card>

        {/* Party Size */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
            Party Size
          </Text>
          <View style={styles.partySizeContainer}>
            {partySizes.map((size) => (
              <Chip
                key={size}
                selected={partySize === size}
                onPress={() => setPartySize(size)}
                style={[
                  styles.partySizeChip,
                  partySize === size && { backgroundColor: theme.colors.primary }
                ]}
                textStyle={{
                  color: partySize === size ? theme.colors.onPrimary : theme.colors.onSurface
                }}
              >
                {size} {size === 1 ? 'Guest' : 'Guests'}
              </Chip>
            ))}
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
            Select Date
          </Text>
          <CalendarView
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            minDate={new Date()}
          />
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
            Select Time
          </Text>
          <TimeSlotPicker
            selectedTime={selectedTime}
            onTimeSelect={setSelectedTime}
            selectedDate={selectedDate}
            restaurantId={restaurant.id}
          />
        </View>

        {/* Special Requests */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
            Special Requests (Optional)
          </Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={3}
            placeholder="Any special requests or dietary restrictions?"
            value={specialRequests}
            onChangeText={setSpecialRequests}
            mode="outlined"
          />
        </View>

        {/* Reservation Summary */}
        <Card style={[styles.summaryCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <View style={styles.summaryHeader}>
            <MaterialIcons name="event" size={20} color={theme.colors.onPrimaryContainer} />
            <Text style={[styles.summaryTitle, { color: theme.colors.onPrimaryContainer }]}>
              Reservation Summary
            </Text>
          </View>
          
          <View style={styles.summaryDetails}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.colors.onPrimaryContainer }]}>
                Restaurant:
              </Text>
              <Text style={[styles.summaryValue, { color: theme.colors.onPrimaryContainer }]}>
                {restaurant.name}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.colors.onPrimaryContainer }]}>
                Date:
              </Text>
              <Text style={[styles.summaryValue, { color: theme.colors.onPrimaryContainer }]}>
                {selectedDate || 'Not selected'}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.colors.onPrimaryContainer }]}>
                Time:
              </Text>
              <Text style={[styles.summaryValue, { color: theme.colors.onPrimaryContainer }]}>
                {selectedTime || 'Not selected'}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.colors.onPrimaryContainer }]}>
                Party Size:
              </Text>
              <Text style={[styles.summaryValue, { color: theme.colors.onPrimaryContainer }]}>
                {partySize} {partySize === 1 ? 'Guest' : 'Guests'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Confirm Button */}
        <MaterialButton
          title="Confirm Reservation"
          onPress={handleConfirmReservation}
          loading={loading}
          disabled={!selectedDate || !selectedTime}
          style={styles.confirmButton}
          icon="check"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  restaurantCard: {
    marginBottom: 20,
    elevation: 2,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  restaurantDetails: {
    flex: 1,
    marginLeft: 12,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '600',
  },
  restaurantCuisine: {
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  partySizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  partySizeChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'transparent',
  },
  summaryCard: {
    marginBottom: 24,
    padding: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  summaryDetails: {
    marginLeft: 28,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  confirmButton: {
    marginBottom: 20,
  },
});

export default ReservationScreen;