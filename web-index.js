// Web entry point
import { AppRegistry } from 'react-native';
import App from './App';

if (document.getElementById('app-root') === null) {
  const rootTag = document.createElement('div');
  rootTag.id = 'app-root';
  document.body.appendChild(rootTag);
}

AppRegistry.registerComponent('BarberX', () => App);
AppRegistry.runApplication('BarberX', {
  rootTag: document.getElementById('app-root')
});