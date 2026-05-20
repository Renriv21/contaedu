/* =========================================
   ContaEdu — Service Worker
   Versión: 1.0.0
   Estrategia: Cache First para assets,
               Network First para HTML
   ========================================= */

const CACHE_NAME = 'contaedu-v1';

const ASSETS_ESTATICOS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/utils.js',
  '/js/plan-cuentas.js',
  '/js/asientos.js',
  '/js/iva.js',
  '/js/conciliacion.js',
  '/js/app.js',
  '/manifest.json',
];

/* --- INSTALL: cachea todos los assets --- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cacheando assets estáticos');
      return cache.addAll(ASSETS_ESTATICOS);
    })
  );
  self.skipWaiting();
});

/* --- ACTIVATE: limpia caches viejos --- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log('[SW] Eliminando cache viejo:', key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

/* --- FETCH: Cache First para assets locales --- */
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Recursos externos (fonts, CDN): Network First
  if (!url.origin.includes(self.location.origin)) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Assets locales: Cache First
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200) return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
