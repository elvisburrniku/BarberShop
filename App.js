import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>RestaurantX</Text>
      <Text style={styles.subtitle}>Restaurant Discovery & Reservations</Text>
      <Text style={styles.status}>✓ App is loading successfully</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2196F3',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666666',
  },
  status: {
    fontSize: 16,
    color: '#4CAF50',
  },
});