
const vocab={fr:{'Ζώα':[['chat','γάτα'],['chien','σκύλος'],['oiseau','πουλί'],['poisson','ψάρι'],['cheval','άλογο'],['lapin','κουνέλι']],'Χρώματα':[['rouge','κόκκινο'],['bleu','μπλε'],['vert','πράσινο'],['jaune','κίτρινο'],['noir','μαύρο'],['blanc','λευκό']],'Ημέρες':[['lundi','Δευτέρα'],['mardi','Τρίτη'],['mercredi','Τετάρτη'],['jeudi','Πέμπτη'],['vendredi','Παρασκευή'],['samedi','Σάββατο'],['dimanche','Κυριακή']],'Εποχές':[['printemps','άνοιξη'],['été','καλοκαίρι'],['automne','φθινόπωρο'],['hiver','χειμώνας']]},en:{'Ζώα':[['cat','γάτα'],['dog','σκύλος'],['bird','πουλί'],['fish','ψάρι'],['horse','άλογο'],['rabbit','κουνέλι']],'Χρώματα':[['red','κόκκινο'],['blue','μπλε'],['green','πράσινο'],['yellow','κίτρινο'],['black','μαύρο'],['white','λευκό']],'Ημέρες':[['Monday','Δευτέρα'],['Tuesday','Τρίτη'],['Wednesday','Τετάρτη'],['Thursday','Πέμπτη'],['Friday','Παρασκευή'],['Saturday','Σάββατο'],['Sunday','Κυριακή']],'Εποχές':[['spring','άνοιξη'],['summer','καλοκαίρι'],['autumn','φθινόπωρο'],['winter','χειμώνας']]}};
const $=x=>document.getElementById(x);let sub='math',data=[],qs=[],i=0,first=0,miss=false,skippedQuiz=[];function shuffle(a){return [...a].sort(()=>Math.random()-.5)}function screen(id){['home','historyLesson','learn','test','end'].forEach(x=>$(x).classList.toggle('hidden',x!==id));scrollTo(0,0)}function topics(){let names=sub==='math'?['Όλες οι προπαίδειες',...Array.from({length:10},(_,i)=>'Προπαίδεια του '+(i+1))]:['Όλες οι κατηγορίες',...Object.keys(vocab[sub])];$('topic').replaceChildren(...names.map((name,i)=>{let o=document.createElement('option');o.value=i;o.textContent=name;return o}))}function entries(){let n=+$('topic').value;if(sub==='math'){let nums=n?[n]:Array.from({length:10},(_,i)=>i+1);return nums.flatMap(t=>Array.from({length:10},(_,i)=>({q:t+' × '+(i+1),a:String(t*(i+1))})))}let names=Object.keys(vocab[sub]);return(n?[names[n-1]]:names).flatMap(x=>vocab[sub][x].map(([q,a])=>({q,a})))}function study(){data=entries();$('learnTitle').textContent=$('topic').selectedOptions[0].textContent;$('cards').replaceChildren(...data.map(x=>{let d=document.createElement('div');d.className='card';let s=document.createElement('strong');s.textContent=x.q;let b=document.createElement('button');b.textContent='Δες απάντηση';b.dataset.answer=x.a;b.dataset.visible='0';b.onclick=()=>{b.dataset.visible=b.dataset.visible==='0'?'1':'0';b.textContent=b.dataset.visible==='1'?x.a:'Δες απάντηση'};d.append(s,b);return d}));screen('learn')}function toggleAnswers(visible){document.querySelectorAll('#cards button').forEach(b=>{b.dataset.visible=visible?'1':'0';b.textContent=visible?b.dataset.answer:'Δες απάντηση'})}function start(){data=entries();let order=shuffle(data);qs=Array.from({length:+$('count').value},(_,j)=>order[j%order.length]);i=0;first=0;skippedQuiz=[];render();screen('test')}function render(){miss=false;$('progress').textContent='Ερώτηση '+(i+1)+' από '+qs.length;$('question').textContent=qs[i].q+' = ?';$('feedback').textContent='';$('next').classList.add('hidden');$('skipQuestion').classList.remove('hidden');let right=qs[i].a;let pool=sub==='math'?Array.from({length:100},(_,i)=>String(i+1)):data.map(x=>x.a);let opts=shuffle([right,...shuffle([...new Set(pool.filter(x=>x!==right))]).slice(0,3)]);$('answers').replaceChildren(...opts.map(answer=>{let b=document.createElement('button');b.className='choice';b.textContent=answer;b.onclick=()=>{if(answer===right){b.classList.add('good');if(!miss)first++;$('feedback').textContent='Σωστά!';$('answers').querySelectorAll('button').forEach(x=>x.disabled=true);$('next').classList.remove('hidden');$('skipQuestion').classList.add('hidden')}else{miss=true;b.classList.add('bad');b.disabled=true;$('feedback').textContent='Δοκίμασε ξανά!'}};return b}))}document.querySelectorAll('#subjects button').forEach(b=>b.onclick=()=>{sub=b.dataset.sub;document.querySelectorAll('#subjects button').forEach(x=>x.classList.toggle('active',x===b));topics()});document.querySelectorAll('.back').forEach(b=>b.onclick=()=>screen('home'));$('study').onclick=study;$('practice').onclick=start;$('practiceFromStudy').onclick=start;$('hide').onclick=()=>toggleAnswers(false);$('show').onclick=()=>toggleAnswers(true);function advanceQuiz(){i++;if(i===qs.length){$('summary').textContent='Σωστά με την πρώτη: '+first+' από '+qs.length+'.'+(skippedQuiz.length?' Παρέλειψες '+skippedQuiz.length+' '+(skippedQuiz.length===1?'ερώτηση.':'ερωτήσεις.'):'')+' Μπορείς να ξαναδοκιμάσεις όποτε θέλεις.';$('retrySkippedQuestions').hidden=!skippedQuiz.length;screen('end')}else render()}
$('next').onclick=advanceQuiz;
$('skipQuestion').onclick=()=>{if(!$('next').classList.contains('hidden'))return;skippedQuiz.push(qs[i]);advanceQuiz()};
$('retrySkippedQuestions').onclick=()=>{if(!skippedQuiz.length)return;qs=skippedQuiz.slice();skippedQuiz=[];i=0;first=0;render();screen('test')};topics();if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});

