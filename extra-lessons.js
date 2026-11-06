/* Μαθαίνω! v0.6.82 • beginner chess + licensed real-car brand recognition.
   Chess module teaches piece movement only; not a full game engine. */
(function(){
'use strict';
/* Verified Wikimedia Commons images with direct, deterministic thumbnail URLs.
   localName is reserved for future locally bundled copies, not deployed files. */
/* Curated 8-car exterior-photo set. Official press photos are not automatically reusable:
   these are photographer-licensed Wikimedia Commons images with source credits.
   Frame/scene consistency remains a visual review criterion, not a promise. */
/* Seven reviewed full-car external photographs, locally bundled for offline use. */
const photoBank=[{"brand":"Ferrari","model":"458 Italia","color":"red","view":"front-three-quarter","file":"2014 Ferrari 458 Italia Rosso Scuderia front three quarter.jpg","author":"Trans-nyan","license":"CC BY-SA 4.0","localName":"ferrari-458-red.jpg","url":"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2014_Ferrari_458_Italia_Rosso_Scuderia_front_three_quarter.jpg/960px-2014_Ferrari_458_Italia_Rosso_Scuderia_front_three_quarter.jpg","licenseUrl":"https://creativecommons.org/licenses/by-sa/4.0/"},{"brand":"Lamborghini","model":"Huracán","color":"green","view":"front-left","file":"Green 2018 Lamborghini Huracan.jpg","author":"Xboxrocker84","license":"CC BY-SA 4.0","localName":"lamborghini-huracan-green.jpg","url":"https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Green_2018_Lamborghini_Huracan.jpg/960px-Green_2018_Lamborghini_Huracan.jpg","licenseUrl":"https://creativecommons.org/licenses/by-sa/4.0/","cropped":true},{"brand":"Porsche","model":"911 GT3 RS","color":"orange","view":"front-left","file":"Porsche 911 GT3 RS front 20090521.jpg","author":"Rudolf Stricker","license":"Attribution only","localName":"porsche-911-orange.jpg","url":"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Porsche_911_GT3_RS_front_20090521.jpg/960px-Porsche_911_GT3_RS_front_20090521.jpg","licenseUrl":"https://commons.wikimedia.org/wiki/File:Porsche_911_GT3_RS_front_20090521.jpg"},{"brand":"Nissan","model":"Skyline GT-R R34","color":"blue","view":"front-left","file":"Nissan Skyline GT-R (R34) in Blue, front left 1.jpg","author":"Mr.choppers","license":"CC BY-SA 3.0","localName":"nissan-skyline-gtr-r34.jpg","url":"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Nissan_Skyline_GT-R_(R34)_in_Blue%2C_front_left_1.jpg/960px-Nissan_Skyline_GT-R_(R34)_in_Blue%2C_front_left_1.jpg","licenseUrl":"https://creativecommons.org/licenses/by-sa/3.0/"},{"brand":"Ford","model":"Mustang GT","color":"red","view":"front-right-three-quarter","file":"2024 Ford Mustang 5.0 GT in Race Red, front right.jpg","author":"Ethan Llamas","license":"CC BY-SA 4.0","localName":"ford-mustang-red.jpg","url":"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/2024_Ford_Mustang_5.0_GT_in_Race_Red%2C_front_right.jpg/960px-2024_Ford_Mustang_5.0_GT_in_Race_Red%2C_front_right.jpg","licenseUrl":"https://creativecommons.org/licenses/by-sa/4.0/"},{"brand":"Chevrolet","model":"Corvette C8 Stingray","color":"red","view":"front-left","file":"Chevrolet Corvette C8 Stingray 3LT Coupe Z51 Torch Red 01.jpg","author":"Ethan Llamas","license":"CC BY-SA 4.0","localName":"chevrolet-corvette-red.jpg","url":"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Chevrolet_Corvette_C8_Stingray_3LT_Coupe_Z51_Torch_Red_01.jpg/960px-Chevrolet_Corvette_C8_Stingray_3LT_Coupe_Z51_Torch_Red_01.jpg","licenseUrl":"https://creativecommons.org/licenses/by-sa/4.0/"},{"brand":"Tesla","model":"Model S 70D","color":"blue","view":"front-left","file":"20180630 Tesla Model S 70D 2015 midnight blue left front.jpg","author":"Granada","license":"CC BY-SA 4.0","localName":"tesla-model-s-blue.jpg","url":"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/20180630_Tesla_Model_S_70D_2015_midnight_blue_left_front.jpg/960px-20180630_Tesla_Model_S_70D_2015_midnight_blue_left_front.jpg","licenseUrl":"https://creativecommons.org/licenses/by-sa/4.0/"}];
/* Original, manufacturer-identifiable emblems. JPEGs and SVGs normalized to local PNG. */
const badgeBank=[{"brand":"Ferrari","file":"Ferrari-badge.jpg","localName":"ferrari-badge.png","author":"Ttzavaras","license":"CC BY-SA 4.0","licenseUrl":"https://creativecommons.org/licenses/by-sa/4.0/"},{"brand":"Lamborghini","file":"Stemma Lamborghini.jpg","localName":"lamborghini-badge.png","author":"Vllmtt","license":"CC BY-SA 4.0","licenseUrl":"https://creativecommons.org/licenses/by-sa/4.0/"},{"brand":"Porsche","file":"porsche-logo.svg","localName":"porsche-badge.png","author":"VehicleSpecs logo collection / Porsche","license":"Manufacturer emblem (trademark)","licenseUrl":"https://github.com/vehiclespecs/brand-logos/blob/main/porsche-logo.svg","sourceUrl":"https://github.com/vehiclespecs/brand-logos/blob/main/porsche-logo.svg"},{"brand":"Nissan","file":"Nissan 2020 logo.svg","localName":"nissan-badge.png","author":"Nissan Motor Corporation","license":"Public domain (simple logo)","licenseUrl":"https://commons.wikimedia.org/wiki/File:Nissan_2020_logo.svg"},{"brand":"Ford","file":"Ford Motor Company Logo.svg","localName":"ford-badge.png","author":"Ford Motor Company","license":"Public domain (simple logo)","licenseUrl":"https://commons.wikimedia.org/wiki/File:Ford_Motor_Company_Logo.svg"},{"brand":"Chevrolet","file":"chevrolet-logo.png","localName":"chevrolet-badge.png","author":"VehicleSpecs logo collection / Chevrolet","license":"Manufacturer emblem (trademark)","licenseUrl":"https://github.com/vehiclespecs/brand-logos/blob/main/chevrolet-logo.png","sourceUrl":"https://github.com/vehiclespecs/brand-logos/blob/main/chevrolet-logo.png"},{"brand":"Tesla","file":"Tesla T symbol.svg","localName":"tesla-badge.png","author":"Tesla, Inc.","license":"Public domain (simple logo)","licenseUrl":"https://commons.wikimedia.org/wiki/File:Tesla_T_symbol.svg"}];
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
let carMode='cars',carScore=0,carFirstTry=true,carCompleted=false;
function updateCarModeButtons(){
 const badge=carMode==='badges';
 $x('carModeCars').setAttribute('aria-pressed',String(!badge));
 $x('carModeBadges').setAttribute('aria-pressed',String(badge));
 $x('carQuizHeading').textContent=badge?'Μάντεψε το σήμα':'Γρήγορα αυτοκίνητα';
 $x('carQuizDescription').textContent=badge?'Κοίταξε μόνο το πραγματικό σήμα. Ποια μάρκα είναι;':'Κοίταξε τη φωτογραφία. Ποια είναι η μάρκα; Διάλεξε μία από τις τέσσερις απαντήσεις.';
 $x('carPhotoZoomGroup').hidden=badge;
 $x('carSourceNote').textContent=badge?'Αυθεντικά σήματα για εκπαιδευτική αναγνώριση · καμία συνεργασία με τους κατασκευαστές · χωρίς σύνδεση.':'Αληθινές φωτογραφίες με άδεια χρήσης · αποθηκεύονται για παιχνίδι και χωρίς σύνδεση.';
 $x('carPictureFrame').classList.toggle('badge-only',badge);
 $x('carNext').textContent='Επόμενο '+(badge?'σήμα':'αυτοκίνητο');
 $x('carSkip').classList.remove('hidden');
}

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
 // Local, offline-precached real-car JPEG first. Wikimedia fallback remains
 // only for a corrupt or absent installed asset.
 return ['./assets/cars/'+encodeURIComponent(photo.localName),photo.url,originalPhotoURL(photo),
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
    if(carMode==='badges'&&carFirstTry)carScore++;
    for(const other of $x('carAnswers').querySelectorAll('button'))other.disabled=true;
    $x('carFeedback').textContent=carMode==='badges'?'Σωστά! Το σήμα είναι της '+current.brand+'.'+(carFirstTry?'':' Πολύ καλά που το βρήκες!'):'Σωστά! Είναι '+current.brand+' '+current.model+'.';
    if(carMode==='badges')showBadgeCredit(current);
    $x('carNext').classList.remove('hidden');
   }else{
    carAttempted=true;carFirstTry=false;b.classList.add('bad');b.disabled=true;
    $x('carFeedback').textContent='Δοκίμασε άλλη μάρκα.'
   }
  };
  return b
 }))
}
function showBadgeCredit(current){
 const credits=$x('carPhotoCredit');
 credits.replaceChildren();
 credits.append(document.createTextNode('Σήμα: '+current.author+' · '));
 const source=document.createElement('a');
 source.textContent='Πηγή';source.href=current.sourceUrl||commonsLink(current.file);source.target='_blank';source.rel='noopener noreferrer';
 const license=document.createElement('a');
 license.textContent=current.license;license.href=current.licenseUrl;license.target='_blank';license.rel='noopener noreferrer';
 credits.append(source,document.createTextNode(' · '),license)
}
function finishBadgeTest(){
 carCompleted=true;
 const token=++carLoadToken;
 const score=carScore,total=carsRound.length;
 $x('carPicture').style.display='none';
 $x('carImageFallback').classList.remove('hidden');
 $x('carImageFallback').textContent='Ολοκλήρωσες! Αναγνώρισες '+score+' από τα '+total+' σήματα με την πρώτη προσπάθεια.';
 $x('carAnswers').replaceChildren();
 $x('carFeedback').textContent=score===total?'Εξαιρετικά! Ξέρεις όλα τα σήματα.':'Μπορείς να ξαναπαίξεις και να αναγνωρίσεις περισσότερα σήματα!';
 $x('carProgress').textContent='Τέλος δοκιμής';
 $x('carNext').classList.remove('hidden');
 $x('carNext').textContent='Παίξε ξανά';
 $x('carSkip').classList.add('hidden');
 $x('carPhotoCredit').replaceChildren();
}
function nextCar(){
 const current=carsRound[carIndex];carSolved=false;carAttempted=false;carFirstTry=true;carCompleted=false;
 const token=++carLoadToken,img=$x('carPicture'),fallback=$x('carImageFallback');
 carZoomed=false;updateCarZoom();$x('carZoom').disabled=true;
 img.style.display='block';fallback.classList.add('hidden');fallback.replaceChildren();
 img.alt=carMode==='badges'?'Σήμα κατασκευαστή. Αναγνώρισε τη μάρκα.':'Πραγματική φωτογραφία αυτοκινήτου. Μάντεψε τη μάρκα.';
 img.loading='eager';img.decoding='async';
 $x('carProgress').textContent=(carMode==='badges'?'Σήμα ':'Αυτοκίνητο ')+(carIndex+1)+' από '+carsRound.length;
 $x('carFeedback').textContent='Φόρτωση φωτογραφίας…';
 $x('carNext').classList.add('hidden');
 // Never ask a child to identify a car whose picture has failed to load.
 $x('carAnswers').replaceChildren();
 const credits=$x('carPhotoCredit');credits.replaceChildren();
 if(carMode==='cars')credits.append(document.createTextNode('Φωτογραφία: '+current.author+' · '));
 const source=document.createElement('a');source.textContent='Wikimedia Commons';source.href=commonsLink(current.file);source.target='_blank';source.rel='noopener noreferrer';
 const license=document.createElement('a');license.textContent=current.license;license.href=current.licenseUrl;license.target='_blank';license.rel='noopener noreferrer';
 if(carMode==='cars')credits.append(source,document.createTextNode(' · '),license);
 if(current.cropped)credits.append(document.createTextNode(' · Περικοπή φόντου για εκμάθηση σήματος'));
 const urls=carMode==='badges'?['./assets/badges/'+encodeURIComponent(current.localName)]:photoCandidates(current);let tryIndex=0;
 img.onload=()=>{
  if(token!==carLoadToken)return;
  fallback.classList.add('hidden');$x('carFeedback').textContent='';
  if(carMode==='cars')$x('carZoom').disabled=false;
  carAnswersFor(current)
 };
 img.onerror=()=>{
  if(token!==carLoadToken)return;
  tryIndex++;
  if(tryIndex<urls.length){img.src=urls[tryIndex];return}
  img.style.display='none';fallback.classList.remove('hidden');
  fallback.textContent='Η εικόνα δεν είναι διαθέσιμη. Δοκίμασε «Παράλειψη» για την επόμενη. ';
  const link=document.createElement('a');
  link.href=current.sourceUrl||commonsLink(current.file);link.target='_blank';link.rel='noopener noreferrer';
  link.textContent='Πηγή φωτογραφίας';
  fallback.append(link);
  $x('carFeedback').textContent='Δεν εμφανίστηκε εικόνα, οπότε δεν θα ζητήσουμε μαντεψιά.'
 };
 img.src=urls[0]
}
function openCars(mode='cars'){
carMode=mode==='badges'?'badges':'cars';
carsRound=shuffleArray(carMode==='badges'?badgeBank:photoBank);carIndex=0;carScore=0;carCompleted=false;
updateCarModeButtons();nextCar();viewAll('carLesson')
}
$x('carModeCars').onclick=()=>openCars('cars');
$x('carModeBadges').onclick=()=>openCars('badges');
$x('carBack').onclick=()=>{carLoadToken++;viewAll('home')};
$x('carNext').onclick=()=>{
 if(carCompleted){openCars('badges');return}
 if(carIndex===carsRound.length-1){if(carMode==='badges')finishBadgeTest();else openCars('cars');return}
 carIndex++;nextCar()
};
$x('carSkip').onclick=()=>{
 if(carIndex===carsRound.length-1){if(carMode==='badges')finishBadgeTest();else openCars('cars');return}
 carIndex++;nextCar()
};
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
window.MathainoExtraLessons=Object.freeze({photoCount:photoBank.length,badgeCount:badgeBank.length,chessSteps:chessSteps.length,photoSourceLinks:photoBank.map(p=>commonsLink(p.file))});
})();
