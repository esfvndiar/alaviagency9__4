// ALAVI Website Service Worker
const CACHE_NAME = 'alavi-cache-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately on service worker install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/favicon.ico',
  '/assets/images/logo.svg',
  '/assets/images/logo-dark.svg',
  '/assets/fonts/inter-var.woff2',
];

// Install event - precache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting()) // Activate worker immediately
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
    }).then((cachesToDelete) => {
      return Promise.all(cachesToDelete.map((cacheToDelete) => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim()) // Take control of all clients
  );
});

// Helper function to determine if a request is for an API
const isApiRequest = (request) => {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/');
};

// Helper function to determine if a request is for an image
const isImageRequest = (request) => {
  return request.destination === 'image';
};

// Helper function to determine if a request is for a font
const isFontRequest = (request) => {
  return request.destination === 'font';
};

// Helper function to determine if a request is for a style
const isStyleRequest = (request) => {
  return request.destination === 'style';
};

// Helper function to determine if a request is for a script
const isScriptRequest = (request) => {
  return request.destination === 'script';
};

// Helper function to determine if a request is for a document
const isDocumentRequest = (request) => {
  return request.destination === 'document';
};

// Fetch event - handle requests with appropriate caching strategies
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle different types of requests with appropriate strategies
  if (isApiRequest(event.request)) {
    // Network-first strategy for API requests
    event.respondWith(networkFirstStrategy(event.request));
  } else if (isImageRequest(event.request)) {
    // Cache-first strategy for images
    event.respondWith(cacheFirstStrategy(event.request));
  } else if (isFontRequest(event.request) || isStyleRequest(event.request)) {
    // Stale-while-revalidate for fonts and styles
    event.respondWith(staleWhileRevalidateStrategy(event.request));
  } else if (isScriptRequest(event.request)) {
    // Cache-first for scripts
    event.respondWith(cacheFirstStrategy(event.request));
  } else if (isDocumentRequest(event.request)) {
    // Network-first for HTML documents
    event.respondWith(networkFirstWithOfflineFallbackStrategy(event.request));
  } else {
    // Default to network-first for everything else
    event.respondWith(networkFirstStrategy(event.request));
  }
});

// Network-first strategy: try network, fall back to cache
function networkFirstStrategy(request) {
  return fetch(request)
    .then((response) => {
      // If we got a valid response, clone it and cache it
      if (response && response.status === 200) {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });
      }
      return response;
    })
    .catch(() => {
      // If network fails, try to get from cache
      return caches.match(request);
    });
}

// Cache-first strategy: try cache, fall back to network
function cacheFirstStrategy(request) {
  return caches.match(request)
    .then((response) => {
      // If found in cache, return it
      if (response) {
        // Revalidate cache in the background
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse);
            });
          }
        }).catch(() => {
          // Network request failed, but we already have cache so it's fine
        });
        return response;
      }

      // If not in cache, fetch from network and cache
      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      });
    });
}

// Stale-while-revalidate: return from cache while updating cache in background
function staleWhileRevalidateStrategy(request) {
  return caches.open(CACHE_NAME).then((cache) => {
    return cache.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      }).catch(() => {
        // Network failed, but if we have a cached response that's fine
      });

      // Return the cached response immediately, or wait for the network if not cached
      return cachedResponse || fetchPromise;
    });
  });
}

// Network-first with offline fallback for HTML documents
function networkFirstWithOfflineFallbackStrategy(request) {
  return fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });
      }
      return response;
    })
    .catch(() => {
      return caches.match(request)
        .then((cachedResponse) => {
          // Return cached response if available
          if (cachedResponse) {
            return cachedResponse;
          }
          // Otherwise return the offline page
          return caches.match(OFFLINE_URL);
        });
    });
}

// Handle messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Store pending form submissions for syncing when back online
const FORM_QUEUE_NAME = 'offline-forms';
let db = null;

// Initialize IndexedDB for storing offline form submissions
function initializeDB() {
  // Return existing connection if available
  if (db) {
    return Promise.resolve(db);
  }
  
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('alaviOfflineDB', 1);
    
    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      db = null;
      reject(event.target.error);
    };
    
    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      if (!database.objectStoreNames.contains(FORM_QUEUE_NAME)) {
        database.createObjectStore(FORM_QUEUE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
    
    request.onsuccess = (event) => {
      db = event.target.result;
      
      // Handle connection closing unexpectedly
      db.onclose = () => {
        db = null;
      };
      
      // Handle version change (from another tab)
      db.onversionchange = () => {
        db.close();
        db = null;
        console.log('Database version changed, please reload the page');
      };
      
      resolve(db);
    };
  });
}

// When service worker starts, initialize the database
initializeDB().catch(error => {
  console.error('Failed to initialize offline storage:', error);
});

// Enhanced background sync for deferred operations (like form submissions)
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-submission') {
    event.waitUntil(syncContactForm());
  } else if (event.tag === 'newsletter-subscription') {
    event.waitUntil(syncNewsletterSubscription());
  } else if (event.tag === 'content-update') {
    event.waitUntil(updateCachedContent());
  }
});

