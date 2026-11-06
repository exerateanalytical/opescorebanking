/**
 * Candidate financial metric calculation for independently controlled evidence
 * tests. This is deliberately NOT the synthetic preview engine, but it is NOT
 * an accepted reporting calculator either. It never issues official outputs.
 * A live service must independently reconcile source fields, mappings,
 * period close and downstream golden-master results.
 */
export class CandidateCalculationRejected extends Error{
  constructor(code){super(code);this.name="CandidateCalculationRejected";this.code=code;}
}
const stop=code=>{throw new CandidateCalculationRejected(code);};
const minor=s=>typeof s==="string"&&/^(0|[1-9][0-9]{0,37})$/.test(s);
const id=s=>typeof s==="string"&&/^[A-Za-z0-9][A-Za-z0-9_.:-]{2,119}$/.test(s);
const percent=(n,d)=>d===0n?null:(n*10000n/d/100n).toString()+"."+
  String(n*10000n/d%100n).padStart(2,"0");
const SUPPORTED=new Set(["RECORD_COUNT","TOTAL_AMOUNT_MINOR","AVERAGE_AMOUNT_MINOR",
  "NET_DIFFERENCE_MINOR","DEBIT_CREDIT_DIFFERENCE_MINOR","EXCEPTION_COUNT",
  "PENDING_COUNT","FAILURE_RATE","COMPLETION_RATE","COVERAGE_RATE",
  "OVERDUE_COUNT","PAR30","PAR60","PAR90"]);
const sum=(rows,key)=>rows.reduce((n,row)=>n+BigInt(row[key]),0n);
const rate=(rows,check)=>percent(BigInt(rows.filter(check).length),BigInt(rows.length));

export function calculateCandidateMetrics({report,records,criteria}={}){
  if(!report||report.status!=="DRAFT_NOT_ACCEPTED"||report.approvedForProduction!==false||
    !Array.isArray(report.measures)||report.measures.length===0||
    report.measures.some(m=>!SUPPORTED.has(m.id))||
    !criteria||!id(criteria.institutionId)||!id(criteria.revision)||
    !Array.isArray(criteria.branchIds)||criteria.branchIds.length===0||
    !criteria.branchIds.every(id)||new Set(criteria.branchIds).size!==criteria.branchIds.length||
    !/^[A-Z]{3}$/.test(criteria.currency||"")||
    !/^[0-9]{4}-(0[1-9]|1[0-2])$/.test(criteria.period||"")||
    !Array.isArray(records)||records.length>100000)
    stop("UNSUPPORTED_CANDIDATE_CALCULATION");
  const seen=new Set();
  for(const r of records){
    if(!r||!id(r.recordId)||seen.has(r.recordId)||
      r.institutionId!==criteria.institutionId||
      !criteria.branchIds.includes(r.branchId)||
      r.currency!==criteria.currency||r.period!==criteria.period||
      r.revision!==criteria.revision||r.status==="UNKNOWN"||
      typeof r.status!=="string"||!["PENDING","COMPLETED","FAILED","BLOCKED"].includes(r.status)||
      typeof r.exceptionFlag!=="boolean"||typeof r.hasEvidence!=="boolean"||
      !Number.isSafeInteger(r.daysPastDue)||r.daysPastDue<0||
      !["amountMinor","expectedMinor","actualMinor","debitMinor","creditMinor","exposureMinor"]
        .every(k=>minor(r[k])))
      stop("INVALID_OR_CROSS_BANK_CALCULATION_RECORD");
    seen.add(r.recordId);
  }
  const total=sum(records,"amountMinor");
  const exposure=sum(records,"exposureMinor");
  const metrics={
    RECORD_COUNT:records.length,
    TOTAL_AMOUNT_MINOR:total.toString(),
    AVERAGE_AMOUNT_MINOR:records.length?(total/BigInt(records.length)).toString():null,
    NET_DIFFERENCE_MINOR:(sum(records,"actualMinor")-sum(records,"expectedMinor")).toString(),
    DEBIT_CREDIT_DIFFERENCE_MINOR:(sum(records,"debitMinor")-sum(records,"creditMinor")).toString(),
    EXCEPTION_COUNT:records.filter(r=>r.exceptionFlag).length,
    PENDING_COUNT:records.filter(r=>r.status==="PENDING").length,
    FAILURE_RATE:rate(records,r=>r.status==="FAILED"),
    COMPLETION_RATE:rate(records,r=>r.status==="COMPLETED"),
    COVERAGE_RATE:rate(records,r=>r.hasEvidence),
    OVERDUE_COUNT:records.filter(r=>r.daysPastDue>0).length
  };
  for(const threshold of [30,60,90])
    metrics["PAR"+threshold]=percent(
      sum(records.filter(r=>r.daysPastDue>=threshold),"exposureMinor"),exposure);
  return Object.freeze({
    status:"CANDIDATE_UNVERIFIED",publishable:false,approvedForProduction:false,
    reportId:report.id,formulaVersion:"candidate-v1",currency:criteria.currency,
    institutionId:criteria.institutionId,revision:criteria.revision,
    metrics:Object.freeze(Object.fromEntries(report.measures.map(m=>[m.id,metrics[m.id]]))),
    warning:"CANDIDATE CALCULATION ONLY — NO OFFICIAL FINANCIAL OR REGULATORY USE"
  });
}
