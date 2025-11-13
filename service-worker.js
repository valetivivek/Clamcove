/**
 * Service Worker - PWA offline support
 * Caches UI assets and ambience audio for offline use
 */

const CACHE_NAME = 'lofi-zen-lab-v1';
const STATIC_CACHE = 'static-v1';
const AUDIO_CACHE = 'audio-v1';

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/main.js',
    '/js/store.js',
    '/js/player.js',
    '/js/ambience.js',
    '/js/timer.js',
    '/js/notes.js',
    '/js/todos.js',
    '/js/stats.js',
    '/js/settings.js',
    '/js/utils.js',
    '/manifest.json',
    '/data/playlists.json',
    '/assets/img/favicon.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch((error) => {
                console.warn('Failed to cache some assets:', error);
            });
        })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== STATIC_CACHE && name !== AUDIO_CACHE)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip YouTube and external APIs
    if (url.hostname.includes('youtube.com') || 
        url.hostname.includes('googleapis.com') ||
        url.hostname.includes('googlevideo.com')) {
        return; // Let browser handle these
    }

    // Skip analytics if enabled
    if (url.hostname.includes('goatcounter.com') || 
        url.hostname.includes('plausible.io')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached version if available
            if (response) {
                return response;
            }

            // Otherwise fetch from network
            return fetch(event.request)
                .then((response) => {
                    // Don't cache non-successful responses
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    // Cache audio files separately
                    if (event.request.url.includes('/assets/audio/')) {
                        caches.open(AUDIO_CACHE).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    } else {
                        // Cache other assets
                        caches.open(STATIC_CACHE).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }

                    return response;
                })
                .catch(() => {
                    // Offline fallback
                    if (event.request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                });
        })
    );
});

// Background sync for future features
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-stats') {
        event.waitUntil(syncStats());
    }
});

async function syncStats() {
    // Placeholder for future serverless sync
    console.log('Background sync triggered');
}

