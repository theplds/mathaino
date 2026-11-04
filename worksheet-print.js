/* Μαθαίνω! v0.6.61 • Print-ready A4 worksheets and downloadable offline PDFs.
   No paid service, tracker, or server. PDF pages are print-resolution JPEGs. */
(function(){
'use strict';
const STORE='mathaino-print-payload-v1';
const $=id=>document.getElementById(id);
const L=x=>String(x==null?'':x);
const make=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=L(txt);return e};
const chunk=(arr,n)=>{const result=[];for(let i=0;i<arr.length;i+=n)result.push(arr.slice(i,i+n));return result};
function readPayload(){
 try{
  const raw=localStorage.getItem(STORE);
  if(!raw||raw.length>140000)return null;
  const p=JSON.parse(raw);
  if(!p||!['spelling','quiz'].includes(p.kind))return null;
  if(p.kind==='spelling'&&(!Array.isArray(p.words)||!p.words.length||p.words.length>100))return null;
  if(p.kind==='quiz'&&(!Array.isArray(p.questions)||!p.questions.length||p.questions.length>120))return null;
  return p
 }catch(e){return null}
}
const p=readPayload();
if(!p){
 $('sheets').append(make('div','empty','Δεν βρέθηκε μάθημα για εξαγωγή. Επίλεξε πρώτα μια ενότητα μέσα από το Μαθαίνω!'));
 $('downloadPdf').disabled=true;$('printPages').disabled=true;
 return
}
const names={spelling:'Ορθογραφία',quiz:'Φύλλο εργασίας'};
const modeNames={missing:'Συμπλήρωσε το γράμμα που λείπει',tiles:'Βάλε τα γράμματα στη σειρά',write:'Γράψε τη λέξη'};
const modes=['missing','tiles','write'];
const accent=x=>L(x).normalize('NFD').replace(/\u0301/g,'').normalize('NFC');
function scrambled(word){
 const letters=Array.from(L(word));
 const a=letters.slice(1).concat(letters[0]);
 if(a.join('')===word)a.reverse();
 return a
}
function gap(word){
 const chars=Array.from(L(word.text));
 if(!chars.length)return '';
 const pos=Math.max(0,Math.min(chars.length-1,Number(word.blank)||0));
 chars[pos]='_';return chars.join('')
}
function plan(includeAnswers){
 const pages=[];
 if(p.kind==='spelling'){
  chunk(p.words,4).forEach((items,i)=>pages.push({type:'spelling',items,offset:i*4}));
 }else{
  chunk(p.pages||[],3).forEach((items,i)=>pages.push({type:'study',items,offset:i*3}));
  chunk(p.questions,4).forEach((items,i)=>pages.push({type:'quiz',items,offset:i*4}));
 }
 if(includeAnswers){
  const answers=p.kind==='spelling'
   ?p.words.map((w,i)=>({number:i+1,text:L(w.text)}))
   :p.questions.map((q,i)=>({number:i+1,text:L(q.answer||q.options?.[q.correct]||'')}));
  chunk(answers,14).forEach((items,i)=>pages.push({type:'answers',items,offset:i*14}));
 }
 return pages
}
function art(key){
 if(!key)return '';
 try{return window.MathainoIllustrations?.word(key)||window.MathainoCrayonArt?.word(key)||''}catch(e){return ''}
}
function header(page,index,count){
 const o=make('div','sheet-heading');
 o.append(make('div','sheet-overline','ΜΑΘΑΙΝΩ!  ·  '+(p.kind==='spelling'?'ΓΛΩΣΣΑ · Α΄ ΔΗΜΟΤΙΚΟΥ':L(p.grade||'ΣΧΟΛΙΚΕΣ ΑΣΚΗΣΕΙΣ'))));
 o.append(make('h1','sheet-title',page.type==='answers'?'Λύσεις για τον γονέα':L(p.title||names[p.kind])));
 o.append(make('p','sheet-subtitle',page.type==='study'?'Διάβασε πρώτα το μάθημα.':page.type==='answers'?'Οι λύσεις εκτυπώνονται σε ξεχωριστή σελίδα.':L(p.subtitle||'Γράψε τις απαντήσεις στον χώρο που υπάρχει.')));
 if(page.type!=='answers'){
  const fields=make('div','sheet-fields');
  const child=make('div','','Όνομα: '),blank=make('span');child.append(blank);
  const date=make('div','','Ημερομηνία: '),dateBlank=make('span','date');date.append(dateBlank);
  fields.append(child,date);o.append(fields)
 }
 return o
}
function appendPicture(parent,key){
 const wrap=make('div','task-graphic');wrap.innerHTML=art(key);parent.append(wrap)
}
function spellingTask(item,index){
 const mode=modes[index%modes.length];
 const block=make('article','task'),content=make('div','task-main');
 appendPicture(block,L(item.picture));
 content.append(make('div','task-label',(index+1)+'. '+modeNames[mode]));
 if(mode==='missing')content.append(make('div','task-letter',gap(item)));
 if(mode==='tiles'){
  const tiles=make('div','task-tiles');
  scrambled(L(item.text)).forEach(ch=>tiles.append(make('b','',accent(ch))));
  content.append(tiles)
 }
 const guides=make('div','write-guides');guides.setAttribute('aria-hidden','true');content.append(guides);
 block.append(content);return block
}
function studyTask(item){
 const e=make('article','study-card');
 e.append(make('h3','',item.title||'Διάβασε'),make('p','',item.text||''));return e
}
function quizTask(item,index){
 const e=make('article','question');
 e.append(make('p','question-text',(index+1)+'. '+L(item.q)));
 if(Array.isArray(item.options)){
  item.options.forEach(choice=>e.append(make('div','question-option',choice)));
 }else e.append(make('div','answer-line'));
 // Dedicated work area for math; do not put the answer on the student's page.
 if((p.subject==='math'||p.subject==='addition')&&Array.isArray(item.options))e.append(make('div','answer-line'));
 return e
}
function answerTask(item){
 const e=make('div','');const b=make('b','',item.number+'. ');e.append(b,document.createTextNode(item.text));return e
}
function show(){
 const pages=plan($('includeAnswers').checked),target=$('sheets');
 target.replaceChildren();
 pages.forEach((page,i)=>{
  const sheet=make('article','sheet');sheet.append(header(page,i,pages.length));
  const body=make('div',page.type==='answers'?'answer-list':'tasks');
  if(page.type==='spelling')page.items.forEach((w,j)=>body.append(spellingTask(w,page.offset+j)));
  if(page.type==='study')page.items.forEach(st=>body.append(studyTask(st)));
  if(page.type==='quiz')page.items.forEach((q,j)=>body.append(quizTask(q,page.offset+j)));
  if(page.type==='answers')page.items.forEach(a=>body.append(answerTask(a)));
  sheet.append(body);
  const foot=make('div','sheet-footer');foot.append(make('span','', 'Μαθαίνω! · Ασκήσεις για εκτύπωση'),make('span','',(i+1)+' / '+pages.length));
  sheet.append(foot);target.append(sheet)
 });
 $('status').textContent=pages.length+' σελ. A4';
 return pages
}
$('includeAnswers').addEventListener('change',show);
$('printPages').onclick=()=>{show();window.print()};
function renderLines(ctx,text,x,y,maxWidth,lineHeight,maxLines=10){
 let count=0,words=L(text).split(/\s+/),line='';
 for(const word of words){
  const trial=line?line+' '+word:word;
  if(line&&ctx.measureText(trial).width>maxWidth){
   ctx.fillText(line,x,y+count*lineHeight);
   count++;line=word;if(count>=maxLines)return count
  }else line=trial
 }
 if(line&&count<maxLines){ctx.fillText(line,x,y+count*lineHeight);count++}
 return count
}
function pageCanvas(desc,index,total,atlas){
 const canvas=document.createElement('canvas');canvas.width=1654;canvas.height=2339;
 const ctx=canvas.getContext('2d');
 if(!ctx)throw new Error('Δεν είναι διαθέσιμος ο καμβάς PDF.');
 // A4 at approximately 200 dpi, with a 1240×1754 design coordinate system.
 ctx.scale(1654/1240,2339/1754);
 ctx.fillStyle='#fff';ctx.fillRect(0,0,1240,1754);
 const ink='#413b34',muted='#8b705d',accentC='#6c7e70',left=88,right=1152;
 ctx.textBaseline='alphabetic';
 ctx.fillStyle=muted;ctx.font='bold 23px system-ui, sans-serif';
 ctx.fillText('Μ Α Θ Α Ι Ν Ω !    /    '+(p.kind==='spelling'?'Ο Ρ Θ Ο Γ Ρ Α Φ Ι Α':'Φ Υ Λ Λ Ο   Ε Ρ Γ Α Σ Ι Α Σ'),left,84);
 ctx.fillStyle=ink;ctx.font='bold 42px system-ui, sans-serif';
 renderLines(ctx,desc.type==='answers'?'Λύσεις για τον γονέα':L(p.title||names[p.kind]),left,150,1050,49,2);
 ctx.fillStyle=muted;ctx.font='26px system-ui, sans-serif';
 renderLines(ctx,desc.type==='answers'?'Ξεχωριστή σελίδα λύσεων':desc.type==='study'?'Διάβασε το μάθημα πριν απαντήσεις.':L(p.subtitle||'Συμπλήρωσε τις ασκήσεις.'),left,196,1050,34,2);
 if(desc.type!=='answers'){
  ctx.fillStyle=ink;ctx.font='24px system-ui, sans-serif';
  ctx.fillText('Όνομα: ___________________________',left,263);
  ctx.fillText('Ημερομηνία: _______________',650,263);
 }
 if(desc.type==='spelling'){
  desc.items.forEach((w,j)=>{
   const n=desc.offset+j,mode=modes[n%3],y=312+j*327;
   ctx.strokeStyle='#d1c9bc';ctx.lineWidth=2;ctx.strokeRect(left,y,1064,306);
   if(atlas&&w.picture){
    const idx=window.MathainoCrayonArt?.ids.indexOf(w.picture);
    if(idx>=0)ctx.drawImage(atlas,(idx%6)*200,Math.floor(idx/6)*200,200,200,left+23,y+60,185,185)
   }
   ctx.fillStyle=ink;ctx.font='bold 29px system-ui, sans-serif';
   ctx.fillText((n+1)+'. '+modeNames[mode],left+238,y+58);
   if(mode==='missing'){
    ctx.font='bold 55px system-ui, sans-serif';ctx.fillText(gap(w),left+255,y+143)
   }
   if(mode==='tiles'){
    let x=left+255;
    scrambled(L(w.text)).forEach(ch=>{
     ctx.strokeStyle='#9e8f81';ctx.lineWidth=2;ctx.strokeRect(x,y+90,50,56);
     ctx.fillStyle=ink;ctx.font='bold 35px system-ui, sans-serif';
     ctx.fillText(accent(ch),x+13,y+129);x+=59
    })
   }
   ctx.strokeStyle='#acaaa4';ctx.lineWidth=2;
   ctx.setLineDash([5,10]);ctx.beginPath();ctx.moveTo(left+242,y+203);ctx.lineTo(right-30,y+203);ctx.stroke();ctx.setLineDash([]);
   ctx.beginPath();ctx.moveTo(left+242,y+252);ctx.lineTo(right-30,y+252);ctx.stroke()
  })
 }
 if(desc.type==='study'){
  desc.items.forEach((item,j)=>{
   const y=325+j*430;
   ctx.fillStyle='#f9f5ee';ctx.fillRect(left,y,1064,379);
   ctx.fillStyle='#b58c66';ctx.fillRect(left,y,11,379);
   ctx.fillStyle=ink;ctx.font='bold 35px system-ui, sans-serif';
   renderLines(ctx,L(item.title||'Μελέτη'),left+43,y+66,970,42,2);
   ctx.font='29px system-ui, sans-serif';
   renderLines(ctx,L(item.text||''),left+43,y+122,955,44,6)
  })
 }
 if(desc.type==='quiz'){
  desc.items.forEach((item,j)=>{
   const y=300+j*342;
   ctx.strokeStyle='#d7d0c5';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(left,y+325);ctx.lineTo(right,y+325);ctx.stroke();
   ctx.fillStyle=ink;ctx.font='bold 30px system-ui, sans-serif';
   const rows=renderLines(ctx,(desc.offset+j+1)+'. '+L(item.q),left+10,y+42,1044,41,3);
   ctx.font='26px system-ui, sans-serif';
   if(Array.isArray(item.options)){
    item.options.forEach((option,k)=>{
     ctx.strokeStyle='#827f75';ctx.lineWidth=2;ctx.strokeRect(left+24,y+68+rows*28+k*51,20,20);
     renderLines(ctx,L(option),left+60,y+87+rows*28+k*51,974,30,2)
    })
   }else{
    ctx.strokeStyle='#a8a49f';ctx.beginPath();ctx.moveTo(left+30,y+233);ctx.lineTo(right-40,y+233);ctx.stroke()
   }
  })
 }
 if(desc.type==='answers'){
  desc.items.forEach((it,j)=>{
   ctx.fillStyle=ink;ctx.font='29px system-ui, sans-serif';
   renderLines(ctx,it.number+'.  '+L(it.text),left+13,338+j*90,1030,34,2)
  })
 }
 ctx.strokeStyle='#ddd6ca';ctx.beginPath();ctx.moveTo(left,1673);ctx.lineTo(right,1673);ctx.stroke();
 ctx.fillStyle=muted;ctx.font='21px system-ui, sans-serif';
 ctx.fillText('Μαθαίνω! · Φύλλο εργασίας',left,1712);
 ctx.fillText((index+1)+' / '+total,1085,1712);
 return canvas
}
function ascii(s){const b=new Uint8Array(s.length);for(let i=0;i<s.length;i++)b[i]=s.charCodeAt(i)&255;return b}
function pdfFromJpegs(items){
 const parts=[];const offsets=[0];let size=0;
 const write=x=>{const b=typeof x==='string'?ascii(x):x;parts.push(b);size+=b.length};
 const obj=(id,body)=>{offsets[id]=size;write(id+' 0 obj\n'+body+'\nendobj\n')};
 write('%PDF-1.4\n%\xe2\xe3\xcf\xd3\n');
 obj(1,'<< /Type /Catalog /Pages 2 0 R >>');
 const children=items.map((_,i)=>(5+i*3)+' 0 R').join(' ');
 obj(2,'<< /Type /Pages /Count '+items.length+' /Kids [ '+children+' ] >>');
 items.forEach((entry,i)=>{
  const imgId=3+i*3,contentId=imgId+1,pageId=imgId+2;
  offsets[imgId]=size;
  write(imgId+' 0 obj\n<< /Type /XObject /Subtype /Image /Width 1654 /Height 2339 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+entry.length+' >>\nstream\n');
  write(entry);write('\nendstream\nendobj\n');
  const commands='q\n595.28 0 0 841.89 0 0 cm\n/Im0 Do\nQ\n';
  obj(contentId,'<< /Length '+ascii(commands).length+' >>\nstream\n'+commands+'endstream');
  obj(pageId,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 '+imgId+' 0 R >> >> /Contents '+contentId+' 0 R >>')
 });
 const begin=size;const total=2+3*items.length;
 write('xref\n0 '+(total+1)+'\n0000000000 65535 f \n');
 for(let id=1;id<=total;id++)write(String(offsets[id]).padStart(10,'0')+' 00000 n \n');
 write('trailer\n<< /Size '+(total+1)+' /Root 1 0 R >>\nstartxref\n'+begin+'\n%%EOF');
 return new Blob(parts,{type:'application/pdf'})
}
function loadAtlas(){
 if(p.kind!=='spelling')return Promise.resolve(null);
 return new Promise(resolve=>{
  if(!window.MathainoCrayonArt?.supported)return resolve(null);
  const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>resolve(null);
  img.src='./assets/crayon-v1-atlas.webp'
 })
}
async function pdfDownload(){
 const button=$('downloadPdf');button.disabled=true;
 $('status').textContent='Δημιουργία PDF…';
 try{
  const pages=plan($('includeAnswers').checked),atlas=await loadAtlas();
  // If a writing task needs its picture, don't export an unusable PDF.
  if(p.kind==='spelling'&&!atlas)throw new Error('Οι εικόνες δεν είναι διαθέσιμες για λήψη PDF. Χρησιμοποίησε την εκτύπωση.');
  const encoded=[];
  for(let i=0;i<pages.length;i++){
   const canvas=pageCanvas(pages[i],i,pages.length,atlas);
   const uri=canvas.toDataURL('image/jpeg',.85);
   if(!uri.startsWith('data:image/jpeg,'))throw new Error('Το πρόγραμμα δεν μπορεί να δημιουργήσει PDF στη συσκευή.');
   const binary=atob(uri.slice(uri.indexOf(',')+1));
   const bytes=new Uint8Array(binary.length);
   for(let n=0;n<binary.length;n++)bytes[n]=binary.charCodeAt(n);
   encoded.push(bytes);canvas.width=0;canvas.height=0
  }
  const file=pdfFromJpegs(encoded);
  const url=URL.createObjectURL(file);
  const link=document.createElement('a');
  link.href=url;link.download='mathaino-fyllo-ergasias.pdf';
  document.body.append(link);link.click();link.remove();
  window.setTimeout(()=>URL.revokeObjectURL(url),60000);
  $('status').textContent='Το PDF δημιουργήθηκε · '+pages.length+' σελίδες A4';
 }catch(e){$('status').textContent=e?.message||'Δεν ήταν δυνατή η εξαγωγή PDF.'}
 finally{button.disabled=false}
}
$('downloadPdf').onclick=pdfDownload;
show();
window.MathainoWorksheetPrint=Object.freeze({plan,pdfFromJpegs,gap,scrambled});
})();