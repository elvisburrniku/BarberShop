import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import theme from './src/theme/theme';

export default function App() {
  try {
    return (
      <ErrorBoundary>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <AppProvider>
              <NavigationContainer>
                <StatusBar style="dark" />
                <AppNavigator />
              </NavigationContainer>
            </AppProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('App rendering error:', error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>App Loading Error</Text>
        <Text>{error.toString()}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});