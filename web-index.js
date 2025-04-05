// Web entry point
import { AppRegistry } from 'react-native';
import App from './App';

// Make sure we have a root element to mount to
if (document.getElementById('root') === null) {
  const rootTag = document.createElement('div');
  rootTag.id = 'root';
  document.body.appendChild(rootTag);
}

// Register as "main" - this is what Expo is looking for
AppRegistry.registerComponent('main', () => App);
AppRegistry.runApplication('main', {
  rootTag: document.getElementById('root')
});