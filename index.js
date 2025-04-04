import { registerRootComponent } from 'expo';
import { AppRegistry, Platform } from 'react-native';
// Import URL polyfill to fix "URL.protocol is not implemented" error
import './src/utils/URLPolyfill';
import App from './App';

// Register the app
if (Platform.OS === 'web') {
  AppRegistry.registerComponent('main', () => App);
} else {
  registerRootComponent(App);
}