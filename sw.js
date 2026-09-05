const CACHE_NAME = "spoolmate-v381-unambiguous-valve-counts";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=381",
  "./ebro-hp112-bolting.js?v=381",
  "./ebro-hp114-bolting.js?v=381",
  "./app.js?v=381",
  "./manifest.webmanifest"
];
const OPTIONAL_ASSETS = [
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/spoolmate-mark.png",
  "./icons/spoolmate-logo.png"
];
const STATIC_CDN_ORIGINS = new Set([
  "https://cdn.jsdelivr.net"
]);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        await cache.addAll(APP_SHELL);
        await Promise.allSettled(OPTIONAL_ASSETS.map((asset) => cache.add(asset)));
      })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (request.destination === "video" || request.headers.has("range")) {
    event.respondWith(fetch(request));
    return;
  }
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, "./index.html"));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request, false));
    return;
  }

  // Never put authenticated API, Auth or Storage responses into Cache Storage.
  // Cache keys do not include the Authorization header, so doing so could show
  // one signed-in user's stale response to the next user on a shared device.
  if (STATIC_CDN_ORIGINS.has(url.origin)) {
    event.respondWith(staleWhileRevalidate(request, false));
    return;
  }

  event.respondWith(fetch(request));
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

async function networkFirst(request, fallbackUrl) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request, { ignoreSearch: true })) ||
      (await cache.match(fallbackUrl, { ignoreSearch: true }));
  }
}

async function staleWhileRevalidate(request, ignoreSearch) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request, { ignoreSearch });
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response && (response.ok || response.type === "opaque")) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached || Response.error());

  return cached || fetchPromise;
}
