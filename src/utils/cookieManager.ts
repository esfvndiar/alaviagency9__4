import Cookies from 'js-cookie';

export interface CookieSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const COOKIE_CONSENT_NAME = 'cookie-consent';
const COOKIE_SETTINGS_NAME = 'cookie-settings';
const CONSENT_STORAGE_KEY = 'alavi-cookie-consent';

// Default settings - only necessary cookies enabled
const DEFAULT_SETTINGS: CookieSettings = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
};

/**
 * Get the current cookie consent status
 * @returns 'all' | 'custom' | 'necessary' | null
 */
export const getConsentStatus = (): string | null => {
  // Check localStorage first (persists across all pages)
  const localStorageConsent = typeof window !== 'undefined' ? localStorage.getItem(CONSENT_STORAGE_KEY) : null;
  
  if (localStorageConsent) {
    return localStorageConsent;
  }
  
  // Fallback to cookie check
  return Cookies.get(COOKIE_CONSENT_NAME) || null;
};

/**
 * Get the current cookie settings
 */
export const getCookieSettings = (): CookieSettings => {
  try {
    // Try to get settings from localStorage first
    if (typeof window !== 'undefined') {
      const localStorageSettings = localStorage.getItem(COOKIE_SETTINGS_NAME);
      if (localStorageSettings) {
        const settings = JSON.parse(localStorageSettings) as CookieSettings;
        // Ensure necessary cookies are always enabled
        return { ...settings, necessary: true };
      }
    }
    
    // Fallback to cookies
    const settingsStr = Cookies.get(COOKIE_SETTINGS_NAME);
    if (!settingsStr) return DEFAULT_SETTINGS;
    
    const settings = JSON.parse(settingsStr) as CookieSettings;
    // Ensure necessary cookies are always enabled
    return { ...settings, necessary: true };
  } catch (error) {
    console.error('Error parsing cookie settings:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Check if a specific cookie category is allowed
 */
export const isCookieAllowed = (category: keyof CookieSettings): boolean => {
  if (category === 'necessary') return true;
  
  const settings = getCookieSettings();
  return settings[category] === true;
};

/**
 * Set a cookie only if the category is allowed
 */
export const setConditionalCookie = (
  name: string, 
  value: string, 
  category: keyof CookieSettings,
  options?: Cookies.CookieAttributes
): void => {
  if (isCookieAllowed(category)) {
    Cookies.set(name, value, { 
      ...options, 
      sameSite: 'lax',
      path: '/' 
    });
  }
};

/**
 * Open the cookie settings dialog
 */
export const openCookieSettings = (): void => {
  if (typeof window !== 'undefined' && window.openCookieSettings) {
    window.openCookieSettings();
  }
};

/**
 * Clear all non-essential cookies
 */
export const clearNonEssentialCookies = (): void => {
  // Get all cookies
  const allCookies = Cookies.get();
  
  // Keep a list of essential cookies that should not be deleted
  const essentialCookies = [COOKIE_CONSENT_NAME, COOKIE_SETTINGS_NAME];
  
  // Remove all non-essential cookies
  Object.keys(allCookies).forEach(cookieName => {
    if (!essentialCookies.includes(cookieName)) {
      Cookies.remove(cookieName, { path: '/' });
    }
  });
};

// Add type definition for the global window object
declare global {
  interface Window {
    openCookieSettings?: () => void;
  }
}
