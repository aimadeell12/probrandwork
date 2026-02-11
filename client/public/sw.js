const CACHE_NAME = 'paydota-v1';
const APP_SHELL = '/';

self.addEventListener('install', (event) => {
  console.log('PWA: Service Worker installing');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('PWA: Caching app shell');
      return cache.addAll([
        APP_SHELL,
        '/manifest.json',
        '/pwa-icon.png'
      ]).catch((err) => {
        console.log('PWA: Failed to cache app shell, continuing anyway:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('PWA: Service Worker activating');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('PWA: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return new Response(JSON.stringify({ error: 'Offline - network unavailable' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  const isNavigationRequest = request.mode === 'navigate' || 
    (request.method === 'GET' && request.headers.get('accept').includes('text/html'));

  if (isNavigationRequest) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(APP_SHELL).then((cachedResponse) => {
            return cachedResponse || new Response('Offline', { 
              status: 503,
              headers: { 'Content-Type': 'text/html' }
            });
          });
        })
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch((error) => {
          console.log('PWA: Fetch failed, serving from cache:', request.url);
          return cachedResponse;
        });

        return cachedResponse || fetchPromise;
      });
    })
  );
});
