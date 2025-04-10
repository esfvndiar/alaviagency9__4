import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import App from './App';
import './App.css';
import { setupGlobalErrorHandlers } from './utils/error-handling';
import './types/global.d';

// Set up global error handlers before the app renders
setupGlobalErrorHandlers();

// Set up service worker if running in production
if (process.env.NODE_ENV === 'production' || import.meta.env.PROD) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          window.swRegistration = registration;
          console.log('Service Worker registered with scope:', registration.scope);
          
          // Track service worker lifecycle events
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                console.log('Service Worker state changed:', newWorker.state);
              });
            }
          });
        })
        .catch((error: Error) => {
          // Store detailed error information for debugging
          window.swRegistrationError = {
            message: error.message,
            timestamp: new Date().getTime(),
            details: error.stack || '',
          };
          console.error('Service Worker registration failed:', error);
        });
    });

    // Handle controller change (when a new service worker takes over)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker controller changed');
    });
  }
}

// Start the app
const rootElement = document.getElementById('root') as HTMLElement;
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
