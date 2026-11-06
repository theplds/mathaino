/* Μαθαίνω! v0.6.80 • beginner chess + licensed real-car brand recognition.
   Chess module teaches piece movement only; not a full game engine. */
(function(){
'use strict';
/* Verified Wikimedia Commons images with direct, deterministic thumbnail URLs.
   localName is reserved for future locally bundled copies, not deployed files. */
const photoBank=[{"brand":"Ferrari","model":"458 Italia","color":"red","view":"front three-quarter","file":"2014 Ferrari 458 Italia Rosso Scuderia front three quarter.jpg","author":"Trans-nyan","license":"CC BY-SA 4.0","localName":"ferrari-458-italia.jpg","url":"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2014_Ferrari_458_Italia_Rosso_Scuderia_front_three_quarter.jpg/960px-2014_Ferrari_458_Italia_Rosso_Scuderia_front_three_quarter.jpg","licenseUrl":"https://creativecommons.org/licenses/by-sa/4.0/"},{"brand":"Lamborghini","model":"Huracán STO","color":"green","view":"front","file":"Lamborghini Huracán STO Verde Speranza (5).jpg","author":"Damian B Oh","license":"CC BY-SA 4.0","localName":"lamborghini-hurac-n-sto.jpg","url":"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Lamborghini_Hurac%C3%A1n_STO_Verde_Speranza_(5).jpg/960px-Lamborghini_Hurac%C3%A1n_STO_Verde_Speranza_(5).jpg","licenseUrl":"https://creativecommons.org/licenses/by-sa/4.0/"},{"brand":"Porsche","model":"911 GT3 RS (997)","color":"orange","view":"front","file":"Orange Porsche 911 GT3 RS Type 997 (front).jpg","author":"Francesco Gasparetti","license":"CC BY 2.0","localName":"porsche-911-gt3-rs-997-.jpg","url":"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Orange_Porsche_911_GT3_RS_Type_997_(front).jpg/960px-Orange_Porsche_911_GT3_RS_Type_997_(front).jpg","licenseUrl":"https://creativecommons.org/licenses/by/2.0/"},{"brand":"BMW","model":"M4","color":"blue","view":"front","file":"2015 BMW M4 (UK) front view.jpg","author":"Hugh Llewelyn","license":"CC BY-SA 2.0","localName":"bmw-m4.jpg","url":"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/2015_BMW_M4_(UK)_front_view.jpg/960px-2015_BMW_M4_(UK)_front_view.jpg","licenseUrl":"https://creativecommons.org/licenses/by-sa/2.0/"},{"brand":"Mercedes-Benz","model":"AMG GT 63 S E Performance","color":"red","view":"front","file":"Mercedes-AMG GT 63 S E PERFORMANCE Coupé (C192) front.jpg","author":"Tokumeigakarinoaoshima","license":"CC0 1.0","localName":"mercedes-benz-amg-gt-63-s-e-performance.jpg","url":"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mercedes-AMG_GT_63_S_E_PERFORMANCE_Coup%C3%A9_(C192)_front.jpg/960px-Mercedes-AMG_GT_63_S_E_PERFORMANCE_Coup%C3%A9_(C192)_front.jpg","licenseUrl":"https://creativecommons.org/publicdomain/zero/1.0/"},{"brand":"Audi","model":"R8 4.2","color":"yellow","view":"front-oblique","file":"Audi R8 yellow.jpg","author":"Milad Mosapoor","license":"Attribution only","localName":"audi-r8-4-2.jpg","url":"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Audi_R8_yellow.jpg/960px-Audi_R8_yellow.jpg","licenseUrl":"https://commons.wikimedia.org/wiki/File:Audi_R8_yellow.jpg"},{"brand":"Nissan","model":"GT-R Premium Edition","color":"blue","view":"front","file":"Nissan GT-R Premium Edition (4BA-R35) front.jpg","author":"Tokumeigakarinoaoshima","license":"CC BY-SA 4.0","localName":"nissan-gt-r-premium-edition.jpg","url":"https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Nissan_GT-R_Premium_Edition_(4BA-R35)_front.jpg/960px-Nissan_GT-R_Premium_Edition_(4BA-R35)_front.jpg","licenseUrl":"https://creativecommons.org/licenses/by-sa/4.0/"},{"brand":"Ford","model":"Mustang GT","color":"red","view":"front-right","file":"2024 Ford Mustang 5.0 GT in Race Red, front right.jpg","author":"Ethan Llamas","license":"CC BY-SA 4.0","localName":"ford-mustang-gt.jpg","url":"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/2024_Ford_Mustang_5.0_GT_in_Race_Red%2C_front_right.jpg/960px-2024_Ford_Mustang_5.0_GT_in_Race_Red%2C_front_right.jpg","licenseUrl":"https://creativecommons.org/licenses/by-sa/4.0/"},{"brand":"Chevrolet","model":"Corvette C8","color":"red","view":"front-right","file":"2020-2027 Chevrolet Corvette, red, front right side, Golden Super Cruise 2026-10-03.jpg","author":"Xnatedawgx","license":"CC BY-SA 4.0","localName":"chevrolet-corvette-c8.jpg","url":"https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/2020-2027_Chevrolet_Corvette%2C_red%2C_front_right_side%2C_Golden_Super_Cruise_2026-10-03.jpg/960px-2020-2027_Chevrolet_Corvette%2C_red%2C_front_right_side%2C_Golden_Super_Cruise_2026-10-03.jpg","licenseUrl":"https://creativecommons.org/licenses/by-sa/4.0/"},{"brand":"Tesla","model":"Model S","color":"blue","view":"front","file":"Tesla Model S Deep Blue Metallic Front.jpg","author":"Ominae","license":"CC BY-SA 4.0","localName":"tesla-model-s.jpg","url":"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Tesla_Model_S_Deep_Blue_Metallic_Front.jpg/960px-Tesla_Model_S_Deep_Blue_Metallic_Front.jpg","licenseUrl":"https://creativecommons.org/licenses/by-sa/4.0/"}];
const chessSteps=[{"piece":"R","from":"d4","to":"d7","title":"Ο πύργος","fact":"Ο πύργος κινείται μόνο οριζόντια ή κάθετα.","hint":"Βρες το σημείο στον ίδιο δρόμο, τρία τετράγωνα πιο πάνω."},{"piece":"B","from":"c1","to":"f4","title":"Ο αξιωματικός","fact":"Ο αξιωματικός κινείται διαγώνια.","hint":"Προχώρησε τρεις θέσεις διαγώνια."},{"piece":"N","from":"g1","to":"f3","title":"Το άλογο","fact":"Το άλογο πηδά σε σχήμα Γ: δύο τετράγωνα στη μία κατεύθυνση και ένα στην άλλη.","hint":"Δύο προς τα πάνω, ένα προς τα αριστερά."},{"piece":"Q","from":"d1","to":"h5","title":"Η βασίλισσα","fact":"Η βασίλισσα μπορεί να κινηθεί σαν πύργος ή αξιωματικός.","hint":"Η διαγώνιος από τη βασίλισσα φτάνει προς τα πάνω και δεξιά."},{"piece":"K","from":"e1","to":"f2","title":"Ο βασιλιάς","fact":"Ο βασιλιάς πηγαίνει ένα τετράγωνο προς οποιαδήποτε κατεύθυνση.","hint":"Μόνο ένα βήμα διαγώνια."},{"piece":"P","from":"e2","to":"e4","title":"Το πιόνι","fact":"Στην πρώτη κίνησή του το πιόνι μπορεί να πάει ένα ή δύο τετράγωνα μπροστά, αν είναι ελεύθερα.","hint":"Δύο τετράγωνα μπροστά από την αρχική θέση."}];
const $x=id=>document.getElementById(id);
const shuffleArray=a=>{const arr=a.slice();for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}return arr};
const chessGlyph={R:'♖',B:'♗',N:'♘',Q:'♕',K:'♔',P:'♙'};
const sqCoords=s=>['abcdefgh'.indexOf(s[0]),Number(s[1])-1];
const sqName=(file,rank)=>'abcdefgh'[file]+String(rank+1);
const within=(f,r)=>f>=0&&f<8&&r>=0&&r<8;
function possibleSquares(p){
const [f,r]=sqCoords(p.from),all=[];
for(let nf=0;nf<8;nf++)for(let nr=0;nr<8;nr++){
const dx=nf-f,dy=nr-r,ad=Math.abs(dx),bd=Math.abs(dy);
const yes=p.piece==='R'?(dx===0)!==(dy===0):
p.piece==='B'?ad===bd&&ad>0:
p.piece==='N'?(ad===1&&bd===2)||(ad===2&&bd===1):
p.piece==='Q'?(dx===0)!==(dy===0)||ad===bd&&ad>0:
p.piece==='K'?Math.max(ad,bd)===1:
p.piece==='P'?dx===0&&(dy===1||r===1&&dy===2):false;
if(yes&&within(nf,nr))all.push(sqName(nf,nr))
}
return all
}
let chessIndex=0,chessSelected=false,chessSolved=false;
function drawChess(){
const step=chessSteps[chessIndex],board=$x('chessBoard'),legal=possibleSquares(step);
board.replaceChildren();
for(let rank=7;rank>=0;rank--)for(let file=0;file<8;file++){
const square=sqName(file,rank),b=document.createElement('button');
b.type='button';b.className='chess-square'+((file+rank)%2===0?' dark':' light');
if(square===step.from)b.classList.add('has-piece');
if(square===step.to)b.classList.add('chess-target');
if(chessSelected&&legal.includes(square))b.classList.add('chess-legal');
if(chessSolved&&square===step.to)b.classList.add('chess-success');
b.setAttribute('aria-label',square+(square===step.from?' '+step.title:''));
b.setAttribute('aria-pressed',String(chessSelected&&square===step.from));
const piece=document.createElement('span');piece.className='chess-piece';
piece.textContent=chessSolved?(square===step.to?chessGlyph[step.piece]:''):(square===step.from?chessGlyph[step.piece]:'');
b.append(piece);
if(file===0){const lab=document.createElement('span');lab.className='chess-rank';lab.textContent=String(rank+1);b.append(lab)}
if(rank===0){const lab=document.createElement('span');lab.className='chess-file';lab.textContent='abcdefgh'[file];b.append(lab)}
b.onclick=()=>pickChess(square);
board.append(b)
}
$x('chessStep').textContent='Κίνηση '+(chessIndex+1)+' από '+chessSteps.length;
$x('chessHeading').textContent=step.title;
$x('chessFact').textContent=step.fact;
$x('chessHint').textContent=chessSolved?'Πολύ καλά!':chessSelected?'Πάτησε το τετράγωνο με τον μικρό κύκλο.':'Πάτησε πρώτα το κομμάτι και μετά τον κύκλο.';
$x('chessNext').classList.toggle('hidden',!chessSolved);
$x('chessNext').textContent=chessIndex===chessSteps.length-1?'Από την αρχή':'Επόμενο κομμάτι';
$x('chessHelp').textContent='';
}
function pickChess(s){
if(chessSolved)return;
const step=chessSteps[chessIndex];
if(s===step.from){chessSelected=!chessSelected;drawChess();return}
if(!chessSelected){$x('chessHelp').textContent='Πρώτα πάτησε το κομμάτι.';return}
if(s===step.to){chessSolved=true;drawChess();$x('chessHint').textContent='Μπράβο! '+step.fact;return}
$x('chessHelp').textContent=possibleSquares(step).includes(s)?'Το κομμάτι μπορεί να πάει εκεί. Βρες τώρα τον κύκλο.':'Αυτό το κομμάτι δεν κινείται έτσι. Δες τον κύκλο.';
}
function openChess(){
chessIndex=0;chessSelected=false;chessSolved=false;drawChess();viewAll('chessLesson')
}
$x('chessBack').onclick=()=>viewAll('home');
$x('chessNext').onclick=()=>{chessIndex=chessIndex===chessSteps.length-1?0:chessIndex+1;chessSelected=false;chessSolved=false;drawChess()};
$x('chessShowHint').onclick=()=>{$x('chessHelp').textContent=chessSteps[chessIndex].hint};
let carsRound=[],carIndex=0,carSolved=false,carAttempted=false,carLoadToken=0;
let carZoomed=false;
function updateCarZoom(){
 const frame=$x('carPictureFrame'),button=$x('carZoom');
 frame.classList.toggle('is-zoomed',carZoomed);
 button.setAttribute('aria-pressed',String(carZoomed));
 button.textContent=carZoomed?'Πλήρης εικόνα':'Μεγέθυνση σήματος';
}
$x('carZoom').onclick=()=>{carZoomed=!carZoomed;updateCarZoom()};
function commonsLink(file){return 'https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(file).replace(/%20/g,'_')}
function originalPhotoURL(photo){
 // Wikimedia uses the same canonical hash path for the full-resolution file.
 return photo.url.replace('/wikipedia/commons/thumb/','/wikipedia/commons/').replace(/\/960px-[^/]+$/,'')
}
function photoCandidates(photo){
 return [photo.url,originalPhotoURL(photo),
  'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(photo.file)+'?width=800']
}
function carAnswersFor(current){
 const pool=shuffleArray(photoBank.filter(x=>x.brand!==current.brand)).slice(0,3).map(x=>x.brand);
 const options=shuffleArray([current.brand,...pool]);
 $x('carAnswers').replaceChildren(...options.map(name=>{
  const b=document.createElement('button');b.type='button';b.className='car-answer';b.textContent=name;
  b.onclick=()=>{
   if(carSolved)return;
   if(name===current.brand){
    carSolved=true;b.classList.add('good');
    for(const other of $x('carAnswers').querySelectorAll('button'))other.disabled=true;
    $x('carFeedback').textContent='Σωστά! Είναι '+current.brand+' '+current.model+'.';
    $x('carNext').classList.remove('hidden');
   }else{
    carAttempted=true;b.classList.add('bad');b.disabled=true;
    $x('carFeedback').textContent='Δοκίμασε άλλη μάρκα.'
   }
  };
  return b
 }))
}
function nextCar(){
 const current=carsRound[carIndex];carSolved=false;carAttempted=false;
 const token=++carLoadToken,img=$x('carPicture'),fallback=$x('carImageFallback');
 carZoomed=false;updateCarZoom();$x('carZoom').disabled=true;
 img.style.display='block';fallback.classList.add('hidden');fallback.replaceChildren();
 img.alt='Πραγματική φωτογραφία αυτοκινήτου. Μάντεψε τη μάρκα.';
 img.loading='eager';img.decoding='async';
 $x('carProgress').textContent='Αυτοκίνητο '+(carIndex+1)+' από '+carsRound.length;
 $x('carFeedback').textContent='Φόρτωση φωτογραφίας…';
 $x('carNext').classList.add('hidden');
 // Never ask a child to identify a car whose picture has failed to load.
 $x('carAnswers').replaceChildren();
 const credits=$x('carPhotoCredit');credits.replaceChildren();
 credits.append(document.createTextNode('Φωτογραφία: '+current.author+' · '));
 const source=document.createElement('a');source.textContent='Wikimedia Commons';source.href=commonsLink(current.file);source.target='_blank';source.rel='noopener noreferrer';
 const license=document.createElement('a');license.textContent=current.license;license.href=current.licenseUrl;license.target='_blank';license.rel='noopener noreferrer';
 credits.append(source,document.createTextNode(' · '),license);
 const urls=photoCandidates(current);let tryIndex=0;
 img.onload=()=>{
  if(token!==carLoadToken)return;
  fallback.classList.add('hidden');$x('carFeedback').textContent='';
  $x('carZoom').disabled=false;
  carAnswersFor(current)
 };
 img.onerror=()=>{
  if(token!==carLoadToken)return;
  tryIndex++;
  if(tryIndex<urls.length){img.src=urls[tryIndex];return}
  img.style.display='none';fallback.classList.remove('hidden');
  fallback.textContent='Η φωτογραφία δεν είναι διαθέσιμη. Δοκίμασε «Παράλειψη» για άλλο αυτοκίνητο. ';
  const link=document.createElement('a');
  link.href=commonsLink(current.file);link.target='_blank';link.rel='noopener noreferrer';
  link.textContent='Πηγή φωτογραφίας';
  fallback.append(link);
  $x('carFeedback').textContent='Δεν εμφανίστηκε φωτογραφία, οπότε δεν θα ζητήσουμε μαντεψιά.'
 };
 img.src=urls[0]
}
function openCars(){
carsRound=shuffleArray(photoBank);carIndex=0;nextCar();viewAll('carLesson')
}
$x('carBack').onclick=()=>viewAll('home');
$x('carNext').onclick=()=>{if(carIndex===carsRound.length-1){openCars();return}carIndex++;nextCar()};
$x('carSkip').onclick=()=>{if(carIndex===carsRound.length-1){openCars();return}carIndex++;nextCar()};
const oldViewAll=viewAll;
viewAll=function(id){oldViewAll(id);$x('chessLesson').classList.toggle('hidden',id!=='chessLesson');$x('carLesson').classList.toggle('hidden',id!=='carLesson')};
const oldChooseChild=chooseChild;
chooseChild=function(index){
oldChooseChild(index);
const p=profiles[index];
for(const name of ['chess','cars']){
const b=document.querySelector('#subjects [data-sub="'+name+'"]');
if(!b)continue;
b.hidden=!!p.extraSubjectsConfigured&&!(p.allowed||[]).includes(name);
}
const selected=document.querySelector('#subjects button.active:not([hidden])');
if(!selected){const b=document.querySelector('#subjects button:not([hidden])');if(b)b.click()}
refreshSubjectPanel()
};
const oldTopics=topics;
topics=function(){
if(['chess','cars'].includes(sub)){$x('topic').replaceChildren(new Option(sub==='chess'?'Πώς κινούνται τα κομμάτια':'Μάντεψε τη μάρκα','0'));refreshSubjectPanel();return}
oldTopics()
};
const oldStudy=$x('study').onclick,oldPractice=$x('practice').onclick;
$x('study').onclick=()=>{if(sub==='chess')openChess();else if(sub==='cars')openCars();else oldStudy()};
$x('practice').onclick=()=>{if(sub==='chess')openChess();else if(sub==='cars')openCars();else oldPractice()};
window.MathainoExtraLessons=Object.freeze({photoCount:photoBank.length,chessSteps:chessSteps.length,photoSourceLinks:photoBank.map(p=>commonsLink(p.file))});
})();
