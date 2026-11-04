'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const content=fs.readFileSync('spelling-a1.js','utf8');
// Execute the real normalization and accent helper from the shipped lesson engine.
const from=content.indexOf('const normalize='),to=content.indexOf('const variants=',from);
assert.ok(from>=0&&to>from,'accent helper must be present');
const sandbox={};
vm.runInNewContext(content.slice(from,to)+';this.grade=accentStatus;',sandbox);
const grade=sandbox.grade;
function expect(answer,target,expected){
 assert.equal(grade(answer,target),expected,JSON.stringify({answer,target,expected}));
}
expect('καράβι','καράβι','correct');
expect('καραβι','καράβι','missing');
expect('κάραβι','καράβι','misplaced');
expect('καράβει','καράβι','letters');
expect('ΚΑΡΑΒΙ','καράβι','missing');
expect('παπί','παπί','correct');
expect('παπι','παπί','missing');
expect('πάπι','παπί','misplaced');
expect('μαϊστρος','μαΐστρος','missing');
expect('μαιστρος','μαΐστρος','letters'); // diaeresis must never disappear
expect('ΜΑΪΣΤΡΟΣ','μαΐστρος','missing');
assert.ok(content.includes("const good=accent==='correct'||accent==='missing'"),'only valid/missing tones pass');
assert.ok(content.includes("accent==='misplaced'"),'wrong accent has targeted feedback');
assert.ok(content.includes("'Σωστά τα γράμματα! Πρόσεξε τον τόνο"),'missing accent gets gentle teaching');
assert.ok(content.includes("'Τα γράμματα είναι σωστά! Ο τόνος όμως"),'misplaced accent prompts retry');
const sw=fs.readFileSync('sw.js','utf8'),html=fs.readFileSync('index.html','utf8');
assert.ok(sw.includes('mathaino-v0.6.77')&&sw.includes("'./spelling-a1.js?v=675'"),'offline cached lesson updated');
assert.ok(html.includes('spelling-a1.js?v=675')&&html.includes('v0.6.77'),'new lesson and version referenced');
console.log('PASS accent omitted, correctly placed, misplaced, other spelling, Greek capitals, diaeresis; teaching feedback and offline release');
