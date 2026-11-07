import test from "node:test";
import assert from "node:assert/strict";
import {calculateCandidateMetrics} from "../src/report-candidate-calculations.js";
const measures=["RECORD_COUNT","TOTAL_AMOUNT_MINOR","DEBIT_CREDIT_DIFFERENCE_MINOR",
  "PAR30","PAR60","PAR90","FAILURE_RATE"];
const report={id:"RPT-CRD-001",status:"DRAFT_NOT_ACCEPTED",approvedForProduction:false,
  measures:measures.map(id=>({id}))};
const criteria={institutionId:"BANK-A",branchIds:["BR-001"],period:"2026-11",
  currency:"XAF",revision:"REV-001"};
const row=(i,d)=>({recordId:"ROW-"+i,institutionId:"BANK-A",branchId:"BR-001",
  period:"2026-11",currency:"XAF",revision:"REV-001",status:"COMPLETED",
  amountMinor:"100",expectedMinor:"100",actualMinor:"100",debitMinor:"100",
  creditMinor:"100",exposureMinor:"100",daysPastDue:d,exceptionFlag:false,hasEvidence:true});
test("Exact integer exposure-weighted PAR thresholds and blocked result status",()=>{
  const x=calculateCandidateMetrics({report,criteria,records:[row(1,0),row(2,35),row(3,65),row(4,95)]});
  assert.equal(x.metrics.PAR30,"75.00");
  assert.equal(x.metrics.PAR60,"50.00");
  assert.equal(x.metrics.PAR90,"25.00");
  assert.equal(x.metrics.DEBIT_CREDIT_DIFFERENCE_MINOR,"0");
  assert.equal(x.publishable,false);assert.equal(x.status,"CANDIDATE_UNVERIFIED");
});
test("No denominator is explicitly null, not fabricated as zero percent",()=>{
  const x=calculateCandidateMetrics({report,criteria,records:[]});
  assert.equal(x.metrics.PAR30,null);
});
test("Reject cross-bank, FX-mixed, duplicate, malformed and unsafe monetary input",()=>{
  const r=row(1,35);
  for(const change of [
    {institutionId:"BANK-B"},{currency:"USD"},{branchId:"BR-002"},
    {revision:"REV-002"},{amountMinor:"1.2"},{exposureMinor:"-4"},
    {daysPastDue:-1},{status:"UNKNOWN"}
  ])assert.throws(()=>calculateCandidateMetrics({report,criteria,records:[{...r,...change}]}));
  assert.throws(()=>calculateCandidateMetrics({report,criteria,records:[r,r]}));
});
test("Unsupported regulatory/prudential formula cannot silently generate numbers",()=>{
  assert.throws(()=>calculateCandidateMetrics({
    report:{...report,measures:[{id:"CAPITAL_ADEQUACY_RATIO"}]},criteria,records:[row(1,0)]
  }),/UNSUPPORTED_CANDIDATE_CALCULATION/);
});
