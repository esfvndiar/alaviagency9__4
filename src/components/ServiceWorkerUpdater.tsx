import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

const ServiceWorkerUpdater: React.FC = () => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    // Only run this in production and if service workers are supported
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      // Create a custom event listener for when a new service worker is waiting
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // When the controller changes (new service worker activated), reload the page
        window.location.reload();
      });

      // Check for service worker updates
      const checkForUpdates = () => {
        navigator.serviceWorker.getRegistration().then(registration => {
          if (registration) {
            // Add an event listener for when a new service worker is waiting
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  // When the service worker is installed and waiting
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    setWaitingWorker(newWorker);
                    setShowUpdatePrompt(true);
                  }
                });
              }
            });

            // Check if there's already a waiting service worker
            if (registration.waiting && navigator.serviceWorker.controller) {
              setWaitingWorker(registration.waiting);
              setShowUpdatePrompt(true);
            }
          }
        });
      };

      // Check for updates immediately and then every 60 minutes
      checkForUpdates();
      const interval = setInterval(checkForUpdates, 60 * 60 * 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, []);

  const updateServiceWorker = () => {
    if (waitingWorker) {
      // Send a message to the waiting service worker to skip waiting
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowUpdatePrompt(false);
    }
  };

  if (!showUpdatePrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 max-w-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <RefreshCw className="h-5 w-5 text-blue-500" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Update available
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            A new version of this website is available. Refresh to see the latest updates.
          </p>
          <div className="mt-4 flex space-x-3">
            <button
              type="button"
              onClick={updateServiceWorker}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Update now
            </button>
            <button
              type="button"
              onClick={() => setShowUpdatePrompt(false)}
              className="inline-flex items-center px-3 py-2 border border-zinc-300 dark:border-zinc-600 text-sm leading-4 font-medium rounded-md text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceWorkerUpdater;
