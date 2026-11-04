/* Μαθαίνω! Google sign-in UI, without any Google secrets or calendar scopes.
   Only enable the button when Supabase confirms the provider is configured. */
(function(){
'use strict';
const endpoint='https://yijpejuacjmucarqntlf.supabase.co';
const publishableKey='sb_publishable_ONNT2HmZBkTVQVREZ-1IXA_V82D5-AI';
const redirect='https://theplds.github.io/mathaino/';
const button=document.getElementById('googleSignIn');
const message=document.getElementById('googleAuthHint');
if(!button||!message)return;
let enabled=false,busy=false,authClient=null;
function inform(text){message.textContent=text}
function setAvailability(value){
 enabled=Boolean(value);
 button.disabled=!enabled||busy;
 button.setAttribute('aria-disabled',String(button.disabled));
}
function callbackError(){
 const query=new URLSearchParams(location.search),fragment=new URLSearchParams(location.hash.replace(/^#/,''));
 const error=query.get('error')||fragment.get('error');
 if(!error)return;
 const status=document.getElementById('authStatus');
 if(status)status.textContent=error==='access_denied'?
  'Η σύνδεση Google ακυρώθηκε. Μπορείς να δοκιμάσεις ξανά.':
  'Η σύνδεση Google δεν ολοκληρώθηκε. Δοκίμασε ξανά ή χρησιμοποίησε email.';
 // Do not retain OAuth error details or tokens in navigable URLs.
 try{history.replaceState(null,'',location.pathname)}catch(e){}
}
async function refresh(){
 setAvailability(false);
 inform('Έλεγχος σύνδεσης Google…');
 if(!authClient){inform('Η υπηρεσία σύνδεσης δεν είναι διαθέσιμη.');return false}
 try{
  const response=await fetch(endpoint+'/auth/v1/settings',{
   method:'GET',headers:{apikey:publishableKey},cache:'no-store',credentials:'omit'
  });
  if(!response.ok)throw Error('Provider settings unavailable');
  const settings=await response.json();
  const ready=settings?.external?.google===true;
  setAvailability(ready);
  inform(ready?'Χρησιμοποίησε το ίδιο Google email με τον υπάρχοντα λογαριασμό σου.':
   'Η σύνδεση Google δεν έχει ενεργοποιηθεί ακόμη στο Μαθαίνω.');
  return ready
 }catch(e){
  setAvailability(false);
  inform('Δεν ήταν δυνατός ο έλεγχος Google. Κάνε ανανέωση ή συνδέσου με email.');
  return false
 }
}
async function start(){
 if(!enabled||busy||!authClient)return false;
 busy=true;
 setAvailability(true);
 inform('Μεταφορά στη Google…');
 const status=document.getElementById('authStatus');
 if(status)status.textContent='';
 try{
  const {error}=await authClient.signInWithOAuth({
   provider:'google',
   options:{redirectTo:redirect}
  });
  if(error)throw error;
  // The browser navigates away on success; do not claim a local login yet.
  return true
 }catch(e){
  inform('Η σύνδεση Google απέτυχε. Μπορείς να δοκιμάσεις ξανά.');
  if(status)status.textContent=e?.message||'Δεν ολοκληρώθηκε η σύνδεση.';
  return false
 }finally{
  busy=false;
  setAvailability(enabled)
 }
}
function init(client){
 authClient=client?.auth||null;
 button.addEventListener('click',start);
 callbackError();
 return refresh()
}
window.MathainoGoogleSignIn=Object.freeze({init,refresh,start,redirect});
})();