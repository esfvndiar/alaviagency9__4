/**
 * Background Sync Utilities
 * 
 * This module provides utilities for implementing background sync in PWA applications,
 * allowing forms and other operations to work offline and sync when connectivity is restored.
 */

type SyncOptions = {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: string | Record<string, unknown>;
  tag?: string;
  callback?: () => void;
};

/**
 * Checks if the background sync API is available in the current browser
 */
export const isBackgroundSyncSupported = (): boolean => {
  return 'serviceWorker' in navigator && 
    'SyncManager' in window && 
    navigator.serviceWorker.controller !== null;
};

/**
 * Checks if periodic sync API is available in the current browser
 */
export const isPeriodicSyncSupported = (): boolean => {
  return 'serviceWorker' in navigator && 
    'PeriodicSyncManager' in window && 
    navigator.serviceWorker.controller !== null;
};

/**
 * Registers a sync operation for background processing
 * If offline, the request will be queued and processed when online
 */
export const registerSync = async (options: SyncOptions): Promise<boolean> => {
  const { url, method, headers = {}, body, tag = 'sync-data', callback } = options;
  
  // Generate a unique ID for this sync request
  const syncId = `${tag}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
  
  // Store the request data in IndexedDB for later processing
  try {
    // Check for network connectivity
    const isOnline = navigator.onLine;
    
    if (isOnline) {
      // If online, attempt the fetch immediately
      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers
          },
          body: typeof body === 'string' ? body : JSON.stringify(body)
        });
        
        if (response.ok) {
          if (callback) callback();
          return true;
        } else {
          throw new Error(`Server responded with ${response.status}`);
        }
      } catch (error) {
        console.warn('Failed to submit form while online, falling back to background sync', error);
        // Fall through to background sync logic
      }
    }
    
    // Check if background sync is supported
    if (!isBackgroundSyncSupported()) {
      throw new Error('Background sync not supported in this browser');
    }
    
    // Store request data for later processing
    const syncStore = await openSyncStore();
    await syncStore.add({
      id: syncId,
      url,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: typeof body === 'string' ? body : JSON.stringify(body),
      timestamp: Date.now()
    });
    
    // Register for sync with the service worker
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register(tag);
    
    return true;
  } catch (error) {
    console.error('Error registering background sync:', error);
    return false;
  }
};

/**
 * Opens the IndexedDB store for sync data
 */
export const openSyncStore = async () => {
  return new Promise<IDBObjectStore>((resolve, reject) => {
    const request = indexedDB.open('sync-db', 1);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('sync-store')) {
        db.createObjectStore('sync-store', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction('sync-store', 'readwrite');
      const store = transaction.objectStore('sync-store');
      resolve(store);
    };
    
    request.onerror = () => {
      reject(new Error('Error opening IndexedDB for sync storage'));
    };
  });
};

/**
 * Utility function to register for periodic content updates
 */
export const registerPeriodicSync = async (tag: string = 'content-update', minInterval: number = 24 * 60 * 60): Promise<boolean> => {
  try {
    if (!isPeriodicSyncSupported()) {
      return false;
    }
    
    const registration = await navigator.serviceWorker.ready;
    const periodicSync = registration.periodicSync;
    
    // Check permission status
    const status = await periodicSync.getTags();
    
    // Register for periodic sync
    if (!status.includes(tag)) {
      await periodicSync.register(tag, {
        minInterval // in seconds
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error registering periodic sync:', error);
    return false;
  }
};

// Helper type for the sync store entries
interface SyncEntry {
  id: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
  timestamp: number;
}

/**
 * Process any pending sync entries (called by service worker)
 */
export const processPendingSyncs = async (): Promise<void> => {
  try {
    const syncStore = await openSyncStore();
    const getAll = syncStore.getAll();
    
    getAll.onsuccess = async () => {
      const entries: SyncEntry[] = getAll.result || [];
      for (const entry of entries) {
        try {
          // Attempt to process this entry
          const response = await fetch(entry.url, {
            method: entry.method,
            headers: entry.headers,
            body: entry.body
          });
          
          if (response.ok) {
            // If successful, remove from the store
            syncStore.delete(entry.id);
          } else {
            console.warn(`Sync failed for entry ${entry.id}: ${response.status}`);
          }
        } catch (error) {
          console.error(`Error processing sync entry ${entry.id}:`, error);
        }
      }
    };
  } catch (error) {
    console.error('Error processing pending syncs:', error);
  }
}; 