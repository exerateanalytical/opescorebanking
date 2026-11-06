/**
 * 378 versioned report prototypes. Every definition has explicit grain, filters,
 * metric semantics, data-lineage blockers, institution role and source contract.
 * NOT a certified COBAC/BEAC regulatory return and NOT a bank production report.
 */
import {REPORT_GROUPS} from "./report-seeds.js";
export {REPORT_GROUPS} from "./report-seeds.js";
const REGULATORY=new Set(["REG","AML","KYC","FRD","RSK"]);
const FINANCIAL=new Set(["LED","FIN","ACT","DEP","BRN","PAY","CLR","CRD","COL","TRE","CARD"]);
const CONFIDENTIAL=new Set(["CIF","KYC","AML","FRD","HR","RSK","REG","CRD","COL","SEC"]);
const INPUTS={
 period:{id:"period",label:"Reporting period",type:"month"},
 branch:{id:"branch",label:"Bank branch",type:"select",options:["ALL","DEMO-DOUALA","DEMO-YAOUNDE","DEMO-BAFOUSSAM"]},
 product:{id:"product",label:"Product",type:"select",options:["ALL","SAVINGS-DEMO","CURRENT-DEMO","CREDIT-DEMO"]},
 status:{id:"status",label:"Lifecycle status",type:"select",options:["ALL","PENDING","COMPLETED","FAILED","BLOCKED"]},
 currency:{id:"currency",label:"Currency",type:"select",options:["ALL","XAF","EUR","USD"]},
 channel:{id:"channel",label:"Channel",type:"select",options:["ALL","BRANCH","MOBILE","WEB","AGENT"]},
 rail:{id:"rail",label:"Payment rail",type:"select",options:["ALL","INTERNAL","SYSTAC","SYGMA","GIMACPAY"]},
 riskBand:{id:"riskBand",label:"Risk class",type:"select",options:["ALL","LOW","MEDIUM","HIGH","UNASSESSED"]},
 segment:{id:"segment",label:"Customer segment",type:"select",options:["ALL","INDIVIDUAL","CORPORATE","SME"]},
 account:{id:"account",label:"Account reference",type:"text",sensitive:true},
 minDaysPastDue:{id:"minDaysPastDue",label:"Minimum days past due",type:"integer",min:0,max:1000}
};
const METRICS={
 RECORD_COUNT:{id:"RECORD_COUNT",label:"Synthetic observations",unit:"count",sourceFields:["recordId"],formula:"count_non_duplicate"},
 TOTAL_AMOUNT_MINOR:{id:"TOTAL_AMOUNT_MINOR",label:"Total amount (minor units)",unit:"minor",sourceFields:["amountMinor"],formula:"sum_minor"},
 AVERAGE_AMOUNT_MINOR:{id:"AVERAGE_AMOUNT_MINOR",label:"Average amount (minor units)",unit:"minor",sourceFields:["amountMinor"],formula:"average_minor"},
 NET_DIFFERENCE_MINOR:{id:"NET_DIFFERENCE_MINOR",label:"Net variance (minor units)",unit:"minor",sourceFields:["actualMinor","expectedMinor"],formula:"sum_actual_minus_expected"},
 DEBIT_CREDIT_DIFFERENCE_MINOR:{id:"DEBIT_CREDIT_DIFFERENCE_MINOR",label:"Debit minus credit (minor units)",unit:"minor",sourceFields:["debitMinor","creditMinor"],formula:"sum_debit_minus_credit"},
 EXCEPTION_COUNT:{id:"EXCEPTION_COUNT",label:"Exception count",unit:"count",sourceFields:["exceptionFlag"],formula:"count_exceptions"},
 PENDING_COUNT:{id:"PENDING_COUNT",label:"Pending observations",unit:"count",sourceFields:["status"],formula:"count_pending"},
 FAILURE_RATE:{id:"FAILURE_RATE",label:"Failure rate (percent)",unit:"percent",sourceFields:["status"],formula:"failure_rate"},
 COMPLETION_RATE:{id:"COMPLETION_RATE",label:"Completion rate (percent)",unit:"percent",sourceFields:["status"],formula:"completion_rate"},
 COVERAGE_RATE:{id:"COVERAGE_RATE",label:"Evidence coverage (percent)",unit:"percent",sourceFields:["hasEvidence"],formula:"evidence_coverage"},
 OVERDUE_COUNT:{id:"OVERDUE_COUNT",label:"Overdue items",unit:"count",sourceFields:["daysPastDue"],formula:"overdue_count"},
 PAR30:{id:"PAR30",label:"Portfolio at risk over 30 days (percent)",unit:"percent",sourceFields:["daysPastDue","amountMinor"],formula:"par_30"},
 PAR60:{id:"PAR60",label:"Portfolio at risk over 60 days (percent)",unit:"percent",sourceFields:["daysPastDue","amountMinor"],formula:"par_60"},
 PAR90:{id:"PAR90",label:"Portfolio at risk over 90 days (percent)",unit:"percent",sourceFields:["daysPastDue","amountMinor"],formula:"par_90"}
};
export const METRIC_CATALOGUE=Object.freeze(METRICS);
const safeDims=["period","branch","product","status","currency","channel","rail","riskBand","segment"];
const choice=(id,label,options)=>({id,label,type:"select",options});
const baseMetricIds=["RECORD_COUNT","TOTAL_AMOUNT_MINOR","EXCEPTION_COUNT"];
function classify(name,domain){
 if(/aging|maturity ladder|due calendar|overdue|past due|arrears|expiry|backlog/i.test(name))return "AGING";
 if(/reconciliation|variance|difference|break|balance control|outbox|unmatched|trial balance|posting/i.test(name))return "RECONCILIATION";
 if(/trend|growth|calendar|timeline|migration|activity|transitions/i.test(name))return "TIMESERIES";
 if(/fraud|risk|alert|exception|quality|failure|rejection|watchlist|breach|attempt|coverage|evidence|review/i.test(name))return "EXCEPTION";
 if(/overview|summary|scorecard|kpi|position|performance|readiness|composition/i.test(name))return "SCORECARD";
 if(domain==="REG")return "REGULATORY_SOURCE";
 return "TABLE";
}
function dimensions(name,domain,layout){
 const dims=["period"];
 if(/branch|teller|vault|institution|region/i.test(name)||["BRN","ADM"].includes(domain))dims.push("branch");
 if(/product|deposit|loan|facility|account|fee/i.test(name))dims.push("product");
 if(/status|approval|rejected|case|queue|backlog|exception|pending|failed|dispute|disposition/i.test(name))dims.push("status");
 if(/risk|fraud|AML|PEP|sanction|credit/i.test(name))dims.push("riskBand");
 if(/channel|digital|mobile|agent|transfer/i.test(name))dims.push("channel");
 if(/SYSTAC|SYGMA|rail|settlement|clearing/i.test(name))dims.push("rail");
 if(/customer|segment|portfolio|individual|corporate|SME/i.test(name))dims.push("segment");
 if(/currency|foreign exchange|FX/i.test(name))dims.push("currency");
 const dedup=[...new Set(dims)].filter(d=>safeDims.includes(d));
 return dedup.length>=2?dedup.slice(0,4):[...dedup,"branch"];
}
function metrics(name,domain,layout){
 const ids=["RECORD_COUNT"];
 if(FINANCIAL.has(domain)||/amount|expense|revenue|profit|position|deposit|credit|loan|cash|payment|balance|liquidity|exposure|risk|volume|turnover|net interest/i.test(name))ids.push("TOTAL_AMOUNT_MINOR");
 if(/variance|difference|reconciliation|break|unbalanced|trial balance|cash count/i.test(name))ids.push("NET_DIFFERENCE_MINOR","DEBIT_CREDIT_DIFFERENCE_MINOR");
 if(/risk 30|PAR 30|30 days/i.test(name))ids.push("PAR30");
 if(/risk 60|PAR 60|60 days/i.test(name))ids.push("PAR60");
 if(/risk 90|PAR 90|90 days/i.test(name))ids.push("PAR90");
 if(/aging|arrears|overdue|backlog|due|past due/i.test(name))ids.push("OVERDUE_COUNT","PENDING_COUNT");
 if(/fail|decline|rejected|error|incident|breach/i.test(name))ids.push("FAILURE_RATE");
 if(/completion|coverage|compliance|evidence|readiness|attestation/i.test(name))ids.push("COVERAGE_RATE");
 if(/growth|performance|success|conversion|throughput/i.test(name))ids.push("COMPLETION_RATE");
 if(/average|rate band|distribution|concentration|size/i.test(name))ids.push("AVERAGE_AMOUNT_MINOR");
 if(["AML","FRD","RSK","SEC","OPS","KYC"].includes(domain)||layout==="EXCEPTION")ids.push("EXCEPTION_COUNT");
 return [...new Set(ids)].slice(0,7).map(x=>METRICS[x]);
}
const strictSource={
 scope:"BANK_BRANCH_AND_REGULATORY_OWNERSHIP_REQUIRED",
 dataContract:"NOT_WIRED",
 eventAsOf:"NOT_WIRED",
 immutableSnapshot:"NOT_WIRED",
 versionedMapping:"NOT_WIRED",
 reconciliation:"NOT_WIRED",
 drilldown:"BLOCKED",
 evidenceLink:"NOT_WIRED",
 expectedRows:"SERVER_DEFINED",
 dataFlow:"CLIENT_SYNTHETIC_FIXTURES_ONLY"
};
const roles={
 basic:["bank_analyst","bank_reviewer","bank_auditor"],
 confidential:["bank_compliance","bank_reviewer","bank_auditor"],
 regulator:["bank_regulatory_reporter","bank_regulatory_reviewer","bank_auditor"],
 hr:["bank_hr","bank_payroll_reviewer","bank_auditor"],
 education:["training_instructor","training_auditor"]
};
function blueprint(code,owner,group,name,index){
 const id="RPT-"+code+"-"+String(index+1).padStart(3,"0");
 const layout=classify(name,code),dims=dimensions(name,code,layout),measures=metrics(name,code,layout);
 const groupBy=layout==="TIMESERIES"?"period":dims.includes("branch")?"branch":dims[0];
 const confidential=CONFIDENTIAL.has(code)||/investigat|case|staff|employee|customer identity|client/i.test(name);
 const regulated=code==="REG"||/regulatory|supervisory|prudential|COBAC|BEAC|SYSTAC|SYGMA/i.test(name);
 const relevant=regulated?
 ["Regulator return code, current operative mapping and effective period not supplied",
 "Source financial lineage, PCEC mapping, reconciled accounting and sign-off not verified",
 "Final regulatory submission and official receipt disabled"]:
 ["Institution version, calculation policy and audit trail must be approved","Reconciled source snapshot and bank role must be verified"];
 return {
  id,code,ownerDomain:owner,group,title:name,version:"0.1.0-design",status:"DRAFT_NOT_ACCEPTED",
  description:"Design-only "+name.toLowerCase()+" report with source lineage and controlled, scoped metrics. No bank source is connected.",
  visual:layout,grain:groupBy,dimensions:dims,
  measures:measures.map(m=>({...m,calculationStatus:"PREVIEW_IMPLEMENTED_SYNTHETIC_ONLY"})),
  defaultFilters:["period",groupBy==="period"?"branch":groupBy].filter((x,i,a)=>a.indexOf(x)===i),
  allowedFilters: [...new Set(["period",...dims,"minDaysPastDue"])].map(x=>INPUTS[x]),
  dataModel:{source:"SYNTHETIC_ONLY",fixtureCode:"DEMO",currencyPolicy:"ONE_CURRENCY_PER_REPORT_RESULT",timezone:"Africa/Douala",institutionScope:"DEMO-BANK-ONLY",recordVersion:"SYNTHETIC-V1"},
  sourceRequirements:{...strictSource,authoritativeOwner:owner,needLegalEffectiveText:regulated},
  privacy:{classification:code==="HR"?"HR_RESTRICTED":confidential?"CONFIDENTIAL":"INTERNAL",
   tenantIdRequired:true,rowLevelSecurity:"SERVER_NOT_CONNECTED",projectionFields:"AGGREGATES_ONLY",
   suppressSmallGroupThreshold:5,maskPII:true,realPIIAccepted:false},
  authorization:{roleClasses:code==="REG"?roles.regulator:code==="HR"?roles.hr:code==="EDU"?roles.education:confidential?roles.confidential:roles.basic,
   serverPolicy:"NOT_CONNECTED",makerChecker:regulated?"MANDATORY_NOT_WIRED":"ROLE_BASED_NOT_WIRED",
   runRealReport:false,exportOfficial:false,drilldownSensitive:false,submitRegulator:false},
  outputs:{table:true,chart:layout!=="REGULATORY_SOURCE",csvSpecimen:true,jsonSpecimen:true,htmlPrintSpecimen:true,pdfOfficial:false,regulatorySubmission:false},
  businessChecks:relevant,acceptance:{calculationReviewed:false,reportOwnerSignedOff:false,accountingReconciled:false,securityTested:false,regulatoryMappingApproved:false},
  approvedForProduction:false
 };
}
const reports=[];
for(const [code,quota,owner,group,namesStr]of REPORT_GROUPS){
 const names=namesStr.split(";").map(x=>x.trim()).filter(Boolean);
 if(names.length!==quota)throw Error(code+" expected "+quota+" got "+names.length);
 for(let i=0;i<names.length;i++)reports.push(blueprint(code,owner,group,names[i],i));
}
export const REPORTS=Object.freeze(reports);
export const REPORT_BY_ID=new Map(REPORTS.map(r=>[r.id,r]));
export const REPORT_GROUP_COUNTS=Object.freeze(Object.fromEntries(REPORT_GROUPS.map(([code])=>[code,REPORTS.filter(r=>r.code===code).length])));
export const REPORT_SUMMARY=Object.freeze({total:REPORTS.length,families:REPORT_GROUPS.length,reportClasses:[...new Set(REPORTS.map(r=>r.visual))],
 metricsDefined:Object.keys(METRICS).length,measurePlacements:REPORTS.reduce((n,r)=>n+r.measures.length,0),
 accepted:0,liveConnectors:0,approvedFilings:0,producer:"SYNTHETIC_FIXTURES_ONLY"});
