import React, { useEffect, useState, useCallback, memo, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

// Create a separate memoized component for the update prompt UI
const UpdatePrompt = memo(({ onUpdate, onLater }: { 
  onUpdate: () => void;
  onLater: () => void;
}) => (
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
            onClick={onUpdate}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Update now
          </button>
          <button
            type="button"
            onClick={onLater}
            className="inline-flex items-center px-3 py-2 border border-zinc-300 dark:border-zinc-600 text-sm leading-4 font-medium rounded-md text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  </div>
));

UpdatePrompt.displayName = 'UpdatePrompt';

// Only run in production to avoid development performance impact
const isProduction = import.meta.env.PROD;
const CHECK_INTERVAL = 60 * 60 * 1000; // 60 minutes
const INITIAL_CHECK_DELAY = 10 * 1000; // 10 seconds delay on initial check

/**
 * ServiceWorkerUpdater provides a UI to notify users when a new service worker is available
 * and provides options to update now or later. It handles the service worker lifecycle events
 * and manages updating the application when a new version is available.
 */
const ServiceWorkerUpdater: React.FC = () => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  
  // Use refs to store handlers and interval for cleanup
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  
  // Use WeakMaps to reduce memory usage - when objects are garbage collected, their entries are automatically removed
  const updateFoundHandlersRef = useRef<WeakMap<ServiceWorkerRegistration, EventListener>>(new WeakMap());
  const stateChangeHandlersRef = useRef<WeakMap<ServiceWorker, EventListener>>(new WeakMap());

  // Check for service worker updates
  const checkForUpdates = useCallback((registration: ServiceWorkerRegistration) => {
    if (!registration) return;
    
    // Create and store the updatefound handler
    const updateFoundHandler = () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      // Create and store the statechange handler
      const stateChangeHandler = () => {
        // When the service worker is installed and waiting
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          setWaitingWorker(newWorker);
          setShowUpdatePrompt(true);
        }
      };

      // Add the statechange listener and store the reference
      newWorker.addEventListener('statechange', stateChangeHandler);
      stateChangeHandlersRef.current.set(newWorker, stateChangeHandler);
    };

    // Add the updatefound listener and store the reference
    registration.addEventListener('updatefound', updateFoundHandler);
    updateFoundHandlersRef.current.set(registration, updateFoundHandler);

    // Check if there's already a waiting service worker
    if (registration.waiting && navigator.serviceWorker.controller) {
      setWaitingWorker(registration.waiting);
      setShowUpdatePrompt(true);
    }
  }, []);

  useEffect(() => {
    // Only run this in production and if service workers are supported
    if (!isProduction || !('serviceWorker' in navigator)) {
      return;
    }
    
    // Capture ref values at the start of the effect
    const currentUpdateFoundHandlers = updateFoundHandlersRef.current;
    const currentStateChangeHandlers = stateChangeHandlersRef.current;
    
    // Create a custom event listener for when a new service worker is waiting
    const controllerChangeHandler = () => {
      // When the controller changes (new service worker activated), reload the page
      window.location.reload();
    };
    
    navigator.serviceWorker.addEventListener('controllerchange', controllerChangeHandler);

    // Initialize the service worker update check with a delay to not impact initial page load
    const initUpdateCheck = async () => {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          // Store the registration reference for cleanup
          const registrationRef = registration;
          
          // Check for updates initially
          checkForUpdates(registration);
          
          // Set up periodic checks
          intervalRef.current = window.setInterval(async () => {
            try {
              // Force an update check
              await registrationRef.update();
              // After update, check for waiting worker again
              checkForUpdates(registrationRef);
            } catch (error) {
              console.error('ServiceWorkerUpdater: Error checking for updates', { 
                error: error instanceof Error ? error.message : String(error)
              });
            }
          }, CHECK_INTERVAL);
        }
      } catch (error) {
        console.error('ServiceWorkerUpdater: Failed to initialize', {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    };
    
    // Delay the initial update check to improve initial page performance
    timeoutRef.current = window.setTimeout(() => {
      initUpdateCheck();
    }, INITIAL_CHECK_DELAY);
    
    // Cleanup function
    return () => {
      // Remove the controller change listener
      navigator.serviceWorker.removeEventListener('controllerchange', controllerChangeHandler);
      
      // Clear the timeouts and intervals
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // Clean up event listeners that were added
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration) {
          // Remove updatefound listeners
          const updateFoundHandler = currentUpdateFoundHandlers.get(registration);
          if (updateFoundHandler) {
            registration.removeEventListener('updatefound', updateFoundHandler);
            currentUpdateFoundHandlers.delete(registration);
          }

          // Remove statechange listeners from any workers
          [registration.installing, registration.waiting, registration.active]
            .filter((worker): worker is ServiceWorker => worker !== null)
            .forEach(worker => {
              const stateChangeHandler = currentStateChangeHandlers.get(worker);
              if (stateChangeHandler) {
                worker.removeEventListener('statechange', stateChangeHandler);
                currentStateChangeHandlers.delete(worker);
              }
            });

          // Reset state
          setWaitingWorker(null);
          setShowUpdatePrompt(false);
        }
      }).catch(err => {
        console.error('Error cleaning up service worker listeners:', err);
      });
    };
  }, [checkForUpdates]);

  const updateServiceWorker = useCallback(() => {
    if (waitingWorker) {
      // Send a message to the waiting service worker to skip waiting
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowUpdatePrompt(false);
    }
  }, [waitingWorker]);

  const hideUpdatePrompt = useCallback(() => {
    setShowUpdatePrompt(false);
  }, []);

  // Early return pattern for improved readability
  if (!showUpdatePrompt) {
    return null;
  }

  return <UpdatePrompt onUpdate={updateServiceWorker} onLater={hideUpdatePrompt} />;
};

// Use memo to prevent re-renders when parent components update
export default memo(ServiceWorkerUpdater);
