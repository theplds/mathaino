'use strict';
/* No third-party dependencies: exercise actual sticky-dock code against a tiny DOM.
   Guards the three states: incomplete answer -> skip, filled -> check,
   checked/correct -> next; and makes the original check non-duplicated. */
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const src=fs.readFileSync('question-dock.js','utf8');
const css=fs.readFileSync('cool-workbook.css','utf8');
const dockCSS=fs.readFileSync('question-dock.css','utf8');
const html=fs.readFileSync('index.html','utf8');
const cache=fs.readFileSync('sw.js','utf8');
const actionListeners=new Map();
const makeClassList=()=>{const values=new Set();return {
 contains: v=>values.has(v),add:v=>values.add(v),remove:v=>values.delete(v),
 toggle:(v,on)=>{if(on)values.add(v);else values.delete(v)}
}};
function node(tag,id=''){
 return {
  tagName:tag,id,hidden:false,disabled:false,textContent:'',style:{},children:[],
  classList:makeClassList(),handlers:{},parent:null,
  setAttribute(){},append(...nodes){this.children.push(...nodes);nodes.forEach(n=>n.parent=this)},
  addEventListener(type,cb){this.handlers[type]=cb},
  click(){if(this.onclick)this.onclick();if(this.handlers.click)this.handlers.click()},
  closest(){let n=this;while(n){if(n.hidden||n.classList.contains('hidden'))return n;n=n.parent}return null},
  querySelector(selector){return this.targets?.[selector]||null},
  scrollIntoView(){}
 }
}
const document={
 body:node('body'),
 createElement(tag){return node(tag)},
 querySelector(selector){return this.targets[selector]||null},
 targets:{}
};
const root=node('section','spellingLesson');
const area=node('section','spellExercise');
const check=node('button','spellCheck');
const skip=node('button','spellSkip');
const next=node('button','spellNext');
root.append(area);area.append(check,skip,next);
root.targets={'#spellExercise:not([hidden])':area,'#spellSkip':skip,'#spellNext':next,'#spellCheck':check};
area.targets={'#spellSkip':skip,'#spellNext':next,'#spellCheck':check};
document.targets={'#spellingLesson:not(.hidden)':root};
let checked=0,skipped=0,advanced=0;
check.onclick=()=>checked++;
skip.onclick=()=>skipped++;
next.onclick=()=>advanced++;
check.disabled=true;
next.hidden=true;
const window={
 innerHeight:800,
 addEventListener(){},
 MathainoQuestionDock:null
};
const raf=cb=>cb();
class Observer{observe(){}}
vm.runInNewContext(src,{document,window,MutationObserver:Observer,requestAnimationFrame:raf,console});
function refresh(){window.MathainoQuestionDock.refresh()}
const dock=document.body.children.find(n=>n.id==='mathainoActionDock');
assert.ok(dock,'dock must be created');
const [dockSkip,dockNext]=dock.children[0].children;
function assertStage(label,{skipVisible,primaryVisible,caption}){
 refresh();
 assert.equal(dock.hidden,false,label+': dock visible');
 assert.equal(dockSkip.hidden,!skipVisible,label+': skip visibility');
 assert.equal(dockNext.hidden,!primaryVisible,label+': primary visibility');
 if(caption)assert.equal(dockNext.textContent,caption,label+': primary label');
}
assertStage('incomplete',{skipVisible:true,primaryVisible:false});
dockSkip.click();assert.equal(skipped,1,'skip delegates to exercise');
check.disabled=false;
assertStage('filled',{skipVisible:false,primaryVisible:true,caption:'Έλεγχος ✓'});
dockNext.click();assert.equal(checked,1,'Check delegates to spelling engine');
check.hidden=true;next.hidden=false;skip.hidden=true;
assertStage('correct',{skipVisible:false,primaryVisible:true,caption:'Επόμενη άσκηση →'});
dockNext.click();assert.equal(advanced,1,'Next delegates to spelling engine');
next.hidden=true;skip.hidden=false;check.disabled=true;check.hidden=true;
assertStage('missing-letter mode',{skipVisible:true,primaryVisible:false});
area.hidden=true;refresh();assert.equal(dock.hidden,true,'dock disappears after lesson ends');
assert.match(dockCSS,/body\.mathaino-action-dock-active #spellExercise #spellCheck,/,
 'original Check is hidden while dock mirrors it');
assert.match(css,/html\[data-theme="dark"\]\[data-workbook="on"\] #spellSlots \.spell-slot\.filled\s*\{[^}]*background:#2f6372;[^}]*color:#ffffff;/,
 'dark filled letter contrast must override the pale light style');
assert.ok(html.includes('question-dock.js?v=674'));
assert.ok(html.includes('question-dock.css?v=674'));
assert.ok(html.includes('cool-workbook.css?v=674'));
assert.ok(cache.includes('mathaino-v0.6.76'));
console.log('PASS spelling dock incomplete/ready/correct/missing modes and dark contrast');
