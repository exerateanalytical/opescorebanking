/**
 * OPES Core Banking — 726 typed client-screen specifications.
 * Every catalogue route has a domain/task-specific UI contract, state coverage,
 * validation metadata and explicit action outcomes. This is FRONTEND DESIGN ONLY:
 * not the regulatory, legal, or authoritative banking fields/schema.
 *
 * An integration is NEVER assumed from a rendered control.
 * API-required actions have hard-disabled status pending verified bank identity,
 * account authority, SoD, idempotency, audit and ledger/rail evidence.
 */
import {SCREENS, DOMAIN_FIELDS} from "./catalog.mjs";
import {priorityContractFor, WORKFLOW_PHASES} from "./priority-contracts.mjs";

const f=(id,label,type="text",group="Task details",required=true,options=[])=>({id,label,type,group,required,options});
const tx=(id,label,group="Task details")=>f(id,label,"text",group);
const date=(id,label)=>f(id,label,"date","Effective dates");
const money=(id,label)=>f(id,label,"number","Financial details");
const choice=(id,label,options)=>f(id,label,"select","Classification",true,options);
const why=(id,label="Decision and supporting rationale")=>f(id,label,"textarea","Evidence and rationale");
const ref=(name,id="targetReference")=>f(id,name+" reference","text","Record identity");
const currency=()=>choice("currency","Currency",["XAF","EUR","USD"]);
const amount=()=>money("amountMinor","Amount (minor units)");
const evidence=()=>tx("evidenceReference","Supporting evidence reference","Evidence and rationale");
const approved=()=>tx("policyVersion","Applicable policy/rules version","Control identifiers");

