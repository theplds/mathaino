/* Μαθαίνω! v0.6.49 — πρωτότυπη ορθογραφία Α΄ Δημοτικού.
   Ξεχωριστές βαθμίδες και τρεις τρόποι γραφής, χωρίς βαθμούς ή χρονόμετρο. */
(function(){
'use strict';
const $s=id=>document.getElementById(id);
const lessons=[
 {name:'Οι πρώτες λέξεις',description:'Μικρές, καθημερινές λέξεις με εικόνες.',items:[
  ['παπί','duck',2],['γάτα','cat',1],['μήλο','apple',0],['νερό','water',1],['γάλα','milk',2],['ήλιος','sun',0]]},
 {name:'Προσέχω τον τόνο',description:'Γράφω σωστά και θυμάμαι πού μπαίνει ο τόνος.',items:[
  ['σπίτι','house',2],['σκύλος','dog',2],['δέντρο','tree',1],['καπέλο','hat',3],['ψωμί','bread',3],['βιβλίο','book',4]]},
 {name:'Πιο προχωρημένες λέξεις',description:'Εξασκούμαι σε λέξεις με ιδιαίτερα γράμματα και διαφορετικούς ήχους.',items:[
  ['ψάρι','fish',1],['μπάλα','ball',0],['πουλί','bird',1],['λουλούδι','flower',2],['μπανάνα','banana',3],['τρένο','train',2],['καράβι','ship',1],['αμάξι','car',3]]}
];
const modes=[
 {id:'tiles',title:'Βάζω γράμματα',description:'Βάλε τα γράμματα στη σειρά. Κάθε γράμμα έχει τον δικό του τόνο.'},
 {id:'missing',title:'Συμπληρώνω',description:'Λείπει ένα γράμμα. Διάλεξε ποιο ταιριάζει.'},
 {id:'write',title:'Γράφω μόνος μου',description:'Γράψε ολόκληρη τη λέξη στα ελληνικά, μαζί με τον τόνο.'}
];
let state={mode:'tiles',group:'all',items:[],index:0,tiles:[],selected:[],blank:-1,options:[],solved:false,tries:0,revealed:false,wrongOption:[],lastAnswer:''};
const normalize=x=>String(x||'').normalize('NFC').trim().replace(/\s+/g,' ').toLocaleLowerCase('el-GR');
const noAccent=x=>normalize(x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').normalize('NFC');
const variants=['α','ά','ε','έ','η','ή','ι','ί','ο','ό','υ','ύ','ω','ώ','β','δ','γ','π','τ','κ','μ','ν','λ','ρ','σ','ς','φ','χ','ψ'];
function shuffled(array){const a=array.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const tmp=a[i];a[i]=a[j];a[j]=tmp}return a}
function current(){return state.items[state.index]}
function speechError(message){$s('spellVoiceStatus').textContent=message}
function speakWord(){
 const word=current();
 if(!word)return;
 const synth=window.speechSynthesis;
 if(!synth||typeof window.SpeechSynthesisUtterance!=='function'){
  speechError('Δεν υπάρχει διαθέσιμη φωνή. Δες την εικόνα ή ζήτησε να σου πουν τη λέξη.');return
 }
 try{
  const voices=typeof synth.getVoices==='function'?synth.getVoices():[];
  const greek=voices.find(v=>/^el(-|$)/i.test(v.lang));
  if(voices.length&&!greek){
   speechError('Δεν βρέθηκε ελληνική φωνή στη συσκευή. Μπορείς να δεις τη λέξη ή να ρωτήσεις έναν ενήλικα.');return
  }
  synth.cancel();
  const utterance=new window.SpeechSynthesisUtterance(word.text);
  utterance.lang='el-GR';utterance.rate=.78;
  if(greek)utterance.voice=greek;
  utterance.onerror=()=>speechError('Δεν έγινε αναπαραγωγή. Μπορείς να δεις τη λέξη ή να ρωτήσεις έναν ενήλικα.');
  synth.speak(utterance);
  speechError('');
 }catch(e){speechError('Η φωνή δεν είναι διαθέσιμη στη συσκευή.')}
}
function makeTiles(word){
 const list=Array.from(word.text).map((letter,id)=>({id,letter}));
 let result=shuffled(list);
 if(result.map(x=>x.letter).join('')===word.text&&result.length>1){
  result=result.slice(1).concat(result[0]);
  if(result.map(x=>x.letter).join('')===word.text){const temp=result[0];result[0]=result[result.length-1];result[result.length-1]=temp}
 }
 return result
}
function makeOptions(word){
 const right=Array.from(word.text)[word.blank];
 const vowels='αάεέηήιίοόυύωώ';
 const pool=vowels.includes(right)?Array.from(vowels):variants.filter(x=>!vowels.includes(x));
 const chosen=shuffled(pool.filter(x=>x!==right)).slice(0,3);
 return shuffled([right,...chosen])
}
function getGroup(){
 const selected=$s('spellGroup').value;
 return selected==='all'?lessons.flatMap(g=>g.items.map(item=>({text:item[0],picture:item[1],blank:item[2],group:g.name}))):
  (lessons[Number(selected)]||lessons[0]).items.map(item=>({text:item[0],picture:item[1],blank:item[2],group:lessons[Number(selected)]?.name||lessons[0].name}))
}
function startSession(mode){
 state.mode=mode||state.mode;
 state.group=$s('spellGroup').value;
 state.items=shuffled(getGroup());
 if(state.group==='all')state.items=state.items.slice(0,8);
 state.index=0;
 $s('spellFinish').hidden=true;$s('spellExercise').hidden=false;
 renderWord()
}
function resetAnswer(){
 const word=current();
 state.tiles=makeTiles(word);state.selected=[];state.solved=false;state.tries=0;state.revealed=false;state.wrongOption=[];state.lastAnswer='';
 state.blank=word.blank;state.options=makeOptions(word);
}
function renderWord(){
 const word=current();
 if(!word){finish();return}
 resetAnswer();
 $s('spellWordArt').innerHTML=window.MathainoIllustrations?.word(word.picture)||'';
 $s('spellWordArt').setAttribute('aria-label','Εικόνα της λέξης που θα γράψεις');
 $s('spellCounter').textContent='Λέξη '+(state.index+1)+' από '+state.items.length;
 $s('spellUnitName').textContent=word.group;
 $s('spellProgress').setAttribute('aria-valuenow',String(state.index));
 $s('spellProgress').setAttribute('aria-valuemax',String(state.items.length));
 $s('spellProgressFill').style.width=(state.index/state.items.length*100)+'%';
 $s('spellModeDescription').textContent=modes.find(m=>m.id===state.mode)?.description||'';
 $s('spellFeedback').textContent='';
 $s('spellFeedback').dataset.state='';
 $s('spellVoiceStatus').textContent='';
 $s('spellReveal').hidden=true;$s('spellReveal').textContent='';$s('spellClue').hidden=true;$s('spellClue').textContent='';$s('spellClueButton').textContent='Μικρή βοήθεια';
 $s('spellRevealButton').textContent='Δες τη λέξη';
 $s('spellCheck').hidden=state.mode==='missing';
 $s('spellCheck').disabled=true;
 $s('spellNext').hidden=true;
 $s('spellTyping').hidden=state.mode!=='write';
 $s('spellTiles').hidden=state.mode!=='tiles';
 $s('spellMissing').hidden=state.mode!=='missing';
 const input=$s('spellInput');input.value='';input.disabled=false;
 const btns=$s('spellModeTabs').querySelectorAll('button');
 btns.forEach(b=>{const is=b.dataset.mode===state.mode;b.classList.toggle('active',is);b.setAttribute('aria-pressed',String(is))});
 renderAnswer();
}
function renderAnswer(){
 const word=current();
 if(!word)return;
 if(state.mode==='tiles'){
  const slots=$s('spellSlots'),choices=$s('spellLetters');
  slots.replaceChildren();choices.replaceChildren();
  for(let i=0;i<Array.from(word.text).length;i++){
   const id=state.selected[i],item=state.tiles.find(t=>t.id===id),b=document.createElement('button');
   b.type='button';b.className='spell-slot'+(item?' filled':'');b.textContent=item?.letter||'';
   b.disabled=!item||state.solved;
   b.setAttribute('aria-label',item?'Αφαίρεσε το γράμμα '+item.letter:'Κενό γράμμα '+(i+1));
   if(item)b.onclick=()=>{state.selected.splice(i,1);$s('spellFeedback').textContent='';renderAnswer()};
   slots.append(b)
  }
  for(const tile of state.tiles){
   const b=document.createElement('button');b.type='button';b.className='spell-tile';
   b.textContent=tile.letter;b.disabled=state.solved||state.selected.includes(tile.id);
   b.onclick=()=>{state.selected.push(tile.id);$s('spellFeedback').textContent='';renderAnswer()};
   choices.append(b)
  }
  $s('spellCheck').disabled=state.selected.length!==Array.from(word.text).length||state.solved;
  $s('spellUndo').disabled=!state.selected.length||state.solved
 }
 if(state.mode==='missing'){
  const letters=Array.from(word.text),area=$s('spellMissingWord'),options=$s('spellOptions');
  area.replaceChildren();options.replaceChildren();
  letters.forEach((char,i)=>{
   const item=document.createElement('span');item.className='spell-missing-char'+(i===state.blank?' gap':'');
   item.textContent=i===state.blank?'_':char;
   if(i===state.blank)item.setAttribute('aria-label','Γράμμα που λείπει');
   area.append(item)
  });
  state.options.forEach((char,i)=>{
   const button=document.createElement('button');button.type='button';button.className='spell-tile';
   button.textContent=char;button.disabled=state.solved||state.wrongOption.includes(i);
   button.onclick=()=>checkAnswer(char,i);
   options.append(button)
  })
 }
 if(state.mode==='write'){
  $s('spellCheck').disabled=!$s('spellInput').value.trim()||state.solved
 }
}
function safeLog(answer,correct){
 // Reuse existing family-scoped answer_events table and RLS. No schema change.
 if(!ready||!db||!cloudChildren?.[child])return;
 const word=current();if(!word)return;
 const event={
  child_id:cloudChildren[child].id,
  subject:'spelling',
  topic:word.group+' · '+modes.find(m=>m.id===state.mode).title,
  question:'Ορθογραφία Α΄: '+word.text,
  selected_answer:String(answer).slice(0,100),
  correct_answer:word.text,
  is_correct:correct,
  attempt_number:state.tries
 };
 db.from('answer_events').insert(event).then(({error})=>{if(error)console.warn('Spelling answer save failed',error.message)}).catch(e=>console.warn('Spelling answer save failed',e?.message));
}
function checkAnswer(answer,optionIndex){
 if(state.solved)return;
 const word=current();
 state.tries++;
 const chosen=normalize(answer);
 const right=state.mode==='missing'?Array.from(word.text)[state.blank]:word.text;
 const rightNorm=normalize(right);
 const good=chosen===rightNorm;
 safeLog(answer,good);
 if(good){
  state.solved=true;
  $s('spellFeedback').textContent='Σωστά! Η λέξη γράφεται «'+word.text+'».';
  $s('spellFeedback').dataset.state='good';
  $s('spellCheck').hidden=true;
  $s('spellNext').hidden=false;
  $s('spellNext').textContent=state.index===state.items.length-1?'Ολοκλήρωση':'Επόμενη λέξη';
  $s('spellProgressFill').style.width=((state.index+1)/state.items.length*100)+'%';
  $s('spellProgress').setAttribute('aria-valuenow',String(state.index+1));
  $s('spellInput').disabled=true;
  renderAnswer();
  return
 }
 if(state.mode==='missing'&&Number.isInteger(optionIndex))state.wrongOption.push(optionIndex);
 if(noAccent(chosen)===noAccent(rightNorm)&&chosen!==rightNorm){
  $s('spellFeedback').textContent='Τα γράμματα είναι σωστά. Πρόσεξε τον τόνο και δοκίμασε ξανά.';
 }else{
  $s('spellFeedback').textContent='Καλή προσπάθεια. Παρατήρησε την εικόνα και δοκίμασε ξανά. Μπορείς να δεις τη λέξη για βοήθεια.';
 }
 $s('spellFeedback').dataset.state='try';
 renderAnswer();
}
function checkCurrent(){
 if(state.solved)return;
 const answer=state.mode==='tiles'?state.selected.map(id=>state.tiles.find(t=>t.id===id)?.letter||'').join(''):$s('spellInput').value;
 if(!normalize(answer))return;
 checkAnswer(answer)
}
function nextWord(){
 if(!state.solved)return;
 if(state.index===state.items.length-1){finish();return}
 state.index++;renderWord()
}
function finish(){
 $s('spellExercise').hidden=true;$s('spellFinish').hidden=false;
 $s('spellFinishTitle').textContent='Ολοκλήρωσες τις λέξεις!';
 $s('spellFinishText').textContent='Δούλεψες με '+state.items.length+' λέξεις. Μπορείς να κάνεις ξανά εξάσκηση ή να διαλέξεις μια άλλη ενότητα. Χωρίς βιασύνη.';
}
function openSpelling(defaultMode){
 $s('spellGroup').value=$s('topic').value||'all';
 $s('spellFinish').hidden=true;$s('spellExercise').hidden=false;
 startSession(defaultMode||'tiles');
 viewAll('spellingLesson')
}
function fillUnits(){
 $s('spellGroup').replaceChildren(...[{value:'all',label:'Λίγο από όλα'},...lessons.map((g,i)=>({value:String(i),label:g.name}))].map(o=>{
  const el=document.createElement('option');el.value=o.value;el.textContent=o.label;return el
 }));
}
fillUnits();
$s('spellBack').onclick=()=>viewAll('home');
$s('spellGroup').onchange=()=>startSession(state.mode);
$s('spellRestart').onclick=()=>startSession(state.mode);
$s('spellTryAgain').onclick=()=>startSession(state.mode);
$s('spellFinishBack').onclick=()=>viewAll('home');
$s('spellNext').onclick=nextWord;
$s('spellCheck').onclick=checkCurrent;
$s('spellUndo').onclick=()=>{if(state.selected.length){state.selected.pop();$s('spellFeedback').textContent='';renderAnswer()}};
$s('spellInput').addEventListener('input',renderAnswer);
$s('spellInput').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();checkCurrent()}});
$s('spellSpeak').onclick=speakWord;
$s('spellClueButton').onclick=()=>{
 const clue=$s('spellClue'),shown=!clue.hidden;
 clue.hidden=shown;
 if(!shown){
  const chars=Array.from(current().text);
  clue.textContent='Αρχίζει από «'+chars[0]+'» και έχει '+chars.length+' γράμματα.';
 }
 $s('spellClueButton').textContent=shown?'Μικρή βοήθεια':'Κρύψε τη βοήθεια'
};
$s('spellRevealButton').onclick=()=>{
 state.revealed=!state.revealed;
 $s('spellReveal').hidden=!state.revealed;
 $s('spellReveal').textContent=state.revealed?current().text:'';
 $s('spellRevealButton').textContent=state.revealed?'Κρύψε τη λέξη':'Δες τη λέξη';
};
$s('spellModeTabs').querySelectorAll('button').forEach(btn=>{
 btn.onclick=()=>{if(btn.dataset.mode!==state.mode)startSession(btn.dataset.mode)}
});
const oldViewAll=viewAll;
viewAll=function(id){
 const destination=ready||id==='auth'||id==='passwordRecovery'?id:'auth';
 oldViewAll(destination);
 $s('spellingLesson').classList.toggle('hidden',destination!=='spellingLesson')
};
const oldChooseChild=chooseChild;
chooseChild=function(index){
 oldChooseChild(index);
 const p=profiles[index]||{};
 const button=document.querySelector('#subjects [data-sub="spelling"]');
 if(button){
  const firstGrade=p.grade==='Α΄ Δημοτικού'||p.grade==='Β΄ Δημοτικού';
  button.hidden=p.spellingConfigured?!(p.allowed||[]).includes('spelling'):!(firstGrade||(p.allowed||[]).includes('spelling'));
 }
 const selected=document.querySelector('#subjects button.active:not([hidden])');
 if(!selected){const first=document.querySelector('#subjects button:not([hidden])');if(first)first.click()}
 refreshSubjectPanel()
};
const oldTopics=topics;
topics=function(){
 if(sub!=='spelling'){oldTopics();return}
 $s('topic').replaceChildren(...[{name:'Λίγο από όλα',value:'all'},...lessons.map((g,i)=>({name:g.name,value:String(i)}))].map(g=>{
  const o=document.createElement('option');o.value=g.value;o.textContent=g.name;return o
 }));
 refreshSubjectPanel();
 $s('selectedSubjectDescription').textContent='Γράμματα, τόνοι και λέξεις. Γράφω με τα δικά μου χέρια.';
 $s('countGroup').hidden=true;
 $s('study').textContent='Μαθαίνω με γράμματα';
 $s('practice').textContent='Γράφω μόνος μου'
};
const priorStudy=$s('study').onclick,priorPractice=$s('practice').onclick;
$s('study').onclick=()=>{if(sub==='spelling')openSpelling('tiles');else priorStudy()};
$s('practice').onclick=()=>{if(sub==='spelling')openSpelling('write');else priorPractice()};
const subjectButton=document.querySelector('#subjects [data-sub="spelling"]');
if(subjectButton){
 subjectButton.innerHTML='<span class="subject-illustration" aria-hidden="true"><svg viewBox="0 0 360 210" role="img" xmlns="http://www.w3.org/2000/svg"><rect width="360" height="210" rx="24" fill="#eaf3ee"/><path d="M97 33q-8 1-8 10v129q0 8 9 8h167q9 0 9-9V43q0-10-11-10Z" fill="#fdfbf2" stroke="#3c6a79" stroke-width="4"/><path d="M115 70q56-5 130 0M115 98q53-4 130 0M115 128q56-4 130 0M115 155q49-3 112 0" stroke="#b4d5d7" stroke-width="2" stroke-linecap="round"/><text x="130" y="120" font-size="43" font-weight="780" fill="#396c78" font-family="system-ui,sans-serif">Α α</text><path d="m217 148 47-70 17 12-47 70-26 15Z" fill="#edc37e" stroke="#416876" stroke-width="4" stroke-linejoin="round"/><path d="m208 175 26-15-15-11Z" fill="#fff7e9" stroke="#416876" stroke-width="3"/></svg></span><span class="subject-title">Ορθογραφία Α΄</span><span class="subject-desc">Γράφω λέξεις, γράμματα και τόνους</span>';
 subjectButton.setAttribute('aria-label','Ορθογραφία Α΄ Δημοτικού');
}
window.MathainoSpelling=Object.freeze({wordCount:lessons.reduce((n,g)=>n+g.items.length,0),groups:lessons.map(g=>g.name),modes:modes.map(m=>m.id),normalize,noAccent});
})();