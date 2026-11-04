/* Μαθαίνω! v0.6.67 — original picture-based spelling practice organized
   by the Diophantos first-grade Greek Language textbook units.
   The first chapters now match the order of textbook letter focus. Some later
   exercises remain clearly identified as supplemental, not textbook word lists. */
(function(){
'use strict';
const source='https://www.ebooks.edu.gr/ebooks/v/html/8547/1993/Glossa_A-Dimotikou_html-empl/index.html';
const bank={
 'παπί':['duck',2], 'γάτα':['cat',1], 'μήλο':['apple',0], 'νερό':['water',1],
 'γάλα':['milk',2], 'ήλιος':['sun',0], 'σπίτι':['house',2], 'σκύλος':['dog',2],
 'δέντρο':['tree',1], 'καπέλο':['hat',3], 'ψωμί':['bread',3], 'βιβλίο':['book',4],
 'ψάρι':['fish',1], 'μπάλα':['ball',0], 'πουλί':['bird',1], 'λουλούδι':['flower',2],
 'μπανάνα':['banana',3], 'τρένο':['train',2], 'καράβι':['ship',1], 'αμάξι':['car',3],
 'σχολείο':['school',3], 'τσάντα':['backpack',2], 'μολύβι':['pencil',4],
 'πόρτα':['door',2], 'ρολόι':['clock',3], 'παγωτό':['icecream',3],
 'φεγγάρι':['moon',2], 'ομπρέλα':['umbrella',4]
};
const units=[
 {number:1,title:'Πού είναι ο Άρης;',chapters:[
   {title:'Πού είναι ο Άρης;',focus:'Προαναγνωστική εξάσκηση · παπί',words:['παπί']}
 ]},
 {number:2,title:'Η παρέα',chapters:[
   {title:'Αντίο, θάλασσα',focus:'Α α',words:['παπί']},
   {title:'Ο κύριος με το καπέλο',focus:'Κ κ',words:['καπέλο','παπί','τρένο']}
 ]},
 {number:3,title:'Μια παράσταση στην πλατεία',chapters:[
   {title:'Μήλα και καμήλα',focus:'Η η',words:['μήλο','παπί','καπέλο']},
   {title:'Γάτα και παπαγάλος',focus:'Γ γ',words:['γάτα','παπί','μήλο','καπέλο']}
 ]},
 {number:4,title:'Το σύννεφο έφερε βροχή',chapters:[
   {title:'Χωρίς φως',focus:'Φ φ',words:['φεγγάρι','γάτα','μήλο','καπέλο']}
 ]},
 {number:5,title:'Σκανταλιές',chapters:[
   {title:'Ένας καινούριος μαθητής',focus:'Αι αι · θεματική επανάληψη',words:['σχολείο','τσάντα','μολύβι','βιβλίο','πόρτα','ρολόι']}
 ]},
 {number:6,title:'Το χαμένο κλειδί',chapters:[
   {title:'Κοντά στο τζάκι',words:['σπίτι','πόρτα','καπέλο','βιβλίο','φεγγάρι','ρολόι']}
 ]},
 {number:7,title:'Καράβια',chapters:[
   {title:'Καράβια',words:['καράβι','ψάρι','νερό','ήλιος','πουλί','ομπρέλα']}
 ]},
 {number:8,title:'Άνοιξη',chapters:[
   {title:'Βόλτα στο βουνό',words:['λουλούδι','δέντρο','πουλί','ήλιος','νερό','παπί']}
 ]},
 {number:9,title:'Ο κόσμος των βιβλίων',chapters:[
   {title:'Στη βιβλιοθήκη',words:['βιβλίο','μολύβι','τσάντα','σχολείο','πόρτα','ρολόι']}
 ]},
 {number:10,title:'Το κοχύλι',chapters:[
   {title:'Καλοκαιρινή εκδρομή',words:['νερό','ψάρι','καράβι','ήλιος','ομπρέλα','καπέλο']}
 ]}
];
const lessons=units.flatMap(unit=>unit.chapters.map(chapter=>({
 name:'Εν. '+unit.number+' · '+chapter.title,
 description:'Πρωτότυπη εικονογραφημένη εξάσκηση ανά ενότητα. Δεν είναι αυτούσιος κατάλογος λέξεων του βιβλίου.',
 bookUnit:unit.number,
 bookUnitTitle:unit.title,
 bookChapter:chapter.title,
 focus:chapter.focus||'Επανάληψη / θεματικές λέξεις',
 source,
 items:chapter.words.map(w=>{
  if(!bank[w])throw new Error('Missing spelling crayon picture for '+w);
  return [w,bank[w][0],bank[w][1]]
 })
})));
window.MathainoBookSpelling=Object.freeze({units,lessons,source});
})();