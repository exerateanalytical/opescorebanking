import test from "node:test";
import assert from "node:assert/strict";
import {SCREENS} from "../../opes-core-banking-ui/src/catalog.js";
import {FORMS,FORM_BY_ID,FORM_BY_SCREEN,FORM_STATISTICS} from "../src/form-registry.js";
import {validateForm,conditionallyRequired,safeDemoData,sanitizedLocalDraft} from "../src/validation.js";
test("Every one of 726 UI screens has exactly one traceable banking form",()=>{
 assert.equal(SCREENS.length,726);assert.equal(FORMS.length,726);assert.equal(FORM_BY_ID.size,726);assert.equal(FORM_BY_SCREEN.size,726);
 assert.equal(FORM_STATISTICS.total,726);assert.equal(FORM_STATISTICS.domains,26);
 assert.ok(FORM_STATISTICS.capture>100);assert.ok(FORM_STATISTICS.readOnly>0);
 assert.equal(FORM_STATISTICS.capture+FORM_STATISTICS.readOnly,726);
 for(const screen of SCREENS){
  const form=FORM_BY_SCREEN.get(screen.id);
  assert.ok(form,screen.id);
  assert.equal(form.id,"FORM-"+screen.id);
  assert.equal(form.domain,screen.domain);
  assert.ok(form.fields.length>=5,form.id+" insufficient fields");
  assert.equal(form.fields.length,new Set(form.fields.map(f=>f.id)).size,form.id+" duplicate ids");
  assert.ok(form.sections.length>0);
  assert.ok(form.sections.every(s=>s.fields.length>0));
  assert.ok(form.fields.every(f=>f.label&&f.section&&f.type&&f.id&&typeof f.required==="boolean"));
  assert.equal(form.status,"UI_CONTRACT_PROPOSED_NOT_APPROVED");
  assert.equal(form.approvedForProduction,false);
  assert.equal(form.backend.apiContract,"UNBOUND");
  assert.equal(form.backend.tenantScope,"NOT_SERVER_ENFORCED");
  assert.equal(form.states.executableBackendTransitions.length,0);
  assert.equal(form.frontendActions.submit.enabled,false);
  assert.equal(form.frontendActions.approve.enabled,false);
  assert.equal(form.frontendActions.post.enabled,false);
  assert.equal(form.frontendActions.reconcile.enabled,false);
  assert.equal(form.frontendActions.saveLocal.enabled,form.mode==="DRAFT_CAPTURE");
 }
});
test("No field schema is machine-executable script; validations remain declarative",()=>{
 for(const form of FORMS){
  for(const r of form.validationRules){
   assert.ok(r.id&&r.fields&&r.check);
   assert.ok(["date_lte","not_equal","equal_numbers","integer_range","email","safe_nonnegative_integer","denomination_count_check"].includes(r.check.op),form.id+" unknown validation rule "+r.check.op);
  }
  for(const c of form.conditionalRules){
   assert.ok(["eq","neq","in"].includes(c.when.op));
   assert.ok(form.fields.some(f=>f.id===c.when.field));
   assert.ok(c.requires.every(x=>form.fields.some(f=>f.id===x)));
  }
 }
});
test("Read-only, query, review and monitor forms never save local or banking drafts",()=>{
 for(const form of FORMS.filter(f=>f.mode!=="DRAFT_CAPTURE")){
  const r=validateForm(form,{});
  assert.equal(r.ok,false);
  assert.equal(r.errors[0].code,"READ_ONLY");
 }
});
test("LED journal requires separate GLs and equal synthetic debit/credit legs",()=>{
 const f=FORM_BY_SCREEN.get("LED-UI-002");assert.ok(f);
 const demo=safeDemoData(f);
 demo.debitGL="DR-001";demo.creditGL="DR-001";demo.amountMinor="10000";demo.creditAmountMinor="10000";
 const same=validateForm(f,demo);assert.ok(same.errors.some(e=>e.code==="different-ledger-legs"));
 demo.creditGL="CR-002";demo.creditAmountMinor="9999";
 const unbalanced=validateForm(f,demo);assert.ok(unbalanced.errors.some(e=>e.code==="balanced-two-legs"));
 demo.creditAmountMinor="10000";
 const valid=validateForm(f,demo);assert.ok(valid.ok,JSON.stringify(valid.errors));
});
test("CIF legal entity and cash-count conditional guards are enforced",()=>{
 const cif=FORM_BY_SCREEN.get("CIF-UI-002"),data=safeDemoData(cif);
 data.partyType="Legal entity";data.beneficialOwnerLink="";
 assert.ok(conditionallyRequired(cif,data).has("beneficialOwnerLink"));
 assert.ok(validateForm(cif,data).errors.some(x=>x.fields.includes("beneficialOwnerLink")));
 data.beneficialOwnerLink="SYNTHETIC-OWNER";
 assert.ok(!validateForm(cif,data).errors.some(x=>x.fields.includes("beneficialOwnerLink")));
 const cash=FORM_BY_SCREEN.get("BRN-UI-004"),d=safeDemoData(cash);
 d.currency="XAF";d.expectedMinor="0";d.denom10000="2";
 assert.ok(validateForm(cash,d).warnings.some(x=>x.code==="cash-denomination-difference"));
 d.expectedMinor="20000";
 assert.ok(!validateForm(cash,d).warnings.some(x=>x.code==="cash-denomination-difference"));
});
test("Negative, unsafe, non-integer monetary values are rejected",()=>{
 const form=FORM_BY_SCREEN.get("CRD-UI-002"),demo=safeDemoData(form);
 for(const amount of ["-1","0.3","9007199254740992","Infinity","1e4"]){
  demo.requestedMinor=amount;
  assert.ok(validateForm(form,demo).errors.some(e=>e.fields.includes("requestedMinor")),amount);
 }
 demo.requestedMinor="100000";assert.ok(validateForm(form,demo).ok);
});
test("Only allowed field IDs may be retained in the in-memory draft object",()=>{
 const f=FORM_BY_SCREEN.get("CRD-UI-002");
 const value=sanitizedLocalDraft(f,{requestedMinor:"50000",secret:"private-api-key",customerReference:"SYN",creditPolicy:"TEST"});
 assert.equal(value.requestedMinor,"50000");assert.equal(value.secret,undefined);
});
test("All demo values are synthetic and no production approvals can be inferred",()=>{
 for(const form of FORMS.filter(f=>f.mode==="DRAFT_CAPTURE").slice(0,150)){
  const data=safeDemoData(form);
  assert.ok(Object.values(data).every(v=>!String(v).includes("APPROVED-BANK-TRANSACTION")));
 }
 assert.equal(FORM_STATISTICS.approved,0);assert.equal(FORM_STATISTICS.backendConnected,0);
});
