// **STABLE RELEASE**: Network-First, falling back to Cache strategy.
// v2.6.2: Force cache bust to resolve stale CSS issue in production.
const CACHE_NAME = 'turbotags-v2.6.2-cache-bust';

// Essential assets to pre-cache for the app shell to work offline.
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

// On activate, clean up all old and outdated caches.
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

// On fetch, implement the Network-First strategy.
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // **CRITICAL FIX**: Ignore requests for non-http/https schemes, like chrome-extension://.
  // This prevents the "Request scheme is unsupported" error.
  if (!request.url.startsWith('http')) {
    return; // Let the browser handle these requests natively.
  }

  // Do not cache API calls or non-GET requests.
  if (request.method !== 'GET' || request.url.includes('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(
    (async () => {
      // 1. Try the network first.
      try {
        const networkResponse = await fetch(request);
        
        // If the network request is successful, update the cache and return the response.
        // We only cache successful (status 200) responses to avoid caching errors.
        if (networkResponse.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;

      } catch (error) {
        // 2. If the network fails, try to serve the response from the cache.
        console.warn(`[SW] Network request for ${request.url} failed. Trying cache.`);
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
          console.log(`[SW] Serving ${request.url} from cache.`);
          return cachedResponse;
        }

        // 3. If the resource is not in the cache and the network failed,
        // let the browser handle the error. This avoids the 503 and shows a standard network error.
        console.error(`[SW] Failed to fetch ${request.url} from both network and cache.`);
        
        // For page navigations, we can try to return the main page as a last resort.
        if (request.mode === 'navigate') {
          const fallbackResponse = await caches.match('/');
          if (fallbackResponse) {
            return fallbackResponse;
          }
        }

        // Let the browser generate the response for a failed fetch.
        return Response.error();
      }
    })()
  );
});
