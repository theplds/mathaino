/* Μαθαίνω! Google OAuth regression; synthetic tests, no login secrets. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const google=fs.readFileSync('google-auth.js','utf8');
const home=fs.readFileSync('index.html','utf8');
const main=fs.readFileSync('app-main.js','utf8');
const cache=fs.readFileSync('sw.js','utf8');
function fakeButton(){
 return {disabled:true,attrs:{},handlers:{},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,cb){this.handlers[k]=cb}}
}
async function scenario(settings,cancel=false){
 const button=fakeButton(),hint={textContent:''},status={textContent:''};
 const nodes={googleSignIn:button,googleAuthHint:hint,authStatus:status};
 const document={getElementById:k=>nodes[k]};
 const records=[];
 const auth={async signInWithOAuth(config){records.push(config);return cancel?{error:Error('test OAuth failure')}:{data:{url:'https://example.invalid'}}}};
 const fetch=async (url,options)=>({ok:true,json:async()=>settings,status:200});
 const win={};
 vm.runInNewContext(google,{window:win,document,fetch,
 location:{search:'',hash:'',pathname:'/mathaino/'},history:{replaceState(){}},
 URLSearchParams,Error,Promise,Boolean,String});
 const enabled=await win.MathainoGoogleSignIn.init({auth});
 assert.equal(button.disabled,!enabled,'button matches enabled provider status');
 assert.equal(button.attrs['aria-disabled'],String(!enabled));
 await win.MathainoGoogleSignIn.start();
 assert.equal(records.length,enabled?1:0,'disabled provider cannot redirect');
 if(enabled){assert.equal(records[0].provider,'google');assert.equal(records[0].options.redirectTo,'https://theplds.github.io/mathaino/');assert.equal(records[0].options.scopes,undefined,'no extra Google scopes requested');}
 return {enabled,error:status.textContent,button,hint:hint.textContent}
}
(async()=>{
 const missing=await scenario({external:{google:false}});
 assert.equal(missing.enabled,false);
 const active=await scenario({external:{google:true}});
 assert.equal(active.enabled,true);
 const cancelled=await scenario({external:{google:true}},true);
 assert.ok(cancelled.error.includes('test OAuth failure'));
 assert.ok(home.includes('id="googleSignIn"')&&home.includes('id="accountSetup"'));
 assert.ok(home.includes('id="createFamily"')&&home.includes('id="setupSwitchAccount"'));
 assert.ok(home.indexOf('google-auth.js?v=672')<home.indexOf('app-main.js?v=672'));
 assert.ok(cache.includes("mathaino-v0.6.73")&&cache.includes("'./google-auth.js?v=672'")&&cache.includes("'./google-auth.css?v=672'"));
 assert.ok(cache.includes("url.origin===self.location.origin&&ASSET_PATHS.has(url.pathname)"));
 assert.ok(main.includes("if(!allowCreate)return false"),'must not auto-create a second family after Google sign-in');
 assert.ok(main.includes("const success=await initializeFamily(true)"),'new household requires explicit button');
 assert.ok(main.includes("else if(event==='SIGNED_IN'&&session&&!recoveryActive)"),'OAuth callback must initialize session');
 assert.ok(main.includes("setTimeout(()=>sessionChanged(session),0"),'avoid awaiting auth in callback');
 assert.ok(main.includes("signInWithPassword"),'retain password login');
 assert.ok(!google.includes('service_role')&&!google.includes('sb_secret_'));
 console.log('Google OAuth regression PASS — provider gating, redirect, no extra scopes, family continuity and cache');
})().catch(e=>{console.error(e);process.exitCode=1});
