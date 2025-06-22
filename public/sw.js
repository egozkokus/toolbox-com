// public/sw.js

const CACHE_NAME = 'tools4anything-v1';
const RUNTIME_CACHE = 'runtime-cache-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
];

// Cache strategies
const CACHE_STRATEGIES = {
  networkFirst: [
    /\/api\//,
    /\/tools\//,
  ],
  cacheFirst: [
    /\.(?:js|css|woff2?)$/,
    /^https:\/\/fonts\.googleapis\.com/,
    /^https:\/\/fonts\.gstatic\.com/,
  ],
  staleWhileRevalidate: [
    /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  ],
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => 
            cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE
          )
          .map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - implement cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) return;

  // Determine cache strategy
  if (isNetworkFirst(url)) {
    event.respondWith(networkFirst(request));
  } else if (isCacheFirst(url)) {
    event.respondWith(cacheFirst(request));
  } else if (isStaleWhileRevalidate(url)) {
    event.respondWith(staleWhileRevalidate(request));
  } else {
    // Default to network first
    event.respondWith(networkFirst(request));
  }
});

// Cache strategies implementation
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return offline page if available
    return caches.match('/offline.html') || new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Network error', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(RUNTIME_CACHE);
      cache.then((cache) => cache.put(request, networkResponse.clone()));
    }
    return networkResponse;
  });

  return cachedResponse || fetchPromise;
}

// Helper functions
function isNetworkFirst(url) {
  return CACHE_STRATEGIES.networkFirst.some(pattern => pattern.test(url.href));
}

function isCacheFirst(url) {
  return CACHE_STRATEGIES.cacheFirst.some(pattern => pattern.test(url.href));
}

function isStaleWhileRevalidate(url) {
  return CACHE_STRATEGIES.staleWhileRevalidate.some(pattern => pattern.test(url.href));
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-tools') {
    event.waitUntil(syncOfflineData());
  }
});

async function syncOfflineData() {
  // Implement offline data sync logic here
  console.log('Syncing offline data...');
}

// Push notifications (if needed)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/pwa-192x192.png',
    badge: '/badge-72x72.png',
  };

  event.waitUntil(
    self.registration.showNotification('Tools4Anything', options)
  );
});

// Message handling
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE)
        .then((cache) => cache.addAll(event.data.urls))
    );
  }
});