/* Security regression checks — run on each PR and main push (Node 20+). */
'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const read=x=>fs.readFileSync(x,'utf8');
const home=read('index.html'),reset=read('reset.html'),
main=read('app-main.js'),sw=read('sw.js'),database=read('security/parent_authorization_v0.6.68.sql');
const sdk='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.10/dist/umd/supabase.min.js';
let n=0;
function check(name,action){try{action();console.log('PASS',name);n++}catch(e){console.error('FAIL',name,e.message);process.exitCode=1}}
for(const [page,body] of [['app',home],['recovery',reset]]){
 check(page+' has CSP',()=>assert.match(body,/http-equiv="Content-Security-Policy"/));
 check(page+' pins external script path in CSP',()=>assert.ok(body.includes("script-src 'self' "+sdk+';')));
 check(page+' only loads pinned CDN script',()=>{
  const remote=[...body.matchAll(/<script\b[^>]*\bsrc="(https:[^"]+)"/g)].map(x=>x[1]);
  assert.deepEqual(remote,[sdk]);
 });
 check(page+' has no inline JS',()=>assert.ok(!/<script(?![^>]*\bsrc=)[^>]*>/.test(body)));
 check(page+' never allows unsafe eval',()=>assert.ok(!body.includes("'unsafe-eval'")));
 check(page+' suppresses referrer',()=>assert.ok(body.includes('name="referrer" content="no-referrer"')));
}
check('only anonymous/generic child defaults',()=>assert.match(main,/const defaults=Array\.from\(\{length:3\}/));
check('no local child profile persistence',()=>assert.ok(!main.includes("localStorage.setItem('mathaino-profiles")));
check('private browser state purged on sign-out',()=>assert.ok(main.includes('purgePrivateBrowserData()')&&main.includes("parent_pin_revoke")));
check('new passwords >=12 characters',()=>assert.ok(main.includes('password.length<12')&&read('reset-main.js').includes('pass.length<12')));
check('cache restricts same-origin public allowlisted URLs',()=>assert.ok(sw.includes("url.origin===self.location.origin&&ASSET_PATHS.has(url.pathname)")));
check('historical app caches purged on upgrade',()=>assert.ok(sw.includes("k.startsWith('mathaino-')&&k!==CACHE")));
check('explicit cache purge on logout',()=>assert.ok(sw.includes('CLEAR_PRIVATE_DATA')));
check('database checks parent privilege in RLS',()=>assert.ok(database.includes('private.parent_access_ok()')&&database.includes('10 minutes')));
check('no service secret in public app bundle',()=>assert.ok(!/sb_secret_|service_role|SUPABASE_SERVICE_ROLE_KEY/.test(main+home+reset)));
for(const path of ['app-main.js','reset-main.js','sw.js','question-dock.js'])check(path+' parses',()=>new Function(read(path)));
if(process.exitCode)throw Error('Security regression checks failed');
console.log('Security checks passed:',n);
