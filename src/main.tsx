import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './App.css';
import { setupGlobalErrorHandlers } from './utils/error-handling';
import './types/global.d';
import { reportWebVitals, enableWebVitalsDebug } from './utils/web-vitals';

// Set up global error handlers before anything else
setupGlobalErrorHandlers();

// Service worker registration with detailed error handling and lifecycle tracking
if (import.meta.env.PROD) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(async (registration) => {
      // Store registration for later use
      window.swRegistration = registration;

      // Set up event listeners for service worker lifecycle events
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            console.log('Service worker state changed:', newWorker.state);
          });
        }
      });

      // Enable push notifications if supported
      if ('pushManager' in registration) {
        try {
          // Check if we already have permission
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            await setupPushSubscription(registration);
          }
        } catch (error) {
          console.error('Push notification setup failed:', error);
        }
      }

      console.log('Service worker registered successfully');
    })
    .catch((error) => {
      // Store error for display to user
      const errorDetails = {
        message: error.message || 'Failed to register service worker',
        timestamp: new Date().toISOString(),
        stack: error.stack || '',
      };
      window.swRegistrationError = errorDetails;
      console.error('Service worker registration failed:', error);
    });

  // Listen for controlling service worker changes
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('Service worker controller changed - page will reload if needed');
  });
} else {
  console.log('Service worker not registered in development mode');
}

// Function to setup push notification subscription
async function setupPushSubscription(registration) {
  try {
    let subscription = await registration.pushManager.getSubscription();
    
    // If no subscription exists, create one
    if (!subscription) {
      // Get server's public key for VAPID
      const response = await fetch('/api/push/vapid-public-key');
      if (!response.ok) {
        throw new Error('Failed to get VAPID public key');
      }
      
      const vapidPublicKey = await response.text();
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
      
      // Create new subscription
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });
      
      // Send subscription to server
      await fetch('/api/push/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription
        }),
      });
      
      console.log('Push notification subscription created');
    }
  } catch (error) {
    console.error('Failed to setup push subscription:', error);
  }
}

// Helper function to convert base64 to Uint8Array for VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
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

// Report web vitals
reportWebVitals();

// Enable web vitals debug overlay in development
if (process.env.NODE_ENV === 'development') {
  enableWebVitalsDebug();
}
