import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, WifiOff, Home } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  componentName?: string;
  onNavigateHome?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isOffline: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private offlineCheckInterval: number | null = null;
  private handleOnline: (() => void) | null = null;
  private handleOffline: (() => void) | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isOffline: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidMount(): void {
    // Set up offline detection
    this.setupOfflineDetection();

    // Add error event listener to catch unhandled errors
    window.addEventListener("error", this.handleGlobalError);
    window.addEventListener("unhandledrejection", this.handlePromiseRejection);
  }

  componentWillUnmount(): void {
    // Clean up event listeners
    window.removeEventListener("error", this.handleGlobalError);
    window.removeEventListener(
      "unhandledrejection",
      this.handlePromiseRejection,
    );

    // Clean up online/offline event listeners
    if (this.handleOnline) {
      window.removeEventListener("online", this.handleOnline);
    }
    if (this.handleOffline) {
      window.removeEventListener("offline", this.handleOffline);
    }

    // Clear interval if it exists
    if (this.offlineCheckInterval) {
      window.clearInterval(this.offlineCheckInterval);
      this.offlineCheckInterval = null;
    }
  }

  setupOfflineDetection = (): void => {
    // Check if navigator.onLine is available
    if (typeof navigator !== "undefined" && "onLine" in navigator) {
      // Check initial online status
      this.setState({ isOffline: !navigator.onLine });

      // Define event handlers with proper binding for cleanup
      this.handleOnline = () => this.setState({ isOffline: false });
      this.handleOffline = () => this.setState({ isOffline: true });

      // Add event listeners for online/offline events
      window.addEventListener("online", this.handleOnline);
      window.addEventListener("offline", this.handleOffline);

      // Set up periodic connectivity check (every 30 seconds)
      this.offlineCheckInterval = window.setInterval(() => {
        // Create a test network request to verify connection
        if (navigator.onLine) {
          // Use a safe path that's guaranteed to exist and small enough to minimize data usage
          const pingUrl = window.location.origin + "/favicon.ico";

          // Set a timeout to prevent hanging requests
          const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Connection timed out")), 5000),
          );

          // Execute the ping and update state if needed
          Promise.race([
            fetch(pingUrl, { method: "HEAD", cache: "no-store" }),
            timeout,
          ])
            .then(() => {
              if (this.state.isOffline) {
                this.setState({ isOffline: false });
              }
            })
            .catch(() => {
              if (!this.state.isOffline) {
                this.setState({ isOffline: true });
              }
            });
        }
      }, 30000);
    }
  };

  handleGlobalError = (event: ErrorEvent): void => {
    // Only handle errors that aren't already caught
    if (!this.state.hasError) {
      this.setState({
        hasError: true,
        error: new Error(
          `${event.message} at ${event.filename}:${event.lineno}:${event.colno}`,
        ),
      });

      // Log error to console
      console.error("Global error caught by ErrorBoundary:", event);
    }
  };

  handlePromiseRejection = (event: PromiseRejectionEvent): void => {
    // Handle unhandled promise rejections
    if (!this.state.hasError) {
      this.setState({
        hasError: true,
        error:
          event.reason instanceof Error
            ? event.reason
            : new Error(String(event.reason)),
      });

      // Log rejection to console
      console.error(
        "Unhandled promise rejection caught by ErrorBoundary:",
        event.reason,
      );
    }
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Update state with error info for better debugging
    this.setState({ errorInfo });

    // Log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error);
    console.error("Component stack:", errorInfo.componentStack);

    // Send to Sentry if available
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        extra: {
          componentStack: errorInfo.componentStack,
          componentName: this.props.componentName,
        },
      });
    }

    // Log to analytics if available
    if (window.gtag) {
      window.gtag("event", "exception", {
        description: `${error.toString()} in ${this.props.componentName || "unknown component"}`,
        fatal: true,
      });
    }
  }

  handleReset = (): void => {
    // Reset the error boundary state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Call the onReset prop if provided
    if (this.props.onReset) {
      this.props.onReset();
    }

    // Force update service worker if available (PWA support)
    if (
      "serviceWorker" in navigator &&
      navigator.serviceWorker &&
      navigator.serviceWorker.controller
    ) {
      try {
        navigator.serviceWorker.controller.postMessage({
          type: "SKIP_WAITING",
        });
      } catch (err) {
        console.error("Failed to send message to service worker:", err);
      }
    }
  };

  handleNavigateHome = (): void => {
    if (this.props.onNavigateHome) {
      this.props.onNavigateHome();
    } else {
      // Default behavior: navigate to home page
      window.location.href = "/";
    }
  };

  render(): ReactNode {
    const { hasError, error, errorInfo, isOffline } = this.state;
    const { children, fallback, componentName } = this.props;

    // If offline but no other error, show offline message
    if (isOffline && !hasError) {
      return (
        <div className="p-6 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-center">
          <div className="flex flex-col items-center justify-center">
            <WifiOff className="w-12 h-12 text-yellow-500 dark:text-yellow-400 mb-4" />
            <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300 mb-2">
              You're offline
            </h3>
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-4">
              Please check your internet connection and try again.
            </p>
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md flex items-center transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Connection
            </button>
          </div>
        </div>
      );
    }

    if (hasError) {
      // You can render any custom fallback UI
      if (fallback) {
        return fallback;
      }

      return (
        <div className="p-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center max-w-2xl mx-auto my-8">
          <div className="flex flex-col items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-red-500 dark:text-red-400 mb-4" />
            <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">
              {isOffline ? "Network Error" : "Something went wrong"}
            </h3>
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">
              {isOffline
                ? "There was a network error. Please check your connection and try again."
                : componentName
                  ? `There was an error loading the ${componentName} component.`
                  : "There was an error rendering this component."}
            </p>
            {error && (
              <div className="w-full mb-4">
                <p className="text-xs text-left font-bold mb-1 text-red-700 dark:text-red-300">
                  Error Details:
                </p>
                <pre className="text-xs text-left p-3 bg-red-100 dark:bg-red-900/30 rounded w-full overflow-auto max-h-32">
                  {error.toString()}
                </pre>
              </div>
            )}
            {errorInfo && (
              <div className="w-full mb-4">
                <p className="text-xs text-left font-bold mb-1 text-red-700 dark:text-red-300">
                  Component Stack:
                </p>
                <pre className="text-xs text-left p-3 bg-red-100 dark:bg-red-900/30 rounded w-full overflow-auto max-h-32">
                  {errorInfo.componentStack}
                </pre>
              </div>
            )}
            <div className="flex space-x-4">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
              <button
                onClick={this.handleNavigateHome}
                className="px-4 py-2 bg-zinc-600 hover:bg-zinc-700 text-white rounded-md flex items-center transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
