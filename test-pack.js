/* Μαθαίνω! v0.6.56 • Seven-lesson testing pack. Self-contained offline lessons. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const lessons=[
 {id:'spell-school',title:'Στο σχολείο',grade:'Α΄–Β΄',subject:'spelling',kind:'spelling',subtitle:'8 νέες λέξεις · μικτή ορθογραφία',art:'pencil',group:'3'},
 {id:'reading-cat',title:'Η Μαρία και η γάτα',grade:'Β΄',subject:'reading',art:'cat',
 subtitle:'Μικρή ιστορία · 8 ερωτήσεις',
 pages:[
 {title:'Μια επίσκεψη στην αυλή',art:'cat',text:'Η Μαρία βγήκε στην αυλή. Κάτω από ένα δέντρο είδε μια μικρή άσπρη γάτα. Η γάτα νιαούριζε γιατί πεινούσε.'},
 {title:'Λίγη φροντίδα',art:'milk',text:'Η Μαρία γέμισε ένα μπολ με νερό. Έπειτα έφερε λίγη τροφή για γάτες. Η γάτα έφαγε και κάθισε κοντά της.'},
 {title:'Ένας νέος φίλος',art:'house',text:'Το βράδυ η Μαρία ρώτησε τους γονείς της αν μπορούσαν να φροντίζουν τη γάτα. Πρώτα προσπάθησαν να βρουν αν είχε ήδη οικογένεια.'}],
 questions:[
 ['Πού είδε η Μαρία τη γάτα;',['Στην αυλή','Στην τάξη','Στο λεωφορείο'],0,'Η Μαρία την είδε κάτω από ένα δέντρο, στην αυλή.'],
 ['Τι χρώμα ήταν η γάτα;',['Μαύρη','Άσπρη','Πράσινη'],1,'Στην ιστορία λέει «μια μικρή άσπρη γάτα».'],
 ['Γιατί νιαούριζε η γάτα;',['Γιατί πεινούσε','Γιατί τραγουδούσε','Γιατί κοιμόταν'],0,'Η γάτα νιαούριζε γιατί πεινούσε.'],
 ['Τι έβαλε πρώτα η Μαρία στο μπολ;',['Γάλα','Χυμό','Νερό'],2,'Η Μαρία γέμισε ένα μπολ με νερό.'],
 ['Τι έκανε η γάτα αφού έφαγε;',['Έτρεξε στο σχολείο','Κάθισε κοντά στη Μαρία','Σκαρφάλωσε στο σπίτι'],1,'Μετά το φαγητό κάθισε κοντά στη Μαρία.'],
 ['Ποιον ρώτησε το βράδυ η Μαρία;',['Τη δασκάλα της','Τους γονείς της','Τον οδηγό'],1,'Ρώτησε τους γονείς της.'],
 ['Τι προσπάθησαν να μάθουν πρώτα;',['Αν η γάτα είχε οικογένεια','Πόσο ψηλό ήταν το δέντρο','Αν θα βρέξει'],0,'Έψαξαν πρώτα μήπως η γάτα ανήκει ήδη σε κάποιον.'],
 ['Ποια λέξη ταιριάζει καλύτερα στη Μαρία;',['Αδιάφορη','Φροντιστική','Θυμωμένη'],1,'Η Μαρία έδωσε νερό και τροφή και ενδιαφέρθηκε για τη γάτα.']
 ]},
 {id:'reading-market',title:'Μια βόλτα στην αγορά',grade:'Β΄',subject:'reading',art:'apple',
 subtitle:'Διαβάζω και καταλαβαίνω · 8 ερωτήσεις',
 pages:[
 {title:'Η λίστα',art:'book',text:'Το Σάββατο ο Νίκος πήγε με τον παππού του στη λαϊκή αγορά. Είχαν μια μικρή λίστα: μήλα, ντομάτες και ψωμί.'},
 {title:'Οι αγορές',art:'apple',text:'Αγόρασαν τέσσερα κόκκινα μήλα και έξι ντομάτες. Το ψωμί το πήραν από τον φούρνο, στον δρόμο της επιστροφής.'},
 {title:'Μια μικρή έκπληξη',art:'bread',text:'Όταν γύρισαν σπίτι, ο Νίκος έβαλε τα μήλα στο τραπέζι. Ο παππούς τον ευχαρίστησε που θυμήθηκε τη λίστα. Έφαγαν μαζί ένα μήλο.'}],
 questions:[
 ['Ποια μέρα πήγαν στην αγορά;',['Κυριακή','Σάββατο','Δευτέρα'],1,'Πήγαν το Σάββατο.'],
 ['Με ποιον πήγε ο Νίκος;',['Με τον παππού του','Με τη δασκάλα','Με τον φίλο του'],0,'Πήγε με τον παππού του.'],
 ['Τι είχαν μαζί τους;',['Χάρτη','Λίστα','Ομπρέλα'],1,'Είχαν μια μικρή λίστα με ψώνια.'],
 ['Πόσα μήλα αγόρασαν;',['Έξι','Τρία','Τέσσερα'],2,'Αγόρασαν τέσσερα κόκκινα μήλα.'],
 ['Τι χρώμα είχαν τα μήλα;',['Κόκκινο','Μπλε','Κίτρινο'],0,'Τα μήλα ήταν κόκκινα.'],
 ['Από πού πήραν το ψωμί;',['Από τον φούρνο','Από το πάρκο','Από το σχολείο'],0,'Το πήραν από τον φούρνο.'],
 ['Ποιος θυμήθηκε τη λίστα;',['Ο Νίκος','Ο φούρναρης','Ο οδηγός'],0,'Ο παππούς ευχαρίστησε τον Νίκο για τη λίστα.'],
 ['Τι έφαγαν μαζί στο τέλος;',['Μια ντομάτα','Ένα μήλο','Ένα γλυκό'],1,'Έφαγαν μαζί ένα μήλο.']
 ]},
 {id:'math20',title:'Παίζω με το 20',grade:'Β΄',subject:'addition',art:'apple',
 subtitle:'Προσθέσεις, αφαιρέσεις και κενά · 9 ερωτήσεις',
 pages:[
 {title:'Προσθέτω',art:'apple',text:'Για να υπολογίσω 8 + 5, μπορώ να κάνω πρώτα 8 + 2 = 10 και μετά να προσθέσω 3. Άρα 8 + 5 = 13.'},
 {title:'Αφαιρώ',art:'pencil',text:'Στην αφαίρεση 14 − 6 μπορώ να κάνω 14 − 4 = 10 και μετά 10 − 2 = 8.'},
 {title:'Βρίσκω τον κρυμμένο αριθμό',art:'book',text:'Στο 7 + □ = 12 σκέφτομαι: πόσο χρειάζεται το 7 για να γίνει 12; Χρειάζονται 5.'}],
 questions:[
 ['8 + 5 = ;',['12','13','14'],1,'8 + 2 = 10 και απομένουν 3, άρα 13.'],
 ['14 − 6 = ;',['8','9','7'],0,'14 − 4 = 10 και 10 − 2 = 8.'],
 ['7 + □ = 12. Ποιος αριθμός λείπει;',['4','5','6'],1,'7 + 5 = 12.'],
 ['16 − 9 = ;',['6','8','7'],2,'16 − 9 = 7.'],
 ['9 + 9 = ;',['18','17','19'],0,'Δύο φορές το 9 κάνουν 18.'],
 ['□ − 5 = 8. Ποιος αριθμός λείπει;',['12','13','14'],1,'13 − 5 = 8.'],
 ['6 + 7 = ;',['14','13','12'],1,'6 + 4 = 10 και 3 ακόμη κάνουν 13.'],
 ['Έχουμε 12 μήλα και τρώμε 4. Πόσα μένουν;',['8','9','7'],0,'12 − 4 = 8.'],
 ['Η Ελένη έχει 9 μολύβια και παίρνει άλλα 6. Πόσα έχει;',['14','16','15'],2,'9 + 6 = 15.']
 ]},
 {id:'math-multiply',title:'Προπαίδεια στην πράξη',grade:'Δ΄',subject:'math',art:'pencil',
 subtitle:'Πίνακες και μικρά προβλήματα · 9 ερωτήσεις',
 pages:[
 {title:'Ομαδοποιώ',art:'apple',text:'Το 4 × 6 σημαίνει τέσσερις ομάδες από έξι. Υπολογίζω 6 + 6 + 6 + 6 = 24.'},
 {title:'Αντιστρέφω χωρίς να αλλάζει το αποτέλεσμα',art:'book',text:'Το 3 × 7 και το 7 × 3 δίνουν και τα δύο 21. Μπορώ να επιλέξω τη σειρά που με βοηθά.'},
 {title:'Διαβάζω το πρόβλημα',art:'backpack',text:'Πρώτα βρίσκω πόσες ίσες ομάδες έχω και πόσα αντικείμενα έχει κάθε ομάδα. Μετά υπολογίζω τον πολλαπλασιασμό.'}],
 questions:[
 ['4 × 6 = ;',['20','24','26'],1,'4 ομάδες από 6 κάνουν 24.'],
 ['7 × 8 = ;',['54','56','64'],1,'7 × 8 = 56.'],
 ['3 κουτιά έχουν 4 μολύβια το καθένα. Πόσα μολύβια είναι;',['7','12','14'],1,'3 × 4 = 12.'],
 ['6 × 9 = ;',['48','56','54'],2,'6 × 9 = 54.'],
 ['5 σειρές με 7 καρέκλες. Πόσες καρέκλες;',['35','30','42'],0,'5 × 7 = 35.'],
 ['9 × □ = 36. Ποιος αριθμός λείπει;',['3','4','5'],1,'9 × 4 = 36.'],
 ['8 × 4 = ;',['28','32','36'],1,'8 × 4 = 32.'],
 ['4 παιδιά μοιράζονται από 6 αυτοκόλλητα. Πόσα αυτοκόλλητα συνολικά;',['24','20','18'],0,'4 × 6 = 24.'],
 ['Ποιο γινόμενο ισούται με 42;',['6 × 7','5 × 8','8 × 8'],0,'6 × 7 = 42.']
 ]},
 {id:'history-governments',title:'Τα πολιτεύματα στην αρχαϊκή Ελλάδα',grade:'Δ΄',subject:'history',art:'city',
 subtitle:'Ιστορία Δ΄ · Κεφάλαιο 6 · 8 ερωτήσεις',
 source:'https://ebooks.edu.gr/ebooks/v/html/8547/2174/Istoria_D-Dimotikou_html-empl/',
 pages:[
 {title:'Από τον βασιλιά στους ισχυρούς',art:'palace',text:'Στις πρώτες πόλεις-κράτη υπήρχαν βασιλιάδες. Αργότερα σε πολλές πόλεις την εξουσία πήραν αριστοκράτες, δηλαδή οικογένειες με δύναμη και μεγάλη περιουσία.'},
 {title:'Ποιος αποφασίζει;',art:'city',text:'Στην ολιγαρχία κυβερνούσαν λίγοι. Τυραννίδα ονομαζόταν το πολίτευμα όταν ένας άνθρωπος αποκτούσε την εξουσία χωρίς τους παραδοσιακούς κανόνες διαδοχής. Δεν σήμαινε πάντοτε ότι ήταν σκληρός κυβερνήτης.'},
 {title:'Η πορεία προς τη συμμετοχή',art:'book',text:'Οι πόλεις-κράτη δεν είχαν όλες το ίδιο πολίτευμα. Στην Αθήνα έγιναν αλλαγές που αργότερα οδήγησαν στη δημοκρατία, όπου οι πολίτες συμμετείχαν στις αποφάσεις. Στην αρχαιότητα όμως δεν είχαν όλοι οι κάτοικοι πολιτικά δικαιώματα.'}],
 questions:[
 ['Τι ήταν η μοναρχία;',['Κυβέρνηση ενός βασιλιά','Κυβέρνηση όλων των κατοίκων','Κυβέρνηση εμπόρων από άλλες χώρες'],0,'Στη μοναρχία κυβερνούσε ένας βασιλιάς.'],
 ['Ποιοι ήταν οι αριστοκράτες;',['Ισχυρές οικογένειες','Όλα τα παιδιά','Μόνο οι ναυτικοί'],0,'Η αριστοκρατία συνδεόταν με οικογένειες που κατείχαν εξουσία και πλούτο.'],
 ['Πόσοι κυβερνούσαν στην ολιγαρχία;',['Πολλοί περισσότεροι από όλους','Λίγοι','Κανείς'],1,'Ολιγαρχία σημαίνει εξουσία λίγων.'],
 ['Πώς λεγόταν το πολίτευμα όταν ένα άτομο έπαιρνε την εξουσία έξω από τους καθιερωμένους κανόνες;',['Τυραννίδα','Δημοκρατία','Ομοσπονδία'],0,'Η τυραννίδα αναφερόταν στον τρόπο που συγκεντρωνόταν η εξουσία.'],
 ['Είχαν όλες οι πόλεις-κράτη το ίδιο πολίτευμα;',['Ναι, πάντα','Όχι','Δεν υπήρχαν πόλεις-κράτη'],1,'Διαφορετικές πόλεις είχαν διαφορετικούς τρόπους διακυβέρνησης.'],
 ['Ποιο πολίτευμα συνδέεται με συμμετοχή πολιτών στις αποφάσεις;',['Μοναρχία','Αριστοκρατία','Δημοκρατία'],2,'Στη δημοκρατία συμμετείχαν οι πολίτες.'],
 ['Στην αρχαία Αθήνα είχαν όλοι οι κάτοικοι τα ίδια πολιτικά δικαιώματα;',['Ναι, όλοι ανεξαιρέτως','Όχι','Μόνο τα παιδιά'],1,'Οι γυναίκες, οι δούλοι και οι μέτοικοι δεν είχαν τα ίδια πολιτικά δικαιώματα με τους άνδρες πολίτες.'],
 ['Τι μας δείχνει η αλλαγή πολιτευμάτων;',['Πως οι κοινωνίες αλλάζουν','Πως όλα τα πολιτεύματα ήταν ίδια','Πως δεν υπήρχαν νόμοι'],0,'Ο τρόπος που κυβερνάται μια κοινωνία μπορεί να μεταβληθεί.']
 ]},
 {id:'physics-storage',title:'ΦΕ2 — Η ενέργεια αποθηκεύεται',grade:'Ε΄',subject:'science5',art:'battery',
 subtitle:'Φυσικά Ε΄ · Τετράδιο Εργασιών · 8 ερωτήσεις',
 source:'https://www.ebooks.edu.gr/ebooks/d/8547/1498/19-0108_Fysika-E-Dimotikou_Tetradio-Ergasion_18pt_Tomos-1_p1-92.pdf',
 pages:[
 {title:'Ενέργεια που περιμένει',art:'battery',text:'Μια μπαταρία αποθηκεύει χημική ενέργεια. Όταν τη βάλουμε σε μια κατάλληλη συσκευή, μπορεί να δώσει ενέργεια για να λειτουργήσει. Δεν αποθηκεύει «φως» απλώς επειδή ανάβει ένας φακός.'},
 {title:'Η ενέργεια στην τροφή',art:'apple',text:'Οι τροφές περιέχουν χημική ενέργεια. Ο οργανισμός μας αξιοποιεί μέρος της για να κινηθούμε, να διατηρούμε τη θερμοκρασία μας και για άλλες λειτουργίες.'},
 {title:'Το τεντωμένο λάστιχο',art:'pencil',text:'Ένα τεντωμένο λαστιχάκι έχει αποθηκευμένη ελαστική δυναμική ενέργεια. Όταν το αφήσουμε ελεύθερο, αυτή μπορεί να μετατραπεί σε κίνηση. Κάνουμε τέτοια πειράματα μόνο με ασφαλή υλικά, μακριά από πρόσωπα.'}],
 questions:[
 ['Ποια μορφή ενέργειας είναι αποθηκευμένη σε μια μπαταρία;',['Χημική','Φωτεινή','Ηχητική'],0,'Η μπαταρία αποθηκεύει χημική ενέργεια.'],
 ['Η μπαταρία ενός φακού αποθηκεύει απευθείας φως;',['Ναι','Όχι','Μόνο όταν βρέχει'],1,'Η χημική ενέργεια της μπαταρίας αξιοποιείται ώστε η λάμπα να δώσει φως.'],
 ['Τι ενέργεια αποθηκεύουν οι τροφές;',['Μαγνητική','Χημική','Μόνο κινητική'],1,'Η τροφή περιέχει χημική ενέργεια.'],
 ['Πού υπάρχει ελαστική δυναμική ενέργεια;',['Σε ένα τεντωμένο λαστιχάκι','Σε μια άδεια σακούλα χωρίς τάση','Σε ένα σβηστό ζωγραφισμένο ήλιο'],0,'Το τεντωμένο λάστιχο έχει αποθηκευμένη ελαστική δυναμική ενέργεια.'],
 ['Τι μπορεί να συμβεί όταν αφήσουμε ένα τεντωμένο λαστιχάκι;',['Μπορεί να κινηθεί','Γίνεται μπαταρία','Παύει να υπάρχει'],0,'Η αποθηκευμένη ενέργεια μπορεί να μετατραπεί σε κίνηση.'],
 ['Ποιο από τα παρακάτω αποθηκεύει χημική ενέργεια;',['Το ψωμί','Το φως που βλέπουμε','Ένας ήχος'],0,'Στο ψωμί υπάρχει αποθηκευμένη χημική ενέργεια.'],
 ['Γιατί χρειάζεται ενέργεια το σώμα μας;',['Για τις λειτουργίες και την κίνησή του','Μόνο για να ακούει μουσική','Δεν χρειάζεται ενέργεια'],0,'Το σώμα χρησιμοποιεί ενέργεια για πολλές λειτουργίες.'],
 ['Ποια πρόταση είναι σωστή;',['Η ενέργεια μπορεί να αποθηκεύεται και να μετατρέπεται','Μόνο ό,τι λάμπει έχει ενέργεια','Οι μπαταρίες παράγουν ενέργεια από το τίποτα'],0,'Η ενέργεια μπορεί να αποθηκεύεται και να μεταφέρεται ή να μετατρέπεται.']
 ]}
];
const subjectNames={spelling:'Ορθογραφία',reading:'Ανάγνωση',addition:'Μαθηματικά',math:'Μαθηματικά',history:'Ιστορία',science5:'Φυσικά'};
const html=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el};
const button=(text,fn,cls='')=>{const el=html('button',cls,text);el.type='button';el.onclick=fn;return el};
const home=$('home');
if(!home)return;
const pack=html('div','mathaino-test-pack');
pack.id='testPackHome';
pack.append(html('h3','', 'Καινούργια μαθήματα για δοκιμή'),html('p','', 'Διάλεξε ένα νέο μάθημα. Χωρίς χρονόμετρο και χωρίς πίεση.'));
const list=html('div','pack-lesson-grid');pack.append(list);home.append(pack);
const stage=html('section','hidden');
stage.id='testPackLesson';
$('learn').parentElement.insertBefore(stage,$('learn'));
const state={lesson:null,index:0,mode:'study',tries:0,solved:false,firstTry:0,revealed:false,choices:[]};
const art=id=>window.MathainoCrayonArt?.word(id)||window.MathainoWarmArt?.draw(id,true)||'';
const pick=a=>{const arr=a.slice();for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}return arr};
function canUse(l){
 const p=profiles[child];if(!p)return false;
 const allowed=p.allowed||[];if(allowed.includes(l.subject))return true;
 if(l.subject==='spelling'&&!p.spellingConfigured&&['Α','Β'].some(c=>String(p.grade||'').startsWith(c)))return true;
 if(l.subject==='science5'&&!p.grade5SubjectsConfigured&&String(p.grade||'').startsWith('Ε'))return true;
 return false;
}
function showHome(){
 list.replaceChildren();
 for(const l of lessons.filter(canUse)){
  const card=button('',()=>open(l.id),'pack-card');
  const artBox=html('span','pack-card-art');artBox.innerHTML=art(l.art);
  const content=html('span','pack-card-copy');
  content.append(html('span','pack-card-grade',subjectNames[l.subject]+' · '+l.grade+' Δημοτικού'),html('strong','',l.title),html('span','pack-card-detail',l.subtitle));
  card.append(artBox,content);list.append(card);
 }
 pack.hidden=!list.children.length;
}
function open(id){
 const l=lessons.find(x=>x.id===id);if(!l||!canUse(l))return;
 if(l.kind==='spelling'){
  const select=$('spellGroup'),subject=document.querySelector('#subjects [data-sub="spelling"]');
  if(subject&&select){subject.click();$('topic').value=l.group;$('study').click();return}
  return;
 }
 state.lesson=l;state.mode='study';state.index=0;state.tries=0;state.firstTry=0;state.solved=false;
 draw();viewAll('testPackLesson');
}
function safeLog(choice,correct){
 if(typeof ready==='undefined'||!ready||typeof db==='undefined'||!db||typeof cloudChildren==='undefined'||!cloudChildren?.[child])return;
 const q=state.lesson.questions[state.index];if(!q)return;
 const event={child_id:cloudChildren[child].id,subject:state.lesson.subject,topic:state.lesson.title,
 question:q[0],selected_answer:String(choice).slice(0,100),correct_answer:q[1][q[2]],is_correct:correct,attempt_number:state.tries};
 db.from('answer_events').insert(event).then(({error})=>{if(error)console.warn('Content Pack progress not saved:',error.message)}).catch(()=>{});
}
function draw(){
 stage.replaceChildren();
 const l=state.lesson;if(!l)return;
 const header=html('div','pack-heading');
 header.append(button('← Μαθήματα',()=>viewAll('home')));
 const meta=html('div','pack-header-meta');meta.append(html('span','pack-eyebrow',subjectNames[l.subject]+' · '+l.grade+' Δημοτικού'),html('h2','',l.title),html('p','',l.subtitle));
 header.append(meta);stage.append(header);
 const hero=html('div','pack-hero');hero.innerHTML=art(l.art);stage.append(hero);
 const modes=html('div','pack-mode-tabs');
 modes.append(button('Μελέτη',()=>{state.mode='study';draw()},state.mode==='study'?'primary':''),button('Ερωτήσεις',()=>{state.mode='quiz';state.index=0;state.firstTry=0;beginQuestion();draw()},state.mode==='quiz'?'primary':''));
 stage.append(modes);
 const body=html('div','pack-body');stage.append(body);
 if(state.mode==='study')study(body);else quiz(body);
}
function study(body){
 const l=state.lesson;
 body.append(html('p','pack-intro','Διάβασε τις κάρτες. Όταν νιώσεις έτοιμος ή έτοιμη, ξεκίνα τις ερωτήσεις.'));
 for(const page of l.pages){
  const card=html('article','pack-study-card');
  const illustration=html('div','pack-study-art');illustration.innerHTML=art(page.art);
  const copy=html('div','pack-study-copy');copy.append(html('h3','',page.title),html('p','',page.text));
  card.append(illustration,copy);body.append(card);
 }
 if(l.source){const source=html('p','pack-source');const a=html('a','', 'Άνοιξε το αντίστοιχο σχολικό βιβλίο');a.href=l.source;a.target='_blank';a.rel='noopener noreferrer';source.append(a);body.append(source)}
 body.append(button('Ξεκίνα τις ερωτήσεις',()=>{state.mode='quiz';state.index=0;state.firstTry=0;beginQuestion();draw()},'primary pack-big-button'));
}
function beginQuestion(){
 state.tries=0;state.solved=false;state.revealed=false;
 const q=state.lesson.questions[state.index];state.choices=pick(q[1].map((label,i)=>({label,index:i})));
}
function quiz(body){
 const l=state.lesson,q=l.questions[state.index];if(!q){finish(body);return}
 body.append(html('p','pack-count','Ερώτηση '+(state.index+1)+' από '+l.questions.length));
 const track=html('div','pack-track');const fill=html('span','pack-track-fill');fill.style.width=(state.index/l.questions.length*100)+'%';track.append(fill);body.append(track);
 const card=html('div','pack-question-card');
 card.append(html('h3','',q[0]));
 const choices=html('div','pack-options');card.append(choices);
 const feedback=html('p','pack-feedback');feedback.setAttribute('aria-live','polite');card.append(feedback);
 const assist=html('div','pack-assist');card.append(assist);
 const next=button(state.index===l.questions.length-1?'Ολοκλήρωση':'Επόμενη ερώτηση',advance,'primary pack-big-button mathaino-completion');next.hidden=true;card.append(next);
 for(const option of state.choices){
  const b=button(option.label,()=>{
   if(state.solved)return;
   state.tries++;
   const good=option.index===q[2];safeLog(option.label,good);
   if(good){state.solved=true;if(state.tries===1)state.firstTry++;feedback.textContent='Σωστά! '+q[3];feedback.dataset.state='good';choices.querySelectorAll('button').forEach(x=>x.disabled=true);next.hidden=false;assist.replaceChildren();}
   else{b.disabled=true;b.classList.add('pack-wrong');feedback.textContent='Δοκίμασε άλλη απάντηση. Μπορείς να ξαναδείς τη μελέτη.';feedback.dataset.state='try';if(state.tries>=2){assist.replaceChildren(button('Δες τη λύση',()=>{state.solved=true;feedback.textContent='Η απάντηση είναι: '+q[1][q[2]]+'. '+q[3];feedback.dataset.state='solution';choices.querySelectorAll('button').forEach(x=>x.disabled=true);next.hidden=false;assist.replaceChildren()},'pack-reveal'))}}
  },'pack-choice');
  choices.append(b);
 }
 body.append(card);
}
function advance(){
 if(!state.solved)return;
 state.index++;
 if(state.index===state.lesson.questions.length){state.mode='done';draw();return}
 beginQuestion();draw();
}
function finish(body){
 body.append(html('h3','', 'Ολοκλήρωσες το μάθημα!'),html('p','', 'Εξασκήθηκες σε '+state.lesson.questions.length+' ερωτήσεις. Μπορείς να επιστρέψεις όποτε θέλεις.'));
 body.append(button('Επανάληψη',()=>{state.mode='study';state.index=0;draw()},'primary'),button('Πίσω στα μαθήματα',()=>viewAll('home')));
}
const prevView=viewAll;
viewAll=function(id){prevView(id);stage.classList.toggle('hidden',id!=='testPackLesson');if(id==='home')showHome()};
showHome();
window.MathainoContentPack=Object.freeze({version:'0.6.54',lessons:lessons.map(l=>({id:l.id,title:l.title,grade:l.grade,subject:l.subject,questionCount:l.questions?.length||0})),canUse:id=>{const l=lessons.find(x=>x.id===id);return !!l&&canUse(l)}});
})();