/* Μαθαίνω! v0.6.67 — original, locally rendered sketchbook illustrations
   for older learners. No external image service or artwork licensing. */
(function(){
'use strict';
const stroke='#394c51',light='#b2b8aa',paper='#f5f2e9',warm='#d3c1a3';
const line=(d,width=2.6)=>'<path d="'+d+'" fill="none" stroke="'+stroke+'" stroke-width="'+width+'" stroke-linecap="round" stroke-linejoin="round"/>';
const solid=(d,fill=warm)=>'<path d="'+d+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2.3" stroke-linejoin="round"/>';
const shapes={
 ship:solid('M50 133Q167 157 301 128L282 154Q169 178 88 155Z')+
  line('M64 142q108 35 225 1M84 150l7 10m18-6 6 11m20-7 5 9m21-8 4 11m23-11 4 10m26-10 4 9m20-11 5 8',1.7)+
  line('M163 128V30M163 32Q206 58 236 122H163Z',2.5)+solid('M160 38Q132 70 127 120L160 121Z','#e4dfd3')+
  line('M171 42l30 62m-31-43 43 49m-46-32 56 35',1.6)+
  line('M44 181q20-8 39 0t40 0t39 0t40 0t40 0t40 0M58 193q15-7 32 0t31 0t35 0t35 0t35 0t30 0',1.7),
 city:solid('M55 155L59 81L122 81L130 155Z','#e0d6c3')+
  solid('M152 159V67L236 67V159Z','#eee9df')+
  solid('M244 158V93L296 93V158Z','#d5c6ab')+
  line('M143 65l52-29 53 29H143ZM160 153h68M166 72v79m19-79v79m20-79v79m20-79v79M70 88v61m24-61v61m19-61v61M257 100v50m26-50v50',3)+
  line('M42 165H314M61 176H300M72 188H292',2),
 palace:solid('M49 150V93H307V150Z','#e6ded0')+
  solid('M61 90L178 32L294 90Z','#d5c6ae')+
  line('M64 151V90M291 151V90M93 100v47m27-47v47m27-47v47m60-47v47m27-47v47m27-47v47M77 97H278M75 151H281',2.5)+
  solid('M162 150V112Q178 94 194 112V150Z','#b1b7af')+
  line('M164 128h27M47 162H308M60 171H296M80 181H276',2),
 battery:solid('M116 51H244V155H116Z','#e7ddc9')+
  solid('M158 43H203V51H158Z','#94a9a0')+
  line('M130 69H230V144H130V69ZM143 90h23m-11-11v23M200 89h22',3)+
  solid('M187 80l-19 32h14l-8 24 30-36h-16l9-20Z','#d4b470')+
  line('M68 127q-15-20 0-39m-11 60q-28-36-2-73M286 127q17-20 0-39m11 60q30-36 1-73',2.1),
 book:solid('M39 66Q110 44 175 80V171Q107 147 39 169Z','#faf5e9')+
  solid('M176 81Q243 45 318 65V169Q248 148 176 171Z','#f5ede0')+
  line('M176 83V175M57 87q45-17 100 8M57 107q48-14 100 6M57 126q54-11 100 9M193 95q46-22 104-10M193 114q45-14 104-8M193 133q48-11 104-6M31 179Q108 164 176 186Q242 161 325 180',2),
 pencil:solid('M76 149L205 47L234 76L105 178Z','#e6d8bd')+
  solid('M76 149L65 191L105 178Z','#f5efe0')+
  line('M85 157L214 56M96 167L225 67M65 191L84 180M253 153h50m-25-27v55M246 101l37-37m-35 0 35 35',2.4)+
  solid('M206 47L220 34L248 63L234 76Z','#aeb6ae'),
 water:line('M116 54L132 167Q181 176 229 166L244 54Z',3)+
  solid('M126 117Q155 109 181 117T236 117L229 163Q181 173 132 164Z','#bbd2d0')+
  line('M131 62h98M130 143q32-10 52 0t46 0M163 80q-7 11 0 17m36-26q-7 11 0 17',1.8)+
  line('M92 172Q180 186 268 172M107 184H252',1.6),
 apple:solid('M174 77Q136 51 104 81Q70 108 96 150Q120 186 165 163Q180 158 194 166Q239 183 263 136Q281 96 252 79Q213 55 185 77Z','#d4bbac')+
  line('M181 77q-10-24 4-48M186 51q31-28 58-12q-21 25-58 12ZM112 112q-11 26 11 41M259 114q6 16-8 32',3)+
  line('M77 190h219',1.8)
};
const labels={ship:'Σκίτσο αρχαίου πλοίου',city:'Σκίτσο πόλης',palace:'Σκίτσο κτιρίου',battery:'Σκίτσο μπαταρίας',book:'Σκίτσο βιβλίου',pencil:'Σκίτσο μολυβιού',water:'Σκίτσο νερού',apple:'Σκίτσο μήλου'};
function draw(key){
 if(!shapes[key])return '';
 const rulings=Array.from({length:6},(_,i)=>'<path d="M19 '+(32+i*29)+'H341" stroke="'+light+'" stroke-width=".6" opacity=".32"/>').join('');
 return '<svg class="mathaino-sketch-art" role="img" aria-label="'+labels[key]+'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 210" focusable="false">'+
 '<rect x="1" y="1" width="358" height="208" rx="16" fill="'+paper+'" stroke="#c9c3b6" stroke-width="2"/>'+rulings+
 shapes[key]+'</svg>'
}
window.MathainoSketchArt=Object.freeze({draw,ids:Object.freeze(Object.keys(shapes))});
})();