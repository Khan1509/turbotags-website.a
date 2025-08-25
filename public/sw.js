const CACHE_NAME = 'turbotags-v2.1.8'; // **CRITICAL**: Incremented version for a fresh start

// On install, activate immediately. No pre-caching to ensure installation never fails.
self.addEventListener('install', (event) => {
  console.log(`[SW ${CACHE_NAME}] Install: Service worker installing.`);
  event.waitUntil(self.skipWaiting());
});

// On activate, clean up all old caches and take control of pages.
self.addEventListener('activate', (event) => {
  console.log(`[SW ${CACHE_NAME}] Activate: Service worker activating.`);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(`[SW ${CACHE_NAME}] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log(`[SW ${CACHE_NAME}] Claiming clients.`);
      return self.clients.claim();
    })
  );
});

// Fetch event handler: A single, robust "Network-first, falling back to cache" strategy.
// This is the most reliable approach to prevent the "body already used" errors.
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignore non-GET requests and API calls. They should always go to the network.
  if (request.method !== 'GET' || request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // If the fetch is successful, we clone the response.
        // One copy goes to the cache, the other is returned to the browser.
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        return networkResponse;
      })
      .catch(() => {
        // If the network request fails (e.g., user is offline),
        // we try to serve the content from the cache.
        console.log(`[SW ${CACHE_NAME}] Network failed, serving from cache: ${request.url}`);
        return caches.match(request);
      })
  );
});
