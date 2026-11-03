/* Μαθαίνω! v0.6.48: optional device-local 25% workbook design setting.
   No Supabase access, no account state changes, no changes to lesson engines. */
(function(){
'use strict';
const switchInput=document.getElementById('workbookSwitch');
if(!switchInput)return;
const key='mathaino-workbook-25';
let enabled=true;
try{enabled=localStorage.getItem(key)!=='off'}catch(e){}
function apply(on){
  document.documentElement.setAttribute('data-workbook',on?'on':'off');
  switchInput.checked=on;
  switchInput.setAttribute('aria-checked',String(on));
}
apply(enabled);
switchInput.addEventListener('change',function(){
  apply(switchInput.checked);
  try{localStorage.setItem(key,switchInput.checked?'on':'off')}catch(e){}
});
window.MathainoWorkbookDesign=Object.freeze({version:'25-percent',key:key});
})();