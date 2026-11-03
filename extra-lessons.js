/* Μαθαίνω! • Original beginner chess exercise + licensed car photo recognition.
   Chess module teaches piece movement only; not a full game engine. */
(function(){
'use strict';
const photoBank=[{"brand":"Ferrari","model":"458 Italia","file":"2012 Ferrari 458 Italia red.jpg","author":"Calreyn88","license":"CC BY 4.0","licenseUrl":"https://creativecommons.org/licenses/by/4.0/"},{"brand":"Lamborghini","model":"Huracán Performante","file":"Lamborghini Huracan Performante green.jpg","author":"Calreyn88","license":"CC BY-SA 4.0","licenseUrl":"https://creativecommons.org/licenses/by-sa/4.0/"},{"brand":"Porsche","model":"911 GT3 RS","file":"Porsche 911 GT3RS.jpg","author":"Calreyn88","license":"CC0 1.0","licenseUrl":"https://creativecommons.org/publicdomain/zero/1.0/"},{"brand":"McLaren","model":"720S","file":"McLaren 720s.jpg","author":"Iorisrandombses5001","license":"CC0 1.0","licenseUrl":"https://creativecommons.org/publicdomain/zero/1.0/"},{"brand":"Bugatti","model":"Chiron","file":"Bugatti Chiron (95375).jpg","author":"Calreyn88","license":"CC BY-SA 4.0","licenseUrl":"https://creativecommons.org/licenses/by-sa/4.0/"},{"brand":"Aston Martin","model":"DB11","file":"Aston Martin DB11.jpg","author":"Tokumeigakarinoaoshima","license":"CC BY-SA 4.0","licenseUrl":"https://creativecommons.org/licenses/by-sa/4.0/"},{"brand":"Koenigsegg","model":"Agera","file":"Koenigsegg Agera 1.jpg","author":"MrWalkr","license":"CC BY-SA 4.0","licenseUrl":"https://creativecommons.org/licenses/by-sa/4.0/"},{"brand":"BMW","model":"M4","file":"BMW M4.jpg","author":"Calreyn88","license":"CC BY-SA 4.0","licenseUrl":"https://creativecommons.org/licenses/by-sa/4.0/"}];
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
let carsRound=[],carIndex=0,carSolved=false,carAttempted=false;
function commonsLink(file){return 'https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(file).replace(/%20/g,'_')}
function photoURL(file){return 'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(file)+'?width=800'}
function nextCar(){
const current=carsRound[carIndex];carSolved=false;carAttempted=false;
const img=$x('carPicture'),fallback=$x('carImageFallback');
img.style.display='block';fallback.classList.add('hidden');fallback.replaceChildren();
img.alt='Φωτογραφία σπορ αυτοκινήτου. Αναγνώρισε τη μάρκα.';
img.onload=()=>{fallback.classList.add('hidden')};
img.onerror=()=>{img.style.display='none';fallback.classList.remove('hidden');fallback.textContent='Η φωτογραφία δεν φορτώθηκε. ';const link=document.createElement('a');link.href=commonsLink(current.file);link.target='_blank';link.rel='noopener noreferrer';link.textContent='Άνοιξε τη φωτογραφία στο Wikimedia Commons';fallback.append(link)};
img.src=photoURL(current.file);
$x('carProgress').textContent='Αυτοκίνητο '+(carIndex+1)+' από '+carsRound.length;
$x('carFeedback').textContent='';
$x('carNext').classList.add('hidden');
const credits=$x('carPhotoCredit');
credits.replaceChildren();
credits.append(document.createTextNode('Φωτογραφία: '+current.author+' · '));
const source=document.createElement('a');source.textContent='Wikimedia Commons';source.href=commonsLink(current.file);source.target='_blank';source.rel='noopener noreferrer';
const license=document.createElement('a');license.textContent=current.license;license.href=current.licenseUrl;license.target='_blank';license.rel='noopener noreferrer';
credits.append(source,document.createTextNode(' · '),license);
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
}else{carAttempted=true;b.classList.add('bad');b.disabled=true;$x('carFeedback').textContent='Δοκίμασε άλλη μάρκα.'}
};return b
}));
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
