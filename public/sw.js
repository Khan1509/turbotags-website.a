// **CRITICAL FIX**: A more robust Service Worker to eliminate all previous errors.
const CACHE_NAME = 'turbotags-v2.2.0'; // Incremented version for a clean installation.

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
        const cache = await caches.open(CACHE_NAME);
        // We must clone the response to use it in both the cache and the browser.
        await cache.put(request, networkResponse.clone());
        
        return networkResponse;
      } catch (error) {
        // If the network fails (e.g., user is offline), try to serve from the cache.
        console.log(`[SW ${CACHE_NAME}] Network failed for ${request.url}, trying cache.`);
        const cachedResponse = await caches.match(request);
        
        // **FIX**: If a cached response is found, return it.
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // **FIX**: If the resource is not in the cache and the network has failed,
        // we must return a valid Response object to avoid a TypeError.
        // A 503 Service Unavailable response is appropriate and prevents the crash.
        return new Response('', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      }
    })()
  );
});
