/* Μαθαίνω v0.6.78 — Grade Γ home cards and parent-managed subject visibility.
   Composes with the existing welcome gate, curriculum library and cloud settings. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const library=window.MathainoCurriculumLibrary;
const subjects=$('subjects');
if(!library||!subjects)return;
const entries=[
 {id:'language3',name:'Γλώσσα Γ΄',desc:'Διαβάζω, γράφω και αφηγούμαι',parent:'allowLanguage3',shape:'book'},
 {id:'history3',name:'Ιστορία Γ΄',desc:'Μυθολογία και προϊστορία',parent:'allowHistory3',shape:'temple'},
 {id:'math3',name:'Μαθηματικά Γ΄',desc:'Αριθμοί, πράξεις και σχήματα',parent:'allowMath3',shape:'math'}
];
const keys=new Set(entries.map(e=>e.id));
function isGrade3(value){return String(value||'').trim().startsWith('Γ')}
function canAccess(profile,subject){
 if(!profile||!isGrade3(profile.grade))return false;
 return !profile.grade3SubjectsConfigured||(profile.allowed||[]).includes(subject)
}
function art(shape){
 const picture=shape==='temple'?
  '<path d="M32 45 105 14 178 45Z" fill="#9bd5ca" stroke="#4d8890" stroke-width="4"/><path d="M43 53h124v52H43Z" fill="#f5f9f3" stroke="#4d8890" stroke-width="3"/><path d="M59 59v41m30-41v41m30-41v41m30-41v41" stroke="#75acaa" stroke-width="12"/><path d="M28 108h153" stroke="#4d8890" stroke-width="6"/>' :
  shape==='math'?
  '<rect x="27" y="13" width="158" height="102" rx="20" fill="#e7f3f8" stroke="#6fabc0" stroke-width="4"/><text x="45" y="78" fill="#2d7983" font-size="52" font-weight="800" font-family="system-ui,sans-serif">3×4</text><path d="m147 68 11 11 20-23" stroke="#237e55" stroke-width="7" fill="none" stroke-linecap="round"/>' :
  '<path d="M33 33q29-12 71 4v66Q66 86 33 99Z" fill="#fff9e6" stroke="#689db0" stroke-width="4"/><path d="M177 33q-29-12-71 4v66q38-17 71-4Z" fill="#d7f1ed" stroke="#689db0" stroke-width="4"/><path d="M105 37v66m-54-49h32m-32 12h32m38-12h37m-37 12h37" stroke="#77b2b1" stroke-width="3"/>';
 return '<svg viewBox="0 0 210 125" role="img" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+picture+'</svg>'
}
const cards=[];
function select(e){
 if(e.button.hidden)return;
 sub=e.id;
 subjects.querySelectorAll('button').forEach(button=>button.classList.toggle('active',button===e.button));
 topics()
}
for(const e of entries){
 const button=document.createElement('button');
 button.type='button';button.dataset.sub=e.id;button.className='grade-g-subject';
 const pict=document.createElement('span');pict.className='subject-illustration grade-g-art';pict.setAttribute('aria-hidden','true');pict.innerHTML=art(e.shape);
 const title=document.createElement('span');title.className='subject-title';title.textContent=e.name;
 const desc=document.createElement('span');desc.className='subject-desc';desc.textContent=e.desc;
 button.append(pict,title,desc);
 button.setAttribute('aria-label',e.name+' — '+e.desc);
 button.onclick=()=>select(e);
 subjects.append(button);e.button=button;cards.push(button)
}
function updateParentFields(){
 const p=profiles[editing];
 if(!p)return;
 const enabled=isGrade3($('editGrade').value||p.grade);
 for(const e of entries){
  const row=$(e.parent+'Row'),check=$(e.parent);
  row.hidden=!enabled;
  check.checked=enabled&&(!p.grade3SubjectsConfigured||(p.allowed||[]).includes(e.id));
 }
}
const priorLoad=loadEditor;
loadEditor=function(){priorLoad();updateParentFields()};
$('editGrade').addEventListener('change',updateParentFields);
function refreshGradeButtons(profile){
 for(const e of entries)e.button.hidden=!canAccess(profile,e.id);
}
const previousChoose=chooseChild;
chooseChild=function(index){
 previousChoose(index);
 const profile=profiles[index];
 refreshGradeButtons(profile);
 // Never bypass the child's normal introduction / picture welcome screens.
 const selected=subjects.querySelector('button.active:not([hidden])');
 if(!selected){
  const first=subjects.querySelector('button:not([hidden])');
  if(first){
   sub=first.dataset.sub;
   subjects.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b===first));
   topics()
  }
 }
};
const priorTopics=topics;
topics=function(){
 if(!keys.has(sub)){priorTopics();return}
 const p=profiles[child];
 const available=library.lessons.filter(l=>l.subject===sub&&canAccess(p,l.subject));
 const selectBox=$('topic');selectBox.replaceChildren();
 for(const l of available){
  const option=document.createElement('option');option.value=l.id;option.textContent=l.title;
  selectBox.append(option)
 }
 refreshSubjectPanel();
 $('selectedSubjectDescription').textContent='Επίλεξε μια ενότητα. Μελέτη, ερωτήσεις, εξάσκηση και επανάληψη.';
 $('topicGroup').hidden=available.length<=1;
 $('topicSingle').hidden=available.length!==1;
 $('topicSingle').textContent=available.length===1?'Ενότητα: '+available[0].title:'';
 $('countGroup').hidden=true;
 $('exportLesson').hidden=true;
 $('study').disabled=!available.length;
 $('practice').disabled=!available.length;
 $('study').textContent='Μελέτη →';
 $('practice').textContent='Ερωτήσεις →';
};
const studyBefore=$('study').onclick,practiceBefore=$('practice').onclick;
function open(mode){
 const id=$('topic').value,p=profiles[child];
 const l=library.lessons.find(item=>item.id===id);
 if(!l||!keys.has(l.subject)||!canAccess(p,l.subject))return;
 library.open(id,mode)
}
$('study').onclick=()=>{if(keys.has(sub))open('study');else studyBefore()};
$('practice').onclick=()=>{if(keys.has(sub))open('quiz');else practiceBefore()};
window.MathainoGrade3Subjects=Object.freeze({version:'0.6.78',subjects:entries.map(x=>x.id),lessons:library.lessons.filter(l=>keys.has(l.subject)).length});
})();