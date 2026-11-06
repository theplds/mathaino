'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const source=fs.readFileSync('extra-lessons.js','utf8'),sw=fs.readFileSync('sw.js','utf8'),html=fs.readFileSync('index.html','utf8');
const match=source.match(/^const photoBank=(\[.*\]);$/m);
assert.ok(match,'static photo bank should be easy to audit');
const bank=JSON.parse(match[1]);
function test(name,fn){try{fn();console.log('PASS',name)}catch(e){console.error('FAIL',name,e.message);process.exitCode=1}}
test('ten distinct authentic brand/model photo records',()=>{
 assert.equal(bank.length,10);
 const expected=['Ferrari','Lamborghini','Porsche','BMW','Mercedes-Benz','Audi','Nissan','Ford','Chevrolet','Tesla'];
 assert.deepEqual(bank.map(x=>x.brand),expected);
 assert.equal(new Set(bank.map(x=>x.file)).size,10);
 assert.equal(new Set(bank.map(x=>x.localName)).size,10);
});
test('thumbnail paths built using Wikimedia canonical source filenames, not redirects',()=>{
 for(const p of bank){
  const file=p.file.replaceAll(' ','_');
  const md5=crypto.createHash('md5').update(file,'utf8').digest('hex');
  const uri=encodeURIComponent(file);
  // JS encodeURIComponent intentionally leaves parentheses unescaped.
  const expected='https://upload.wikimedia.org/wikipedia/commons/thumb/'+md5[0]+'/'+md5.slice(0,2)+'/'+uri+'/960px-'+uri;
  assert.equal(p.url,expected,p.brand);
  assert.equal(p.localName.endsWith('.jpg'),true,p.brand);
 }
 assert.ok(!bank.some(x=>x.url.includes('Special:FilePath')),'direct URLs must be first choice');
});
test('every photo has explicit author, file source and valid Creative Commons licence',()=>{
 for(const p of bank){
  assert.ok(p.author&&p.model&&p.file,p.brand);
  assert.ok(/^CC (BY|BY-SA|0)/.test(p.license),p.brand);
  assert.ok(p.licenseUrl.startsWith('https://creativecommons.org/'),p.brand);
  assert.ok(source.includes('commonsLink(current.file)'));
  assert.ok(source.includes('current.author'));
 }
 assert.ok(fs.readFileSync('assets/REAL_CAR_PHOTO_SOURCES.md','utf8').includes('NOT in this release'));
});
test('the child's quiz does not appear unless the image loads',()=>{
 const code=source.slice(source.indexOf('function nextCar(){'),source.indexOf('function openCars()'));
 assert.ok(code.includes("$x('carAnswers').replaceChildren();"),'answers initially cleared');
 assert.ok(code.includes('img.onload=()=>{'));
 assert.ok(code.indexOf('carAnswersFor(current)')>code.indexOf('img.onload=()=>{'));
 assert.ok(code.includes('img.onerror=()=>{'));
 assert.ok(code.includes('photoCandidates(current)'));
 assert.ok(code.includes('if(token!==carLoadToken)return'),'stale image callbacks excluded');
 assert.ok(code.includes('Παράλειψη'),'user may skip broken image');
});
test('current app CSP and versioned cache permit real thumbnails',()=>{
 assert.ok(html.includes('https://upload.wikimedia.org'),'image CSP must allow actual Wikimedia photos');
 assert.ok(html.includes('extra-lessons.js?v=679'));
 assert.ok(html.includes('curriculum-art.js?v=679'));
 assert.ok(html.includes('v0.6.79'));
 assert.ok(sw.includes('mathaino-v0.6.79'));
 assert.ok(sw.includes("'./extra-lessons.js?v=679'"));
 assert.ok(sw.includes("'./curriculum-art.js?v=679'"));
});
test('car lesson JavaScript still parses',()=>{new Function(source)});
if(process.exitCode)process.exit(process.exitCode);
