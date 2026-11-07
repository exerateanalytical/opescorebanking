/**
 * PostgreSQL review store bound to a trusted authenticated per-actor DB session.
 * No connection string, arbitrary SQL, tenant ID, role, or DB credentials are
 * ever accepted from a client request. This requires a production backend that
 * provisions a separate authenticated login per bank actor; NOT configured here.
 *
 * The SQL schema is currently only a disposable PostgreSQL 16 laboratory.
 */
export class PgReviewStoreError extends Error {
 constructor(code){super(code);this.name="PgReviewStoreError";this.code=code;}
}
const fail=x=>{throw new PgReviewStoreError(x);};
const valid=s=>typeof s==="string"&&/^[A-Za-z0-9][A-Za-z0-9_.:@-]{2,119}$/.test(s);
const safeDraft=r=>r&&typeof r==="object"&&
 valid(r.report_id)&&valid(r.institution_id)&&valid(r.maker_id)&&
 valid(r.content_digest)&&Number.isSafeInteger(Number(r.version))&&
 Number(r.version)>=0&&["DRAFT","PENDING_REVIEW","REVIEWED_NOT_PUBLISHED"].includes(r.state);

export function createScopedPgReviewStore({acquireTrustedSession}={}){
 if(typeof acquireTrustedSession!=="function")fail("TRUSTED_DB_SESSION_PROVIDER_MISSING");
 async function scoped(principal,task){
  if(!principal||principal.verified!==true||!valid(principal.subjectId))
    fail("VERIFIED_PRINCIPAL_REQUIRED");
  let session;
  try{
   session=await acquireTrustedSession(Object.freeze({
    subjectId:principal.subjectId,issuer:principal.issuer||null
   }));
   if(!session||typeof session.query!=="function"||typeof session.release!=="function")
    fail("SCOPED_SESSION_UNAVAILABLE");
   const scope=await session.query(
    "SELECT institution_id,actor_id FROM opes_rpt_review_lab.session_scope()");
   if(!Array.isArray(scope?.rows)||scope.rows.length!==1||
      !valid(scope.rows[0].institution_id)||
      scope.rows[0].actor_id!==principal.subjectId)
     fail("DATABASE_IDENTITY_SCOPE_MISMATCH");
   return await task(session,scope.rows[0]);
  }catch(error){
   if(error instanceof PgReviewStoreError)throw error;
   fail("SCOPED_DATABASE_OPERATION_FAILED");
  }finally{
   if(session&&typeof session.release==="function"){
    try{await session.release();}
    catch{fail("DATABASE_SESSION_RELEASE_FAILED");}
   }
  }
 }
 return Object.freeze({
  async loadDraft(reportId,{principal}={}){
   if(!valid(reportId))fail("INVALID_REPORT_ID");
   return scoped(principal,async(db,identity)=>{
    const result=await db.query(
     "SELECT report_id,institution_id,maker_id,checker_id,content_digest,version,state FROM opes_rpt_review_lab.read_review($1)",
     [reportId]);
    if(!Array.isArray(result?.rows)||result.rows.length>1)
     fail("DATABASE_RESPONSE_INVALID");
    if(!result.rows.length)return null;
    const row=result.rows[0];
    if(!safeDraft(row)||row.report_id!==reportId||
       row.institution_id!==identity.institution_id)
     fail("DATABASE_RESPONSE_SCOPE_MISMATCH");
    return Object.freeze({
     reportId:row.report_id,institutionId:row.institution_id,
     makerId:row.maker_id,checkerId:row.checker_id,
     contentDigest:row.content_digest,version:Number(row.version),state:row.state
    });
   });
  },
  async transitionWithAudit(command){
   if(!command||!valid(command.reportId)||!valid(command.institutionId)||
      !valid(command.actorId)||!valid(command.contentDigest)||
      !Number.isSafeInteger(command.expectedVersion)||command.expectedVersion<0||
      !["DRAFT","PENDING_REVIEW"].includes(command.expectedState)||
      !command.principal||command.actorId!==command.principal.subjectId)
     fail("INVALID_REVIEW_COMMAND");
   return scoped(command.principal,async(db,identity)=>{
    if(identity.institution_id!==command.institutionId||
       identity.actor_id!==command.actorId)
     fail("DATABASE_IDENTITY_SCOPE_MISMATCH");
    const result=await db.query(
     "SELECT opes_rpt_review_lab.advance_review($1,$2,$3,$4) AS accepted",
     [command.reportId,command.expectedVersion,
      command.expectedState,command.contentDigest]);
    if(!Array.isArray(result?.rows)||result.rows.length!==1||
      typeof result.rows[0].accepted!=="boolean")
     fail("DATABASE_RESPONSE_INVALID");
    return result.rows[0].accepted===true;
   });
  }
 });
}
