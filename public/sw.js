const CACHE_NAME = 'turbotags-v2.1.5'; // New version for a clean update

/**
 * INSTALL: This event now only ensures the service worker becomes active.
 * It no longer pre-caches any assets, which makes the installation
 * process virtually immune to network failures.
 */
self.addEventListener('install', (event) => {
  console.log(`[SW v${CACHE_NAME}] Install: Service worker installing.`);
  event.waitUntil(self.skipWaiting());
});

/**
 * ACTIVATE: This event cleans up old, unused caches to save space.
 */
self.addEventListener('activate', (event) => {
  console.log(`[SW v${CACHE_NAME}] Activate: Service worker activating.`);
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
    }).then(() => {
      console.log(`[SW v${CACHE_NAME}] Claiming clients.`);
      return self.clients.claim();
    })
  );
});

/**
 * FETCH: This event handles all network requests.
 * It uses a "Network falling back to Cache" strategy.
 * 1. Try the network first to get the latest content.
 * 2. If successful, cache the response and return it.
 * 3. If the network fails (e.g., offline), return the content from the cache.
 */
self.addEventListener('fetch', (event) => {
  // We only cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // If we get a valid response, cache it for offline use.
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      })
      .catch(() => {
        // If the network request fails, try to serve from the cache.
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log(`[SW v${CACHE_NAME}] Serving from cache: ${event.request.url}`);
            return cachedResponse;
          }
          // If not in cache and offline, the request will fail, which is expected.
        });
      })
  );
});
