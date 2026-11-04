/* Μαθαίνω! v0.6.76 — original touch-first Greek coding pilot.
   All six puzzles can be selected freely. No scores, streaks, accounts or telemetry. */
(function(){
'use strict';
const core=window.MathainoCodingCore;
if(!core)return;
const get=id=>document.getElementById(id);
const main=document.querySelector('main'),home=get('home'),subjects=get('subjects');
if(!main||!home||!subjects)return;
const section=document.createElement('section');
section.id='codingLesson';section.className='hidden';
section.innerHTML=
 '<div class="coding-top"><button id="codingBack" type="button">← Μαθήματα</button><span>ΛΟΓΙΚΗ • ΡΟΜΠΟΤ • ΕΝΤΟΛΕΣ</span></div>'+
 '<h2>Μικρός Προγραμματιστής</h2>'+
 '<p class="coding-intro">Φτιάξε εντολές και δες τι κάνει το ρομπότ. Χωρίς χρονόμετρο, βαθμολογία ή πίεση.</p>'+
 '<div id="codingLevels" class="coding-levels" role="group" aria-label="Διάλεξε αποστολή"></div>'+
 '<div class="coding-title-line"><div><h3 id="codingTitle"></h3><p id="codingConcept"></p></div><span id="codingCount"></span></div>'+
 '<p id="codingPrompt" class="coding-prompt"></p>'+
 '<div class="coding-workspace">'+
 ' <div class="coding-map-panel"><div id="codingBoard" class="coding-board" role="group" aria-label="Πλέγμα πέντε επί πέντε"></div>'+
 ' <p class="coding-legend">🤖 Ρομπότ &nbsp; ★ Στόχος &nbsp; ■ Εμπόδιο</p></div>'+
 ' <div class="coding-control-panel"><h3>1. Διάλεξε εντολές</h3>'+
 ' <div id="codingToolbox" class="coding-toolbox" role="group" aria-label="Διαθέσιμες εντολές"></div>'+
 ' <h3>2. Το πρόγραμμά μου</h3><p class="coding-helper">Πάτησε μια εντολή του προγράμματος για να προσθέσεις κάτι μετά από αυτήν. Το × τη σβήνει.</p>'+
 ' <div id="codingProgram" class="coding-program" aria-label="Εντολές του προγράμματος"></div>'+
 ' <div class="coding-edit-actions"><button id="codingUndo" type="button">↶ Πίσω μία εντολή</button><button id="codingClear" type="button">Καθάρισε πρόγραμμα</button></div></div></div>'+
 '<div class="coding-bottom"><div id="codingStatus" class="coding-status" role="status" aria-live="polite"></div>'+
 '<div class="coding-actions"><button id="codingRun" class="primary" type="button">▶ Εκτέλεση</button>'+
 '<button id="codingStep" class="primary" type="button">Βήμα →</button>'+
 '<button id="codingStop" type="button">Σταμάτα</button>'+
 '<button id="codingReset" type="button">Από την αρχή</button>'+
 '<button id="codingHint" type="button">Μικρή βοήθεια</button></div>'+
 '<button id="codingNext" class="primary" type="button" hidden>Επόμενη αποστολή →</button></div>';
home.after(section);
const tile=document.createElement('button');
tile.type='button';tile.dataset.sub='coding';
tile.setAttribute('aria-label','Μικρός Προγραμματιστής — εισαγωγή στον προγραμματισμό');
tile.innerHTML='<span class="subject-illustration coding-subject-art" aria-hidden="true">'+
 '<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img"><rect x="30" y="8" width="140" height="102" rx="22" fill="#d9eef4" stroke="#458c9a" stroke-width="4"/>'+
 '<rect x="55" y="29" width="90" height="63" rx="15" fill="#fff" stroke="#428b97" stroke-width="4"/>'+
 '<circle cx="81" cy="55" r="8" fill="#237e55"/><circle cx="118" cy="55" r="8" fill="#237e55"/>'+
 '<path d="M80 75q20 14 40 0" stroke="#2c697e" stroke-width="5" fill="none" stroke-linecap="round"/>'+
 '<path d="M100 29V17" stroke="#2c697e" stroke-width="4"/><circle cx="100" cy="14" r="5" fill="#f0ae65"/>'+
 '<path d="m24 58-16 0m184 0-16 0" stroke="#458c9a" stroke-width="6" stroke-linecap="round"/></svg></span>'+
 '<span class="subject-title">Μικρός Προγραμματιστής</span><span class="subject-desc">Οδήγησε ένα ρομπότ με τις δικές σου εντολές</span>';
subjects.append(tile);
const arrows=['↑','→','↓','←'];
let levelNumber=0,level=core.levels[0],robot=core.initial(level),goal=level.goal,program=[],cursor=0,pc=0;
let actions=[],timer=null,running=false,finished=false,won=false,message='',messageKind='info';
function status(text,kind){message=text;messageKind=kind||'info';const el=get('codingStatus');el.textContent=text;el.dataset.kind=messageKind}
function stopRun(){if(timer!==null)clearTimeout(timer);timer=null;running=false}
function resetRobot(){
 stopRun();robot=core.initial(level);pc=0;finished=false;won=false;
 actions=core.expand(program);
 get('codingNext').hidden=true;
}
function updateBoard(){
 const board=get('codingBoard');board.replaceChildren();
 const obstacle=level.walls;
 for(let y=0;y<core.size;y++)for(let x=0;x<core.size;x++){
  const wall=obstacle.some(w=>w[0]===x&&w[1]===y);
  const isRobot=robot.x===x&&robot.y===y,isGoal=goal&&goal[0]===x&&goal[1]===y;
  const cell=document.createElement(level.creative?'button':'div');
  if(level.creative){cell.type='button';cell.disabled=wall||isRobot;
   cell.onclick=()=>{if(wall||isRobot)return;goal=[x,y];resetRobot();status('Ωραία! Τώρα οδήγησε το ρομπότ στο αστέρι.','info');render()};
  }
  cell.className='coding-cell'+(wall?' is-wall':'')+(isGoal?' is-goal':'')+(isRobot?' is-robot':'');
  const name= isRobot?'Ρομπότ, κοιτάζει '+['πάνω','δεξιά','κάτω','αριστερά'][robot.dir]:wall?'Εμπόδιο':isGoal?'Στόχος':'Κενό τετράγωνο';
  cell.setAttribute('aria-label','Σειρά '+(y+1)+', στήλη '+(x+1)+': '+name);
  if(wall)cell.textContent='■';
  if(isGoal){const star=document.createElement('span');star.className='coding-star';star.textContent='★';cell.append(star)}
  if(isRobot){const bot=document.createElement('span');bot.className='coding-robot';bot.textContent='🤖';
   const face=document.createElement('small');face.textContent=arrows[robot.dir];bot.append(face);cell.append(bot)}
  board.append(cell)
 }
}
function renderLevels(){
 const host=get('codingLevels');host.replaceChildren();
 core.levels.forEach((item,i)=>{
  const b=document.createElement('button');b.type='button';b.className=i===levelNumber?'coding-level active':'coding-level';
  b.textContent=String(i+1)+'. '+item.title;
  b.setAttribute('aria-pressed',String(i===levelNumber));
  b.setAttribute('aria-label','Αποστολή '+(i+1)+', '+item.title+', προτεινόμενη τάξη '+item.grade);
  b.onclick=()=>selectLevel(i);host.append(b);
 })
}
function renderToolbox(){
 const host=get('codingToolbox');host.replaceChildren();
 level.available.forEach(op=>{
  const b=document.createElement('button');b.type='button';b.textContent=core.commands[op].label;
  b.className='coding-command';
  b.onclick=()=>insert(op);b.disabled=running||program.length>=18;
  host.append(b)
 })
}
function renderProgram(){
 const host=get('codingProgram');host.replaceChildren();
 if(!program.length){const empty=document.createElement('p');empty.className='coding-empty';empty.textContent='Το πρόγραμμά σου είναι άδειο. Πάτησε μια εντολή από πάνω.';host.append(empty)}
 program.forEach((op,i)=>{
  if(cursor===i){const marker=document.createElement('span');marker.className='coding-insertion';marker.textContent='+';marker.setAttribute('aria-label','Θέση εισαγωγής');host.append(marker)}
  const outer=document.createElement('div');outer.className='coding-program-item';
  const pick=document.createElement('button');pick.type='button';pick.className='coding-program-command';
  if(actions[pc]&&actions[pc].source===i&&!finished)pick.classList.add('executing');
  if(cursor===i+1)pick.classList.add('selected');
  pick.textContent=core.commands[op].short+' '+(i+1);
  pick.title=core.commands[op].label;
  pick.setAttribute('aria-label','Εντολή '+(i+1)+': '+core.commands[op].label+'. Πάτησε για να εισάγεις μετά.');
  pick.onclick=()=>{cursor=i+1;renderProgram()};
  const remove=document.createElement('button');remove.type='button';remove.className='coding-delete';
  remove.textContent='×';remove.setAttribute('aria-label','Αφαίρεσε την εντολή '+(i+1));
  remove.onclick=()=>{program.splice(i,1);cursor=i;resetRobot();status('Άλλαξες το πρόγραμμα. Δοκίμασέ το!');render()};
  outer.append(pick,remove);host.append(outer)
 });
 if(cursor===program.length&&program.length){const marker=document.createElement('span');marker.className='coding-insertion';marker.textContent='+';marker.setAttribute('aria-label','Τέλος προγράμματος');host.append(marker)}
}
function render(){
 updateBoard();renderLevels();renderToolbox();renderProgram();
 get('codingRun').disabled=running||finished||!program.length||!goal;
 get('codingStep').disabled=running||finished||!program.length||!goal;
 get('codingStop').disabled=!running;
 get('codingUndo').disabled=running||!program.length;
 get('codingClear').disabled=running||!program.length;
 get('codingNext').hidden=!won;
 get('codingNext').textContent=levelNumber===core.levels.length-1?'Άλλη αποστολή →':'Επόμενη αποστολή →';
 status(message,messageKind)
}
function selectLevel(n){
 if(n<0||n>=core.levels.length)return;
 stopRun();levelNumber=n;level=core.levels[n];goal=level.goal?level.goal.slice():null;
 program=level.starter.slice();cursor=program.length;
 resetRobot();
 get('codingTitle').textContent=level.title;get('codingConcept').textContent=level.concept+' · Προτεινόμενο: '+level.grade;
 get('codingCount').textContent='Αποστολή '+(n+1)+' / '+core.levels.length;
 get('codingPrompt').textContent=level.prompt;
 status(level.creative?'Άγγιξε ένα κενό τετράγωνο για να ορίσεις τον στόχο.':'Φτιάξε το πρόγραμμα και πάτησε «Εκτέλεση» ή «Βήμα».','info');
 render()
}
function insert(op){
 if(running||program.length>=18||!level.available.includes(op))return;
 program.splice(cursor,0,op);cursor++;resetRobot();status('Πρόσθεσες εντολή. Δοκίμασε το πρόγραμμα!');render()
}
function finishFailure(text){stopRun();finished=true;status(text,'try');render()}
function complete(){
 stopRun();finished=true;
 if(!core.eligible(level,program)){
  status(level.required==='F3'?'Έφτασες στο αστέρι! Δοκίμασε τώρα την «Επανάληψη 3 × Μπροστά».':'Έφτασες στο αστέρι! Δοκίμασε τη συνθήκη «Αν υπάρχει εμπόδιο».','try');
  render();return
 }
 won=true;status('Το ρομπότ έφτασε! Το πρόγραμμά σου δούλεψε. Μπορείς να δοκιμάσεις και άλλον τρόπο.','good');render()
}
function advance(){
 if(finished)return;
 if(!goal){status('Διάλεξε πρώτα τον στόχο στον χάρτη.','try');return}
 if(!actions.length){status('Βάλε πρώτα μία εντολή στο πρόγραμμά σου.','try');return}
 if(pc>=actions.length){finishFailure('Το πρόγραμμα τελείωσε πριν φτάσεις στο αστέρι. Μπορείς να προσθέσεις εντολές.');return}
 const action=actions[pc];pc++;
 const result=core.step(level,robot,action);robot=result.robot;
 if(result.blocked){finishFailure('Το ρομπότ βρήκε εμπόδιο ή το άκρο του χάρτη. Βρες την εντολή που χρειάζεται αλλαγή.');return}
 if(core.reached(robot,goal)){complete();return}
 if(pc>=actions.length){finishFailure('Το ρομπότ σταμάτησε πριν φτάσει στο αστέρι. Πρόσθεσε ή άλλαξε εντολές.');return}
 status('Εκτελέστηκε το βήμα '+pc+' από '+actions.length+'.','info');render()
}
function run(){
 if(running||finished||!program.length||!goal)return;
 running=true;status('Το ρομπότ εκτελεί τις εντολές…');render();
 function tick(){
  if(!running)return;
  advance();
  if(finished||!running){stopRun();render();return}
  timer=setTimeout(tick,480)
 }
 timer=setTimeout(tick,240)
}
const codingTileOpen=()=>{sub='coding';topics();document.querySelectorAll('#subjects button').forEach(b=>b.classList.toggle('active',b===tile));selectLevel(0);viewAll('codingLesson')};
tile.onclick=codingTileOpen;
get('codingBack').onclick=()=>{stopRun();viewAll('home')};
get('codingRun').onclick=run;
get('codingStep').onclick=()=>{if(!running)advance()};
get('codingStop').onclick=()=>{stopRun();status('Η εκτέλεση σταμάτησε. Συνέχισε με «Βήμα» ή «Εκτέλεση».');render()};
get('codingReset').onclick=()=>{resetRobot();status('Το ρομπότ επέστρεψε στην αρχή. Το πρόγραμμά σου έμεινε ίδιο.');render()};
get('codingClear').onclick=()=>{stopRun();program=[];cursor=0;resetRobot();status('Το πρόγραμμα καθαρίστηκε. Φτιάξε ένα καινούργιο.');render()};
get('codingUndo').onclick=()=>{if(!program.length||running)return;program.splice(Math.max(0,cursor-1),1);cursor=Math.max(0,cursor-1);resetRobot();status('Αφαιρέθηκε μία εντολή.');render()};
get('codingHint').onclick=()=>status(level.hint,'hint');
get('codingNext').onclick=()=>selectLevel(levelNumber===core.levels.length-1?0:levelNumber+1);
const previousView=viewAll;
viewAll=function(id){previousView(id);section.classList.toggle('hidden',id!=='codingLesson'||!ready)};
const previousChoose=chooseChild;
chooseChild=function(index){
 previousChoose(index);
 tile.hidden=false;
 if(!document.querySelector('#subjects button.active:not([hidden])'))tile.click()
};
const previousTopics=topics;
topics=function(){
 if(sub!=='coding'){previousTopics();return}
 get('topic').replaceChildren(new Option('Έξι αποστολές χωρίς βαθμολογία','0'));
 refreshSubjectPanel();
 get('countGroup').hidden=true;get('topicGroup').hidden=true;get('topicSingle').hidden=true;
 get('practice').hidden=true;get('exportLesson').hidden=true;
 get('study').textContent='Ξεκίνα τις αποστολές'
};
const oldStudy=get('study').onclick,oldPractice=get('practice').onclick;
get('study').onclick=()=>{if(sub==='coding')codingTileOpen();else oldStudy()};
get('practice').onclick=()=>{if(sub==='coding')codingTileOpen();else oldPractice()};
selectLevel(0);
window.MathainoCodingPilot=Object.freeze({levelCount:core.levels.length,open:codingTileOpen});
})();