// EC225 Single-Engine Hover Performance OGE (LO) - Service Worker
// Caches the app for full offline use after first load

const CACHE_NAME = 'ec225-se-lo-v7';
const FILES_TO_CACHE = [
  './',
  './index.html'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) {
              // Only remove OUR OWN superseded caches. A blanket
              // "delete everything that isn't mine" would wipe the other
              // tools' caches -- which the landing page's offline download
              // fills on purpose -- so updating one app would silently strip
              // the rest offline. (Fixed 2026-09-02.)
              return key !== CACHE_NAME && key.indexOf('ec225-se-lo-v') === 0;
            })
            .map(function(key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
