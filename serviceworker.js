const cacheName = 'stem-learning-v1';
const assets = [
  '/',
  '/index.html',
  '/style.css',
  '/first.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('[Service Worker] Caching assets');
      return cache.addAll(assets);
    })
  );
  self.skipWaiting(); 
});

self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== cacheName).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); 
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response; 
      }
      return fetch(event.request).then(networkResponse => {
   
        return caches.open(cacheName).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    }).catch(() => {
      
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});
