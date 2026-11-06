'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const page=fs.readFileSync('index.html','utf8');
const cache=fs.readFileSync('sw.js','utf8');
const css=fs.readFileSync('cool-workbook.css','utf8');
const warm=fs.readFileSync('warm-workbook.css','utf8');
function test(name,fn){try{fn();console.log('PASS',name)}catch(e){console.error('FAIL',name,e.message);process.exitCode=1}}
function contrast(hexA,hexB){
 const luminance=hex=>{
  const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255)
   .map(x=>x<=.04045?x/12.92:Math.pow((x+.055)/1.055,2.4));
  return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
 };
 const a=luminance(hexA),b=luminance(hexB);
 return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
}
test('new theme loaded last',()=>{
 assert.ok(page.includes('v0.6.79'));
 assert.ok(page.includes('cool-workbook.css?v=674'));
 assert.ok(page.indexOf('cool-workbook.css?v=674')>page.indexOf('warm-workbook.css?v=664'));
 assert.ok(page.indexOf('cool-workbook.css?v=674')>page.indexOf('question-dock.css?v=674'));
});
test('offline pack contains new stylesheet and new version',()=>{
 assert.ok(cache.includes('mathaino-v0.6.79'));
 assert.ok(cache.includes("'./cool-workbook.css?v=674'"));
});
test('both theme variants have cool backgrounds',()=>{
 assert.ok(css.includes('background-color:#f1f8fc'));
 assert.ok(css.includes('background-color:#1c2e3b'));
 assert.ok(css.includes('html[data-theme="dark"][data-workbook="on"]'));
 assert.ok(css.includes('--wb-paper:#ffffff'));
 assert.ok(css.includes('--wb-paper:#263b49'));
});
test('forward actions use green and back/skip remain neutral',()=>{
 for(const selector of ['button.primary','#practice','.curriculum-next','.mathaino-dock-next']){
  assert.ok(css.includes(selector),selector);
 }
 for(const selector of ['.curriculum-back','.curriculum-skip','button.question-skip','.mathaino-dock-skip']){
  assert.ok(css.includes(selector),selector);
 }
 assert.ok(css.includes('#237e55'));
 assert.ok(css.includes('#26835b'));
});
test('light and dark affirmative buttons meet AA contrast',()=>{
 assert.ok(contrast('#237e55','#ffffff')>=4.5);
 assert.ok(contrast('#26835b','#ffffff')>=4.5);
});
test('selection, incorrect, and accessibility cues retained',()=>{
 assert.ok(css.includes('.curriculum-tab.active'));
 assert.ok(css.includes('button.pack-choice.pack-wrong'));
 assert.ok(warm.includes('body.no-color #testPackLesson .pack-choice.pack-wrong'));
 assert.ok(warm.includes('html[data-workbook="on"] button#next.primary'));
});
test('CSS blocks have balanced braces',()=>{
 const cleaned=css.replace(/\/\*[\s\S]*?\*\//g,'');
 let depth=0;
 for(const ch of cleaned){if(ch==='{')depth++;if(ch==='}')depth--;assert.ok(depth>=0,'unexpected close brace')}
 assert.equal(depth,0);
});
if(process.exitCode)process.exit(process.exitCode);