const CURRENCY=["XAF","EUR","USD"];
const STATES=["Draft","Under review","Approved","Rejected","Suspended","Closed"];
const TRUE_FALSE=["Not verified","Yes","No"];
const RULES = {
 GOV:[
 [/institution|charter|licen[sc]e/, [tx("legalEntity","Institution legal name"),choice("institutionClass","Institution class",["Bank","Microfinance","Payment institution","Education simulation"]),tx("authority","Competent authority reference")]],
 [/regulat|obligation|evidence/,[tx("instrumentCode","Regulatory instrument code"),date("effectiveDate","Obligation effective date"),tx("issuer","Issuing authority")]],
 [/policy|board|approval|mandate|delegation/,[tx("policyId","Policy/mandate identifier"),tx("approverRole","Approval authority/role"),approved()]],
 [/change|exception|control/,[tx("changeId","Change request identifier"),choice("riskTier","Impact classification",["Low","Moderate","High","Critical"]),why("exceptionReason","Exception justification")]]
 ],
 ARC:[
 [/architecture|context|service|dependency|topology/,[tx("componentId","Component identifier"),tx("ownerTeam","Responsible engineering owner"),tx("dependency","Dependency/service reference")]],
 [/contract|event|version|compatibility/,[tx("contractId","Contract identifier"),tx("contractRevision","Version identifier"),choice("changeType","Compatibility impact",["Compatible","Breaking","Unconfirmed"])]],
 [/data flow|boundary|integration/,[tx("sourceContext","Source context"),tx("targetContext","Target context"),tx("dataClassification","Data classification")]]
 ],
 CIF:[
 [/onboard|identity|document|passport|kyc/,[tx("identityEvidence","Identity source/evidence reference"),choice("verificationState","Identity review",["Unverified","Verified","Mismatch","Escalated"]),date("identityExpiry","Document expiry")]],
 [/corporate|beneficial|ownership|joint|guardian/,[tx("ownershipSource","Ownership/relationship evidence"),tx("linkedParty","Related party identifier"),money("ownershipPercent","Ownership share percentage")]],
 [/consent|privacy|data/,[tx("consentVersion","Consent notice version"),date("consentDate","Consent evidence date"),choice("consentState","Consent status",["Pending","Captured","Revoked"])]],
 [/address|residenc|tax/,[tx("residenceCountry","Country of residence"),tx("taxReference","Tax residency reference"),tx("addressEvidence","Address proof reference")]],
 [/pep|sanction|risk|screen/,[choice("riskTier","Risk classification",["Undetermined","Low","Medium","High"]),tx("screeningEvidence","Screening case reference"),why("riskRationale","Risk determination reason")]]
 ],
 PRD:[
 [/product|builder|catalog|eligib/,[tx("productCode","Versioned product code"),tx("productOwner","Product manager identifier"),choice("productType","Product family",["Deposit","Loan","Payment","Treasury","Other"])]],
 [/rate|interest|pricing/,[money("annualRateBps","Rate in basis points"),date("effectiveDate","Rate effective date"),tx("pricingPolicy","Approved rate policy ID")]],
 [/fee|limit|charge|schedule/,[amount(),currency(),tx("feePolicy","Fee schedule version")]],
 [/approval|version|release|retire/,[tx("versionId","Product version reference"),date("effectiveFrom","Change effective from"),tx("reviewAuthority","Independent review reference")]],
 [/simulation|test/,[amount(),currency(),money("termDays","Illustrative term (days)")]]
 ],
 ACT:[
 [/opening|owner|mandate|signat/,[tx("signatoryRef","Authorized signatory reference"),tx("mandatePolicy","Mandate type/version"),date("mandateEffective","Mandate effective date")]],
 [/deposit|savings|contribution|interest|maturity/,[amount(),currency(),date("valueDate","Proposed value date"),tx("ratePolicy","Interest/product policy version")]],
 [/freeze|hold|lien|restrict|dormant|reactivat/,[choice("restrictionReasonCode","Restriction reason",["Risk hold","Court order","Dormant","Contractual lien","Other"]),tx("legalEvidence","Authority or legal evidence"),date("effectiveDate","Restriction effective date")]],
 [/statement|history|reconcil/,[date("fromDate","Reporting period start"),date("toDate","Reporting period end"),tx("statementVersion","Statement/reconciliation reference")]],
 [/limit|overdraft|conversion|close/,[amount(),currency(),tx("approvalRef","Limit/lifecycle authorization reference")]]
 ],
 LED:[
 [/journal|posting|reversal|adjustment/,[tx("debitGL","Debit GL code"),tx("creditGL","Credit GL code"),amount(),currency(),tx("postingPolicy","Posting rule/version"),tx("originalJournal","Original journal for correction")]],
 [/chart|mapping|pcec/,[tx("glCode","Chart of accounts code"),choice("accountClass","GL classification",["Asset","Liability","Equity","Revenue","Expense"]),tx("mappingAuthority","Institution-approved PCEC mapping evidence")]],
 [/balance|period|close|accrual|reconcil/,[tx("accountingPeriod","Accounting period"),date("cutoff","Period cutoff date"),tx("controlBatch","Control batch reference")]],
 [/suspense|clearing|exception/,[tx("suspenseRef","Suspense item reference"),tx("breakCause","Reason for difference"),tx("resolutionEvidence","Resolution evidence reference")]]
 ],
 BRN:[
 [/cash|teller|drawer|count|vault|denomination/,[tx("tellerId","Teller identifier"),tx("sessionId","Cash session identifier"),amount(),currency(),tx("dualCustodyRef","Dual-control evidence reference")]],
 [/deposit|withdrawal|shipment|transfer|agent/,[tx("sourceDrawer","Source cash location"),tx("destinationDrawer","Destination cash location"),amount(),currency()]],
 [/opening|closing|eod|reconcil|difference/,[date("businessDate","Branch business date"),tx("cashCountEvidence","Independent cash-count evidence"),tx("closeAuthority","Close authority reference")]],
 [/cheque|check/,[tx("chequeReference","Cheque identifier"),tx("draweeBank","Drawee bank code"),amount()]]
 ],
 PAY:[
 [/transfer|payment|instruction|initiat|beneficiar|standing/,[tx("originAccount","Origin account reference"),tx("beneficiaryAccount","Beneficiary account reference"),amount(),currency(),tx("paymentPurpose","Payment purpose"),tx("idempotencyKey","Idempotency reference")]],
 [/batch|bulk|direct debit/,[tx("batchId","Payment batch reference"),money("itemCount","Number of items"),money("batchTotalMinor","Batch total (minor units)"),tx("batchAuthority","Bulk authorization evidence")]],
 [/rail|systac|sygma|gimac|iso|mapping/,[choice("rail","Network rail",["Internal","SYSTAC","SYGMA","GIMACPAY","Other"]),tx("profileVersion","Approved message-profile version"),tx("institutionEntitlement","Institution/rail entitlement reference")]],
 [/settlement|finality|liquidity|nostro/,[tx("settlementAccount","Settlement account reference"),tx("railAckReference","External acknowledgement reference"),choice("settlementState","External state",["Unknown","Accepted","Cleared","Settled","Final"]),tx("reconciliationEvidence","Finality/reconciliation evidence")]],
 [/return|recall|dispute|exception|unknown/,[tx("originalPayment","Original payment ID"),choice("caseState","Case status",["Unknown","On hold","Under review","Resolved"]),tx("outcomeEvidence","Network outcome evidence")]]
 ],
 CRD:[
 [/application|borrower|underwriting|scor|affordab/,[tx("borrowerId","Borrower reference"),money("incomeMinor","Verified monthly income/revenue (minor units)"),money("debtServiceMinor","Existing monthly debt service (minor units)"),money("requestedMinor","Requested principal (minor units)"),tx("creditPolicy","Credit decision policy version")]],
 [/facility|loan|renew|limit|disburse/,[tx("facilityId","Facility reference"),amount(),currency(),money("termMonths","Term in months"),tx("loanAgreement","Signed agreement evidence reference")]],
 [/collateral|guarant|security|covenant/,[tx("securityId","Security/guarantee reference"),choice("securityType","Security class",["Real estate","Cash pledge","Guarantee","Equipment","Other"]),money("valueMinor","Independent valuation (minor units)"),tx("perfectionEvidence","Security perfection evidence")]],
 [/collect|arrears|past due|repayment|restructur|npl|write.off/,[tx("facilityId","Facility reference"),money("daysPastDue","Days past due"),money("arrearsMinor","Amount in arrears (minor units)"),tx("treatmentPlan","Collections plan reference")]],
 [/committee|decision|grade|assessment/,[tx("committeeReference","Credit committee ID"),tx("independentReviewer","Independent reviewer ID"),why("decisionRationale","Credit recommendation rationale")]]
 ],
 TRE:[
 [/fx|foreign|exchange|spot|forward/,[choice("baseCurrency","Base currency",CURRENCY),choice("quoteCurrency","Quote currency",CURRENCY),money("notionalMinor","Trade notional (minor units)"),money("fxRateScaled","Quoted rate (scaled integer)")]],
 [/liquidity|funding|intraday|forecast|gap/,[tx("liquidityBucket","Liquidity bucket/date window"),money("availableLiquidityMinor","Available liquidity (minor units)"),money("requiredLiquidityMinor","Funding requirement (minor units)")]],
 [/nostro|reconcil|settlement/,[tx("nostroAccount","Nostro account reference"),date("valueDate","Value date"),tx("bankStatementEvidence","Statement/confirmation reference")]],
 [/securit|placement|money market|deal|counterparty/,[tx("counterpartyId","Counterparty reference"),tx("dealTicket","Treasury deal ticket"),date("maturityDate","Maturity date"),money("notionalMinor","Transaction notional (minor units)")]],
 [/limit|exposure|risk/,[tx("limitPolicy","Approved limit policy version"),money("utilizedMinor","Limit utilized (minor units)"),money("limitMinor","Authorized limit (minor units)")]]
 ],
 AML:[
 [/alert|screen|watchlist|sanction|pep/,[tx("subjectReference","Subject reference"),tx("matchEvidence","Screening/match evidence"),choice("alertRisk","Alert severity",["Low","Medium","High","Critical"])]],
 [/case|investigat|escalat|suspicious|filing/,[tx("caseId","Investigation case ID"),tx("triggerReference","Underlying transaction/party reference"),why("suspicionRationale","Suspicion/risk rationale"),tx("confidentialFilingRef","Confidential filing reference")]],
 [/due diligence|wealth|funds|customer risk/,[tx("sourceEvidence","Source of funds/wealth evidence"),tx("pepReview","PEP review reference"),tx("riskModelVersion","Risk methodology version")]],
 [/rule|calibration|threshold|suppress/,[tx("ruleCode","Monitoring rule identifier"),tx("ruleVersion","Effective rule version"),why("exceptionApproval","Rule exception justification")]]
 ],
 REP:[
 [/return|submission|filing|report run/,[tx("returnCode","Reporting return code"),tx("authority","Regulator/issuer"),tx("reportingPeriod","Reporting period"),tx("submissionEvidence","Submission evidence receipt")]],
 [/capital|prudential|liquidity|exposure|impairment|provision|classification/,[tx("prudentialRule","Applicable regulation/version"),money("reportedAmountMinor","Reported amount (minor units)"),tx("calculationLineage","Calculation/ledger lineage reference")]],
 [/dataset|validation|mapping|change/,[tx("mappingVersion","Reporting-mapping version"),tx("sourceLedgerVersion","Source ledger projection version"),tx("validationCase","Validation/error case")]],
 [/calendar|disclosure|archive|certif|receipt/,[date("dueDate","Reporting due date"),tx("evidencePackage","Evidence package reference"),tx("approvalAuthority","Sign-off authority reference")]]
 ],
 CHN:[
 [/mobile|web|enroll|device|session|binding/,[tx("customerReference","Customer reference"),tx("deviceId","Bound device identifier"),tx("authenticationProfile","Authentication profile version")]],
 [/beneficiar|transfer|pay|wallet|merchant/,[tx("beneficiaryReference","Beneficiary reference"),amount(),currency(),tx("paymentChannel","Channel reference")]],
 [/agent|float|transaction/,[tx("agentReference","Agent identifier"),money("floatMinor","Agent float (minor units)"),tx("agentLimitPolicy","Agent policy version")]],
 [/corporate|mandate|approval|payroll/,[tx("corporateId","Corporate customer ID"),tx("authorizationMandate","Corporate authorization mandate"),tx("paymentBatch","Payment batch identifier")]],
 [/limit|dispute|notification/,[tx("notificationCase","Customer notice/dispute case"),tx("channelEvent","Channel event identifier"),date("eventDate","Event date")]]
 ],
 CARD:[
 [/issu|activat|replace|lifecycle|portfolio/,[tx("maskedCardId","Masked card/token reference"),tx("issuerProduct","Issuer product code"),choice("cardState","Card status",["Proposed","Active","Suspended","Blocked","Expired"])]],
 [/authoriz|transaction|scheme|settlement/,[tx("schemeRef","Scheme transaction reference"),money("authorizationMinor","Authorized amount (minor units)"),currency(),tx("reconEvidence","Network reconciliation evidence")]],
 [/pin|limit|terminal|atm/,[tx("deviceReference","ATM/terminal/device ID"),tx("accessPolicy","Card PIN/limit policy version"),tx("credentialCustody","Key custody reference")]],
 [/disput|chargeback|fraud/,[tx("cardCaseRef","Card dispute case ID"),tx("merchantReference","Merchant transaction reference"),why("disputeReason","Dispute reason and evidence")]]
 ],
 CRM:[
 [/request|service|inbox|case|assign/,[tx("customerReference","Customer reference"),tx("caseId","Service case number"),choice("casePriority","Priority",["Normal","Elevated","Urgent"]),date("slaDue","SLA target date")]],
 [/complain|dispute|resolution|escalat/,[tx("complaintCode","Complaint category"),tx("originalEvent","Original event reference"),why("complaintReason","Complaint details and consent")]],
 [/contact|appointment|correspond|notification/,[tx("contactReference","Authorized customer contact ID"),choice("preferredChannel","Approved channel",["Branch","Phone","Email","Digital inbox"]),date("appointmentDate","Contact date")]],
 [/monitor|performance|sla/,[tx("serviceMetric","Service measurement ID"),money("breachCount","Overdue item count"),date("periodDate","Measurement period")]]
 ],
 FEE:[
 [/fee|charge|catalog|schedule|accrual|posting/,[tx("chargeCode","Fee/charge identifier"),money("feeAmountMinor","Charge (minor units)"),currency(),tx("feePolicyVersion","Fee schedule/policy version")]],
 [/tax|withhold|rule/,[tx("taxCode","Tax regime reference"),money("taxAmountMinor","Tax amount (minor units)"),tx("taxAuthority","Tax authority reference")]],
 [/waiver|exemption|exception/,[tx("waiverAuthority","Fee waiver authorization reference"),why("waiverReason","Waiver business and legal reason"),date("waiverUntil","Waiver effective through")]],
 [/simulat|disput/,[amount(),currency(),tx("disputeCase","Disputed fee transaction ID")]]
 ],
 REC:[
 [/statement|import|mapping/,[tx("sourceStatement","External statement reference"),date("statementDate","Statement date"),tx("importHash","Import SHA-256 evidence")]],
 [/nostro|ledger|cash|payment|reconcil|match/,[tx("reconBatch","Reconciliation batch ID"),tx("sourceA","Source account/system A"),tx("sourceB","Source account/system B"),money("differenceMinor","Unreconciled difference (minor units)")]],
 [/exception|break|suspense|unmatched|aging|clear/,[tx("breakReference","Outstanding break ID"),choice("breakStatus","Exception status",["Unmatched","Investigating","Resolved","Written off"]),why("breakRationale","Exception rationale")]],
 [/certif|approval|resolution/,[tx("reviewerReference","Independent reconciliation reviewer"),tx("evidenceBatch","Reconciliation evidence package")]]
 ],
 SEC:[
 [/access|role|permission|provision|matrix/,[tx("principalId","Identity principal reference"),tx("bankScope","Institution scope"),tx("roleCode","Role/permission code"),date("accessExpiry","Access expiry date")]],
 [/privileg|maker|checker|segregat|approval/,[tx("makerReference","Initiating user ID"),tx("checkerReference","Independent checker ID"),tx("policyVersion","Authorization policy version")]],
 [/audit|incident|session|authenticat/,[tx("securityEventId","Security event/correlation ID"),date("eventDate","Event date"),tx("signedEvidence","Evidence record reference")]],
 [/key|crypto|secret|certificate|rotation/,[tx("custodyReference","Key custodian/HSM reference"),tx("rotationCase","Key rotation case ID"),date("expiryDate","Next expiry date")]],
 [/fraud|trust|device/,[tx("riskReference","Fraud/risk event ID"),tx("deviceFingerprint","Device trust identifier"),tx("reviewAuthority","Review authority reference")]]
 ],
 DAT:[
 [/source|mapping|dictionary|schema/,[tx("dataSource","Source system"),tx("schemaVersion","Data dictionary/schema version"),tx("lineageRef","Lineage identifier")]],
 [/migration|import|validation/,[tx("migrationBatch","Migration batch ID"),tx("checksum","Source checksum"),money("rowCount","Record count"),tx("reconEvidence","Reconciliation evidence")]],
 [/quality|classification|retention|deletion/,[choice("classification","Classification",["Public","Internal","Confidential","Restricted"]),tx("retentionPolicy","Retention policy ID"),tx("qualityRule","Quality assertion reference")]],
 [/export|pipeline|transformation/,[tx("destinationContext","Approved destination"),tx("exportAuthority","Transfer authorization reference"),why("processingPurpose","Data processing purpose")]]
 ],
 API:[
 [/api|integration|endpoint|connection|partner/,[tx("integrationId","Integration/partner ID"),tx("clientVersion","Contract version"),tx("destination","Approved network endpoint")]],
 [/webhook|event|subscription|delivery/,[tx("eventTopic","Subscribed event topic"),tx("deliveryId","Delivery idempotency key"),choice("deliveryState","Delivery state",["Pending","Acknowledged","Failed","Dead letter"])]],
 [/contract|test|compatib|version/,[tx("openApiSpec","OpenAPI specification identifier"),tx("schemaHash","Schema digest/version"),tx("conformanceCase","Contract test evidence")]],
 [/rate limit|credential|oauth|authentication/,[tx("clientId","Registered client ID"),tx("accessPolicy","OAuth grant/scope policy"),money("rateLimit","Approved requests per window")]]
 ],
 INF:[
 [/service|environment|inventory|node|capacity/,[tx("serviceId","Service identifier"),tx("environmentId","Deployment environment"),tx("region","Hosting/security region")]],
 [/release|pipeline|deploy|rollback/,[tx("changeId","Approved change request"),tx("imageDigest","Immutable image digest"),tx("rollbackEvidence","Rollback package reference")]],
 [/vulnerab|incident|security|certificate/,[tx("findingId","Security finding reference"),choice("severity","Severity",["Informational","Low","Medium","High","Critical"]),date("remediationDue","Remediation target")]],
 [/monitor|logs|alerts|health/,[tx("metricName","Monitored metric/log stream"),date("observationDate","Observation date"),tx("traceReference","Trace/correlation evidence")]]
 ],
 DR:[
 [/backup|restore|recovery/,[tx("backupSet","Backup set immutable reference"),tx("restoreProof","Restore verification evidence"),date("restoreDate","Restore test date")]],
 [/failover|failback|drill/,[tx("primarySite","Original site/region"),tx("alternateSite","Recovery site/region"),money("measuredRtoMinutes","Measured RTO minutes"),money("measuredRpoMinutes","Measured RPO minutes")]],
 [/incident|continuity|policy|exercise/,[tx("scenarioId","BCP/DR scenario reference"),tx("criticalService","Affected critical service"),tx("attestation","Drill/incident evidence")]]
 ],
 ADM:[
 [/institution|bank|branch|setting|calendar/,[tx("institutionId","Bank/branch reference"),tx("configVersion","Configuration version"),date("effectiveDate","Configuration effective date")]],
 [/employee|payroll|grade|leave|org/,[tx("employeeRef","Employee reference"),tx("payCycle","Payroll or HR cycle"),tx("approvalChain","HR approval authority evidence")]],
 [/limit|flag|approval|feature/,[tx("limitPolicy","Authorized limit/flag policy ID"),tx("reviewAuthority","Reviewer ID"),date("effectiveDate","Policy effective date")]]
 ],
 TST:[
 [/test|run|catalog|regress|security/,[tx("testCaseId","Test case identifier"),tx("buildDigest","Test build version"),choice("testStatus","Test status",["Not run","Passed","Failed","Blocked"]),tx("testEvidence","Test evidence URL/reference")]],
 [/accessib|coverage|performance/,[tx("standardVersion","Test standard/version"),money("measuredValue","Measured test value"),tx("measurementEvidence","Result evidence")]],
 [/finding|failure|issue/,[tx("findingRef","Test finding ID"),choice("severity","Severity",["Low","Medium","High","Critical"]),tx("ownerRef","Remediation owner")]]
 ],
 REL:[
 [/release|candidate|deployment|pilot/,[tx("releaseId","Release candidate/tag"),tx("artifactDigest","Release artifact SHA-256"),tx("changeApproval","Change authority reference")]],
 [/readiness|approval|rollback|monitor/,[tx("readinessCase","Acceptance readiness case"),tx("recoveryEvidence","Recovery/rollback evidence"),choice("approvalState","Release gate",["Blocked","Under review","Accepted"])]]
 ],
 EDU:[
 [/instructor|course|student|enroll|competency/,[tx("schoolId","Training institution ID"),tx("courseId","Banking course reference"),tx("studentOrInstructorId","Synthetic learner/instructor ID")]],
 [/scenario|virtual|simulation|lab|workbench/,[tx("scenarioId","Synthetic banking scenario ID"),tx("virtualBankId","Sandbox banking institution"),choice("scenarioDifficulty","Scenario level",["Beginner","Intermediate","Advanced"])]],
 [/assessment|exam|grading|passport|audit/,[tx("assessmentId","Assessment reference"),tx("rubricVersion","Evaluation rubric version"),money("score","Score or competency points")]]
 ]
};
const PHASES = {
 GOV:["Capture institution and control authority","Validate applicable governance/policy references","Independent governing-body review","Record effective immutable control evidence"],
 ARC:["Define service/interface responsibility","Validate data and event boundary constraints","Independent design review","Record ADR version and compatibility evidence"],
 CIF:["Capture party identity and consent","Verify KYC/KYB, sanctions and beneficial ownership","Independent eligibility/risk decision","Activate and audit the bank-scoped party"],
 PRD:["Configure product and financial terms","Validate eligibility/rate and effective dates","Approve immutable product version","Publish controlled product lifecycle"],
 ACT:["Verify party, mandate and configured product","Validate account status, limits and holds","Bank-scoped maker-checker authorization","Commit lifecycle and reconcile financial impacts"],
 LED:["Validate balanced posting event and GL mappings","Verify idempotency and effective accounting period","Independent posting authority and concurrency control","Atomic journal/outbox with reconciliation"],
 BRN:["Verify teller session, branch and cash custody","Validate cash denominations and dual custody","Independent cash-control authorization","Post/reconcile teller and vault differences"],
 PAY:["Validate debtor, beneficiary and rails","Validate fees, limits, funding and entitlement","Approve permitted instruction and idempotency","Transmit, track unknown outcome, reconcile finality"],
 CRD:["Collect borrower, consent and supporting evidence","Assess affordability, credit risk and collateral","Independent committee and signed agreement","Authorize disbursement and service lifecycle"],
 TRE:["Capture treasury instruction and counterparty","Check liquidity, trading limits and pricing policy","Independent deal approval and HSM/custody","Settle with external confirmation and reconciliation"],
 AML:["Capture alert and evidence without customer disclosure","Review sanctions/PEP/risk controls","Authorized confidential second-line escalation","Record regulator-grade audit outcome"],
 REP:["Select approved reporting rule and period","Reconcile data lineage and calculations","Independent regulatory quality approval","Submit and retain authority receipt"],
 CHN:["Authenticate customer/device/corporate mandate","Validate permitted channel and transaction limits","Authorize under institution and user policy","Deliver bank-backed result and audit notification"],
 CARD:["Identify tokenized card or scheme event","Validate product, scheme, PIN and fraud controls","Authorized dual-control decision","Confirm network result with reconciliation"],
 CRM:["Capture case with minimal private information","Validate assignment, priority and SLA","Authorized customer-service decision","Notify customer and retain resolution evidence"],
 FEE:["Select approved fee/tax policy version","Recalculate pricing and exception bounds","Authorize waiver/override independently","Post approved charges and reconcile"],
 REC:["Collect authoritative sources and ledger evidence","Deterministically match and calculate differences","Independent break resolution approval","Reconcile all financial source systems"],
 SEC:["Confirm trusted principal, institution and role","Validate policy, separation of duties and incident scope","Independent security approval","Apply only server-side and audit"],
 DAT:["Identify lawful source, consent and lineage","Validate schema, classification and data quality","Approve migration/processing authorization","Reconcile import or publish safe data"],
 API:["Identify approved consumer and version","Validate schema, identity, keys and rate controls","Independent integration authorization","Deliver idempotent auditable message"],
 INF:["Record environment, deployment and change","Verify image digest, scan and resilience evidence","Approve release/incident controls","Deploy/rollback with telemetry evidence"],
 DR:["Identify critical service and recovery targets","Verify backup/restore/failover results","Approve independent recovery evidence","Close with measured RTO/RPO and audit"],
 ADM:["Identify institution/employee/config subject","Validate HR/config rights and effective dates","Independent approval of sensitive changes","Apply versioned settings and audit"],
 TST:["Define test scope and trusted expected result","Execute negative, concurrency and accessibility checks","Independent evidence review","Publish only verified acceptance outcome"],
 REL:["Identify immutable release candidate","Validate readiness, security, rollback and sign-off","Authorize deployment gate","Audit production rollout and incident monitoring"],
 EDU:["Select synthetic student and training environment","Validate scenario isolation and rubric","Instructor moderation and scoring review","Record academic evidence; no real banking funds"]
};
const STYLE_SUFFIX=/\s+—\s+(Workbench|Details|Review|Exceptions|Activity|Settings|Monitoring)$/i;
const rolesByKind={
 register:["operator","reviewer","auditor"],
 detail:["operator","reviewer","auditor"],
 workbench:["operator","reviewer"],
 review:["reviewer","auditor"],
 monitor:["operator","reviewer","auditor"],
 history:["auditor","reviewer"],
 exceptions:["operator","reviewer","auditor"],
 settings:["operator","reviewer"]
};
const purposesByKind={
 register:"Search and filter a scoped register",
 detail:"Inspect one authoritative object and its provenance",
 workbench:"Capture and prepare a controlled banking task",
 review:"Independently examine an approval case",
 monitor:"Observe status, freshness and exceptions",
 history:"Examine a tamper-evident activity record",
 exceptions:"Investigate and reconcile a business exception",
 settings:"Configure a versioned institution policy"
};
const mode=(s)=>s.kind==="workbench" ? ((s.name.match(STYLE_SUFFIX)?.[1]||"Workbench").toLowerCase()) : s.kind;
const statusFields=(topic,kind)=>{
 const result=[ref(topic)];
 if(kind==="register"||kind==="monitor")result.push(f("filterStatus","Filter state","select","Query filters",false,["All","Pending","Active","Closed"]));
 if(kind==="detail"||kind==="history")result.push(f("recordVersion","Record/evidence version","text","Record identity",false));
 if(kind==="review")result.push(tx("makerReference","Initiating user ID"),tx("approvalEvidence","Review evidence ID"));
 if(kind==="exceptions")result.push(choice("exceptionReason","Exception category",["Validation","Authorization","External unknown","Reconciliation","Other"]),tx("originalEvent","Original event reference"));
 if(kind==="settings")result.push(tx("configVersion","Settings version"),date("effectiveDate","Proposed effective date"));
 return result;
};
function dedupe(fields){
 const byId=new Map();
 for(const field of fields){if(!field?.id)continue;
  const validTypes=["text","number","date","email","tel","select","textarea"];
  const sanitized={id:String(field.id),label:String(field.label||field.id),type:validTypes.includes(field.type)?field.type:"text",group:String(field.group||"Details"),required:!!field.required,options:Array.isArray(field.options)?field.options:[],hint:String(field.hint||"")};
  if(!byId.has(sanitized.id))byId.set(sanitized.id,sanitized);
 }
 return [...byId.values()];
}
function base(s){
 return (DOMAIN_FIELDS[s.domain]||[]).map(([id,label,type,required,opts])=>f(id,label,type||"text",/Ref|Code|Id|Reference|Branch|Institution/i.test(id)?"Record identity":"Domain details",!!required,opts||[]));
}
function derive(s){
 const existing=priorityContractFor(s);
 const topic=s.name.replace(STYLE_SUFFIX,"").trim();
 const kind=mode(s);
 const extra=[];
 const tagMatches=[];
 for(const [pattern,fields] of RULES[s.domain]||[]){
  if(pattern.test(topic)){tagMatches.push(pattern.source);extra.push(...fields);}
 }
 const forReview=/review|authorization|approval|audit|attestation|assessment|validation/i.test(topic)||kind==="review";
 if(forReview)extra.push(tx("independentReviewId","Independent reviewer/evidence reference","Controls"));
 const forFinancial=["LED","BRN","PAY","CRD","TRE","ACT","FEE","REC"].includes(s.domain);
 if(forFinancial)extra.push(tx("currencyPolicy","Bank-approved currency/product rule reference","Controls"));
 const standard=[tx("actionReference","Proposed action reference","Record identity"),why("actionReason","Purpose and evidence narrative"),approved()];
 const fields=dedupe([...(existing?.fields||base(s)),...statusFields(topic,kind),...extra,...standard]);
 const immutable=true;
 const readOnly=["register","monitor","history","review"].includes(kind)
  || /statement|trial balance|ledger extract|monitor|dashboard|status|audit log/i.test(topic)
  || (existing&&existing.captureAllowed===false);
 const editAllowed=!readOnly && ["operator"].includes((existing?.previewRole||"operator")) && (existing?.captureAllowed!==false);
 const controls={
  open:{label:"Open screen",state:"AVAILABLE_UI"},
  search:{label:"Search in-memory records",state:"AVAILABLE_UI"},
  inspect:{label:"Inspect local draft",state:"AVAILABLE_UI"},
  capture:{label:"Capture synthetic task draft",state:editAllowed?"LOCAL_ONLY":"DISABLED_READONLY"},
  discard:{label:"Discard in-memory draft",state:"AVAILABLE_UI"},
  submit:{label:"Submit for bank authorization",state:"BLOCKED_NO_TRUSTED_API"},
  approve:{label:"Independent approval",state:"BLOCKED_NO_BANK_AUTHORIZATION"},
  execute:{label:"Post/execute banking transaction",state:"BLOCKED_NO_ACCEPTED_BACKEND"},
  reconcile:{label:"Confirm finality/reconciliation",state:"BLOCKED_NO_EXTERNAL_EVIDENCE"},
  export:{label:"Export regulated records",state:"DEFERRED_DOCUMENT_PHASE"},
  print:{label:"Print regulated document",state:"DEFERRED_TEMPLATE_PHASE"}
 };
 const phases=(WORKFLOW_PHASES[s.domain]||PHASES[s.domain].map((v,i)=>[["Capture / identify","Validate","Authorize","Commit and reconcile"][i],v])).map((p,i)=>({id:i+1,title:Array.isArray(p)?p[0]:["Capture","Validate","Approve","Record"][i],description:Array.isArray(p)?p[1]:p,status:"DESIGN_ONLY"}));
 const stateList=["idle","loading","empty","draft","validating","validation_error","access_denied","stale_version","pending_review","external_unknown","reconciliation_hold","completed","failed","offline_readonly"];
 return {id:s.id,domain:s.domain,title:s.name,topic,kind,purpose:(purposesByKind[kind]||purposesByKind.workbench)+": "+topic,
  source:s.source,fieldSource:existing?.source||"DOMAIN_TASK_DERIVED",fieldStatus:"PROPOSED_NOT_VALIDATED",
  schemaVersion:"UI-2026-11-05-V1",fields,groups:[...new Set(fields.map(x=>x.group))],
  requiredFields:fields.filter(x=>x.required).map(x=>x.id),roles:rolesByKind[kind]||["operator","reviewer"],
  captureAllowed:editAllowed,actions:controls,tabs:["overview","records","workflow","controls"],
  phases,stateList,semanticTags:tagMatches,security:{tenantScope:"BANK_AND_BRANCH_ENFORCED_BY_BACKEND",makerChecker:"BACKEND_ONLY",audit:"NO_AUDIT_CONNECTION",dataHandling:"SYNTHETIC_MEMORY_ONLY"},
  status:"UI_SPEC_GENERATED_NOT_ACCEPTED"};
}
export const SCREEN_BLUEPRINTS=Object.freeze(Object.fromEntries(SCREENS.map(s=>[s.id,derive(s)])));
export const SCREEN_BLUEPRINTS_COUNT=Object.keys(SCREEN_BLUEPRINTS).length;
export function screenBlueprint(s){return s?SCREEN_BLUEPRINTS[s.id]||null:null;}
export const SPEC_DELIVERY=Object.freeze({routes:SCREEN_BLUEPRINTS_COUNT,screenImplementation:"RESPONSIVE_UI_SHELL_AND_SYNTHETIC_ACTIONS",backend:"NOT_CONNECTED",acceptance:"UNVERIFIED",printables:"DEFERRED",reports:"DEFERRED"});
