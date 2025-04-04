import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { 
  Text, 
  Title, 
  Subheading, 
  Button, 
  Divider, 
  Card, 
  Chip,
  RadioButton,
  useTheme
} from 'react-native-paper';
import { useAppContext } from '../context/AppContext';
import ServiceItem from '../components/ServiceItem';
import CalendarView from '../components/CalendarView';
import TimeSlotPicker from '../components/TimeSlotPicker';
import { formatCurrency } from '../utils/DateTimeUtils';

const BookingScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { 
    selectedBarber,
    selectedServices,
    selectedDateTime,
    services,
    setSelectedServices,
    setSelectedDateTime,
    calculateTotalPrice,
    bookAppointment,
    resetBooking,
    getAvailableTimeSlots
  } = useAppContext();
  
  const initialServiceId = route.params?.initialServiceId;
  const [step, setStep] = useState(1);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);

  // Initialize selected service if provided
  useEffect(() => {
    if (initialServiceId && services.find(s => s.id === initialServiceId)) {
      setSelectedServices([initialServiceId]);
    }
  }, [initialServiceId]);

  // Load available time slots when date changes
  useEffect(() => {
    if (selectedBarber && selectedDate) {
      const timeSlots = getAvailableTimeSlots(selectedBarber.id, selectedDate);
      setAvailableTimeSlots(timeSlots);
    }
  }, [selectedBarber, selectedDate]);

  // Calculate the total price of selected services
  const totalPrice = calculateTotalPrice(selectedServices);

  // Get the available services for the selected barber
  const barberServices = services.filter(service => 
    selectedBarber?.serviceIds.includes(service.id)
  );

  // Handle service selection/deselection
  const toggleServiceSelection = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  // Handle time slot selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setSelectedDateTime(new Date(selectedDate.setHours(
      parseInt(time.split(':')[0]),
      parseInt(time.split(':')[1])
    )));
  };

  // Handle booking confirmation
  const handleConfirmBooking = async () => {
    try {
      // Book the appointment
      const appointment = bookAppointment(
        selectedBarber.id,
        selectedDateTime,
        selectedServices
      );

      // Show success message
      Alert.alert(
        "Booking Confirmed!",
        "Your appointment has been successfully booked.",
        [
          { 
            text: "View My Appointments", 
            onPress: () => {
              resetBooking();
              navigation.navigate('Appointments');
            }
          },
          {
            text: "OK",
            onPress: () => {
              resetBooking();
              navigation.navigate('Home');
            },
            style: "cancel"
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        "Booking Failed",
        "There was an error booking your appointment. Please try again."
      );
    }
  };

  // Go to next step
  const nextStep = () => {
    if (step === 1 && selectedServices.length === 0) {
      Alert.alert("Select Services", "Please select at least one service to continue");
      return;
    }
    
    if (step === 2 && !selectedTime) {
      Alert.alert("Select Time", "Please select a time slot for your appointment");
      return;
    }
    
    setStep(step + 1);
  };

  // Go to previous step
  const prevStep = () => {
    setStep(step - 1);
  };

  if (!selectedBarber) {
    return (
      <View style={styles.emptyContainer}>
        <Text>No barber selected. Please select a barber first.</Text>
        <Button 
          mode="contained" 
          style={styles.button}
          onPress={() => navigation.navigate('Discover')}
        >
          Find a Barber
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Step indicator */}
        <View style={styles.stepContainer}>
          <Chip 
            selected={step >= 1}
            style={[styles.stepChip, step >= 1 && styles.activeStepChip]}
          >
            1. Services
          </Chip>
          <View style={styles.stepLine} />
          <Chip 
            selected={step >= 2}
            style={[styles.stepChip, step >= 2 && styles.activeStepChip]}
          >
            2. Date & Time
          </Chip>
          <View style={styles.stepLine} />
          <Chip 
            selected={step >= 3}
            style={[styles.stepChip, step >= 3 && styles.activeStepChip]}
          >
            3. Confirm
          </Chip>
        </View>

        {/* Step 1: Service Selection */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <Title style={styles.title}>Select Services</Title>
            <Text style={styles.subtitle}>at {selectedBarber.name}</Text>
            
            <Divider style={styles.divider} />
            
            <View style={styles.servicesList}>
              {barberServices.map(service => (
                <ServiceItem
                  key={service.id}
                  service={service}
                  selected={selectedServices.includes(service.id)}
                  onPress={() => toggleServiceSelection(service.id)}
                  selectable
                />
              ))}
            </View>
          </View>
        )}

        {/* Step 2: Date & Time Selection */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <Title style={styles.title}>Select Date & Time</Title>
            <Text style={styles.subtitle}>Choose when you'd like to visit</Text>
            
            <Divider style={styles.divider} />
            
            <Subheading style={styles.subheading}>Select Date</Subheading>
            <CalendarView 
              selectedDate={selectedDate} 
              onDateSelect={handleDateSelect}
            />
            
            <Divider style={styles.divider} />
            
            <Subheading style={styles.subheading}>Select Time</Subheading>
            <TimeSlotPicker 
              timeSlots={availableTimeSlots}
              selectedTime={selectedTime}
              onTimeSelect={handleTimeSelect}
            />
          </View>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <View style={styles.stepContent}>
            <Title style={styles.title}>Confirm Booking</Title>
            <Text style={styles.subtitle}>Review your appointment details</Text>
            
            <Divider style={styles.divider} />
            
            <Card style={styles.summaryCard}>
              <Card.Content>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Barber Shop:</Text>
                  <Text style={styles.summaryValue}>{selectedBarber.name}</Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Date:</Text>
                  <Text style={styles.summaryValue}>
                    {selectedDateTime.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Time:</Text>
                  <Text style={styles.summaryValue}>
                    {selectedDateTime.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                </View>
                
                <Divider style={styles.summaryDivider} />
                
                <Text style={styles.servicesHeading}>Services:</Text>
                {selectedServices.map(serviceId => {
                  const service = services.find(s => s.id === serviceId);
                  return (
                    <View key={serviceId} style={styles.serviceRow}>
                      <Text>{service.name}</Text>
                      <Text>{formatCurrency(service.price)}</Text>
                    </View>
                  );
                })}
                
                <Divider style={styles.summaryDivider} />
                
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>{formatCurrency(totalPrice)}</Text>
                </View>
              </Card.Content>
            </Card>
            
            <Card style={styles.paymentCard}>
              <Card.Content>
                <Text style={styles.paymentTitle}>Payment Method</Text>
                <RadioButton.Group value="card" onValueChange={() => {}}>
                  <RadioButton.Item label="Pay at Barber Shop" value="store" />
                  <RadioButton.Item label="Credit/Debit Card" value="card" />
                </RadioButton.Group>
              </Card.Content>
            </Card>
          </View>
        )}
      </ScrollView>

      {/* Bottom navigation buttons */}
      <View style={styles.footer}>
        {step > 1 && (
          <Button 
            mode="outlined" 
            onPress={prevStep}
            style={styles.footerButton}
          >
            Back
          </Button>
        )}
        
        {step < 3 ? (
          <Button 
            mode="contained" 
            onPress={nextStep}
            style={[styles.footerButton, styles.primaryButton]}
            disabled={step === 1 && selectedServices.length === 0}
          >
            Continue
          </Button>
        ) : (
          <Button 
            mode="contained" 
            onPress={handleConfirmBooking}
            style={[styles.footerButton, styles.primaryButton]}
          >
            Confirm Booking
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  stepChip: {
    backgroundColor: '#e0e0e0',
  },
  activeStepChip: {
    backgroundColor: '#2c3e50',
  },
  stepLine: {
    height: 1,
    width: 20,
    backgroundColor: '#e0e0e0',
  },
  stepContent: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    marginVertical: 16,
  },
  servicesList: {
    marginTop: 8,
  },
  subheading: {
    fontSize: 18,
    marginBottom: 12,
  },
  summaryCard: {
    marginVertical: 8,
  },
  paymentCard: {
    marginVertical: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontWeight: 'bold',
  },
  summaryValue: {
    textAlign: 'right',
  },
  summaryDivider: {
    marginVertical: 12,
  },
  servicesHeading: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  totalValue: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  paymentTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  primaryButton: {
    backgroundColor: '#2c3e50',
  },
  button: {
    marginTop: 20,
  },
});

export default BookingScreen;
