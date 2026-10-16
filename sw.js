const CACHE = "greenfarm-v28";
const CORE = [
  "./","./index.html","./dashboard.html","./crops.html","./livestock.html","./activities.html",
  "./analytics.html","./reports.html","./farm.html","./advanced.html","./planner.html","./admin.html","./auth.html",
  "./manifest.webmanifest","./assets/demo-seed.js?v=greenfarm-v28","./assets/greenfarm.css?v=greenfarm-v26","./assets/app-ui.css","./assets/app-ui.css?v=greenfarm-v26",
  "./assets/app-ui.js","./assets/app-ui.js?v=greenfarm-v26","./assets/app-ui.js?v=greenfarm-v28","./assets/module-views.css?v=greenfarm-v26",
  "./assets/module-views.js?v=greenfarm-v26","./assets/dashboard.js?v=greenfarm-v26",
  "./assets/farm.js?v=greenfarm-v26","./assets/advanced.js?v=greenfarm-v26",
  "./assets/farm.css","./assets/advanced.css","./assets/planner.css?v=greenfarm-v26","./assets/planner.js?v=greenfarm-v28","./assets/greenfarm-logo.svg",
  "./assets/greenfarm-sunrise-header.webp?v=greenfarm-v26","./assets/greenfarm-3d-farm.png?v=greenfarm-v26"
];
async function cacheSuccessful(cache, request, response) {
  if (response && response.ok && response.type !== "opaque") {
    try { await cache.put(request, response.clone()); } catch (_) {}
  }
  return response;
}
self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(CORE.map(async asset => {
      try {
        const request = new Request(asset, {cache:"reload"});
        const response = await fetch(request);
        if (response.ok && response.type !== "opaque") await cache.put(request, response);
      } catch (_) {}
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith("greenfarm-") && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  const isNavigation = request.mode === "navigate";
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request);
    if (isNavigation) {
      try {
        const response = await fetch(request);
        await cacheSuccessful(cache, request, response);
        return response;
      } catch (_) {
        return cached || await cache.match("./index.html") || new Response("GreenFarm is offline and this page is not available yet.", {status:503,headers:{"Content-Type":"text/plain;charset=utf-8"}});
      }
    }
    if (cached) {
      event.waitUntil(fetch(request).then(response => cacheSuccessful(cache, request, response)).catch(() => {}));
      return cached;
    }
    try {
      const response = await fetch(request);
      await cacheSuccessful(cache, request, response);
      return response;
    } catch (_) {
      return new Response("This GreenFarm resource is unavailable offline.", {status:503,headers:{"Content-Type":"text/plain;charset=utf-8"}});
    }
  })());
});