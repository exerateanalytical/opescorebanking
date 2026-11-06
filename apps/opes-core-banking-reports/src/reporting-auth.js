/**
 * Server-only reporting authentication and authorization adapters.
 * OIDC access-token verification uses an explicitly provisioned, pinned key
 * store. No key downloads, token-provided keys or identity from query params.
 * This is an integration adapter; it requires a real trusted issuer, key
 * rotation control, and independent durable membership authority to deploy.
 */
import {createPublicKey,verify as cryptoVerify} from "node:crypto";

export class ReportingAccessDenied extends Error {
  constructor(code){super(code);this.name="ReportingAccessDenied";this.code=code;}
}
const deny=code=>{throw new ReportingAccessDenied(code);};
const validId=s=>typeof s==="string"&&/^[A-Za-z0-9][A-Za-z0-9_.:@-]{2,119}$/.test(s);
const object=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const b64=s=>typeof s==="string"&&s.length>0&&s.length<12288&&/^[A-Za-z0-9_-]+$/.test(s);
const decode=s=>{
  if(!b64(s))deny("INVALID_TOKEN");
  const raw=Buffer.from(s,"base64url");
  if(raw.toString("base64url")!==s)deny("INVALID_TOKEN");
  try{const value=JSON.parse(raw.toString("utf8"));if(!object(value))deny("INVALID_TOKEN");return value;}
  catch{deny("INVALID_TOKEN");}
};
const bearer=req=>{
  const h=req?.headers?.authorization;
  if(typeof h!=="string"||!/^Bearer [A-Za-z0-9_.-]+$/.test(h)||h.length>13000)
    deny("AUTHENTICATION_REQUIRED");
  return h.slice(7);
};
const fixedTime=()=>Date.now();

export function createPinnedOidcAuthenticator({issuer,audience,trustedKeys,now=fixedTime}={}){
  if(typeof issuer!=="string"||!/^https:\/\/[^/?#\s]+(?:\/[^?#\s]*)?$/.test(issuer)||
    !validId(audience)||!(trustedKeys instanceof Map)||trustedKeys.size===0||
    typeof now!=="function")deny("AUTH_CONFIGURATION_MISSING");
  return async function authenticate(request){
    let compact;
    try{compact=bearer(request);}catch(e){if(e instanceof ReportingAccessDenied)throw e;deny("AUTHENTICATION_REQUIRED");}
    const chunks=compact.split(".");
    if(chunks.length!==3||!chunks.every(b64))deny("INVALID_TOKEN");
    const [h,p,s]=chunks,header=decode(h),claims=decode(p);
    if(header.typ!=="at+jwt"&&header.typ!=="JWT")deny("INVALID_TOKEN");
    if(header.crit!==undefined||header.jku!==undefined||header.jwk!==undefined||
       header.x5u!==undefined||header.x5c!==undefined)deny("UNTRUSTED_TOKEN_HEADER");
    if(!["RS256","EdDSA"].includes(header.alg)||!validId(header.kid))
      deny("INVALID_TOKEN_ALGORITHM");
    const keyEntry=trustedKeys.get(header.kid);
    if(!object(keyEntry)||keyEntry.active!==true||keyEntry.algorithm!==header.alg||
       !keyEntry.publicKey)deny("UNTRUSTED_SIGNING_KEY");
    let key,valid=false;
    try{
      key=createPublicKey(keyEntry.publicKey);
      const keyType=key.asymmetricKeyType;
      if(header.alg==="RS256"&&keyType!=="rsa")deny("INVALID_TOKEN_ALGORITHM");
      if(header.alg==="EdDSA"&&keyType!=="ed25519")deny("INVALID_TOKEN_ALGORITHM");
      valid=cryptoVerify(header.alg==="RS256"?"RSA-SHA256":null,
        Buffer.from(h+"."+p,"utf8"),key,Buffer.from(s,"base64url"));
    }catch(e){if(e instanceof ReportingAccessDenied)throw e;deny("INVALID_TOKEN_SIGNATURE");}
    if(!valid)deny("INVALID_TOKEN_SIGNATURE");
    const t=now()/1000;
    if(!Number.isFinite(t)||claims.iss!==issuer||
      !(claims.aud===audience||Array.isArray(claims.aud)&&claims.aud.includes(audience))||
      !validId(claims.sub)||!Number.isInteger(claims.exp)||
      !Number.isInteger(claims.iat)||!Number.isInteger(claims.nbf)||
      claims.exp<=t-30||claims.nbf>t+30||claims.iat>t+30||
      claims.exp<=claims.iat||claims.exp-claims.iat>3600||
      (Array.isArray(claims.aud)&&claims.aud.length>1&&claims.azp!==audience))
      deny("INVALID_TOKEN_CLAIMS");
    // Bank, branch, groups and roles in access tokens are NEVER entitlements.
    return Object.freeze({subjectId:claims.sub,issuer:claims.iss,verified:true,
      authenticatedAt:Math.floor(t),keyId:header.kid});
  };
}

/**
 * lookupMemberships must read a trusted institution-owned access store, never
 * token claims. Ambiguous multibank memberships are denied; the router cannot
 * silently select a bank from user-controlled input. No training identities on
 * this live reporting path. Revocations must be checked on every invocation.
 */
export function createInstitutionReportAuthorizer({lookupMemberships,now=fixedTime}={}){
  if(typeof lookupMemberships!=="function"||typeof now!=="function")
    deny("AUTH_CONFIGURATION_MISSING");
  return async function authorize({principal,report}={}){
    if(!principal?.verified||!validId(principal.subjectId)||!object(report))
      deny("AUTHENTICATION_REQUIRED");
    const memberships=await lookupMemberships({subjectId:principal.subjectId});
    if(!Array.isArray(memberships)||memberships.length>100)deny("MEMBERSHIP_UNAVAILABLE");
    const active=memberships.filter(m=>object(m)&&m.state==="ACTIVE"&&
      m.institutionState==="ACTIVE"&&validId(m.institutionId)&&
      Array.isArray(m.roles)&&Array.isArray(m.branchIds)&&
      Number.isSafeInteger(m.validUntil)&&m.validUntil>now());
    if(active.length!==1)deny("MEMBERSHIP_AMBIGUOUS_OR_REVOKED");
    const m=active[0];
    const allowed=new Set(report.authorization?.roleClasses||[]);
    const bankRoles=m.roles.filter(x=>typeof x==="string"&&x.startsWith("bank_")&&allowed.has(x));
    if(bankRoles.length===0||!m.permissions?.includes("reports.source.preflight"))
      deny("NOT_AUTHORIZED");
    if(m.branchIds.length===0||m.branchIds.length>200||
      !m.branchIds.every(validId)||new Set(m.branchIds).size!==m.branchIds.length)
      deny("INVALID_BRANCH_SCOPE");
    return Object.freeze({allowPreflight:true,subjectId:principal.subjectId,
      institutionId:m.institutionId,branchIds:Object.freeze([...m.branchIds])});
  };
}
