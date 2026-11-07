import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {fileURLToPath} from "node:url";
import path from "node:path";
import {
 createStage3DomainServices,createSyntheticStage3Store,
 createStage3HttpDispatcher,Stage3Denied
} from "../src/domain-services.mjs";
process.env.NODE_ENV="test";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const registry=JSON.parse(readFileSync(path.join(root,"catalog/domains.json"),"utf8"));
const domains=registry.domains;
const A="aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const B="bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const MAKER="11111111-1111-4111-8111-111111111111";
const CHECKER="22222222-2222-4222-8222-222222222222";
const AGG="cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const CORR="33333333-3333-4333-8333-333333333333";
const uuid="44444444-4444-4444-8444-444444444444";
const sample=(type)=>{
 if(type.startsWith("enum:"))return type.slice(5).split(",")[0];
 switch(type){
 case "uuid":return uuid;
 case "text":return "Synthetic description";
 case "date":return "2027-05-06";
 case "dateTime":return "2027-05-06T08:00:00Z";
 case "month":return "2027-05";
 case "minor":return "1000";
 case "int":return 12;
 case "bool":return false;
 case "country":return "CM";
 case "currency":return "XAF";
 case "sha256":return "a".repeat(64);
 case "uri":return "https://example.invalid/callback";
 case "uuidList":return [uuid];
 case "scopeList":return ["banking.read"];
 case "journalLines":return [
  {accountId:uuid,side:"DEBIT",amountMinor:"1000",currency:"XAF"},
  {accountId:"55555555-5555-4555-8555-555555555555",side:"CREDIT",amountMinor:"1000",currency:"XAF"}
 ];
 default:throw Error("Unsupported test type: "+type);
 }
};
function makeFixture(){
 const store=createSyntheticStage3Store();
 const services=createStage3DomainServices({
  catalog:domains,
  authenticate:async req=>({verified:true,subjectId:req?.actorId,issuer:"https://issuer.example.invalid"}),
  authorize:async({principal,permission})=>({allowed:true,subjectId:principal.subjectId,
   bankId:principal.subjectId==="CROSS_BANK"?B:A,permission}),
  store
 });
 return {store,services,dispatcher:createStage3HttpDispatcher({catalog:domains,services})};
}
const args=(stage,body,actorId=MAKER,bankId=A,idem)=>({
 bankId,body,request:{actorId},idempotencyKey:idem||"STAGE3-KEY-"+String(Math.random()).slice(2).padEnd(17,"0"),
 correlationId:CORR
});
function draft(d,aggregateId=AGG){
 return {aggregateId,expectedVersion:0,...Object.fromEntries(d.fields.map(f=>[f.name,sample(f.type)]))};
}
test("25 canonical domains have 75 distinct candidate commands and 25 reads",()=>{
 assert.equal(domains.length,25);
 assert.equal(new Set(domains.map(d=>d.id)).size,25);
 assert.equal(domains.reduce((s,d)=>s+d.actions.length,0),75);
 for(const d of domains){
  assert.equal(d.fields.length>=5,true);
  const path1=path.join(root,"contracts",d.id+".openapi.json");
  const path2=path.join(root,"db",d.id+".sql");
  assert.ok(existsSync(path1)&&existsSync(path2),d.id);
  const api=JSON.parse(readFileSync(path1,"utf8"));
  assert.equal(api.openapi,"3.1.0");
  const posts=Object.values(api.paths).flatMap(v=>Object.values(v))
   .filter(x=>x.requestBody);
  assert.equal(posts.length,3);
  assert.equal(Object.keys(api.paths).length,4);
  for(const [i,op] of posts.entries()){
   const sch=api.components.schemas[["CreateCandidate","SubmitCandidate","ReviewCandidate"][i]];
   assert.equal(sch.additionalProperties,false);
   assert.ok(sch.required.includes("aggregateId"));
   assert.ok(op["x-bank-authority"].includes("SERVER_VERIFIED"));
   assert.ok(!Object.hasOwn(sch.properties,"bankId"));
   assert.ok(!Object.hasOwn(sch.properties,"payload"));
  }
  const sql=readFileSync(path2,"utf8");
  assert.match(sql,/FORCE ROW LEVEL SECURITY/);
  assert.match(sql,/CREATE POLICY/);
  assert.match(sql,/GRANT SELECT/);
  assert.doesNotMatch(sql,/GRANT INSERT|GRANT UPDATE|GRANT DELETE/);
  assert.match(sql,new RegExp("CREATE TABLE opes_stage3\\."+d.id.toLowerCase()+"_candidate"));
 }
});
test("For every domain: create → maker submit → independent check, no operational activation",async()=>{
 const f=makeFixture();
 for(const [i,d] of domains.entries()){
  const service=f.services.get(d.id);
  const aggregateId=AGG.slice(0,34)+(i+1).toString(16).padStart(2,"0");
  const created=await service.create(args(0,draft(d,aggregateId),MAKER,A,
   "CREATE-"+d.id+"-0000000000000001"));
  assert.equal(created.version,1);assert.equal(created.state,"DRAFT");
  const submitted=await service.submit(args(1,{
   aggregateId,expectedVersion:1,[d.submitEvidence]:uuid
  },MAKER,A,"SUBMIT-"+d.id+"-0000000000000001"));
  assert.equal(submitted.version,2);
  assert.equal(submitted.state,"PENDING_REVIEW");
  await assert.rejects(service.review(args(2,{
   aggregateId,expectedVersion:2,[d.reviewEvidence]:uuid,decision:"ACCEPT"
  },MAKER,A,"REVIEW-SELF-"+d.id+"-0000001")),/CHECKER_SEPARATION_DENIED/);
  const reviewed=await service.review(args(2,{
   aggregateId,expectedVersion:2,[d.reviewEvidence]:uuid,decision:"ACCEPT"
  },CHECKER,A,"REVIEW-"+d.id+"-0000000000000001"));
  assert.equal(reviewed.state,"REVIEWED_NOT_EFFECTIVE");
  assert.equal(reviewed.financialEffective,false);
  assert.equal(reviewed.regulatorySubmissionEnabled,false);
  assert.equal((await service.read({
   bankId:A,aggregateId,request:{actorId:MAKER},correlationId:CORR
  })).version,3);
  await assert.rejects(service.read({
   bankId:B,aggregateId,request:{actorId:"CROSS_BANK"},correlationId:CORR
  }),/CANDIDATE_NOT_FOUND/);
 }
 assert.equal(f.store.inspectedEvents().length,75);
 assert.ok(f.store.inspectedEvents().every(e=>!e.financialEffective&&!e.externalPublication));
});
test("Sensitive financial domain operations fail closed on missing fields and immutable posting illusion",async()=>{
 const f=makeFixture();
 for(const d of domains){
  const bad=draft(d);
  bad.bankId=A;
  await assert.rejects(f.services.get(d.id).create(args(0,bad)),
   /INVALID_OR_UNEXPECTED_COMMAND_FIELD/);
  const incomplete=draft(d);delete incomplete[d.fields[0].name];
  await assert.rejects(f.services.get(d.id).create(args(0,incomplete)),
   /INVALID_OR_UNEXPECTED_COMMAND_FIELD/);
 }
 const ledger=domains.find(d=>d.id==="LED");
 const malformed=draft(ledger);
 malformed.journalLines[1].amountMinor="999";
 await assert.rejects(f.services.get("LED").create(args(0,malformed)),
  /UNBALANCED_JOURNAL/);
 const payment=domains.find(d=>d.id==="PAY");
 await assert.rejects(f.services.get("PAY").create(args(0,{
  ...draft(payment),amountMinor:"0"
 })),/PAYMENT_CONTROL_EVIDENCE_REQUIRED/);
});
test("Scoped replay of an identical command is idempotent, changed digest conflicts",async()=>{
 const f=makeFixture(),d=domains[0],request=draft(d);
 const call=args(0,request,MAKER,A,"EXACT-REPLAY-0000000000001");
 const first=await f.services.get(d.id).create(call);
 const again=await f.services.get(d.id).create(call);
 assert.equal(again.version,first.version);
 assert.equal(f.store.inspectedEvents().length,1);
 await assert.rejects(f.services.get(d.id).create({
  ...call,body:{...request,policyCode:"Changed description"}
 }),/IDEMPOTENCY_PAYLOAD_CONFLICT/);
});
test("Unbound store or unauthenticated identity cannot execute",async()=>{
 assert.throws(()=>createStage3DomainServices({catalog:domains,
  authenticate:async()=>null,authorize:async()=>null}),/VERIFIED_IDENTITY_OR_ATOMIC_STORE_UNAVAILABLE/);
 const f=makeFixture(),d=domains[0];
 await assert.rejects(f.services.get(d.id).create({
  ...args(0,draft(d)),request:{actorId:""}
 }),/AUTHENTICATION_REQUIRED/);
 await assert.rejects(f.services.get(d.id).create(args(0,draft(d),MAKER,B)),
  /BANK_PERMISSION_DENIED/);
});
test("HTTP candidate dispatcher routes each of 25 domains, sanitizes errors and disables unsafe POST",async()=>{
 const f=makeFixture();
 for(const d of domains){
  const aggregateId="77777777-7777-4777-8777-"+d.id.charCodeAt(0).toString(16).padStart(12,"0");
  const result=await f.dispatcher({
    method:"POST",url:"/v1/banks/"+A+"/"+d.id.toLowerCase()+"/"+d.actions[0],
    request:{actorId:MAKER},
    headers:{"content-type":"application/json","idempotency-key":"DISPATCH-"+d.id+"-0000000000000001","x-correlation-id":CORR},
    body:JSON.stringify(draft(d,aggregateId))
  });
  assert.equal(result.status,202,JSON.stringify({d:d.id,result}));
  assert.equal(result.body.domain,d.id);
 }
 const illegal=await f.dispatcher({
  method:"POST",url:"/v1/banks/"+A+"/led/post-journal",
  headers:{"content-type":"application/json","x-correlation-id":CORR},
  body:{},request:{actorId:MAKER}
 });
 assert.equal(illegal.status,404);
});
test("Test-only synthetic store refuses production environment",()=>{
 const old=process.env.NODE_ENV;
 process.env.NODE_ENV="production";
 try{assert.throws(()=>createSyntheticStage3Store(),/SYNTHETIC_STORE_NOT_ALLOWED_OUTSIDE_TEST/);}
 finally{process.env.NODE_ENV=old;}
});