function lineIcon(name){const paths={"next":"<path d=\"M5 5v14l10-7zM19 5v14\"/>","volume-off":"<path d=\"M3 10v4h4l5 4V6l-5 4H3zM16 9l5 6m0-6l-5 6\"/>","captions":"<rect x=\"2\" y=\"5\" width=\"20\" height=\"14\" rx=\"2\"/><path d=\"M10 10a2 2 0 1 0 0 4m8-4a2 2 0 1 0 0 4\"/>","theater":"<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"1\"/><path d=\"M5 16h14\"/>","energy":"<path d=\"M13 2 5 13h6l-1 9 9-12h-6z\"/>","play":"<path d=\"M8 5l11 7-11 7z\"/>","pause":"<path d=\"M8 5v14M16 5v14\"/>","repeat":"<path d=\"M20 8V4h-4M20 4a9 9 0 1 0 2 11\"/>","fullscreen":"<path d=\"M9 3H3v6M15 3h6v6M3 15v6h6M21 15v6h-6\"/>","close":"<path d=\"M5 5l14 14M19 5L5 19\"/>","book":"<path d=\"M12 5C8 3 5 4 3 5v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-2-9 0zM12 5v15\"/>","settings":"<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M10 2h4l.6 2.5 2 .8 2.2-1.3 2.8 2.8-1.3 2.2.8 2L23 12l-1.9 1-.8 2 1.3 2.2-2.8 2.8-2.2-1.3-2 .8L14 22h-4l-.6-2.5-2-.8-2.2 1.3-2.8-2.8 1.3-2.2-.8-2L1 12l1.9-1 .8-2-1.3-2.2 2.8-2.8 2.2 1.3 2-.8z\"/>","lock":"<rect x=\"5\" y=\"10\" width=\"14\" height=\"11\" rx=\"2\"/><path d=\"M8 10V7a4 4 0 0 1 8 0v3M12 15v2\"/>","chart":"<path d=\"M4 20V4M4 20h17M8 16v-5M13 16V7M18 16v-9\"/>","pencil":"<path d=\"m4 20 4-.8L20 7l-3-3L5 16zM15 6l3 3\"/>","plus":"<path d=\"M12 4v16M4 12h16\"/>","multiply":"<path d=\"M5 5l14 14M19 5 5 19\"/>","reading":"<path d=\"M12 5C8 3 5 4 3 5v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-2-9 0zM12 5v15\"/>","language":"<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M3 12h18M12 3c-5 5-5 13 0 18M12 3c5 5 5 13 0 18\"/>","star":"<path d=\"m12 3 2.8 5.8 6.4.9-4.6 4.5 1.1 6.4L12 17.6l-5.7 3 1.1-6.4-4.6-4.5 6.4-.9z\"/>","boy":"<circle cx=\"12\" cy=\"9\" r=\"5\"/><path d=\"M4 22c0-5 3-8 8-8s8 3 8 8M7 7l2-3 4 2 4-2\"/>","girl":"<circle cx=\"12\" cy=\"9\" r=\"5\"/><path d=\"M4 22c0-5 3-8 8-8s8 3 8 8M7 6c-2 0-3 3-3 6M17 6c2 0 3 3 3 6\"/>","fox":"<path d=\"M4 4 8 7l4-2 4 2 4-3-1 12-7 5-7-5zM9 13h.1M15 13h.1M11 17l1 1 1-1\"/>","bear":"<circle cx=\"6\" cy=\"6\" r=\"3\"/><circle cx=\"18\" cy=\"6\" r=\"3\"/><circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"9\" cy=\"11\" r=\".6\"/><circle cx=\"15\" cy=\"11\" r=\".6\"/><path d=\"M10 15q2 3 4 0\"/>","duck":"<path d=\"M5 15q-3-5 2-8l2 2q3-5 7-2 3 2 2 6l4 1-4 2q-2 6-9 4-4-1-4-5zM14 10h.1\"/>","ball":"<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"m12 7 4 3-1.5 5h-5L8 10zM12 7V3M16 10l5-1M14.5 15l3 5M9.5 15l-3 5M8 10 3 9\"/>","apple":"<path d=\"M12 8C6 4 3 9 5 16c2 7 6 5 7 4 1 1 5 3 7-4 2-7-1-12-7-8zM12 8q0-5 3-6M12 7q-4-5-7-3\"/>","cat":"<path d=\"M4 10 5 3l5 4h4l5-4 1 7v6q-2 5-8 5t-8-5zM9 13h.1M15 13h.1M12 15l-1 1h2zM8 17l-5 1M16 17l5 1\"/>","house":"<path d=\"m3 11 9-8 9 8v10H3zM9 21v-8h6v8\"/>","fish":"<path d=\"M3 12q7-10 15 0-8 10-15 0zM18 12l4-5v10zM8 11h.1\"/>","water":"<path d=\"M12 2C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-13zM9 16q0 3 3 3\"/>","sun":"<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2\"/>"};return '<svg class="line-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+(paths[name]||paths.star)+'</svg>'}function avatarIcon(value){const legacy={ [String.fromCodePoint(0x1f466)]:'boy',[String.fromCodePoint(0x1f467)]:'girl',[String.fromCodePoint(0x1f98a)]:'fox',[String.fromCodePoint(0x1f43b)]:'bear',[String.fromCodePoint(0x2b50)]:'star'};return legacy[value]||({boy:'boy',girl:'girl',blond:'blond',glasses:'glasses',cap:'cap',princess:'princess',pirate:'pirate',dino:'dino',foxhood:'foxhood',fox:'fox',bear:'bear',cat:'cat',owl:'owl',robot:'robot',astronaut:'astronaut',star:'star'})[value]||'star'}function iconizeUI(){const targets=[['h1','book','Μαθαίνω!'],['#openParent','settings','Ρυθμίσεις γονέα'],['#parentUnlock h2','lock','Είσοδος γονέα'],['#openReports','chart','Αναφορές μάθησης'],['#study','reading','Μελέτη'],['#practice','pencil','Εξάσκηση']];for(const [sel,key,label] of targets){const el=document.querySelector(sel);if(el)el.innerHTML=lineIcon(key)+' '+label}for(const b of document.querySelectorAll('#subjects button')){
const id=b.dataset.sub,title=b.textContent.trim(),library=window.MathainoIllustrations;
const fallback=({math:'multiply',fr:'language',en:'language',addition:'plus',reading:'reading',history:'book',history5:'book',science5:'energy'})[id];
const picture=library?.subject(id)||lineIcon(fallback);
b.innerHTML='<span class="subject-illustration" aria-hidden="true">'+picture+'</span><span class="subject-title"></span><span class="subject-desc"></span>';
b.querySelector('.subject-title').textContent=title;
b.querySelector('.subject-desc').textContent=library?.descriptions[id]||'';
b.setAttribute('aria-pressed',String(b.classList.contains('active')))
}}
const wordItems=window.MathainoIntro.wordItems;
const defaults=Array.from({length:3},(_,i)=>({name:'Παιδί '+(i+1),icon:'star',age:null,grade:'Α΄ Δημοτικού',allowed:[],tables:''}));
let profiles=defaults;try{localStorage.removeItem('mathaino-profiles-v04')}catch(e){}
let child=-1,editing=0,gatePicture=null;
function saveProfiles(){/* Child records stay in authenticated database, not browser-local profile storage. */}
function viewAll(id){['passwordRecovery','auth','accountSetup','profiles','avatarPicker','gate','pictureGate','parentUnlock','parent','reports','home','historyLesson','learn','test','end'].forEach(x=>$(x).classList.toggle('hidden',x!==id));window.scrollTo(0,0)}
screen=function(id){viewAll(id)};
const avatarChangeGlyph='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/></svg>';
function avatarDrawing(iconId){return window.MathainoAvatars?window.MathainoAvatars.draw(iconId):lineIcon(iconId)}
function avatarHeader(index){
const p=profiles[index],label=$('childLabel');
if(!p)return;
$('childAvatarArtwork').innerHTML=avatarDrawing(avatarIcon(p.icon));
label.textContent=p.name+' · '+p.grade;
$('changeAvatar').setAttribute('aria-label','Αλλαγή εικόνας προφίλ: '+p.name)
}
function drawProfiles(){
$('profileList').replaceChildren(...profiles.map((p,j)=>{
const card=document.createElement('article');card.className='profile-card';
const zone=document.createElement('div');zone.className='profile-avatar-zone';
const enter=document.createElement('button');enter.type='button';enter.className='profile profile-enter';
enter.setAttribute('aria-label','Άνοιξε τα μαθήματα του παιδιού: '+p.name);
enter.innerHTML='<span class="avatar-picture">'+avatarDrawing(avatarIcon(p.icon))+'</span><span class="avatar-name"></span><span class="avatar-grade"></span>';
enter.querySelector('.avatar-name').textContent=p.name;
enter.querySelector('.avatar-grade').textContent=p.grade;
enter.onclick=()=>chooseChild(j);
const change=document.createElement('button');change.type='button';change.className='profile-avatar-menu';
change.innerHTML=avatarChangeGlyph;
change.title='Αλλαγή εικόνας';
change.setAttribute('aria-label','Διάλεξε εικόνα για το παιδί: '+p.name);
change.onclick=event=>{event.stopPropagation();openAvatarPicker(j,'profiles')};
zone.append(enter,change);
card.append(zone);return card
}))
}
// Gentle entrance for early readers: day only, then one clear image.
let simpleWelcome=false;
function isEarlyReader(p){
const level=window.MathainoIntro.levelOf(p);
return level===1||(level===2&&(!!p.reading||!!p.focus||((p.allowed||[]).includes('reading')&&!(p.allowed||[]).includes('addition'))))
}
function weekdayInGreek(){
try{
const day=new Intl.DateTimeFormat('el-GR',{weekday:'long',timeZone:'Europe/Athens'}).format(new Date());
return day.charAt(0).toLocaleUpperCase('el-GR')+day.slice(1)
}catch(error){return ['Κυριακή','Δευτέρα','Τρίτη','Τετάρτη','Πέμπτη','Παρασκευή','Σάββατο'][new Date().getDay()]}
}
// Grade-aware, no-repeat introduction banks live in intro-questions.js.
function chooseChild(j){
child=j;const p=profiles[j];
document.body.classList.toggle('reading-mode',!!p.reading);
document.body.classList.toggle('focus',!!p.focus);
document.body.classList.toggle('no-color',!!p.color);
avatarHeader(j);
document.querySelectorAll('#subjects button').forEach(b=>{b.hidden=!(p.allowed||[]).includes(b.dataset.sub)});
const first=document.querySelector('#subjects button:not([hidden])');
if(first){sub=first.dataset.sub;document.querySelectorAll('#subjects button').forEach(b=>b.classList.toggle('active',b===first));topics()}
simpleWelcome=isEarlyReader(p);
$('gate').classList.toggle('gate-day',simpleWelcome);
$('gateFeedback').textContent='';
$('gateAnswers').replaceChildren();
$('gateNext').classList.toggle('hidden',!simpleWelcome);
$('gateNext').textContent=simpleWelcome?'Εντάξει!':'Συνέχεια';
if(simpleWelcome){$('gateWord').textContent=weekdayInGreek();viewAll('gate');return}
const item=window.MathainoIntro.nextQuestion(p,j);
$('gateWord').textContent=item.q;
$('gateAnswers').replaceChildren(...shuffle(item.options).map(answer=>{
const b=document.createElement('button');b.textContent=answer;
b.onclick=()=>{if(answer===item.a){b.classList.add('good');$('gateFeedback').textContent='Σωστά!';$('gateAnswers').querySelectorAll('button').forEach(x=>x.disabled=true);$('gateNext').classList.remove('hidden')}else{b.classList.add('bad');b.disabled=true;$('gateFeedback').textContent='Δοκίμασε ξανά!'}};return b
}));
viewAll('gate')
}
$('gateNext').onclick=()=>{
const items=window.MathainoIntro.picturesFor(profiles[child]);
gatePicture=window.MathainoIntro.nextPicture(profiles[child],child);
if(!gatePicture){$('gateFeedback').textContent='Δεν υπάρχουν διαθέσιμες εικόνες. Δοκίμασε ξανά.';return}
$('picture').innerHTML=window.MathainoArtStyle?.render(gatePicture.icon)||window.MathainoIllustrations?.word(gatePicture.icon)||lineIcon(gatePicture.icon||'star');
$('pictureMessage').textContent='';
$('pictureDone').classList.toggle('hidden',!simpleWelcome);
$('pictureDone').textContent='Συνέχεια';
const choicesPool=items;
const others=shuffle(choicesPool.filter(x=>x.a!==gatePicture.a)).slice(0,3);
$('pictureAnswers').replaceChildren(...shuffle([gatePicture,...others]).map(item=>{
const b=document.createElement('button');b.textContent=item.a;
b.onclick=()=>{
const correct=item.a===gatePicture.a;
for(const choice of $('pictureAnswers').querySelectorAll('button')){choice.classList.remove('good','bad');choice.setAttribute('aria-pressed',String(choice===b))}
b.classList.add(correct?'good':'bad');
$('pictureMessage').textContent=correct?'Μπράβο!':'Δοκίμασε μια άλλη λέξη.';
if(correct)$('pictureAnswers').querySelectorAll('button').forEach(choice=>choice.disabled=true);
$('pictureDone').classList.remove('hidden')
};return b
}));
viewAll('pictureGate')
};
$('pictureDone').onclick=()=>viewAll('home');
$('gateBack').onclick=$('changeProfile').onclick=()=>viewAll('profiles');
$('pictureBack').onclick=()=>viewAll(simpleWelcome?'gate':'profiles');
$('parentBack').onclick=()=>viewAll('profiles');
$('openParent').onclick=()=>{editing=0;$('editWho').replaceChildren(...profiles.map((p,i)=>{let o=document.createElement('option');o.value=i;o.textContent=p.name;return o}));loadEditor();viewAll('parent')};$('editWho').onchange=()=>{editing=+$('editWho').value;loadEditor()};
function loadEditor(){let p=profiles[editing];$('editWho').value=editing;$('editIcon').value=avatarIcon(p.icon);$('editName').value=p.name;$('editAge').value=p.age;$('editGrade').value=p.grade;$('readingOpt').checked=!!p.reading;$('focusOpt').checked=!!p.focus;$('colorOpt').checked=!!p.color;grade5UpdateEditor(p);for(let [id,key] of [['allowAddition','addition'],['allowReading','reading'],['allowMath','math'],['allowHistory','history'],['allowEn','en'],['allowFr','fr']])$(id).checked=(p.allowed||[]).includes(key);$('allowChess').checked=!p.extraSubjectsConfigured||(p.allowed||[]).includes('chess');$('allowCars').checked=!p.extraSubjectsConfigured||(p.allowed||[]).includes('cars');$('allowSpelling').checked=p.spellingConfigured?(p.allowed||[]).includes('spelling'):(p.grade==='Α΄ Δημοτικού'||p.grade==='Β΄ Δημοτικού'||(p.allowed||[]).includes('spelling'));$('tablesOpt').value=p.tables||'';$('saveMessage').textContent=''}
$('saveSettings').onclick=()=>{let p=profiles[editing];p.illustrationStyle=$('artStyleOpt').value;p.icon=$('editIcon').value;p.name=$('editName').value.trim()||p.name;p.age=Number($('editAge').value)||p.age;p.grade=$('editGrade').value;p.reading=$('readingOpt').checked;p.focus=$('focusOpt').checked;p.color=$('colorOpt').checked;p.allowed=[['allowAddition','addition'],['allowReading','reading'],['allowSpelling','spelling'],['allowMath','math'],['allowHistory','history'],['allowScience5','science5'],['allowHistory5','history5'],['allowEn','en'],['allowFr','fr'],['allowScience4','science4'],['allowGeo4','geo4'],['allowGeo5','geo5'],['allowLanguage3','language3'],['allowHistory3','history3'],['allowMath3','math3'],['allowChess','chess'],['allowCars','cars']].filter(([id])=>$(id).checked).map(([,k])=>k);p.extraSubjectsConfigured=true;p.grade5SubjectsConfigured=true;p.newCurriculumSubjectsConfigured=true;p.grade3SubjectsConfigured=true;p.spellingConfigured=true;p.tables=$('tablesOpt').value;saveProfiles();drawProfiles();$('saveMessage').textContent='Αποθηκεύτηκε!'};
topics=function(){let p=profiles[child]||defaults[0];let nums=Array.from({length:10},(_,i)=>i+1);if(sub==='math'&&p.tables){let allowed=p.tables.split(',').map(Number).filter(n=>n>=1&&n<=10);if(allowed.length)nums=nums.filter(n=>allowed.includes(n))}let names=sub==='history'?['Οι ελληνικές αποικίες']:sub==='math'?['Όλες οι προπαίδειες',...nums.map(n=>'Προπαίδεια του '+n)]:sub==='addition'?['Όλες οι προσθέσεις έως 10']:sub==='reading'?['Εύκολες λέξεις']:['Όλες οι κατηγορίες',...Object.keys(vocab[sub])];$('topic').replaceChildren(...names.map((name,i)=>{let o=document.createElement('option');o.value=i;o.textContent=name;return o}))};
entries=function(){let n=+$('topic').value;if(sub==='addition')return Array.from({length:55},(_,k)=>{let a=0,b=0,c=0;for(let x=0;x<=10;x++)for(let y=0;y<=10-x;y++){if(c++===k){a=x;b=y;break}}return {q:a+' + '+b,a:String(a+b)}}).filter(x=>!x.q.includes('0 + 0')||true);if(sub==='reading')return wordItems.map(x=>({q:'Ποια λέξη ταιριάζει στην εικόνα;',a:x.a,icon:x.icon}));if(sub==='math'){let p=profiles[child]||defaults[0];let nums=Array.from({length:10},(_,i)=>i+1);if(p.tables){let allowed=p.tables.split(',').map(Number).filter(x=>x>=1&&x<=10);if(allowed.length)nums=nums.filter(x=>allowed.includes(x))}let chosen=n?[nums[n-1]]:nums;return chosen.flatMap(t=>Array.from({length:10},(_,i)=>({q:t+' × '+(i+1),a:String(t*(i+1))})))}let names=Object.keys(vocab[sub]);return(n?[names[n-1]]:names).flatMap(x=>vocab[sub][x].map(([q,a])=>({q,a})))};
study=function(){data=entries();$('learnTitle').textContent=$('topic').selectedOptions[0].textContent;$('cards').replaceChildren(...data.map(x=>{let d=document.createElement('div');d.className='card equation';let s=document.createElement('strong');s.textContent=x.q+(sub==='math'||sub==='addition'?' = ':' → ');let b=document.createElement('button');b.textContent='?';b.dataset.answer=x.a;b.dataset.visible='0';b.onclick=()=>{b.dataset.visible=b.dataset.visible==='0'?'1':'0';b.textContent=b.dataset.visible==='1'?x.a:'?'};if(sub==='reading'&&x.icon){d.classList.add('reading-card');s.innerHTML=window.MathainoIllustrations?.word(x.icon)||lineIcon(x.icon);s.setAttribute('aria-label','Εικόνα: '+x.a)}d.append(s,b);return d}));screen('learn')};
start=function(){data=entries();let order=shuffle(data);qs=Array.from({length:+$('count').value},(_,j)=>order[j%order.length]);i=0;first=0;skippedQuiz=[];render();screen('test')};
render=function(){miss=false;$('progress').textContent='Ερώτηση '+(i+1)+' από '+qs.length;$('question').textContent=qs[i].q+(sub==='math'||sub==='addition'?' = ?':'');$('feedback').textContent='';$('next').classList.add('hidden');$('skipQuestion').classList.remove('hidden');let right=qs[i].a;let pool=sub==='math'?Array.from({length:100},(_,i)=>String(i+1)):sub==='addition'?Array.from({length:11},(_,i)=>String(i)):sub==='reading'?wordItems.map(x=>x.a):data.map(x=>x.a);let opts=shuffle([right,...shuffle([...new Set(pool.filter(x=>x!==right))]).slice(0,3)]);$('answers').replaceChildren(...opts.map(answer=>{let b=document.createElement('button');b.className='choice';b.textContent=answer;b.onclick=()=>{if(answer===right){b.classList.add('good');if(!miss)first++;$('feedback').textContent='Σωστά!';$('answers').querySelectorAll('button').forEach(x=>x.disabled=true);$('next').classList.remove('hidden');$('skipQuestion').classList.add('hidden')}else{miss=true;b.classList.add('bad');b.disabled=true;$('feedback').textContent='Δοκίμασε ξανά!'}};return b}))};
$('study').onclick=study;$('practice').onclick=start;$('practiceFromStudy').onclick=start;drawProfiles();viewAll('profiles');

