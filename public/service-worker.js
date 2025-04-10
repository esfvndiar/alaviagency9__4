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

// Background sync for deferred operations (like form submissions)
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-submission') {
    event.waitUntil(syncContactForm());
  }
});

// Function to sync contact form data when back online
function syncContactForm() {
  return fetch('/api/contact-queue')
    .then(response => response.json())
    .then(data => {
      const promises = data.map(formData => {
        return fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }).then(response => {
          if (response.ok) {
            // Remove from queue if successful
            return fetch(`/api/contact-queue/${formData.id}`, {
              method: 'DELETE'
            });
          }
        });
      });
      return Promise.all(promises);
    });
}
