'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const read=f=>fs.readFileSync(f,'utf8'),js=read('extra-lessons.js'),html=read('index.html'),css=read('extra-lessons.css'),sw=read('sw.js');
const badges=JSON.parse(js.match(/^const badgeBank=(\[.*\]);$/m)[1]);
const expected=['Ferrari','Lamborghini','Porsche','Nissan','Ford','Chevrolet','Tesla'];
function test(name,fn){try{fn();console.log('PASS',name)}catch(e){console.error('FAIL',name,e.message);process.exitCode=1}}
test('seven real, separately sourced brand badges match original car lesson',()=>{
 assert.deepEqual(badges.map(x=>x.brand),expected);
 const cars=JSON.parse(js.match(/^const photoBank=(\[.*\]);$/m)[1]);
 assert.deepEqual(cars.map(x=>x.brand),expected,'badge and photo banks must teach the same brands');
 assert.equal(new Set(badges.map(x=>x.brand)).size,7);
 assert.equal(new Set(badges.map(x=>x.file)).size,7);
 for(const x of badges){
  assert.ok(x.file&&x.author&&x.license&&x.licenseUrl);
  assert.ok(x.localName.endsWith('-badge.png'));
 }
});
test('all badges are offline PNGs with 720x480 standardized presentation',()=>{
 for(const x of badges){
  const path='assets/badges/'+x.localName;
  const buf=fs.readFileSync(path);
  assert.ok(buf.length>2500,x.brand+' image looks empty');
  assert.equal(buf.subarray(0,8).toString('hex'),'89504e470d0a1a0a',x.brand);
  assert.equal(buf.readUInt32BE(16),720,x.brand+' width');
  assert.equal(buf.readUInt32BE(20),480,x.brand+' height');
  assert.ok(sw.includes("'./"+path+"'"),x.brand+' not included in offline cache');
 }
 assert.ok(fs.existsSync('assets/badges/SOURCES.md'));
});
test('quiz modes are explicit, real image URLs used without car photos in badge mode',()=>{
 for(const id of ['carModeCars','carModeBadges','carQuizHeading','carQuizDescription','carPhotoZoomGroup'])assert.ok(html.includes('id="'+id+'"'));
 assert.ok(js.includes("carMode=mode==='badges'?'badges':'cars'"));
 assert.ok(js.includes("carMode==='badges'?badgeBank:photoBank"));
 assert.ok(js.includes("carMode==='badges'?['./assets/badges/'+encodeURIComponent(current.localName)]:photoCandidates(current)"));
 assert.ok(js.includes("const badge=carMode==='badges'"));
 assert.ok(js.includes("badge?'Μάντεψε το σήμα':'Γρήγορα αυτοκίνητα'"));
 assert.ok(js.includes("img.alt=carMode==='badges'?'Σήμα κατασκευαστή."));
 assert.ok(css.includes('#carPhotoZoomGroup[hidden]'));
 assert.ok(css.includes('#carPictureFrame.badge-only'));
});
test('first-attempt score, retries, end summary, and no tracking',()=>{
 assert.ok(js.includes("if(carMode==='badges'&&carFirstTry)carScore++"));
 assert.ok(js.includes("carAttempted=true;carFirstTry=false;"));
 assert.ok(js.includes('function finishBadgeTest()'));
 assert.ok(js.includes("carCompleted=true"));
 assert.ok(js.includes('με την πρώτη προσπάθεια'));
 assert.ok(js.includes("if(carCompleted){openCars('badges');return}"));
 assert.ok(js.includes("if(carMode==='badges')finishBadgeTest()"));
 assert.ok(js.includes("if(carMode==='badges')showBadgeCredit(current)"));
 assert.ok(!js.includes('localStorage.setItem('));
});
test('release v0.6.82 assets and scripts are versioned',()=>{
 assert.ok(html.includes('v0.6.82'));
 assert.ok(html.includes('extra-lessons.js?v=682'));
 assert.ok(html.includes('extra-lessons.css?v=682'));
 assert.ok(sw.includes('mathaino-v0.6.82'));
 assert.ok(sw.includes("'./extra-lessons.js?v=682'"));
 assert.ok(sw.includes("'./extra-lessons.css?v=682'"));
});
test('JS syntax still valid',()=>{new Function(js)});
if(process.exitCode)process.exit(process.exitCode);
