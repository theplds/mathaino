/* v0.6.68: Cache public same-origin app assets ONLY, never auth/API data. */
const CACHE='mathaino-v0.6.70';
const FILES=['./','./index.html','./app-main.js?v=668','./app-base.css?v=668','./reset.html','./reset-main.js?v=668','./reset-style.css?v=668','./energy-art.js?v=637','./energy-art.css?v=637','./history-player.css?v=639','./avatar-art.js?v=658','./avatar-art.css?v=660','./curriculum-art.js?v=656','./curriculum-art.css?v=643','./extra-lessons.js?v=646','./extra-lessons.css?v=646','./chess-rules.js?v=647','./chess-rules.css?v=647','./app-workbook-25.css?v=648','./app-workbook-25.js?v=648','./spelling-book-a1.js?v=667','./worksheet-export.js?v=667','./worksheet-export.css?v=661','./worksheet-print.html?v=667','./worksheet-print.js?v=667','./spelling-a1.js?v=667','./spelling-a1.css?v=664','./warm-workbook.css?v=664','./warm-art.js?v=655','./crayon-assets.js?v=656','./assets/crayon-v1-atlas.webp','./test-pack.js?v=667','./lessons-grade-b.js?v=666','./lessons-grade-d.js?v=666','./lessons-grade-e.js?v=666','./lessons-writing.js?v=666','./curriculum-lessons.js?v=667','./curriculum-lessons.css?v=666','./sketch-art.js?v=667','./art-style.js?v=667','./art-style.css?v=667','./question-dock.js?v=670','./question-dock.css?v=670','./art-audit.html','./avatar-crayon-portraits.jpg','./manifest.webmanifest','./mathaino-approved-192.png','./mathaino-approved-512-1.png'];
const ASSET_PATHS=new Set(FILES.map(path=>new URL(path,self.registration.scope).pathname));
function permitted(request){
 if(request.method!=='GET')return false;
 const url=new URL(request.url);
 return url.origin===self.location.origin&&ASSET_PATHS.has(url.pathname);
}
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)));
 self.skipWaiting();
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k.startsWith('mathaino-')&&k!==CACHE).map(k=>caches.delete(k)));
  // Historical caches could contain authenticated API data; remove any item
  // not on the strictly static allowlist, even if stored under current version.
  const cache=await caches.open(CACHE);
  for(const req of await cache.keys())if(!permitted(req))await cache.delete(req);
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(!permitted(request))return; // API, auth and other cross-origin requests bypass SW.
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  try{
   const response=await fetch(request);
   if(response.ok&&response.type==='basic')await cache.put(request,response.clone());
   return response;
  }catch(err){
   const saved=await cache.match(request,{ignoreSearch:true});
   if(saved)return saved;
   throw err;
  }
 })());
});
self.addEventListener('message',event=>{
 if(event.data?.type!=='CLEAR_PRIVATE_DATA')return;
 event.waitUntil((async()=>{
  const names=await caches.keys();
  await Promise.all(names.filter(name=>name.startsWith('mathaino-')).map(name=>caches.delete(name)));
 })());
});