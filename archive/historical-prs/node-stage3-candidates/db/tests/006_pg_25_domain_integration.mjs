/**
 * Disposable PG16 integration: ephemeral signed access JWT -> independent
 * subject membership -> dedicated authenticated bank SQL role -> all 25
 * domain-specific typed tables + atomic review/audit/outbox candidate rows.
 *
 * NEVER point this at live banking data or enable financial side effects.
 */
import assert from "node:assert/strict";
import {generateKeyPairSync,sign,verify} from "node:crypto";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import path from "node:path";
import pg from "pg";
import {createStage3DomainServices} from "../../src/domain-services.mjs";
import {createPgStage3CandidateStore} from "../../src/pg-candidate-store.mjs";
process.env.NODE_ENV="test";
const {Client}=pg;
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const domains=JSON.parse(readFileSync(path.join(root,"catalog/domains.json"),"utf8")).domains;
const A="aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
 B="bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
 MAKER="11111111-1111-4111-8111-111111111111",
 CHECKER="22222222-2222-4222-8222-222222222222",
 BMAKER="66666666-6666-4666-8666-666666666666",
 UUID="44444444-4444-4444-8444-444444444444",
 CORRELATION="33333333-3333-4333-8333-333333333333";
const issuer="https://id.opes.invalid/realm/test";
const audience="opes-stage3";
const {publicKey,privateKey}=generateKeyPairSync("ed25519");
const now=1900000000;
const memberships=new Map([
 [MAKER,{bankId:A,role:"opes_s3_bank_a_lab",password:"only_disposable_stage3_bank_a"}],
 [CHECKER,{bankId:A,role:"opes_s3_bank_a_checker_lab",password:"only_disposable_stage3_bank_a_checker"}],
 [BMAKER,{bankId:B,role:"opes_s3_bank_b_lab",password:"only_disposable_stage3_bank_b"}]
]);
const encode=o=>Buffer.from(JSON.stringify(o)).toString("base64url");
const token=sub=>{
 const h=encode({typ:"at+jwt",alg:"EdDSA",kid:"TEST-EPHEMERAL-001"});
 const p=encode({iss:issuer,aud:audience,sub,iat:now-10,nbf:now-10,
   exp:now+600,bankId:B,bankRole:"bank_admin"});
 const src=h+"."+p;
 return src+"."+sign(null,Buffer.from(src),privateKey).toString("base64url");
};
const request=sub=>({headers:{authorization:"Bearer "+token(sub)}});
const authenticate=async req=>{
 const h=req?.headers?.authorization||"";
 const chunks=/^Bearer [A-Za-z0-9._-]+$/.test(h)?h.slice(7).split("."):[];
 if(chunks.length!==3)throw Error("TOKEN_REQUIRED");
 const header=JSON.parse(Buffer.from(chunks[0],"base64url"));
 const claims=JSON.parse(Buffer.from(chunks[1],"base64url"));
 const signature=Buffer.from(chunks[2],"base64url");
 if(header.typ!=="at+jwt"||header.alg!=="EdDSA"||
    header.kid!=="TEST-EPHEMERAL-001"||
    !verify(null,Buffer.from(chunks[0]+"."+chunks[1]),publicKey,signature)||
    claims.iss!==issuer||claims.aud!==audience||!claims.sub||
    claims.iat>now||claims.nbf>now||claims.exp<=now)
  throw Error("INVALID_SIGNED_TOKEN");
 // Never return untrusted bank or token roles.
 return {subjectId:claims.sub,issuer:claims.iss,verified:true};
};
const authorize=async({principal,permission})=>{
 const b=memberships.get(principal.subjectId);
 return {allowed:!!b,bankId:b?.bankId||null,subjectId:principal.subjectId,
   permission};
};
async function acquireTrustedActorSession({actorId,expectedBankId}){
 const entry=memberships.get(actorId);
 if(!entry||entry.bankId!==expectedBankId)throw Error("TRUSTED_BINDING_REVOKED");
 const client=new Client({
  host:"127.0.0.1",port:5432,database:"opes_test",
  user:entry.role,password:entry.password,ssl:false,
  connectionTimeoutMillis:4000
 });
 await client.connect();
 return {query:(sql,params=[])=>client.query(sql,params),
  release:()=>client.end()};
}
const store=createPgStage3CandidateStore({acquireTrustedActorSession});
const services=createStage3DomainServices({catalog:domains,authenticate,authorize,store});
const sample=type=>{
 if(type.startsWith("enum:"))return type.slice(5).split(",")[0];
 switch(type){
 case "uuid":return UUID;case "text":return "Synthetic legal evidence";
 case "date":return "2027-12-03";case "dateTime":return "2027-12-03T09:00:00Z";
 case "month":return "2027-12";case "minor":return "1000";
 case "int":return 12;case "bool":return false;case "country":return "CM";
 case "currency":return "XAF";case "sha256":return "a".repeat(64);
 case "uri":return "https://client.example.invalid/oauth/callback";
 case "uuidList":return [UUID];case "scopeList":return ["banking.read"];
 case "journalLines":return [
  {accountId:UUID,side:"DEBIT",amountMinor:"1000",currency:"XAF"},
  {accountId:"55555555-5555-4555-8555-555555555555",
   side:"CREDIT",amountMinor:"1000",currency:"XAF"}
 ];
 default:throw Error("Missing synthetic field: "+type);
 }
};
const ids=domains.map((_,i)=>"88888888-8888-4888-8888-"+(i+1).toString(16).padStart(12,"0"));
const call=(aggregateId,body,subject,key)=>({
 bankId:A,body,request:request(subject),
 idempotencyKey:key,correlationId:CORRELATION
});
for(const [i,d] of domains.entries()){
 const srv=services.get(d.id),aggregateId=ids[i];
 const payload={aggregateId,expectedVersion:0,
  ...Object.fromEntries(d.fields.map(f=>[f.name,sample(f.type)]))};
 const key0="S3-DRAFT-"+d.id+"-0000000000000001";
 const draft=await srv.create(call(aggregateId,payload,MAKER,key0));
 assert.equal(draft.state,"DRAFT",d.id);
 assert.equal(draft.version,1,d.id);
 assert.equal(draft.bankId,A,d.id);
 // Read-side duplicate idempotency safely returns original result.
 if(i===0){
  const replay=await srv.create(call(aggregateId,payload,MAKER,key0));
  assert.equal(replay.version,1);
  await assert.rejects(srv.create(call(aggregateId,
   {...payload,policyCode:"Changed synthetic policy"},MAKER,key0)));
 }
 const submit=await srv.submit(call(aggregateId,{
  aggregateId,expectedVersion:1,[d.submitEvidence]:UUID
 },MAKER,"S3-SUBMIT-"+d.id+"-00000000000001"));
 assert.equal(submit.state,"PENDING_REVIEW",d.id);
 await assert.rejects(srv.review(call(aggregateId,{
  aggregateId,expectedVersion:2,[d.reviewEvidence]:UUID,decision:"ACCEPT"
 },MAKER,"S3-SELF-"+d.id+"-000000000000001")));
 const checked=await srv.review(call(aggregateId,{
  aggregateId,expectedVersion:2,[d.reviewEvidence]:UUID,decision:"ACCEPT"
 },CHECKER,"S3-REVIEW-"+d.id+"-00000000000001"));
 assert.equal(checked.state,"REVIEWED_NOT_EFFECTIVE",d.id);
 assert.equal(checked.version,3);
 assert.equal(checked.financialEffective,false);
 assert.equal(checked.regulatorySubmissionEnabled,false);
 assert.equal((await srv.read({bankId:A,aggregateId,
  correlationId:CORRELATION,request:request(MAKER)})).version,3);
 await assert.rejects(srv.read({bankId:B,aggregateId,
  correlationId:CORRELATION,request:request(BMAKER)}));
}
const sampleLED=domains.find(d=>d.id==="LED");
await assert.rejects(services.get("LED").create(call(
 "99999999-9999-4999-8999-999999999999",
 {aggregateId:"99999999-9999-4999-8999-999999999999",expectedVersion:0,
  ...Object.fromEntries(sampleLED.fields.map(f=>[
   f.name,f.name==="journalLines"?[
    {accountId:UUID,side:"DEBIT",amountMinor:"999",currency:"XAF"},
    {accountId:"55555555-5555-4555-8555-555555555555",
      side:"CREDIT",amountMinor:"1000",currency:"XAF"}
   ]:sample(f.type)
  ]))},
 MAKER,"S3-INVALID-LED-000000000000001")));
const tamper=token(MAKER).split(".");
tamper[1]=encode({iss:issuer,aud:audience,sub:BMAKER,
  iat:now-10,nbf:now-10,exp:now+600});
await assert.rejects(authenticate({headers:{authorization:"Bearer "+tamper.join(".")}}));
assert.equal(domains.length,25);
console.log("STAGE3_25_SIGNED_TOKEN_TO_PG16_CANDIDATE_TRANSITIONS_PASS");
