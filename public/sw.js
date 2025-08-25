// **CRITICAL FIX**: A more robust Service Worker to eliminate all previous errors.
const CACHE_NAME = 'turbotags-v2.1.9'; // Incremented version for a clean installation.

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

// Fetch event handler using a stable "Network-first, falling back to cache" strategy.
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Always use the network for API calls and non-GET requests.
  if (request.method !== 'GET' || request.url.includes('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // For all other GET requests, try the network first.
  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(request);
        
        // If the network request is successful, cache the response and return it.
        // We must clone the response to use it in both the cache and the browser.
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, networkResponse.clone());
        
        return networkResponse;
      } catch (error) {
        // If the network fails (e.g., user is offline), try to serve from the cache.
        console.log(`[SW ${CACHE_NAME}] Network failed for ${request.url}, trying cache.`);
        const cachedResponse = await caches.match(request);
        
        // Return the cached response if it exists.
        return cachedResponse;
      }
    })()
  );
});
