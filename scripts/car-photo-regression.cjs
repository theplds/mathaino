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
  assert.ok(/^(CC BY|CC BY-SA|CC0|Attribution only)/.test(p.license),p.brand);
  assert.ok(p.licenseUrl.startsWith('https://creativecommons.org/')||p.licenseUrl.startsWith('https://commons.wikimedia.org/wiki/File:'),p.brand);
  assert.ok(source.includes('commonsLink(current.file)'));
  assert.ok(source.includes('current.author'));
 }
 assert.ok(fs.readFileSync('assets/REAL_CAR_PHOTO_SOURCES.md','utf8').includes('NOT in this release'));
});
test("the child's quiz does not appear unless the image loads",()=>{
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
 assert.ok(html.includes('extra-lessons.js?v=680'));
 assert.ok(html.includes('curriculum-art.js?v=679'));
 assert.ok(html.includes('v0.6.80'));
 assert.ok(sw.includes('mathaino-v0.6.80'));
 assert.ok(sw.includes("'./extra-lessons.js?v=680'"));
 assert.ok(sw.includes("'./extra-lessons.css?v=680'"));
 assert.ok(sw.includes("'./curriculum-art.js?v=679'"));
});
test('every vehicle is colorful and identifiable from a front-oriented photo',()=>{
 const colors=new Set(['red','green','orange','blue','yellow']);
 for(const p of bank){
  assert.ok(colors.has(p.color),p.brand+' must not be black/white');
  assert.ok(p.view.startsWith('front'),p.brand+' should emphasize the visible badge');
  assert.ok(p.model.length>2&&p.author.length>2,p.brand);
 }
 assert.ok(bank.some(p=>p.color==='yellow'));
 assert.ok(bank.some(p=>p.color==='green'));
 assert.ok(bank.some(p=>p.color==='orange'));
});
test('photo enlargement exposes the actual car emblem, not a generated logo',()=>{
 const css=fs.readFileSync('extra-lessons.css','utf8');
 assert.ok(html.includes('id="carZoom"'));
 assert.ok(source.includes("function updateCarZoom()"));
 assert.ok(source.includes("carZoomed=false;updateCarZoom()"));
 assert.ok(source.includes("$x('carZoom').disabled=false"));
 assert.ok(css.includes("#carPictureFrame.is-zoomed #carPicture"));
});
test('car lesson JavaScript still parses',()=>{new Function(source)});
if(process.exitCode)process.exit(process.exitCode);
