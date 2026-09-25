/* Offline support: the agenda and your starred sessions work without signal at the venue. */
const CACHE = "ccd-udaipur-v3";
const CORE = ["./", "index.html", "coc.html", "404.html", "css/style.css", "css/premium.css", "js/data.js", "js/scene.js", "js/chetak.js", "js/mewar.js", "js/places.js", "js/pass.js", "js/main.js", "js/water.js", "js/fx.js", "js/bot.js",
  "assets/icon.svg", "assets/img/icon-192.png", "assets/img/og-image.jpg", "manifest.webmanifest"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// Network first for our own files (so edits show up), cache as fallback. Fonts: cache first.
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (url.origin === location.origin) {
    e.respondWith(fetch(e.request).then((r) => {
      const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r;
    }).catch(() => caches.match(e.request).then((r) => r || caches.match("index.html"))));
  } else if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request).then((res) => {
      const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return res;
    })));
  }
});