const API_URL='https://yijpejuacjmucarqntlf.supabase.co';
const API_KEY='sb_publishable_ONNT2HmZBkTVQVREZ-1IXA_V82D5-AI';
let db=null,cloudChildren=[],familyId=null,ready=false;
function purgePrivateBrowserData(){
 try{for(const key of Object.keys(localStorage))if(key.startsWith('mathaino-')&&key!=='mathaino-theme')localStorage.removeItem(key)}catch(e){}
 try{window.MathainoIntro?.clear?.()}catch(e){}
 try{if(window.caches)caches.keys().then(names=>Promise.all(names.filter(n=>n.startsWith('mathaino-')).map(n=>caches.delete(n)))).catch(()=>{})}catch(e){}
 try{navigator.serviceWorker?.controller?.postMessage({type:'CLEAR_PRIVATE_DATA'})}catch(e){}
 cloudChildren=[];profiles=defaults;child=-1;
}
const recoveryLinkMarker=new URLSearchParams(location.search).has('password_reset');
let recoveryActive=recoveryLinkMarker||location.hash.includes('type=recovery')||new URLSearchParams(location.search).get('type')==='recovery';
try{if(window.supabase)db=window.supabase.createClient(API_URL,API_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}})}catch(e){}
const oldViewAll=viewAll;
viewAll=function(id){if(!ready&&id!=='auth'&&id!=='passwordRecovery'&&id!=='accountSetup')id='auth';oldViewAll(id);$('sessionBar').classList.toggle('hidden',!ready)};
const originalSave=$('saveSettings').onclick;
$('saveSettings').onclick=async()=>{if(!ready||!parentUnlocked)return;originalSave();const p=profiles[editing],record=cloudChildren[editing];if(!record)return;const {data,error}=await db.from('children').update({name:p.name,icon:p.icon,age:p.age||null,grade:p.grade,allowed_subjects:p.allowed,settings:{reading:p.reading,focus:p.focus,color:p.color,tables:p.tables,grade5SubjectsConfigured:!!p.grade5SubjectsConfigured,extraSubjectsConfigured:!!p.extraSubjectsConfigured,newCurriculumSubjectsConfigured:!!p.newCurriculumSubjectsConfigured,grade3SubjectsConfigured:!!p.grade3SubjectsConfigured,spellingConfigured:!!p.spellingConfigured,illustrationStyle:p.illustrationStyle||'auto'}}).eq('id',record.id).select('id').maybeSingle();
if(error||!data){
 parentUnlocked=false;
 $('saveMessage').textContent='Αποτυχία αποθήκευσης ή λήξη εξουσιοδότησης PIN. Ξεκλείδωσε τις ρυθμίσεις γονέα ξανά.';
 return;
}
$('saveMessage').textContent='Αποθηκεύτηκε στο cloud!'}
function displayError(error){$('authStatus').textContent=error?.message||String(error)}
async function initializeFamily(allowCreate=false){let {data:members,error:me}=await db.from('family_members').select('family_id').limit(1);if(me)throw me;if(!members.length){if(!allowCreate)return false;let {error:boot}=await db.rpc('create_my_family');if(boot)throw boot}let {data:rows,error}=await db.from('children').select('*').order('created_at',{ascending:true});if(error)throw error;cloudChildren=rows||[];profiles=cloudChildren.map(c=>({name:c.name,icon:c.icon,age:c.age||'',grade:c.grade,allowed:c.allowed_subjects||[],tables:c.settings?.tables||'',reading:!!c.settings?.reading,focus:!!c.settings?.focus,color:!!c.settings?.color,grade5SubjectsConfigured:!!c.settings?.grade5SubjectsConfigured,extraSubjectsConfigured:!!c.settings?.extraSubjectsConfigured,newCurriculumSubjectsConfigured:!!c.settings?.newCurriculumSubjectsConfigured,grade3SubjectsConfigured:!!c.settings?.grade3SubjectsConfigured,spellingConfigured:!!c.settings?.spellingConfigured,illustrationStyle:c.settings?.illustrationStyle||'auto'}));ready=true;drawProfiles();viewAll('profiles');return true}
let authLoadingFor=null;
async function sessionChanged(session){
 if(recoveryActive){viewAll('passwordRecovery');return}
 if(!session){
  authLoadingFor=null;ready=false;familyId=null;purgePrivateBrowserData();viewAll('auth');return
 }
 const userId=session.user?.id;
 if(!userId)return;
 if(ready&&authLoadingFor===userId)return;
 if(authLoadingFor===userId)return;
 authLoadingFor=userId;ready=false;familyId=null;
 try{
  $('signedEmail').textContent=session.user.email||'Γονέας';
  const hasFamily=await initializeFamily();
  if(!hasFamily){
   $('setupEmail').textContent=session.user.email||'Δεν υπάρχει email στον λογαριασμό';
   $('setupStatus').textContent='';
   viewAll('accountSetup');
  }else $('authStatus').textContent='';
 }catch(e){
  authLoadingFor=null;displayError(e);viewAll('auth')
 }
}
async function bootAuth(){if(!db){$('authStatus').textContent='Δεν φορτώθηκε η υπηρεσία σύνδεσης. Χρειάζεται σύνδεση στο Internet. Δοκίμασε ανανέωση.';viewAll('auth');return}db.auth.onAuthStateChange((event,session)=>{if(event==='PASSWORD_RECOVERY'){recoveryActive=true;viewAll('passwordRecovery');$('recoveryStatus').textContent='Ο σύνδεσμος επιβεβαιώθηκε. Μπορείς να ορίσεις νέο κωδικό.'}else if(event==='SIGNED_OUT'&&!recoveryActive){authLoadingFor=null;ready=false;purgePrivateBrowserData();viewAll('auth')}
 else if(event==='SIGNED_IN'&&session&&!recoveryActive){
  // Supabase's redirect callback may finish AFTER the initial getSession().
  // Defer DB calls outside the synchronous auth callback to avoid deadlocks.
  setTimeout(()=>sessionChanged(session),0)
 }});const {data,error}=await db.auth.getSession();if(error)displayError(error);if(recoveryActive||location.hash.includes('type=recovery')){recoveryActive=true;viewAll('passwordRecovery');if(!data?.session)$('recoveryStatus').textContent='Ο σύνδεσμος επαληθεύεται. Αν δεν ενεργοποιηθεί, ζήτησε νέο email.';return}await sessionChanged(data?.session)}
$('createFamily').onclick=async()=>{
 const btn=$('createFamily'),status=$('setupStatus');
 if(!db||btn.disabled)return;
 btn.disabled=true;status.textContent='Δημιουργία οικογένειας…';
 try{
  const {data,error}=await db.auth.getUser();
  if(error||!data?.user)throw Error('Η σύνδεση έληξε. Συνδέσου ξανά.');
  const success=await initializeFamily(true);
  if(!success)throw Error('Δεν ήταν δυνατή η δημιουργία οικογένειας.');
  status.textContent='';
 }catch(e){status.textContent='Αποτυχία: '+(e?.message||'Δοκίμασε ξανά.')}
 finally{btn.disabled=false}
};
$('setupSwitchAccount').onclick=()=>$('signOut').click();
window.MathainoGoogleSignIn?.init(db);
$('authForm').onsubmit=async e=>{e.preventDefault();if(!db){$('authStatus').textContent='Δεν φορτώθηκε η υπηρεσία σύνδεσης. Έλεγξε τη σύνδεση στο Internet και κάνε ανανέωση.';return}const email=$('authEmail').value.trim(),password=$('authPassword').value;$('authStatus').textContent='Σύνδεση…';const {data,error}=await db.auth.signInWithPassword({email,password});if(error)return displayError(error);await sessionChanged(data.session)};
$('signUp').onclick=async()=>{if(!db){$('authStatus').textContent='Δεν φορτώθηκε η υπηρεσία σύνδεσης. Κάνε ανανέωση.';return}const email=$('authEmail').value.trim(),password=$('authPassword').value;if(!email||password.length<12){$('authStatus').textContent='Χρειάζεται email και νέος κωδικός τουλάχιστον 12 χαρακτήρων.';return}$('authStatus').textContent='Δημιουργία λογαριασμού…';let data,error;try{({data,error}=await db.auth.signUp({email,password,options:{emailRedirectTo:'https://theplds.github.io/mathaino/'}}))}catch(e){displayError(e);return}if(error)return displayError(error);if(data.session)await sessionChanged(data.session);else $('authStatus').textContent='Έλεγξε το email σου για επιβεβαίωση. Ο σύνδεσμος πρέπει να οδηγεί πίσω στο Μαθαίνω!'};
$('forgot').onclick=async()=>{if(!db)return;const email=$('authEmail').value.trim();if(!email){$('authStatus').textContent='Συμπλήρωσε πρώτα το email.';return}const {error}=await db.auth.resetPasswordForEmail(email,{redirectTo:'https://theplds.github.io/mathaino/reset.html?password_reset=1'});$('authStatus').textContent=error?error.message:'Αν υπάρχει λογαριασμός, θα σταλεί email επαναφοράς.'};
$('signOut').onclick=async()=>{if(db){try{await db.rpc('parent_pin_revoke')}catch(e){};try{await db.auth.signOut()}finally{ready=false;purgePrivateBrowserData();viewAll('auth')}}};
iconizeUI();viewAll('auth');bootAuth();

$('recoveryForm').onsubmit=async e=>{e.preventDefault();const pass=$('recoveryPassword').value,confirm=$('recoveryConfirm').value;if(pass.length<12||pass!==confirm){$('recoveryStatus').textContent='Οι κωδικοί πρέπει να ταιριάζουν και να έχουν τουλάχιστον 12 χαρακτήρες.';return}$('recoveryStatus').textContent='Αποθήκευση…';const {data:sessionData}=await db.auth.getSession();if(!sessionData?.session){$('recoveryStatus').textContent='Ο σύνδεσμος έληξε ή δεν είναι έγκυρος. Ζήτησε νέο email επαναφοράς.';return}const {error}=await db.auth.updateUser({password:pass});if(error){$('recoveryStatus').textContent='Αποτυχία: '+error.message;return}$('recoveryStatus').textContent='Ο κωδικός άλλαξε. Επιστροφή στη σύνδεση…';recoveryActive=false;history.replaceState(null,'',location.pathname);await db.auth.signOut();$('authPassword').value='';viewAll('auth');$('authStatus').textContent='Ο νέος κωδικός αποθηκεύτηκε. Συνδέσου ξανά.'};
const previousDraw=drawProfiles;
drawProfiles=function(){previousDraw();if(profiles.length===0){const msg=document.createElement('p');msg.textContent='Δεν υπάρχουν παιδιά ακόμη. Πρόσθεσε το πρώτο προφίλ από τις Ρυθμίσεις γονέα.';$('profileList').append(msg)}};
const previousParentOpen=$('openParent').onclick;
$('openParent').onclick=()=>{if(!profiles.length){$('editWho').replaceChildren();$('editName').value='';$('saveMessage').textContent='Πρόσθεσε πρώτα ένα παιδί.';viewAll('parent')}else previousParentOpen()};
$('addChild').onclick=async()=>{if(!ready||!parentUnlocked)return;const name=window.prompt('Όνομα παιδιού');if(!name||!name.trim())return;const {data:member,error:memberError}=await db.from('family_members').select('family_id').limit(1).single();if(memberError){$('saveMessage').textContent=memberError.message;return}const {error}=await db.from('children').insert({family_id:member.family_id,name:name.trim(),icon:'star',grade:'Α΄ Δημοτικού',allowed_subjects:['reading'],settings:{}});if(error){$('saveMessage').textContent=error.message;return}await initializeFamily();previousParentOpen();editing=profiles.length-1;$('editWho').value=editing;loadEditor()};

let reportOffset=0,answerAttempts=0,attemptLogged=false;
const oldRender=render;
render=function(){answerAttempts=0;attemptLogged=false;oldRender();const buttons=$('answers').querySelectorAll('button');buttons.forEach(b=>{const old=b.onclick;b.onclick=async()=>{const chosen=b.textContent;const current=qs[i];const wasLogged=attemptLogged;answerAttempts++;old();if(chosen===current.a)attemptLogged=true;if(!ready||!cloudChildren[child]||wasLogged)return;const event={child_id:cloudChildren[child].id,subject:sub,topic:$('topic').selectedOptions[0]?.textContent||'',question:current.q,selected_answer:chosen,correct_answer:current.a,is_correct:chosen===current.a,attempt_number:answerAttempts};const {error}=await db.from('answer_events').insert(event);if(error)console.warn('Answer history save failed',error.message)}})};
$('openReports').onclick=async()=>{if(!ready)return;$('reportChild').replaceChildren(...profiles.map((p,j)=>{let o=document.createElement('option');o.value=j;o.textContent=p.icon+' '+p.name;return o}));$('reportChild').value=profiles.length?0:'';viewAll('reports');await loadReport(true)};
$('reportsBack').onclick=()=>viewAll('parent');
$('reportChild').onchange=()=>loadReport(true);
$('reportMore').onclick=()=>loadReport(false);
async function loadReport(reset){if(reset)reportOffset=0;const idx=Number($('reportChild').value),p=cloudChildren[idx];if(!p){$('reportSummary').textContent='Δεν υπάρχουν παιδιά.';$('reportHistory').replaceChildren();$('reportMore').hidden=true;return}if(reset){$('reportHistory').replaceChildren();$('reportSummary').textContent='Φόρτωση…'}const {data:events,error}=await db.from('answer_events').select('id,subject,topic,question,selected_answer,correct_answer,is_correct,attempt_number,created_at').eq('child_id',p.id).order('created_at',{ascending:false}).range(reportOffset,reportOffset+49);if(error){$('reportSummary').textContent='Αδυναμία φόρτωσης: '+error.message;return}const rows=events||[];reportOffset+=rows.length;$('reportMore').hidden=rows.length<50;for(const e of rows){let d=document.createElement('div');d.className='card';d.style.display='block';let heading=document.createElement('strong');heading.textContent=e.question+' → '+e.selected_answer+(e.is_correct?' ✓':' ✗');let meta=document.createElement('small');meta.style.display='block';meta.textContent=(e.subject==='spelling'?'Ορθογραφία Α΄':e.subject)+' · '+e.topic+' · '+new Date(e.created_at).toLocaleString('el-GR')+(e.is_correct?'':' · Σωστό: '+e.correct_answer);d.append(heading,meta);$('reportHistory').append(d)}if(reset){const {count,error:countError}=await db.from('answer_events').select('*',{count:'exact',head:true}).eq('child_id',p.id);const {count:correctCount}=await db.from('answer_events').select('*',{count:'exact',head:true}).eq('child_id',p.id).eq('is_correct',true);const total=count||0;const div=document.createElement('div');div.className='card';div.style.display='block';div.textContent=countError?'Δεν ήταν δυνατή η φόρτωση της σύνοψης.':total?'Συνολικές απαντήσεις: '+total+' · Σωστές: '+(correctCount||0)+' · Ποσοστό: '+Math.round((correctCount||0)/total*100)+'%':'Δεν έχουν καταγραφεί απαντήσεις ακόμη.';$('reportSummary').replaceChildren(div)}}

let parentUnlocked=false, parentPinStatusReady=false, parentPinSetup=false, parentPinBusy=false, parentPinSession=0,parentReturnView='profiles';
const openParentEditor=previousParentOpen;
const parentPinInput=$('parentPassword'),parentPinButton=$('verifyParent');
function parentPinFocus(){if(!$('parentUnlock').classList.contains('hidden')){try{parentPinInput.focus({preventScroll:true})}catch(e){parentPinInput.focus()}}}
async function parentPinSubmit(){
if(!db||!ready||parentPinBusy||!parentPinStatusReady||$('parentUnlock').classList.contains('hidden'))return;
const pin=parentPinInput.value,session=parentPinSession;
if(!/^[0-9]{4}$/.test(pin)){$('parentError').textContent='Χρειάζονται ακριβώς 4 ψηφία.';parentPinFocus();return}
parentPinBusy=true;parentPinButton.disabled=true;parentPinInput.readOnly=true;
$('parentError').textContent=parentPinSetup?'Αποθήκευση PIN…':'Έλεγχος PIN…';
try{
const {data,error}=await db.rpc(parentPinSetup?'parent_pin_set':'parent_pin_check',{p_pin:pin});
if(session!==parentPinSession||$('parentUnlock').classList.contains('hidden'))return;
parentPinInput.value='';
if(error){$('parentError').textContent='Αποτυχία: '+error.message;return}
if(!parentPinSetup&&data!==true){$('parentError').textContent='Λάθος PIN ή προσωρινό κλείδωμα μετά από 5 αποτυχημένες προσπάθειες (15 λεπτά).';return}
parentUnlocked=true;openParentEditor();
}finally{
if(session===parentPinSession){parentPinBusy=false;parentPinButton.disabled=false;parentPinInput.readOnly=false;if(!parentUnlocked)parentPinFocus()}
}
}
$('openParent').onclick=async()=>{
const visible=[...document.querySelectorAll('main > section')].find(el=>!el.classList.contains('hidden'))?.id;
parentReturnView=visible&& !['parent','parentUnlock','reports'].includes(visible)?visible:'profiles';
const session=++parentPinSession;parentUnlocked=false;parentPinStatusReady=false;parentPinBusy=false;
parentPinInput.readOnly=false;parentPinInput.value='';parentPinButton.disabled=true;
$('parentError').textContent='';viewAll('parentUnlock');
// Focus while still inside the user's click, so mobile devices can open the numeric keyboard.
parentPinFocus();
if(!db||!ready){$('parentError').textContent='Δεν υπάρχει ενεργή σύνδεση.';return}
try{
const {data,error}=await db.rpc('parent_pin_status');
if(session!==parentPinSession||$('parentUnlock').classList.contains('hidden'))return;
if(error){$('parentError').textContent='Αδυναμία ελέγχου PIN: '+error.message;return}
parentPinSetup=!data;parentPinButton.textContent=data?'Ξεκλείδωμα':'Δημιουργία PIN';
parentPinStatusReady=true;parentPinButton.disabled=false;
if(/^[0-9]{4}$/.test(parentPinInput.value))parentPinSubmit();
}catch(error){if(session===parentPinSession)$('parentError').textContent='Αδυναμία ελέγχου PIN: '+(error.message||error)}
};
$('cancelParent').onclick=()=>{parentPinSession++;parentUnlocked=false;viewAll(parentReturnView||'profiles')};
parentPinButton.onclick=parentPinSubmit;
parentPinInput.addEventListener('input',()=>{
const digits=parentPinInput.value.replace(/[^0-9]/g,'').slice(0,4);
if(parentPinInput.value!==digits)parentPinInput.value=digits;
if(parentPinStatusReady&&!parentPinBusy&&digits.length===4)parentPinSubmit();
});
parentPinInput.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();parentPinSubmit()}});

