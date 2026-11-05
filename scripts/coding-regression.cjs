'use strict';
/* No dependencies; execute the production engine and release wiring. */
const fs=require('node:fs');
const assert=require('node:assert/strict');
const core=require('../coding-core.js');
const ui=fs.readFileSync('coding-lesson.js','utf8');
const css=fs.readFileSync('coding-lesson.css','utf8');
const html=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
function test(name,fn){
 try{fn();console.log('PASS',name)}
 catch(error){console.error('FAIL',name,error.message);process.exitCode=1}
}
function simulate(levelIndex,program,goal){
 const level=core.levels[levelIndex];
 const target=goal||level.goal;
 let robot=core.initial(level),blocked=false,win=false,count=0;
 for(const action of core.expand(program)){
  const result=core.step(level,robot,action);
  robot=result.robot;count++;
  if(result.blocked){blocked=true;break}
  if(core.reached(robot,target)){win=core.eligible(level,program);break}
 }
 return {robot,blocked,win,count,eligible:core.eligible(level,program)}
}
test('six numbered self-contained lessons accessible without unlocks',()=>{
 assert.equal(core.levels.length,6);
 assert.deepEqual(core.levels.map(l=>l.concept),['Σειρά εντολών','Ακολουθία','Διόρθωση προγράμματος','Επανάληψη','Συνθήκη','Ελεύθερη δημιουργία']);
 assert.ok(core.levels.every(l=>l.available.includes('F')&&l.title&&l.prompt));
 assert.deepEqual(core.levels.map(l=>l.grade),['Β΄','Β΄','Δ΄','Δ΄','Ε΄','Όλες']);
});
test('sequence reaches goal; alternative solutions accepted',()=>{
 assert.equal(simulate(0,['F','F']).win,true);
 assert.equal(simulate(0,['L','R','F','F']).win,true);
 assert.equal(simulate(0,['F']).win,false);
});
test('turning puzzle solves with ordered steps',()=>{
 assert.equal(simulate(1,['F','F','R','F','F']).win,true);
 assert.equal(simulate(1,['F','F','L','F','F']).win,false);
});
test('debugging seed is demonstrably wrong and replacing the turn solves it',()=>{
 const starter=core.levels[2].starter;
 assert.deepEqual(starter,['F','F','R','F','F']);
 assert.equal(simulate(2,starter).blocked,true);
 assert.equal(simulate(2,['F','F','L','F','F']).win,true);
});
test('repeat macro executes three visible steps and teaches repetition',()=>{
 const acts=core.expand(['F3']);
 assert.equal(acts.length,3);
 assert.ok(acts.every(a=>a.op==='F'&&a.source===0));
 assert.equal(simulate(3,['F3']).win,true);
 const alternative=simulate(3,['F','F','F']);
 assert.equal(core.reached(alternative.robot,core.levels[3].goal),true);
 assert.equal(alternative.win,false);
});
test('conditional turns if wall ahead and stays put when clear',()=>{
 const level=core.levels[4],start=core.initial(level);
 assert.equal(core.forwardBlocked(level,start),true);
 const turned=core.step(level,start,{op:'IFBLOCK'}).robot;
 assert.equal(turned.dir,2);
 assert.equal(core.step(core.levels[0],core.initial(core.levels[0]),{op:'IFBLOCK'}).robot.dir,1);
 assert.equal(simulate(4,['IFBLOCK','F','F']).win,true);
 assert.equal(simulate(4,['F','F']).blocked,true);
});
test('creative challenge accepts an original chosen target',()=>{
 const target=[4,2];
 assert.equal(core.levels[5].goal,null);
 assert.equal(simulate(5,['R','F','F'],target).win,true);
 assert.equal(simulate(5,['R','F','F'],[0,0]).win,false);
});
test('no escaping board, infinite loops or invalid commands',()=>{
 assert.equal(core.isBlocked(core.levels[0],-1,2),true);
 assert.equal(simulate(0,['L','F','F','F']).blocked,true);
 assert.throws(()=>core.expand(Array(19).fill('F')));
 assert.throws(()=>core.expand(['EVAL']));
 assert.throws(()=>core.expand(Array(13).fill('F3')));
 assert.equal(Object.isFrozen(core.commands),true);
});
test('no data calls, tracking, or in-app login bypass',()=>{
 assert.doesNotMatch(ui,/fetch\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB|answer_events|db\.from/);
 assert.ok(ui.includes("id!=='codingLesson'||!ready"),'must not bypass existing auth gating');
 assert.ok(ui.includes('previousChoose(index)'));
 assert.ok(ui.includes('if(!document.querySelector'), 'child fallback should not bypass welcome gate');
 assert.ok(ui.includes("sub='coding'"));
});
test('touch navigation, visible actions, dark appearance, offline assets',()=>{
 for(const t of ['codingRun','codingStep','codingStop','codingReset','codingNext','codingBack','codingHint','codingUndo','codingClear']){
  assert.ok(ui.includes(t),'missing '+t);
 }
 assert.ok(css.includes('touch-action:manipulation'));
 assert.ok(css.includes('position:sticky'));
 assert.ok(css.includes('html[data-theme="dark"]'));
 assert.ok(html.includes('coding-core.js?v=676'));
 assert.ok(html.includes('coding-lesson.js?v=676'));
 assert.ok(html.includes('coding-lesson.css?v=676'));
 assert.ok(html.indexOf('coding-core.js?v=676')<html.indexOf('coding-lesson.js?v=676'));
 assert.ok(html.includes('v0.6.78'));
 assert.ok(sw.includes('mathaino-v0.6.78'));
 for(const name of ['coding-core.js','coding-lesson.js','coding-lesson.css']){
  assert.ok(sw.includes("'./"+name+"?v=676'"),name+' unavailable offline');
 }
});
test('both scripts parse as JS',()=>{
 new Function(fs.readFileSync('coding-core.js','utf8'));
 new Function(ui);
});
if(process.exitCode)process.exit(process.exitCode);
