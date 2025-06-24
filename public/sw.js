// Simple service worker for caching API responses
const CACHE_NAME = 'paydota-cache-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js'
];

// Cache API responses for better performance
const API_CACHE_NAME = 'paydota-api-cache-v1';
const API_CACHE_DURATION = 1000 * 60 * 2; // 2 minutes

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  
  // Cache API responses
  if (request.url.includes('/api/')) {
    event.respondWith(
      caches.open(API_CACHE_NAME)
        .then(cache => {
          return cache.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                const cachedTime = new Date(cachedResponse.headers.get('sw-cached-time') || 0);
                if (Date.now() - cachedTime.getTime() < API_CACHE_DURATION) {
                  return cachedResponse;
                }
              }
              
              return fetch(request)
                .then(response => {
                  if (response.status === 200) {
                    const responseClone = response.clone();
                    responseClone.headers.set('sw-cached-time', new Date().toISOString());
                    cache.put(request, responseClone);
                  }
                  return response;
                })
                .catch(() => cachedResponse || new Response('Offline', { status: 503 }));
            });
        })
    );
  } else {
    // Regular cache strategy for other resources
    event.respondWith(
      caches.match(request)
        .then(response => response || fetch(request))
    );
  }
});