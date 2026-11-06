'use strict';
/* One-off licensed Commons image import. Executed on GitHub-hosted runners only.
   Independent work by credited photographers; sources are recorded in the repo. */
const fs=require('node:fs');
const photoBank=JSON.parse(fs.readFileSync('extra-lessons.js','utf8').match(/^const photoBank=(\[.*\]);$/m)[1]);
const brand=process.argv[2],photo=photoBank.find(x=>x.brand===brand);
if(!photo)throw Error('Unknown photo brand');
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const original=url=>url.replace('/wikipedia/commons/thumb/','/wikipedia/commons/').replace(/\/960px-[^/]+$/,'');
const urls=[photo.url, original(photo.url),'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(photo.file)+'?width=960'];
async function download(url){
 const response=await fetch(url,{headers:{'User-Agent':'Mathaino educational app image importer (licensed CC photo attribution)','Referer':'https://commons.wikimedia.org/'},redirect:'follow',signal:AbortSignal.timeout(25000)});
 if(!response.ok)throw Error('HTTP '+response.status);
 const content=Buffer.from(await response.arrayBuffer());
 if(content.length<15000||content[0]!==255||content[1]!==216||content[2]!==255)throw Error('Not a valid JPEG');
 if(content.length>20000000)throw Error('JPEG exceeds 20 MB');
 return content
}
(async()=>{
 let content=null;let details=[];
 for(let attempt=0;attempt<6&&!content;attempt++){
  const url=urls[Math.min(attempt,urls.length-1)];
  try{content=await download(url)}catch(e){details.push(url.split('/').slice(0,3).join('/')+': '+e.message);await wait(3500+attempt*4000)}
 }
 if(!content)throw Error('Unable to fetch '+brand+': '+details.join('; '));
 fs.mkdirSync('car-staging',{recursive:true});
 const filename='car-staging/'+photo.localName;
 fs.writeFileSync(filename,content);
 console.log('Imported '+brand+' '+photo.localName+' ('+content.length+' bytes) from '+photo.file);
})().catch(e=>{console.error(e.message);process.exitCode=1});
