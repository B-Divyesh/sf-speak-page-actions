const CACHE = 'speak-page-actions-v4';
const SHELL = ['/', '/demo', '/privacy', '/terms', '/art/hero.webp'];
async function precache() {
  const cache = await caches.open(CACHE);
  await cache.addAll(SHELL);
  const html = await (await fetch('/')).text();
  const assets = [...html.matchAll(/(?:src|href)="([^" ]*\/assets\/[^" ]+)"/g)].map((match) => match[1]);
  await cache.addAll(assets);
}
self.addEventListener('install', (event) => event.waitUntil(precache().then(() => self.skipWaiting())));
self.addEventListener('activate', (event) => event.waitUntil(
  caches.keys().then((keys) => Promise.all(keys
    .filter((key) => key.startsWith('speak-page-actions-') && key !== CACHE)
    .map((key) => caches.delete(key))))
    .then(() => self.clients.claim())
));
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const isNavigation = event.request.mode === 'navigate';
  const fromNetwork = () => fetch(event.request).then((response) => { const copy = response.clone(); caches.open(CACHE).then((cache) => cache.put(event.request, copy)); return response; });
  // Navigations are network-first so a newly activated worker serves the
  // current shell. Do not cache navigation URLs: checkout returns include a
  // license query value, and that value must never enter Cache Storage.
  event.respondWith(isNavigation
    ? fetch(event.request).catch(() => caches.match(event.request, { ignoreSearch: true }).then((cached) => cached || caches.match('/')))
    : caches.match(event.request).then((cached) => cached || fromNetwork().catch(() => caches.match('/'))));
});