// Push notification support
self.addEventListener('push', (event) => {
  if (!event.data) {
    console.warn('Push event received but no data');
    return;
  }
  
  let notification;
  try {
    notification = event.data.json();
  } catch (e) {
    // If not JSON, treat as text
    notification = {
      title: 'New Notification',
      body: event.data.text(),
      icon: '/favicon.ico'
    };
  }
  
  const options = {
    body: notification.body || 'You have a new notification',
    icon: notification.icon || '/favicon.ico',
    badge: notification.badge || '/favicon.ico',
    data: notification.data || {},
    actions: notification.actions || []
  };
  
  event.waitUntil(
    self.registration.showNotification(notification.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        const url = event.notification.data.url || '/';
        
        // If we have a client already open, focus it
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Otherwise open a new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Periodic background sync
// This requires the user to grant the 'periodic-background-sync' permission
if ('periodicSync' in self.registration) {
  // Listen for periodic sync events
  self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'content-update') {
      event.waitUntil(updateCachedContent());
    } else if (event.tag === 'news-update') {
      event.waitUntil(fetchLatestNews());
    }
  });
}

// Function to sync contact form data when back online
function syncContactForm() {
  return getQueuedItems(FORM_QUEUE_NAME)
    .then(queuedItems => {
      const promises = queuedItems.map(formData => {
        return fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData.data)
        }).then(response => {
          if (response.ok) {
            // Remove from queue if successful
            return removeQueuedItem(FORM_QUEUE_NAME, formData.id);
          }
          throw new Error('Failed to sync contact form');
        });
      });
      return Promise.all(promises);
    });
}

// Function to sync newsletter subscriptions when back online
function syncNewsletterSubscription() {
  return getQueuedItems('newsletter-queue')
    .then(queuedItems => {
      const promises = queuedItems.map(subscription => {
        return fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(subscription.data)
        }).then(response => {
          if (response.ok) {
            return removeQueuedItem('newsletter-queue', subscription.id);
          }
          throw new Error('Failed to sync newsletter subscription');
        });
      });
      return Promise.all(promises);
    });
}

// Function to update cached content
function updateCachedContent() {
  // Get a list of all URLs that should be refreshed
  const urlsToRefresh = [
    '/',
    '/about',
    '/services',
    '/work',
    '/contact',
    '/api/latest-projects',
    '/api/testimonials'
  ];
  
  return Promise.all(
    urlsToRefresh.map(url => {
      return fetch(url, { cache: 'no-cache' })
        .then(response => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            return caches.open(CACHE_NAME).then(cache => {
              return cache.put(url, responseClone);
            });
          }
        })
        .catch(error => {
          console.warn(`Failed to refresh ${url}:`, error);
        });
    })
  );
}

// Function to fetch latest news
async function fetchLatestNews() {
  try {
    const response = await fetch('/api/news', { cache: 'no-cache' });
    
    if (!response || !response.ok) {
      throw new Error(`Failed to fetch news: ${response ? response.status : 'No response'}`);
    }
    
    // Cache the response
    const responseClone = response.clone();
    const cache = await caches.open(CACHE_NAME);
    await cache.put('/api/news', responseClone);
    
    // Parse the JSON
    const data = await response.json();
    
    // Show notification if there are new items
    if (data && data.hasNewItems) {
      await self.registration.showNotification('New Content Available', {
        body: 'Check out our latest news and updates!',
        icon: '/favicon.ico',
        data: {
          url: '/news'
        }
      });
    }
    
    return data;
  } catch (error) {
    console.warn('Failed to fetch latest news:', error);
    return null;
  }
}

// Helper function to get items from IndexedDB queue
function getQueuedItems(storeName) {
  return new Promise((resolve, reject) => {
    if (!db) {
      return initializeDB().then(newDb => {
        db = newDb;
        return getQueuedItems(storeName);
      });
    }
    
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onerror = (event) => {
      reject(event.target.error);
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
}

// Helper function to remove an item from IndexedDB queue
function removeQueuedItem(storeName, id) {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(new Error('Database not initialized'));
    }
    
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    
    request.onerror = (event) => {
      reject(event.target.error);
    };
    
    request.onsuccess = () => {
      resolve();
    };
  });
}

