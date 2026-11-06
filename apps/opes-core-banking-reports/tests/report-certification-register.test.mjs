import test from "node:test";
import assert from "node:assert/strict";
import {createReportingCertificationRegister,reportingAcceptanceSummary,REPORT_ACCEPTANCE_GATES}
  from "../src/report-certification-register.js";
test("All 378 named reports have ten separate fail-closed acceptance gates",()=>{
  const reg=createReportingCertificationRegister();
  const sum=reportingAcceptanceSummary(reg);
  assert.equal(sum.reportCount,378);
  assert.equal(sum.groups,25);
  assert.equal(sum.requiredEvidenceRecords,3780);
  assert.equal(sum.productionAccepted,0);
  assert.equal(sum.mainlineReleaseAllowed,false);
  for(const row of reg){
    assert.equal(row.productionStatus,"BLOCKED");
    assert.equal(row.gates.length,10);
    assert.ok(row.gates.every(g=>g.status==="NOT_VERIFIED"));
    assert.equal(row.officialIssuanceEnabled,false);
  }
});
test("Readiness gates include regulatory, RLS, reconciliation, privacy, visual/a11y",()=>{
  for(const expected of ["TENANT_AND_BRANCH_RLS_PENETRATION",
    "LEDGER_AND_SETTLEMENT_RECONCILIATION",
    "EN_FR_WCAG_22_AA_AND_ZOOM",
    "OFFICIAL_EXPORT_AND_REGULATORY_SUBMISSION"])
    assert.ok(REPORT_ACCEPTANCE_GATES.includes(expected));
});
