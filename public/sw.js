const CACHE_NAME = 'turbotags-v2.1.6'; // Updated cache name

// On install, activate immediately
self.addEventListener('install', (event) => {
  console.log(`[SW v${CACHE_NAME}] Install`);
  event.waitUntil(self.skipWaiting());
});

// On activate, clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  console.log(`[SW v${CACHE_NAME}] Activate`);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(`[SW v${CACHE_NAME}] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event handler with multiple strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignore non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API calls: Network-only. Don't cache.
  if (request.url.includes('/api/')) {
    return; // Let the browser handle it, no offline support for API.
  }

  // HTML Pages (Navigation): Network-first, falling back to cache.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Clone and cache the successful response
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // If network fails, serve from cache
          return caches.match(request);
        })
    );
    return;
  }

  // Static Assets (JS, CSS, Images, Fonts, Manifest): Stale-While-Revalidate.
  // This serves from cache immediately for speed, then updates the cache in the background.
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, networkResponse.clone());
        });
        return networkResponse;
      });

      // Return cached response if available, otherwise wait for network
      return cachedResponse || fetchPromise;
    })
  );
});
