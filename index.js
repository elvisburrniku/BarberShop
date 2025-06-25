import { registerRootComponent } from 'expo';
import { AppRegistry, Platform } from 'react-native';
import App from './App';

// Register the app
if (Platform.OS === 'web') {
  AppRegistry.registerComponent('main', () => App);
  AppRegistry.runApplication('main', {
    rootTag: document.getElementById('root'),
  });
} else {
  registerRootComponent(App);
}