/**
 * OPES Core Banking forms — standalone client contract register, no bank API.
 * Exactly one form contract per screen route, including query / read-only contracts
 * where the screen must not allow mutation.
 * DRAFT_FIELD_REQUIREMENTS: these are not institution-approved regulatory schemas.
 */
import {SCREENS} from "../../opes-core-banking-ui/src/catalog.js";
import {SCREEN_BLUEPRINTS} from "../../opes-core-banking-ui/src/all-screen-blueprints.js";
const familyKind={
 register:"FILTER_ONLY",detail:"READ_ONLY",workbench:"DRAFT_CAPTURE",
 review:"READ_ONLY_APPROVAL_BLOCKED",monitor:"READ_ONLY",history:"READ_ONLY",
 exceptions:"DRAFT_CAPTURE",settings:"DRAFT_CAPTURE"
};
const BLOCKED=["submit","approve","post","execute","settle","reconcile","reverse","export_authoritative","issue_document"];
const STRICT_DOMAINS=new Set(["CIF","ACT","LED","BRN","PAY","CRD","TRE","AML","REP","CHN","CARD","FEE","REC","SEC"]);
const MONEY=/minor|amount|principal|balance|interest|fee|cash|tax|deduction|salary|capital|count|term|score|percent|bps|rate|limit|income|debt|arrears|tenor|value|notional/i;
const DATES=/(?:^|_)(date|from|until|expiry|maturity|start|end)$|date|expiry|effective|maturity|period/i;
const ACCOUNT=/account|iban|drawer|vault|glcode|debitGL|creditGL|facility|customerReference|beneficiary|transactionReference/i;
const filterOnlyFields=new Set(["targetReference","filterStatus","periodStart","periodEnd","fromDate","toDate","customerReference","accountReference","branchCode","institutionCode"]);
const rule=(id,severity,message,fields,check)=>({id,severity,message,fields,check});
const moneyRule=field=>rule("money-safe-"+field.id,"error","Enter a nonnegative safe integer in minor units for "+field.label,[field.id],{op:"safe_nonnegative_integer",field:field.id});
const orderedPair=(a,b)=>rule("date-"+a+"-"+b,"error","The start date must not be later than the end date",[a,b],{op:"date_lte",from:a,to:b});
const conditional=(field,op,value,requires)=>({id:"conditional-"+field+"-"+requires.join("-"),when:{field,op,value},requires,mode:"VISIBILITY_AND_REQUIRED_WHEN_TRUE",trustedServerCheck:false});
const usesField=(fields,id)=>fields.some(x=>x.id===id);
const INPUT_TYPES={text:"text",textarea:"textarea",number:"number",date:"date",select:"select",tel:"tel",email:"email",boolean:"checkbox"};
function normalize(f){
 const type=INPUT_TYPES[f.type]||"text";
 return {id:f.id,label:f.label,type,required:!!f.required,section:f.group||"Details",
  options:type==="select"?[...(f.options||[])]:[],description:f.hint||"",
  sensitive:/identity|document|national|phone|email|address|salary|account|customer|birth|tax|medical|secret|password|pin|card|beneficial|income|pep|screening/i.test(f.id),
  dataType:type==="number"?"integer_minor_or_count":type==="date"?"iso_date":"string",
  readPolicy:"SYNTHETIC_ONLY",writePolicy:"LOCAL_BROWSER_MEMORY_ONLY"};
}
const EXTRA={
 "CIF-UI-002":[{id:"contactConsent",label:"Consent to contact",type:"select",options:["Yes","No"],required:true,group:"Consent"},{id:"beneficialOwnerLink",label:"Beneficial owner evidence reference",type:"text",required:false,group:"Ownership"}],
 "LED-UI-002":[{id:"postingPeriod",label:"Accounting period reference",type:"text",required:true,group:"Journal controls"},{id:"creditAmountMinor",label:"Credit leg amount (minor units)",type:"number",required:true,group:"Journal legs"}],
 "BRN-UI-004":[{id:"witnessReference",label:"Independent cash-count witness ID",type:"text",required:true,group:"Cash control"}],
 "CRD-UI-002":[{id:"consentCreditBureau",label:"Credit bureau consent reference",type:"text",required:true,group:"Borrower consent"},{id:"repaymentSource",label:"Repayment source evidence",type:"text",required:true,group:"Assessment"}],
 "ACT-UI-003":[{id:"independentApprovalReference",label:"Independent mandate approval reference",type:"text",required:true,group:"Authorization"}]
};
const ruleByDomain={
 CIF:["documentExpiry","identityExpiry","taxResidency","pepStatus","sourceOfFunds","consentReference"],
 LED:["postingPeriod","debitGL","creditGL","correlationId","postingRuleVersion"],
 BRN:["cashSessionReference","dualCustodyRef","witnessReference"],
 PAY:["idempotencyKey","institutionEntitlement","rail","sourceAccount","beneficiaryAccount"],
 CRD:["creditPolicy","reviewPolicyVersion","loanAgreement","creditBureauReference","consentCreditBureau"],
 TRE:["counterpartyId","limitPolicy","bankStatementEvidence"],
 AML:["screeningEvidence","caseId","ruleVersion"],
 SEC:["policyVersion","principalId","bankScope"]
};
const formChecks=[
 ["CIF-UI-002",conditional("partyType","eq","Legal entity",["beneficialOwnerLink"])],
 ["ACT-UI-003",conditional("mandateType","eq","Joint signatures",["independentApprovalReference"])],
 ["BRN-UI-004",conditional("currency","eq","XAF",["denom10000","denom5000","denom2000","denom1000","denom500","denom100"])],
 ["CRD-UI-002",conditional("borrowerType","eq","SME",["incomeEvidence"])],
 ["LED-UI-002",conditional("currency","neq","XAF",["postingPeriod"])]
];
const explicitConditional=new Map(formChecks);
const statusText={
 FILTER_ONLY:"Filter preview-only references. A bank-scoped query API is not connected.",
 READ_ONLY:"Inspect a synthetic record only. No edit or approval action is enabled.",
 READ_ONLY_APPROVAL_BLOCKED:"This is a review gate. A maker cannot approve and no authenticated reviewer is connected.",
 DRAFT_CAPTURE:"Prepare and validate a synthetic in-memory draft only."
};
function build(screen){
 const bp=SCREEN_BLUEPRINTS[screen.id];
 if(!bp)throw Error("Missing bank screen blueprint "+screen.id);
 const mode=bp.captureAllowed?"DRAFT_CAPTURE":(familyKind[bp.kind]||"READ_ONLY");
 const raw=[...bp.fields,...(EXTRA[screen.id]||[])];
 const map=new Map();
 for(const f of raw)if(!map.has(f.id))map.set(f.id,normalize(f));
 const fields=[...map.values()];
 const ids=new Set(fields.map(f=>f.id));
 const rules=[];
 for(const f of fields){
  if(f.type==="number")rules.push(moneyRule(f));
  if(f.type==="email")rules.push(rule("email-"+f.id,"error","Valid email address required",[f.id],{op:"email",field:f.id}));
 }
 for(const [a,b] of [["periodStart","periodEnd"],["fromDate","toDate"],["mandateEffective","mandateExpiry"],["effectiveFrom","effectiveUntil"],["payPeriodStart","payPeriodEnd"]]){
  if(ids.has(a)&&ids.has(b))rules.push(orderedPair(a,b));
 }
 if(ids.has("debitGL")&&ids.has("creditGL"))rules.push(rule("different-ledger-legs","error","Debit and credit GL accounts must differ",["debitGL","creditGL"],{op:"not_equal",left:"debitGL",right:"creditGL"}));
 if(ids.has("creditAmountMinor")&&ids.has("amountMinor"))rules.push(rule("balanced-two-legs","error","Credit and debit leg amounts must match",["creditAmountMinor","amountMinor"],{op:"equal_numbers",left:"creditAmountMinor",right:"amountMinor"}));
 if(ids.has("ownershipPercent"))rules.push(rule("ownership-range","error","Ownership percentage must be between 0 and 100",["ownershipPercent"],{op:"integer_range",field:"ownershipPercent",min:0,max:100}));
 if(screen.id==="BRN-UI-004")rules.push(rule("cash-denomination-difference","warning","Cash-count difference requires reconciliation and witness evidence",["expectedMinor","denom10000","denom5000"],{op:"denomination_count_check",currency:"XAF",expectedField:"expectedMinor",denominations:{denom10000:10000,denom5000:5000,denom2000:2000,denom1000:1000,denom500:500,denom100:100}}));
 const cond=(explicitConditional.get(screen.id)||[]).filter(x=>ids.has(x.when.field)&&x.requires.every(y=>ids.has(y)));
 const sections=[...new Set(fields.map(f=>f.section))].map((name,index)=>({id:"section-"+index,name,fields:fields.filter(f=>f.section===name).map(f=>f.id)}));
 const query=mode==="FILTER_ONLY";
 const stateMachine={start:"idle",states:["idle","editing_local","local_invalid","local_saved","readonly","access_denied","pending_server","outcome_unknown","hold_for_reconciliation","server_error"],
  transitions:{idle:query?["readonly"]:mode==="DRAFT_CAPTURE"?["editing_local","readonly"]:["readonly"],
   editing_local:["local_invalid","local_saved","readonly"],local_invalid:["editing_local"],local_saved:["editing_local","readonly"],
   readonly:["idle"],access_denied:["idle"],pending_server:[],outcome_unknown:[],hold_for_reconciliation:[],server_error:["idle"]},
  executableBackendTransitions:[]};
 return {id:"FORM-"+screen.id,screenId:screen.id,domain:screen.domain,name:screen.name+" — "+(query?"search criteria":mode==="DRAFT_CAPTURE"?"draft data form":"inspection form"),
  version:"0.1.0-draft",status:"UI_CONTRACT_PROPOSED_NOT_APPROVED",mode,purpose:statusText[mode],
  roles:bp.roles,sections,fields,conditionalRules:cond,validationRules:rules,
  frontendActions:{saveLocal:{enabled:mode==="DRAFT_CAPTURE",lifetime:"PAGE_SESSION_MEMORY_ONLY"},
    reset:{enabled:true},inspect:{enabled:true},exportLocal:{enabled:false},submit: {enabled:false,reason:"Trusted banking API and authorization missing"},
    approve:{enabled:false,reason:"Bank-authoritative independent reviewer required"},
    post:{enabled:false,reason:"Ledger invariant and accepted posting API required"},
    reconcile:{enabled:false,reason:"External settlement/finality evidence required"}},
  backend:{apiContract:"UNBOUND",makerChecker:"BLOCKED",tenantScope:"NOT_SERVER_ENFORCED",
   idempotency:"NOT_IMPLEMENTED",audit:"LOCAL_UI_ONLY",releaseApproved:false},
  states:stateMachine,reviewGates:["complete_bank_type_requirements","approved_field_schema",
   "server_validation","tenant_and_branch_scope","maker_checker","financial_integrity",
   "idempotency_and_outbox","audit_provenance","regulatory_legal_review","responsive_accessibility"],
  approvedForProduction:false};
}
export const FORMS=Object.freeze(SCREENS.map(build));
export const FORM_BY_ID=new Map(FORMS.map(f=>[f.id,f]));
export const FORM_BY_SCREEN=new Map(FORMS.map(f=>[f.screenId,f]));
export const FORM_STATISTICS=Object.freeze({total:FORMS.length,domains:new Set(FORMS.map(f=>f.domain)).size,
 capture:FORMS.filter(f=>f.mode==="DRAFT_CAPTURE").length,
 readOnly:FORMS.filter(f=>f.mode!=="DRAFT_CAPTURE").length,
 validationRules:FORMS.reduce((a,f)=>a+f.validationRules.length,0),
 conditionalRules:FORMS.reduce((a,f)=>a+f.conditionalRules.length,0),
 approved:0,backendConnected:0});
