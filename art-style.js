/* Μαθαίνω! v0.6.67 — illustration appearance per child.
   The mature "sketchbook" option is a distinct treatment of the ORIGINAL
   SVG illustrations, not an invented external artwork collection. */
(function(){
'use strict';
const valid=['auto','crayon','warm','sketch'];
function effective(profile){
 const requested=valid.includes(profile?.illustrationStyle)?profile.illustrationStyle:'auto';
 if(requested!=='auto')return requested;
 return /^(Α|Β|Γ)/.test(String(profile?.grade||''))?'crayon':'sketch'
}
function currentProfile(){
 try{return typeof profiles!=='undefined'&&typeof child!=='undefined'&&child>=0?profiles[child]:null}catch(e){return null}
}
function render(key,wide){
 const style=effective(currentProfile());
 const crayons=()=>window.MathainoCrayonArt?.word(key)||'';
 const warm=()=>window.MathainoWarmArt?.draw(key,!!wide)||'';
 return style==='crayon'?crayons()||warm():warm()||crayons()
}
function apply(profile){
 document.body.dataset.illustrationStyle=effective(profile);
 document.body.dataset.illustrationChoice=valid.includes(profile?.illustrationStyle)?profile.illustrationStyle:'auto'
}
const previousChoose=chooseChild;
chooseChild=function(index){
 previousChoose(index);
 apply(typeof profiles!=='undefined'?profiles[index]:null)
};
const select=document.getElementById('artStyleOpt');
if(select){
 select.onchange=()=>{
  const grade=document.getElementById('editGrade')?.value||'';
  const sample=effective({grade,illustrationStyle:select.value});
  const note=document.getElementById('artStyleHint');
  if(note)note.textContent=select.value==='auto'?
   'Προτεινόμενο για αυτή την τάξη: '+(sample==='crayon'?'Κηρομπογιές':'Σκίτσο')+'.':
   'Η επιλογή εφαρμόζεται στις εικόνες μαθημάτων. Οι εικόνες προφίλ δεν αλλάζουν.'
 };
 document.getElementById('editGrade')?.addEventListener('change',()=>select.onchange());
 const priorLoad=loadEditor;
 loadEditor=function(){
  priorLoad();
  const profile=profiles[editing]||{};
  select.value=valid.includes(profile.illustrationStyle)?profile.illustrationStyle:'auto';
  select.onchange()
 };
}
window.MathainoArtStyle=Object.freeze({render,effective,apply,choices:valid.slice()});
})();