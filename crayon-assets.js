/* Μαθαίνω! v0.6.56 — approved child-drawn crayon asset library.
   Production atlas: 29 label-free illustrations cropped from the approved sheets.
   Every word uses the same 200x200 tile to keep the picture test neutral.
   Safari <14 fallback: existing original hand-drawn SVG figures remain available. */
(function(){
'use strict';
const keys=['dog','cat','duck','bird','fish','sun','apple','ball','house','tree','book','bread','milk','hat','car','train','ship','flower','banana','school','backpack','pencil','door','clock','icecream','moon','umbrella','water','battery'];
const labels=['σκύλος','γάτα','παπί','πουλί','ψάρι','ήλιος','μήλο','μπάλα','σπίτι','δέντρο','βιβλίο','ψωμί','γάλα','καπέλο','αμάξι','τρένο','καράβι','λουλούδι','μπανάνα','σχολείο','τσάντα','μολύβι','πόρτα','ρολόι','παγωτό','φεγγάρι','ομπρέλα','νερό','μπαταρία'];
const entries=Object.fromEntries(keys.map((k,i)=>[k,{index:i,label:labels[i]}]));
const source='./assets/crayon-v1-atlas.webp';
let supportsWebp=false;
try{
 const c=document.createElement('canvas');
 supportsWebp=typeof c.toDataURL==='function'&&c.toDataURL('image/webp').slice(0,15)==='data:image/webp';
}catch(e){}
function word(key){
 const item=entries[key];
 if(!item||!supportsWebp)return '';
 const x=(item.index%6)*200,y=Math.floor(item.index/6)*200;
 // The viewport exposes one square in the 6x5 original composite; no Greek labels.
 return '<svg class="mathaino-word-art mathaino-crayon-art" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" aria-label="Εικονογράφηση: '+item.label+'" focusable="false">'+
  '<rect width="200" height="200" rx="8" fill="#fff8eb"/>'+
  '<image href="'+source+'" xlink:href="'+source+'" x="'+(-x)+'" y="'+(-y)+'" width="1200" height="1000" preserveAspectRatio="none"/>'+
 '</svg>';
}
window.MathainoCrayonArt=Object.freeze({
 word,draw:(id)=>word(id),
 ids:Object.freeze(keys),supported:supportsWebp,
 version:'0.6.56',source
});
})();