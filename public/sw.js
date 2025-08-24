const CACHE_NAME = 'turbotags-v2.1.3'; // Incrementing version to ensure update
const urlsToCache = [
  '/',
  '/manifest.json',
  '/favicon.svg'
  // IMPORTANT: Only static assets that can be fetched with a GET request should be here.
  // API endpoints (like /api/generate) or source files (like /src/main.jsx)
  // must NOT be in this list, as it will cause the installation to fail.
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // This command will fail if any of the URLs in urlsToCache are invalid or return an error.
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Force the new service worker to become active immediately.
        return self.skipWaiting();
      })
      .catch(err => {
        // Log a detailed error to help debug future issues.
        console.error('Service Worker installation failed:', err);
      })
  );
});

// Fetch event (caches other assets as they are requested)
self.addEventListener('fetch', (event) => {
  // We only want to handle GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // If we have a cached response, return it.
        if (response) {
          return response;
        }
        
        // If not in cache, fetch it from the network.
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Check if we received a valid response to cache.
          // We only cache basic, successful (200) responses.
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response because it's a one-time use stream.
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              // Put the new response in the cache.
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
  );
});

// Activate event (cleans up old caches)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // If a cache's name is different from our current one, delete it.
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of the page immediately.
      return self.clients.claim();
    })
  );
});
