import test from "node:test";
import assert from "node:assert/strict";
import {createReportReviewWorkflow,evaluateRetentionHold} from "../src/report-publication-controls.js";
const draft={reportId:"RPT-LED-001",institutionId:"BANK-A",makerId:"MAKER-001",
  contentDigest:"sha256-aaaa",version:1,state:"DRAFT"};
const create=(actorId,record=draft,change={})=>createReportReviewWorkflow({
  authenticate:async()=>({subjectId:actorId,verified:true}),
  authorize:async()=>({allowed:true,institutionId:"BANK-A",subjectId:actorId}),
  store:{loadDraft:async()=>record,transitionWithAudit:async()=>true,...change}
});
test("Maker can submit draft but cannot independently review it",async()=>{
  const submit=await create("MAKER-001").submit("RPT-LED-001");
  assert.equal(submit.status,"PENDING_REVIEW");assert.equal(submit.published,false);
  await assert.rejects(create("MAKER-001",{...draft,state:"PENDING_REVIEW"}).review("RPT-LED-001"),
    /SEGREGATION_OF_DUTIES/);
});
test("Separate checker can verify but cannot publish, and must have bank scope",async()=>{
  const checked=await create("CHECKER-001",{...draft,state:"PENDING_REVIEW"})
    .review("RPT-LED-001");
  assert.equal(checked.status,"REVIEWED_NOT_PUBLISHED");
  assert.equal(checked.officialExportEnabled,false);
  await assert.rejects(create("CHECKER-001").submit("RPT-LED-001"),/INVALID_MAKER_STATE/);
});
test("Durable CAS/audit failure blocks workflow, no fallback to success",async()=>{
  const bad=create("MAKER-001",draft,{transitionWithAudit:async()=>false});
  await assert.rejects(bad.submit("RPT-LED-001"),/WORKFLOW_CONFLICT/);
});
test("Legal hold, retention period and post-period review never allow delete",()=>{
  const args={classification:"BANK_CONFIDENTIAL",approvedPolicyId:"POL-001",
    retentionUntil:"2031-01-01",asOf:"2026-11-06",legalHold:false};
  assert.equal(evaluateRetentionHold(args).canDelete,false);
  assert.equal(evaluateRetentionHold({...args,legalHold:true}).status,"PRESERVE_LEGAL_HOLD");
  assert.equal(evaluateRetentionHold({...args,asOf:"2040-01-01"}).status,"DISPOSAL_REVIEW_REQUIRED");
  assert.throws(()=>evaluateRetentionHold({...args,approvedPolicyId:null}));
});
