/* Μαθαίνω! v0.6.61 • local worksheet export bridge.
   Lesson questions stay on this device. No third-party service or upload. */
(function(){
'use strict';
const key='mathaino-print-payload-v1';
function open(payload){
 if(!payload||!['spelling','quiz'].includes(payload.kind))return false;
 const raw=JSON.stringify(payload);
 if(raw.length>140000)throw new Error('Το μάθημα είναι πολύ μεγάλο για εκτύπωση.');
 try{localStorage.setItem(key,raw)}
 catch(e){alert('Δεν είναι δυνατή η προετοιμασία εκτύπωσης στη συσκευή.');return false}
 const url=new URL('./worksheet-print.html?v=661',window.location.href).href;
 // Called inside a click handler, so mobile browsers normally allow a new tab.
 const child=window.open(url,'_blank');
 if(!child)window.location.assign(url);
 return true
}
window.MathainoWorksheet=Object.freeze({open,storageKey:key});
})();