import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, ActivityIndicator, StyleSheet, Animated, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import theme from './src/theme/theme';

export default function App() {
  const [isReady, setIsReady] = useState(Platform.OS === 'web' ? true : false);

  // Add a small delay for native platforms only
  useEffect(() => {
    if (Platform.OS !== 'web') {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Loading animation 
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  
  useEffect(() => {
    if (!isReady) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, []);
  
  if (!isReady) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          <MaterialIcons name="restaurant" size={60} color={theme.colors.primary} />
          <Text style={[styles.appTitle, { color: theme.colors.primary }]}>RestaurantX</Text>
        </Animated.View>
        <ActivityIndicator 
          size="large" 
          color={theme.colors.primary} 
          style={{ marginTop: 40 }} 
        />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Finding delicious restaurants...
        </Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <AppProvider>
            <NavigationContainer>
              <StatusBar style="dark" backgroundColor={theme.colors.background} />
              <AppNavigator />
            </NavigationContainer>
          </AppProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 12,
    letterSpacing: 1,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    opacity: 0.7,
  },
});

// The component registration is handled in index.js
