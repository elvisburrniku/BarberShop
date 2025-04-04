import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

const TimeSlotPicker = ({ timeSlots, selectedTime, onTimeSelect }) => {
  const theme = useTheme();

  // Format time slot for display (e.g., convert "14:30" to "2:30 PM")
  const formatTimeSlot = (timeSlot) => {
    const [hour, minute] = timeSlot.time.split(':');
    const hourNum = parseInt(hour);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:${minute} ${period}`;
  };

  // Group time slots into morning, afternoon, and evening
  const groupTimeSlots = () => {
    const morning = timeSlots.filter(slot => {
      const hour = parseInt(slot.time.split(':')[0]);
      return hour >= 7 && hour < 12;
    });

    const afternoon = timeSlots.filter(slot => {
      const hour = parseInt(slot.time.split(':')[0]);
      return hour >= 12 && hour < 17;
    });

    const evening = timeSlots.filter(slot => {
      const hour = parseInt(slot.time.split(':')[0]);
      return hour >= 17 && hour < 22;
    });

    return [
      { title: 'Morning', slots: morning },
      { title: 'Afternoon', slots: afternoon },
      { title: 'Evening', slots: evening }
    ];
  };

  const renderTimeSlot = ({ item }) => {
    const isSelected = selectedTime === item.time;
    
    return (
      <TouchableOpacity
        style={[
          styles.timeSlot,
          !item.available && styles.unavailableSlot,
          isSelected && { 
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary 
          }
        ]}
        onPress={() => item.available && onTimeSelect(item.time)}
        disabled={!item.available}
      >
        <Text
          style={[
            styles.timeText,
            !item.available && styles.unavailableText,
            isSelected && { color: '#fff' }
          ]}
        >
          {formatTimeSlot(item)}
        </Text>
      </TouchableOpacity>
    );
  };

  const groupedTimeSlots = groupTimeSlots();

  return (
    <View style={styles.container}>
      {groupedTimeSlots.map((group, index) => (
        <View key={index} style={styles.timeGroup}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          {group.slots.length > 0 ? (
            <FlatList
              data={group.slots}
              renderItem={renderTimeSlot}
              keyExtractor={(item, index) => `time-${item.time}-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.timeSlotList}
            />
          ) : (
            <Text style={styles.noSlotsText}>No available time slots</Text>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  timeGroup: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timeSlotList: {
    paddingVertical: 5,
  },
  timeSlot: {
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  timeText: {
    fontSize: 12,
  },
  unavailableSlot: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  unavailableText: {
    color: '#999',
  },
  noSlotsText: {
    fontStyle: 'italic',
    color: '#999',
    marginLeft: 10,
  },
});

export default TimeSlotPicker;