const previousReportOpen=$('openReports').onclick;
$('openReports').onclick=()=>{if(!parentUnlocked){$('openParent').click();return}previousReportOpen()};
$('parentBack').onclick=()=>{parentUnlocked=false;parentPinSession++;viewAll(parentReturnView||'profiles')};
const previousSignOut=$('signOut').onclick;
$('signOut').onclick=async()=>{parentUnlocked=false;await previousSignOut()};
const themeKey='mathaino-theme';const themeSelect=document.getElementById('themeSelect');const mediaDark=window.matchMedia?window.matchMedia('(prefers-color-scheme: dark)'):null;function applyTheme(){const selected=themeSelect.value;document.documentElement.dataset.theme=selected==='system'?(mediaDark&&mediaDark.matches?'dark':'light'):selected;document.querySelector('meta[name="theme-color"]').setAttribute('content',document.documentElement.dataset.theme==='dark'?'#101827':'#2563eb')}let initialTheme='system';try{initialTheme=localStorage.getItem(themeKey)||'system'}catch(e){}themeSelect.value=['light','dark','system'].includes(initialTheme)?initialTheme:'system';themeSelect.onchange=()=>{try{localStorage.setItem(themeKey,themeSelect.value)}catch(e){}applyTheme()};if(mediaDark){if(mediaDark.addEventListener)mediaDark.addEventListener('change',()=>{if(themeSelect.value==='system')applyTheme()});else if(mediaDark.addListener)mediaDark.addListener(()=>{if(themeSelect.value==='system')applyTheme()})}applyTheme();const menuToggle=$('menuToggle'),appMenu=$('appMenu');function closeAppMenu(){appMenu.classList.add('hidden');menuToggle.setAttribute('aria-expanded','false')}menuToggle.onclick=()=>{const opening=appMenu.classList.contains('hidden');appMenu.classList.toggle('hidden',!opening);menuToggle.setAttribute('aria-expanded',String(opening))};$('menuParent').onclick=()=>{closeAppMenu();$('openParent').click()};$('menuSignOut').onclick=()=>{closeAppMenu();$('signOut').click()};document.addEventListener('pointerdown',e=>{if(!appMenu.contains(e.target)&&!menuToggle.contains(e.target))closeAppMenu()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAppMenu()});
// Δ΄ Δημοτικού: first illustrated history lesson. Animation is CSS/SVG, not video.
const historyFacts=[
{q:'Γιατί πολλοί Έλληνες αναζητούσαν νέους τόπους;',a:'Επειδή χρειάζονταν γη και ευκαιρίες για εμπόριο',opts:['Επειδή χρειάζονταν γη και ευκαιρίες για εμπόριο','Επειδή απαγορευόταν να ζουν στην Ελλάδα','Επειδή δεν υπήρχαν πλοία στην Ελλάδα'],why:'Η έλλειψη καλλιεργήσιμης γης και το εμπόριο ήταν σημαντικοί λόγοι του αποικισμού.'},
{q:'Πώς ονομαζόταν η πόλη από την οποία ξεκινούσαν οι άποικοι;',a:'Μητρόπολη',opts:['Μητρόπολη','Ακρόπολη','Αγορά'],why:'Μητρόπολη σημαίνει «μητέρα πόλη»: η πόλη από την οποία ξεκινούσαν οι άποικοι.'},
{q:'Γιατί ήταν χρήσιμο ένα καλό λιμάνι για μια αποικία;',a:'Για ταξίδια και εμπόριο με πλοία',opts:['Για ταξίδια και εμπόριο με πλοία','Για να μην υπάρχει επαφή με άλλους','Για να φυτεύουν δέντρα μέσα στη θάλασσα'],why:'Τα πλοία συνέδεαν την αποικία με άλλες πόλεις και διευκόλυναν τις ανταλλαγές.'},
{q:'Ποια περιοχή ονομάστηκε Μεγάλη Ελλάδα;',a:'Η νότια Ιταλία και η Σικελία',opts:['Η νότια Ιταλία και η Σικελία','Η Αίγυπτος','Η βόρεια Ευρώπη'],why:'Στη νότια Ιταλία και τη Σικελία ιδρύθηκαν πολλές ελληνικές αποικίες.'},
{q:'Ποια πόλη ίδρυσαν άποικοι από τη Φώκαια;',a:'Τη Μασσαλία',opts:['Τη Μασσαλία','Τη Σινώπη','Τη Σπάρτη'],why:'Η Μασσαλία στη σημερινή Γαλλία ιδρύθηκε από Φωκαείς.'},
{q:'Τι σχέση είχε συνήθως μια αποικία με τη μητρόπολή της;',a:'Διατηρούσε πολιτισμικούς δεσμούς αλλά είχε δική της οργάνωση',opts:['Διατηρούσε πολιτισμικούς δεσμούς αλλά είχε δική της οργάνωση','Ήταν πάντα μια συνοικία της μητρόπολης','Έπρεπε να ξεχάσει τη γλώσσα της'],why:'Οι αποικίες ήταν νέες πόλεις, με δικούς τους θεσμούς και δεσμούς με την παλιά πατρίδα.'},
{q:'Τι συνέβαινε όταν οι Έλληνες συναντούσαν άλλους λαούς;',a:'Αντάλλασσαν προϊόντα και ιδέες',opts:['Αντάλλασσαν προϊόντα και ιδέες','Σταματούσαν κάθε εμπόριο','Μιλούσαν όλοι την ίδια γλώσσα'],why:'Οι επαφές με άλλους λαούς ενίσχυσαν το εμπόριο και τις πολιτισμικές ανταλλαγές.'}
];
let historyIndex=0,historyFrame=0,historyElapsed=0,historyStarted=0,historyPlaying=false;
let historySpeed=1,historyCaptionsEnabled=false,historyIdleTimeout=null;
// Natural Earth country boundaries (public-domain 110m GeoJSON); projected consistently with the historic locations.
const historyBounds={west:-6,east:43,north:48,south:29};
function histXY(lon,lat){return [Math.round((lon-historyBounds.west)/(historyBounds.east-historyBounds.west)*71400)/100,Math.round((historyBounds.north-lat)/(historyBounds.north-historyBounds.south)*39600)/100]}
const historyLocations=[
{origin:[22.93,37.94],colony:[15.29,37.07],originName:'Κόρινθος',colonyName:'Συρακούσες'},
{origin:[26.75,38.67],colony:[5.37,43.30],originName:'Φώκαια',colonyName:'Μασσαλία'},
{origin:[27.28,37.53],colony:[35.15,42.03],originName:'Μίλητος',colonyName:'Σινώπη'}
];
function histInitPlaces(){const origins=document.getElementById('historyOrigins'),labels=document.getElementById('histPlaceLabels');origins.replaceChildren();labels.replaceChildren();historyLocations.forEach((loc,i)=>{const s=histXY(...loc.origin),e=histXY(...loc.colony);const circle=document.createElementNS('http://www.w3.org/2000/svg','circle');circle.setAttribute('cx',s[0]);circle.setAttribute('cy',s[1]);circle.setAttribute('r','5');circle.setAttribute('fill','#e7a447');circle.setAttribute('stroke','white');circle.setAttribute('stroke-width','2');origins.append(circle);const marker=document.getElementById('histMarker'+i);marker.setAttribute('cx',e[0]);marker.setAttribute('cy',e[1]);for(const [p,name] of [[s,loc.originName],[e,loc.colonyName]]){const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x',p[0]+7);t.setAttribute('y',p[1]-7);t.textContent=name;labels.append(t)}})}
histInitPlaces();
async function histLoadGeography(){const status=document.getElementById('historyMapCaption');try{const r=await fetch('https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_110m_admin_0_countries.geojson');if(!r.ok)throw Error('HTTP '+r.status);const geo=await r.json();const land=document.getElementById('geoLand'),ns='http://www.w3.org/2000/svg';const paths=[];for(const feature of geo.features){const g=feature.geometry;if(!g)continue;const polys=g.type==='Polygon'?[g.coordinates]:g.type==='MultiPolygon'?g.coordinates:[];for(const poly of polys){for(const ring of poly){let d='',active=false;for(const coord of ring){const [lon,lat]=coord;if(lon<historyBounds.west-2||lon>historyBounds.east+2||lat<historyBounds.south-2||lat>historyBounds.north+2){active=false;continue}const p=histXY(lon,lat);d+=(active?'L':'M')+p.join(' ');active=true}if(d)paths.push(d)}}}const path=document.createElementNS(ns,'path');path.setAttribute('d',paths.join(' '));land.replaceChildren(path);if(!historyPlaying&&historyElapsed===0)status.textContent='Κόρινθος → Συρακούσες · Θαλάσσια διαδρομή 1 από 3'}catch(e){status.textContent='Ο γεωγραφικός χάρτης χρειάζεται σύνδεση στο Internet. Οι θέσεις των πόλεων παραμένουν ακριβείς.'}}
histLoadGeography();
// Educational maritime routes. Each waypoint is [longitude,latitude] on water
// according to the Natural Earth 110m coastline used by this map.
// Where the ancient city is inland (e.g. Corinth, Miletus), the ship starts offshore at its port.
const historySeaRoutes=[
[[23.18,37.85],[23.48,37.91],[23.64,37.72],[23.73,37.49],[23.42,36.70],[23.18,36.38],[16.67,36.38],[15.34,36.94],[15.35,36.98]], // Corinth → Syracuse, around Peloponnese
[[26.47,38.69],[25.95,38.65],[25.20,37.80],[24.60,37.00],[23.18,36.38],[21.15,36.38],[16.10,36.18],[14.60,36.06],[12.10,36.50],[11.80,37.40],[10.80,37.75],[9.20,38.20],[7.65,39.25],[7.50,40.50],[6.60,41.90],[5.40,43.17],[5.36,43.21]], // Phocaea → Marseille, through Aegean and western Mediterranean
[[27.03,37.50],[26.26,38.20],[26.12,39.53],[27.24,40.44],[28.99,41.07],[29.27,41.28],[33.54,42.05],[35.15,42.12]] // Miletus → Sinope, Dardanelles, Marmara, Bosporus, Black Sea
];
const historyRouteDescriptions=[
'Από το λιμάνι της Κορίνθου πλέουμε νότια της Πελοποννήσου και διασχίζουμε το Ιόνιο προς τις Συρακούσες.',
'Από τη Φώκαια διασχίζουμε το Αιγαίο, πλέουμε νότια της Πελοποννήσου και της Σικελίας, περνάμε δυτικά από τη Σαρδηνία και φτάνουμε στη Μασσαλία.',
'Από τη Μίλητο περνάμε από τον Ελλήσποντο, την Προποντίδα και τον Βόσπορο, για να φτάσουμε στον Εύξεινο Πόντο και στη Σινώπη.'
];
const historyStops=historyLocations.map((loc,index)=>{
const points=historySeaRoutes[index].map(coord=>histXY(...coord));
const distances=[0];
for(let j=1;j<points.length;j++)distances.push(distances[j-1]+Math.hypot(points[j][0]-points[j-1][0],points[j][1]-points[j-1][1]));
return {name:loc.colonyName,start:points[0],end:points[points.length-1],city:histXY(...loc.colony),points,distances,length:distances[distances.length-1],
path:'M'+points.map(p=>p.join(' ')).join(' L'),text:historyRouteDescriptions[index]};
});
const historyDuration=10000;
const historyTotal=historyDuration*historyStops.length;
function historyClock(ms){const seconds=Math.floor(ms/1000);return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0')}
function historyClockTitle(ms){return historyClock(ms)+' / '+historyClock(historyTotal)}
const historyCaptionLines=[
'Κόρινθος → Συρακούσες: γύρω από την Πελοπόννησο και μέσω του Ιονίου.',
'Φώκαια → Μασσαλία: νότια από τη Σικελία και δυτικά από τη Σαρδηνία.',
'Μίλητος → Σινώπη: Ελλήσποντος, Προποντίδα, Βόσπορος, Εύξεινος Πόντος.'
];
function historyUpdateCaptions(){
const el=$('historySubtitles');
el.classList.toggle('hidden',!historyCaptionsEnabled);
if(!historyCaptionsEnabled)return;
const index=Math.min(Math.floor(historyElapsed/historyDuration),historyStops.length-1);
const fraction=Math.min((historyElapsed-index*historyDuration)/historyDuration,1);
const caption=fraction>.84?'Άφιξη: '+historyStops[index].name+'.':historyCaptionLines[index];
if(el.textContent!==caption)el.textContent=caption
}
function historyRevealControls(){
const stage=$('historyStage');
stage.classList.remove('history-idle');
if(historyIdleTimeout)clearTimeout(historyIdleTimeout);
historyIdleTimeout=null;
if(historyPlaying)historyIdleTimeout=setTimeout(()=>{
if(historyPlaying&&!stage.matches(':focus-within'))stage.classList.add('history-idle')
},2800)
}
function historyUpdateControls(){
const seek=$('historySeek');
historyElapsed=Math.max(0,Math.min(historyTotal,historyElapsed));
seek.value=String(Math.round(historyElapsed));
seek.style.setProperty('--progress',(100*historyElapsed/historyTotal)+'%');
seek.setAttribute('aria-valuetext',historyClockTitle(historyElapsed));
$('historyTime').textContent=historyClockTitle(historyElapsed);
$('historyPlayIndicator').textContent=historyPlaying?'Αναπαραγωγή':'Σε παύση';
const ended=historyElapsed>=historyTotal;
const icon=historyPlaying?'pause':ended?'repeat':'play';
const play=$('historyPlay'),center=$('historyCenterPlay');
if(play.dataset.icon!==icon){play.innerHTML=lineIcon(icon);play.dataset.icon=icon}
const centerIcon=ended?'repeat':'play';
if(center.dataset.icon!==centerIcon){center.innerHTML=lineIcon(centerIcon);center.dataset.icon=centerIcon}
play.setAttribute('aria-label',historyPlaying?'Παύση':ended?'Αναπαραγωγή από την αρχή':'Αναπαραγωγή');
play.title=historyPlaying?'Παύση (K)':ended?'Από την αρχή':'Αναπαραγωγή (K)';
center.setAttribute('aria-label',ended?'Επανάληψη από την αρχή':'Αναπαραγωγή χάρτη');
center.title=ended?'Επανάληψη':'Αναπαραγωγή';
$('historyStage').classList.toggle('history-playing',historyPlaying);
const chapter=Math.min(Math.floor(historyElapsed/historyDuration),historyStops.length-1);
$('historyNextRoute').disabled=chapter>=historyStops.length-1;
$('historyCC').setAttribute('aria-pressed',String(historyCaptionsEnabled));
historyUpdateCaptions();
}
function historyStop(){
historyPlaying=false;
if(historyFrame)cancelAnimationFrame(historyFrame);
historyFrame=0;
if(historyIdleTimeout)clearTimeout(historyIdleTimeout);
historyIdleTimeout=null;
$('historyStage').classList.remove('history-idle');
historyUpdateControls()
}
function historyPosition(t,stop){
const distance=Math.max(0,Math.min(t,1))*stop.length;
let segment=1;
while(segment<stop.distances.length-1&&stop.distances[segment]<distance)segment++;
const a=stop.points[segment-1],b=stop.points[segment],span=stop.distances[segment]-stop.distances[segment-1],f=span?(distance-stop.distances[segment-1])/span:0;
return [a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f];
}
function historyDrawRoute(stop,progress){
$('histRoute').setAttribute('d',stop.path);
const sailed=$('histSailedRoute');sailed.setAttribute('d',stop.path);
sailed.setAttribute('stroke-dasharray',stop.length+' '+stop.length);
sailed.setAttribute('stroke-dashoffset',stop.length*(1-progress));
}
function historyDrawShip(pos,stop,progress){
const t2=Math.min(1,progress+.006),t1=Math.max(0,progress-.006);
const next=historyPosition(t2,stop),previous=historyPosition(t1,stop);
const facing=next[0]<previous[0]?-1:1;
$('histShip').setAttribute('transform','translate('+pos[0].toFixed(2)+' '+pos[1].toFixed(2)+') scale('+(facing*.68)+' .68)');
}
function historyPaint(){
const total=historyTotal,elapsed=Math.min(historyElapsed,total);
const index=Math.min(Math.floor(elapsed/historyDuration),historyStops.length-1);
const fraction=Math.min((elapsed-index*historyDuration)/historyDuration,1);
const stop=historyStops[index],progress=Math.min(fraction/.84,1),pos=historyPosition(progress,stop);
historyDrawRoute(stop,progress);historyDrawShip(pos,stop,progress);
for(let n=0;n<historyStops.length;n++)$('histMarker'+n).style.opacity=n<index||(n===index&&fraction>.84)?'1':'.2';
$('histArrival').setAttribute('opacity',fraction>.84?'1':'0');
$('histArrival').setAttribute('transform','translate('+stop.city[0]+' '+stop.city[1]+')');
$('historyMapCaption').textContent='Θαλάσσια πορεία '+(index+1)+' / 3 · '+historyLocations[index].originName+' → '+stop.name;
$('historyNarrative').textContent=fraction>.84?'Οι άποικοι φτάνουν και χτίζουν μια νέα πόλη: '+stop.name+'.':stop.text;
if(elapsed>=total){historyStop();$('historyMapCaption').textContent='Το θαλάσσιο ταξίδι ολοκληρώθηκε · 3 αποικίες'}
historyUpdateControls();
}
function historyTick(now){if(!historyPlaying)return;historyElapsed=Math.min(historyTotal,historyElapsed+Math.min(now-historyStarted,100)*historySpeed);historyStarted=now;historyPaint();if(historyPlaying)historyFrame=requestAnimationFrame(historyTick)}
function historyReset(){
historyStop();historyElapsed=0;
const stop=historyStops[0];historyDrawRoute(stop,0);historyDrawShip(stop.start,stop,0);
$('histArrival').setAttribute('opacity','0');
for(let n=0;n<3;n++)$('histMarker'+n).style.opacity='.2';
$('historyMapCaption').textContent='Αφετηρία: Κόρινθος · Ενδεικτική πορεία μόνο στη θάλασσα';
$('historyNarrative').textContent='Πριν από περίπου 2.700 χρόνια, Έλληνες ταξίδευαν με πλοία και ίδρυαν νέες πόλεις σε μακρινές ακτές.';
historyUpdateControls();
}
function historySetElapsed(value){
historyElapsed=Math.max(0,Math.min(historyTotal,Number(value)||0));
historyStarted=performance.now();
historyPaint()
}
function historyTogglePlay(){
if(historyPlaying){historyStop();return}
if(historyElapsed>=historyTotal)historyReset();
historyPlaying=true;
historyStarted=performance.now();
historyUpdateControls();
historyRevealControls();
historyFrame=requestAnimationFrame(historyTick)
}
$('historyPlay').onclick=historyTogglePlay;
$('historyCenterPlay').onclick=historyTogglePlay;
$('historyPause').onclick=historyStop;
$('historyReplay').onclick=()=>{historyReset();historyTogglePlay()};
$('historyBack').onclick=()=>{historyStop();viewAll('home')};
$('historyNextRoute').onclick=()=>{
const chapter=Math.min(Math.floor(historyElapsed/historyDuration),historyStops.length-1);
if(chapter>=historyStops.length-1)return;
historySetElapsed((chapter+1)*historyDuration);
historyRevealControls();
};
$('historySeek').max=String(historyTotal);
$('historySeek').addEventListener('input',event=>{
historySetElapsed(event.target.value);
historyRevealControls();
});
$('historyProgress').addEventListener('pointermove',event=>{
const progress=$('historySeek').getBoundingClientRect();
if(!progress.width)return;
const percent=Math.max(0,Math.min(1,(event.clientX-progress.left)/progress.width));
const preview=$('historyHoverTime');
preview.textContent=historyClock(percent*historyTotal);
preview.style.left=(percent*100)+'%';
});
$('historyCC').onclick=()=>{
historyCaptionsEnabled=!historyCaptionsEnabled;
historyUpdateControls();
historyRevealControls();
};
function historyCloseSettings(){
$('historySpeedMenu').classList.add('hidden');
$('historySettings').setAttribute('aria-expanded','false');
}
$('historySettings').onclick=()=>{
const opening=$('historySpeedMenu').classList.contains('hidden');
$('historySpeedMenu').classList.toggle('hidden',!opening);
$('historySettings').setAttribute('aria-expanded',String(opening));
historyRevealControls()
};
for(const b of $('historySpeedMenu').querySelectorAll('[data-speed]')){
b.onclick=()=>{
historySpeed=Number(b.dataset.speed);
for(const other of $('historySpeedMenu').querySelectorAll('[data-speed]'))
other.setAttribute('aria-checked',String(other===b));
$('historySettings').title='Ταχύτητα: '+(historySpeed===1?'Κανονική':historySpeed+'×');
historyStarted=performance.now();
historyCloseSettings();
$('historySettings').focus();
historyRevealControls()
}
}
document.addEventListener('pointerdown',event=>{
if(!$('historySpeedMenu').contains(event.target)&&!$('historySettings').contains(event.target))historyCloseSettings()
});
$('historyTheater').onclick=()=>{
const stage=$('historyStage');
const active=stage.classList.toggle('history-theater');
$('historyTheater').setAttribute('aria-pressed',String(active));
$('historyTheater').title=active?'Κανονική προβολή (T)':'Λειτουργία κινηματογράφου (T)';
historyRevealControls()
};
function historySyncFullscreen(){
const stage=$('historyStage'),active=document.fullscreenElement===stage||stage.classList.contains('history-expanded');
$('historyFullscreen').innerHTML=lineIcon(active?'close':'fullscreen');
$('historyFullscreen').setAttribute('aria-label',active?'Έξοδος από πλήρη οθόνη':'Πλήρης οθόνη');
$('historyFullscreen').title=active?'Έξοδος από πλήρη οθόνη (F)':'Πλήρης οθόνη (F)';
}
$('historyFullscreen').onclick=async()=>{
const stage=$('historyStage');
try{
if(document.fullscreenElement===stage){await document.exitFullscreen()}
else if(stage.classList.contains('history-expanded'))stage.classList.remove('history-expanded');
else if(stage.requestFullscreen)await stage.requestFullscreen();
else stage.classList.add('history-expanded')
}catch(e){stage.classList.toggle('history-expanded')}
historySyncFullscreen();
historyRevealControls()
};
document.addEventListener('fullscreenchange',historySyncFullscreen);
const historyStage=$('historyStage');
historyStage.addEventListener('pointermove',historyRevealControls);
historyStage.addEventListener('click',event=>{
if(event.target.closest('#historyPlayer,#historyCenterPlay'))return;
if(event.target.closest('svg')){
historyStage.focus({preventScroll:true});
historyTogglePlay()
}
});
historyStage.addEventListener('keydown',event=>{
if(event.target!==historyStage&&event.target.closest('button,input,select,textarea,[contenteditable]'))return;
const key=event.key.toLowerCase();
if(key===' '||key==='k'){event.preventDefault();historyTogglePlay()}
else if(key==='arrowleft'||key==='j'){event.preventDefault();historySetElapsed(historyElapsed-(key==='j'?10000:5000))}
else if(key==='arrowright'||key==='l'){event.preventDefault();historySetElapsed(historyElapsed+(key==='l'?10000:5000))}
else if(key==='home'){event.preventDefault();historySetElapsed(0)}
else if(key==='end'){event.preventDefault();historySetElapsed(historyTotal)}
else if(key==='c'){event.preventDefault();$('historyCC').click()}
else if(key==='t'){event.preventDefault();$('historyTheater').click()}
else if(key==='f'){event.preventDefault();$('historyFullscreen').click()}
else if(key==='escape'){
historyCloseSettings();
if(historyStage.classList.contains('history-expanded')){historyStage.classList.remove('history-expanded');historySyncFullscreen()}
}
});
$('historyNoSound').innerHTML=lineIcon('volume-off');
$('historyCC').innerHTML=lineIcon('captions');
$('historySettings').innerHTML=lineIcon('settings');
$('historyTheater').innerHTML=lineIcon('theater');
$('historyNextRoute').innerHTML=lineIcon('next');
historySyncFullscreen();
function showHistoryQuestion(){const item=historyFacts[historyIndex];$('historyQuestion').textContent=(historyIndex+1)+' / '+historyFacts.length+' · '+item.q;$('historyFeedback').textContent='';$('historyNext').classList.add('hidden');$('historySkip').hidden=false;$('historyChoices').replaceChildren(...item.opts.map(option=>{const b=document.createElement('button');b.textContent=option;b.onclick=()=>{if(option===item.a){b.classList.add('good');$('historyFeedback').textContent='Σωστά! '+item.why;$('historyChoices').querySelectorAll('button').forEach(x=>x.disabled=true);$('historyNext').textContent=historyIndex===historyFacts.length-1?'Ξανά από την αρχή':'Επόμενη ερώτηση →';$('historyNext').classList.remove('hidden');$('historySkip').hidden=true}else{b.classList.add('bad');b.disabled=true;$('historyFeedback').textContent='Δοκίμασε ξανά.'}};return b}))}
$('historyNext').onclick=()=>{historyIndex=(historyIndex+1)%historyFacts.length;showHistoryQuestion()};
$('historySkip').onclick=()=>{historyIndex=(historyIndex+1)%historyFacts.length;showHistoryQuestion()};
const oldChooseChildHistory=chooseChild;
chooseChild=function(j){oldChooseChildHistory(j);const b=document.querySelector('#subjects [data-sub="history"]');b.hidden=b.hidden||!String(profiles[j].grade).startsWith('Δ');if(sub==='history'){topics()}};
const oldTopicsHistory=topics;topics=function(){if(sub==='history'){$('topic').replaceChildren(new Option('Οι ελληνικές αποικίες','0'));return}oldTopicsHistory()};const oldStudyHistory=$('study').onclick,oldPracticeHistory=$('practice').onclick;
function enterHistory(){$('history4Hero').innerHTML=window.MathainoIllustrations?.subject('history')||'';historySetMode('study');historyReset();historyIndex=0;showHistoryQuestion();viewAll('historyLesson')}
$('study').onclick=()=>{if(sub==='history')enterHistory();else oldStudyHistory()};
$('practice').onclick=()=>{if(sub==='history')enterHistory();else oldPracticeHistory()};


const colonyAdventure=[
{title:'1. Γιατί να φύγουμε;',intro:'Στη μητρόπολη η γη δεν αρκεί για όλους. Τι θα πρότεινες;',choices:[
{label:'Να αναζητήσουμε καλλιεργήσιμη γη και εμπορικές ευκαιρίες',good:true,feedback:'Σωστά. Η έλλειψη γης και η αναζήτηση εμπορικών ευκαιριών ήταν σημαντικοί λόγοι για τον αποικισμό.'},
{label:'Να φύγουμε απλώς επειδή βαρεθήκαμε',feedback:'Οι αποικίες δεν δημιουργούνταν σαν εκδρομές. Οι άνθρωποι αναζητούσαν λύσεις σε πραγματικές ανάγκες.'}]},
{title:'2. Τι θα πάρουμε στο πλοίο;',intro:'Το ταξίδι θα είναι μεγάλο. Ποια εφόδια είναι πιο χρήσιμα;',choices:[
{label:'Τρόφιμα, νερό, εργαλεία και σπόρους',good:true,feedback:'Καλή προετοιμασία! Οι άποικοι χρειάζονταν προμήθειες για το ταξίδι και για να ξεκινήσουν τη ζωή τους.'},
{label:'Μόνο κοσμήματα και διακοσμητικά',feedback:'Τα πολύτιμα αντικείμενα δεν αρκούν για επιβίωση. Χρειαζόμαστε νερό, τροφή και εργαλεία.'}]},
{title:'3. Πού θα χτίσουμε;',intro:'Φτάνετε σε μια νέα ακτή. Ποιο σημείο θα εξετάσεις πρώτο;',choices:[
{label:'Κοντά σε ασφαλές λιμάνι, νερό και καλλιεργήσιμη γη',good:true,feedback:'Ακριβώς! Η πρόσβαση στη θάλασσα, το νερό και η γη βοηθούσαν μια νέα πόλη να αναπτυχθεί.'},
{label:'Σε έναν απόκρημνο βράχο χωρίς νερό',feedback:'Η ασφάλεια μετράει, αλλά χωρίς νερό και πρόσβαση σε τροφή η εγκατάσταση γίνεται πολύ δύσκολη.'}]},
{title:'4. Πώς θα οργανώσουμε την πόλη;',intro:'Η νέα κοινότητα μεγαλώνει. Τι σχέση θα έχει με τη μητρόπολη;',choices:[
{label:'Θα αποκτήσει δικούς της θεσμούς και θα κρατήσει πολιτισμικούς δεσμούς',good:true,feedback:'Ακριβώς. Οι αποικίες ήταν νέες πόλεις με δικούς τους θεσμούς, αλλά διατηρούσαν δεσμούς με τη μητρόπολη.'},
{label:'Θα είναι μια συνοικία που διοικείται πάντα από τη μητρόπολη',feedback:'Όχι ακριβώς. Οι ελληνικές αποικίες δεν ήταν απλές συνοικίες της μητρόπολης.'}]},
{title:'5. Γνωρίζουμε τους γείτονες',intro:'Στην περιοχή ζουν ήδη άλλοι λαοί. Πώς θα τους αντιμετωπίσετε;',choices:[
{label:'Θα επιδιώξουμε επαφές, ανταλλαγές και συνεργασία',good:true,feedback:'Οι επαφές συχνά έφερναν εμπόριο και ανταλλαγές ιδεών. Υπήρχαν όμως και συγκρούσεις, όχι μόνο ειρηνικές σχέσεις.'},
{label:'Θα υποθέσουμε ότι η περιοχή είναι ακατοίκητη',feedback:'Οι αποικίες συχνά ιδρύονταν κοντά σε ήδη εγκατεστημένους πληθυσμούς. Οι σχέσεις μπορούσαν να είναι συνεργατικές ή συγκρουσιακές.'}]}
];
let colonyStep=0,colonyChosen={};
function colonyRender(){const panel=$('historyAdventurePanel');panel.replaceChildren();if(colonyStep>=colonyAdventure.length){const h=document.createElement('h4');h.innerHTML=lineIcon('star')+' Ίδρυσες μια νέα πόλη!';const p=document.createElement('p');p.textContent='Έμαθες γιατί έφευγαν οι άποικοι, πώς προετοιμάζονταν, πού εγκαθίσταντο και τι σχέσεις είχαν με άλλους λαούς. Μπορείς να ξαναδοκιμάσεις διαφορετικές επιλογές.';panel.append(h,p);$('historyAdventureBack').disabled=false;return}
const step=colonyAdventure[colonyStep],heading=document.createElement('h4');heading.textContent=step.title;const intro=document.createElement('p');intro.textContent=step.intro;panel.append(heading,intro);
step.choices.forEach((choice,i)=>{const btn=document.createElement('button');btn.type='button';btn.className='choice';btn.textContent=choice.label;btn.onclick=()=>{colonyChosen[colonyStep]=i;colonyRender()};panel.append(btn)});
if(Object.hasOwn(colonyChosen,colonyStep)){const choice=step.choices[colonyChosen[colonyStep]];const feedback=document.createElement('p');feedback.className=choice.good?'good adventure-feedback':'adventure-feedback';feedback.textContent=choice.feedback;panel.append(feedback);const next=document.createElement('button');next.className='primary mathaino-completion';next.textContent=colonyStep===colonyAdventure.length-1?'Ολοκλήρωση →':'Συνέχεια →';next.onclick=()=>{colonyStep++;colonyRender()};panel.append(next)}
$('historyAdventureBack').disabled=colonyStep===0}
function historySetMode(mode){const study=mode==='study';$('historyStudyContent').classList.toggle('hidden',!study);$('historyAdventureContent').classList.toggle('hidden',study);$('historyQuizSection').classList.toggle('hidden',!study);$('historyStudyMode').classList.toggle('primary',study);$('historyAdventureMode').classList.toggle('primary',!study);if(!study){historyStop();colonyRender()}}
$('historyStudyMode').onclick=()=>historySetMode('study');
$('historyAdventureMode').onclick=()=>historySetMode('adventure');
$('historyAdventureBack').onclick=()=>{colonyStep=Math.max(0,colonyStep-1);colonyRender()};
$('historyAdventureRestart').onclick=()=>{colonyStep=0;colonyChosen={};colonyRender()};

// Password change requires an existing authenticated session. Never store or log the password.
$('menuChangePassword').onclick=()=>{closeAppMenu();if(!ready||!db)return;$('changePasswordStatus').textContent='';$('changePasswordForm').reset();$('changePasswordDialog').showModal()};
$('cancelPasswordChange').onclick=()=>$('changePasswordDialog').close();
$('changePasswordForm').onsubmit=async(e)=>{e.preventDefault();const a=$('newAccountPassword').value,b=$('confirmAccountPassword').value,st=$('changePasswordStatus'),btn=$('submitNewPassword');if(a.length<12){st.textContent='Χρειάζονται τουλάχιστον 12 χαρακτήρες.';return}if(a!==b){st.textContent='Οι κωδικοί δεν ταιριάζουν.';return}btn.disabled=true;st.textContent='Αποθήκευση…';try{const {error}=await db.auth.updateUser({password:a});if(error)throw error;st.textContent='Ο κωδικός άλλαξε επιτυχώς.';$('changePasswordForm').reset();setTimeout(()=>$('changePasswordDialog').close(),1800)}catch(err){st.textContent='Δεν έγινε αλλαγή: '+(err.message||String(err))}finally{btn.disabled=false}};

// Ε΄ Δημοτικού lessons, based on the official Diophantos school books.
// Physics FE1 refers specifically to the first worksheet in ΥΛΙΚΑ ΣΩΜΑΤΑ (ΟΓΚΟΣ).
const grade5Lessons={
science5:{
label:'Φυσικά Ε΄ · Ενέργεια · ΦΕ1 · Τετράδιο Εργασιών, σελ. 40–42',
title:'ΦΕ1 — Η ενέργεια έχει πολλά «πρόσωπα»',
source:'https://ebooks.edu.gr/ebooks/d/8547/628/10-0133-02_Fysika_E-Dimotikou_Tetradio-Ergasion.pdf#page=42',
quiz:[
{q:'Τι εννοούμε όταν λέμε ότι η ενέργεια έχει πολλά «πρόσωπα»;',options:['Υπάρχουν διαφορετικές μορφές ενέργειας','Η ενέργεια έχει ανθρώπινο πρόσωπο','Η ενέργεια υπάρχει μόνο στα καύσιμα'],a:0,why:'Ανάλογα με την προέλευση και τον τρόπο χρήσης της, μιλάμε για χημική, ηλεκτρική, πυρηνική, κινητική, δυναμική, φωτεινή ενέργεια και θερμότητα.'},
{q:'Ποια ενέργεια βρίσκεται αποθηκευμένη στο φαγητό;',options:['Χημική','Κινητική','Φωτεινή'],a:0,why:'Στα τρόφιμα υπάρχει αποθηκευμένη χημική ενέργεια, την οποία μπορεί να αξιοποιήσει ο οργανισμός μας.'},
{q:'Ποια ενέργεια μεταφέρεται από τους αγωγούς ενός ηλεκτρικού κυκλώματος;',options:['Ηλεκτρική','Πυρηνική','Δυναμική'],a:0,why:'Μέσα στα καλώδια ενός ηλεκτρικού κυκλώματος μεταφέρεται ηλεκτρική ενέργεια.'},
{q:'Μια μπάλα κυλά στο έδαφος. Ποια μορφή ενέργειας έχει εξαιτίας της κίνησής της;',options:['Κινητική','Χημική','Πυρηνική'],a:0,why:'Όταν ένα σώμα κινείται, έχει κινητική ενέργεια.'},
{q:'Ποια ενέργεια είναι αποθηκευμένη σε ένα κουρδισμένο ελατήριο ρολογιού;',options:['Δυναμική','Φωτεινή','Ηλεκτρική'],a:0,why:'Το παραμορφωμένο ελατήριο έχει δυναμική (ελαστική) ενέργεια.'},
{q:'Ποια μορφή ενέργειας συσχετίζουμε με το φως του Ήλιου;',options:['Φωτεινή','Κινητική','Δυναμική'],a:0,why:'Το φως μεταφέρει φωτεινή ενέργεια. Ο Ήλιος παρέχει επίσης ενέργεια που θερμαίνει τη Γη.'},
{q:'Πώς ονομάζεται η ενέργεια που μεταφέρεται από ένα θερμό σώμα σε ένα ψυχρότερο, λόγω διαφοράς θερμοκρασίας;',options:['Θερμότητα','Ηλεκτρική','Πυρηνική'],a:0,why:'Η θερμότητα είναι ενέργεια που μεταφέρεται λόγω της διαφοράς θερμοκρασίας.'},
{q:'Με ποια μορφή ενέργειας συνδέονται οι μεταβολές μέσα στους πυρήνες των ατόμων;',options:['Πυρηνική','Φωτεινή','Κινητική'],a:0,why:'Η πυρηνική ενέργεια συνδέεται με τους πυρήνες των ατόμων.'},
{q:'Ποια ενέργεια υπάρχει στη φιάλη καυσίμου ενός καμινέτου;',options:['Χημική','Ηλεκτρική','Κινητική'],a:0,why:'Το καύσιμο αποθηκεύει χημική ενέργεια, που απελευθερώνεται όταν καίγεται.'},
{q:'Πώς θα συμπλήρωνες τη φράση: «Η ενέργεια εμφανίζεται με διάφορες...»;',options:['μορφές','μάζες','αποστάσεις'],a:0,why:'Η ενέργεια εμφανίζεται με διάφορες μορφές — αυτό είναι το βασικό συμπέρασμα του ΦΕ1.'}
]},
history5:{
label:'Ιστορία Ε΄ · Ενότητα Β΄ · Κεφάλαιο 7 · σελ. 26–28',
title:'Β7 — Η Κωνσταντινούπολη οχυρώνεται και στολίζεται',
source:'https://www.ebooks.edu.gr/ebooks/d/8547/620/10-0118-02_Istoria_E-Dimotikou_Vivlio-Mathiti.pdf#page=26',
quiz:[
{q:'Πότε έγιναν τα εγκαίνια της Κωνσταντινούπολης;',options:['330 μ.Χ.','324 π.Χ.','500 μ.Χ.'],a:0,why:'Η θεμελίωση έγινε το 324 μ.Χ. και τα εγκαίνια τον Μάιο του 330 μ.Χ.'},
{q:'Γιατί ο Κωνσταντίνος ενίσχυσε τα τείχη;',options:['Για την προστασία της πόλης και των νέων περιοχών','Μόνο για διακόσμηση','Για να μην έχουν οι κάτοικοι νερό'],a:0,why:'Η οχύρωση προστάτευε την πρωτεύουσα και τις περιοχές που είχαν επεκταθεί.'},
{q:'Τι υψώθηκε στη μεγάλη αγορά της πόλης;',options:['Στήλη με άγαλμα του αυτοκράτορα','Ένα τεράστιο καράβι','Ένα θέατρο μέσα στο νερό'],a:0,why:'Στην αγορά υπήρχε στήλη με το άγαλμα του Κωνσταντίνου.'},
{q:'Γιατί κατασκεύασαν υδραγωγεία και δεξαμενές;',options:['Για να εξασφαλίζουν νερό','Για να μεγαλώσουν τα τείχη','Για να μεταφέρουν στρατιώτες'],a:0,why:'Οι κρήνες, τα υδραγωγεία και οι δεξαμενές εξυπηρετούσαν την υδροδότηση των κατοίκων.'},
{q:'Τι συνέβη με τους χώρους λατρείας στη νέα πρωτεύουσα;',options:['Διατηρήθηκαν παλαιοί ναοί και χτίστηκαν νέοι χριστιανικοί','Καταργήθηκαν όλοι οι ναοί','Χτίστηκαν μόνο δημόσια λουτρά'],a:0,why:'Σύμφωνα με το σχολικό βιβλίο, διατηρήθηκαν ναοί της παλιάς θρησκείας και ανεγέρθηκαν χριστιανικοί ναοί.'},
{q:'Από πού μεταφέρθηκαν έργα τέχνης για την Κωνσταντινούπολη;',options:['Από τη Ρώμη και άλλα μέρη της αυτοκρατορίας','Μόνο από τη θάλασσα','Αποκλειστικά από την Κωνσταντινούπολη'],a:0,why:'Έφεραν έργα τέχνης από άλλες περιοχές για να στολίσουν την αγορά, τις πλατείες και δημόσιους χώρους.'}
]}};
let grade5Subject='science5',grade5Mode='study',grade5QuizIndex=0,grade5Answered=false,grade5Attempts=0,grade5Queue=[],grade5Skipped=[];
function resetGrade5Quiz(){grade5Queue=grade5Lessons[grade5Subject].quiz.map((_,i)=>i);grade5Skipped=[];grade5QuizIndex=0;}
let grade5CityBuilt=new Set(),grade5EnergyIndex=0,grade5EnergySolved=new Set();
const grade5EnergyCases=[
{art:'bread',name:'Το πρωινό σου',scene:'Ένα κομμάτι ψωμί περιέχει ενέργεια που μπορεί να αξιοποιήσει ο οργανισμός μας.',answer:'Χημική',why:'Η τροφή περιέχει χημική ενέργεια. Το σώμα μας την αξιοποιεί για τις λειτουργίες του.'},
{art:'circuit',name:'Το ηλεκτρικό κύκλωμα',scene:'Μια λάμπα συνδέεται με καλώδια και τροφοδοτείται από ένα ηλεκτρικό κύκλωμα.',answer:'Ηλεκτρική',why:'Στους αγωγούς του κυκλώματος μεταφέρεται ηλεκτρική ενέργεια. Δεν χρειάζεται να αγγίξεις πραγματική πρίζα για να το μάθεις.'},
{art:'atom',name:'Στο εσωτερικό του ατόμου',scene:'Σε έναν πυρηνικό αντιδραστήρα αξιοποιείται ενέργεια που συνδέεται με τους πυρήνες των ατόμων.',answer:'Πυρηνική',why:'Η πυρηνική ενέργεια σχετίζεται με τις μεταβολές στους πυρήνες των ατόμων.'},
{art:'heat',name:'Το ζεστό φλιτζάνι',scene:'Ένα ζεστό φλιτζάνι ακουμπά ένα ψυχρότερο αντικείμενο. Ενέργεια μεταφέρεται λόγω της διαφοράς θερμοκρασίας.',answer:'Θερμότητα',why:'Θερμότητα ονομάζουμε την ενέργεια που μεταφέρεται από το θερμότερο στο ψυχρότερο σώμα εξαιτίας της διαφοράς θερμοκρασίας.'},
{art:'ball',name:'Η μπάλα στο γήπεδο',scene:'Μια μπάλα κυλάει στο έδαφος.',answer:'Κινητική',why:'Η μπάλα έχει κινητική ενέργεια επειδή κινείται. Αν σταματήσει, η κινητική της ενέργεια μηδενίζεται.'},
{art:'bow',name:'Το τεντωμένο τόξο',scene:'Το σχοινί του τόξου είναι τεντωμένο, αλλά το βέλος δεν έχει φύγει ακόμη.',answer:'Δυναμική',why:'Στο τεντωμένο τόξο είναι αποθηκευμένη δυναμική (ελαστική) ενέργεια, λόγω της παραμόρφωσής του.'},
{art:'sun',name:'Το φως του Ήλιου',scene:'Οι ακτίνες του Ήλιου φωτίζουν ένα δωμάτιο.',answer:'Φωτεινή',why:'Το φως μεταφέρει φωτεινή ενέργεια. Είναι μία από τις μορφές που συναντούμε καθημερινά.'},
{art:'fuel',name:'Η φιάλη καυσίμου',scene:'Σε μια φιάλη καμινέτου υπάρχει καύσιμο, πριν ακόμη ανάψει το καμινέτο.',answer:'Χημική',why:'Το καύσιμο διαθέτει αποθηκευμένη χημική ενέργεια. Γι’ αυτό και δεν χρειάζεται να καίγεται ήδη για να υπάρχει ενέργεια.'},
{art:'watch',name:'Το κουρδισμένο ρολόι',scene:'Το ελατήριο ενός μηχανικού ρολογιού έχει κουρδιστεί και είναι παραμορφωμένο.',answer:'Δυναμική',why:'Ένα κουρδισμένο ελατήριο έχει ελαστική δυναμική ενέργεια.'}
];
const grade5EnergyTypes=['Χημική','Ηλεκτρική','Πυρηνική','Θερμότητα','Κινητική','Δυναμική','Φωτεινή'];
function grade5Button(label,fn,cls=''){const b=document.createElement('button');b.type='button';b.textContent=label;if(cls)b.className=cls;b.onclick=fn;return b}
function grade5Panel(title,content){const div=document.createElement('div');div.className='g5-panel';div.innerHTML='<h3>'+title+'</h3>'+content;return div}
function grade5SetMode(mode){grade5Mode=mode;[['study','grade5Study'],['explore','grade5Explore'],['quiz','grade5Questions']].forEach(([m,id])=>$(id).classList.toggle('primary',mode===m));grade5Render()}
function grade5Open(subject,mode){grade5Subject=subject;resetGrade5Quiz();grade5CityBuilt=new Set();grade5EnergyIndex=0;grade5EnergySolved=new Set();$('grade5Subtitle').textContent=grade5Lessons[subject].label;$('grade5Title').textContent=grade5Lessons[subject].title;$('grade5HistoryHero').classList.toggle('hidden',subject!=='history5');if(subject==='history5')$('grade5HistoryHero').innerHTML=window.MathainoIllustrations?.subject('history5')||'';grade5Mode=mode==='practice'?'quiz':'study';viewAll('grade5Lesson');grade5SetMode(grade5Mode)}
function grade5Source(){return '<p class="g5-small">Σχολικό βιβλίο: <a target="_blank" rel="noopener noreferrer" href="'+grade5Lessons[grade5Subject].source+'">Άνοιξε τις αντίστοιχες σελίδες</a>. Το περιεχόμενο εδώ είναι πρωτότυπη απλοποιημένη εξήγηση.</p>'}
function energyDraw(key,compact=false){return window.MathainoArt?window.MathainoArt.draw(key,compact):''}
function grade5EnergyFormCards(){return [
['bread','Χημική','Στις τροφές και στα καύσιμα.'],
['circuit','Ηλεκτρική','Μεταφέρεται στα ηλεκτρικά κυκλώματα.'],
['atom','Πυρηνική','Σχετίζεται με τους πυρήνες των ατόμων.'],
['heat','Θερμότητα','Μεταφέρεται λόγω διαφοράς θερμοκρασίας.'],
['ball','Κινητική','Την έχει ένα σώμα όταν κινείται.'],
['bow','Δυναμική','Για παράδειγμα, σε ένα τεντωμένο ελατήριο.'],
['sun','Φωτεινή','Η ενέργεια που μεταφέρει το φως.']
].map(([art,title,explanation])=>'<div><div class="g5-energy-form-art">'+energyDraw(art,true)+'</div><strong>'+title+'</strong><p>'+explanation+'</p></div>').join('')}
function grade5Render(){const body=$('grade5Body');body.replaceChildren();if(grade5Mode==='quiz'){grade5RenderQuiz();return}if(grade5Subject==='science5'){if(grade5Mode==='study'){body.innerHTML=
'<div class="g5-note"><strong>Τι θα μάθουμε:</strong> Η ενέργεια είναι απαραίτητη για τις αλλαγές γύρω μας. Μπορούμε να την αναγνωρίζουμε με διαφορετικά ονόματα, ανάλογα με το πώς εμφανίζεται και πώς την αξιοποιούμε.</div>'+
'<div class="g5-panel"><h3>Τα επτά «πρόσωπα» της ενέργειας</h3><div class="g5-energy-forms">'+grade5EnergyFormCards()+'</div></div>'+
'<div class="g5-panel"><h3>Παραδείγματα από το τετράδιο</h3>'+
'<div class="g5-energy-example">'+energyDraw('fuel',true)+'<p>Η φιάλη καυσίμου έχει <strong>χημική ενέργεια</strong>.</p></div>'+
'<div class="g5-energy-example">'+energyDraw('watch',true)+'<p>Το κουρδισμένο ελατήριο ενός ρολογιού έχει <strong>δυναμική ενέργεια</strong>.</p></div>'+
'<div class="g5-energy-example">'+energyDraw('ball',true)+'<p>Η μπάλα που κυλάει έχει <strong>κινητική ενέργεια</strong>.</p></div></div>'+
'<div class="g5-note"><strong>Συμπέρασμα:</strong> Η ενέργεια εμφανίζεται με διαφορετικές μορφές. Δεν είναι ανάγκη κάτι να κινείται ή να λάμπει για να περιέχει ενέργεια — μπορεί να είναι αποθηκευμένη σε ένα καύσιμο ή ελατήριο.</div>'+
grade5Source();body.append(grade5Button('Γίνε ντετέκτιβ ενέργειας',()=>grade5SetMode('explore'),'primary'));return}grade5RenderEnergyLab();return}
if(grade5Mode==='study'){
body.innerHTML=
'<div class="g5-note"><strong>Με λίγα λόγια:</strong> Ο Κωνσταντίνος ήθελε η νέα πρωτεύουσα να είναι ασφαλής, λειτουργική και λαμπρή, αντάξια της Ρώμης.</div>'+
'<div class="g5-panel"><h3>324–330 μ.Χ. · Έξι χρόνια εργασιών</h3><p>Η θεμελίωση έγινε τον Νοέμβριο του <strong>324 μ.Χ.</strong> και τα εγκαίνια τον Μάιο του <strong>330 μ.Χ.</strong> Εργάτες και τεχνίτες από πολλά μέρη της αυτοκρατορίας συμμετείχαν στην κατασκευή.</p></div>'+
'<div class="g5-panel"><h3>Οχύρωση</h3><p>Επισκευάστηκαν τα παλιά τείχη και χτίστηκαν νέα, για την προστασία της πόλης και των καινούριων συνοικιών. <strong>Προσοχή:</strong> τα γνωστά Θεοδοσιανά τείχη προστέθηκαν αργότερα· εδώ μιλάμε για τα έργα του Κωνσταντίνου.</p></div>'+
'<div class="g5-panel"><h3>Μια πόλη γεμάτη ζωή</h3><p>Χτίστηκε μεγάλη αγορά με στήλη και άγαλμα του αυτοκράτορα. Δημόσιοι χώροι στολίστηκαν με έργα τέχνης από τη Ρώμη και άλλες περιοχές.</p><p>Διατηρήθηκαν ναοί της παλιάς θρησκείας και χτίστηκαν νέοι χριστιανικοί ναοί. Έργα ύδρευσης, όπως υδραγωγεία, κρήνες και δεξαμενές, έφερναν και αποθήκευαν νερό.</p></div>'+
'<div class="g5-note">Σκέψου: Χωρίς νερό, προστασία και χώρους συνάντησης, πόσο εύκολο θα ήταν να γίνει μια πόλη πρωτεύουσα;</div>'+grade5Source();
body.append(grade5Button('Χτίσε τη νέα πρωτεύουσα',()=>grade5SetMode('explore'),'primary'));return}
grade5RenderCity()}

function grade5RenderEnergyLab(){
const body=$('grade5Body');body.replaceChildren();const total=grade5EnergyCases.length;
if(grade5EnergyIndex>=total){
body.innerHTML='<div class="g5-panel"><h3>Αποστολή ολοκληρώθηκε!</h3><p>Αναγνώρισες τις μορφές ενέργειας σε καθημερινά παραδείγματα, όπως ακριβώς ζητά το ΦΕ1.</p><p><strong>Θυμάσαι τα επτά ονόματα;</strong> Χημική, ηλεκτρική, πυρηνική, θερμότητα, κινητική, δυναμική, φωτεινή.</p></div>';
body.append(grade5Button('↺ Παίξε ξανά',()=>{grade5EnergyIndex=0;grade5EnergySolved=new Set();grade5RenderEnergyLab()},'primary'));
body.append(grade5Button('Ερωτήσεις επανάληψης',()=>{resetGrade5Quiz();grade5SetMode('quiz')}));return}
const item=grade5EnergyCases[grade5EnergyIndex];
const heading=document.createElement('div');heading.className='g5-energy-scene';heading.innerHTML='<div class="g5-energy-art">'+energyDraw(item.art)+'</div><p class="g5-small">ΑΠΟΣΤΟΛΗ '+(grade5EnergyIndex+1)+' ΑΠΟ '+total+'</p><h3>'+item.name+'</h3><p>'+item.scene+'</p>';
const progress=document.createElement('div');progress.className='g5-energy-progress';const bar=document.createElement('div');bar.style.width=Math.round(100*grade5EnergyIndex/total)+'%';progress.append(bar);
const question=document.createElement('p');question.className='g5-energy-prompt';question.textContent='Ποιο «πρόσωπο» της ενέργειας αναγνωρίζεις;';
const options=document.createElement('div');options.className='g5-energy-options';
const feedback=document.createElement('p');feedback.className='g5-feedback hidden';feedback.setAttribute('role','status');
const next=grade5Button(grade5EnergyIndex===total-1?'Ολοκλήρωση →':'Επόμενο παράδειγμα →',()=>{grade5EnergyIndex++;grade5RenderEnergyLab()},'primary hidden mathaino-completion');
const help=document.createElement('p');help.className='g5-small';help.textContent='Διάλεξε μία μορφή. Αν δεν είναι η σωστή, μπορείς να δοκιμάσεις ξανά.';
body.append(progress,heading,question,options,feedback,next,help);
const distractors=grade5EnergyTypes.filter(t=>t!==item.answer);
const selected=[item.answer,...distractors.slice((grade5EnergyIndex*2)%distractors.length).concat(distractors).slice(0,3)];
selected.sort(()=>Math.random()-.5).forEach(name=>{
const btn=grade5Button(name,()=>{
if(grade5EnergySolved.has(grade5EnergyIndex))return;
if(name===item.answer){
grade5EnergySolved.add(grade5EnergyIndex);feedback.className='g5-feedback good';feedback.textContent='Μπράβο! '+item.why;next.classList.remove('hidden');options.querySelectorAll('button').forEach(x=>{x.disabled=true;x.classList.toggle('g5-built',x.textContent===item.answer)})
}else{btn.classList.add('bad');btn.disabled=true;feedback.className='g5-feedback';feedback.textContent='Δεν είναι αυτή η μορφή. Διάβασε ξανά τι συμβαίνει στην εικόνα και δοκίμασε μια άλλη.'}
},'g5-choice');options.append(btn)
});
const back=grade5Button('← Προηγούμενο παράδειγμα',()=>{grade5EnergyIndex=Math.max(0,grade5EnergyIndex-1);grade5EnergySolved.delete(grade5EnergyIndex);grade5RenderEnergyLab()});
back.disabled=grade5EnergyIndex===0;body.append(back)
}
function grade5RenderCity(){const body=$('grade5Body');body.innerHTML='<p>Χτίσε βήμα-βήμα τη νέα πρωτεύουσα. Επίλεξε τα έργα και μάθε γιατί ήταν χρήσιμα.</p><div id="g5CityScene" class="g5-scene"></div><div id="g5CityButtons" class="g5-controls"></div><p id="g5CityFeedback" class="g5-note" role="status">Από ποιο έργο θέλεις να ξεκινήσεις;</p><button id="g5CityReset" type="button">↺ Ξεκίνα ξανά</button>';
$('g5CityScene').innerHTML='<svg viewBox="0 0 620 300" role="img" aria-label="Σχηματική απεικόνιση της Κωνσταντινούπολης, όχι ιστορικά ακριβής χάρτης"><rect width="620" height="300" fill="#c5e5f7"/><path d="M0 180Q150 145 280 182Q390 135 620 190V300H0Z" fill="#d7d0a3"/><path d="M0 265Q170 240 320 267T620 255V300H0Z" fill="#84bf8c"/>'+
'<g id="g5CityWall" class="g5-city-piece"><rect x="47" y="104" width="35" height="137" fill="#bd9a79" stroke="#7e634c" stroke-width="3"/><rect x="78" y="149" width="465" height="29" fill="#c5a485" stroke="#7e634c" stroke-width="3"/><rect x="537" y="104" width="35" height="137" fill="#bd9a79" stroke="#7e634c" stroke-width="3"/>'+Array.from({length:9},(_,i)=>'<rect x="'+(78+i*52)+'" y="138" width="30" height="14" fill="#b39173"/>').join('')+'</g>'+
'<g id="g5CityMarket" class="g5-city-piece"><rect x="193" y="212" width="210" height="34" rx="6" fill="#e6d3a4" stroke="#a1815b" stroke-width="2"/><rect x="287" y="147" width="16" height="63" fill="#eee7da" stroke="#aa927c" stroke-width="2"/><path d="M295 128L309 146H281Z" fill="#986447"/><text x="245" y="263" font-size="16" fill="#3f5262">ΑΓΟΡΑ</text></g>'+
'<g id="g5CityWater" class="g5-city-piece"><path d="M90 210H182V240H90Z" fill="#6ea9bc" stroke="#467d91" stroke-width="3"/><path d="M95 207H180" stroke="#fcfcff" stroke-width="5"/>'+Array.from({length:4},(_,i)=>'<path d="M'+(95+i*22)+' 205V172Q'+(106+i*22)+' 158 '+(117+i*22)+' 172V205" stroke="#aa947c" stroke-width="6" fill="none"/>').join('')+'</g>'+
'<g id="g5CityArt" class="g5-city-piece"><rect x="422" y="212" width="90" height="19" fill="#c2a789"/><rect x="459" y="146" width="14" height="67" fill="#ece1c9"/><circle cx="466" cy="139" r="12" fill="#c5ab8b"/></g>'+
'<g id="g5CityTemple" class="g5-city-piece"><path d="M315 117L374 88L432 117Z" fill="#d09e7e"/><rect x="324" y="120" width="101" height="54" fill="#f7e6c0"/>'+Array.from({length:4},(_,i)=>'<rect x="'+(331+i*25)+'" y="120" width="10" height="54" fill="#ccb995"/>').join('')+'</g>'+
'<text x="18" y="24" fill="#23445b" font-weight="700" font-size="18">Η πόλη χτίζεται · ενδεικτικό σχέδιο</text></svg>';
const options=[['wall','Τείχη','Τα τείχη προστάτευαν την πρωτεύουσα. Ο Κωνσταντίνος επισκεύασε παλιά τμήματα και έκτισε νέα για τις επεκτάσεις της.','g5CityWall'],['water','Υδραγωγεία','Με κρήνες, υδραγωγεία και δεξαμενές η πόλη εξασφάλιζε και αποθήκευε νερό.','g5CityWater'],['market','Αγορά','Η μεγάλη αγορά ήταν σημαντικός δημόσιος χώρος. Στο κέντρο της τοποθετήθηκε στήλη με άγαλμα του Κωνσταντίνου.','g5CityMarket'],['art','Έργα τέχνης','Έργα τέχνης από τη Ρώμη και άλλες περιοχές διακοσμούσαν πλατείες, την αγορά και άλλους χώρους.','g5CityArt'],['temple','Ναοί','Διατηρήθηκαν παλαιοί ναοί και χτίστηκαν νέοι χριστιανικοί. Η εικόνα είναι σχηματική, όχι αναπαράσταση συγκεκριμένου μνημείου.','g5CityTemple']];
const btns=$('g5CityButtons');options.forEach(([key,label,explain,id])=>{const btn=grade5Button(label,()=>{grade5CityBuilt.add(key);$(id).classList.add('built');btn.classList.add('g5-built');$('g5CityFeedback').textContent=explain;if(grade5CityBuilt.size===options.length){$('g5CityFeedback').textContent+=' Ολοκλήρωσες τα σημαντικότερα έργα της νέας πρωτεύουσας!'}});btn.classList.toggle('g5-built',grade5CityBuilt.has(key));btns.append(btn);$(id).classList.toggle('built',grade5CityBuilt.has(key))});
$('g5CityReset').onclick=()=>{grade5CityBuilt=new Set();grade5RenderCity()}}
function grade5RecordQuiz(question,choice,attempt){if(!ready||!db||!cloudChildren[child])return;const payload={child_id:cloudChildren[child].id,subject:grade5Subject,topic:grade5Lessons[grade5Subject].title,question:question.q,selected_answer:question.options[choice],correct_answer:question.options[question.a],is_correct:choice===question.a,attempt_number:attempt};db.from('answer_events').insert(payload).then(({error})=>{if(error)console.warn('Grade 5 answer save failed:',error.message)}).catch(()=>{})}
function grade5RenderQuiz(){
 const body=$('grade5Body'),all=grade5Lessons[grade5Subject].quiz;
 if(!grade5Queue.length)resetGrade5Quiz();
 if(grade5QuizIndex>=grade5Queue.length){
  body.innerHTML='<h3>Ολοκλήρωσες τις ερωτήσεις!</h3>';
  const text=document.createElement('p');
  text.textContent=grade5Skipped.length?'Παρέλειψες '+grade5Skipped.length+' '+(grade5Skipped.length===1?'ερώτηση.':'ερωτήσεις.')+' Μπορείς να τις δοκιμάσεις ξανά.':'Μπορείς να ξαναμελετήσεις ή να δοκιμάσεις άλλη φορά, χωρίς βαθμούς.';
  body.append(text);
  if(grade5Skipped.length)body.append(grade5Button('Δοκίμασε τις παραλειμμένες ('+grade5Skipped.length+')',()=>{
   grade5Queue=grade5Skipped.slice();grade5Skipped=[];grade5QuizIndex=0;grade5Render()
  },'question-retry'));
  body.append(grade5Button('↺ Ξανά από την αρχή',()=>{resetGrade5Quiz();grade5Render()},'primary'));
  return
 }
 grade5Answered=false;grade5Attempts=0;
 const item=all[grade5Queue[grade5QuizIndex]];
 const count=document.createElement('p');count.className='g5-small';
 count.textContent='Ερώτηση '+(grade5QuizIndex+1)+' από '+grade5Queue.length;
 const heading=document.createElement('h3');heading.textContent=item.q;
 const opts=document.createElement('div'),feedback=document.createElement('p');
 feedback.setAttribute('role','status');body.append(count,heading,opts,feedback);
 const skip=grade5Button('Παράλειψη →',()=>{
  if(grade5Answered)return;
  grade5Skipped.push(grade5Queue[grade5QuizIndex]);
  grade5QuizIndex++;grade5Render()
 },'question-skip');
 const order=[...item.options.keys()].sort(()=>Math.random()-.5);
 order.forEach(i=>{
  const b=grade5Button(item.options[i],()=>{
   if(grade5Answered)return;
   grade5Attempts++;grade5RecordQuiz(item,i,grade5Attempts);
   if(i===item.a){
    grade5Answered=true;b.classList.add('good');
    feedback.className='g5-feedback good';feedback.textContent='Σωστά! '+item.why;
    opts.querySelectorAll('button').forEach(x=>x.disabled=true);
    skip.hidden=true;
    body.append(grade5Button(grade5QuizIndex===grade5Queue.length-1?'Ολοκλήρωση →':'Επόμενη →',()=>{
     grade5QuizIndex++;grade5Render()
    },'primary mathaino-completion'))
   }else{
    b.classList.add('bad');b.disabled=true;feedback.className='g5-feedback';
    feedback.textContent='Ξανασκέψου το! '+(grade5Subject==='science5'?'Θυμήσου όσα παρατήρησες στο πείραμα.':'Ξανασκέψου τα έργα της πόλης.')
   }
  });
  b.className='g5-choice';opts.append(b)
 });
 body.append(skip)
}
$('grade5Back').onclick=()=>viewAll('home');
$('grade5Study').onclick=()=>grade5SetMode('study');
$('grade5Explore').onclick=()=>grade5SetMode('explore');
$('grade5Questions').onclick=()=>{resetGrade5Quiz();grade5SetMode('quiz')};
$('historyPlay').innerHTML=lineIcon('play');
$('historyPause').innerHTML=lineIcon('pause');
$('historyReplay').innerHTML=lineIcon('repeat');
$('historyFullscreen').innerHTML=lineIcon('fullscreen');

// The profile picture is the only field children can edit from the child-facing UI.
// All other account and learning settings remain behind the parent PIN screen.
let avatarPickerIndex=-1,avatarReturnView='profiles',avatarSaving=false;
function openAvatarPicker(index,origin='profiles'){
if(!ready||!profiles[index])return;
avatarPickerIndex=index;
avatarReturnView=origin==='home'?'home':'profiles';
const profile=profiles[index];
$('profileNotice').textContent='';
$('avatarPickerChild').textContent='Εικόνα για: '+profile.name;
$('avatarStatus').textContent='';
drawAvatarOptions(index);
viewAll('avatarPicker')
}
function drawAvatarOptions(index){
const library=window.MathainoAvatars;
const selected=avatarIcon(profiles[index].icon);
const options=[...(library?.choices||['boy','girl','astronaut'])];
// Keep previously selected legacy artwork visible until the child chooses a new one.
if(!options.includes(selected))options.push(selected);
const nodes=options.map(id=>{
const button=document.createElement('button');
button.type='button';button.className='avatar-choice';
const label=library?.label(id)||id;
button.innerHTML='<span class="avatar-art-wrap">'+avatarDrawing(id)+'</span><span class="avatar-choice-name"></span><span class="avatar-choice-current"></span>';
button.querySelector('.avatar-choice-name').textContent=label;
button.querySelector('.avatar-choice-current').textContent=selected===id?'Η εικόνα μου':'';
button.setAttribute('aria-label','Επιλογή εικόνας: '+label);
button.setAttribute('aria-pressed',String(selected===id));
button.onclick=()=>saveChildAvatar(index,id);
return button
});
$('avatarOptions').replaceChildren(...nodes)
}
async function saveChildAvatar(index,avatarId){
if(avatarSaving||index!==avatarPickerIndex||!profiles[index])return;
const current=avatarIcon(profiles[index].icon);
if(avatarId===current){viewAll(avatarReturnView);return}
if(!window.MathainoAvatars?.choices.includes(avatarId))return;
const record=cloudChildren[index];
if(!db||!ready||!record?.id){
$('avatarStatus').textContent='Δεν υπάρχει ενεργή σύνδεση. Δοκίμασε ξανά όταν συνδεθείς.';
return
}
avatarSaving=true;
const buttons=[...$('avatarOptions').querySelectorAll('button')];
buttons.forEach(button=>button.disabled=true);
$('avatarCancel').disabled=true;
$('avatarStatus').textContent='Αποθήκευση εικόνας…';
try{
// Update only the icon. Do not send grade, subject permissions, or parent settings.
const {data,error}=await db.from('children').update({icon:avatarId}).eq('id',record.id).select('id,icon');
if(error)throw error;
if(!Array.isArray(data)||data.length!==1||data[0].id!==record.id||data[0].icon!==avatarId)
throw new Error('Η αποθήκευση δεν επιβεβαιώθηκε από τον λογαριασμό.');
profiles[index].icon=avatarId;
record.icon=avatarId;
saveProfiles();
drawProfiles();
if(child===index)avatarHeader(index);
const dest=avatarReturnView;
$('profileNotice').textContent='Η νέα εικόνα αποθηκεύτηκε για το παιδί: '+profiles[index].name+'.';
viewAll(dest);
}catch(error){
$('avatarStatus').textContent='Η εικόνα δεν αποθηκεύτηκε. '+(error?.message||'Προσπάθησε ξανά.')
}finally{
avatarSaving=false;
buttons.forEach(button=>button.disabled=false);
$('avatarCancel').disabled=false
}
}
$('avatarCancel').onclick=()=>{if(avatarSaving)return;viewAll(avatarReturnView)};
$('changeAvatar').onclick=()=>{if(child>=0)openAvatarPicker(child,'home')};

const grade5OldViewAll=viewAll;
viewAll=function(id){grade5OldViewAll(id);$('grade5Lesson').classList.toggle('hidden',id!=='grade5Lesson')};
function grade5UpdateEditor(p){
const isGrade5=String($('editGrade').value||p.grade||'').trim().startsWith('Ε');
for(const [row,key,id] of [['allowScience5Row','science5','allowScience5'],['allowHistory5Row','history5','allowHistory5']]){
$(row).hidden=!isGrade5;
$(id).checked=isGrade5&&(!p.grade5SubjectsConfigured||(p.allowed||[]).includes(key))
}
}
$('editGrade').addEventListener('change',()=>grade5UpdateEditor(profiles[editing]));
const grade5OldChooseChild=chooseChild;
chooseChild=function(j){grade5OldChooseChild(j);const p=profiles[j],isGrade5=String(p.grade||'').trim().startsWith('Ε');for(const key of ['science5','history5']){const b=document.querySelector('#subjects [data-sub="'+key+'"]');b.hidden=!isGrade5||(p.grade5SubjectsConfigured&&!(p.allowed||[]).includes(key))}const active=document.querySelector('#subjects button.active:not([hidden])');if(!active){const first=document.querySelector('#subjects button:not([hidden])');if(first)first.click()}};
const grade5OldTopics=topics;
topics=function(){if(sub==='science5'){$('topic').replaceChildren(new Option('Ενέργεια · ΦΕ1: Η ενέργεια έχει πολλά πρόσωπα','0'));return}if(sub==='history5'){$('topic').replaceChildren(new Option('Β7 · Η Κωνσταντινούπολη οχυρώνεται','0'));return}grade5OldTopics()};
const grade5OldStudy=$('study').onclick,grade5OldPractice=$('practice').onclick;
$('study').onclick=()=>{if(grade5Lessons[sub])grade5Open(sub,'study');else grade5OldStudy()};
$('practice').onclick=()=>{if(grade5Lessons[sub])grade5Open(sub,'practice');else grade5OldPractice()};


const mathainoReadingRender=render;
render=function(){mathainoReadingRender();if(sub==='reading'&&qs[i]&&qs[i].icon){const question=$('question');question.innerHTML=window.MathainoIllustrations?.word(qs[i].icon)||lineIcon(qs[i].icon);question.append(document.createTextNode(' Ποια λέξη ταιριάζει στην εικόνα;'))}};
for(const [id,name] of [['historyStudyMode','reading'],['historyAdventureMode','book'],['grade5Study','reading'],['grade5Explore','water'],['grade5Questions','pencil']]){
const element=$(id);if(element)element.innerHTML=lineIcon(name)+' '+element.textContent
}
function refreshSubjectPanel(){
const library=window.MathainoIllustrations;
const heading=$('selectedSubjectDescription');
if(heading)heading.textContent=library?.descriptions[sub]||'Διάλεξε ενότητα και τρόπο μάθησης.';
const isFixedLesson=['history','history5','science5','chess','cars','spelling'].includes(sub);
const options=$('topic');
const topicCount=options.options?.length||0;
$('topicGroup').hidden=topicCount<=1;
$('topicSingle').hidden=topicCount>1;
$('topicSingle').textContent=topicCount===1?'Ενότητα: '+options.selectedOptions[0].textContent:'';
$('countGroup').hidden=isFixedLesson;
$('exportLesson').hidden=!['math','addition','en','fr'].includes(sub);
$('study').innerHTML=lineIcon('reading')+' Μελέτη';
$('practice').innerHTML=lineIcon('pencil')+' '+(isFixedLesson?'Ερωτήσεις':'Εξάσκηση');
for(const button of document.querySelectorAll('#subjects [data-sub]')){
const current=button.dataset.sub===sub&&!button.hidden;
button.classList.toggle('active',current);
button.setAttribute('aria-pressed',String(current))
}
}
const originalTopicsBeforeIllustrationPanel=topics;
topics=function(){originalTopicsBeforeIllustrationPanel();refreshSubjectPanel()};
const originalChooseChildBeforeIllustrationPanel=chooseChild;
chooseChild=function(index){originalChooseChildBeforeIllustrationPanel(index);refreshSubjectPanel()};


// Offline printable worksheets for current textbook / exercise selection.
$('exportLesson').onclick=()=>{
 if(!['math','addition','en','fr'].includes(sub))return;
 const options=entries(),limit=Math.min(20,Math.max(5,Number($('count').value)||10));
 const label=$('topic').selectedOptions?.[0]?.textContent||'Εξάσκηση';
 const titles={math:'Μαθηματικά · Προπαίδεια',addition:'Μαθηματικά · Προσθέσεις',en:'Αγγλικά',fr:'Γαλλικά'};
 window.MathainoWorksheet?.open({
  kind:'quiz',title:titles[sub]||'Άσκηση',subtitle:label,
  subject:sub,grade:profiles[child]?.grade||'',
  questions:options.slice(0,limit).map(x=>({q:x.q,answer:x.a}))
 })
};
$('historyExport').onclick=()=>{
 window.MathainoWorksheet?.open({
  kind:'quiz',title:'Ιστορία Δ΄ · Οι ελληνικές αποικίες',
  subtitle:'Ερωτήσεις κατανόησης · Πρωτότυπη εξάσκηση',grade:'Δ΄ Δημοτικού',
  subject:'history',questions:historyFacts.map(x=>({q:x.q,options:x.opts,answer:x.a}))
 })
};
$('grade5Export').onclick=()=>{
 const data=grade5Lessons[grade5Subject];
 if(!data)return;
 window.MathainoWorksheet?.open({
  kind:'quiz',title:data.title,subtitle:data.label,
  grade:'Ε΄ Δημοτικού',subject:grade5Subject,
  questions:data.quiz.map(x=>({q:x.q,options:x.options,correct:x.a,answer:x.options[x.a]}))
 })
};
