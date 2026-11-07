import test from "node:test";
import assert from "node:assert/strict";
import {createScopedPgReviewStore} from "../src/report-pg-review-store.js";
import {createReportReviewWorkflow} from "../src/report-publication-controls.js";
const principal={subjectId:"A-MAKER",issuer:"https://oidc.example.test",verified:true};
function fixture({scopeActor="A-MAKER",scopeBank="BANK-A",error=false}={}){
 const queries=[];let releases=0;
 const session={
  async query(sql,args=[]){
   queries.push({sql,args});
   if(error)throw Error("secret host/credential");
   if(sql.includes("session_scope"))return {rows:[{institution_id:scopeBank,actor_id:scopeActor}]};
   if(sql.includes("read_review"))return {rows:[{
    report_id:"RPT-LED-001",institution_id:"BANK-A",maker_id:"A-MAKER",
    checker_id:null,content_digest:"sha256-SYNTHETIC-A-001",
    version:"0",state:"DRAFT"
   }]};
   if(sql.includes("advance_review"))return {rows:[{accepted:true}]};
   throw Error("UNEXPECTED_SQL");
  },
  async release(){releases++;}
 };
 const store=createScopedPgReviewStore({acquireTrustedSession:async()=>session});
 return {store,queries,get releases(){return releases;}};
}
test("Read scoped draft via parameterized stored function, never direct DML",async()=>{
 const f=fixture();
 const out=await f.store.loadDraft("RPT-LED-001",{principal});
 assert.equal(out.institutionId,"BANK-A");
 assert.equal(out.makerId,"A-MAKER");
 assert.equal(f.queries.length,2);
 assert.match(f.queries[1].sql,/read_review\(\$1\)/);
 assert.deepEqual(f.queries[1].args,["RPT-LED-001"]);
 assert.equal(f.releases,1);
});
test("Maker-checker workflow passes verified actor through to bank-bound SQL session",async()=>{
 const f=fixture();
 const workflow=createReportReviewWorkflow({
  authenticate:async()=>principal,
  authorize:async()=>({allowed:true,institutionId:"BANK-A",subjectId:"A-MAKER"}),
  store:f.store
 });
 const output=await workflow.submit("RPT-LED-001",{});
 assert.equal(output.status,"PENDING_REVIEW");
 assert.equal(output.published,false);
 assert.equal(f.releases,2);
 const call=f.queries.find(q=>q.sql.includes("advance_review"));
 assert.deepEqual(call.args,["RPT-LED-001",0,"DRAFT","sha256-SYNTHETIC-A-001"]);
});
test("Wrong authenticated DB login cannot impersonate principal",async()=>{
 const f=fixture({scopeActor:"B-MAKER"});
 await assert.rejects(f.store.loadDraft("RPT-LED-001",{principal}),
  /DATABASE_IDENTITY_SCOPE_MISMATCH/);
 assert.equal(f.queries.length,1);
 assert.equal(f.releases,1);
});
test("Cross-bank database session cannot return other bank draft",async()=>{
 const f=fixture({scopeBank:"BANK-B"});
 await assert.rejects(f.store.loadDraft("RPT-LED-001",{principal}),
  /DATABASE_RESPONSE_SCOPE_MISMATCH/);
});
test("Unverified caller and database failures deny and release session",async()=>{
 const f=fixture({error:true});
 await assert.rejects(f.store.loadDraft("RPT-LED-001",{principal}),
  /SCOPED_DATABASE_OPERATION_FAILED/);
 assert.equal(f.releases,1);
 await assert.rejects(f.store.loadDraft("RPT-LED-001",{
  principal:{...principal,verified:false}
 }),/VERIFIED_PRINCIPAL_REQUIRED/);
 assert.equal(f.releases,1);
});
test("Review transition with forged actor, scope or bad version never reaches SQL",async()=>{
 const f=fixture();
 for(const change of [{actorId:"FAKE-USER"},{expectedVersion:-1},{institutionId:"BANK-B"}]){
  const command={reportId:"RPT-LED-001",institutionId:"BANK-A",
   actorId:"A-MAKER",principal,expectedVersion:0,expectedState:"DRAFT",
   contentDigest:"sha256-SYNTHETIC-A-001",...change};
  if(change.institutionId==="BANK-B"){
   await assert.rejects(f.store.transitionWithAudit(command),/DATABASE_IDENTITY_SCOPE_MISMATCH/);
  }else{
   await assert.rejects(f.store.transitionWithAudit(command),/INVALID_REVIEW_COMMAND/);
  }
 }
 assert.ok(f.queries.every(q=>!q.sql.includes("advance_review")));
});
