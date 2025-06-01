/**
 * Global type definitions for the application
 */

export {};

declare global {
  // Service Worker API extensions
  interface ServiceWorkerRegistration {
    sync: SyncManager;
    periodicSync: PeriodicSyncManager;
  }

  interface Window {
    SyncManager: typeof SyncManager;
    PeriodicSyncManager: typeof PeriodicSyncManager;
  }

  interface SyncManager {
    register(tag: string): Promise<void>;
    getTags(): Promise<string[]>;
  }

  interface PeriodicSyncManager {
    register(tag: string, options?: { minInterval?: number }): Promise<void>;
    getTags(): Promise<string[]>;
    unregister(tag: string): Promise<void>;
  }

  // Window extensions
  interface Window {
    /**
     * Service worker registration reference
     */
    swRegistration?: ServiceWorkerRegistration;

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
      captureException: (
        error: Error,
        options?: Record<string, unknown>,
      ) => void;
      captureMessage: (message: string, level?: string) => void;
      configureScope: (callback: (scope: unknown) => void) => void;
    };

    /**
     * Google Analytics gtag function
     */
    gtag?: (
      command: string,
      action: string,
      params: Record<string, unknown>,
    ) => void;

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
