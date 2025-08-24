const CACHE_NAME = 'turbotags-v2.1.7'; // Increment version for update

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

// Fetch event handler
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignore non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API calls: Network-only. Don't cache.
  if (request.url.includes('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // HTML Pages (Navigation): Network-first, falling back to cache.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Static Assets (JS, CSS, Images, etc.): Cache-First strategy.
  // This is more stable and avoids the "body already used" error.
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return from cache if found.
      if (cachedResponse) {
        return cachedResponse;
      }
      // Otherwise, fetch from network, cache it, and return the response.
      return fetch(request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});
