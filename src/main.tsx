import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupGlobalErrorHandlers } from './utils/error-handling'

// Create a global variable to track service worker registration status
declare global {
  interface Window {
    swRegistrationError?: string;
    Sentry?: {
      captureException: (error: Error) => void;
      captureMessage: (message: string, level?: string) => void;
      configureScope: (callback: (scope: unknown) => void) => void;
    };
  }
}

// Set up global error handlers
setupGlobalErrorHandlers();

// Register service worker for production environment
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(_registration => {
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
        // Store the error message for later use
        window.swRegistrationError = error.message || 'Failed to register service worker';
        
        // We can't use toast directly here because React isn't mounted yet
        // The error will be displayed by ServiceWorkerErrorNotifier component
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
