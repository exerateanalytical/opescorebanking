/**
 * Maker-checker and retention enforcement contracts. This module intentionally
 * exposes no publish, official-export, regulatory-submit or delete methods.
 * A production service needs a durable serializable/CAS state transition,
 * atomic audit recording and independently proven RBAC.
 */
export class ReviewRejected extends Error{
  constructor(code){super(code);this.name="ReviewRejected";this.code=code;}
}
const fail=code=>{throw new ReviewRejected(code);};
const id=x=>typeof x==="string"&&/^[A-Za-z0-9][A-Za-z0-9_.:-]{2,119}$/.test(x);
export function createReportReviewWorkflow({authenticate,authorize,store}={}){
  if(typeof authenticate!=="function"||typeof authorize!=="function"||
    typeof store?.loadDraft!=="function"||typeof store?.transitionWithAudit!=="function")
    fail("WORKFLOW_STORAGE_UNAVAILABLE");
  const execute=async(action,reportId,requestContext)=>{
    if(!["SUBMIT","REVIEW"].includes(action)||!id(reportId))
      fail("INVALID_WORKFLOW_OPERATION");
    const actor=await authenticate(requestContext);
    if(!actor||actor.verified!==true||!id(actor.subjectId))
      fail("AUTHENTICATION_REQUIRED");
    const draft=await store.loadDraft(reportId,{principal:actor});
    if(!draft||draft.reportId!==reportId||!id(draft.institutionId)||
      !id(draft.makerId)||!id(draft.contentDigest)||
      !Number.isSafeInteger(draft.version)||draft.version<0)
      fail("UNTRUSTED_WORKFLOW_RECORD");
    const permission=action==="SUBMIT"?"reports.review.submit":"reports.review.check";
    const grant=await authorize({actor,draft,permission});
    if(!grant||grant.allowed!==true||
      grant.institutionId!==draft.institutionId||
      grant.subjectId!==actor.subjectId)
      fail("NOT_AUTHORIZED");
    if(action==="SUBMIT"&&(draft.state!=="DRAFT"||
      actor.subjectId!==draft.makerId))fail("INVALID_MAKER_STATE");
    if(action==="REVIEW"&&(draft.state!=="PENDING_REVIEW"||
      actor.subjectId===draft.makerId))fail("SEGREGATION_OF_DUTIES");
    const next=action==="SUBMIT"?"PENDING_REVIEW":"REVIEWED_NOT_PUBLISHED";
    // Atomic transition and audit must happen within one trusted transaction,
    // with compare-and-swap version and immutable content digest validation.
    const changed=await store.transitionWithAudit(Object.freeze({
      reportId,expectedVersion:draft.version,expectedState:draft.state,
      institutionId:draft.institutionId,contentDigest:draft.contentDigest,
      actorId:actor.subjectId,principal:actor,nextState:next,auditEvent:
        action==="SUBMIT"?"REPORT_REVIEW_SUBMITTED":"REPORT_REVIEW_CHECKED"
    }));
    if(changed!==true)fail("WORKFLOW_CONFLICT_OR_AUDIT_FAILURE");
    return Object.freeze({reportId,status:next,published:false,officialExportEnabled:false});
  };
  return Object.freeze({
    submit:(reportId,requestContext)=>execute("SUBMIT",reportId,requestContext),
    review:(reportId,requestContext)=>execute("REVIEW",reportId,requestContext)
  });
}
export function evaluateRetentionHold({
  classification,legalHold,retentionUntil,asOf,approvedPolicyId
}={}){
  if(!id(classification)||!id(approvedPolicyId)||
    typeof legalHold!=="boolean"||
    !/^\d{4}-\d{2}-\d{2}$/.test(retentionUntil||"")||
    !/^\d{4}-\d{2}-\d{2}$/.test(asOf||""))
    fail("RETENTION_POLICY_UNVERIFIED");
  // Legal hold and mandatory retention always restrict disposal.
  if(legalHold)return Object.freeze({status:"PRESERVE_LEGAL_HOLD",canDelete:false});
  if(asOf<=retentionUntil)return Object.freeze({status:"PRESERVE_RETENTION",canDelete:false});
  // End of stated term is not sufficient: disposal still needs explicit
  // legal review, statutory schedule, secure destruction and dual approval.
  return Object.freeze({status:"DISPOSAL_REVIEW_REQUIRED",canDelete:false});
}
