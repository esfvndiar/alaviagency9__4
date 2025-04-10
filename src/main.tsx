import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { setupGlobalErrorHandlers } from './utils/error-handling';
import './types/global.d';

// Initialize error handling
setupGlobalErrorHandlers();

// Create a dedicated function for registering service worker to improve initial load performance
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      // Defer registration until after the page has loaded
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          // Store the registration for later use
          window.swRegistration = registration;
          
          // Log successful registration
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
          
          // Track service worker lifecycle events
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                console.log('Service worker state:', installingWorker.state);
              };
            }
          };
        })
        .catch(error => {
          // Store detailed error information for the error notifier component
          window.swRegistrationError = {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
          };
          console.error('ServiceWorker registration failed: ', error);
        });
    });
  }
};

// Render React app first for faster initial load
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Defer non-critical operations
if (typeof window !== 'undefined') {
  // Use requestIdleCallback or setTimeout fallback to register service worker during idle time
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      registerServiceWorker();
    });
  } else {
    // Fallback to setTimeout with a reasonable delay
    setTimeout(() => {
      registerServiceWorker();
    }, 1000);
  }
  
  // Implement progressive loading for web fonts
  if ('fonts' in document) {
    // Load fonts asynchronously
    Promise.all([
      (document as any).fonts.load('1em Inter'),
      (document as any).fonts.load('1em Poppins')
    ]).catch(err => {
      console.warn('Web fonts could not be loaded:', err);
    });
  }
}
