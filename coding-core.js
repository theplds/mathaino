/* Μαθαίνω! — Μικρός Προγραμματιστής (pilot v0.6.76).
   Deterministic, offline, browser-only game rules; no child data or external calls. */
(function(global){
'use strict';
const SIZE=5;
const DIRECTIONS=[[0,-1],[1,0],[0,1],[-1,0]];
const COMMANDS=Object.freeze({
 F:{label:'↑ Μπροστά',short:'↑'},
 L:{label:'↶ Στρίψε αριστερά',short:'↶'},
 R:{label:'↷ Στρίψε δεξιά',short:'↷'},
 F3:{label:'↻ 3 × Μπροστά',short:'↻3'},
 IFBLOCK:{label:'Αν υπάρχει εμπόδιο → δεξιά',short:'ΑΝ'}
});
const LEVELS=Object.freeze([
 {title:'Δύο βήματα',grade:'Β΄',concept:'Σειρά εντολών',prompt:'Πήγαινε το ρομπότ στο αστέρι. Ποια εντολή χρειάζεται δύο φορές;',start:[0,2,1],goal:[2,2],walls:[],available:['F','L','R'],hint:'Το βέλος δείχνει προς τα δεξιά. Δοκίμασε δύο φορές το «Μπροστά».',starter:[]},
 {title:'Η σωστή στροφή',grade:'Β΄',concept:'Ακολουθία',prompt:'Πρώτα ανέβα, μετά στρίψε και πήγαινε στο αστέρι.',start:[1,3,0],goal:[3,1],walls:[],available:['F','L','R'],hint:'Δύο βήματα πάνω, μία δεξιά στροφή και δύο βήματα μπροστά.',starter:[]},
 {title:'Βρες το λάθος',grade:'Δ΄',concept:'Διόρθωση προγράμματος',prompt:'Το πρόγραμμα έχει ένα λάθος! Πάτησε μια εντολή, αφαίρεσέ την και βάλε τη σωστή στη θέση της.',start:[0,4,1],goal:[2,2],walls:[],available:['F','L','R'],hint:'Στη μέση του προγράμματος, πρέπει να κοιτάξεις προς τα πάνω, όχι προς τα κάτω.',starter:['F','F','R','F','F']},
 {title:'Λιγότερες εντολές',grade:'Δ΄',concept:'Επανάληψη',prompt:'Δοκίμασε την εντολή «Επανάλαβε 3 × Μπροστά». Μία εντολή μπορεί να κάνει τρία βήματα!',start:[0,2,1],goal:[3,2],walls:[],available:['F','L','R','F3'],required:'F3',hint:'Το «↻ 3 × Μπροστά» ισοδυναμεί με τρία απλά βήματα.',starter:[]},
 {title:'Αν συναντήσεις εμπόδιο',grade:'Ε΄',concept:'Συνθήκη',prompt:'Υπάρχει πέτρα μπροστά. Χρησιμοποίησε «Αν υπάρχει εμπόδιο → δεξιά» και φτάσε στο αστέρι.',start:[0,1,1],goal:[0,3],walls:[[1,1]],available:['F','L','R','IFBLOCK'],required:'IFBLOCK',hint:'Πρώτα έλεγξε αν υπάρχει εμπόδιο, μετά προχώρησε δύο βήματα.',starter:[]},
 {title:'Φτιάξε δική σου διαδρομή',grade:'Όλες',concept:'Ελεύθερη δημιουργία',prompt:'Άγγιξε ένα κενό τετράγωνο για να βάλεις το δικό σου αστέρι. Έπειτα φτιάξε όποιο πρόγραμμα θέλεις.',start:[2,2,0],goal:null,walls:[],available:['F','L','R','F3','IFBLOCK'],creative:true,hint:'Διάλεξε πρώτα το αστέρι. Οι στροφές αλλάζουν την κατεύθυνση, αλλά όχι τη θέση του ρομπότ.',starter:[]}
]);
function initial(level){return {x:level.start[0],y:level.start[1],dir:level.start[2]}}
function isBlocked(level,x,y){
 return x<0||x>=SIZE||y<0||y>=SIZE||level.walls.some(w=>w[0]===x&&w[1]===y)
}
function forwardBlocked(level,robot){
 const d=DIRECTIONS[robot.dir];
 return isBlocked(level,robot.x+d[0],robot.y+d[1]);
}
function expand(program){
 if(!Array.isArray(program)||program.length>18)throw Error('Μέχρι 18 εντολές ανά πρόγραμμα.');
 const actions=[];
 for(let i=0;i<program.length;i++){
  const op=program[i];
  if(!Object.prototype.hasOwnProperty.call(COMMANDS,op))throw Error('Άγνωστη εντολή.');
  if(op==='F3'){
   for(let n=0;n<3;n++)actions.push({op:'F',source:i});
  }else actions.push({op,source:i});
 }
 if(actions.length>36)throw Error('Το πρόγραμμα είναι πολύ μεγάλο.');
 return actions
}
function step(level,robot,action){
 const out={x:robot.x,y:robot.y,dir:robot.dir};
 if(action.op==='L')out.dir=(out.dir+3)%4;
 if(action.op==='R')out.dir=(out.dir+1)%4;
 if(action.op==='IFBLOCK'&&forwardBlocked(level,out))out.dir=(out.dir+1)%4;
 if(action.op==='F'){
  const d=DIRECTIONS[out.dir],nx=out.x+d[0],ny=out.y+d[1];
  if(isBlocked(level,nx,ny))return {robot:out,blocked:true};
  out.x=nx;out.y=ny;
 }
 return {robot:out,blocked:false}
}
function reached(robot,goal){return !!goal&&robot.x===goal[0]&&robot.y===goal[1]}
function eligible(level,program){return !level.required||program.includes(level.required)}
const api=Object.freeze({size:SIZE,commands:COMMANDS,levels:LEVELS,initial,isBlocked,forwardBlocked,expand,step,reached,eligible});
global.MathainoCodingCore=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:this);
