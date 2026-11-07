/**
 * Engineering acceptance matrix for every named report. All gates are
 * unverified by default; green prototype tests must not promote them.
 */
import {REPORTS,REPORT_GROUPS} from "./report-registry.js";
export const REPORT_ACCEPTANCE_GATES=Object.freeze([
  "OIDC_ISSUER_AND_BANK_MEMBERSHIP",
  "TENANT_AND_BRANCH_RLS_PENETRATION",
  "IMMUTABLE_SOURCE_ADAPTER_AND_LINEAGE",
  "LEDGER_AND_SETTLEMENT_RECONCILIATION",
  "INDEPENDENT_PCEC_AND_LEGAL_MAPPING",
  "GOLDEN_DATA_METRIC_VALIDATION",
  "MAKER_CHECKER_AND_APPROVAL_AUDIT",
  "RETENTION_PRIVACY_AND_EVIDENCE_ARCHIVE",
  "EN_FR_WCAG_22_AA_AND_ZOOM",
  "OFFICIAL_EXPORT_AND_REGULATORY_SUBMISSION"
]);
export function createReportingCertificationRegister(reports=REPORTS){
  if(!Array.isArray(reports)||new Set(reports.map(r=>r.id)).size!==reports.length)
    throw Error("REPORT_REGISTER_INVALID");
  return reports.map(report=>Object.freeze({
    reportId:report.id,title:report.title,domain:report.code,owner:report.ownerDomain,
    contractVersion:report.version,productionStatus:"BLOCKED",
    acceptedGateCount:0,requiredGateCount:REPORT_ACCEPTANCE_GATES.length,
    officialIssuanceEnabled:false,regulatedSubmissionEnabled:false,
    gates:REPORT_ACCEPTANCE_GATES.map(code=>Object.freeze({
      code,status:"NOT_VERIFIED",independentEvidenceId:null
    }))
  }));
}
export function reportingAcceptanceSummary(register=createReportingCertificationRegister()){
  const groups=new Set(register.map(r=>r.domain));
  return Object.freeze({reportCount:register.length,groups:groups.size,
    gatesPerReport:REPORT_ACCEPTANCE_GATES.length,
    requiredEvidenceRecords:register.length*REPORT_ACCEPTANCE_GATES.length,
    productionAccepted:register.filter(r=>r.productionStatus==="ACCEPTED").length,
    mainlineReleaseAllowed:false,
    note:"Prototype tests do not certify source lineage, legal mappings or official report readiness"});
}
