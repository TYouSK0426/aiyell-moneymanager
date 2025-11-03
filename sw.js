const CACHE_NAME = 'money-manager-jp-v1';
const CORE_ASSETS = ['./', './index.html', './manifest.webmanifest'];
self.addEventListener('install', (event) => { event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', (event) => { event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null))))); self.clients.claim(); });
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(fetch(req).then((res) => { const resClone = res.clone(); caches.open(CACHE_NAME).then((c) => c.put(req, resClone)); return res; }).catch(() => caches.match(req).then((res) => res || caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(req).then((cached) => { if (cached) return cached; return fetch(req).then((res) => { const resClone = res.clone(); caches.open(CACHE_NAME).then((c) => c.put(req, resClone)); return res; }).catch(() => cached); }));
});
