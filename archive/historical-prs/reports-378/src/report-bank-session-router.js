/**
 * Trusted backend router from a VERIFIED report subject to one dedicated
 * PostgreSQL SESSION_USER. No HTTP handler, pool-wide tenant setting, SET ROLE,
 * arbitrary query execution, shared superuser, or caller-selected bank.
 *
 * This adapter needs independently trusted binding/secret services. The lab
 * connector option is isolated to localhost+opes_test+NODE_ENV=test. No real
 * bank connection or identity store is configured in the repository.
 */
export class BankSessionRoutingDenied extends Error {
  constructor(code){super(code);this.name="BankSessionRoutingDenied";this.code=code;}
}
const deny=code=>{throw new BankSessionRoutingDenied(code);};
const id=v=>typeof v==="string"&&/^[A-Za-z0-9][A-Za-z0-9_.:@-]{2,119}$/.test(v);
const role=v=>typeof v==="string"&&/^[a-z][a-z0-9_]{3,62}$/.test(v);
const text=v=>typeof v==="string"&&v.length>0&&v.length<4096;
const requiredQueries=new Set([
  "SELECT institution_id,actor_id FROM opes_rpt_review_lab.session_scope()",
  "SELECT report_id,institution_id,maker_id,checker_id,content_digest,version,state FROM opes_rpt_review_lab.read_review($1)",
  "SELECT opes_rpt_review_lab.advance_review($1,$2,$3,$4) AS accepted"
]);
export function createBankScopedSessionRouter({
  issuer,lookupBinding,loadSecret,connect,now=()=>Date.now(),
  allowDisposableLab=false
}={}){
  if(typeof issuer!=="string"||!issuer.startsWith("https://")||
     typeof lookupBinding!=="function"||typeof loadSecret!=="function"||
     typeof connect!=="function"||typeof now!=="function")
    deny("ROUTER_NOT_CONFIGURED");
  // The only permitted insecure connection is a disposable CI/test-only lab.
  if(allowDisposableLab&&
    (typeof process==="undefined"||process.env.NODE_ENV!=="test"))
    deny("INSECURE_LAB_NOT_ALLOWED");
  return async function acquireTrustedSession(principal){
    if(!principal||!id(principal.subjectId)||principal.issuer!==issuer)
      deny("VERIFIED_IDENTITY_REQUIRED");
    let client, handedOff=false;
    try{
      // Identity binding is queried from trusted data, not supplied by token.
      const binding=await lookupBinding(Object.freeze({
        subjectId:principal.subjectId,issuer
      }));
      if(!binding||binding.active!==true||binding.issuer!==issuer||
        binding.subjectId!==principal.subjectId||
        !id(binding.institutionId)||!id(binding.actorId)||
        !role(binding.databaseRole)||binding.actorId!==principal.subjectId||
        !Number.isSafeInteger(binding.version)||binding.version<1||
        !Number.isSafeInteger(binding.validUntil)||binding.validUntil<=now())
        deny("BINDING_NOT_AUTHORIZED");
      const secret=await loadSecret(Object.freeze({
        institutionId:binding.institutionId,role:binding.databaseRole,
        bindingVersion:binding.version
      }));
      if(!secret||secret.role!==binding.databaseRole||
        secret.institutionId!==binding.institutionId||
        !text(secret.password)||!text(secret.host)||
        !Number.isInteger(secret.port)||secret.port<1||secret.port>65535||
        !text(secret.database))
        deny("CREDENTIAL_BINDING_MISMATCH");
      if(allowDisposableLab){
        if(!["127.0.0.1","localhost"].includes(secret.host)||
          secret.database!=="opes_test"||secret.ssl!==false)
          deny("DISPOSABLE_LAB_ENDPOINT_ONLY");
      }else if(secret.ssl!==true||!text(secret.caCertificate)||
        !text(secret.expectedHostName)||secret.host!==secret.expectedHostName||
        !secret.verifyServerIdentity)
        deny("TLS_SERVER_VERIFICATION_REQUIRED");
      // A connector MUST create an isolated, directly authenticated database
      // login, and disable pooled cross-actor reuse. Secrets stay server-side.
      client=await connect(Object.freeze({
        host:secret.host,port:secret.port,database:secret.database,
        user:binding.databaseRole,password:secret.password,
        ssl:secret.ssl,caCertificate:secret.caCertificate||null,
        expectedHostName:secret.expectedHostName||null,
        verifyServerIdentity:secret.verifyServerIdentity||false,
        dedicatedSession:true
      }));
      if(!client||typeof client.query!=="function"||
        typeof client.release!=="function")deny("DATABASE_SESSION_UNAVAILABLE");
      const identity=await client.query("SELECT session_user AS login_role");
      if(!Array.isArray(identity?.rows)||identity.rows.length!==1||
        identity.rows[0]?.login_role!==binding.databaseRole)
        deny("DATABASE_LOGIN_MISMATCH");
      // Re-read trusted binding after connection establishment to catch
      // membership revocations and credential rotation during network setup.
      const fresh=await lookupBinding(Object.freeze({
        subjectId:principal.subjectId,issuer
      }));
      if(!fresh||fresh.active!==true||fresh.databaseRole!==binding.databaseRole||
        fresh.institutionId!==binding.institutionId||
        fresh.actorId!==binding.actorId||
        fresh.version!==binding.version||
        fresh.validUntil<=now())
        deny("BINDING_REVOKED_DURING_CONNECT");
      handedOff=true;
      let closed=false;
      return Object.freeze({
        async query(sql,params=[]){
          if(closed)deny("SESSION_ALREADY_RELEASED");
          if(!requiredQueries.has(sql)||
            !Array.isArray(params)||params.length>4)
            deny("UNAPPROVED_DATABASE_QUERY");
          return client.query(sql,params);
        },
        async release(){
          if(!closed){
            closed=true;
            await client.release();
          }
        }
      });
    }catch(error){
      if(!handedOff&&client&&typeof client.release==="function"){
        try{await client.release();}catch{}
      }
      if(error instanceof BankSessionRoutingDenied)throw error;
      deny("TRUSTED_DATABASE_CONNECT_FAILED");
    }
  };
}
