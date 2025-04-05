import { AppRegistry } from 'react-native';
import App from './App';

// Register the app for web specifically
AppRegistry.registerComponent('main', () => App);

// Mount to root
AppRegistry.runApplication('main', {
  rootTag: document.getElementById('root')
});