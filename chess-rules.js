/* Μαθαίνω! • Original illustrated chess rules in Greek.
   Read-only example diagrams and recall checks; not a complete chess engine. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const initial={a8:'r',b8:'n',c8:'b',d8:'q',e8:'k',f8:'b',g8:'n',h8:'r',a7:'p',b7:'p',c7:'p',d7:'p',e7:'p',f7:'p',g7:'p',h7:'p',a2:'P',b2:'P',c2:'P',d2:'P',e2:'P',f2:'P',g2:'P',h2:'P',a1:'R',b1:'N',c1:'B',d1:'Q',e1:'K',f1:'B',g1:'N',h1:'R'};
const pieces={K:'♔',Q:'♕',R:'♖',B:'♗',N:'♘',P:'♙',k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'\u265F\uFE0E'};
const rules=[
{id:'start',title:'Πώς αρχίζει η παρτίδα;',body:'Η σκακιέρα έχει 64 τετράγωνα. Παίζουν δύο παιδιά, με λευκά και μαύρα κομμάτια. Τα λευκά κάνουν πάντα την πρώτη κίνηση και μετά παίζουμε εναλλάξ.',tip:'Από την πλευρά σου το κάτω δεξί τετράγωνο είναι άσπρο. Η λευκή βασίλισσα ξεκινά στο δ1.',boards:[{label:'Αρχική θέση',pieces:initial,highlight:['e1','e8']}]},
{id:'capture',title:'Πώς πιάνουμε ένα κομμάτι;',body:'Όταν ένα δικό σου κομμάτι μετακινηθεί νόμιμα σε τετράγωνο με αντίπαλο κομμάτι, το αντίπαλο βγαίνει από τη σκακιέρα. Δεν μπορείς να πιάσεις δικό σου κομμάτι.',tip:'Το άσπρο πιόνι στο ε4 μπορεί να πιάσει το μαύρο στο δ5. Δεν πηγαίνει εκεί με τον συνηθισμένο ίσιο βηματισμό του.',boards:[{label:'Παράδειγμα: άσπρο πιόνι στο ε4, αντίπαλο στο δ5',pieces:{a1:'K',h8:'k',e4:'P',d5:'p'},highlight:['e4','d5']}]},
{id:'pawn',title:'Το πιόνι κινείται και πιάνει διαφορετικά',body:'Το πιόνι προχωρά μόνο μπροστά, ένα τετράγωνο κάθε φορά. Στην πρώτη του κίνηση μπορεί να πάει και δύο, αν τα τετράγωνα είναι άδεια. Αντίπαλο κομμάτι το πιάνει ένα τετράγωνο διαγώνια προς τα εμπρός.',tip:'Αν ένα κομμάτι βρίσκεται ακριβώς μπροστά του, το πιόνι δεν μπορεί να προχωρήσει σε εκείνο το τετράγωνο.',boards:[{label:'Το άσπρο πιόνι στο ε2 μπορεί να προχωρήσει στο ε3 ή ε4 και να πιάσει το μαύρο στο δ3',pieces:{a1:'K',h8:'k',e2:'P',d3:'p'},highlight:['e2','e3','e4','d3']}]},
{id:'check',title:'Σαχ! Προστατεύουμε τον βασιλιά',body:'Σαχ σημαίνει ότι ο αντίπαλος απειλεί τον βασιλιά. Πρέπει αμέσως να αντιμετωπίσεις την απειλή: να μετακινήσεις τον βασιλιά, να πιάσεις το επιτιθέμενο κομμάτι ή να εμποδίσεις την επίθεση, αν είναι δυνατόν.',tip:'Δεν επιτρέπεται ποτέ να αφήσεις τον βασιλιά σου σε σαχ, ούτε να τον μετακινήσεις σε τετράγωνο που απειλείται.',boards:[{label:'Ο λευκός πύργος στο ε2 δίνει σαχ στον μαύρο βασιλιά στο ε8',pieces:{a1:'K',e2:'R',e8:'k'},highlight:['e2','e8'],danger:['e8']}]},
{id:'mate',title:'Ματ! Η παρτίδα τελειώνει',body:'Ματ είναι όταν ο βασιλιάς είναι σε σαχ και δεν υπάρχει καμία νόμιμη κίνηση που να τον σώζει. Τότε κερδίζει όποιος έκανε το ματ. Δεν παίρνουμε ποτέ τον βασιλιά από τη σκακιέρα.',tip:'Η λευκή βασίλισσα στο ζ7 απειλεί τον μαύρο βασιλιά στο η8. Ο λευκός βασιλιάς βοηθά να μην υπάρχει ασφαλής έξοδος.',boards:[{label:'Παράδειγμα ματ: λευκός βασιλιάς στ6, λευκή βασίλισσα ζ7, μαύρος βασιλιάς η8',pieces:{f6:'K',g7:'Q',h8:'k'},highlight:['g7','h8'],danger:['h8']}]},
{id:'stalemate',title:'Πατ σημαίνει ισοπαλία',body:'Αν ένας παίκτης δεν έχει καμία νόμιμη κίνηση, αλλά ο βασιλιάς του ΔΕΝ είναι σε σαχ, έχουμε πατ. Η παρτίδα τελειώνει ισόπαλη, όχι με νίκη.',tip:'Στο παράδειγμα παίζουν τα μαύρα. Ο μαύρος βασιλιάς δεν είναι σε σαχ, αλλά δεν έχει ασφαλές τετράγωνο.',boards:[{label:'Παράδειγμα πατ: λευκός βασιλιάς γ6, βασίλισσα β6, μαύρος βασιλιάς α8',pieces:{c6:'K',b6:'Q',a8:'k'},highlight:['a8']}]},
{id:'castle',title:'Ροκέ: βασιλιάς και πύργος μαζί',body:'Μία φορά στην παρτίδα μπορείς να κάνεις ροκέ από κάθε πλευρά μόνο εφόσον δεν έχουν κινηθεί ο συγκεκριμένος βασιλιάς και πύργος. Ο βασιλιάς μετακινείται δύο τετράγωνα προς τον πύργο και ο πύργος πηγαίνει δίπλα του.',tip:'Για να είναι νόμιμο, τα ενδιάμεσα τετράγωνα πρέπει να είναι ελεύθερα και ο βασιλιάς δεν πρέπει να βρίσκεται σε σαχ, να περνά από σαχ ή να καταλήγει σε σαχ.',boards:[{label:'Πριν: βασιλιάς ε1 και πύργος η1',pieces:{e1:'K',h1:'R',e8:'k'},highlight:['e1','h1']},{label:'Μετά: βασιλιάς ζ1 και πύργος στ1',pieces:{g1:'K',f1:'R',e8:'k'},highlight:['g1','f1']}]},
{id:'promotion',title:'Προαγωγή: το πιόνι γίνεται δυνατότερο',body:'Όταν ένα πιόνι φτάσει στην τελευταία γραμμή απέναντι, μετατρέπεται αμέσως σε βασίλισσα, πύργο, αξιωματικό ή άλογο του ίδιου χρώματος. Συνήθως επιλέγουμε βασίλισσα, αλλά δεν είναι υποχρεωτικό.',tip:'Μπορείς να αποκτήσεις και δεύτερη βασίλισσα. Δεν περιμένεις να χαθεί κάποια άλλη από τη σκακιέρα.',boards:[{label:'Πριν: λευκό πιόνι στο ε7',pieces:{a1:'K',h8:'k',e7:'P'},highlight:['e7','e8']},{label:'Μετά: λευκή βασίλισσα στο ε8',pieces:{a1:'K',h8:'k',e8:'Q'},highlight:['e8']}]}
];
const checks=[
{q:'Ποιος παίζει πρώτος σε μια κανονική παρτίδα;',opts:['Τα λευκά','Τα μαύρα','Όποιος έχει βασίλισσα'],a:0,why:'Τα λευκά κάνουν πάντοτε την πρώτη κίνηση.'},
{q:'Πώς πιάνει συνήθως ένα πιόνι ένα αντίπαλο κομμάτι;',opts:['Ένα βήμα ίσια μπροστά','Ένα βήμα διαγώνια μπροστά','Δύο βήματα προς τα πίσω'],a:1,why:'Τα πιόνια προχωρούν ίσια, αλλά πιάνουν διαγώνια προς τα εμπρός.'},
{q:'Ο βασιλιάς σου βρίσκεται σε σαχ. Τι κάνεις;',opts:['Αγνοώ την απειλή','Προστατεύω τον βασιλιά με νόμιμη κίνηση','Προσπαθώ να πιάσω τον αντίπαλο βασιλιά'],a:1,why:'Κάθε κίνηση πρέπει να αφήνει τον δικό σου βασιλιά ασφαλή.'},
{q:'Πότε έχουμε ματ;',opts:['Όταν πιάσουμε τη βασίλισσα','Όταν δεν υπάρχουν κινήσεις αλλά ο βασιλιάς είναι ασφαλής','Όταν ο βασιλιάς απειλείται και δεν μπορεί να σωθεί'],a:2,why:'Στο ματ ο βασιλιάς είναι σε σαχ, χωρίς καμία νόμιμη άμυνα.'},
{q:'Τι είναι το πατ;',opts:['Ισοπαλία χωρίς νόμιμη κίνηση και χωρίς σαχ','Νίκη με δύο πύργους','Επίθεση στον βασιλιά'],a:0,why:'Στο πατ δεν υπάρχουν νόμιμες κινήσεις, αλλά ο βασιλιάς δεν απειλείται.'},
{q:'Στο ροκέ ποια δύο κομμάτια κινούνται;',opts:['Η βασίλισσα και το άλογο','Ο βασιλιάς και ο πύργος','Δύο πιόνια'],a:1,why:'Το ροκέ συνδυάζει βασιλιά και πύργο, με συγκεκριμένες προϋποθέσεις.'},
{q:'Το λευκό πιόνι φτάνει στην τελευταία γραμμή. Τι μπορεί να γίνει;',opts:['Να γίνει βασίλισσα, πύργος, αξιωματικός ή άλογο','Να μετατραπεί σε βασιλιά','Να μείνει υποχρεωτικά πιόνι'],a:0,why:'Η προαγωγή αντικαθιστά το πιόνι με ένα από τέσσερα επιτρεπόμενα κομμάτια.'}
];
let ruleIndex=0,quizIndex=-1,quizCorrect=false;
function el(tag,className,content){
const out=document.createElement(tag);
if(className)out.className=className;
if(content!==undefined)out.textContent=content;
return out
}
function board(boardInfo){
const wrap=el('div','chess-rule-diagram');
wrap.setAttribute('role','img');wrap.setAttribute('aria-label',boardInfo.label);
const label=el('p','chess-rule-board-label',boardInfo.label);
const grid=el('div','chess-rule-mini-board');grid.setAttribute('aria-hidden','true');
for(let rank=7;rank>=0;rank--)for(let file=0;file<8;file++){
const sq='abcdefgh'[file]+(rank+1);
const box=el('div','chess-rule-square '+((file+rank)%2===0?'dark':'light'));
if(boardInfo.highlight?.includes(sq))box.classList.add('highlight');
if(boardInfo.danger?.includes(sq))box.classList.add('danger');
if(boardInfo.pieces[sq]){
const piece=el('span','chess-rule-mini-piece '+(boardInfo.pieces[sq]===boardInfo.pieces[sq].toUpperCase()?'white':'black'),pieces[boardInfo.pieces[sq]]);
box.append(piece)
}
grid.append(box)
}
wrap.append(grid,label);
return wrap
}
function switchLessonTab(value){
const rulesMode=value==='rules';
$('chessRulesPanel').classList.toggle('hidden',!rulesMode);
$('chessMovementPanel').classList.toggle('hidden',rulesMode);
for(const [id,active] of [['chessRulesTab',rulesMode],['chessMovesTab',!rulesMode]]){
const button=$(id);button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;button.classList.toggle('active',active)
}
$('chessModeIntro').textContent=rulesMode?'Διάβασε τους βασικούς κανόνες και δες μικρά παραδείγματα στη σκακιέρα.':'Πάτησε πρώτα το κομμάτι και μετά το τετράγωνο με τον κύκλο.';
$('chessStep').classList.toggle('hidden',rulesMode);
if(rulesMode)renderRules()
}
function renderRules(){
if(quizIndex>=0){renderCheck();return}
const item=rules[ruleIndex];
$('chessRuleCount').textContent='Κανόνας '+(ruleIndex+1)+' από '+rules.length;
$('chessRuleTitle').textContent=item.title;
$('chessRuleText').textContent=item.body;
$('chessRuleTip').textContent=item.tip;
$('chessRuleDiagrams').replaceChildren(...item.boards.map(board));
$('chessRuleCard').classList.remove('hidden');$('chessRuleCheck').classList.add('hidden');
$('chessRulePrev').disabled=ruleIndex===0;
$('chessRuleNext').textContent=ruleIndex===rules.length-1?'Δοκίμασε όσα έμαθες':'Επόμενος κανόνας';
}
function renderCheck(){
const item=checks[quizIndex];
if(!item){ruleIndex=0;quizIndex=-1;renderRules();return}
$('chessRuleCard').classList.add('hidden');$('chessRuleCheck').classList.remove('hidden');
$('chessCheckCount').textContent='Ερώτηση '+(quizIndex+1)+' από '+checks.length;
$('chessCheckQuestion').textContent=item.q;
$('chessCheckFeedback').textContent='';
$('chessCheckContinue').classList.add('hidden');
quizCorrect=false;
$('chessCheckAnswers').replaceChildren(...item.opts.map((answer,i)=>{
const b=el('button','chess-check-answer',answer);b.type='button';
b.onclick=()=>{
if(quizCorrect)return;
if(i!==item.a){b.disabled=true;b.classList.add('bad');$('chessCheckFeedback').textContent='Δοκίμασε ξανά. Μπορείς να ξαναδιαβάσεις τον κανόνα.';return}
quizCorrect=true;
b.classList.add('good');
for(const other of $('chessCheckAnswers').querySelectorAll('button'))other.disabled=true;
$('chessCheckFeedback').textContent=item.why;
$('chessCheckContinue').classList.remove('hidden');
$('chessCheckContinue').textContent=quizIndex===checks.length-1?'Ξανά από την αρχή':'Επόμενη ερώτηση'
};
return b
}))
}
$('chessRulesTab').onclick=()=>switchLessonTab('rules');
$('chessMovesTab').onclick=()=>switchLessonTab('moves');
$('chessRulePrev').onclick=()=>{if(ruleIndex>0)ruleIndex--;renderRules()};
$('chessRuleNext').onclick=()=>{if(ruleIndex===rules.length-1){quizIndex=0;renderCheck()}else{ruleIndex++;renderRules()}};
$('chessCheckContinue').onclick=()=>{quizIndex++;if(quizIndex>=checks.length){quizIndex=-1;ruleIndex=0}renderRules()};
$('chessCheckBack').onclick=()=>{quizIndex=-1;ruleIndex=rules.length-1;renderRules()};
$('chessRulesTab').addEventListener('keydown',tabKeys);
$('chessMovesTab').addEventListener('keydown',tabKeys);
function tabKeys(e){
if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const next=this.id==='chessRulesTab'?'chessMovesTab':'chessRulesTab';$(next).click();$(next).focus()}
}
const originalStudy=$('study').onclick;
const originalPractice=$('practice').onclick;
$('study').onclick=function(){originalStudy.call(this);if(!$('chessLesson').classList.contains('hidden')){quizIndex=-1;ruleIndex=0;switchLessonTab('rules')}};
$('practice').onclick=function(){originalPractice.call(this);if(!$('chessLesson').classList.contains('hidden'))switchLessonTab('moves')};
switchLessonTab('rules');
window.MathainoChessRules=Object.freeze({ruleCount:rules.length,checkCount:checks.length});
})();