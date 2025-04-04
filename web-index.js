import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Ensure the URL polyfill is properly loaded
import './src/utils/URLPolyfill';

// Function to initialize the app
function initializeApp() {
  // Get the root element
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found!');
    return;
  }

  // Log that we're initializing
  console.log('BarberX: Initializing web app...');
  
  // Create a root with react-dom
  const root = createRoot(rootElement);
  
  // Render the app
  root.render(createElement(App));
  
  console.log('BarberX: Web app initialized successfully!');
}

// Run the initialization when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}