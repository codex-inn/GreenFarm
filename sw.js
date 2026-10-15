const CACHE='greenfarm-v12';
const CORE=['./','./index.html','./dashboard.html','./farm.html','./advanced.html','./crops.html','./livestock.html','./activities.html','./analytics.html','./reports.html','./admin.html','./auth.html','./assets/greenfarm.css','./assets/app-ui.css','./assets/app-ui.js','./assets/app-ui.css?v=greenfarm-v12','./assets/app-ui.js?v=greenfarm-v12','./assets/greenfarm-field-photo.png?v=greenfarm-v12','./assets/farm.css','./assets/farm.js','./assets/advanced.css','./assets/advanced.js','./assets/greenfarm-logo.svg','./manifest.webmanifest'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE.map(asset=>new Request(asset,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('greenfarm-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
    const copy=response.clone();
    caches.open(CACHE).then(cache=>cache.put(event.request,copy));
    return response;
  }).catch(()=>caches.match('./index.html'))));
});