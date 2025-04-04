import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Very minimal app component
function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BarberX</Text>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  }
});

export default App;
