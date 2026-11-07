import {FORM_STATES} from "./forms.js";

/** Pure client-side preview validation. NEVER a substitute for bank-side enforcement. */
const blank=v=>v===null||v===undefined||String(v).trim()==="";
const integer=v=>Number.isSafeInteger(Number(v))&&String(v).trim()!=="";
export function isVisible(field,values){
 const condition=field.visibleIf;
 if(!condition)return true;
 const value=values?.[condition.field];
 return Array.isArray(condition.in)&&condition.in.includes(value);
}
function error(errors,key,message){errors.push({key,message,severity:"ERROR",source:"CLIENT_PREVIEW_ONLY"});}
function checkFields(fields,values,prefix,errors){
 for(const field of fields){
  if(!isVisible(field,values))continue;
  const v=values?.[field.id],key=prefix+field.id;
  if(field.required&&blank(v)){error(errors,key,field.label+" is required");continue;}
  if(blank(v))continue;
  const txt=String(v);
  if(field.type==="select"&&!field.options.includes(txt))error(errors,key,field.label+" must match an allowed value");
  if(field.type==="number"){
   if(!integer(v))error(errors,key,field.label+" must be a whole, safe integer");
   else {
    const n=Number(v);
    if(field.min!==undefined&&n<field.min)error(errors,key,field.label+" is less than the proposed minimum");
    if(field.max!==undefined&&n>field.max)error(errors,key,field.label+" is greater than the proposed maximum");
   }
  }
  if(field.type==="email"&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(txt))error(errors,key,field.label+" is not a valid email structure");
  if(field.type==="tel"&&!/^[+0-9() .-]{5,30}$/.test(txt))error(errors,key,field.label+" is not a valid telephone structure");
  if(field.type==="date"&&!/^\d{4}-\d{2}-\d{2}$/.test(txt))error(errors,key,field.label+" must be a valid date string");
  if(field.maxLength&&txt.length>field.maxLength)error(errors,key,field.label+" exceeds its length limit");
  if(txt.length>10000)error(errors,key,field.label+" is too long");
 }
}
export function validateForm(form,values={},repeated={}){
 if(!form||!form.id)throw Error("Form contract required");
 const issues=[];
 checkFields(form.fields,values,"",issues);
 for(const config of form.repeaters){
  const rows=repeated[config.id]||[];
  if(!Array.isArray(rows)){error(issues,config.id,"Invalid repeated-line structure");continue;}
  if(rows.length<config.minRows||rows.length>config.maxRows)error(issues,config.id,config.label+" requires "+config.minRows+" to "+config.maxRows+" rows");
  for(let i=0;i<rows.length;i++)checkFields(config.fields,rows[i]||{},config.id+"["+i+"].",issues);
 }
 for(const [start,end]of [["periodStart","periodEnd"],["payPeriodStart","payPeriodEnd"],["requestedDate","effectiveDate"]]){
  if(values[start]&&values[end]&&values[start]>values[end])error(issues,end,"End/effective date must not precede the start/request date");
 }
 if(form.repeaters.some(x=>x.id==="journalLines")){
  const lines=repeated.journalLines||[];
  const byCurrency=new Map();
  for(const line of lines){
   if(!integer(line?.amountMinor)||Number(line.amountMinor)<=0)continue;
   const c=line.currency||"UNKNOWN",amount=Number(line.amountMinor);
   const p=byCurrency.get(c)||{debit:0,credit:0,hasDebit:false,hasCredit:false};
   if(line.side==="DEBIT"){p.debit+=amount;p.hasDebit=true;}
   if(line.side==="CREDIT"){p.credit+=amount;p.hasCredit=true;}
   byCurrency.set(c,p);
  }
  for(const [ccy,p]of byCurrency){
   if(!p.hasCredit||!p.hasDebit||p.debit!==p.credit)error(issues,"journalLines","Debit and credit totals must balance independently in "+ccy);
   if(!Number.isSafeInteger(p.debit)||!Number.isSafeInteger(p.credit))error(issues,"journalLines","Aggregated journal totals exceed safe integer precision");
  }
  const gls=lines.filter(l=>l.glCode&&l.side);
  if(gls.length>=2&&gls.every(l=>l.glCode===gls[0].glCode))error(issues,"journalLines","A synthetic journal cannot debit and credit the same single account");
 }
 if(form.repeaters.some(x=>x.id==="denominationLines")){
  let total=0;const ids=new Set();
  for(const row of repeated.denominationLines||[]){
   if(ids.has(row.denomination))error(issues,"denominationLines","Duplicate denomination line");
   ids.add(row.denomination);
   if(integer(row.denomination)&&integer(row.quantity)){
    total+=Number(row.denomination)*Number(row.quantity);
    if(!Number.isSafeInteger(total))error(issues,"denominationLines","Cash total exceeds safe integer precision");
   }
  }
  if(total<=0)error(issues,"denominationLines","Cash count must contain a positive total");
 }
 if(form.repeaters.some(x=>x.id==="ownerLines")){
  const owners=repeated.ownerLines||[];
  const total=owners.reduce((v,r)=>v+(integer(r.ownershipPercent)?Number(r.ownershipPercent):0),0);
  if(total>100)error(issues,"ownerLines","Ownership shares exceed 100%");
 }
 if(form.repeaters.some(x=>x.id==="beneficiaryLines")){
  const refs=new Set();
  for(const row of repeated.beneficiaryLines||[]){
   const key=(row.beneficiaryAccount||"").trim();
   if(key&&refs.has(key))error(issues,"beneficiaryLines","Duplicate beneficiary account in this sample batch");
   if(key)refs.add(key);
  }
 }
 if(form.code==="PAY"||form.code==="CLR"){
  if(values.originAccount&&values.beneficiaryAccount&&values.originAccount===values.beneficiaryAccount)error(issues,"beneficiaryAccount","Origin and beneficiary references match; review transfer semantics");
  if(values.externalOutcome==="FINALITY_EVIDENCED"&&!values.settlementEvidence)error(issues,"settlementEvidence","External finality needs authoritative reconciliation evidence");
 }
 if(form.code==="HR"){
  const keys=["grossMinor","withholdingMinor","socialMinor","netMinor"];
  if(keys.every(k=>integer(values[k]))){
   const expected=Number(values.grossMinor)-Number(values.withholdingMinor)-Number(values.socialMinor);
   if(expected!==Number(values.netMinor))error(issues,"netMinor","Proposed net pay does not equal gross minus stated deductions (other statutory rules not verified)");
  }
 }
 if(form.code==="CRD"){
  if(integer(values.incomeMinor)&&integer(values.debtServiceMinor)&&Number(values.debtServiceMinor)>Number(values.incomeMinor))
   error(issues,"debtServiceMinor","Debt service exceeds stated income: local anomaly only, not a credit decision");
 }
 if(form.code==="EDU"&&/production|real bank/i.test(values.reason||""))error(issues,"reason","Education scenarios must remain synthetic and isolated");
 return {valid:issues.length===0,issues,clientOnly:true,bankApproved:false,workflowExecuted:false};
}
function sampleField(field,form){
 if(field.id==="partyType")return "Individual";
 if(field.id==="paymentRail")return "INTERNAL";
 if(field.type==="select")return field.options[0]||"";
 if(field.type==="date")return "2026-11-06";
 if(field.type==="email")return "sample@example.invalid";
 if(field.type==="tel")return "+237 600 000 000";
 if(field.type==="number")return String(field.min!==undefined&&field.min>0?field.min:0);
 if(field.id==="originAccount")return "SYN-ACCT-001";
 if(field.id==="beneficiaryAccount")return "SYN-ACCT-002";
 if(field.id==="currency")return "XAF";
 if(field.id==="reason")return "SYNTHETIC DATA ONLY. No real customer or banking action.";
 return "SYN-"+field.id.toUpperCase();
}
export function syntheticExample(form){
 const values=Object.fromEntries(form.fields.map(f=>[f.id,sampleField(f,form)]));
 if(form.code==="HR"){values.grossMinor="100000";values.withholdingMinor="10000";values.socialMinor="5000";values.netMinor="85000";}
 if(form.code==="CRD"){values.incomeMinor="100000";values.debtServiceMinor="25000";}
 const repeated={};
 for(const r of form.repeaters){
  let rows=[Object.fromEntries(r.fields.map(f=>[f.id,sampleField(f,form)]))];
  if(r.id==="journalLines"){
   rows=[{glCode:"SYN-GL-DR",side:"DEBIT",currency:"XAF",amountMinor:"1000"},{glCode:"SYN-GL-CR",side:"CREDIT",currency:"XAF",amountMinor:"1000"}];
  }
  if(r.id==="denominationLines")rows=[{denomination:"10000",quantity:"1"}];
  if(r.id==="beneficiaryLines")rows=[{beneficiaryReference:"SYN-BEN-001",beneficiaryAccount:"SYN-ACCT-002",currency:"XAF",amountMinor:"5000"}];
  if(r.id==="ownerLines")rows=[{ownerReference:"SYN-UBO-001",ownershipPercent:"100",ownershipEvidence:"SYN-EVIDENCE"}];
  repeated[r.id]=rows;
 }
 return {values,repeated,watermark:"SYNTHETIC_ONLY",bankId:null,authorized:false,posted:false};
}
export function permittedLocalActions(form,previewRole,uiState){
 const blocked=["access_denied","offline_readonly","version_conflict","external_unknown","reconciliation_hold"];
 const rightRole=previewRole===form.previewRole;
 const canEdit=rightRole&&!blocked.includes(uiState);
 return {canEdit,canValidate:canEdit,canSave:canEdit,canSubmit:false,canApprove:false,canPost:false,canReconcile:false};
}
export const BANK_BLOCKED_ACTIONS=Object.freeze(["submit","approve","execute","reconcile"]);
