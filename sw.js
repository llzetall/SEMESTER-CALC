const CACHE = "semcalc-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/data/defaults.js",
  "/data/gi.js",
  "/data/automatique.js",
  "/data/specialties.js",
  "/manifest.webmanifest",
  "/pwa.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
