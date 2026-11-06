import test from "node:test";
import assert from "node:assert/strict";
import {createRegulatoryMappingGate} from "../src/report-regulatory-mapping.js";
const report={id:"RPT-REG-001",version:"0.1.0-design"};
const criteria={institutionId:"BANK-A",period:"2026-11"};
const mapping={
  status:"APPROVED",institutionId:"BANK-A",reportId:report.id,
  reportVersion:report.version,sourceSystem:"LEDGER-SERVICE",mappingVersion:"MAP-001",
  financialFramework:"PCEC-LOCAL-REVIEW",legalReference:"LEGAL-001",
  approvalEvidenceId:"APPROVAL-001",contentDigest:"sha256-001",
  authorId:"MAKER-001",checkerId:"CHECKER-001",
  effectiveFrom:"2026-01-01",effectiveThrough:"2027-12-31"
};
const factory=(change={},approval=true)=>createRegulatoryMappingGate({
  loadMapping:async()=>({...mapping,...change}),
  verifyIndependentApproval:async()=>approval
});
const args={report,criteria,sourceSystem:"LEDGER-SERVICE"};
test("Mapping review evidence does not unlock official regulatory publication",async()=>{
  const x=await factory()(args);
  assert.equal(x.status,"MAPPING_EVIDENCE_ONLY");
  assert.equal(x.officialFilingEnabled,false);
});
test("Block absent authority, wrong bank, expired, self-approved, and unverified mapping",async()=>{
  assert.throws(()=>createRegulatoryMappingGate(),/MAPPING_AUTHORITY_MISSING/);
  for(const change of [
    {status:"DRAFT"},{institutionId:"BANK-B"},
    {effectiveThrough:"2026-09-01"},{authorId:"CHECKER-001"},
    {legalReference:""},{contentDigest:""}
  ])await assert.rejects(factory(change)(args));
  await assert.rejects(factory({},false)(args));
});
