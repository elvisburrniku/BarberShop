import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, IconButton, Card, useTheme } from 'react-native-paper';

const CalendarView = ({ selectedDate, onDateSelect }) => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate dates for the next 30 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  // Format day name (e.g., "Mon")
  const formatDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Format day number (e.g., "15")
  const formatDayNumber = (date) => {
    return date.getDate().toString();
  };

  // Check if date is selected
  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  // Check if date is today
  const isToday = (date) => {
    return date.toDateString() === new Date().toDateString();
  };

  // Get month name and year (e.g., "July 2023")
  const getMonthYearHeader = () => {
    return currentMonth.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const previousMonth = new Date(currentMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    setCurrentMonth(previousMonth);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  const dates = generateDates();

  return (
    <Card style={styles.container}>
      <Card.Content>
        <View style={styles.headerContainer}>
          <IconButton
            icon="chevron-left"
            size={24}
            onPress={goToPreviousMonth}
          />
          <Text style={styles.monthYearText}>{getMonthYearHeader()}</Text>
          <IconButton
            icon="chevron-right"
            size={24}
            onPress={goToNextMonth}
          />
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.datesScrollView}
        >
          {dates.map((date, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateContainer,
                isSelected(date) && { 
                  backgroundColor: theme.colors.primary,
                  borderColor: theme.colors.primary 
                }
              ]}
              onPress={() => onDateSelect(date)}
            >
              <Text 
                style={[
                  styles.dayName,
                  isSelected(date) && { color: '#fff' }
                ]}
              >
                {formatDayName(date)}
              </Text>
              <Text 
                style={[
                  styles.dayNumber,
                  isSelected(date) && { color: '#fff' },
                  isToday(date) && styles.todayText
                ]}
              >
                {formatDayNumber(date)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  datesScrollView: {
    flexDirection: 'row',
  },
  dateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  dayName: {
    fontSize: 12,
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  todayText: {
    color: 'green',
  },
});

export default CalendarView;
