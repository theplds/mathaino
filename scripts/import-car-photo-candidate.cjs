'use strict';
const fs=require('fs'),crypto=require('crypto');
const id=process.argv[2];const list=require('./car-photo-candidates.json');
const entry=list.find(x=>x.id===id);if(!entry)throw Error('Unknown candidate: '+id);
const name=entry.file.replaceAll(' ','_'),hash=crypto.createHash('md5').update(name,'utf8').digest('hex');
const encoded=encodeURIComponent(name);
const urls=[
 'https://upload.wikimedia.org/wikipedia/commons/thumb/'+hash[0]+'/'+hash.slice(0,2)+'/'+encoded+'/960px-'+encoded,
 'https://upload.wikimedia.org/wikipedia/commons/'+hash[0]+'/'+hash.slice(0,2)+'/'+encoded,
 'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(entry.file)+'?width=960'
];
async function fetchPhoto(url){
 const res=await fetch(url,{headers:{'User-Agent':'Mathaino licensed-car-photo-review / 0.6.81','Referer':'https://commons.wikimedia.org/'},redirect:'follow',signal:AbortSignal.timeout(23000)});
 if(!res.ok)throw Error('HTTP '+res.status);
 const bytes=Buffer.from(await res.arrayBuffer());
 if(bytes.length<10000||bytes[0]!==255||bytes[1]!==216||bytes[2]!==255)throw Error('Not JPEG or too small');
 if(bytes.length>15000000)throw Error('Too large');
 return bytes
}
(async()=>{
 let content=null,failures=[];
 for(let n=0;n<6&&!content;n++){
  try{content=await fetchPhoto(urls[Math.min(n,urls.length-1)])}catch(e){
   failures.push(e.message);
   await new Promise(r=>setTimeout(r,2200+n*2000))
  }
 }
 if(!content)throw Error(id+' failed: '+failures.join(', '));
 fs.mkdirSync('car-staging',{recursive:true});
 fs.writeFileSync('car-staging/'+id+'.jpg',content);
 console.log(id+' '+entry.file+' '+content.length+' bytes; '+entry.license);
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
