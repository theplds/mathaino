/* Μαθαίνω! v0.6.65 — structured curriculum library for Β΄, Δ΄, Ε΄.
   Original study notes + independent comprehension, practice, revision banks.
   No timers, mandatory ordering, streaks, marks or paid APIs. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const library=window.MathainoLessonData||[];
const subjectNames={reading:'Γλώσσα',addition:'Μαθηματικά',history:'Ιστορία',math:'Μαθηματικά',science5:'Φυσικά',history5:'Ιστορία'};
const gradeSubjects={'Β΄':['reading','addition'],'Δ΄':['history','math'],'Ε΄':['science5','history5']};
const el=(tag,cls,text)=>{
 const node=document.createElement(tag);
 if(cls)node.className=cls;
 if(text!==undefined)node.textContent=String(text);
 return node
};
const action=(text,fn,cls)=>{
 const b=el('button',cls,text);b.type='button';b.onclick=fn;return b
};
function shuffled(array){
 const a=array.slice();
 for(let n=a.length-1;n>0;n--){const i=Math.floor(Math.random()*(n+1));[a[n],a[i]]=[a[i],a[n]]}
 return a
}
const home=$('home'),lessonAnchor=$('learn');
if(!home||!lessonAnchor||!library.length)return;
const section=el('section','curriculum-catalog');
section.id='curriculumLibrary';
const top=el('div','curriculum-catalog-top');
top.append(el('div','curriculum-overline','ΒΙΒΛΙΟΘΗΚΗ ΜΑΘΗΜΑΤΩΝ'),
 el('h3','', '20 νέα μαθήματα'),
 el('p','', 'Μελέτη, ερωτήσεις, εξάσκηση και επανάληψη. Διάλεξε όποιο μάθημα θέλεις.'));
const controls=el('div','curriculum-catalog-controls');
const gradeLabel=el('label','','Τάξη');
gradeLabel.htmlFor='curriculumGrade';
const gradeSelect=el('select');gradeSelect.id='curriculumGrade';gradeSelect.setAttribute('aria-label','Επιλογή σχολικής τάξης');
[['mine','Η τάξη μου'],['Β΄','Β΄ Δημοτικού'],['Δ΄','Δ΄ Δημοτικού'],['Ε΄','Ε΄ Δημοτικού']].forEach(([val,label])=>{
 const opt=el('option','',label);opt.value=val;gradeSelect.append(opt)
});
controls.append(gradeLabel,gradeSelect);
top.append(controls);section.append(top);
const catalogBody=el('div','curriculum-catalog-body');section.append(catalogBody);
home.append(section);
const stage=el('section','hidden curriculum-lesson');
stage.id='curriculumLesson';
lessonAnchor.parentNode.insertBefore(stage,lessonAnchor);
const state={lesson:null,mode:'study',index:0,queue:[],skipped:[],tries:0,solved:false,firstCorrect:0,round:0};
const banks={quiz:'Καταλαβαίνω',practice:'Εξασκούμαι',review:'Επαναλαμβάνω'};
function profile(){return child>=0?profiles?.[child]||null:null}
function gradeOf(p){
 const raw=String(p?.grade||'');
 return ['Β΄','Δ΄','Ε΄'].find(g=>raw.startsWith(g[0]))||'Β΄'
}
function permitted(l){
 const p=profile();
 if(!p)return false;
 const allowed=Array.isArray(p.allowed)?p.allowed:[];
 if(allowed.includes(l.subject))return true;
 if(gradeOf(p)!==l.grade)return false;
 // An unconfigured family should see normal curricular subjects by grade.
 // Once parent permissions are explicitly configured, honor them.
 if(['science5','history5'].includes(l.subject))return !p.grade5SubjectsConfigured;
 if(l.subject==='history')return !p.extraSubjectsConfigured;
 return false
}
function gradeChosen(){return gradeSelect.value==='mine'?gradeOf(profile()):gradeSelect.value}
function media(key){
 const out=window.MathainoCrayonArt?.word(key)||window.MathainoWarmArt?.draw(key,true)||'';
 return out
}
function createArt(key){
 const wrap=el('div','curriculum-art');
 wrap.innerHTML=media(key);
 if(!wrap.children.length){
  wrap.append(el('span','curriculum-art-fallback','✎'))
 }
 return wrap
}
function lessonsForCurrentGrade(){
 return library.filter(l=>l.grade===gradeChosen()&&permitted(l))
}
function refreshHome(){
 const p=profile();
 section.hidden=!p;
 if(!p)return;
 const filtered=lessonsForCurrentGrade();
 catalogBody.replaceChildren();
 if(!filtered.length){
  catalogBody.append(el('p','curriculum-empty','Δεν υπάρχουν ενεργοποιημένα μαθήματα για αυτή την τάξη. Έλεγξε την πρόσβαση μαθημάτων στις ρυθμίσεις γονέα.'));
  return
 }
 const subjects=[...new Set(filtered.map(x=>x.subject))];
 subjects.forEach(subject=>{
  const group=el('div','curriculum-subject-group');
  group.append(el('h4','',subjectNames[subject]||'Μάθημα'));
  const grid=el('div','curriculum-card-grid');
  filtered.filter(l=>l.subject===subject).forEach(lesson=>{
   const card=action('',()=>open(lesson.id),'curriculum-lesson-card');
   const picture=createArt(lesson.art);
   const copy=el('span','curriculum-lesson-copy');
   copy.append(el('span','curriculum-lesson-unit',lesson.unit),
               el('strong','',lesson.title),
               el('span','curriculum-lesson-detail',lesson.objectives[0]),
               el('span','curriculum-lesson-meta',lesson.pages.length+' κάρτες μελέτης · '+(lesson.quiz.length+lesson.practice.length+lesson.review.length)+' ασκήσεις'));
   card.append(picture,copy);grid.append(card)
  });
  group.append(grid);catalogBody.append(group)
 })
}
gradeSelect.onchange=refreshHome;
function open(id){
 const lesson=library.find(l=>l.id===id);
 if(!lesson||!permitted(lesson))return;
 state.lesson=lesson;
 state.mode='study';state.round=0;
 resetBank();render();
 viewAll('curriculumLesson');
}
function resetBank(){
 const bank=state.lesson?.[state.mode]||[];
 state.queue=bank.map((_,i)=>i);
 state.skipped=[];state.index=0;state.tries=0;state.firstCorrect=0;state.solved=false;
}
function setMode(next){
 if(!state.lesson||!['study','quiz','practice','review'].includes(next))return;
 state.mode=next;state.round=0;resetBank();render()
}
function header(){
 const l=state.lesson;
 const top=el('div','curriculum-lesson-top');
 top.append(action('← Μαθήματα',()=>viewAll('home'),'curriculum-back'));
 const text=el('div','curriculum-heading');
 text.append(el('p','curriculum-overline',l.grade+' ΔΗΜΟΤΙΚΟΥ · '+subjectNames[l.subject]),
  el('h2','',l.title),
  el('p','curriculum-book-unit',l.unit));
 top.append(text);
 stage.append(top);
 const tools=el('div','curriculum-tools');
 tools.append(action('PDF / Εκτύπωση',exportLesson,'curriculum-print'));
 if(l.source){
  const link=el('a','curriculum-book-link','Σχολικό βιβλίο');
  link.href=l.source;link.target='_blank';link.rel='noopener noreferrer';
  tools.append(link)
 }
 stage.append(tools)
}
function tabs(){
 const nav=el('div','curriculum-tabs');
 nav.setAttribute('role','group');nav.setAttribute('aria-label','Τρόπος εξάσκησης');
 [['study','Μελέτη'],['quiz','Καταλαβαίνω'],['practice','Εξασκούμαι'],['review','Επαναλαμβάνω']].forEach(([mode,title])=>{
  const b=action(title,()=>setMode(mode),'curriculum-tab'+(state.mode===mode?' active':''));
  b.setAttribute('aria-pressed',state.mode===mode?'true':'false');nav.append(b)
 });
 stage.append(nav)
}
function addObjectives(body){
 const div=el('div','curriculum-objectives');
 div.append(el('h3','','Τι θα μάθω'));
 const list=el('ul');
 state.lesson.objectives.forEach(t=>list.append(el('li','',t)));
 div.append(list);body.append(div)
}
function study(body){
 const l=state.lesson;
 addObjectives(body);
 for(const [title,text,key] of l.pages){
  const card=el('article','curriculum-study-card');
  if(key)card.append(createArt(key));
  const copy=el('div','curriculum-study-copy');
  copy.append(el('h3','',title),el('p','',text));
  card.append(copy);body.append(card)
 }
 const notice=el('p','curriculum-study-note','Πρωτότυπες εξηγήσεις που συμπληρώνουν τα σχολικά βιβλία, όχι αντιγραφή τους.');
 body.append(notice);
 body.append(action('Ξεκίνα τις ερωτήσεις →',()=>setMode('quiz'),'primary curriculum-start'))
}
function currentQuestion(){
 const bank=state.lesson?.[state.mode]||[];
 return bank[state.queue[state.index]]
}
function recordAnswer(q,choice,correct){
 try{
  if(typeof ready==='undefined'||!ready||typeof db==='undefined'||!db||!cloudChildren?.[child])return;
  const attempt={child_id:cloudChildren[child].id,
   subject:state.lesson.subject,
   topic:state.lesson.unit+' · '+state.lesson.title+' · '+banks[state.mode],
   question:q[0],selected_answer:String(choice).slice(0,100),
   correct_answer:q[1][q[2]],is_correct:correct,attempt_number:state.tries};
  db.from('answer_events').insert(attempt).then(({error})=>{
   if(error)console.warn('Curriculum answer not saved:',error.message)
  }).catch(e=>console.warn('Curriculum answer not saved:',e?.message))
 }catch(e){console.warn('Curriculum answer not saved:',e?.message)}
}
function advance(){
 state.index++;
 if(state.index>=state.queue.length){render();return}
 state.tries=0;state.solved=false;
 render()
}
function retrySkipped(){
 if(!state.skipped.length)return;
 state.queue=state.skipped.slice();state.skipped=[];
 state.index=0;state.tries=0;state.firstCorrect=0;state.solved=false;
 state.round++;
 render()
}
function finished(body){
 body.append(el('h3','curriculum-finish-title','Ολοκλήρωσες την εξάσκηση!'));
 const skipped=state.skipped.length;
 body.append(el('p','curriculum-finish-summary',
  'Δοκίμασες '+state.queue.length+' '+(state.queue.length===1?'ερώτηση.':'ερωτήσεις.')+
  (skipped?' Παρέλειψες '+skipped+' '+(skipped===1?'ερώτηση.':'ερωτήσεις.'):'')+
  ' Μπορείς να συνεχίσεις με άλλη δραστηριότητα όποτε θέλεις.'));
 const actions=el('div','curriculum-finish-actions');
 if(skipped)actions.append(action('Δοκίμασε τις παραλειμμένες ('+skipped+')',retrySkipped,'curriculum-retry'));
 actions.append(action('Νέα επανάληψη',()=>setMode(state.mode),'curriculum-repeat'));
 actions.append(action('Πίσω στη μελέτη',()=>setMode('study'),'curriculum-return'));
 body.append(actions)
}
function quiz(body){
 const items=state.lesson?.[state.mode]||[];
 if(state.index>=state.queue.length){finished(body);return}
 const q=currentQuestion();
 if(!q)return;
 const progress=el('div','curriculum-progress');
 progress.append(el('span','',banks[state.mode]+' · Ερώτηση '+(state.index+1)+' από '+state.queue.length));
 const bar=el('div','curriculum-progress-track');
 const fill=el('span','curriculum-progress-fill');fill.style.width=(state.index/state.queue.length*100)+'%';
 bar.append(fill);progress.append(bar);body.append(progress);
 const card=el('article','curriculum-question-card');
 const heading=el('h3','curriculum-question-title',q[0]);card.append(heading);
 const options=el('div','curriculum-options');card.append(options);
 const feedback=el('p','curriculum-feedback');feedback.setAttribute('aria-live','polite');
 const buttons=el('div','curriculum-answer-actions');
 const skip=action('Παράλειψη →',()=>{
  if(state.solved)return;
  state.skipped.push(state.queue[state.index]);advance()
 },'curriculum-skip');
 const next=action(state.index===state.queue.length-1?'Ολοκλήρωση →':'Επόμενη →',advance,'primary mathaino-completion curriculum-next');
 next.hidden=true;
 buttons.append(next,skip);
 const permutation=shuffled([0,1,2]);
 permutation.forEach(k=>{
  const b=action(q[1][k],()=>{
   if(state.solved)return;
   state.tries++;
   const good=k===q[2];
   recordAnswer(q,q[1][k],good);
   if(good){
    state.solved=true;
    b.classList.add('correct');
    feedback.className='curriculum-feedback good';
    feedback.textContent='Σωστά! '+q[3];
    options.querySelectorAll('button').forEach(x=>x.disabled=true);
    next.hidden=false;skip.hidden=true;
    fill.style.width=((state.index+1)/state.queue.length*100)+'%'
   }else{
    b.classList.add('incorrect');b.disabled=true;
    feedback.className='curriculum-feedback try';
    feedback.textContent='Δοκίμασε άλλη απάντηση. Μπορείς να παραλείψεις και να επιστρέψεις αργότερα.'
   }
  },'curriculum-choice');
  options.append(b)
 });
 card.append(feedback,buttons);body.append(card)
}
function render(){
 const l=state.lesson;if(!l)return;
 stage.replaceChildren();
 header();tabs();
 const body=el('div','curriculum-body');
 if(state.mode==='study')study(body);else quiz(body);
 stage.append(body)
}
function exportLesson(){
 const l=state.lesson;if(!l||!window.MathainoWorksheet?.open)return;
 const tab=state.mode==='study'?'quiz':state.mode;
 const questions=l[tab]||l.quiz;
 const desc={quiz:'Ερωτήσεις κατανόησης',practice:'Ασκήσεις',review:'Επανάληψη'};
 window.MathainoWorksheet.open({
  kind:'quiz',title:l.title,subtitle:l.unit+' · '+desc[tab],
  grade:l.grade+' Δημοτικού',subject:l.subject,
  pages:l.pages.map(([title,text])=>({title,text})),
  questions:questions.map(([q,options,correct])=>({q,options,correct,answer:options[correct]}))
 })
}
const oldViewAll=viewAll;
viewAll=function(id){
 oldViewAll(id);
 stage.classList.toggle('hidden',id!=='curriculumLesson');
 if(id==='home')refreshHome()
};
const oldChooseChild=chooseChild;
chooseChild=function(index){
 oldChooseChild(index);
 gradeSelect.value='mine';
 refreshHome()
};
refreshHome();
window.MathainoCurriculumLibrary=Object.freeze({
 version:'0.6.65',
 count:library.length,
 lessons:library.map(l=>({id:l.id,title:l.title,grade:l.grade,subject:l.subject,
   pages:l.pages.length,questionCount:l.quiz.length+l.practice.length+l.review.length})),
 open
});
})();