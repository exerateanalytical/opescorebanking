import test from "node:test";
import assert from "node:assert/strict";
import {createServer} from "node:http";
import {once} from "node:events";
import {createReportSourcePreflight,createSourceReadinessHttpHandler,SourceReadinessError}
  from "../src/report-source-preflight.js";
const report = Object.freeze({
  id:"RPT-LED-001",version:"0.1.0-design",status:"DRAFT_NOT_ACCEPTED",
  approvedForProduction:false
});
const reports = new Map([[report.id,report]]);
const base = {
  subjectId:"OIDC-subject-001",verified:true
};
const branches = ["BANK-BR-01","BANK-BR-02"];
const snapshot = Object.freeze({
  snapshotId:"SNAP-123",reportId:report.id,reportVersion:report.version,
  institutionId:"BANK-A",branchIds:branches,period:"2026-11",currency:"XAF",
  sourceSystem:"LEDGER-SERVICE",mappingVersion:"PCEC-UNAPPROVED-01",
  digest:"sha256-abcdef",immutable:true,reconciled:true,
  rows:[{customerName:"MUST-NOT-LEAK",amountMinor:123456}]
});
function harness(overrides={}){
  const events=[];
  const deps = {
    reports,
    authenticate:async()=>({...base}),
    authorize:async({principal})=>({
      subjectId:principal.subjectId,institutionId:"BANK-A",branchIds:[...branches],allowPreflight:true
    }),
    readSnapshot:async()=>({...snapshot}),
    verifyProvenance:async()=>({
      signatureValid:true,digestMatches:true,sourceApproved:true,
      mappingApproved:true,lineageComplete:true
    }),
    recordAudit:async event=>{events.push(event);},
    ...overrides
  };
  return {inspect:createReportSourcePreflight(deps),events};
}
const args={reportId:report.id,period:"2026-11",currency:"XAF"};
async function rejects(preflight, expected, input=args) {
  await assert.rejects(preflight(input), e =>
    e instanceof SourceReadinessError && e.code===expected);
}
test("Missing provider and missing report registry fail configuration closed",()=>{
  assert.throws(()=>createReportSourcePreflight({}),/CONFIGURATION_INCOMPLETE/);
  assert.throws(()=>createSourceReadinessHttpHandler(),/CONFIGURATION_INCOMPLETE/);
});
test("Verified metadata still cannot generate or authorize an official report",async()=>{
  const {inspect,events}=harness();
  const result=await inspect(args);
  assert.equal(result.status,"BLOCKED");
  assert.equal(result.productionEnabled,false);
  assert.equal(result.officialExportEnabled,false);
  assert.equal(result.regulatorSubmissionEnabled,false);
  assert.equal(result.sourceMetadataVerified,true);
  assert.ok(!JSON.stringify(result).includes("MUST-NOT-LEAK"));
  assert.ok(!JSON.stringify(result).includes("123456"));
  assert.deepEqual(events.map(x=>[x.outcome,x.reason]),
    [["BLOCKED","PRODUCTION_ACCEPTANCE_PENDING"]]);
  assert.equal(events[0].institutionId,"BANK-A");
});
test("Fail unauthenticated and forged caller role/tenant flags",async()=>{
  const {inspect,events}=harness({authenticate:async()=>null});
  await rejects(inspect,"AUTHENTICATION_REQUIRED",{
    ...args,requestContext:{institutionId:"BANK-A",isAdmin:true,roles:["bank_auditor"]}
  });
  assert.equal(events[0].subjectId,null);
});
test("Authorization is bank/branch scoped by the trusted entitlement provider",async()=>{
  const denied=harness({authorize:async()=>({
    allowPreflight:true,subjectId:base.subjectId,institutionId:"BANK-A",branchIds:[...branches]
  })});
  await rejects(denied.inspect,"NOT_AUTHORIZED",{...args,branchId:"BANK-BR-99"});
  const forged=harness({authorize:async()=>({
    allowPreflight:true,subjectId:"ANOTHER-USER",institutionId:"BANK-A",branchIds:[...branches]
  })});
  await rejects(forged.inspect,"NOT_AUTHORIZED");
  assert.equal(denied.events[0].institutionId,null);
});
test("Reject cross-bank, cross-branch and wrong-period source snapshots",async()=>{
  for (const change of [
    {institutionId:"BANK-B"},
    {branchIds:["BANK-BR-01","BANK-BR-03"]},
    {period:"2026-10"},
    {currency:"EUR"},
    {reportId:"RPT-LED-002"}
  ]) {
    const {inspect}=harness({readSnapshot:async()=>({...snapshot,...change})});
    await rejects(inspect,"SOURCE_NOT_VERIFIED");
  }
});
test("Reject incomplete, unbalanced, mutable and unverified provenance",async()=>{
  for (const change of [
    {immutable:false},{reconciled:false},{mappingVersion:""},
    {digest:""},{branchIds:[]},{sourceSystem:""}
  ]) {
    const {inspect}=harness({readSnapshot:async()=>({...snapshot,...change})});
    await rejects(inspect,"SOURCE_NOT_VERIFIED");
  }
  for (const property of [
    "signatureValid","digestMatches","sourceApproved","mappingApproved","lineageComplete"
  ]) {
    const {inspect}=harness({verifyProvenance:async()=>({
      signatureValid:true,digestMatches:true,sourceApproved:true,
      mappingApproved:true,lineageComplete:true,[property]:false
    })});
    await rejects(inspect,"SOURCE_NOT_VERIFIED");
  }
});
test("No duplicate, unknown or invalid filter can select tenant or role",async()=>{
  const {inspect}=harness();
  await rejects(inspect,"INVALID_REQUEST",{...args,period:"2026-13"});
  await rejects(inspect,"INVALID_REQUEST",{...args,currency:"XAF;DROP"});
  await rejects(inspect,"INVALID_REQUEST",{...args,branchId:"INVALID!"});
  await rejects(inspect,"UNKNOWN_REPORT",{...args,reportId:"RPT-LED-999"});
});
test("Backend failures are sanitized and always audited",async()=>{
  const {inspect,events}=harness({readSnapshot:async()=>{throw Error("secret: account 1234");}});
  await rejects(inspect,"SOURCE_UNAVAILABLE");
  assert.equal(events[0].reason,"SOURCE_UNAVAILABLE");
  const unavailable=harness({recordAudit:async()=>{throw Error("database down");}});
  await rejects(unavailable.inspect,"AUDIT_UNAVAILABLE");
});
test("HTTP gate exposes only blocked readiness, with private noncached responses",async()=>{
  const {inspect}=harness();
  const server=createServer(createSourceReadinessHttpHandler(inspect));
  server.listen(0,"127.0.0.1");await once(server,"listening");
  try {
    const origin="http://127.0.0.1:"+server.address().port;
    const endpoint=origin+"/api/v1/reports/RPT-LED-001/source-readiness";
    const ok=await fetch(endpoint+"?period=2026-11&currency=XAF");
    assert.equal(ok.status,503);
    assert.match(ok.headers.get("cache-control"),/no-store/);
    const body=await ok.json();
    assert.equal(body.productionEnabled,false);
    assert.equal(body.status,"BLOCKED");
    assert.ok(!JSON.stringify(body).includes("MUST-NOT-LEAK"));
    const forged=await fetch(endpoint+
      "?period=2026-11&currency=XAF&institutionId=BANK-B");
    assert.equal(forged.status,400);
    assert.deepEqual(await forged.json(),{error:"INVALID_REQUEST"});
    const duplicate=await fetch(endpoint+
      "?period=2026-11&period=2026-10&currency=XAF");
    assert.equal(duplicate.status,400);
    const mutation=await fetch(endpoint,{method:"POST"});
    assert.equal(mutation.status,405);
    assert.equal(mutation.headers.get("allow"),"GET");
  } finally {await new Promise(resolve=>server.close(resolve));}
});
test("HTTP denies missing identity, without leaking protected source details",async()=>{
  const {inspect}=harness({authenticate:async()=>{throw Error("internal token invalid");}});
  const server=createServer(createSourceReadinessHttpHandler(inspect));
  server.listen(0,"127.0.0.1");await once(server,"listening");
  try {
    const url="http://127.0.0.1:"+server.address().port+
      "/api/v1/reports/RPT-LED-001/source-readiness?period=2026-11&currency=XAF";
    const response=await fetch(url);
    assert.equal(response.status,503);
    assert.deepEqual(await response.json(),{error:"SOURCE_UNAVAILABLE"});
  } finally {await new Promise(resolve=>server.close(resolve));}
});
