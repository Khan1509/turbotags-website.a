// **CRITICAL FIX**: Implement pre-caching and a more robust cache-first fetch strategy.
const CACHE_NAME = 'turbotags-v2.5.0'; // Incremented version for a clean installation.

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg',
];

// On install, pre-cache the app shell.
self.addEventListener('install', (event) => {
  console.log(`[SW ${CACHE_NAME}] Install: Pre-caching app shell.`);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
      .catch(error => console.error(`[SW ${CACHE_NAME}] Pre-caching failed:`, error))
  );
});

// On activate, clean up old caches.
self.addEventListener('activate', (event) => {
  console.log(`[SW ${CACHE_NAME}] Activate: Cleaning up old caches.`);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event handler
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Always use the network for API calls and non-GET requests.
  if (request.method !== 'GET' || request.url.includes('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // For all other GET requests, use a "Cache then Network" strategy.
  event.respondWith(
    (async () => {
      // 1. Try to get the response from the cache.
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }

      // 2. If not in cache, go to the network.
      try {
        const networkResponse = await fetch(request);
        
        // 3. If the fetch is successful, cache the new response and return it.
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
        
        return networkResponse;
      } catch (error) {
        // 4. If the network fails and it wasn't in the cache, then we have to fail.
        console.error(`[SW ${CACHE_NAME}] Fetch failed for ${request.url}:`, error);
        
        // For navigation requests, we can try to return the main page as a fallback.
        if (request.mode === 'navigate') {
          const fallbackResponse = await caches.match('/');
          if (fallbackResponse) {
            return fallbackResponse;
          }
        }

        // For other assets (e.g., images, JS, CSS), failure is critical.
        // Returning a 503 is a safe way to signal this without crashing the app.
        return new Response('Resource unavailable. Please check your network connection.', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' },
        });
      }
    })()
  );
});
