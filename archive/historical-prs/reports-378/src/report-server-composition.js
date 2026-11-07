/**
 * Composition root for the reporting source-readiness endpoint. Requires fully
 * supplied trusted backend adapters and keeps live reporting hard disabled.
 * No auto-wiring to laboratory database, user-selected tenant, synthetic
 * browser fixtures or unapproved financial mapping is permitted.
 */
import {createReportSourcePreflight,createSourceReadinessHttpHandler}
  from "./report-source-preflight.js";
import {createScopedDomainSnapshotReader} from "./report-source-connectors.js";
export function composeReportingSourcePreflight({
  reports,authenticate,authorize,domainSources,verifyProvenance,
  mappingGate,recordAudit
}={}){
  if(!(reports instanceof Map)||typeof authenticate!=="function"||
    typeof authorize!=="function"||typeof verifyProvenance!=="function"||
    typeof mappingGate!=="function"||typeof recordAudit!=="function")
    throw Error("REPORT_COMPOSITION_INCOMPLETE");
  const readSnapshot=createScopedDomainSnapshotReader({reports,sources:domainSources});
  const checkedProof=async({snapshot,criteria,principal,report})=>{
    const [proof,mapping]=await Promise.all([
      verifyProvenance({snapshot,criteria,principal,report}),
      mappingGate({report,criteria,sourceSystem:snapshot.sourceSystem})
    ]);
    if(mapping?.status!=="MAPPING_EVIDENCE_ONLY"||
      mapping?.financialPublicationEnabled!==false||
      mapping?.officialFilingEnabled!==false)
      throw Error("INDEPENDENT_MAPPING_NOT_ACCEPTED");
    return proof;
  };
  const inspect=createReportSourcePreflight({
    reports,authenticate,authorize,readSnapshot,
    verifyProvenance:checkedProof,recordAudit
  });
  return Object.freeze({
    inspect,
    httpHandler:createSourceReadinessHttpHandler(inspect),
    liveReportingEnabled:false,officialExportEnabled:false,
    regulatorySubmissionEnabled:false
  });
}
