const CACHE = 'mmn-portfolio-v1';
const ASSETS = ['./','./index.html','./styles.css','./script.js','./manifest.json','./icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(ASSETS.map(u => fetch(u, { cache: 'reload' }).then(r => r.ok && c.put(u, r)).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('./index.html')));
    return;
  }
  if (url.origin === self.location.origin) {
    e.respondWith(caches.match(req).then(c => c || fetch(req).then(r => { if (r.ok) caches.open(CACHE).then(cache => cache.put(req, r.clone())); return r; })));
    return;
  }
  e.respondWith(fetch(req).catch(() => caches.match(req)));
});
