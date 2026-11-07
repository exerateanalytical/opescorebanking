import test from "node:test";
import assert from "node:assert/strict";
import {SCREENS} from "../src/catalog.js";
import {PRIORITY_DOMAINS,CURATED_SCREEN_IDS,WORKFLOW_PHASES,priorityContractFor} from "../src/priority-contracts.js";
const priority=SCREENS.filter(s=>PRIORITY_DOMAINS.includes(s.domain));
test("all priority domain routes have screen-specific contract and four lifecycle stages",()=>{
 assert.equal(PRIORITY_DOMAINS.length,5);
 assert.equal(priority.length,215);
 for(const s of priority){
  const c=priorityContractFor(s);
  assert.ok(c,s.id+" missing contract");
  assert.equal(c.id,s.id);
  assert.equal(c.status,"PROPOSED_NOT_APPROVED");
  assert.equal(c.phases.length,4);
  assert.ok(c.fields.length>=5,s.id+" insufficient fields");
  assert.equal(new Set(c.fields.map(f=>f.id)).size,c.fields.length,s.id+" duplicate field");
  for(const f of c.fields){
   assert.ok(f.id&&f.label&&f.group, s.id+" malformed field");
   assert.equal(typeof f.required,"boolean",s.id+" missing required flag");
   if(f.type==="select")assert.ok(f.options.length>=1);
  }
 }
});
test("24 canonical priority drafts have curated task-specific contracts",()=>{
 assert.equal(CURATED_SCREEN_IDS.length,24);
 for(const id of CURATED_SCREEN_IDS){
  const s=SCREENS.find(x=>x.id===id);
  assert.ok(s,id+" absent from canonical register");
  assert.equal(priorityContractFor(s).source,"CURATED_SCREEN_SPEC");
 }
});
test("read-only/review screens fail closed for draft capture",()=>{
 for(const id of ["CIF-UI-001","CIF-UI-003","ACT-UI-001","ACT-UI-002","ACT-UI-005","LED-UI-003","LED-UI-004","LED-UI-005","BRN-UI-001","BRN-UI-003","BRN-UI-005","CRD-UI-001","CRD-UI-003"]){
  const s=SCREENS.find(x=>x.id===id);
  assert.equal(priorityContractFor(s).captureAllowed,false,id);
 }
 for(const id of ["CIF-UI-002","CIF-UI-004","ACT-UI-003","ACT-UI-004","LED-UI-001","LED-UI-002","BRN-UI-004","CRD-UI-002","CRD-UI-004","CRD-UI-005"]){
  const s=SCREENS.find(x=>x.id===id);
  assert.equal(priorityContractFor(s).captureAllowed,true,id);
 }
});
test("ledger/cash/credit curated fields include mandatory guard references",()=>{
 const contract=id=>priorityContractFor(SCREENS.find(s=>s.id===id));
 for(const f of ["debitGL","creditGL","amountMinor","postingRuleVersion","correlationId"])assert.ok(contract("LED-UI-002").fields.some(x=>x.id===f),f);
 for(const f of ["expectedMinor","denom10000","denom5000","cashSessionReference"])assert.ok(contract("BRN-UI-004").fields.some(x=>x.id===f),f);
 for(const f of ["annualIncomeMinor","annualDebtMinor","requestedMinor","riskGrade","reviewPolicyVersion"])assert.ok(contract("CRD-UI-002").fields.some(x=>x.id===f),f);
});
