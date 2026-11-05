'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8');
const basic=['lessons-grade-b.js','lessons-grade-d.js','lessons-grade-e.js','lessons-grade-d-e-expanded.js','lessons-grade-g.js'];
const win={};
for(const name of basic)vm.runInNewContext(read(name),{window:win});
const lessons=win.MathainoLessonData;
const addition=win.MathainoExtendedSubjects;
const html=read('index.html'),sw=read('sw.js'),catalog=read('curriculum-lessons.js');
const main=read('app-main.js'),ui=read('extra-subjects.js'),css=read('extra-subjects.css');
function test(name,fn){try{fn();console.log('PASS',name)}catch(e){console.error('FAIL',name,e.message);process.exitCode=1}}
test('12 new lessons, 6 per grade, 2 in each of six subject groups',()=>{
 assert.equal(addition.count,12);assert.equal(lessons.length,44);
 const added=lessons.filter(l=>addition.ids.includes(l.id));
 assert.equal(added.length,12);
 for(const grade of ['Δ΄','Ε΄'])assert.equal(added.filter(l=>l.grade===grade).length,6);
 for(const s of ['history','science4','geo4','history5','science5','geo5'])
  assert.equal(added.filter(l=>l.subject===s).length,2,s);
 assert.equal(new Set(lessons.map(l=>l.id)).size,lessons.length);
});
test('each new lesson has sources, study pages, 9 original exercises and distinct choices',()=>{
 for(const id of addition.ids){
  const l=lessons.find(x=>x.id===id);
  assert.ok(l&&l.title&&l.unit&&l.objectives.length>=3,id);
  assert.ok(l.source.startsWith('https://')&&l.source.includes('ebooks.edu.gr'),id);
  assert.ok(l.pages.length>=3,id);
  assert.ok(l.pages.every(p=>p[0].length>5&&p[1].length>65),id);
  assert.ok(l.quiz.length>=4&&l.practice.length>=3&&l.review.length>=2,id);
  const questions=l.quiz.concat(l.practice,l.review);
  assert.equal(new Set(questions.map(q=>q[0])).size,questions.length,id);
  for(const [question,answers,correct,why] of questions){
   assert.ok(question.length>=20,id+': '+question);
   assert.equal(answers.length,3,id+': '+question);
   assert.equal(new Set(answers).size,3,id+': '+question);
   assert.equal(correct,0,id+': '+question);
   assert.ok(why.length>=25,id+': '+question);
  }
 }
 assert.equal(lessons.filter(l=>addition.ids.includes(l.id)).reduce((n,l)=>n+l.quiz.length+l.practice.length+l.review.length,0),108);
});
test('new grades match actual Greek primary subject layout',()=>{
 for(const id of addition.ids){
  const l=lessons.find(x=>x.id===id);
  if(l.grade==='Δ΄'&&['science4','geo4'].includes(l.subject))assert.ok(l.unit.includes('Μελέτη Περιβάλλοντος'));
  if(l.grade==='Ε΄'&&l.subject==='geo5')assert.ok(l.unit.includes('Γεωγραφία'));
 }
});
test('new home subject tiles and parent settings are accessible',()=>{
 for(const pair of [['science4','allowScience4'],['geo4','allowGeo4'],['geo5','allowGeo5']]){
  assert.ok(html.includes('id="'+pair[1]+'"'),pair[1]);
  assert.ok(main.includes("['"+pair[1]+"','"+pair[0]+"']"),pair[0]+' saved');
  assert.ok(ui.includes("code:'"+pair[0]+"'"),pair[0]+' visible');
 }
 assert.ok(ui.includes("p.newCurriculumSubjectsConfigured&&!allowed.includes(g.code)"));
 assert.ok(ui.includes("const oldEditor=loadEditor;"));
 assert.ok(css.includes('#allowScience4Row[hidden]'));
 assert.ok(main.includes('newCurriculumSubjectsConfigured:!!c.settings?.newCurriculumSubjectsConfigured'));
 assert.ok(main.includes('newCurriculumSubjectsConfigured:!!p.newCurriculumSubjectsConfigured'));
 assert.ok(main.includes('p.newCurriculumSubjectsConfigured=true'));
 assert.ok(catalog.includes("if(['science4','geo4','geo5'].includes(l.subject))return !p.newCurriculumSubjectsConfigured;"));
 assert.ok(catalog.includes("if(!lesson||!permitted(lesson))return"));
});
test('catalog has dynamic count and subject-specific modes',()=>{
 assert.ok(catalog.includes("library.length+' μαθήματα'"));
 assert.ok(catalog.includes("function open(id,initialMode='study')"));
 assert.ok(ui.includes("library.open(id,mode)"));
 assert.ok(ui.includes("const oldStudy=$x('study').onclick,oldPractice=$x('practice').onclick"));
});
test('asset ordering and offline cache are versioned',()=>{
 assert.ok(html.includes('v0.6.78'));assert.ok(sw.includes('mathaino-v0.6.78'));
 for(const path of ['lessons-grade-d-e-expanded.js','extra-subjects.js','extra-subjects.css']){
  assert.ok(html.includes('./'+path+'?v=677'),path+' missing from HTML');
  assert.ok(sw.includes("'./"+path+"?v=677'"),path+' missing from offline cache');
 }
 assert.ok(html.indexOf('lessons-grade-d-e-expanded.js?v=677')<html.indexOf('lessons-writing.js?v=666'));
 assert.ok(html.indexOf('lessons-grade-d-e-expanded.js?v=677')<html.indexOf('curriculum-lessons.js?v=667'));
 assert.ok(html.indexOf('extra-subjects.js?v=677')>html.indexOf('coding-lesson.js?v=676'));
});
test('new content and UI scripts parse',()=>{
 new Function(read('lessons-grade-d-e-expanded.js'));
 new Function(ui);
 new Function(catalog);
 new Function(main);
});
if(process.exitCode)process.exit(process.exitCode);
