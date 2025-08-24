const CACHE_NAME = 'turbotags-v2.1.0';
const STATIC_CACHE = 'turbotags-static-v2.1.0';
const DYNAMIC_CACHE = 'turbotags-dynamic-v2.1.0';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json',
  // Add more static assets as needed
];

// Resources to cache on first request
const DYNAMIC_PATTERNS = [
  /\/assets\/.+\.(js|css|woff2|woff|svg|png|jpg|jpeg|webp)$/,
  /\/blog\/.*/,
  /\/about$/,
  /\/legal\/.*/
];

// API endpoints that should not be cached
const NO_CACHE_PATTERNS = [
  /\/api\/.*/,
  /\/admin\/.*/
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip caching for API requests and admin pages
  if (NO_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    return; // Let the request go through normally
  }

  // Handle static assets (cache first)
  if (DYNAMIC_PATTERNS.some(pattern => pattern.test(url.pathname)) || 
      url.pathname === '/' || 
      url.pathname === '/index.html') {
    
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached version and update in background
            updateCache(request);
            return cachedResponse;
          }
          
          // Not in cache, fetch and cache
          return fetchAndCache(request);
        })
        .catch(() => {
          // Network failed, try to return cached version
          return caches.match('/');
        })
    );
    return;
  }

  // Handle navigation requests (network first with cache fallback)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful navigation responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Network failed, return cached version or offline page
          return caches.match(request)
            .then((cachedResponse) => {
              return cachedResponse || caches.match('/');
            });
        })
    );
    return;
  }

  // For all other requests, try network first
  event.respondWith(
    fetch(request)
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Helper function to fetch and cache
function fetchAndCache(request) {
  return fetch(request)
    .then((response) => {
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }

      const responseToCache = response.clone();
      const cacheName = DYNAMIC_PATTERNS.some(pattern => pattern.test(request.url)) 
        ? STATIC_CACHE 
        : DYNAMIC_CACHE;

      caches.open(cacheName)
        .then((cache) => {
          cache.put(request, responseToCache);
        });

      return response;
    });
}

// Helper function to update cache in background
function updateCache(request) {
  fetch(request)
    .then((response) => {
      if (response && response.status === 200 && response.type === 'basic') {
        const responseToCache = response.clone();
        const cacheName = DYNAMIC_PATTERNS.some(pattern => pattern.test(request.url)) 
          ? STATIC_CACHE 
          : DYNAMIC_CACHE;

        caches.open(cacheName)
          .then((cache) => {
            cache.put(request, responseToCache);
          });
      }
    })
    .catch(() => {
      // Silently fail background updates
    });
}

// Handle push notifications (future enhancement)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.id
      },
      actions: [
        {
          action: 'explore',
          title: 'Go to TurboTags',
          icon: '/favicon.svg'
        },
        {
          action: 'close',
          title: 'Close notification',
          icon: '/favicon.svg'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('Service Worker: Loaded successfully');
