// Load web polyfills first to prevent C++ runtime errors
import './web-polyfill';

import { registerRootComponent } from 'expo';
import App from './App';

// Register the main app component
registerRootComponent(App);