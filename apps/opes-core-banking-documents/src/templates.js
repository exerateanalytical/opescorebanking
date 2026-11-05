import {TEMPLATE_GROUPS} from "./registry-seeds.js";

/**
 * A document definition is NOT a form, issued financial record, accounting mapping
 * or contractual legal instrument. Field requirements are candidate design inputs,
 * never a substitute for verified authoritative bank/regulator contracts.
 */
const field=(id,label,type="text",required=true,section="Identification")=>({id,label,type,required,section});
const f=(id,label,section="Details",required=true)=>field(id,label,"text",required,section);
const m=(id,label,section="Monetary details",required=true)=>field(id,label,"money",required,section);
const d=(id,label,section="Dates",required=true)=>field(id,label,"date",required,section);
const t=(id,label,section="Narrative",required=true)=>field(id,label,"textarea",required,section);
const yes=(id,label,section="Declarations",required=true)=>field(id,label,"boolean",required,section);
const BASE=[
 f("institutionName","Institution legal name","Institution header"),
 f("institutionLicense","Institution regulatory/license reference","Institution header"),
 f("institutionAddress","Head office / authorized branch","Institution header"),
 f("branchCode","Branch code","Institution header"),
 f("documentReference","Document reference","Document control"),
 d("issueDate","Issue date","Document control"),
 f("documentVersion","Document template version","Document control"),
 f("preparedBy","Prepared by (role/reference)","Document control",false),
 f("approvedBy","Authorized reviewer (reference only)","Document control",false)
];
const customer=[f("customerReference","Customer ID / CIF reference","Customer identity"),f("customerName","Customer legal name","Customer identity"),f("customerAddress","Customer address","Customer identity",false),f("identityEvidence","Identity/KYC evidence reference","Customer identity",false)];
const account=[f("accountReference","Masked account reference","Account details"),f("productCode","Product code","Account details"),f("currency","Currency code","Account details")];
const period=[d("periodStart","Period start","Period"),d("periodEnd","Period end","Period")];
const amount=[m("amountMinor","Amount in minor units"),f("currency","Currency code","Monetary details")];
const transaction=[f("transactionReference","Transaction correlation reference","Transaction"),d("valueDate","Value date","Transaction"),f("transactionStatus","Authoritative transaction status","Transaction")];
const loan=[f("facilityReference","Loan / facility reference","Credit"),m("principalMinor","Principal in minor units","Credit"),m("nominalInterestBps","Nominal rate in basis points","Credit"),m("tegBasisPoints","Effective rate (TEG), basis points","Credit"),m("feesMinor","Credit fees (minor units)","Credit"),f("currency","Credit currency","Credit"),m("termMonths","Credit term in months","Credit"),d("maturityDate","Scheduled maturity date","Credit"),f("repaymentFrequency","Repayment periodicity","Credit"),f("policyVersion","Approved pricing / lending policy version","Credit")];
const collateral=[f("securityReference","Security / collateral reference","Collateral"),f("ownerOrGuarantor","Owner / guarantor legal name","Collateral"),f("securityDescription","Security asset description","Collateral"),f("valuationEvidence","Independent valuation evidence","Collateral"),f("registrationEvidence","Perfection / registration evidence","Collateral",false)];
const employee=[f("employeeReference","Employee staff ID","Employee identity"),f("employeeName","Employee legal name","Employee identity"),f("position","Position / pay grade","Employee identity"),d("payPeriodStart","Pay period start","Payroll"),d("payPeriodEnd","Pay period end","Payroll")];
const payroll=[m("basePayMinor","Base pay (minor units)","Payroll earnings"),m("allowanceMinor","Allowances (minor units)","Payroll earnings",false),m("overtimeMinor","Overtime earnings (minor units)","Payroll earnings",false),m("taxWithheldMinor","Income tax withheld (minor units)","Payroll deductions"),m("socialContributionMinor","Social security contribution (minor units)","Payroll deductions"),m("otherDeductionMinor","Other deductions (minor units)","Payroll deductions",false),m("netPayMinor","Authorized net pay (minor units)","Payroll net")];
const risk=[f("riskRating","Risk classification / severity","Risk evidence"),f("riskCaseReference","Risk/investigation case ID","Risk evidence"),t("reviewRationale","Assessment and source evidence","Risk evidence"),f("independentReviewer","Independent review ID","Authorizations")];
const regulatory=[f("reportingAuthority","Reporting institution / authority","Regulatory mapping"),f("returnCode","Authorized return form code","Regulatory mapping"),f("ruleVersion","Effective regulatory rule version","Regulatory mapping"),f("sourceLineage","Financial data and evidence lineage","Regulatory mapping"),...period];
const generic=[f("subjectReference","Subject / business object ID","Business subject"),t("purpose","Purpose and justification","Business subject"),f("evidenceReference","Supporting evidence reference","Evidence")];
const rows=[f("rowReference","Row reference","Tabular data"),d("rowDate","Line date","Tabular data"),t("rowNarrative","Line narrative","Tabular data",false),m("rowDebitMinor","Debit, minor units","Tabular data",false),m("rowCreditMinor","Credit, minor units","Tabular data",false),m("rowBalanceMinor","Balance, minor units","Tabular data",false)];
const sign=[f("authorizedSignatory","Authorized signatory ID (not a signature)","Authorization"),f("approvalEvidence","Independent approval evidence reference","Authorization",false)];
const clock=[f("issuedAt","Trusted issue timestamp","Document control",false),f("sourceSnapshot","Authoritative data snapshot / version","Document control",false)];
const topicExtras=[
 [/account|savings|deposit|standing instruction|mandate/i,account],
 [/statement|report|return|schedule|register|balance|reconciliation|summary|scorecard|cash flow/i,period],
 [/loan|credit|lending|amortization|arrears|repayment|borrowing|loan balance|loan early|term sheet|product pricing/i,loan],
 [/collateral|guarant|mortgage|pledge|security document|lien|valuation/i,collateral],
 [/employee|payroll|salary|payslip|employment|leave|overtime|pay grade|pension/i,employee],
 [/risk|fraud|investig|sanction|pep|screen|aml|compliance|prudential/i,risk],
 [/settlement|payment|transfer|cash|withdrawal|receipt|transaction|teller|vault/i,transaction],
 [/regulatory|prudential|capital|supervisor|central bank|cobac/i,regulatory]
];
const FAMILY_RULES=[
 ["payslip",/payslip|salary certificate/i],
 ["amortization",/amortization|repayment schedule|maturity ladder/i],
 ["statement",/statement|trial balance|ledger extract|account extract|balance sheet|income statement|cash flow/i],
 ["receipt",/receipt|cash deposit slip|cash withdrawal slip|payment confirmation|transfer confirmation/i],
 ["agreement",/agreement|contract draft|contract$|loan offer letter|pledge|guarantee agreement|mortgage documentation/i],
 ["regulatory",/regulatory|prudential|solvency|submission|supervisory|central bank/i],
 ["certificate",/certificate|certification|attestation|ownership certificate|clearance certificate/i],
 ["voucher",/voucher|journal|payment approval|payment authorization|purchase order|goods received/i],
 ["application",/application|request|onboarding|enrollment|registration|change form/i],
 ["checklist",/checklist|control sheet|evidence package|inspection|audit|closing position|opening position/i],
 ["notice",/notice|letter|advice|notification|acknowledg|confirmation|disclosure/i],
 ["register",/register|inventory|schedule|matrix|calendar|list|workpaper/i],
 ["mandate",/mandate|delegation|authorization|consent|declaration/i],
 ["assessment",/assessment|appraisal|evaluation|review|risk rating|investigation/i],
 ["report",/report|memorandum|brief|scorecard|position|analysis|performance|decision/i]
];
const CONFIDENTIAL_GROUPS=new Set(["KYC","AML","FRD","RSK","HR","SEC","CRD","COL"]);
const LEGAL_GROUPS=new Set(["CIF","KYC","PRD","ACT","DEP","CRD","COL","CARD","CHN","HR"]);
const regulatoryBasis={
 credit:["CEMAC/UMAC consumer-protection controls — effective text must be verified","Règlement 04/19 on TEG/conditions de banque — applicable version to verify"],
 consumer:["Règlement 01/20/CEMAC/UMAC/COBAC — consumer protection; applicability and version to verify"],
 financial:["Bank/microfinance sector-specific COBAC/PCEC mapping; SYSCOHADA not assumed"],
 hr:["Cameroon labour and payroll contribution rules; applicable law/version to verify"],
 payment:["BEAC/COBAC payments and rail rules; institution entitlements to verify"],
 general:["Institution-approved policy and applicable CEMAC/Cameroon regulations to verify"]
};
function dedupe(fields){const map=new Map();for(const field of fields){if(!map.has(field.id))map.set(field.id,field);}return [...map.values()];}
function resolveFamily(name){return (FAMILY_RULES.find(([,pattern])=>pattern.test(name))||["record"])[0];}
function domainFields(code){
 switch(code){
 case "CIF":case "KYC":return customer;
 case "ACT":case "DEP":return [...customer,...account];
 case "BRN":return [...account,...amount,...transaction];
 case "PAY":case "CLR":case "CHN":case "CARD":return [...customer,...account,...amount,...transaction];
 case "LED":case "FIN":return [...amount,...rows];
 case "CRD":return [...customer,...account,...loan];
 case "COL":return [...customer,...collateral];
 case "TRE":return [...amount,...transaction];
 case "AML":case "FRD":case "RSK":return [...customer,...risk];
 case "REG":return regulatory;
 case "HR":return [...employee,...payroll];
 case "PRC":return [...amount,...generic];
 case "EDU":return [f("simulationId","Synthetic training-bank scenario ID","Simulation"),f("instructorId","Instructor ID","Simulation"),f("learnerId","Learner ID","Simulation")];
 default:return generic;
 }
}
function familyFields(family,code){
 if(family==="payslip")return [...employee,...payroll];
 if(family==="amortization")return [...loan,...period];
 if(family==="statement")return [...period,...account,...rows];
 if(family==="receipt")return [...amount,...transaction,f("processedBy","Teller / payment processor","Transaction")];
 if(family==="agreement")return [...loan,collateral[0],t("legalClauses","Legal clauses [UNAPPROVED placeholder]","Legal provisions"),...sign];
 if(family==="regulatory")return [...regulatory,...sign];
 if(family==="certificate")return [...sign,f("verificationToken","Trusted verification token (not generated)","Security",false)];
 if(family==="voucher")return [...amount,...sign];
 if(family==="application")return [...customer,yes("declarationConfirmed","Accuracy declaration confirmed"),...sign];
 if(family==="checklist")return [yes("controlCompleted","Required control steps completed"),f("reviewEvidence","Review evidence reference","Control")];
 if(family==="notice")return [d("effectiveDate","Effective date"),f("recipientReference","Recipient reference","Communication"),...sign];
 if(family==="register")return [...rows,...period];
 if(family==="mandate")return [f("mandateType","Mandate category","Mandate"),d("effectiveFrom","Effective from"),...sign];
 if(family==="assessment")return [...risk,yes("assessmentComplete","Review complete")];
 if(family==="report")return [...period,...rows];
 return generic;
}
function chooseBasis(code,pattern){
 if(["CRD","COL"].includes(code)||/credit|loan|borrowing|guarant/i.test(pattern))return regulatoryBasis.credit;
 if(["ACT","DEP","CIF","KYC","PRD"].includes(code))return regulatoryBasis.consumer;
 if(["LED","FIN","REG"].includes(code))return regulatoryBasis.financial;
 if(code==="HR")return regulatoryBasis.hr;
 if(["PAY","CLR","CHN","CARD"].includes(code))return regulatoryBasis.payment;
 return regulatoryBasis.general;
}
function sectionsFor(fields,family,name){
 const groups=[...new Set(fields.map(f=>f.section))];
 const practical=["Institution header","Document control","Customer identity","Account details","Credit","Collateral","Financial details","Monetary details","Transaction","Payroll earnings","Payroll deductions","Payroll net","Regulatory mapping","Risk evidence","Authorization","Evidence","Narrative"];
 const sorted=groups.sort((a,b)=>{const i=practical.indexOf(a),j=practical.indexOf(b);return(i<0?99:i)-(j<0?99:j)});
 const extra=family==="agreement"?["Essential contractual conditions — draft placeholders only","Parties' rights, obligations and applicable law require legal review"]:
  family==="regulatory"?["Regulatory reconciliation and sign-off is not connected"]:
  family==="payslip"?["Calculations and statutory deductions require approved payroll evidence"]:
  family==="statement"?["Running balances and movement records require authoritative ledger extracts"]: [];
 return {groups:sorted,legalNotes:extra};
}
const catalogue=[];
for(const [code,quota,owner,group,namesString] of TEMPLATE_GROUPS){
 const names=namesString.split(";").map(x=>x.trim()).filter(Boolean);
 if(names.length!==quota)throw Error(code+" expected "+quota+" but "+names.length);
 for(let i=0;i<names.length;i++){
  const name=names[i],family=resolveFamily(name);
  const fields=dedupe([...BASE,...domainFields(code),...familyFields(family,code),...topicExtras.filter(([re])=>re.test(name)).flatMap(x=>x[1]),...clock]);
  const id="DOC-"+code+"-"+String(i+1).padStart(3,"0");
  const pages=family==="receipt"?"A5":family==="statement"||family==="amortization"||family==="regulatory"?"A4-LANDSCAPE":"A4";
  const {groups,legalNotes}=sectionsFor(fields,family,name);
  const legalSensitive=LEGAL_GROUPS.has(code)||family==="agreement"||family==="notice";
  catalogue.push({id,code,screenDomain:owner,group,name,family,version:"0.1.0-draft",status:"DRAFT_NOT_APPROVED",
   layout:{paper:pages,orientation:pages==="A4-LANDSCAPE"?"landscape":"portrait",family,typography:"Inter/Arial/system",marginMm:pages==="A5"?11:14},
   confidentiality:CONFIDENTIAL_GROUPS.has(code)?"CONFIDENTIAL":"INTERNAL",
   fields,requiredFieldCount:fields.filter(f=>f.required).length,sections:groups,legalNotes,
   regulatoryReferences:chooseBasis(code,name),legalReviewRequired:legalSensitive,
   signatures:{enabled:false,requiresVerifiedSigner:true,requiresAuditProof:true},
   qrVerification:{enabled:false,requiresTrustedToken:true,requiresVerifiedEndpoint:true},
   workflow:{generation:"SPECIMEN_PREVIEW_ONLY",authorization:"BLOCKED",finalIssue:"BLOCKED"},
   supportedLanguages:["en"],requestedLanguages:["en","fr"],frenchTranslationStatus:"NOT_COMPLETE",
   retentionPolicy:"INSTITUTION_SPECIFIC_UNVERIFIED",sourceData:"SYNTHETIC_OR_APPROVED_DATA_ONLY",
   approvedForProduction:false});
 }
}
export const TEMPLATES=Object.freeze(catalogue);
export const TEMPLATE_BY_ID=new Map(TEMPLATES.map(x=>[x.id,x]));
export const TEMPLATE_GROUP_COUNTS=Object.fromEntries(TEMPLATE_GROUPS.map(([code])=>[code,TEMPLATES.filter(x=>x.code===code).length]));
export const TEMPLATE_FAMILIES=[...new Set(TEMPLATES.map(x=>x.family))].sort();
export const CATALOGUE_STATE=Object.freeze({total:TEMPLATES.length,productionAccepted:0,legalApproved:0,printSpecimens:true,customerIssueEnabled:false,authoritativeBackend:false});
export const GENERIC_SOURCE_NOTICE="407 specifically named documents have reusable family-level layouts and proposed field contracts; no human-reviewed legal language or regulatory mapping is supplied.";
