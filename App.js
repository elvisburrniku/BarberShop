import React from 'react';
import { View, Text } from 'react-native';

// Extremely basic component for testing
export default function App() {
  return (
    <View style={{
      flex: 1,
      backgroundColor: 'red',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Text style={{
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold'
      }}>
        BarberX App
      </Text>
    </View>
  );
}
