// ══ STILLPOINT SERVICE WORKER ══
// Bump VERSION any time you update index.html so players get the new file.
// Format: 'v' + YYYY-MM-DD is easy to remember.

var APP_PREFIX = 'stillpoint_';
var VERSION    = 'v2025-04-11';
var CACHE_NAME = APP_PREFIX + VERSION;

// Files to cache for offline use.
// Because this is a single-file app, we only need index.html.
// Add any extra assets here if you split CSS/JS into separate files later.
var URLS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
];

// ── INSTALL: cache all listed files ──
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(URLS);
    })
  );
  // Activate immediately without waiting for old SW to be released
  self.skipWaiting();
});

// ── ACTIVATE: delete old caches from previous versions ──
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys
          .filter(function(k) { return k.startsWith(APP_PREFIX) && k !== CACHE_NAME; })
          .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      // Take control of all open clients immediately
      return self.clients.claim();
    })
  );
});

// ── FETCH: serve from cache, fall back to network ──
// Strategy: Cache-first for our own files, network-first for everything else
// (fonts, external resources).
self.addEventListener('fetch', function(e) {
  // Skip non-GET requests
  if (e.request.method !== 'GET') return;

  var url = new URL(e.request.url);

  // For Google Fonts and other CDN resources: network-first, cache as fallback
  if (url.hostname !== self.location.hostname) {
    e.respondWith(
      fetch(e.request)
        .then(function(response) {
          // Cache a copy of external resources too
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) { cache.put(e.request, clone); });
          return response;
        })
        .catch(function() {
          return caches.match(e.request);
        })
    );
    return;
  }

  // For our own files: cache-first
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(response) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) { cache.put(e.request, clone); });
        return response;
      });
    })
  );
});
