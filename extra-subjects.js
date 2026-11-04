/* Μαθαίνω! v0.6.77 — explicit age/grade access for new Δ΄ and Ε΄ lessons.
   Uses existing cloud-backed allowed_subjects and a new settings preference.
   No schema changes, no bypass of parent PIN or family permissions. */
(function(){
'use strict';
const $x=id=>document.getElementById(id);
const newGroups=[
 {code:'science4',grade:'Δ΄',row:'allowScience4Row',input:'allowScience4',title:'Φυσικές επιστήμες Δ΄',desc:'Πειράματα και φυσικός κόσμος',mark:'Φ'},
 {code:'geo4',grade:'Δ΄',row:'allowGeo4Row',input:'allowGeo4',title:'Γεωγραφία Δ΄',desc:'Χάρτες και ο τόπος μας',mark:'Γ'},
 {code:'geo5',grade:'Ε΄',row:'allowGeo5Row',input:'allowGeo5',title:'Γεωγραφία Ε΄',desc:'Χάρτες, βουνά και θάλασσες',mark:'Γ'}
];
const myGroups=new Set(newGroups.map(g=>g.code));
const subjects=$x('subjects');
if(!subjects||!window.MathainoCurriculumLibrary)return;
const library=window.MathainoCurriculumLibrary;
function gradeOf(value){const valueStr=String(value||'');return valueStr.startsWith('Δ')?'Δ΄':valueStr.startsWith('Ε')?'Ε΄':'Β΄'}
function updateEditor(){
 const p=profiles[editing];if(!p)return;
 const grade=gradeOf($x('editGrade').value||p.grade);
 for(const g of newGroups){
  const match=grade===g.grade;
  $x(g.row).hidden=!match;
  $x(g.input).checked=match&&(!p.newCurriculumSubjectsConfigured||(p.allowed||[]).includes(g.code));
 }
}
const oldEditor=loadEditor;
loadEditor=function(){oldEditor();updateEditor()};
$x('editGrade').addEventListener('change',updateEditor);
function showSubjectButton(group){
 const button=document.createElement('button');
 button.type='button';button.dataset.sub=group.code;button.className='extra-subject';
 button.innerHTML='<span class="subject-illustration extra-subject-illustration" aria-hidden="true">'+
  '<svg viewBox="0 0 220 125" xmlns="http://www.w3.org/2000/svg" role="img">'+
  '<rect x="25" y="12" width="170" height="102" rx="20" fill="#e5f3f5" stroke="#62a1ae" stroke-width="3"/>'+
  (group.code==='science4'?
   '<path d="m92 29 0 25-26 40c-5 7 0 10 10 10h72c10 0 15-3 10-10L132 54V29" fill="#a7d9df" stroke="#376e83" stroke-width="5" stroke-linejoin="round"/><path d="M80 81h66" stroke="#398e87" stroke-width="5"/><circle cx="100" cy="72" r="6" fill="#fff"/><circle cx="118" cy="88" r="6" fill="#fff"/>':
   '<path d="m43 84 33-47 33 34 30-43 39 56" fill="#87b9a2" stroke="#467f8c" stroke-width="4" stroke-linejoin="round"/><path d="M43 86q36 20 67 4t68-4" fill="none" stroke="#4e9dc9" stroke-width="6"/><circle cx="169" cy="36" r="12" fill="#f4c572"/>')+
  '</svg></span><span class="subject-title">'+group.title+'</span><span class="subject-desc">'+group.desc+'</span>';
 button.setAttribute('aria-label',group.title);
 button.onclick=()=>{
  if(button.hidden)return;
  sub=group.code;
  for(const b of subjects.querySelectorAll('button'))b.classList.toggle('active',b===button);
  topics()
 };
 subjects.append(button);return button
}
for(const g of newGroups)g.button=showSubjectButton(g);
const previousChoose=chooseChild;
chooseChild=function(index){
 previousChoose(index);
 const p=profiles[index];if(!p)return;
 for(const g of newGroups){
  const allowed=p.allowed||[];
  g.button.hidden=gradeOf(p.grade)!==g.grade||(p.newCurriculumSubjectsConfigured&&!allowed.includes(g.code));
 }
 const active=subjects.querySelector('button.active:not([hidden])');
 if(!active){
  const first=subjects.querySelector('button:not([hidden])');
  if(first){sub=first.dataset.sub;first.classList.add('active');topics()}
 }
};
function allowedLesson(lesson,p){
 if(!p||!lesson||!myGroups.has(lesson.subject))return false;
 if(gradeOf(p.grade)!==lesson.grade)return false;
 return !p.newCurriculumSubjectsConfigured||(p.allowed||[]).includes(lesson.subject)
}
const oldTopics=topics;
topics=function(){
 if(!myGroups.has(sub)){oldTopics();return}
 const p=profiles[child];
 const lessons=library.lessons.filter(l=>l.subject===sub&&allowedLesson(l,p));
 const options=$x('topic');
 options.replaceChildren(...lessons.map(l=>{
  const opt=document.createElement('option');opt.value=l.id;opt.textContent=l.title;return opt
 }));
 refreshSubjectPanel();
 $x('selectedSubjectDescription').textContent='Διάλεξε μάθημα. Μελέτη, ερωτήσεις, εξάσκηση και επανάληψη χωρίς χρονόμετρο.';
 $x('topicGroup').hidden=lessons.length<=1;
 $x('topicSingle').hidden=lessons.length!==1;
 if(lessons.length===1)$x('topicSingle').textContent='Ενότητα: '+lessons[0].title;
 $x('countGroup').hidden=true;
 $x('exportLesson').hidden=true;
 $x('study').disabled=!lessons.length;
 $x('practice').disabled=!lessons.length;
 $x('study').textContent='Μελέτη →';
 $x('practice').textContent='Ερωτήσεις →'
};
const oldStudy=$x('study').onclick,oldPractice=$x('practice').onclick;
function selectLesson(mode){
 const id=$x('topic').value;const p=profiles[child];
 const l=library.lessons.find(x=>x.id===id);
 if(!allowedLesson(l,p))return;
 library.open(id,mode)
}
$x('study').onclick=()=>{if(myGroups.has(sub))selectLesson('study');else oldStudy()};
$x('practice').onclick=()=>{if(myGroups.has(sub))selectLesson('quiz');else oldPractice()};
window.MathainoExtraCurriculum=Object.freeze({version:'0.6.77',subjects:newGroups.map(g=>g.code),lessons:library.lessons.filter(l=>myGroups.has(l.subject)).length});
})();