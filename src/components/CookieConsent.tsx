import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Cookies from 'js-cookie';
import { getBrowserInfo } from '../utils/browserSupport';
import { CookieSettings, CookieConsentProps } from '../types/global';

const CONSENT_COOKIE_NAME = 'cookie-consent';
const SETTINGS_COOKIE_NAME = 'cookie-settings';
const CONSENT_STORAGE_KEY = 'alavi-cookie-consent';

// Default settings moved outside component to prevent recreation on each render
const DEFAULT_SETTINGS: CookieSettings = {
  necessary: true, // Always required
  analytics: false,
  marketing: false,
  preferences: false,
};

const CookieConsent: React.FC<CookieConsentProps> = React.memo(({ onAccept, onDecline }) => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>(DEFAULT_SETTINGS);
  
  // Use a ref to track if component is mounted
  const isMountedRef = useRef(true);

  // Memoize browser support check to avoid recomputing on each render
  const browserSupport = useMemo(() => getBrowserInfo(), []);

  // Check if consent has been given before
  useEffect(() => {
    const checkConsent = () => {
      const { cookiesSupported, localStorageSupported } = browserSupport;
      
      // If neither cookies nor localStorage are supported, don't show the banner
      // as we can't store consent anyway
      if (!cookiesSupported && !localStorageSupported) {
        return true;
      }
      
      // Check localStorage first (persists across all pages)
      if (localStorageSupported) {
        const localStorageConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
        if (localStorageConsent) {
          // Also try to load saved settings
          try {
            const savedSettings = localStorage.getItem(SETTINGS_COOKIE_NAME);
            if (savedSettings) {
              setSettings({
                ...JSON.parse(savedSettings),
                necessary: true // Always ensure necessary cookies are enabled
              });
            }
          } catch (e) {
            console.error('Error loading saved cookie settings:', e);
          }
          return true;
        }
      }
      
      // Fallback to cookie check
      if (cookiesSupported) {
        const cookieConsent = Cookies.get(CONSENT_COOKIE_NAME);
        if (cookieConsent) {
          // Also try to load saved settings
          try {
            const savedSettings = Cookies.get(SETTINGS_COOKIE_NAME);
            if (savedSettings) {
              setSettings({
                ...JSON.parse(savedSettings),
                necessary: true // Always ensure necessary cookies are enabled
              });
            }
          } catch (e) {
            console.error('Error loading saved cookie settings:', e);
          }
          return true;
        }
      }
      
      return false;
    };
    
    // Only show the banner if no consent has been given and browser is supported
    const { cookiesSupported, localStorageSupported } = browserSupport;
    if ((cookiesSupported || localStorageSupported) && !checkConsent()) {
      setVisible(true);
    }
  }, [browserSupport]);

  // Set mounted ref to false when component unmounts
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Memoized save consent function to prevent recreation on each render
  const saveConsent = useCallback((consentType: string, settingsData: CookieSettings) => {
    const { cookiesSupported, localStorageSupported } = browserSupport;
    
    // Save in cookies if supported
    if (cookiesSupported) {
      try {
        Cookies.set(CONSENT_COOKIE_NAME, consentType, { 
          expires: 365, 
          sameSite: 'lax',
          path: '/'
        });
        
        Cookies.set(SETTINGS_COOKIE_NAME, JSON.stringify(settingsData), { 
          expires: 365, 
          sameSite: 'lax',
          path: '/'
        });
      } catch (e) {
        console.error('Error saving cookie consent:', e);
      }
    }
    
    // Also save in localStorage if supported
    if (localStorageSupported) {
      try {
        localStorage.setItem(CONSENT_STORAGE_KEY, consentType);
        localStorage.setItem(SETTINGS_COOKIE_NAME, JSON.stringify(settingsData));
      } catch (e) {
        console.error('Error saving cookie consent to localStorage:', e);
      }
    }
  }, [browserSupport]);

  // Event handlers wrapped in useCallback to prevent recreation
  const handleAcceptAll = useCallback(() => {
    const allSettings = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    
    saveConsent('all', allSettings);
    setVisible(false);
    if (onAccept) onAccept(allSettings);
  }, [saveConsent, onAccept]);

  const handleSaveSettings = useCallback(() => {
    saveConsent('custom', settings);
    setVisible(false);
    if (onAccept) onAccept(settings);
  }, [saveConsent, settings, onAccept]);

  const handleDecline = useCallback(() => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    
    saveConsent('necessary', necessaryOnly);
    setVisible(false);
    if (onDecline) onDecline();
  }, [saveConsent, onDecline]);

  const handleToggleSetting = useCallback((key: keyof CookieSettings) => {
    if (key === 'necessary') return; // Necessary cookies can't be toggled
    
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);

  // Function to open cookie settings from anywhere in the app
  const openCookieSettings = useCallback(() => {
    setVisible(true);
    setShowDetails(true);
  }, []);

  // Toggle details visibility
  const toggleDetails = useCallback((show: boolean) => {
    setShowDetails(show);
  }, []);

  // Expose the function to window for global access with proper cleanup
  useEffect(() => {
    // Cast window to our custom type
    window.openCookieSettings = openCookieSettings;
    
    return () => {
      // Only cleanup if the component is still mounted
      if (isMountedRef.current) {
        delete window.openCookieSettings;
      }
    };
  }, [openCookieSettings]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 lg:left-8 lg:right-auto lg:max-w-lg z-[9999]">
      {showDetails ? (
        <div className="bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-700 overflow-hidden transition-all duration-300">
          <div className="p-5 md:p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold bg-gradient-to-r from-cyberblue to-mintgreen bg-clip-text text-transparent">Cookie-Einstellungen</h2>
              <button 
                onClick={() => toggleDetails(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors p-2 rounded-full hover:bg-zinc-100/50 dark:hover:bg-zinc-700/50"
                aria-label="Close cookie settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18"></path>
                  <path d="M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-5">
              Wir verwenden Cookies für eine optimale Website-Erfahrung. Wählen Sie aus, welche Cookies Sie zulassen möchten.
            </p>
            
            <div className="space-y-3 mb-5">
              <div className="border border-zinc-100 dark:border-zinc-700 rounded-xl p-3.5 bg-white dark:bg-zinc-800 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-white flex items-center">
                      <span className="w-5 h-5 mr-2 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                      </span>
                      Notwendige Cookies
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 ml-7">Erforderlich für die Grundfunktionen</p>
                  </div>
                  <div className="bg-primary/10 text-primary text-xs font-medium py-1 px-2.5 rounded-full">
                    Erforderlich
                  </div>
                </div>
              </div>
              
              <div className="border border-zinc-100 dark:border-zinc-700 rounded-xl p-3.5 bg-white dark:bg-zinc-800 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-white flex items-center">
                      <span className="w-5 h-5 mr-2 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12h2a10 10 0 0 1 20 0h-2"/>
                          <path d="M12 2v2"/>
                          <path d="M12 22v-2"/>
                          <path d="M20 12a8 8 0 0 0-8-8"/>
                          <path d="M12 9v3l2 2"/>
                        </svg>
                      </span>
                      Analyse
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 ml-7">Hilft uns, die Nutzung zu verstehen</p>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.analytics}
                      onChange={() => handleToggleSetting('analytics')}
                    />
                    <div className="relative w-9 h-5 bg-zinc-200 dark:bg-zinc-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 dark:after:border-zinc-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
              
              <div className="border border-zinc-100 dark:border-zinc-700 rounded-xl p-3.5 bg-white dark:bg-zinc-800 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-white flex items-center">
                      <span className="w-5 h-5 mr-2 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20V10"/>
                          <path d="M18 20V4"/>
                          <path d="M6 20v-4"/>
                        </svg>
                      </span>
                      Marketing
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 ml-7">Für personalisierte Werbung</p>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.marketing}
                      onChange={() => handleToggleSetting('marketing')}
                    />
                    <div className="relative w-9 h-5 bg-zinc-200 dark:bg-zinc-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 dark:after:border-zinc-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
              
              <div className="border border-zinc-100 dark:border-zinc-700 rounded-xl p-3.5 bg-white dark:bg-zinc-800 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-white flex items-center">
                      <span className="w-5 h-5 mr-2 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                        </svg>
                      </span>
                      Präferenzen
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 ml-7">Für eine personalisierte Erfahrung</p>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.preferences}
                      onChange={() => handleToggleSetting('preferences')}
                    />
                    <div className="relative w-9 h-5 bg-zinc-200 dark:bg-zinc-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 dark:after:border-zinc-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
              <button
                onClick={handleSaveSettings}
                className="w-full sm:flex-1 px-3 py-2 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium transition-colors shadow-sm hover:shadow"
              >
                Auswahl speichern
              </button>
              <button
                onClick={handleAcceptAll}
                className="w-full sm:flex-1 px-3 py-2 bg-gradient-to-r from-cyberblue to-mintgreen text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md hover:opacity-90"
              >
                Alle akzeptieren
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-700 overflow-hidden transition-all duration-300">
          <div className="p-5 md:p-6 relative">
            <div className="flex items-start">
              <div className="mr-4 mt-1 hidden sm:block">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyberblue to-mintgreen p-[2px]">
                  <div className="w-full h-full bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
                      <path d="M8.5 8.5v.01"/>
                      <path d="M16 15.5v.01"/>
                      <path d="M12 12v.01"/>
                      <path d="M11 17v.01"/>
                      <path d="M7 14v.01"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-base font-display font-semibold text-zinc-900 dark:text-white mb-1.5">Wir respektieren Ihre Privatsphäre</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4">
                  Diese Website verwendet Cookies, um Ihr Erlebnis zu verbessern. Sie können wählen, welche Cookies Sie zulassen möchten.
                </p>
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
                  <button
                    onClick={() => toggleDetails(true)}
                    className="w-full sm:flex-1 px-3 py-2 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium transition-colors shadow-sm hover:shadow"
                  >
                    Einstellungen
                  </button>
                  <button
                    onClick={handleDecline}
                    className="w-full sm:flex-1 px-3 py-2 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium transition-colors shadow-sm hover:shadow"
                  >
                    Nur notwendige
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="w-full sm:flex-1 px-3 py-2 bg-gradient-to-r from-cyberblue to-mintgreen text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md hover:opacity-90"
                  >
                    Alle akzeptieren
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// Add display name for better debugging in React DevTools
CookieConsent.displayName = 'CookieConsent';

export default CookieConsent;
