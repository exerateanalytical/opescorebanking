import test from "node:test";
import assert from "node:assert/strict";
import {generateKeyPairSync,sign} from "node:crypto";
import {createPinnedOidcAuthenticator,createInstitutionReportAuthorizer} from "../src/reporting-auth.js";
const {publicKey,privateKey}=generateKeyPairSync("ed25519");
const pub=publicKey.export({format:"pem",type:"spki"});
const keys=new Map([["KID-001",{algorithm:"EdDSA",active:true,publicKey:pub}]]);
const config={issuer:"https://login.example.test/realms/banking",audience:"opes-reporting",
  trustedKeys:keys,now:()=>1762390000000};
const token=(patch={},headerPatch={})=>{
  const h=Buffer.from(JSON.stringify({typ:"at+jwt",alg:"EdDSA",kid:"KID-001",...headerPatch})).toString("base64url");
  const p=Buffer.from(JSON.stringify({iss:config.issuer,aud:config.audience,sub:"USER-001",
    iat:1762389900,nbf:1762389900,exp:1762390200,...patch})).toString("base64url");
  return h+"."+p+"."+sign(null,Buffer.from(h+"."+p),privateKey).toString("base64url");
};
const req=jwt=>({headers:{authorization:"Bearer "+jwt}});
test("Verify server-pinned signed OIDC access token; strip caller institution/roles",async()=>{
  const principal=await createPinnedOidcAuthenticator(config)(
    req(token({institutionId:"BANK-B",roles:["bank_auditor"],isAdmin:true})));
  assert.equal(principal.subjectId,"USER-001");assert.equal(principal.verified,true);
  assert.ok(!("institutionId" in principal));assert.ok(!("roles" in principal));
});
test("Reject missing, unsigned, expired and wrongly scoped access tokens",async()=>{
  const auth=createPinnedOidcAuthenticator(config);
  for(const request of [
    {headers:{}},req(token({exp:1762389800})),req(token({aud:"wrong-aud"})),
    req(token({iss:"https://evil.test"})),req(token({}, {alg:"none"})),req(token({}, {typ:"JWT"})),
    req(token({}, {jku:"https://evil.test/keys"})),req(token({}, {kid:"KID-999"})),
    req(token().replace(/\.[^.]+$/, sig => "."+(sig[1]==="A"?"B":"A")+sig.slice(2)))
  ])await assert.rejects(auth(request));
});
test("Membership authority ignores JWT bank assertion and enforces report-specific role",async()=>{
  const principal=await createPinnedOidcAuthenticator(config)(req(token({institutionId:"BANK-B"})));
  const m={state:"ACTIVE",institutionState:"ACTIVE",institutionId:"BANK-A",
    branchIds:["BR-A","BR-B"],roles:["bank_analyst"],
    permissions:["reports.source.preflight"],validUntil:1762391000000};
  const authz=createInstitutionReportAuthorizer({
    lookupMemberships:async()=>[m],now:config.now
  });
  const access=await authz({principal,report:{authorization:{roleClasses:["bank_analyst"]}}});
  assert.equal(access.institutionId,"BANK-A");assert.equal(access.branchIds.length,2);
});
test("Revoked, multiple-bank, training-only, or out-of-scope roles denied",async()=>{
  const p={subjectId:"USER-001",verified:true};
  const m={state:"ACTIVE",institutionState:"ACTIVE",institutionId:"BANK-A",
    branchIds:["BR-A"],roles:["bank_analyst"],
    permissions:["reports.source.preflight"],validUntil:1762391000000};
  const report={authorization:{roleClasses:["bank_analyst"]}};
  for(const members of [
    [{...m,state:"REVOKED"}],[m,{...m,institutionId:"BANK-B"}],
    [{...m,roles:["training_instructor"]}],[{...m,roles:["bank_cashier"]}],
    [{...m,branchIds:[]}],[{...m,validUntil:0}]
  ])await assert.rejects(createInstitutionReportAuthorizer({
    lookupMemberships:async()=>members,now:config.now
  })({principal:p,report}));
});
