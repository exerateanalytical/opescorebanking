import test from "node:test";
import assert from "node:assert/strict";
import {REPORT_GROUPS} from "../src/report-seeds.js";
import {REPORT_SOURCE_DOMAINS,createScopedDomainSnapshotReader}
  from "../src/report-source-connectors.js";
const groupCodes={LEDGER:"LED",DEPOSITS:"DEP",PAYMENTS:"PAY",
  CREDIT:"CRD",TREASURY:"TRE",CASH:"BRN"};
const mk=(code)=>"RPT-"+code+"-001";
const reports=new Map(Object.values(groupCodes).map(code=>[mk(code),
  {id:mk(code),code,version:"0.1.0-design"}]));
const criteria=id=>({reportId:id,reportVersion:"0.1.0-design",institutionId:"BANK-A",
  branchIds:["BR-A"],currency:"XAF",period:"2026-11"});
const build=(change={})=>new Map(Object.entries(groupCodes).map(([name,code])=>[
  name,{readSnapshot:async c=>({...c,sourceDomain:name,immutable:true,reconciled:true,
    snapshotId:"SNAP-123",...change})}
]));
test("Exactly six explicit source groups are supported",()=>{
  assert.deepEqual(Object.keys(REPORT_SOURCE_DOMAINS).sort(),
    ["CASH","CREDIT","DEPOSITS","LEDGER","PAYMENTS","TREASURY"]);
  assert.throws(()=>createScopedDomainSnapshotReader(),/CONNECTORS_NOT_CONFIGURED/);
});
test("Every one of 25 reporting groups is exactly once routed to a source domain",()=>{
  const defined=REPORT_GROUPS.map(g=>g[0]).sort();
  const routed=Object.values(REPORT_SOURCE_DOMAINS).flat().sort();
  assert.deepEqual(routed,defined);
});
test("Read-only bank/branch/period/currency scoped contract for all six domains",async()=>{
  const read=createScopedDomainSnapshotReader({reports,sources:build()});
  for(const code of Object.values(groupCodes)){
    const out=await read(criteria(mk(code)));
    assert.equal(out.institutionId,"BANK-A");
    assert.equal(out.reconciled,true);
  }
});
test("Cross-bank, branch, FX and unreconciled source responses all denied",async()=>{
  for(const change of [
    {institutionId:"BANK-B"},{branchIds:["BR-B"]},{currency:"USD"},
    {period:"2026-10"},{immutable:false},{reconciled:false},
    {accessToken:"SECRET"},{bankRows:[{client:"no"}]},
    {rows:[{customer:"PII"}]},{roles:["admin"]}
  ]){
    const read=createScopedDomainSnapshotReader({reports,sources:build(change)});
    await assert.rejects(read(criteria(mk("LED"))));
  }
});
test("Unmapped or malformed report scopes denied before source call",async()=>{
  const read=createScopedDomainSnapshotReader({reports,sources:build()});
  await assert.rejects(read({...criteria(mk("LED")),institutionId:""}));
  await assert.rejects(read({...criteria(mk("LED")),branchIds:["BR-A","BR-A"]}));
  await assert.rejects(read({...criteria(mk("LED")),period:"2026-13"}));
  await assert.rejects(read(criteria("RPT-UNKNOWN-001")));
});
