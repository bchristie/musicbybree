// Service Worker for Vocal Artist Portfolio PWA
// Auto-generated with version: __VERSION__

const VERSION = '__VERSION__';
const CACHE_NAME = `vocal-portfolio-${VERSION}`;

// Assets to cache on install
const STATIC_CACHE = [
  '/',
  '/manifest.json',
  '/repertoire',
  '/performances',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Install event, version:', VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_CACHE).catch((err) => {
        console.error('[SW] Failed to cache some assets:', err);
      });
    }).then(() => {
      // Force the waiting service worker to become active
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event, version:', VERSION);
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName.startsWith('vocal-portfolio-')) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - network first, fall back to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and other protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Skip admin routes and API calls (always fetch fresh)
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api')) {
    event.respondWith(fetch(request));
    return;
  }

  // Network first strategy for all other requests
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone the response before caching
        const responseToCache = response.clone();
        
        // Cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[SW] Serving from cache:', url.pathname);
            return cachedResponse;
          }
          
          // Return a basic offline page for navigation requests
          if (request.mode === 'navigate') {
            return new Response(
              `<!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Offline - __SITE_NAME__</title>
                  <style>
                    body {
                      font-family: system-ui, -apple-system, sans-serif;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      min-height: 100vh;
                      margin: 0;
                      background: #f9fafb;
                      color: #1f2937;
                      text-align: center;
                      padding: 1rem;
                    }
                    h1 { margin: 0 0 0.5rem; }
                    p { color: #6b7280; margin: 0; }
                  </style>
                </head>
                <body>
                  <div>
                    <h1>You're offline</h1>
                    <p>Please check your internet connection</p>
                  </div>
                </body>
              </html>`,
              {
                headers: { 'Content-Type': 'text/html' },
              }
            );
          }
          
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// Listen for messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
