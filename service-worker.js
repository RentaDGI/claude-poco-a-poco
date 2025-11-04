/**
 * SERVICE WORKER - Portal Estiba VLC
 * Permite que la app funcione offline y se cargue más rápido
 */

const CACHE_NAME = 'estiba-vlc-v1';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './sheets.js',
  './manifest.json',
  'https://i.imgur.com/7F1BWQ2.jpeg', // Logo principal
  'https://cdn.tailwindcss.com', // Tailwind CSS
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
];

// Instalación - cachear recursos estáticos
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Cacheando recursos');
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })))
          .catch(err => {
            console.warn('[Service Worker] Error cacheando algunos recursos:', err);
            // No fallar la instalación si algunos recursos no se pueden cachear
          });
      })
  );
  self.skipWaiting();
});

// Activación - limpiar cachés antiguos
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch - estrategia: Network First, fallback a Cache (para datos dinámicos)
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Para Google Sheets: siempre intentar red primero, fallback a cache
  if (url.hostname.includes('docs.google.com') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('script.google.com')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Si la respuesta es exitosa, cachearla
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Si falla la red, intentar desde cache
          return caches.match(request);
        })
    );
    return;
  }

  // Para recursos estáticos: Cache First, fallback a Network
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Encontrado en cache, pero actualizar en background
          fetch(request)
            .then(networkResponse => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(request, networkResponse);
                });
              }
            })
            .catch(() => {
              // Ignorar errores de red en background
            });
          return cachedResponse;
        }

        // No está en cache, ir a la red
        return fetch(request)
          .then(networkResponse => {
            // Cachear si es exitoso
            if (networkResponse && networkResponse.status === 200 && request.method === 'GET') {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(error => {
            console.warn('[Service Worker] Error fetching:', request.url, error);
            // Podrías retornar una página offline personalizada aquí
            throw error;
          });
      })
  );
});

// Mensaje para forzar actualización
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
