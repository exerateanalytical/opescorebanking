/**
 * Real disposable PG16 integration:
 * signed ephemeral OIDC access token -> trusted subject binding ->
 * dedicated database credential -> authenticated SESSION_USER ->
 * bank-specific read and atomic maker/checker transition.
 * No live bank credentials, actual banking records or regulatory outputs.
 */
import assert from "node:assert/strict";
import {generateKeyPairSync,sign} from "node:crypto";
import pg from "pg";
import {createPinnedOidcAuthenticator} from "../../src/reporting-auth.js";
import {createBankScopedSessionRouter} from "../../src/report-bank-session-router.js";
import {createScopedPgReviewStore} from "../../src/report-pg-review-store.js";
import {createReportReviewWorkflow} from "../../src/report-publication-controls.js";
process.env.NODE_ENV="test";
const {Client}=pg;
const issuer="https://id.example.test/realms/opes";
const audience="opes-reporting";
const {publicKey,privateKey}=generateKeyPairSync("ed25519");
const trustedKeys=new Map([["TEST-KID-001",{
  active:true,algorithm:"EdDSA",
  publicKey:publicKey.export({format:"pem",type:"spki"})
}]]);
const now=()=>1762390000000;
const makeToken=subject=>{
 const header=Buffer.from(JSON.stringify({
   alg:"EdDSA",kid:"TEST-KID-001",typ:"at+jwt"
 })).toString("base64url");
 const payload=Buffer.from(JSON.stringify({
   iss:issuer,aud:audience,sub:subject,
   iat:1762389900,nbf:1762389900,exp:1762390200,
   institutionId:"BANK-B",roles:["admin"]
 })).toString("base64url");
 const unsigned=header+"."+payload;
 return unsigned+"."+sign(null,Buffer.from(unsigned),privateKey)
   .toString("base64url");
};
const request=subject=>({headers:{authorization:"Bearer "+makeToken(subject)}});
const authenticator=createPinnedOidcAuthenticator({
  issuer,audience,trustedKeys,now
});
const bindings=new Map([
 ["A-MAKER",{role:"opes_rpt_a_maker_lab",bank:"BANK-A",canSubmit:true,canReview:false}],
 ["A-CHECKER",{role:"opes_rpt_a_checker_lab",bank:"BANK-A",canSubmit:false,canReview:true}],
 ["B-MAKER",{role:"opes_rpt_b_maker_lab",bank:"BANK-B",canSubmit:true,canReview:false}]
]);
const passwords=new Map([
 ["opes_rpt_a_maker_lab","only_disposable_a_maker"],
 ["opes_rpt_a_checker_lab","only_disposable_a_checker"],
 ["opes_rpt_b_maker_lab","only_disposable_b_maker"]
]);
const router=createBankScopedSessionRouter({
 issuer,now,allowDisposableLab:true,
 lookupBinding:async({subjectId})=>{
  const r=bindings.get(subjectId);
  if(!r)return null;
  return {issuer,subjectId,actorId:subjectId,institutionId:r.bank,
    databaseRole:r.role,active:true,version:1,validUntil:2000000000000};
 },
 loadSecret:async({institutionId,role})=>({
  institutionId,role,host:"127.0.0.1",port:5432,database:"opes_test",
  ssl:false,password:passwords.get(role)
 }),
 connect:async config=>{
  const client=new Client({
   host:config.host,port:config.port,database:config.database,
   user:config.user,password:config.password,ssl:false,
   connectionTimeoutMillis:3000
  });
  await client.connect();
  return {
   query:(sql,params=[])=>client.query(sql,params),
   release:()=>client.end()
  };
 }
});
const store=createScopedPgReviewStore({acquireTrustedSession:router});
const workflow=createReportReviewWorkflow({
 authenticate:authenticator,
 authorize:async({actor,draft,permission})=>{
  const r=bindings.get(actor.subjectId);
  return {
   allowed:!!r&&r.bank===draft.institutionId&&(
    permission==="reports.review.submit"?r.canSubmit:r.canReview),
   institutionId:r?.bank||null,subjectId:actor.subjectId
  };
 },
 store
});
// Signed token must be required before any bank SQL access.
const maker=await authenticator(request("A-MAKER"));
assert.equal(maker.subjectId,"A-MAKER");
assert.ok(!("institutionId" in maker));
const unmodified=await store.loadDraft("RPT-LED-005",{principal:maker});
assert.equal(unmodified.institutionId,"BANK-A");
assert.equal(unmodified.state,"DRAFT");
const submitted=await workflow.submit("RPT-LED-005",request("A-MAKER"));
assert.equal(submitted.status,"PENDING_REVIEW");
await assert.rejects(workflow.submit("RPT-LED-005",request("A-MAKER")));
// Distinct authorized checker must complete review without publication.
const checked=await workflow.review("RPT-LED-005",request("A-CHECKER"));
assert.equal(checked.status,"REVIEWED_NOT_PUBLISHED");
assert.equal(checked.officialExportEnabled,false);
const checker=await authenticator(request("A-CHECKER"));
const final=await store.loadDraft("RPT-LED-005",{principal:checker});
assert.equal(final.version,2);
assert.equal(final.checkerId,"A-CHECKER");
// A signed Bank B JWT must not select Bank A's review record.
const bankB=await authenticator(request("B-MAKER"));
assert.equal(await store.loadDraft("RPT-LED-005",{principal:bankB}),null);
await assert.rejects(workflow.review("RPT-LED-005",request("B-MAKER")));
const tampered=makeToken("A-MAKER").split(".");
tampered[1]=Buffer.from(JSON.stringify({
  iss:issuer,aud:audience,sub:"B-MAKER",
  iat:1762389900,nbf:1762389900,exp:1762390200
})).toString("base64url");
await assert.rejects(authenticator({
 headers:{authorization:"Bearer "+tampered.join(".")}
}));
// Revoke credential binding. Future newly routed requests are denied.
bindings.delete("A-MAKER");
await assert.rejects(store.loadDraft("RPT-LED-005",{principal:maker}));
console.log("PG16_SIGNED_OIDC_TO_DB_REVIEW_AND_CROSS_BANK_DENIAL_PASS");
