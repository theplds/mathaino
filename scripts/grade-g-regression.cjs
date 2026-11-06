'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const read=file=>fs.readFileSync(file,'utf8');
const root={};
for(const file of ['lessons-grade-b.js','lessons-grade-d.js','lessons-grade-e.js','lessons-grade-d-e-expanded.js','lessons-grade-g.js'])vm.runInNewContext(read(file),{window:root});
const books=root.MathainoLessonData,ids=root.MathainoGrade3Lessons.ids;
const app=read('app-main.js'),catalog=read('curriculum-lessons.js'),ui=read('grade-g-subjects.js');
const html=read('index.html'),sw=read('sw.js'),css=read('grade-g-subjects.css');
function test(name,fn){try{fn();console.log('PASS',name)}catch(err){console.error('FAIL',name,err.message);process.exitCode=1}}
test('4 original lessons for each of three Grade Γ subjects and unique IDs',()=>{
 assert.equal(root.MathainoGrade3Lessons.count,12);
 assert.equal(books.length,44);
 assert.equal(new Set(books.map(x=>x.id)).size,books.length);
 for(const subject of ['language3','history3','math3']){
  const group=books.filter(x=>x.grade==='Γ΄'&&x.subject===subject);
  assert.equal(group.length,4,subject);
  assert.equal(group.filter(x=>ids.includes(x.id)).length,4,subject);
 }
});
test('grade Γ lesson payloads complete and sources verified',()=>{
 const sources={
  language3:'DSDIM-C105',
  history3:'Istoria_G-Dimotikou_html-empl',
  math3:'Mathimatika_G-Dimotikou_html-empl'
 };
 for(const id of ids){
  const l=books.find(x=>x.id===id);
  assert.ok(l,id);
  assert.equal(l.grade,'Γ΄');
  assert.ok(l.source.startsWith('https://')&&l.source.includes(sources[l.subject]));
  assert.equal(l.objectives.length,3,id);
  assert.equal(l.pages.length,3,id);
  for(const [title,body] of l.pages){
   assert.ok(title.length>5&&body.length>65,id+' study too short');
  }
  assert.equal(l.quiz.length,4,id);
  assert.equal(l.practice.length,3,id);
  assert.equal(l.review.length,2,id);
  const questions=l.quiz.concat(l.practice,l.review);
  assert.equal(new Set(questions.map(q=>q[0])).size,questions.length,id+' repeated question');
  for(const [title,options,correct,feedback] of questions){
   assert.ok(title.length>=19,id+': '+title);
   assert.equal(options.length,3,id+': '+title);
   assert.equal(new Set(options).size,3,id+': '+title);
   assert.equal(correct,0,id+': '+title);
   assert.ok(feedback.length>18,id+': '+title);
  }
 }
});
test('no confusion between myth and historical evidence',()=>{
 for(const id of ['g-history-titans','g-history-olympus','g-history-heracles']){
  const l=books.find(x=>x.id===id);
  assert.ok(l.pages.some(p=>/μύθ|μυθολογ|Μύθ/.test(p[1])));
 }
 const early=books.find(x=>x.id==='g-history-stoneage');
 assert.ok(early.pages.some(p=>p[1].includes('αρχαιολογία')));
});
test('third-grade parental access is grade-specific, with explicit opt-outs',()=>{
 const from=ui.indexOf('function isGrade3('),to=ui.indexOf('function art(');
 assert.ok(from>=0&&to>from);
 const obj={};
 vm.runInNewContext(ui.slice(from,to)+';this.canAccess=canAccess;',obj);
 const allowed=obj.canAccess;
 assert.equal(allowed({grade:'Γ΄ Δημοτικού',allowed:[],grade3SubjectsConfigured:false},'history3'),true);
 assert.equal(allowed({grade:'Γ΄ Δημοτικού',allowed:['history3'],grade3SubjectsConfigured:true},'history3'),true);
 assert.equal(allowed({grade:'Γ΄ Δημοτικού',allowed:['history3'],grade3SubjectsConfigured:true},'math3'),false);
 assert.equal(allowed({grade:'Δ΄ Δημοτικού',allowed:['history3'],grade3SubjectsConfigured:false},'history3'),false);
 assert.equal(allowed(null,'language3'),false);
 assert.ok(catalog.includes("gradeOf(p)==='Γ΄'&&(!p.grade3SubjectsConfigured||allowed.includes(l.subject))"));
});
test('cloud-backed permission keys use existing text[] and settings JSON',()=>{
 for(const [checkbox,subject] of [['allowLanguage3','language3'],['allowHistory3','history3'],['allowMath3','math3']]){
  assert.ok(html.includes('id="'+checkbox+'"'),checkbox);
  assert.ok(app.includes("['"+checkbox+"','"+subject+"']"),subject);
  assert.ok(ui.includes("id:'"+subject+"'"),subject);
 }
 assert.ok(app.includes("p.grade3SubjectsConfigured=!!p.grade3SubjectsConfigured||String(p.grade||'').trim().startsWith('Γ')"));
 assert.ok(app.includes('grade3SubjectsConfigured:!!p.grade3SubjectsConfigured'));
 assert.ok(app.includes('grade3SubjectsConfigured:!!c.settings?.grade3SubjectsConfigured'));
 assert.ok(ui.includes('previousChoose(index)'),'must preserve the child welcome gate');
 assert.ok(ui.includes('priorLoad()'),'parent editor layering');
 assert.ok(ui.includes('priorTopics()'),'old subjects must remain');
});
test('Γ΄ available in lesson library, 44 count dynamic, and dedicated lesson navigation',()=>{
 assert.ok(catalog.includes("['Β΄','Γ΄','Δ΄','Ε΄']"));
 assert.ok(catalog.includes("['Γ΄','Γ΄ Δημοτικού']"));
 assert.ok(catalog.includes("library.length+' μαθήματα'"));
 for(const sub of ['language3','history3','math3'])assert.ok(catalog.includes(sub));
 assert.ok(ui.includes("library.open(id,mode)"));
 assert.ok(ui.includes("if(!l||!keys.has(l.subject)||!canAccess(p,l.subject))return"));
});
test('Greek lesson assets bundled offline, subject cards responsive, source loaded before library',()=>{
 assert.ok(html.includes('v0.6.79'));
 assert.ok(sw.includes('mathaino-v0.6.79'));
 for(const path of ['lessons-grade-g.js','grade-g-subjects.js','grade-g-subjects.css']){
  assert.ok(html.includes('./'+path+'?v=678'),path+' missing HTML');
  assert.ok(sw.includes("'./"+path+"?v=678'"),path+' missing SW');
 }
 assert.ok(html.indexOf('lessons-grade-g.js?v=678')<html.indexOf('curriculum-lessons.js?v=678'));
 assert.ok(html.indexOf('grade-g-subjects.js?v=678')>html.indexOf('extra-subjects.js?v=677'));
 for(const id of ['allowLanguage3Row','allowHistory3Row','allowMath3Row']){
  assert.ok(css.includes('#'+id+'[hidden]'));
 }
 assert.ok(css.includes('html[data-theme="dark"]'));
});
test('all new scripts valid JavaScript',()=>{
 new Function(read('lessons-grade-g.js'));
 new Function(ui);
 new Function(catalog);
 new Function(app);
});
if(process.exitCode)process.exit(process.exitCode);
