/**
 * Real PostgreSQL command adapter for disposable Stage3 candidate schema.
 * Trusted per-actor connection provider is injected; never accepts a
 * client-supplied DB principal/connection string or bank authority.
 *
 * Production requires independently verified OIDC/DB role routing, TLS/KMS,
 * branch entitlements, secure provisioning, operational DR, and approved rules.
 * No real posting, settlement, entitlement activation, regulator submission.
 */
export class PgStage3Denied extends Error {
 constructor(code){super(code);this.name="PgStage3Denied";this.code=code;}
}
const deny=code=>{throw new PgStage3Denied(code);};
const id=v=>typeof v==="string"&&/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(v);
export function createPgStage3CandidateStore({acquireTrustedActorSession}={}){
 if(typeof acquireTrustedActorSession!=="function")
  deny("TRUSTED_BANK_DATABASE_ROUTER_MISSING");
 async function withSession(input,task){
  if(!id(input.bankId)||!id(input.actorId))deny("INVALID_ACTOR_SCOPE");
  let s;
  try{
   s=await acquireTrustedActorSession(Object.freeze({
    actorId:input.actorId,expectedBankId:input.bankId
   }));
   if(!s||typeof s.query!=="function"||typeof s.release!=="function")
    deny("DATABASE_SESSION_UNAVAILABLE");
   const identity=await s.query(
    "SELECT opes_stage3.current_bank_id()::text AS bank_id,session_user AS db_role");
   if(!Array.isArray(identity?.rows)||identity.rows.length!==1||
     identity.rows[0].bank_id!==input.bankId)
    deny("BANK_DATABASE_SCOPE_MISMATCH");
   return await task(s);
  }catch(e){
   if(e instanceof PgStage3Denied)throw e;
   deny("ATOMIC_CANDIDATE_DATABASE_REJECTED");
  }finally{
   if(s&&typeof s.release==="function"){
    try{await s.release();}catch{deny("DATABASE_RELEASE_FAILURE");}
   }
  }
 }
 const applySQL= "SELECT opes_stage3.apply_candidate($1::text,$2::uuid,$3::integer,$4::bigint,$5::text,$6::text,$7::jsonb,$8::uuid,$9::text,$10::uuid) AS receipt";
 const readSQL= "SELECT opes_stage3.read_candidate($1::text,$2::uuid) AS receipt";
 return Object.freeze({
  trustedBankScope:true,
  async atomicCandidate(command){
   if(!command||typeof command.domain!=="string"||
      !id(command.aggregateId)||!id(command.correlationId))
    deny("INVALID_COMMAND");
   return withSession(command,async session=>{
    const args=[command.domain,command.aggregateId,command.stage,
      command.expectedVersion,command.idempotencyKey,command.commandDigest,
      command.fieldValues===undefined?null:JSON.stringify(command.fieldValues),
      command.evidenceRef??null,command.decision??null,command.correlationId];
    const res=await session.query(applySQL,args);
    if(!Array.isArray(res?.rows)||res.rows.length!==1||!res.rows[0]?.receipt)
     deny("INVALID_COMMIT_RECEIPT");
    const receipt=res.rows[0].receipt;
    if(receipt.bankId!==command.bankId||
      receipt.aggregateId!==command.aggregateId||
      receipt.financialEffective!==false||
      receipt.regulatorySubmissionEnabled!==false)
     deny("BANK_RESULT_SCOPE_MISMATCH");
    return receipt;
   });
  },
  async readCandidate({bankId,domain,aggregateId,actorId}={}){
   if(!id(aggregateId)||typeof domain!=="string")deny("INVALID_READ");
   return withSession({bankId,actorId},async session=>{
    const res=await session.query(readSQL,[domain,aggregateId]);
    if(!Array.isArray(res?.rows)||res.rows.length!==1)
     deny("INVALID_READ_RESPONSE");
    const receipt=res.rows[0].receipt;
    if(receipt===null)return null;
    if(!receipt||receipt.bankId!==bankId||
       receipt.aggregateId!==aggregateId)
     deny("BANK_RESULT_SCOPE_MISMATCH");
    return receipt;
   });
  }
 });
}
