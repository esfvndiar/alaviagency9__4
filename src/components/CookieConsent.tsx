import React, { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';

interface CookieSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

interface CookieConsentProps {
  onAccept?: (settings: CookieSettings) => void;
  onDecline?: () => void;
}

const CONSENT_COOKIE_NAME = 'cookie-consent';
const SETTINGS_COOKIE_NAME = 'cookie-settings';
const CONSENT_STORAGE_KEY = 'alavi-cookie-consent';

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onDecline }) => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false,
  });

  // Check if browser supports cookies and localStorage
  const checkBrowserSupport = useCallback(() => {
    let cookiesSupported = true;
    let localStorageSupported = true;

    // Check cookies support
    try {
      Cookies.set('cookie_test', 'test', { expires: 1 });
      if (Cookies.get('cookie_test') !== 'test') {
        cookiesSupported = false;
      }
      Cookies.remove('cookie_test');
    } catch (e) {
      cookiesSupported = false;
    }

    // Check localStorage support
    try {
      localStorage.setItem('ls_test', 'test');
      if (localStorage.getItem('ls_test') !== 'test') {
        localStorageSupported = false;
      }
      localStorage.removeItem('ls_test');
    } catch (e) {
      localStorageSupported = false;
    }

    return { cookiesSupported, localStorageSupported };
  }, []);

  // Check if consent has been given before - using both cookies and localStorage
  // to ensure persistence across all pages and subdomains
  useEffect(() => {
    const checkConsent = () => {
      const { cookiesSupported, localStorageSupported } = checkBrowserSupport();
      
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
    
    // Only show the banner if no consent has been given
    if (!checkConsent()) {
      setVisible(true);
    }
  }, [checkBrowserSupport]);

  const saveConsent = (consentType: string, settingsData: CookieSettings) => {
    const { cookiesSupported, localStorageSupported } = checkBrowserSupport();
    
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
  };

  const handleAcceptAll = () => {
    const allSettings = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    
    saveConsent('all', allSettings);
    setVisible(false);
    if (onAccept) onAccept(allSettings);
  };

  const handleSaveSettings = () => {
    saveConsent('custom', settings);
    setVisible(false);
    if (onAccept) onAccept(settings);
  };

  const handleDecline = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    
    saveConsent('necessary', necessaryOnly);
    setVisible(false);
    if (onDecline) onDecline();
  };

  const handleToggleSetting = (key: keyof CookieSettings) => {
    if (key === 'necessary') return; // Necessary cookies can't be toggled
    
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Function to open cookie settings from anywhere in the app
  const openCookieSettings = () => {
    setVisible(true);
    setShowDetails(true);
  };

  // Expose the function to window for global access
  useEffect(() => {
    // Define a proper type for the window object with our custom property
    interface CustomWindow extends Window {
      openCookieSettings?: () => void;
    }
    
    // Cast window to our custom type
    const customWindow = window as CustomWindow;
    customWindow.openCookieSettings = openCookieSettings;
    
    return () => {
      delete customWindow.openCookieSettings;
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto z-[9999] max-w-md">
      {showDetails ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-zinc-100 overflow-hidden transition-all duration-300">
          <div className="p-4 md:p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-display font-medium">Cookie-Einstellungen</h2>
              <button 
                onClick={() => setShowDetails(false)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18"></path>
                  <path d="M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <p className="text-sm text-zinc-600 mb-4">
              Wir verwenden Cookies für eine optimale Website-Erfahrung. Wählen Sie aus, welche Cookies Sie zulassen möchten.
            </p>
            
            <div className="space-y-3 mb-4">
              <div className="border border-zinc-100 rounded-lg p-3 bg-white/80">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-900">Notwendige Cookies</h3>
                    <p className="text-xs text-zinc-500">Erforderlich für die Grundfunktionen</p>
                  </div>
                  <div className="bg-primary/10 text-primary text-xs font-medium py-0.5 px-2 rounded text-[10px]">
                    Erforderlich
                  </div>
                </div>
              </div>
              
              <div className="border border-zinc-100 rounded-lg p-3 bg-white/80">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-900">Analyse</h3>
                    <p className="text-xs text-zinc-500">Hilft uns, die Nutzung zu verstehen</p>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={settings.analytics}
                      onChange={() => handleToggleSetting('analytics')}
                    />
                    <div className="relative w-8 h-4 bg-zinc-200 rounded-full peer peer-checked:bg-primary peer-focus:ring-1 peer-focus:ring-primary/30">
                      <div className="absolute top-[2px] left-[2px] bg-white w-3 h-3 rounded-full transition-all peer-checked:translate-x-4"></div>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="border border-zinc-100 rounded-lg p-3 bg-white/80">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-900">Marketing</h3>
                    <p className="text-xs text-zinc-500">Für personalisierte Werbung</p>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={settings.marketing}
                      onChange={() => handleToggleSetting('marketing')}
                    />
                    <div className="relative w-8 h-4 bg-zinc-200 rounded-full peer peer-checked:bg-primary peer-focus:ring-1 peer-focus:ring-primary/30">
                      <div className="absolute top-[2px] left-[2px] bg-white w-3 h-3 rounded-full transition-all peer-checked:translate-x-4"></div>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="border border-zinc-100 rounded-lg p-3 bg-white/80">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-900">Präferenzen</h3>
                    <p className="text-xs text-zinc-500">Speichert Ihre Einstellungen</p>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={settings.preferences}
                      onChange={() => handleToggleSetting('preferences')}
                    />
                    <div className="relative w-8 h-4 bg-zinc-200 rounded-full peer peer-checked:bg-primary peer-focus:ring-1 peer-focus:ring-primary/30">
                      <div className="absolute top-[2px] left-[2px] bg-white w-3 h-3 rounded-full transition-all peer-checked:translate-x-4"></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={handleDecline}
                className="px-3 py-1.5 text-xs border border-zinc-200 rounded-md text-zinc-600 hover:bg-zinc-50 transition-colors"
              >
                Ablehnen
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-3 py-1.5 text-xs bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Speichern
              </button>
            </div>
            
            <div className="mt-3 text-[10px] text-zinc-400 text-center">
              <a href="/legal" className="underline hover:text-zinc-600 transition-colors">Datenschutz & Impressum</a>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-zinc-100 overflow-hidden transition-all duration-300">
          <div className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-sm text-zinc-700 mb-1">
                  Diese Website verwendet Cookies, um Ihr Erlebnis zu verbessern.
                </p>
                <button 
                  onClick={() => setShowDetails(true)}
                  className="text-xs text-primary hover:text-primary/80 font-medium underline"
                >
                  Einstellungen anpassen
                </button>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={handleDecline}
                  className="px-3 py-1.5 text-xs border border-zinc-200 rounded-md text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  Ablehnen
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-3 py-1.5 text-xs bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Akzeptieren
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookieConsent;
