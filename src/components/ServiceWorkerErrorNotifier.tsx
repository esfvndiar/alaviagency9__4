import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import { useErrorHandler } from '@/utils/error-handling';
import ErrorBoundary from './ErrorBoundary';

/**
 * Component that checks for service worker registration errors and displays them as toast notifications
 * This component should be mounted in the App component to ensure it runs after React is initialized
 */
const ServiceWorkerErrorNotifier = () => {
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    // Check if there's a service worker registration error
    if (window.swRegistrationError) {
      // Display the error message as a toast notification
      toast({
        variant: "destructive",
        title: "Offline Mode Limited",
        description: "Could not enable full offline capabilities. Some features may not work without an internet connection.",
        action: (
          <div className="h-8 w-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
        ),
      });
      
      // Log detailed error to console for debugging
      console.warn('Service Worker Error Details:', window.swRegistrationError);
      
      // Clear the error so it doesn't show again on page refresh
      delete window.swRegistrationError;
    }
  }, [toast, handleError]);

  // This component doesn't render anything
  return null;
};

// Wrap with ErrorBoundary to prevent this component from causing app crashes
const ServiceWorkerErrorNotifierWithErrorBoundary = () => (
  <ErrorBoundary componentName="ServiceWorkerErrorNotifier" fallback={null}>
    <ServiceWorkerErrorNotifier />
  </ErrorBoundary>
);

export default ServiceWorkerErrorNotifierWithErrorBoundary;
