// service-worker.js
// This Service Worker enables offline capabilities and caching for TurboTags.

const CACHE_NAME = 'turbotags-cache-v1';
const urlsToCache = [
    '/', // Cache the homepage
    '/index.html',
    '/privacy.html',
    '/terms.html',
    '/disclaimer.html',
    '/manifest.json',
    '/robots.txt',
    '/sitemap.xml',
    '/BACKLINK_STRATEGY.md', // Cache documentation
    '/README.md',
    '/SEO_ENHANCEMENT_SUMMARY.md',
    '/turbotags-roadmap',

    // Favicons and Icons - ENSURE THESE FILES EXIST AT THESE EXACT PATHS
    '/favicon.ico',
    '/favicon.png',
    '/favicon.svg',
    '/favicon_16x16.png',
    '/favicon_192x192.png',
    '/favicon_32x32.png',
    '/favicon_512x512.png',
    '/icons/icon-144x144.svg',
    '/icons/icon-192x192.svg',
    '/icons/icon-512x512.svg',
    '/icons/icon-72x72.svg',
    '/icons/icon-96x96.svg',
    '/icons/instagram-shortcut-96x96.svg',
    '/icons/tiktok-shortcut-96x96.svg',
    '/icons/youtube-shortcut-96x96.svg',

    // Note: External CDN resources (like Tailwind CSS, Font Awesome, Firebase SDK)
    // are generally not cached directly by your service worker due to CORS policies.
    // For true offline functionality with CDNs, you might need a more advanced
    // caching strategy or self-host these resources.
    // For now, we focus on caching your local static assets.
];

// Install event: Caches all static assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('[Service Worker] Caching failed:', error);
            })
    );
    self.skipWaiting(); // Forces the waiting service worker to become the active service worker.
});

// Activate event: Cleans up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Ensure the service worker takes control of clients as soon as it's activated
    return self.clients.claim();
});

// Fetch event: Serves cached content when offline, or fetches from network
self.addEventListener('fetch', (event) => {
    // Only handle GET requests and navigate requests
    if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
        return;
    }

    // Prioritize cache, then network
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached response if found
                if (response) {
                    console.log('[Service Worker] Serving from cache:', event.request.url);
                    return response;
                }
                // If not in cache, fetch from network
                console.log('[Service Worker] Fetching from network:', event.request.url);
                return fetch(event.request)
                    .then(networkResponse => {
                        // Cache new requests as they come in
                        return caches.open(CACHE_NAME).then(cache => {
                            // Only cache valid responses (e.g., 200 OK)
                            if (networkResponse.ok || networkResponse.type === 'opaque') {
                                cache.put(event.request, networkResponse.clone());
                            }
                            return networkResponse;
                        });
                    })
                    .catch(() => {
                        // If network fails, try to serve a fallback page for HTML requests
                        if (event.request.mode === 'navigate') {
                            console.log('[Service Worker] Network failed, navigating to offline fallback.');
                            // You might want a specific offline.html page here
                            // For now, let's just return a generic response or try to get index.html
                            return caches.match('/index.html'); // Or a dedicated offline.html
                        }
                        // For other types of requests (images, CSS etc.), just return a rejected promise
                        // or a generic offline image/CSS if you have them
                        console.warn('[Service Worker] Network and cache failed for:', event.request.url);
                        return new Response('<h1>Offline</h1>', { headers: { 'Content-Type': 'text/html' } });
                    });
            })
    );
});
