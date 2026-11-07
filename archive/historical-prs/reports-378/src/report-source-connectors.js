/**
 * Six read-only domain source adapter contracts for reporting snapshots.
 * They cannot be used to post, mutate, approve, publish or issue statements.
 * Registered adapters MUST be independently implemented by trusted bank
 * backend teams and enforce bank credentials/RLS within the storage engine.
 */
export const REPORT_SOURCE_DOMAINS=Object.freeze({
  LEDGER:Object.freeze(["LED","FIN","ACT","REG","RSK","BI"]),
  DEPOSITS:Object.freeze(["DEP","PRD","CIF","KYC"]),
  PAYMENTS:Object.freeze(["PAY","CLR","CARD","CHN"]),
  CREDIT:Object.freeze(["CRD","COL"]),
  TREASURY:Object.freeze(["TRE"]),
  CASH:Object.freeze(["BRN","OPS","HR","ADM","AML","FRD","EDU","PRC"])
});
const routing=new Map(Object.entries(REPORT_SOURCE_DOMAINS).flatMap(
  ([name,groups])=>groups.map(code=>[code,name])
));
const allowed=s=>typeof s==="string"&&/^[A-Za-z0-9][A-Za-z0-9_.:-]{2,119}$/.test(s);
const exact=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&
  new Set(a).size===a.length&&a.every(x=>b.includes(x));
export class SourceConnectorRejected extends Error{
  constructor(code){super(code);this.name="SourceConnectorRejected";this.code=code;}
}
const reject=code=>{throw new SourceConnectorRejected(code);};
export function createScopedDomainSnapshotReader({reports,sources}={}){
  if(!(reports instanceof Map)||!(sources instanceof Map)||sources.size!==6||
     [...Object.keys(REPORT_SOURCE_DOMAINS)].some(k=>typeof sources.get(k)?.readSnapshot!=="function"))
    reject("CONNECTORS_NOT_CONFIGURED");
  return async function readSnapshot(criteria){
    if(!criteria||!allowed(criteria.institutionId)||!allowed(criteria.reportId)||
       !reports.has(criteria.reportId)||!Array.isArray(criteria.branchIds)||
       criteria.branchIds.length===0||!criteria.branchIds.every(allowed)||
       new Set(criteria.branchIds).size!==criteria.branchIds.length||
       !/^[0-9]{4}-(0[1-9]|1[0-2])$/.test(criteria.period)||
       !/^[A-Z]{3}$/.test(criteria.currency))
      reject("INVALID_SCOPE");
    const report=reports.get(criteria.reportId);
    const domain=routing.get(report.code);
    if(!domain)reject("UNMAPPED_DOMAIN");
    const safeCriteria=Object.freeze({
      reportId:criteria.reportId,reportVersion:criteria.reportVersion,
      institutionId:criteria.institutionId,branchIds:Object.freeze([...criteria.branchIds]),
      period:criteria.period,currency:criteria.currency
    });
    let snapshot;
    try{snapshot=await sources.get(domain).readSnapshot(safeCriteria);}
    catch{reject("SOURCE_UNAVAILABLE");}
    if(!snapshot||snapshot.reportId!==safeCriteria.reportId||
      snapshot.reportVersion!==safeCriteria.reportVersion||
      snapshot.institutionId!==safeCriteria.institutionId||
      snapshot.period!==safeCriteria.period||snapshot.currency!==safeCriteria.currency||
      !exact(snapshot.branchIds,safeCriteria.branchIds)||
      snapshot.immutable!==true||snapshot.reconciled!==true||
      snapshot.sourceDomain!==domain)
      reject("SOURCE_SCOPE_OR_RECONCILIATION_FAILED");
    // Source credentials and raw observations remain with the source backend.
    // Only signed-manifest metadata can cross this boundary. A raw source
    // adapter must NEVER pass client or bank data to the readiness handler.
    const permitted=new Set(["reportId","reportVersion","institutionId","branchIds",
      "period","currency","sourceDomain","immutable","reconciled",
      "snapshotId","sourceSystem","sourceRevision","mappingVersion",
      "reconciliationRef","digest","keyId","signature"]);
    if(Object.keys(snapshot).some(k=>!permitted.has(k)))
      reject("UNSAFE_SOURCE_PAYLOAD");
    return Object.freeze({...snapshot,branchIds:Object.freeze([...snapshot.branchIds])});
  };
}
