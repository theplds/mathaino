/* Μαθαίνω! · independent interactive design prototype.
   All activities and illustrations are original, zero user data and no streaks. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const subjectArt=(id)=>window.MathainoIllustrations?.subject(id)||'';
const wordArt=(id)=>window.MathainoIllustrations?.word(id)||'';
const energyArt=(id)=>window.MathainoArt?.draw(id,false)||subjectArt('science5');
const readingWords=[
  {id:'duck',label:'παπί',letters:'ΠΑΠΙ'},
  {id:'cat',label:'γάτα',letters:'ΓΑΤΑ'},
  {id:'apple',label:'μήλο',letters:'ΜΗΛΟ'}
];
const historyStages=[
  {name:'Η ανάγκη',description:'Σε κάποιες ελληνικές πόλεις η καλλιεργήσιμη γη δεν έφτανε για όλους. Οι άνθρωποι αναζητούσαν νέες ευκαιρίες για να ζήσουν και να εμπορευτούν.',micro:'Τι χρειαζόταν μια οικογένεια για να ζήσει; Γη, τροφή και ασφάλεια.'},
  {name:'Το ταξίδι',description:'Ομάδες ανθρώπων ταξίδευαν με καράβια. Περνούσαν τη θάλασσα αναζητώντας τόπους με λιμάνια, νερό και γη για καλλιέργεια.',micro:'Το καράβι ήταν βασικό μέσο μετακίνησης και επικοινωνίας.'},
  {name:'Η νέα πόλη',description:'Στον νέο τόπο ίδρυαν μια αποικία. Η νέα πόλη διατηρούσε δεσμούς, γλώσσα και έθιμα με τη μητρόπολη, αλλά οργάνωνε και τη δική της ζωή.',micro:'Μητρόπολη λέγεται η πόλη από την οποία ξεκίνησαν οι άποικοι.'}
];
const physicsSteps=[
  {id:'circuit',question:'Τι μορφή ενέργειας μεταφέρεται στα καλώδια;',correct:'Ηλεκτρική',scene:'Το λαμπάκι συνδέεται σε ένα ηλεκτρικό κύκλωμα.',why:'Η ηλεκτρική ενέργεια μεταφέρεται μέσα από το κύκλωμα και μπορεί να μετατραπεί σε φως.'},
  {id:'bread',question:'Ποια μορφή ενέργειας είναι αποθηκευμένη στην τροφή;',correct:'Χημική',scene:'Ένα κομμάτι ψωμί είναι τροφή για τον οργανισμό.',why:'Στην τροφή υπάρχει αποθηκευμένη χημική ενέργεια που μπορεί να αξιοποιήσει το σώμα μας.'},
  {id:'ball',question:'Ποια μορφή ενέργειας έχει η μπάλα όταν κυλά;',correct:'Κινητική',scene:'Μια μπάλα κυλάει στο έδαφος.',why:'Η μπάλα έχει κινητική ενέργεια επειδή κινείται.'}
];
const physicsOptions=['Ηλεκτρική','Κινητική','Χημική'];
const state={screen:'home',theme:'light',sketch:true,sidebar:false,wordIndex:0,letters:[],tiles:[],wordCorrect:false,historyIndex:0,historyCorrect:false,physicsIndex:0,physicsCorrect:[false,false,false]};
function setTheme(mode){
  state.theme=mode==='dark'?'dark':'light';
  document.documentElement.dataset.theme=state.theme;
  $('themeLabel').textContent=state.theme==='dark'?'Φωτεινό θέμα':'Σκούρο θέμα';
  $('themeToggle').setAttribute('aria-label',state.theme==='dark'?'Ενεργοποίηση φωτεινού θέματος':'Ενεργοποίηση σκούρου θέματος');
  try{localStorage.setItem('mathaino-design-demo-theme',state.theme)}catch(e){}
}
function setSketch(enabled){
  state.sketch=!!enabled;
  document.documentElement.dataset.sketch=state.sketch?'on':'off';
  $('sketchToggle').setAttribute('aria-pressed',String(state.sketch));
  $('sketchToggle').setAttribute('aria-label',state.sketch?'Απενεργοποίηση του χειροποίητου στυλ 25%':'Ενεργοποίηση του χειροποίητου στυλ 25%');
  $('sketchLabel').textContent=state.sketch?'25% χειροποίητο':'Τέλεια ίσιο';
}
function closeSidebar(){
  state.sidebar=false;
  $('sidebar').classList.remove('open');
  $('scrim').hidden=true;
  $('menuToggle').setAttribute('aria-expanded','false');
  $('menuToggle').setAttribute('aria-label','Άνοιγμα μενού');
}
function openSidebar(){
  state.sidebar=true;
  $('sidebar').classList.add('open');
  $('scrim').hidden=false;
  $('menuToggle').setAttribute('aria-expanded','true');
  $('menuToggle').setAttribute('aria-label','Κλείσιμο μενού');
}
function goTo(screen){
  if(!['home','reading','history','physics'].includes(screen))return;
  state.screen=screen;
  ['home','reading','history','physics'].forEach(id=>$(id+'Screen').hidden=id!==screen);
  for(const item of document.querySelectorAll('[data-nav]')){
    const active=item.dataset.nav===screen;
    item.classList.toggle('active',active);
    if(active)item.setAttribute('aria-current','page');else item.removeAttribute('aria-current')
  }
  if(screen==='reading')startReading();
  if(screen==='history')startHistory();
  if(screen==='physics')startPhysics();
  closeSidebar();
  window.scrollTo({top:0,behavior:'instant'});
}
function svgImages(){
  $('heroArtwork').innerHTML=wordArt('duck');
  $('readingCardArt').innerHTML=subjectArt('reading');
  $('historyCardArt').innerHTML=subjectArt('history');
  $('physicsCardArt').innerHTML=subjectArt('science5');
  $('historyArtwork').innerHTML=subjectArt('history')
}
function newTileOrder(word){
  const tiles=Array.from(word.letters).map((letter,id)=>({id,letter}));
  for(let i=tiles.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    const tmp=tiles[i];tiles[i]=tiles[j];tiles[j]=tmp
  }
  // Avoid showing an already-solved sequence by accident.
  if(tiles.map(t=>t.letter).join('')===word.letters&&tiles.length>1)tiles.reverse();
  if(tiles.map(t=>t.letter).join('')===word.letters&&tiles.length>2){
    const t=tiles[0];tiles[0]=tiles[2];tiles[2]=t
  }
  return tiles
}
function startReading(){state.wordIndex=0;setupWord()}
function setupWord(){
  const word=readingWords[state.wordIndex];
  state.letters=[];state.wordCorrect=false;state.tiles=newTileOrder(word);
  $('readingPicture').innerHTML=wordArt(word.id);
  $('readingPicture').setAttribute('aria-label','Εικόνα: '+word.label);
  $('readingCounter').textContent='Λέξη '+(state.wordIndex+1)+' από '+readingWords.length;
  $('readingProgress').setAttribute('aria-valuenow',String(state.wordIndex));
  $('readingProgressBar').style.width=(100*state.wordIndex/readingWords.length)+'%';
  showWordFeedback('','');
  renderWord()
}
function showWordFeedback(message,kind){
  $('readingFeedback').textContent=message;
  if(kind)$('readingFeedback').dataset.kind=kind;
  else delete $('readingFeedback').dataset.kind
}
function removeLetter(index){
  if(state.wordCorrect)return;
  state.letters.splice(index,1);
  showWordFeedback('','');renderWord()
}
function addLetter(id){
  if(state.wordCorrect)return;
  const word=readingWords[state.wordIndex];
  if(state.letters.length>=word.letters.length||state.letters.includes(id))return;
  state.letters.push(id);showWordFeedback('','');renderWord()
}
function renderWord(){
  const word=readingWords[state.wordIndex],slotArea=$('letterSlots'),tileArea=$('letterChoices');
  slotArea.replaceChildren();tileArea.replaceChildren();
  for(let index=0;index<word.letters.length;index++){
    const tileId=state.letters[index],tile=state.tiles.find(t=>t.id===tileId);
    const button=document.createElement('button');
    button.type='button';
    button.className='letter-slot'+(tile?' filled':'');
    button.textContent=tile?tile.letter:'';
    button.setAttribute('aria-label',tile?'Αφαίρεσε το γράμμα '+tile.letter+' από τη θέση '+(index+1):'Κενή θέση '+(index+1));
    button.disabled=!tile||state.wordCorrect;
    if(tile)button.onclick=()=>removeLetter(index);
    slotArea.append(button)
  }
  for(const tile of state.tiles){
    const button=document.createElement('button');
    button.type='button';
    const used=state.letters.includes(tile.id);
    button.className='letter-tile'+(used?' used':'');
    button.textContent=tile.letter;
    button.setAttribute('aria-label','Βάλε το γράμμα '+tile.letter);
    button.disabled=used||state.wordCorrect;
    button.onclick=()=>addLetter(tile.id);
    tileArea.append(button)
  }
  $('undoLetter').disabled=state.wordCorrect||state.letters.length===0;
  $('checkWord').hidden=state.wordCorrect;
  $('checkWord').disabled=state.letters.length!==word.letters.length;
  $('nextWord').hidden=!state.wordCorrect;
  $('nextWord').textContent=state.wordIndex===readingWords.length-1?'Ξανά από την αρχή':'Επόμενη λέξη →'
}
function checkWord(){
  const word=readingWords[state.wordIndex];
  const guess=state.letters.map(id=>state.tiles.find(t=>t.id===id).letter).join('');
  if(guess.length!==word.letters.length)return;
  if(guess===word.letters){
    state.wordCorrect=true;
    $('readingProgress').setAttribute('aria-valuenow',String(state.wordIndex+1));
    $('readingProgressBar').style.width=(100*(state.wordIndex+1)/readingWords.length)+'%';
    showWordFeedback('Μπράβο! Έφτιαξες τη λέξη «'+word.label+'».','success');
  }else{
    showWordFeedback('Κοντά είσαι. Δοκίμασε να αλλάξεις τη σειρά των γραμμάτων.','error')
  }
  renderWord()
}
function nextReadingWord(){
  state.wordIndex=(state.wordIndex+1)%readingWords.length;setupWord()
}
function listenToWord(){
  const word=readingWords[state.wordIndex];
  if(!('speechSynthesis'in window)||!('SpeechSynthesisUtterance'in window)){
    showWordFeedback('Η φωνητική ανάγνωση δεν υποστηρίζεται σε αυτή τη συσκευή.','error');return
  }
  try{
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(word.label);
    utterance.lang='el-GR';utterance.rate=.82;
    window.speechSynthesis.speak(utterance)
  }catch(error){showWordFeedback('Δεν ήταν δυνατή η αναπαραγωγή ήχου.','error')}
}
function startHistory(){state.historyIndex=0;state.historyCorrect=false;renderHistory()}
function renderHistory(){
  const idx=state.historyIndex,step=historyStages[idx];
  $('historyCounter').textContent='Στάση '+(idx+1)+' από '+historyStages.length;
  $('historyProgress').setAttribute('aria-valuenow',String(idx+1));
  $('historyProgressBar').style.width=(100*(idx+1)/historyStages.length)+'%';
  $('historyStepTitle').textContent=step.name;
  $('historyStepText').textContent=step.description+' '+step.micro;
  $('historyTimeline').replaceChildren(...historyStages.map((item,i)=>{
    const b=document.createElement('button');b.type='button';b.className='timeline-step'+(idx===i?' active':'');
    const num=document.createElement('small');num.textContent='ΣΤΑΣΗ '+(i+1);
    const title=document.createElement('strong');title.textContent=item.name;
    b.append(num,title);b.setAttribute('aria-pressed',String(i===idx));
    b.onclick=()=>{state.historyIndex=i;renderHistory()};
    return b
  }));
  $('historyPrev').disabled=idx===0;
  $('historyNext').textContent=idx===historyStages.length-1?'Επιστροφή στα μαθήματα':'Επόμενη στάση →';
  $('historyQuestion').hidden=idx!==historyStages.length-1;
  if(idx===historyStages.length-1)renderHistoryQuestion()
}
function renderHistoryQuestion(){
  const choices=[
    {text:'Για να βρουν γη και εμπορικές ευκαιρίες',correct:true},
    {text:'Για να ξεχάσουν την ελληνική γλώσσα',correct:false},
    {text:'Για να μη χρησιμοποιούν πια καράβια',correct:false}
  ];
  $('historyAnswers').replaceChildren(...choices.map(choice=>{
    const b=document.createElement('button');b.type='button';b.textContent=choice.text;
    if(state.historyCorrect&&choice.correct)b.classList.add('correct');
    b.disabled=state.historyCorrect;
    b.onclick=()=>{
      if(choice.correct){
        state.historyCorrect=true;
        $('historyFeedback').textContent='Σωστά! Η ανάγκη για γη και το εμπόριο ήταν σημαντικοί λόγοι για τον αποικισμό.';
        $('historyFeedback').dataset.kind='success';renderHistoryQuestion()
      }else{
        b.classList.add('incorrect');b.disabled=true;
        $('historyFeedback').textContent='Σκέψου γιατί μια οικογένεια θα αναζητούσε νέα γη.';
        $('historyFeedback').dataset.kind='error'
      }
    };
    return b
  }));
  if(state.historyCorrect){$('historyFeedback').textContent='Σωστά! Η ανάγκη για γη και το εμπόριο ήταν σημαντικοί λόγοι για τον αποικισμό.';$('historyFeedback').dataset.kind='success'}
  else{$('historyFeedback').textContent='';delete $('historyFeedback').dataset.kind}
}
function historyNext(){
  if(state.historyIndex===historyStages.length-1){goTo('home');return}
  state.historyIndex++;renderHistory()
}
function historyPrevious(){
  if(state.historyIndex===0)return;
  state.historyIndex--;renderHistory()
}
function startPhysics(){state.physicsIndex=0;state.physicsCorrect=[false,false,false];renderPhysics()}
function renderPhysics(){
  const idx=state.physicsIndex,step=physicsSteps[idx],solved=state.physicsCorrect[idx];
  $('physicsCounter').textContent='Παράδειγμα '+(idx+1)+' από '+physicsSteps.length;
  $('physicsProgress').setAttribute('aria-valuenow',String(idx+(solved?1:0)));
  $('physicsProgressBar').style.width=(100*(idx+(solved?1:0))/physicsSteps.length)+'%';
  $('physicsArtwork').innerHTML=energyArt(step.id);
  $('physicsArtwork').setAttribute('aria-label','Εικονογράφηση: '+step.scene);
  $('physicsScene').textContent=step.scene;
  $('physicsQuestion').textContent=step.question;
  $('physicsPrev').disabled=idx===0;
  $('physicsNext').hidden=!solved;
  $('physicsNext').textContent=idx===physicsSteps.length-1?'Ξανά από την αρχή':'Επόμενο παράδειγμα →';
  $('physicsFeedback').textContent=solved?step.why:'';
  if(solved)$('physicsFeedback').dataset.kind='success';
  else delete $('physicsFeedback').dataset.kind;
  $('physicsAnswers').replaceChildren(...physicsOptions.map(answer=>{
    const b=document.createElement('button');b.type='button';b.textContent=answer;
    if(solved&&answer===step.correct)b.classList.add('correct');
    b.disabled=solved;
    b.onclick=()=>{
      if(answer===step.correct){state.physicsCorrect[idx]=true;renderPhysics()}
      else{b.classList.add('incorrect');b.disabled=true;$('physicsFeedback').textContent='Δες ξανά την εικόνα και προσπάθησε πάλι.';$('physicsFeedback').dataset.kind='error'}
    };
    return b
  }))
}
function nextPhysics(){
  state.physicsIndex=(state.physicsIndex+1)%physicsSteps.length;
  if(state.physicsIndex===0)state.physicsCorrect=[false,false,false];
  renderPhysics()
}
function prevPhysics(){
  if(state.physicsIndex>0){state.physicsIndex--;renderPhysics()}
}
function bind(){
  document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>goTo(button.dataset.open)));
  document.querySelectorAll('[data-nav]').forEach(button=>button.addEventListener('click',()=>goTo(button.dataset.nav)));
  $('themeToggle').onclick=()=>setTheme(state.theme==='light'?'dark':'light');
  $('sketchToggle').onclick=()=>setSketch(!state.sketch);
  $('menuToggle').onclick=()=>state.sidebar?closeSidebar():openSidebar();
  $('scrim').onclick=closeSidebar;
  window.addEventListener('keydown',event=>{if(event.key==='Escape'&&state.sidebar)closeSidebar()});
  $('undoLetter').onclick=()=>{if(state.letters.length)removeLetter(state.letters.length-1)};
  $('checkWord').onclick=checkWord;
  $('nextWord').onclick=nextReadingWord;
  $('speakWord').onclick=listenToWord;
  $('historyNext').onclick=historyNext;
  $('historyPrev').onclick=historyPrevious;
  $('physicsNext').onclick=nextPhysics;
  $('physicsPrev').onclick=prevPhysics;
}
function initialize(){
  try{const saved=localStorage.getItem('mathaino-design-demo-theme');if(saved==='dark'||saved==='light')setTheme(saved);else setTheme('light')}catch(e){setTheme('light')}
  setSketch(true);svgImages();bind();goTo('home')
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});
else initialize();
})();
