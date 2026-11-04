/* Μαθαίνω! v0.6.67 — accessible sticky question navigation.
   Mirror the original controls rather than moving them: each lesson engine
   remains responsible for answer validation, attempts, skips and progress. */
(function(){
'use strict';
const el=(tag,cls,text)=>{
 const node=document.createElement(tag);
 if(cls)node.className=cls;
 if(text!==undefined)node.textContent=text;
 return node
};
const dock=el('nav','mathaino-action-dock');
dock.id='mathainoActionDock';
dock.setAttribute('aria-label','Ενέργειες άσκησης');
dock.hidden=true;
const inner=el('div','mathaino-action-dock-inner');
const skip=el('button','mathaino-dock-skip','Παράλειψη →');
const next=el('button','mathaino-dock-next','Επόμενη άσκηση →');
skip.type='button';next.type='button';
inner.append(skip,next);dock.append(inner);document.body.append(dock);
let sources={skip:null,next:null,area:null};
function visible(node){
 if(!node||node.hidden||node.disabled||node.classList.contains('hidden'))return false;
 if(node.closest('[hidden], .hidden'))return false;
 return true
}
function context(){
 const cases=[
  ['#curriculumLesson:not(.hidden)','.curriculum-question-card','.curriculum-skip','.curriculum-next'],
  ['#testPackLesson:not(.hidden)','.pack-question-card','.pack-skip','.mathaino-completion'],
  ['#spellingLesson:not(.hidden)','#spellExercise:not([hidden])','#spellSkip','#spellNext'],
  ['#test:not(.hidden)','#test','#skipQuestion','#next'],
  ['#historyLesson:not(.hidden)','#historyQuizSection','#historySkip','#historyNext'],
  ['#grade5Lesson:not(.hidden)','#grade5Body','#grade5Body .question-skip','#grade5Body .mathaino-completion']
 ];
 for(const [rootSel,areaSel,skipSel,nextSel] of cases){
  const root=document.querySelector(rootSel);if(!root)continue;
  const area=areaSel==='#test'?root:root.querySelector(areaSel);
  if(!area||area.hidden||area.classList.contains('hidden'))continue;
  const skipNode=(area.querySelector(skipSel)||root.querySelector(skipSel));
  const nextNode=(area.querySelector(nextSel)||root.querySelector(nextSel));
  if(visible(skipNode)||visible(nextNode))return {area,skip:skipNode,next:nextNode}
 }
 return null
}
function updateViewport(){
 const vv=window.visualViewport;
 // On mobile Safari the keyboard reduces the visual viewport without always
 // resizing the layout viewport. Keep the buttons above it.
 const occlusion=vv?Math.max(0,window.innerHeight-vv.height-vv.offsetTop):0;
 dock.style.bottom=Math.round(occlusion)+'px';
}
function sync(){
 const found=context();
 if(!found){
  sources={skip:null,next:null,area:null};
  if(!dock.hidden)dock.hidden=true;
  document.body.classList.remove('mathaino-action-dock-active');
  return
 }
 sources=found;
 const showNext=visible(found.next);
 const showSkip=!showNext&&visible(found.skip);
 if(!showNext&&!showSkip){
  if(!dock.hidden)dock.hidden=true;
  document.body.classList.remove('mathaino-action-dock-active');
  return
 }
 skip.hidden=!showSkip;
 next.hidden=!showNext;
 if(showNext){
  const label=found.next?.textContent?.trim()||'Επόμενη άσκηση';
  next.textContent=/Ολοκλήρωση|Ξανά από την αρχή|Τέλος/i.test(label)?label:'Επόμενη άσκηση →'
 }
 skip.disabled=!showSkip;
 next.disabled=!showNext;
 if(dock.hidden)dock.hidden=false;
 document.body.classList.add('mathaino-action-dock-active');
 updateViewport()
}
let pending=false;
function schedule(){
 if(pending)return;
 pending=true;
 requestAnimationFrame(()=>{pending=false;sync()})
}
function focusQuestion(){
 const c=context();
 if(!c?.area)return;
 const heading=c.area.querySelector(
  '.curriculum-question-title,.pack-count,#spellCounter,#question,#historyQuestion,.g5-small'
 );
 (heading||c.area).scrollIntoView({behavior:'auto',block:'start'});
 schedule()
}
function act(which){
 const source=sources[which];
 if(!visible(source))return;
 source.click();
 requestAnimationFrame(focusQuestion)
}
skip.addEventListener('click',()=>act('skip'));
next.addEventListener('click',()=>act('next'));
const observer=new MutationObserver(schedule);
observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden','disabled','style']});
window.addEventListener('resize',schedule,{passive:true});
window.visualViewport?.addEventListener('resize',updateViewport,{passive:true});
window.visualViewport?.addEventListener('scroll',updateViewport,{passive:true});
schedule();
window.MathainoQuestionDock=Object.freeze({refresh:schedule,active:()=>!dock.hidden});
})();