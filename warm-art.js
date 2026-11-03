/* Μαθαίνω! warm illustration system • v0.6.55
   Original, self-contained SVG artwork. Same palette, strokes, and frame across subjects, words and lessons. */
(function(){
'use strict';
const ink='#70584b',honey='#e7ba6c',coral='#eaa08a',sage='#a4c4a4',sky='#a8cbd0',cream='#fff9eb',peach='#f6d9bd';
const p=(d,fill='none',stroke=ink,width=3.3)=>'<path d="'+d+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+width+'" stroke-linecap="round" stroke-linejoin="round"/>';
const c=(x,y,r,fill,stroke=ink,width=3)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+width+'"/>';
const e=(x,y,rx,ry,fill)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+fill+'"/>';
const r=(x,y,w,h,rr,fill,stroke=ink,width=3)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+rr+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+width+'"/>';
const eye=(x,y)=>'<circle cx="'+x+'" cy="'+y+'" r="3.5" fill="'+ink+'"/>';
const smile=(x,y)=>p('M'+(x-8)+' '+y+'q8 9 16 0', 'none',ink,2.7);
const shapes={
 apple:()=>p('M118 70q-31-25-49 11q-15 36 17 68q17 19 34 10q18 9 35-13q33-39 12-65q-17-20-49-11Z',coral)+p('M118 69q-2-22 9-31', 'none')+p('M127 51q18-20 36-7q-10 19-36 7Z',sage)+c(94,98,5,cream,cream,0),
 ball:()=>c(120,106,61,coral)+p('M61 103q58-31 117 0M120 46q-30 58 0 121M120 46q35 54 0 121','none',cream,4),
 cat:()=>p('M63 86 67 47 91 62q29-12 59 0l24-15 3 39q23 28 3 58q-23 30-62 29q-47 1-61-36q-12-25 6-51Z',honey)+eye(99,108)+eye(144,108)+smile(121,125)+p('M120 118l-5 7h10z',coral)+p('M79 125l-23-4m23 12-21 5m100-13 22-4m-22 12 20 5','none',ink,2),
 dog:()=>[
 '<path d="M73 117Q42 115 42 87Q41 78 48 71" stroke="#70584b" stroke-width="17" fill="none" stroke-linecap="round"/>',
 '<path d="M73 117Q42 115 42 87Q41 78 48 71" stroke="#dcaf79" stroke-width="11" fill="none" stroke-linecap="round"/>',
 '<path d="M75 96Q98 84 128 90Q154 94 163 113Q172 136 158 163L78 163Q61 153 63 126Z" fill="#e7ba85" stroke="#70584b" stroke-width="3.5" stroke-linejoin="round"/>',
 '<path d="M86 134L86 166Q83 174 67 172Q60 172 63 166L72 144Z" fill="#d6a273" stroke="#70584b" stroke-width="3"/>',
 '<path d="M141 129L145 166Q152 174 166 171Q171 169 165 164L159 133Z" fill="#e7ba85" stroke="#70584b" stroke-width="3"/>',
 '<path d="M74 168h17m58 0h17" stroke="#70584b" stroke-width="2.4" fill="none" stroke-linecap="round"/>',
 '<path d="M140 91Q143 76 158 72L181 88L165 129Q154 134 142 119Z" fill="#f1cda8" stroke="#70584b" stroke-width="3.5"/>',
 '<path d="M149 82Q147 65 160 56Q179 46 188 66Q192 70 202 74L214 84Q218 92 211 98Q202 104 186 103Q183 115 172 121Q151 125 145 109Z" fill="#f2d9bc" stroke="#70584b" stroke-width="3.5" stroke-linejoin="round"/>',
 '<path d="M163 60Q146 53 139 72Q133 90 149 103Q162 105 163 89Z" fill="#b78060" stroke="#70584b" stroke-width="3.1"/>',
 '<path d="M149 70q-7 14 2 24" stroke="#daae8c" stroke-width="3" fill="none" stroke-linecap="round"/>',
 '<circle cx="185" cy="80" r="3.8" fill="#564238"/><circle cx="186" cy="79" r="1.1" fill="#fff9ec"/>',
 '<path d="M209 86q11-2 5 9q-5 5-10-1z" fill="#564238"/>',
 '<path d="M192 100q7 5 13 0" stroke="#70584b" stroke-width="2" fill="none" stroke-linecap="round"/>',
 '<path d="M149 109q9 10 25 11" stroke="#bd775e" stroke-width="7" fill="none" stroke-linecap="round"/>',
 '<circle cx="161" cy="126" r="5.5" fill="#f0c778" stroke="#70584b" stroke-width="1.8"/>'
].join(''),
 duck:()=>e(115,130,66,40,honey)+c(88,81,42,honey)+p('M50 85 19 97 51 109Z',coral)+eye(82,78)+p('M125 126q24-22 41 0q-17 28-41 0Z',peach)+p('M103 169v14m30-12v12','none',ink,3.5),
 bird:()=>e(118,122,58,43,sky)+c(88,85,35,sky)+p('M58 91 35 100 59 108Z',honey)+eye(82,81)+p('M105 123q23-25 44 0q-20 26-44 0Z',sage)+p('M111 165v18m26-18v18','none',ink,3),
 fish:()=>p('M58 108q47-59 103-16l39-33-2 99-37-31q-61 43-103-19Z',sky)+c(92,103,5,ink,ink,0)+p('M119 83q17 23 0 45m-58-17h11','none',ink,3),
 sun:()=>c(120,105,42,honey)+Array.from({length:9},(_,i)=>{const a=i*Math.PI*2/9;return p('M'+(120+55*Math.cos(a)).toFixed(1)+' '+(105+55*Math.sin(a)).toFixed(1)+'l'+(19*Math.cos(a)).toFixed(1)+' '+(19*Math.sin(a)).toFixed(1),'none',honey,6)}).join('')+eye(108,104)+eye(133,104)+smile(121,120),
 water:()=>p('M88 56h67l-8 100q-25 20-52 0Z',cream)+p('M94 108q31 9 55 0l-4 45q-24 14-48-1Z',sky,'none',0)+p('M88 56h67l-8 100q-25 20-52 0Z'),
 house:()=>p('M54 91 120 40 187 91v73H54Z',peach)+p('M41 97 120 34 199 97','none',ink,5)+r(108,113,30,51,7,coral)+r(68,107,27,25,6,sky)+r(153,107,27,25,6,sky),
 school:()=>r(51,73,138,97,10,peach)+p('M42 74 120 35 198 74',honey)+p('M42 74 120 35 198 74','none',ink,4)+r(104,118,33,52,6,coral)+[65,149].map(x=>r(x,92,26,21,5,sky)).join('')+r(112,55,17,18,2,cream),
 tree:()=>p('M110 115v54h25v-54Z',peach)+c(82,91,35,sage)+c(143,85,38,sage)+c(116,61,37,sage),
 book:()=>p('M39 76q42-13 78 10v83q-39-20-78-8Z',cream)+p('M121 86q38-23 80-9v84q-40-12-80 8Z',peach)+p('M119 86v83M57 99q24-5 45 6m-45 15q24-5 45 6m40-21q22-10 42-6m-42 27q22-10 42-6','none',ink,2.5),
 bread:()=>p('M58 146V92q0-45 48-46q49-12 73 37v63q-52 22-121 0Z',honey)+p('M70 133V92q4-28 39-31q38-5 57 30v42q-41 18-96 0Z',peach)+p('M95 81q-13 13-6 33m35-39q-7 18 4 37','none','#bc8860',3),
 milk:()=>p('M86 66h68l-7 108H92Z',cream)+p('M86 66l11-24h45l12 24Z',sky)+p('M99 85h43v64H99Z',sage)+c(121,116,14,cream,'none',0),
 hat:()=>p('M75 124q-12-62 49-66q59 0 47 66Z',coral)+e(120,135,92,17,peach)+p('M83 115h75','none',cream,7),
 car:()=>p('M49 132 66 96h109l21 36v26H44v-19Z',coral)+p('M80 96 100 71h51l21 25Z',sky)+c(80,160,14,ink)+c(168,160,14,ink),
 train:()=>r(66,42,109,115,19,coral)+r(83,60,72,42,9,sky)+c(94,136,9,honey)+c(146,136,9,honey)+p('M82 158l-18 25m94-25 18 25m-119 0h128','none',ink,5),
 ship:()=>p('M35 132h171l-28 39H65Z',coral)+p('M121 56v77m0-71 59 61H124Z',cream)+p('M116 65 72 122h44Z',honey)+p('M70 183q21-8 43 0t44 0t42 0','none',sky,5),
 flower:()=>p('M120 109v65m0-33q-24-31-42-15q14 29 42 15m0 10q24-35 45-21q-10 29-45 21','none',sage,7)+[0,60,120,180,240,300].map(n=>'<ellipse cx="120" cy="79" rx="15" ry="29" transform="rotate('+n+' 120 107)" fill="'+coral+'" stroke="'+ink+'" stroke-width="2"/>').join('')+c(120,107,17,honey),
 banana:()=>p('M53 66q17 81 103 59q17-5 31-22q-21 60-74 60q-47-2-60-65Z',honey)+p('M58 66 52 58m135 44 12-9','none',ink,4),
 backpack:()=>r(71,70,99,103,22,coral)+p('M90 76V59q0-22 30-22t30 22v17','none',ink,4)+r(87,123,67,38,10,peach)+p('M93 95h54','none',cream,5),
 pencil:()=>p('M79 152 157 45l22 16-78 107-29 13Z',honey)+p('M157 45l10-14 22 16-10 14Z',coral)+p('M72 181l8-29 21 16Z',cream),
 door:()=>r(78,36,88,143,5,peach)+r(91,48,63,119,4,coral)+c(142,112,5,honey),
 clock:()=>c(120,106,68,cream)+c(120,106,54,peach,'none',0)+p('M120 106V67m0 39 27 17','none',ink,6)+c(120,106,5,ink),
 icecream:()=>p('M98 113h45l-22 65Z',honey)+c(120,86,39,coral)+c(100,94,23,peach)+c(140,101,23,peach),
 moon:()=>p('M142 35q-61 21-53 76q8 44 65 51q-46 31-86 0q-43-32-20-84q26-51 94-43Z',honey)+c(165,62,5,coral,'none',0)+c(190,102,5,coral,'none',0),
 umbrella:()=>p('M47 116q6-80 73-81q68 0 74 81q-17-15-37 0q-18-15-37 0q-18-15-37 0q-18-15-36 0Z',coral)+p('M120 36v119q0 25 22 13','none',ink,5),
 city:()=>r(46,104,65,65,7,peach)+r(112,69,72,100,8,sage)+r(76,61,44,108,6,coral)+p('M40 171h157','none',ink,5)+[80,138,165].map(x=>r(x,114,13,22,2,cream)).join(''),
 battery:()=>r(84,50,73,123,13,sage)+r(107,38,28,13,3,peach)+p('M107 113h28m-14-14v28','none',ink,7)+r(94,144,53,17,5,cream,'none',0),
 palace:()=>p('M38 104 120 51 202 104','none',ink,5)+r(46,98,148,72,5,peach)+[58,100,142,184].map(x=>r(x,110,18,53,3,cream)).join('')+p('M34 171h173','none',ink,5)
};
const labels={apple:'Μήλο',ball:'Μπάλα',cat:'Γάτα',dog:'Σκύλος',duck:'Παπί',bird:'Πουλί',fish:'Ψάρι',sun:'Ήλιος',water:'Νερό',house:'Σπίτι',school:'Σχολείο',tree:'Δέντρο',book:'Βιβλίο',bread:'Ψωμί',milk:'Γάλα',hat:'Καπέλο',car:'Αμάξι',train:'Τρένο',ship:'Καράβι',flower:'Λουλούδι',banana:'Μπανάνα',backpack:'Τσάντα',pencil:'Μολύβι',door:'Πόρτα',clock:'Ρολόι',icecream:'Παγωτό',moon:'Φεγγάρι',umbrella:'Ομπρέλα',city:'Αρχαία πόλη',battery:'Μπαταρία',palace:'Αρχαίο κτίριο'};
const themes={history:'ship',history5:'palace',science5:'battery',math:'pencil',addition:'apple',reading:'book',spelling:'pencil',fr:'book',en:'book',chess:'palace',cars:'car',
'reading-cat':'cat','reading-market':'apple','math20':'apple','math-multiply':'pencil','history-governments':'city','physics-storage':'battery'};
function draw(id,wide=false){
 const key=shapes[id]?id:(themes[id]||'book'),shape=shapes[key];
 const label=labels[key]||id;
 const w=wide?360:240,h=wide?210:200;
 const base='<rect width="'+w+'" height="'+h+'" rx="21" fill="#f7ecdc"/>'+
  '<rect x="9" y="9" width="'+(w-18)+'" height="'+(h-18)+'" rx="18" fill="#fff9ec" stroke="#dfcdb5" stroke-width="2"/>'+
  '<path d="M20 32q13-11 28 0M'+(w-46)+' '+(h-23)+'q14 9 23-3" fill="none" stroke="#e9d9c0" stroke-width="3" stroke-linecap="round"/>';
 const offset=wide?60:0;
 return '<svg class="mathaino-warm-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+label+'" focusable="false">'+
 base+'<g transform="translate('+offset+' 0)">'+e(120,179,82,8,'#e8dec8')+shape()+'</g></svg>';
}
window.MathainoWarmArt=Object.freeze({draw,word:id=>shapes[id]?draw(id):'',subject:id=>draw(id,true),themes:Object.freeze(themes),palette:Object.freeze({cream:'#fff9ec',ink,coral,sage,honey,sky}),wordIds:Object.freeze(Object.keys(shapes))});
})();