import {FORM_GROUP_SEEDS,FORM_PHASE_VARIANTS} from "./registry-seeds.js";

/** CLIENT FORM PROPOSALS ONLY — never authoritative banking contracts or regulatory approval. */
const field=(id,label,type="text",section="Details",required=true,options=[],extra={})=>({id,label,type,section,required,options,...extra});
const text=(id,label,section="Details",required=true,extra={})=>field(id,label,"text",section,required,[],extra);
const number=(id,label,section="Amounts",required=true,extra={})=>field(id,label,"number",section,required,[],{integer:true,min:0,...extra});
const amount=(id,label="Amount (minor currency units)",required=true)=>number(id,label,"Amounts",required,{min:1});
const date=(id,label,section="Effective dates",required=true)=>field(id,label,"date",section,required);
const select=(id,label,options,section="Classification",required=true,extra={})=>field(id,label,"select",section,required,options,extra);
const narrative=(id,label="Supporting business rationale",section="Evidence",required=true)=>field(id,label,"textarea",section,required,[],{maxLength:1200});
const email=(id,label,section="Contacts",required=false)=>field(id,label,"email",section,required);
const tel=(id,label,section="Contacts",required=false)=>field(id,label,"tel",section,required);
const yesNo=["Yes","No","Unverified"];
const currencies=["XAF","EUR","USD"];
const COMMON=[
 text("institutionReference","Institution ID (synthetic)","Institution scope"),
 text("branchReference","Branch identifier (synthetic)","Institution scope",false),
 text("aggregateReference","Case / entity reference (synthetic)","Record identification"),
 text("requestReference","Client request / correlation key","Record identification"),
 number("expectedVersion","Expected record version","Concurrency",true,{min:0}),
 text("policyVersion","Institution-approved policy version reference","Concurrency"),
 text("initiatorReference","Initiator principal reference","Authorization"),
 date("requestedDate","Proposed request date","Effective dates"),
 narrative("reason","Purpose and justification","Evidence"),
 text("evidenceReference","Supporting evidence reference","Evidence",false),
 text("idempotencyReference","Idempotency reference (would be server-controlled)","Concurrency",false)
];
const CUSTOMER=[
 text("customerReference","Customer/CIF identifier","Customer identity"),
 select("partyType","Party category",["Individual","Legal entity","Joint","Minor"],"Customer identity"),
 text("legalName","Full or legal entity name","Customer identity"),
 text("residenceCountry","Residence / incorporation jurisdiction","Customer identity"),
 select("kycState","KYC evidence state",["Not verified","Under review","Verified","Rejected"],"Customer identity"),
 text("companyRegistry","Company registry evidence reference","Legal entity",true,{visibleIf:{field:"partyType",in:["Legal entity"]}}),
 text("beneficialOwnershipEvidence","Beneficial ownership evidence reference","Legal entity",true,{visibleIf:{field:"partyType",in:["Legal entity"]}}),
 text("guardianReference","Guardian identity/mandate reference","Minor or joint",true,{visibleIf:{field:"partyType",in:["Minor"]}}),
 email("customerEmail","Customer email"),tel("customerPhone","Customer telephone")
];
const ACC=[
 text("accountReference","Masked deposit/account identifier","Account"),
 text("productReference","Versioned account product reference","Account"),
 select("accountStatus","Account lifecycle",["Proposed","Open","Dormant","Restricted","Closed"],"Account"),
 select("currency","Account currency",currencies,"Account"),
 text("mandateReference","Account authority/mandate evidence","Account"),
 text("customerReference","Account holder CIF identifier","Account")
];
const MONEY=[
 select("currency","Currency",currencies,"Amounts"),
 amount("amountMinor")
];
const CRED=[
 text("customerReference","Borrower/CIF reference","Borrower"),
 text("facilityReference","Credit application/facility reference","Credit"),
 select("creditProduct","Credit product",["Retail","SME","Corporate","Overdraft","Other"],"Credit"),
 amount("requestedPrincipalMinor","Requested principal (minor units)"),
 number("termMonths","Loan term (months)","Credit",true,{min:1,max:600}),
 number("incomeMinor","Verified monthly income / revenue (minor units)","Affordability",true,{min:0}),
 number("debtServiceMinor","Existing monthly debt service (minor units)","Affordability",true,{min:0}),
 text("incomeEvidence","Income and affordability source evidence","Affordability"),
 text("creditPolicy","Effective credit policy version","Credit")
];
const PAYMENT=[
 text("originAccount","Origin account (masked reference)","Payment parties"),
 text("beneficiaryAccount","Beneficiary account (masked reference)","Payment parties"),
 text("beneficiaryName","Beneficiary legal name","Payment parties"),
 select("paymentRail","Payment rail",["INTERNAL","SYSTAC","SYGMA","GIMACPAY","OTHER"],"Settlement controls"),
 text("railProfileVersion","Approved external rail message profile","Settlement controls",true,{visibleIf:{field:"paymentRail",in:["SYSTAC","SYGMA","GIMACPAY","OTHER"]}}),
 ...MONEY,
 text("paymentPurpose","Payment purpose / reference","Payment parties"),
 select("externalOutcome","Network outcome",["NOT_SENT","UNKNOWN","ACKNOWLEDGED","CLEARED","SETTLED","FINALITY_EVIDENCED"],"Settlement controls"),
 text("settlementEvidence","External finality evidence ID","Settlement controls",false)
];
const CASH=[
 text("tellerReference","Teller/operator reference","Cash custody"),
 text("cashSessionReference","Authorized cash session reference","Cash custody"),
 text("drawerReference","Teller drawer or vault location","Cash custody"),
 ...MONEY,
 text("custodianReference","Independent custodian evidence","Cash custody",false),
 date("businessDate","Branch business date")
];
const LEDGER=[
 text("journalReference","Journal command reference","Journal"),
 select("currency","Ledger currency",currencies,"Journal"),
 date("postingDate","Proposed posting date","Journal"),
 text("chartVersion","Approved chart/PCEC mapping version","Journal"),
 text("postingRuleVersion","Approved ledger posting rule version","Journal"),
 text("reversalOf","Original journal reference (for reversal)","Journal",false)
];
const HR=[
 text("employeeReference","Staff/employee reference","Employment"),
 text("payPeriodReference","Payroll period reference","Employment"),
 text("employeePosition","Role/grade identifier","Employment"),
 select("employmentStatus","Employment lifecycle",["Proposed","Active","Suspended","Separated"],"Employment"),
 select("currency","Payroll currency",["XAF"],"Payroll"),
 number("grossMinor","Gross compensation (minor units)","Payroll calculation",true,{min:0}),
 number("withholdingMinor","Withholding total (minor units)","Payroll calculation",true,{min:0}),
 number("socialMinor","Social contribution (minor units)","Payroll calculation",true,{min:0}),
 number("netMinor","Proposed net amount (minor units)","Payroll calculation",true,{min:0}),
 text("payrollPolicyVersion","Applicable payroll/tax/CNPS policy","Payroll calculation")
];
const REPEATERS={
 journalLines:{id:"journalLines",label:"Balanced journal legs",minRows:2,maxRows:30,
  fields:[text("glCode","GL account code"),select("side","Leg direction",["DEBIT","CREDIT"]),select("currency","Currency",currencies),amount("amountMinor","Leg amount (minor units)")],
  note:"At least two legs, matching per-currency debits and credits; this checks local arithmetic only."},
 denominationLines:{id:"denominationLines",label:"XAF cash denomination count",minRows:1,maxRows:12,
  fields:[select("denomination","XAF denomination",["10000","5000","2000","1000","500","100","50","25","10","5","1"]),number("quantity","Quantity","Cash count",true,{min:0})],
  note:"Draft count only. Actual legal tender, approved denominations, coin sets and custodianship require institution validation."},
 beneficiaryLines:{id:"beneficiaryLines",label:"Bulk payment beneficiaries",minRows:1,maxRows:50,
  fields:[text("beneficiaryReference","Beneficiary reference"),text("beneficiaryAccount","Beneficiary account"),select("currency","Currency",currencies),amount("amountMinor","Allocated amount (minor units)")],
  note:"Bulk totals and deduplication must also be enforced by the bank's payment engine."},
 collateralLines:{id:"collateralLines",label:"Collateral and guarantor items",minRows:1,maxRows:20,
  fields:[select("securityType","Security type",["Mortgage","Pledge","Guarantee","Cash deposit","Other"]),text("securityReference","Security evidence reference"),number("valuationMinor","Proposed valuation (minor units)","Collateral",true,{min:0})],
  note:"No valuation or perfection status is verified in the prototype."},
 ownerLines:{id:"ownerLines",label:"Beneficial owners and controllers",minRows:1,maxRows:25,
  fields:[text("ownerReference","Beneficial owner reference"),number("ownershipPercent","Ownership percent","Ownership",true,{min:0,max:100}),text("ownershipEvidence","Ownership evidence reference")],
  note:"Control through indirect ownership requires independent KYB chain verification."},
 reconciliationLines:{id:"reconciliationLines",label:"Reconciliation difference items",minRows:1,maxRows:40,
  fields:[text("itemReference","External reference"),select("status","Matched outcome",["UNMATCHED","PENDING_REVIEW","CONFIRMED"]),number("differenceMinor","Difference (minor units)","Reconciliation",true,{min:0})],
  note:"Unknown external outcomes are not financial finality."}
};
const SPEC={
 GOV:[text("authorityReference","Regulatory/board authority reference","Governance"),select("institutionType","Institution type",["Bank","Microfinance","Payment institution","Educational simulation"]),date("effectiveDate","Policy effective date")],
 CIF:CUSTOMER,KYC:[...CUSTOMER,text("documentType","Identification document type","Identity"),text("documentEvidence","Verification source reference","Identity"),select("screeningDisposition","Screening disposition",["NOT_RUN","NO_HIT","POTENTIAL_MATCH","CONFIRMED_MATCH"],"Screening"),text("consentEvidence","Lawful consent evidence","Identity")],
 PRD:[text("productReference","Versioned financial product code","Product"),select("productClass","Product type",["Deposit","Credit","Payments","Card","Treasury"]),date("effectiveDate","Product effective date"),text("pricingEvidence","Pricing policy evidence","Product"),number("rateBasisPoints","Proposed annual rate (basis points)","Pricing",false,{min:0})],
 ACT:ACC,DEP:[...ACC,...MONEY,date("valueDate","Deposit value date")],BRN:CASH,PAY:PAYMENT,CLR:[...PAYMENT,text("clearingBatchReference","External clearing batch reference","Settlement controls")],
 LED:LEDGER,CRD:CRED,COL:[...CRED,text("collateralReference","Collateral/security registry ID","Collateral"),text("valuationEvidence","Independent valuation evidence","Collateral")],
 TRE:[text("dealTicket","Treasury deal reference","Treasury"),text("counterpartyReference","Counterparty institution code","Treasury"),...MONEY,date("settlementDate","Value/settlement date"),text("limitPolicy","Authorized counterparty limit policy","Treasury")],
 CARD:[text("maskedCardReference","Masked card/token ID","Card"),text("customerReference","Cardholder CIF identifier","Card"),select("cardStatus","Card state",["PROPOSED","ACTIVE","BLOCKED","LOST","EXPIRED"]),text("schemeReference","Scheme/network reference","Card"),text("securityEvidence","PIN/key custody evidence reference","Card",false)],
 CHN:[text("customerReference","Customer/CIF identifier","Channel"),text("deviceReference","Device or application reference","Channel"),select("channel","Channel",["Web","Mobile","Agent","Corporate"]),text("mandateReference","Authenticated channel mandate reference","Channel")],
 AML:[text("caseReference","Restricted AML investigation ID","AML"),text("subjectReference","CIF/transaction subject reference","AML"),select("riskTier","Risk tier",["Unassessed","Low","Medium","High","Critical"]),select("screeningState","Screening status",["Not run","Pending","Potential match","Confirmed match","No match"]),narrative("suspicionReason","Restricted case rationale","AML"),text("reviewEvidence","Compliance officer evidence reference","AML")],
 FRD:[text("incidentReference","Fraud incident reference","Incident"),text("subjectReference","Affected account/card/device reference","Incident"),select("incidentSeverity","Incident severity",["Low","Moderate","High","Critical"]),text("evidenceChain","Chain-of-custody reference","Incident")],
 RSK:[text("riskReference","Risk case identifier","Risk"),select("riskLevel","Risk severity",["Low","Moderate","High","Critical"]),text("riskPolicy","Risk appetite/policy reference","Risk"),narrative("mitigation","Proposed mitigation / ownership","Risk")],
 REG:[text("returnReference","Regulatory return code","Regulatory"),text("authorityReference","Supervisory authority/reference","Regulatory"),text("reportingRuleVersion","Effective regulatory return specification","Regulatory"),date("periodStart","Reporting period start","Reporting period"),date("periodEnd","Reporting period end","Reporting period"),text("ledgerLineage","Approved ledger-to-return lineage evidence","Regulatory")],
 FIN:[text("financeReference","Financial journal/budget reference","Finance"),...MONEY,text("glReference","General ledger account reference","Finance"),text("taxPolicy","Approved tax/accounting policy version","Finance"),date("valueDate","Value date")],
 HR:HR,PRC:[text("supplierReference","Approved supplier reference","Procurement"),text("orderReference","Purchase/order reference","Procurement"),...MONEY,text("procurementPolicy","Procurement authority/policy reference","Procurement")],
 ADM:[text("principalReference","Staff/admin identity reference","Administration"),text("institutionScope","Institution/branch scope reference","Administration"),text("configurationVersion","Versioned setting identifier","Administration"),select("controlClass","Change class",["Routine","Sensitive","Privileged","Emergency"])],
 OPS:[text("incidentReference","Operations case/release reference","Operations"),select("impact","Service impact",["Informational","Minor","Major","Critical"]),text("serviceReference","Affected service/branch","Operations"),text("mitigationEvidence","Evidence of remediation or rollback","Operations")],
 EDU:[text("schoolReference","Training institution reference (synthetic)","Academics"),text("studentReference","Synthetic learner identifier","Academics"),text("scenarioReference","Virtual banking scenario","Academics"),select("simulationClass","Scenario class",["Teller","Customer onboarding","Credit","Payments","Compliance"]),text("instructorReference","Instructor reference","Academics")]
};
const topicRules=[
 [/mandate|signatory|authority|approval|decision|committee/i,[text("approvalEvidence","Independent approval/mandate evidence","Authorization"),text("reviewerReference","Independent reviewer ID","Authorization")]],
 [/transfer|payment|beneficiar|settlement|batch/i,[...MONEY,text("paymentEvidence","Payment/settlement correlation reference","Transaction")]],
 [/credit|loan|underwrit|borrower|arrears|repay|restructur|disburse|affordability|debt/i,[...CRED]],
 [/account|deposit|savings|statement|signatory|lien|freeze/i,[...ACC]],
 [/cash|drawer|vault|denomination|teller|count/i,[...CASH]],
 [/journal|ledger|posting|trial balance|suspense|gl /i,[...LEDGER]],
 [/collateral|guarant|mortgage|pledge|lien priority|security ownership/i,[text("securityReference","Security / guarantee ID","Collateral"),text("perfectionEvidence","Registration or perfection evidence","Collateral")]],
 [/ownership|beneficial owner|corporate/i,[text("ownershipChainReference","Ownership chain evidence reference","Legal entity")]],
 [/tax|payslip|salary|payroll|cnps|employee/i,[...HR]],
 [/fx|foreign exchange|counterparty|nostro|treasury/i,[text("dealReference","Treasury deal/confirmation reference","Treasury"),text("counterpartyLimitEvidence","Limit and liquidity evidence reference","Treasury")]],
 [/systac|sygma|gimacpay|clearing/i,[select("paymentRail","Rail under review",["SYSTAC","SYGMA","GIMACPAY"]),text("railApproval","Participant-specific rail approval evidence","Settlement controls")]],
 [/incident|investigation|alert|fraud|aml|sanction|pep/i,[text("caseReference","Restricted case reference","Investigation"),text("caseEvidence","Protected investigative evidence reference","Investigation")]],
 [/reconciliation|return|filing|regulatory|prudential/i,[date("periodStart","Period start","Reporting period"),date("periodEnd","Period end","Reporting period"),text("sourceProof","Approved source-system evidence reference","Reporting")]]
];
const formPhases=[
 {id:"REQUESTED",description:"Synthetic request captured; not persisted to a bank"},
 {id:"VALIDATING",description:"Authoritative policies, versions and role controls not connected"},
 {id:"PENDING_APPROVAL",description:"Separate authenticated maker-checker service required"},
 {id:"AUTHORIZED",description:"Bank-backed approved instruction not issued"},
 {id:"PROCESSING",description:"No financial posting or external network call"},
 {id:"COMPLETED",description:"Real completion requires bank audit and reconciliation evidence"}
];
const alternatives=["REJECTED","UNKNOWN_PENDING_RECONCILIATION","FAILED_RECONCILED","REVERSAL_REQUESTED","REVERSED"];
function uniqueFields(items){const result=new Map();for(const f of items){if(!result.has(f.id))result.set(f.id,f);}return [...result.values()];}
const forms=[];
for(const [code,quota,owner,label,subjectsString] of FORM_GROUP_SEEDS){
 const topics=subjectsString.split(";").map(x=>x.trim()).filter(Boolean);
 if(new Set(topics).size!==topics.length)throw Error("Duplicate topic in "+code);
 for(let i=0;i<quota;i++){
  const topicIndex=i%topics.length;
  const cycle=Math.floor(i/topics.length);
  const variant=FORM_PHASE_VARIANTS[(topicIndex+cycle)%FORM_PHASE_VARIANTS.length];
  const subject=topics[topicIndex];
  const name=subject+" — "+variant.label;
  const id="FRM-"+code+"-"+String(i+1).padStart(3,"0");
  const base=SPEC[code];if(!base)throw Error("Unknown form category "+code);
  const conditional=(variant.kind==="review")?[text("makerReference","Original maker principal reference","Independent review"),text("checkerReference","Independent checker reference","Independent review"),select("reviewDisposition","Proposed disposition",["PENDING","ESCALATE","REJECT","RECOMMEND_APPROVAL"],"Independent review"),narrative("reviewRationale","Independent review reasoning","Independent review")]:
   (variant.kind==="amend")?[text("supersededRequest","Original request/version reference","Amendment"),text("changeJustification","Reason for amendment","Amendment")]:
   (variant.kind==="exception")?[text("originalEvent","Original event ID","Exception"),select("outcomeState","Known external outcome",["UNKNOWN","ON_HOLD","RECONCILED","EVIDENCE_MISSING"],"Exception"),narrative("exceptionNarrative","Investigation and missing evidence","Exception")]:
   (variant.kind==="close")?[text("closureEvidence","Proposed closure evidence","Closure"),select("caseOutcome","Closure disposition",["PENDING","RESOLVED","REJECTED","ESCALATED"],"Closure")]:[];
  const matching=topicRules.filter(([re])=>re.test(subject));
  const fields=uniqueFields([...COMMON,...base,...matching.flatMap(x=>x[1]),...conditional]);
  const repeaters=[];
  if(code==="LED"&&/journal|posting|reversal/i.test(subject))repeaters.push(REPEATERS.journalLines);
  if(code==="BRN"&&/count|vault|teller cash/i.test(subject))repeaters.push(REPEATERS.denominationLines);
  if(["PAY","CLR"].includes(code)&&/bulk|batch|salary/i.test(subject))repeaters.push(REPEATERS.beneficiaryLines);
  if(["CRD","COL"].includes(code)&&/collateral|guarant|security/i.test(subject))repeaters.push(REPEATERS.collateralLines);
  if(["CIF","KYC"].includes(code)&&/beneficial|corporate|ownership/i.test(subject))repeaters.push(REPEATERS.ownerLines);
  if(["CLR","FIN","REG"].includes(code)&&/reconcil|settlement/i.test(subject))repeaters.push(REPEATERS.reconciliationLines);
  const workflow={states:formPhases,exceptionStates:alternatives,mode:"SPECIFICATION_ONLY",authoritativeTransitions:false,unknownFinancialOutcomes:"HOLD_PENDING_EVIDENCE"};
  const activeRole=variant.kind==="review"?"reviewer":"operator";
  forms.push({id,code,ownerDomain:owner,group:label,subject,name,variant:variant.code,variantKind:variant.kind,
   classification:["CIF","KYC","AML","FRD","HR","CARD","CRD","COL"].includes(code)?"CONFIDENTIAL":"INTERNAL",
   status:"GENERATED_CLIENT_FORM_UNACCEPTED",source:"DERIVED_FROM_339_DOMAIN_TASKS",
   fields,sections:[...new Set(fields.map(f=>f.section))],repeaters,
   validationProfile:repeaters.some(x=>x.id==="journalLines")?"BALANCED_JOURNAL":code==="PAY"?"PAYMENT":code==="CRD"?"CREDIT":code==="HR"?"PAYROLL":code==="BRN"?"CASH":"DOMAIN_STANDARD",
   workflow,previewRole:activeRole,
   controls:{editDraft:"LOCAL_ONLY",validateDraft:"LOCAL_ONLY",saveDraft:"LOCAL_ONLY",resetDraft:"LOCAL_ONLY",discardDraft:"LOCAL_ONLY",downloadDemoJson:"LOCAL_ONLY",
    submit:"BLOCKED_UNAUTHENTICATED",approve:"BLOCKED_MAKER_CHECKER",execute:"BLOCKED_BANK_BACKEND",reconcile:"BLOCKED_EXTERNAL_EVIDENCE",print:"DEFERRED"},
   apiContract:{command:"UNASSIGNED",scope:"BANK_AND_BRANCH",expectedVersionRequired:true,idempotencyRequired:true,serverAuthorizationRequired:true,transactionOutboxRequired:true},
   relatedScreenId:null,screenCrosswalk:"PENDING_ACCEPTED_MAPPING",
   approvedRegulatoryFields:false,acceptedBusinessWorkflow:false,backendConnected:false,
   reviewerAcceptance:"PENDING",legalRuleVersion:"NOT_VERIFIED",languages:["en"],translationFr:"PENDING_APPROVED_COPY"});
 }
}
export const FORMS=Object.freeze(forms);
export const FORM_BY_ID=new Map(FORMS.map(x=>[x.id,x]));
export const FORM_COUNTS=Object.fromEntries(FORM_GROUP_SEEDS.map(([code])=>[code,FORMS.filter(x=>x.code===code).length]));
export const FORM_STATES=Object.freeze(["idle","dirty","validating","locally_validated","validation_error","access_denied","version_conflict","offline_readonly","pending_review","external_unknown","reconciliation_hold"]);
export const FORM_DELIVERY=Object.freeze({formCount:FORMS.length,groups:FORM_GROUP_SEEDS.length,authoritativeSubmissions:0,workflowAcceptances:0,backendConnected:false,formsLegallyApproved:0});
export function formById(id){return FORM_BY_ID.get(id)||null;}
