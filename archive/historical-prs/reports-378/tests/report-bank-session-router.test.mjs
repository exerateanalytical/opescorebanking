import test from "node:test";
import assert from "node:assert/strict";
import {createBankScopedSessionRouter}
  from "../src/report-bank-session-router.js";
process.env.NODE_ENV="test";
const issuer="https://login.bank.invalid/realm/reporting",identity={
 subjectId:"ACTOR-A",issuer
};
function setup(change={},options={}){
 const calls=[];let released=0;
 const binding={active:true,issuer,subjectId:"ACTOR-A",actorId:"ACTOR-A",
   institutionId:"BANK-A",databaseRole:"opes_rpt_a_maker_lab",
   version:1,validUntil:2000000000000};
 const secret={institutionId:"BANK-A",role:"opes_rpt_a_maker_lab",
   host:"127.0.0.1",port:5432,database:"opes_test",
   ssl:false,password:"test-only-secret"};
 const deps={
   issuer,now:()=>1900000000000,allowDisposableLab:true,
   lookupBinding:async()=>({...binding,...change}),
   loadSecret:async()=>({...secret,...options}),
   connect:async config=>{
     calls.push(["connect",config.user,config.database]);
     return {query:async(sql,params=[])=>{
       calls.push(["query",sql,params]);
       if(sql.includes("session_user"))
         return {rows:[{login_role:config.user}]};
       return {rows:[]};
     },release:async()=>{released++}};
   }
 };
 return {router:createBankScopedSessionRouter(deps),calls,
   get released(){return released;}};
}
test("Trusted role binding, test-only dedicated login and limited SQL",async()=>{
 const f=setup();
 const s=await f.router(identity);
 assert.deepEqual(f.calls[0],["connect","opes_rpt_a_maker_lab","opes_test"]);
 assert.ok(s);
 await s.query("SELECT institution_id,actor_id FROM opes_rpt_review_lab.session_scope()");
 await assert.rejects(s.query("SELECT * FROM opes_rpt_review_lab.review_record"),
  /UNAPPROVED_DATABASE_QUERY/);
 await assert.rejects(s.query("SET ROLE postgres"),/UNAPPROVED_DATABASE_QUERY/);
 await s.release();await s.release();
 assert.equal(f.released,1);
 await assert.rejects(s.query("SELECT institution_id,actor_id FROM opes_rpt_review_lab.session_scope()"),
  /SESSION_ALREADY_RELEASED/);
});
test("No user-selected bank or institution; binding and expiry are mandatory",async()=>{
 for(const change of [{active:false},{institutionId:""},{actorId:"ACTOR-B"},
   {version:0},{validUntil:0},{databaseRole:"postgres;DROP"}]){
   const f=setup(change);
   await assert.rejects(f.router(identity));
   assert.equal(f.calls.length,0);
 }
 await assert.rejects(setup().router({...identity,issuer:"https://forged.invalid"}));
});
test("Role/secret mismatch and nonlab addresses never open a connection",async()=>{
 for(const opts of [{role:"opes_rpt_b_maker_lab"},{host:"example.invalid"},
 {database:"bank_live"},{ssl:true},{password:""}]){
   const f=setup({},opts);
   await assert.rejects(f.router(identity));
   assert.equal(f.calls.length,0);
 }
});
test("Database authenticates wrong role => abort and close",async()=>{
 let releases=0;
 const f=setup();
 const router=createBankScopedSessionRouter({
   issuer,now:()=>1900000000000,allowDisposableLab:true,
   lookupBinding:async()=>({active:true,issuer,subjectId:"ACTOR-A",
     actorId:"ACTOR-A",institutionId:"BANK-A",
     databaseRole:"opes_rpt_a_maker_lab",version:1,validUntil:2000000000000}),
   loadSecret:async()=>({institutionId:"BANK-A",role:"opes_rpt_a_maker_lab",
     host:"127.0.0.1",port:5432,database:"opes_test",password:"TEST",ssl:false}),
   connect:async()=>({query:async()=>({rows:[{login_role:"postgres"}]}),
     release:async()=>{releases++}})
 });
 await assert.rejects(router(identity),/DATABASE_LOGIN_MISMATCH/);
 assert.equal(releases,1);
});
test("Revocation during connect prevents returning a usable session",async()=>{
 let count=0,releases=0;
 const b={active:true,issuer,subjectId:"ACTOR-A",actorId:"ACTOR-A",
   institutionId:"BANK-A",databaseRole:"opes_rpt_a_maker_lab",version:1,validUntil:2000000000000};
 const router=createBankScopedSessionRouter({
   issuer,allowDisposableLab:true,now:()=>1900000000000,
   lookupBinding:async()=>({...b,active:++count===1}),
   loadSecret:async()=>({institutionId:"BANK-A",role:b.databaseRole,
    password:"T",host:"localhost",port:5432,database:"opes_test",ssl:false}),
   connect:async()=>({query:async()=>({rows:[{login_role:b.databaseRole}]}),
     release:async()=>{releases++}})
 });
 await assert.rejects(router(identity),/BINDING_REVOKED_DURING_CONNECT/);
 assert.equal(releases,1);
});
test("Insecure lab connector rejected outside NODE_ENV=test",()=>{
 const was=process.env.NODE_ENV;process.env.NODE_ENV='production';
 try{assert.throws(()=>createBankScopedSessionRouter({
   issuer,lookupBinding:async()=>null,loadSecret:async()=>null,
   connect:async()=>null,allowDisposableLab:true
 }),/INSECURE_LAB_NOT_ALLOWED/);}finally{
 if(was===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=was;
 }
});
