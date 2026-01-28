// Service Worker для United Crypto Boys
// Агрессивное кэширование для предотвращения повторных загрузок
const CACHE_NAME = 'ucb-v3';
const STATIC_CACHE = 'ucb-static-v3';
const IMAGE_CACHE = 'ucb-images-v3';

// Статические ресурсы для предзагрузки
const STATIC_URLS = [
  '/',
  '/index.html',
  '/dist/viewer.css',
  '/dist/viewer.js',
  '/dist/config.js',
  '/server-data.json',
  '/manifest.json',
  '/favicon.png',
  '/img/664b1fa9319de2006fe1d050/favicon-16.png',
  '/img/664b1fa9319de2006fe1d050/favicon-32.png',
  '/img/664b1fa9319de2006fe1d050/favicon-72.png',
  '/img/664b1fa9319de2006fe1d050/favicon-144.png',
  '/img/664b1fa9319de2006fe1d050/favicon-192.png',
  '/img/664b1fa9319de2006fe1d050/favicon-512.png'
];

// Типы файлов для кэширования
const CACHEABLE_EXTENSIONS = [
  '.js', '.css', '.json',
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico',
  '.woff', '.woff2', '.ttf', '.eot',
  '.mp4', '.webm'
];

// Проверка, нужно ли кэшировать запрос
function shouldCache(url) {
  const urlObj = new URL(url);
  const path = urlObj.pathname.toLowerCase();
  
  // Кэшируем все локальные ресурсы
  if (urlObj.origin === self.location.origin) {
    return true;
  }
  
  // Кэшируем CDN ресурсы
  if (urlObj.hostname.includes('rmcdn') || 
      urlObj.hostname.includes('googleapis') ||
      urlObj.hostname.includes('gstatic')) {
    return true;
  }
  
  return CACHEABLE_EXTENSIONS.some(ext => path.endsWith(ext));
}

// Определение типа кэша для ресурса
function getCacheForRequest(url) {
  const path = new URL(url).pathname.toLowerCase();
  
  if (path.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/)) {
    return IMAGE_CACHE;
  }
  
  return STATIC_CACHE;
}

// Установка Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_URLS).catch(() => {})),
      caches.open(IMAGE_CACHE)
    ]).then(() => self.skipWaiting())
  );
});

// Активация и очистка старых кэшей
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (![CACHE_NAME, STATIC_CACHE, IMAGE_CACHE].includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Обработка запросов - Cache First для изображений и статики
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;
  
  // Игнорируем не-GET запросы и внешние API
  if (request.method !== 'GET') return;
  
  // Проверяем, нужно ли кэшировать
  if (!shouldCache(url)) return;
  
  const cacheName = getCacheForRequest(url);
  
  event.respondWith(
    caches.open(cacheName).then(cache => {
      return cache.match(request).then(cachedResponse => {
        if (cachedResponse) {
          // Возвращаем из кэша, обновляем в фоне (stale-while-revalidate)
          const fetchPromise = fetch(request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);
          
          return cachedResponse;
        }
        
        // Нет в кэше - загружаем и кэшируем
        return fetch(request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Офлайн fallback
          if (request.destination === 'document') {
            return caches.match('/');
          }
          return new Response('', { status: 503 });
        });
      });
    })
  );
});

// Сообщение для принудительного кэширования
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls;
    event.waitUntil(
      caches.open(IMAGE_CACHE).then(cache => {
        return Promise.all(
          urls.map(url => {
            return fetch(url).then(response => {
              if (response.ok) {
                return cache.put(url, response);
              }
            }).catch(() => {});
          })
        );
      })
    );
  }
});
