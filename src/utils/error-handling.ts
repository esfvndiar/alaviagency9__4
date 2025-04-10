/**
 * Error handling utilities
 * Provides consistent error handling across the application
 */

import { useToast } from '../hooks/use-toast';

// Define error types for better type safety
export class AppError extends Error {
  code: string;
  
  constructor(message: string, code: string = 'UNKNOWN_ERROR') {
    super(message);
    this.name = 'AppError';
    this.code = code;
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network connection error') {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class ValidationError extends AppError {
  fieldErrors?: Record<string, string>;
  
  constructor(message: string, fieldErrors?: Record<string, string>) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.fieldErrors = fieldErrors;
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Authentication error') {
    super(message, 'AUTH_ERROR');
    this.name = 'AuthError';
  }
}

/**
 * Format error message for display
 */
export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  } else if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return 'An unknown error occurred';
  }
};

/**
 * Hook for handling errors with toast notifications
 */
export const useErrorHandler = () => {
  const { toast } = useToast();
  
  const handleError = (error: unknown, title: string = 'Error') => {
    const message = formatErrorMessage(error);
    
    toast({
      title,
      description: message,
      variant: 'destructive',
    });
    
    // Optionally log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
    
    // Could also send to error reporting service like Sentry
    // if (window.Sentry) {
    //   window.Sentry.captureException(error);
    // }
  };
  
  return { handleError };
};

/**
 * Global error handler for unhandled errors
 */
export const setupGlobalErrorHandlers = () => {
  // Save original console.error
  const originalConsoleError = console.error;
  
  // Override console.error to potentially capture and report errors
  console.error = (...args) => {
    // Call original console.error
    originalConsoleError.apply(console, args);
    
    // Could send to error reporting service
    // if (window.Sentry && args[0] instanceof Error) {
    //   window.Sentry.captureException(args[0]);
    // }
  };
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Could send to error reporting service
    // if (window.Sentry) {
    //   window.Sentry.captureException(event.reason);
    // }
  });
  
  // Handle global errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    // Could send to error reporting service
    // if (window.Sentry) {
    //   window.Sentry.captureException(event.error);
    // }
  });
};

export default {
  AppError,
  NetworkError,
  ValidationError,
  AuthError,
  formatErrorMessage,
  useErrorHandler,
  setupGlobalErrorHandlers
};