// Helper function to add an item to IndexedDB queue
function addQueuedItem(storeName, data) {
  return new Promise((resolve, reject) => {
    if (!db) {
      return initializeDB().then(newDb => {
        db = newDb;
        return addQueuedItem(storeName, data);
      }).catch(reject);
    }
    
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add({ data, timestamp: Date.now() });
    
    request.onerror = (event) => {
      reject(event.target.error);
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
}

// Handle message from clients
self.addEventListener('message', event => {
  const message = event.data;
  
  if (message && message.type === 'STORE_FORM') {
    const { storeName, data } = message.payload;
    // Make sure we have the DB initialized
    initializeDB()
      .then(db => {
        // Use the correct store name from the message
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        // Add timestamp if not already present
        const record = { ...data, timestamp: data.timestamp || new Date().toISOString() };
        const request = store.add(record);
        
        request.onsuccess = () => {
          console.log(`Form data stored successfully in ${storeName}`);
          // Register a background sync
          if ('sync' in self.registration) {
            self.registration.sync.register('contact-form-submission')
              .then(() => console.log('Background sync registered'))
              .catch(error => console.error('Background sync registration failed:', error));
          }
        };
        
        request.onerror = (err) => {
          console.error(`Error storing form data in ${storeName}:`, err);
        };
      })
      .catch(error => {
        console.error('Failed to initialize database for storing form:', error);
        // Fallback to storing in localStorage via a message back to the client
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'STORE_FORM_FALLBACK',
              payload: { data }
            });
          });
        });
      });
  } else if (message && message.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Register background sync
self.addEventListener('sync', event => {
  if (event.tag === 'sync-contact-forms') {
    event.waitUntil(syncContactForms());
  } else if (event.tag === 'sync-newsletter') {
    event.waitUntil(syncNewsletter());
  }
});

// Sync contact forms data
async function syncContactForms() {
  try {
    const forms = await getQueuedItems(FORM_QUEUE_NAME);
    
    if (forms.length === 0) {
      return;
    }
    
    console.log(`Attempting to sync ${forms.length} contact forms`);
    
    // Process each form
    for (const form of forms) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form.data)
        });
        
        if (response.ok) {
          // If successfully sent, remove from IndexedDB
          await removeQueuedItem(FORM_QUEUE_NAME, form.id);
          console.log(`Successfully synced form from ${form.data?.email || 'unknown'}`);
          
          // Show notification if permission granted
          if (self.Notification && self.Notification.permission === 'granted') {
            self.registration.showNotification('Form Submitted', {
              body: `Your message has been sent successfully.`,
              icon: '/logo192.png',
            });
          }
        } else {
          console.error('Failed to sync form:', await response.text());
        }
      } catch (error) {
        console.error(`Error syncing form from ${form.data?.email || 'unknown'}:`, error);
      }
    }
  } catch (error) {
    console.error('Error during contact forms sync:', error);
  }
}

// Sync newsletter subscriptions
async function syncNewsletter() {
  try {
    const subscriptions = await getQueuedItems('newsletter-queue');
    
    if (subscriptions.length === 0) {
      return;
    }
    
    console.log(`Attempting to sync ${subscriptions.length} newsletter subscriptions`);
    
    // Process each subscription
    for (const subscription of subscriptions) {
      try {
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription.data)
        });
        
        if (response.ok) {
          // If successfully sent, remove from IndexedDB
          await removeQueuedItem('newsletter-queue', subscription.id);
          console.log(`Successfully synced newsletter subscription for ${subscription.data?.email || 'unknown'}`);
        } else {
          console.error('Failed to sync newsletter subscription:', await response.text());
        }
      } catch (error) {
        console.error(`Error syncing newsletter for ${subscription.data?.email || 'unknown'}:`, error);
      }
    }
  } catch (error) {
    console.error('Error during newsletter sync:', error);
  }
}

// Register periodic background sync if supported
if ('periodicSync' in self.registration) {
  // Try to register periodic sync to check for updates
  const tryPeriodicSync = async () => {
    try {
      // Check if permission is already granted
      const status = await navigator.permissions.query({
        name: 'periodic-background-sync',
      });
      
      if (status.state === 'granted') {
        await self.registration.periodicSync.register('content-update', {
          minInterval: 24 * 60 * 60 * 1000, // Once per day
        });
        console.log('Periodic background sync registered');
      }
    } catch (error) {
      console.error('Periodic background sync registration failed:', error);
    }
  };
  
  tryPeriodicSync();
}

// Handle periodic background sync
self.addEventListener('periodicsync', event => {
  if (event.tag === 'content-update') {
    event.waitUntil(updateCache());
  }
});

// Update cache with latest content
async function updateCache() {
  try {
    // Fetch the latest news
    const response = await fetch('/api/latest-content');
    
    if (response.ok) {
      const data = await response.json();
      
      // Cache the new content
      const cache = await caches.open(CACHE_NAME);
      
      // Update cached pages with fresh content
      for (const item of data.items) {
        try {
          const freshResponse = await fetch(item.url);
          if (freshResponse.ok) {
            await cache.put(item.url, freshResponse);
            console.log(`Updated cache for: ${item.url}`);
          }
        } catch (error) {
          console.error(`Failed to update cache for ${item.url}:`, error);
        }
      }
      
      // Show notification about the update if permission is granted
      if (self.Notification && self.Notification.permission === 'granted') {
        self.registration.showNotification('Content Updated', {
          body: 'New content is available for offline viewing.',
          icon: '/logo192.png',
        });
      }
    }
  } catch (error) {
    console.error('Error updating cache:', error);
  }
}
