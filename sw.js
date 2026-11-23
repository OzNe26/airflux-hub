// Service worker Airflux Hub : réseau d'abord, cache en secours (hors ligne)
const CACHE='airflux-hub-v2';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||!r.url.startsWith(self.registration.scope))return;
  e.respondWith((r.mode==='navigate'?fetch(r.url,{cache:'no-cache',credentials:'same-origin'}):fetch(r)).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));return res}).catch(()=>caches.match(r)));
});
