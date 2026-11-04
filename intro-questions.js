/* Μαθαίνω! v0.6.71 — grade-aware welcome exercises and non-repeating picture decks.
   Original deterministic question banks, selected randomly without repetition;
   no child names, ages, IDs, questions or answers are stored in the browser. */
(function(){
'use strict';
const wordItems=Object.freeze([
 ['duck','παπί'],['ball','μπάλα'],['apple','μήλο'],['cat','γάτα'],
 ['house','σπίτι'],['fish','ψάρι'],['water','νερό'],['sun','ήλιος'],
 ['dog','σκύλος'],['bird','πουλί'],['book','βιβλίο'],['tree','δέντρο'],
 ['bread','ψωμί'],['milk','γάλα'],['hat','καπέλο'],['car','αμάξι'],
 ['train','τρένο'],['ship','καράβι'],['flower','λουλούδι'],['banana','μπανάνα'],
 ['school','σχολείο'],['backpack','τσάντα'],['pencil','μολύβι'],['door','πόρτα'],
 ['clock','ρολόι'],['icecream','παγωτό'],['moon','φεγγάρι'],['umbrella','ομπρέλα'],
 ['battery','μπαταρία'],['city','πόλη'],['palace','παλάτι']
].map(([icon,word])=>Object.freeze({q:word,a:word,icon})));
const difficultPictures=new Set(['battery','city','palace','clock']);
const gradeLetters=['Α','Β','Γ','Δ','Ε','ΣΤ'];
function levelOf(profile){
 const g=String(profile?.grade||'').trim().toLocaleUpperCase('el-GR');
 const index=gradeLetters.findIndex(x=>g.startsWith(x+(x==='ΣΤ'?'':'΄'))||g.startsWith(x+' '));
 if(index>=0)return index+1;
 if(g.startsWith('ΣΤ'))return 6;
 const age=Number(profile?.age);
 return Number.isFinite(age)&&age>=6?Math.max(1,Math.min(6,Math.round(age-5))):2;
}
const shuffle=items=>{
 const result=items.slice();
 for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]]}
 return result
};
const allBanks=new Map();
function questionsFor(level){
 if(allBanks.has(level))return allBanks.get(level);
 const questions=[],seen=new Set();
 function put(op,a,b){
  const id=level+':'+op+':'+a+':'+b;
  if(seen.has(id))return;
  seen.add(id);
  const result=op==='+'?a+b:op==='−'?a-b:op==='×'?a*b:a/b;
  if(!Number.isInteger(result)||result<0)return;
  const q='Πόσο κάνει '+a+' '+op+' '+b+';';
  questions.push(Object.freeze({id,q,a:String(result)}))
 }
 if(level===1){
  for(let a=1;a<=8;a++)for(let b=1;b<=8;b++)if(a+b<=10)put('+',a,b);
  for(let a=4;a<=10;a++)for(let b=1;b<a;b++)if(a-b<=8)put('−',a,b)
 }else if(level===2){
  for(let a=4;a<=19;a++)for(let b=2;b<=11;b++)if(a+b<=30&&(a+b)%3!==0)put('+',a,b);
  for(let a=11;a<=30;a++)for(let b=2;b<=12;b++)if(a-b>=2&&(a+b)%5===0)put('−',a,b)
 }else if(level===3){
  for(let a=2;a<=9;a++)for(let b=2;b<=10;b++)put('×',a,b);
  for(let a=2;a<=8;a++)for(let b=2;b<=9;b++)put('÷',a*b,a);
  for(let a=25;a<=80;a+=5)for(let b=6;b<=18;b+=3)put('+',a,b)
 }else if(level===4){
  for(let a=4;a<=12;a++)for(let b=3;b<=12;b++)put('×',a,b);
  for(let a=4;a<=12;a++)for(let b=3;b<=12;b++)put('÷',a*b,a);
  for(let a=25;a<=85;a+=10)for(let b=14;b<=45;b+=7)put('+',a,b)
 }else if(level===5){
  for(let a=12;a<=29;a++)for(let b=2;b<=8;b++)put('×',a,b);
  for(let a=5;a<=14;a++)for(let b=3;b<=12;b++)put('÷',a*b,a);
  for(let a=105;a<=180;a+=15)for(let b=30;b<=90;b+=15)put('−',a,b)
 }else{
  for(let a=18;a<=48;a+=2)for(let b=4;b<=12;b++)put('×',a,b);
  for(let a=7;a<=20;a++)for(let b=4;b<=16;b++)put('÷',a*b,a);
  for(let a=250;a<=700;a+=50)for(let b=35;b<=195;b+=20)put('−',a,b)
 }
 const result=Object.freeze(questions);
 allBanks.set(level,result);
 return result
}
function numericOptions(answer){
 const a=Number(answer);
 const candidates=[a+1,a-1,a+2,a-2,a+3,a-3,a+5,a-5,a+10,a-10,a+11,a-11,a+20,a-20,a*2,Math.floor(a/2)];
 const unique=[a];
 for(const x of candidates)if(Number.isInteger(x)&&x>=0&&!unique.includes(x)&&unique.length<4)unique.push(x);
 if(unique.length<4)throw Error('Not enough unique answers');
 return shuffle(unique.map(String))
}
const prefix='mathaino-intro-v3-slot-';
try{
 // Legacy keys included an identifiable child's name in their name. Erase them.
 for(const key of Object.keys(localStorage))if(key.startsWith('mathaino-intro-20-v1:'))localStorage.removeItem(key);
}catch(e){}
const transient=new Map();
function readState(index,level){
 const key=prefix+Math.max(0,Number(index)||0);
 let state=transient.get(key);
 if(!state){
  try{state=JSON.parse(localStorage.getItem(key)||'null')}catch(e){}
 }
 if(!state||state.level!==level||!Array.isArray(state.math)||!Array.isArray(state.picture))state={level,math:[],picture:[],lastMath:'',lastPicture:''};
 return {key,state}
}
function saveState(key,state){
 transient.set(key,state);
 try{localStorage.setItem(key,JSON.stringify(state))}catch(e){}
}
function take(profile,index,kind,bank){
 const level=levelOf(profile);
 const {key,state}=readState(index,level);
 const ids=bank.map(x=>kind==='math'?x.id:x.icon);
 const valid=new Set(ids);
 let deck=state[kind].filter(id=>valid.has(id));
 if(!deck.length){
  deck=shuffle(ids);
  const last=state[kind==='math'?'lastMath':'lastPicture'];
  if(deck.length>1&&deck[deck.length-1]===last){
   const i=deck.length-1;
   [deck[i],deck[0]]=[deck[0],deck[i]]
  }
 }
 const selected=deck.pop();
 state[kind]=deck;
 state[kind==='math'?'lastMath':'lastPicture']=selected;
 saveState(key,state);
 return bank.find(x=>(kind==='math'?x.id:x.icon)===selected)
}
function nextQuestion(profile,index){
 const item=take(profile,index,'math',questionsFor(levelOf(profile)));
 return {...item,options:numericOptions(item.a)}
}
function picturesFor(profile){
 const level=levelOf(profile);
 const available=wordItems.filter(item=>level>2||!difficultPictures.has(item.icon));
 const verified=available.filter(item=>window.MathainoIllustrations?.wordIds?.includes(item.icon));
 return verified.length>=15?verified:available
}
function nextPicture(profile,index){return take(profile,index,'picture',picturesFor(profile))}
window.MathainoIntro=Object.freeze({
 wordItems,levelOf,questionsFor,nextQuestion,picturesFor,nextPicture
});
})();