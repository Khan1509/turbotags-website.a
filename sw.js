// sw.js - Service Worker for TurboTags PWA

const CACHE_NAME = 'turbotags-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css', // Assuming you will eventually externalize CSS
    '/script.js',  // Assuming you will eventually externalize JS
    '/manifest.json',
    '/offline.html',
    '/favicon.ico',
    '/favicon.svg',
    '/favicon.png',
    '/favicon_16x16.png',
    '/favicon_32x32.png',
    '/favicon_192x192.png',
    '/favicon_512x512.png',
    '/apple-touch-icon.png',
    // Icons for manifest - ensure these paths are correct relative to root
    '/icons/icon-72x72.svg',
    '/icons/icon-96x96.svg',
    '/icons/icon-144x144.svg',
    '/icons/icon-192x192.svg',
    '/icons/icon-512x512.svg',
    '/icons/youtube-shortcut-96x96.svg',
    '/icons/instagram-shortcut-96x96.svg',
    '/icons/tiktok-shortcut-96x96.svg',
    // External CDN resources (consider caching strategies for these)
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
    'https://fonts.gstatic.com/s/inter/v13/UcC73FpYVgNFn8ImR-H_zQ.woff2',
    'https://www.googletagmanager.com/gtag/js?id=G-MP18L879VZ'
];

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('[Service Worker] Cache.addAll failed:', error);
            })
    );
});

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
    // Ensure the service worker takes control of clients immediately
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached response if found
                if (response) {
                    return response;
                }
                // If not in cache, fetch from network
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Check if we received a valid response
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        // For API calls, don't cache them if they are not successful
                        if (event.request.url.includes('/api/')) {
                            return networkResponse;
                        }

                        // Clone the response because it's a stream and can only be consumed once
                        const responseToCache = networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    })
                    .catch(() => {
                        // If network fails, try to return offline page for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match('/offline.html');
                        }
                        // For other requests, return a generic fallback or just reject
                        return new Response('Network error or content not cached.', { status: 503, statusText: 'Service Unavailable' });
                    });
            })
    );
});

// Handle push notifications (if implemented)
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push Received.');
    const data = event.data.json();
    const title = data.title || 'TurboTags Notification';
    const options = {
        body: data.body || 'You have a new update from TurboTags!',
        icon: data.icon || '/icons/icon-192x192.svg',
        badge: data.badge || '/icons/icon-72x72.svg',
        data: data.url ? { url: data.url } : {},
        actions: data.actions || []
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification click Received.');
    event.notification.close(); // Close the notification

    // Open the URL specified in the notification data, or the root URL
    const urlToOpen = event.notification.data.url || '/';
    event.waitUntil(
        clients.openWindow(urlToOpen)
    );
});
