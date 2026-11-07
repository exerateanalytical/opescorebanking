import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {FORM_GROUP_SEEDS,FORM_PHASE_VARIANTS} from "../src/registry-seeds.js";
import {FORMS,FORM_BY_ID,FORM_COUNTS,FORM_STATES,FORM_DELIVERY} from "../src/forms.js";
import {validateForm,syntheticExample,isVisible,permittedLocalActions} from "../src/validation.js";
test("589 forms reconcile to explicit proposed quotas and 25 domain groups",()=>{
 assert.equal(FORMS.length,589);
 assert.equal(FORM_BY_ID.size,589);
 assert.equal(FORM_DELIVERY.formCount,589);
 assert.equal(FORM_GROUP_SEEDS.length,25);
 assert.equal(FORM_GROUP_SEEDS.reduce((n,row)=>n+row[1],0),589);
 assert.equal(FORM_PHASE_VARIANTS.length,5);
 assert.equal(Object.keys(FORM_COUNTS).length,25);
 const names=new Set();
 for(const [code,quota] of FORM_GROUP_SEEDS)assert.equal(FORM_COUNTS[code],quota,code);
 for(const f of FORMS){
  assert.match(f.id,/^FRM-[A-Z]+-\d{3}$/,f.id);
  assert.ok(!names.has(f.name),"Duplicate name "+f.name);names.add(f.name);
  assert.equal(f.status,"GENERATED_CLIENT_FORM_UNACCEPTED");
  assert.equal(f.source,"DERIVED_FROM_339_DOMAIN_TASKS");
  assert.equal(f.relatedScreenId,null);
  assert.equal(f.screenCrosswalk,"PENDING_ACCEPTED_MAPPING");
  assert.equal(f.backendConnected,false);
  assert.equal(f.acceptedBusinessWorkflow,false);
  assert.equal(f.approvedRegulatoryFields,false);
  assert.ok(f.fields.length>=9,f.id+" too few fields");
  assert.equal(new Set(f.fields.map(x=>x.id)).size,f.fields.length,f.id+" duplicate field ID");
  assert.ok(f.fields.every(x=>x.id&&x.label&&x.section&&typeof x.required==="boolean"&&x.type));
  assert.equal(f.workflow.states.length,6);
  assert.equal(f.workflow.authoritativeTransitions,false);
  assert.equal(f.workflow.unknownFinancialOutcomes,"HOLD_PENDING_EVIDENCE");
  assert.ok(FORM_PHASE_VARIANTS.some(x=>x.code===f.variant));
  for(const rep of f.repeaters){
   assert.ok(rep.maxRows>=rep.minRows&&rep.minRows>=1);
   assert.equal(new Set(rep.fields.map(x=>x.id)).size,rep.fields.length);
  }
 }
});
test("All 589 draft form controls fail closed for banking submissions and approvals",()=>{
 const controlNames=["editDraft","validateDraft","saveDraft","resetDraft","discardDraft","downloadDemoJson","submit","approve","execute","reconcile","print"];
 for(const f of FORMS){
  assert.deepEqual(Object.keys(f.controls),controlNames);
  assert.equal(f.controls.submit,"BLOCKED_UNAUTHENTICATED");
  assert.equal(f.controls.approve,"BLOCKED_MAKER_CHECKER");
  assert.equal(f.controls.execute,"BLOCKED_BANK_BACKEND");
  assert.equal(f.controls.reconcile,"BLOCKED_EXTERNAL_EVIDENCE");
  assert.equal(f.apiContract.command,"UNASSIGNED");
  assert.equal(f.apiContract.scope,"BANK_AND_BRANCH");
  assert.equal(f.apiContract.serverAuthorizationRequired,true);
  assert.equal(f.translationFr,"PENDING_APPROVED_COPY");
  const permission=permittedLocalActions(f,f.previewRole,"idle");
  assert.equal(permission.canEdit,true);
  assert.equal(permission.canSubmit,false);
  assert.equal(permission.canApprove,false);
  assert.equal(permission.canPost,false);
  for(const state of ["access_denied","offline_readonly","external_unknown","reconciliation_hold"]){
   assert.equal(permittedLocalActions(f,f.previewRole,state).canEdit,false,f.id+" "+state);
  }
  assert.equal(permittedLocalActions(f,"auditor","idle").canEdit,false);
 }
 assert.equal(FORM_DELIVERY.authoritativeSubmissions,0);
 assert.equal(FORM_DELIVERY.workflowAcceptances,0);
});
test("All 589 synthetic form examples validate as local-only draft structures",()=>{
 for(const f of FORMS){
  const sample=syntheticExample(f);
  assert.equal(sample.watermark,"SYNTHETIC_ONLY");
  assert.equal(sample.authorized,false);
  assert.equal(sample.posted,false);
  assert.equal(sample.bankId,null);
  const result=validateForm(f,sample.values,sample.repeated);
  assert.ok(result.valid,f.id+" synthetic example invalid: "+result.issues.map(x=>x.message).join("; "));
  assert.equal(result.bankApproved,false);
  assert.equal(result.workflowExecuted,false);
 }
});
test("Banking validation rejects unbalanced journals and unsafe integer posting amounts",()=>{
 const ledger=FORMS.find(f=>f.repeaters.some(r=>r.id==="journalLines"));
 assert.ok(ledger,"Journal form missing");
 const s=syntheticExample(ledger);
 assert.ok(validateForm(ledger,s.values,s.repeated).valid);
 s.repeated.journalLines[1].amountMinor="900";
 const bad=validateForm(ledger,s.values,s.repeated);
 assert.equal(bad.valid,false);
 assert.ok(bad.issues.some(x=>/balance independently/.test(x.message)));
 s.repeated.journalLines[1].amountMinor="9007199254740992";
 assert.equal(validateForm(ledger,s.values,s.repeated).valid,false);
});
test("Cash denomination, bulk beneficiaries, beneficial owners and repeaters validate",()=>{
 const demo=id=>{const f=FORMS.find(x=>x.repeaters.some(r=>r.id===id));assert.ok(f,id+" group not found");return [f,syntheticExample(f)]};
 const [cash,c]=demo("denominationLines");
 c.repeated.denominationLines[0].quantity="-1";
 assert.equal(validateForm(cash,c.values,c.repeated).valid,false);
 const [pay,p]=demo("beneficiaryLines");
 p.repeated.beneficiaryLines.push({...p.repeated.beneficiaryLines[0]});
 assert.equal(validateForm(pay,p.values,p.repeated).valid,false);
 const [owners,o]=demo("ownerLines");
 o.repeated.ownerLines.push({...o.repeated.ownerLines[0],ownerReference:"SYN-UBO-002"});
 assert.equal(validateForm(owners,o.values,o.repeated).valid,false);
});
test("Conditional corporate verification, role guards and date ranges are enforced locally",()=>{
 const cif=FORMS.find(f=>f.code==="CIF"&&f.fields.some(x=>x.id==="companyRegistry"));
 assert.ok(cif);
 const sample=syntheticExample(cif);
 const conditional=cif.fields.find(x=>x.id==="companyRegistry");
 assert.equal(isVisible(conditional,sample.values),false);
 sample.values.partyType="Legal entity";
 sample.values.companyRegistry="";
 assert.equal(isVisible(conditional,sample.values),true);
 assert.equal(validateForm(cif,sample.values,sample.repeated).valid,false);
 const reg=FORMS.find(x=>x.code==="REG");
 const r=syntheticExample(reg);
 r.values.periodStart="2026-11-11";
 r.values.periodEnd="2026-11-01";
 assert.equal(validateForm(reg,r.values,r.repeated).valid,false);
});
test("No real network, persistence or glow in form source and CSS",()=>{
 const code=readFileSync(new URL("../src/app.js",import.meta.url),"utf8");
 const css=readFileSync(new URL("../styles.css",import.meta.url),"utf8");
 assert.ok(!/\bfetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB/.test(code));
 assert.ok(!/box-shadow\s*:|linear-gradient|radial-gradient|filter\s*:\s*blur/i.test(css));
 for(const width of ["1200","960","680","400"])assert.ok(css.includes("max-width:"+width+"px"));
 assert.ok(css.includes(":focus-visible"));
 assert.ok(css.includes("prefers-reduced-motion"));
 assert.ok(css.includes("grid-template-columns:repeat(2,minmax(0,1fr))"));
});
