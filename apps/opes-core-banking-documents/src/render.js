import {PRINT_CSS} from "./print-css.js";
import {TEMPLATE_BY_ID} from "./templates.js";

const escapeHtml=(value)=>String(value===null||value===undefined?"":value).replace(/[&<>"']/g,letter=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[letter]));
const val=(data,id)=>data&&Object.prototype.hasOwnProperty.call(data,id)&&data[id]!==""&&data[id]!==null?escapeHtml(data[id]):"_________________";
const block=(data,id)=>(data&&data[id]!==undefined&&data[id]!==null&&String(data[id]).trim()!=="")?escapeHtml(data[id]):"Awaiting authorized source data";
const fieldHtml=(f,data)=>'<div class="field-unit"><span class="key">'+escapeHtml(f.label)+(f.required?' <b aria-label="required">*</b>':'')+'</span><div class="value'+(f.type==="textarea"?" long-value":"")+'">'+val(data,f.id)+'</div></div>';
const section=(title,inner)=>'<section class="doc-section"><h2>'+escapeHtml(title)+'</h2>'+inner+'</section>';
const dataGrid=(fields,data)=>'<div class="field-grid">'+fields.map(f=>fieldHtml(f,data)).join("")+'</div>';
const table=(heads,rows)=>'<table><thead><tr>'+heads.map((h,i)=>'<th'+(i>1?' class="number"':'')+' scope="col">'+escapeHtml(h)+'</th>').join("")+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+row.map((v,i)=>'<td'+(i>1?' class="number"':'')+'>'+escapeHtml(v)+'</td>').join("")+'</tr>').join("")+'</tbody></table>';
const placeRows=(n,col)=>Array.from({length:n},(_,i)=>Array.from({length:col},()=>i===0?"—":""));
function familyContent(template,data){
 const family=template.family;
 const amount=val(data,data?.principalMinor?"principalMinor":"amountMinor");
 const ccy=val(data,"currency");
 if(family==="receipt"){
  const reference=val(data,"transactionReference");
  const body='<div class="receipt-amount"><small>TRANSACTION AMOUNT · SAMPLE / UNVERIFIED</small><strong>'+amount+' '+ccy+'</strong></div>';
  const particulars=dataGrid(template.fields.filter(f=>["transactionReference","valueDate","transactionStatus","accountReference","customerReference"].includes(f.id)),data);
  return body+section("Receipt particulars",particulars)+section("Processing evidence",dataGrid(template.fields.filter(f=>["processedBy","approvedBy","evidenceReference"].includes(f.id)),data));
 }
 if(family==="statement"){
  const facts='<div class="top-facts"><div class="fact"><label>Statement period</label><strong>'+val(data,"periodStart")+' — '+val(data,"periodEnd")+'</strong></div><div class="fact"><label>Account / authoritative source</label><strong>'+val(data,"accountReference")+'</strong></div></div>';
  const content=section("Statement movements · authoritative ledger required",table(["Value date","Description / event","Debit","Credit","Balance"],placeRows(8,5)));
  return facts+content+section("Opening and closing balance verification",dataGrid(template.fields.filter(f=>["currency","rowBalanceMinor","sourceSnapshot","approvedBy"].includes(f.id)),data));
 }
 if(family==="payslip"){
  const earnings=[["Base earnings",val(data,"basePayMinor")],["Allowances",val(data,"allowanceMinor")],["Overtime",val(data,"overtimeMinor")]];
  const deductions=[["Income tax withholding",val(data,"taxWithheldMinor")],["Social security contribution",val(data,"socialContributionMinor")],["Other deductions",val(data,"otherDeductionMinor")]];
  const line=row=>'<div class="pay-line"><span>'+escapeHtml(row[0])+'</span><strong>'+row[1]+'</strong></div>';
  return section("Employee & pay period",dataGrid(template.fields.filter(f=>["employeeReference","employeeName","position","payPeriodStart","payPeriodEnd"].includes(f.id)),data))+
   '<div class="payslip-panels"><section class="pay-panel"><h3>Earnings</h3>'+earnings.map(line).join("")+'</section><section class="pay-panel"><h3>Deductions</h3>'+deductions.map(line).join("")+'</section></div>'+
   '<div class="strong-area"><div><small>Authorized net pay · requires payroll engine</small><strong>'+val(data,"netPayMinor")+'</strong></div><div><small>Currency</small><strong>XAF / verify institution</strong></div></div>'+
   '<div class="contract-note">Payroll, CNPS and tax calculations are not implemented by this template. No amount is validated or legally certified.</div>';
 }
 if(family==="amortization"){
  return section("Principal and terms",dataGrid(template.fields.filter(f=>["facilityReference","principalMinor","nominalInterestBps","tegBasisPoints","termMonths","repaymentFrequency","maturityDate"].includes(f.id)),data))+
   section("Amortization schedule · calculated service required",table(["Instalment date","Payment","Principal","Interest/fees","Balance"],placeRows(12,5)));
 }
 if(family==="agreement"){
  const clauses=[
   ["1 · Parties and obligations","Exact contracting parties, legal capacity, product obligations and consumer information require signed legal wording."],
   ["2 · Rates, pricing and fees","TEG, nominal rates, exclusions, fees and computation method require product-policy evidence and legal review."],
   ["3 · Payment and duration","Repayment schedule, due dates, default, early settlement and termination must derive from the accepted credit contract."],
   ["4 · Guarantees and enforcement","Applicable collateral perfection, guarantee consents, security rights and remedies require counsel approval."],
   ["5 · Governing law and dispute handling","CEMAC/Cameroon statutory clauses, jurisdiction and consumer complaint handling require legal approval."]
  ];
  return section("Parties and proposed terms",dataGrid(template.fields.filter(f=>["customerReference","customerName","facilityReference","principalMinor","nominalInterestBps","tegBasisPoints","feesMinor","termMonths","securityReference"].includes(f.id)),data))+
   '<div class="contract-note"><strong>UNAPPROVED LEGAL DRAFT.</strong> The following are drafting placeholders, NOT operative clauses. Never execute or issue without counsel approval and versioned institution policies.</div>'+
   '<div class="contract-clauses">'+clauses.map(c=>'<div class="contract-clause"><strong>'+escapeHtml(c[0])+'</strong><p>'+escapeHtml(c[1])+'</p></div>').join("")+'</div>';
 }
 if(family==="regulatory"){
  return section("Regulatory return identification",dataGrid(template.fields.filter(f=>["reportingAuthority","returnCode","ruleVersion","sourceLineage","periodStart","periodEnd"].includes(f.id)),data))+
   section("Reporting lines · external mapping required",table(["Line ID","Regulatory concept","Reported value","Reconciliation","Evidence"],placeRows(9,5)))+
   '<div class="contract-note">This is not an approved COBAC/BEAC filing layout. Regulator-assigned return codes, cell mappings and controls must be imported from authoritative operative instructions.</div>';
 }
 if(family==="certificate"){
  return '<div class="certificate-center"><div class="monogram" aria-hidden="true">◇</div><span class="section-label">DRAFT CERTIFICATE · NO VERIFIED ISSUANCE</span><strong>'+escapeHtml(template.name)+'</strong><p>This specimen records proposed certification fields only; no bank authority, validity or digitally signed evidence is asserted.</p><div class="top-facts"><div class="fact"><label>Subject/reference</label><strong>'+val(data,"subjectReference")+'</strong></div><div class="fact"><label>Document reference</label><strong>'+val(data,"documentReference")+'</strong></div></div></div>';
 }
 if(family==="voucher"){
  return section("Voucher / transaction reference",dataGrid(template.fields.filter(f=>["transactionReference","accountReference","documentReference","amountMinor","currency","valueDate"].includes(f.id)),data))+
   section("Posting legs · authorization required",table(["GL / account","Reference","Debit","Credit"],placeRows(4,4)));
 }
 if(family==="notice"){
  return section("Recipient and notice dates",dataGrid(template.fields.filter(f=>["customerName","customerReference","recipientReference","effectiveDate","issueDate"].includes(f.id)),data))+
   '<section class="doc-section"><h2>Notice text (pending approved wording)</h2><p>To the intended recipient:</p><p>This layout is a draft notice container. No notice of account action, fee, legal obligation or regulatory event has been actually sent or applied.</p><p>Approved institution wording, communications consent and effective date must be provided by the issuing service.</p></section>';
 }
 if(family==="mandate"){
  return section("Mandate details",dataGrid(template.fields.filter(f=>/mandate|signatory|authority|customer|account|effective/i.test(f.id)),data))+
   '<div class="contract-note">No mandate is valid without established signatory authority, signature evidence, policy validation and bank-side approval.</div>';
 }
 if(family==="application"){
  return section("Applicant / request profile",dataGrid(template.fields.filter(f=>/customer|employee|account|facility|application|transaction|branch/i.test(f.id)),data))+
   section("Declarations and authorizations",dataGrid(template.fields.filter(f=>/declaration|consent|authorized|approval|reason|evidence/i.test(f.id)),data));
 }
 if(family==="assessment"){
  return section("Assessment subject",dataGrid(template.fields.filter(f=>/risk|customer|employee|case|reference|rating/i.test(f.id)),data))+
   section("Review basis and findings",dataGrid(template.fields.filter(f=>/review|rationale|evidence|purpose|decision|approval/i.test(f.id)),data));
 }
 if(family==="checklist"){
  return section("Control evidence",table(["Control item","Proposed evidence","Review status"],[["Identity and scope","—","Unverified"],["Policy and effective version","—","Unverified"],["Independent authorization","—","Unverified"],["Reconciliation / output review","—","Unverified"]]));
 }
 if(family==="register"){
  return section("Register entries",table(["Record reference","Date/period","Description","Status","Review evidence"],placeRows(8,5)));
 }
 if(family==="report"){
  return section("Report observations",table(["Metric / reference","Source","Value","Status","Period"],placeRows(8,5)))+
   section("Narrative analysis",'<div class="field-grid"><div class="field-unit"><span class="key">Conclusion from authoritative data</span><div class="value long-value">Not available in the specimen. No report calculation has been performed.</div></div></div>');
 }
 return section("Primary record",dataGrid(template.fields.filter(f=>f.section!=="Institution header"&&f.section!=="Document control").slice(0,12),data));
}
const signatureHtml='<div class="signature-grid"><div class="signature-block"><label>Prepared / reviewed by</label><small>Signature not applied — bank authorization unavailable</small></div><div class="signature-block"><label>Authorized institution signatory</label><small>No signature, stamp or seal has been generated</small></div></div>';
function groupFields(template,data){
 const skip=new Set(["Institution header","Document control"]);
 const groups=template.sections.filter(x=>!skip.has(x));
 return groups.map(group=>{
  const fields=template.fields.filter(f=>f.section===group);
  if(!fields.length)return "";
  return section(group,dataGrid(fields,data));
 }).join("");
}
const auditNotes=(template)=>'<div class="audit-remarks"><strong>Approval and provenance restrictions</strong>'+template.regulatoryReferences.map(ref=>'<div>'+escapeHtml(ref)+'</div>').join("")+
 '<div>Template status: DRAFT · Legal review: '+(template.legalReviewRequired?"REQUIRED":"POLICY REVIEW REQUIRED")+' · Source: synthetic/authorized data only · Template ID: '+escapeHtml(template.id)+'</div></div>';
export function renderDocumentHtml(templateOrId,data={},options={}){
 const template=typeof templateOrId==="string"?TEMPLATE_BY_ID.get(templateOrId):templateOrId;
 if(!template||!template.id)throw Error("Unknown document type");
 const language=options.lang||"en";
 if(language!=="en")throw Error("French translation is not yet approved. English specimen only.");
 const family=template.family;
 const fullFields=groupFields(template,data);
 const extra=familyContent(template,data);
 const title=escapeHtml(template.name);
 const page=template.layout.paper==="A5"?"a5":template.layout.paper==="A4-LANDSCAPE"?"landscape":"";
 const core='<article class="print-page layout-'+escapeHtml(family)+' '+page+'" aria-label="'+title+' draft specimen">'+
  '<div class="doc-topbar"></div><div class="specimen">SPECIMEN · NOT VALID</div>'+
  '<header class="doc-header"><div class="bank-ident"><div class="bank-symbol" aria-hidden="true">O</div><div><div class="bank-name">'+block(data,"institutionName")+'</div><div class="bank-identity-lines">Institution: '+val(data,"institutionLicense")+'<br>Branch: '+val(data,"branchCode")+'<br>'+val(data,"institutionAddress")+'</div></div></div>'+
  '<div class="document-id"><span>Document ID</span><strong>'+escapeHtml(template.id)+'</strong><span>Reference</span><strong>'+val(data,"documentReference")+'</strong><span>Version</span><strong>'+escapeHtml(template.version)+'</strong></div></header>'+
  '<h1 class="doc-title">'+title+'</h1><p class="doc-subtitle">'+escapeHtml(template.group)+' · '+escapeHtml(family)+' · Issue date: '+val(data,"issueDate")+'</p>'+
  '<div class="doc-top-warning"><strong>UNAPPROVED DOCUMENT SPECIMEN.</strong> Not issued, signed, verified, regulator-approved or legally operative. Financial values and business statuses require authenticated authoritative data.</div>'+
  extra+fullFields+(["receipt","payslip","statement","regulatory","amortization"].includes(family)?"":signatureHtml)+auditNotes(template)+
  '<footer class="doc-footer"><div><strong>OPES Core Banking · Document Design System</strong>Internal draft · Confidentiality: '+escapeHtml(template.confidentiality)+' · Record retention policy not approved</div>'+
  '<div class="verification-block">VERIFICATION<br>NOT AVAILABLE<br>No trusted QR/token</div></footer></article>';
 return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'+
  '<meta name="robots" content="noindex,nofollow"><title>'+escapeHtml(template.id+' — '+template.name)+'</title><style>'+PRINT_CSS+'</style></head><body>'+core+'</body></html>';
}
export function demoData(templateOrId){
 const template=typeof templateOrId==="string"?TEMPLATE_BY_ID.get(templateOrId):templateOrId;
 if(!template)throw Error("Unknown document");
 const base={institutionName:"DEMO BANK · NOT LICENSED",institutionLicense:"NOT APPLICABLE — DEMO",institutionAddress:"Cameroon · simulated branch",branchCode:"DEMO-001",documentReference:"SAMPLE-"+template.id,documentVersion:"0.1.0-draft",issueDate:"2026-11-06",customerName:"SAMPLE CUSTOMER",customerReference:"SYN-CIF-001",accountReference:"•••• 0001",productCode:"SAMPLE-PRODUCT",currency:"XAF",transactionReference:"DEMO-EVENT-0001",valueDate:"2026-11-06",transactionStatus:"NOT POSTED",periodStart:"2026-01-01",periodEnd:"2026-01-31",employeeName:"SAMPLE EMPLOYEE",employeeReference:"DEMO-EMP-001",payPeriodStart:"2026-10-01",payPeriodEnd:"2026-10-31",facilityReference:"DEMO-LOAN-001",principalMinor:"—",amountMinor:"—",riskRating:"UNASSESSED",ruleVersion:"UNVERIFIED"};
 return base;
}
