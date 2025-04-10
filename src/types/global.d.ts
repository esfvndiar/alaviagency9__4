/**
 * Global type definitions for the application
 */

export {};

declare global {
  // Window extensions
  interface Window {
    /**
     * Service worker registration error information
     */
    swRegistrationError?: {
      message: string;
      timestamp: number;
      details?: string;
    };

    /**
     * Sentry error reporting API
     */
    Sentry?: {
      captureException: (error: Error) => void;
      captureMessage: (message: string, level?: string) => void;
      configureScope: (callback: (scope: unknown) => void) => void;
    };

    /**
     * Function to open cookie settings from anywhere in the app
     */
    openCookieSettings?: () => void;
  }
}

/**
 * Cookie settings interface for consent management
 */
export interface CookieSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

/**
 * Props for the CookieConsent component
 */
export interface CookieConsentProps {
  onAccept?: (settings: CookieSettings) => void;
  onDecline?: () => void;
} 