/* Intro question regression tests; Node 20+; no browser, credentials or user data. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('intro-questions.js','utf8');
const app=fs.readFileSync('app-main.js','utf8');
const root=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const data=Object.create(null);
Object.defineProperties(data,{
 getItem:{enumerable:false,value:key=>Object.hasOwn(data,key)?data[key]:null},
 setItem:{enumerable:false,value:(key,value)=>{data[key]=String(value)}},
 removeItem:{enumerable:false,value:key=>{delete data[key]}}
});
data['mathaino-intro-20-v1:former-name']={shown:7};
const wordIds=['duck','ball','apple','cat','house','fish','water','sun','dog','bird','book','tree','bread','milk','hat','car','train','ship','flower','banana','school','backpack','pencil','door','clock','icecream','moon','umbrella','battery','city','palace'];
const window={MathainoIllustrations:{wordIds}};
vm.runInNewContext(source,{window,localStorage:data,Math,Number,Object,Array,Set,Map,String,JSON,Error});
const intro=window.MathainoIntro;
assert.ok(intro);
assert.equal(intro.wordItems.length,31);
const grades=['Α΄ Δημοτικού','Β΄ Δημοτικού','Γ΄ Δημοτικού','Δ΄ Δημοτικού','Ε΄ Δημοτικού','ΣΤ΄ Δημοτικού'];
for(let i=0;i<grades.length;i++){
 const profile={grade:grades[i]};
 assert.equal(intro.levelOf(profile),i+1,'grade detection');
 const bank=intro.questionsFor(i+1);
 assert.ok(bank.length>=80,'sufficient intro math variety');
 const math=Array.from({length:Math.min(bank.length,110)},()=>intro.nextQuestion(profile,i));
 assert.equal(new Set(math.map(q=>q.id)).size,math.length,'math does not repeat until deck exhausted');
 for(const q of math){
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options).size,4);
  assert.equal(q.options.filter(x=>x===q.a).length,1,'one correct answer');
  const match=q.q.match(/^Πόσο κάνει (\d+) ([+−×÷]) (\d+);$/);
  assert.ok(match,'known original math exercise format');
  const a=Number(match[1]),b=Number(match[3]);
  const expected=match[2]==='+'?a+b:match[2]==='−'?a-b:match[2]==='×'?a*b:a/b;
  assert.equal(Number(q.a),expected,'answer key accurate');
 }
 const pics=intro.picturesFor(profile);
 assert.ok(pics.length>=27,'expanded illustration bank');
 const draws=Array.from({length:pics.length},()=>intro.nextPicture(profile,i));
 assert.equal(new Set(draws.map(p=>p.icon)).size,pics.length,'picture does not repeat within a cycle');
 assert.ok(draws.every(p=>wordIds.includes(p.icon)),'only verified illustrations');
 console.log('Grade',grades[i],'questions',bank.length,'pictures',pics.length,'passed');
}
assert.ok(!Object.keys(data).some(k=>k.includes('former-name')),'legacy personal-data key removed');
assert.ok(Object.keys(data).every(k=>/^mathaino-intro-v3-slot-\d+$/.test(k)),'only anonymous rotation state stored');
assert.ok(!app.includes("const item={q:'Πόσο κάνει 4 × 3;'"),'hard-coded question removed');
assert.ok(root.indexOf('intro-questions.js?v=671')<root.indexOf('app-main.js?v=678'),'loaded before main');
assert.ok(sw.includes("mathaino-v0.6.81")&&sw.includes("intro-questions.js?v=671"),'offline cache versioned');
intro.clear();
assert.equal(Object.keys(data).length,0,'logout clears intro state');
console.log('Grade-aware intro regression: PASS');
