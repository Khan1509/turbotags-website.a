const CACHE_NAME = 'turbotags-v2.1.4'; // New version to trigger update

// We are simplifying the pre-cache strategy to be more robust.
// Only the main entry point '/' is pre-cached.
// All other assets (JS, CSS, images, manifest) will be cached on-the-fly
// by the 'fetch' event handler when they are first requested.
// This prevents installation failure if a non-essential asset is temporarily unavailable.
const urlsToCache = [
  '/',
];

// Install Event: Caches the app shell.
self.addEventListener('install', (event) => {
  console.log(`[SW] Install event for version ${CACHE_NAME}`);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Force the new service worker to become active immediately.
        console.log('[SW] Skip waiting completed');
        return self.skipWaiting();
      })
      .catch(error => {
        // This is a critical error, the service worker will not install.
        console.error('[SW] Installation failed:', error);
      })
  );
});

// Activate Event: Cleans up old caches.
self.addEventListener('activate', (event) => {
  console.log(`[SW] Activate event for version ${CACHE_NAME}`);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // If a cache's name is different from our current one, delete it.
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages under the service worker's scope immediately.
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch Event: Serves assets from cache or network.
self.addEventListener('fetch', (event) => {
  // We only handle GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  // Strategy: Cache then Network.
  // For navigation requests, try network first to get the latest version,
  // then fallback to cache. For all other requests, try cache first.
  const isNavigation = event.request.mode === 'navigate';

  if (isNavigation) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If fetch is successful, cache the new response and return it
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          // If fetch fails (e.g., offline), return the cached page
          return caches.match(event.request);
        })
    );
  } else {
    // For non-navigation requests (CSS, JS, images), use Cache-First strategy
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          // If we have a cached response, return it.
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // If not in cache, fetch it from the network.
          return fetch(event.request).then((networkResponse) => {
            // Check if we received a valid response to cache.
            // We only cache basic, successful (200) responses.
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clone the response because it's a one-time use stream.
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          });
        })
    );
  }
});
