'use strict';
/* External availability is advisory: Wikimedia can rate limit CI requests.
   The child's quiz already hides answers when an image fails on their device. */
const fs=require('node:fs');
const source=fs.readFileSync('extra-lessons.js','utf8');
const bank=JSON.parse(source.match(/^const photoBank=(\[.*\]);$/m)[1]);
const uagent='MathainoPhotoReview/0.6.81 (educational resource URL check)';
const original=url=>url.replace('/wikipedia/commons/thumb/','/wikipedia/commons/').replace(/\/960px-[^/]+$/,'');
async function check(url){
 try{
  const result=await fetch(url,{method:'HEAD',redirect:'follow',headers:{'User-Agent':uagent},signal:AbortSignal.timeout(9000)});
  return {status:result.status,ok:result.ok};
 }catch(e){return {status:'network',ok:false,error:String(e.message).slice(0,110)}}
}
async function run(){
 const observations=await Promise.all(bank.map(async p=>{
  let thumb=await check(p.url);
  const full=thumb.ok?null:await check(original(p.url));
  let status=thumb.ok?'available':full?.ok?'original-available':
    thumb.status===404&&full?.status===404?'missing':'unverified';
  console.log(p.brand+': '+status+' [thumbnail='+thumb.status+(full?', original='+full.status:'')+']');
  return {brand:p.brand,status}
 }));
 const missing=observations.filter(x=>x.status==='missing');
 const ok=observations.filter(x=>x.status==='available'||x.status==='original-available');
 const unverified=observations.filter(x=>x.status==='unverified');
 console.log('Photo URLs: '+ok.length+' available, '+unverified.length+' inconclusive, '+missing.length+' missing.');
 if(missing.length){console.error('Definite 404 sources: '+missing.map(x=>x.brand).join(', '));process.exitCode=1}
 else if(unverified.length)console.warn('CAUTION: image visibility on device is not guaranteed by remote CI.');
}
run().catch(e=>{console.warn('Photo availability check inconclusive: '+e.message)});
