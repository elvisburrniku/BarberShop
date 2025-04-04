import { AppRegistry } from 'react-native';
import App from './App';
import './src/utils/URLPolyfill';

// Register the app specifically for web
AppRegistry.registerComponent('main', () => App);

// Web-specific setup
AppRegistry.runApplication('main', {
  // Use a callback to handle the root tag by the time the DOM is ready
  rootTag: document.getElementById('root') || document.getElementById('main'),
});

// Add a console log to help with debugging
console.log('BarberX: Web application initialized');