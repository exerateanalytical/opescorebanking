/**
 * OPES Core Banking — all 25 domain-specific CANDIDATE command services.
 * Backend-only, fail closed: no verified identity/permission/atomic store means
 * no command. Financial posting, settlement, card activation, entitlement
 * activation, official filing, disposal, or release deployment never occur.
 * This is NOT a production ledger or a certified banking service.
 */
import {createHash} from "node:crypto";
export class Stage3Denied extends Error {
  constructor(code,status=422){super(code);this.name="Stage3Denied";this.code=code;this.status=status;}
}
const deny=(code,status=422)=>{throw new Stage3Denied(code,status);};
const object=v=>v!==null&&typeof v==="object"&&!Array.isArray(v);
const uuid=v=>typeof v==="string"&&/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(v);
const actor=v=>typeof v==="string"&&/^[A-Za-z0-9][A-Za-z0-9._:@-]{2,119}$/.test(v);
const minor=v=>typeof v==="string"&&/^(0|[1-9][0-9]{0,15})$/.test(v)&&
  BigInt(v)<=9000000000000000n;
const validDate=v=>{
 if(typeof v!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(v))return false;
 const p=Date.parse(v+"T00:00:00Z");
 return Number.isFinite(p)&&new Date(p).toISOString().slice(0,10)===v;
};
function fieldValid(type,v){
 if(type.startsWith("enum:"))return typeof v==="string"&&
   type.slice(5).split(",").includes(v);
 switch(type){
 case "uuid":return uuid(v);
 case "text":return typeof v==="string"&&v.length>=3&&v.length<=240&&
   !/[\x00-\x1f\x7f]/.test(v);
 case "date":return validDate(v);
 case "dateTime":return typeof v==="string"&&
   /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(v)&&
   Number.isFinite(Date.parse(v));
 case "month":return typeof v==="string"&&/^\d{4}-(0[1-9]|1[0-2])$/.test(v);
 case "minor":return minor(v);
 case "int":return Number.isSafeInteger(v)&&v>=0&&v<=1000000;
 case "bool":return typeof v==="boolean";
 case "country":return typeof v==="string"&&/^[A-Z]{2}$/.test(v);
 case "currency":return typeof v==="string"&&/^[A-Z]{3}$/.test(v);
 case "sha256":return typeof v==="string"&&/^[a-f0-9]{64}$/.test(v);
 case "uri":
  if(typeof v!=="string"||v.length>2048)return false;
  try{const u=new URL(v);return u.protocol==="https:"&&!!u.hostname&&!u.username&&!u.password;}
  catch{return false;}
 case "uuidList":return Array.isArray(v)&&v.length>0&&v.length<=50&&
   v.every(uuid)&&new Set(v).size===v.length;
 case "scopeList":return Array.isArray(v)&&v.length>0&&v.length<=30&&
   v.every(x=>typeof x==="string"&&/^[a-z][a-z0-9._:-]{2,90}$/.test(x))&&
   new Set(v).size===v.length;
 case "journalLines":
  return Array.isArray(v)&&v.length>=2&&v.length<=200&&
   v.every(l=>object(l)&&Object.keys(l).length===4&&
   uuid(l.accountId)&&["DEBIT","CREDIT"].includes(l.side)&&
   minor(l.amountMinor)&&l.amountMinor!=="0"&&fieldValid("currency",l.currency));
 default:return false;
 }
}
function assertShape(body,fieldDefs,requiredKeys,expectedVersionMinimum,exactVersion){
 if(!object(body))deny("INVALID_REQUEST_BODY",400);
 const allowed=new Set(["aggregateId","expectedVersion",...fieldDefs.map(f=>f.name)]);
 if(Object.keys(body).some(x=>!allowed.has(x))||
   requiredKeys.some(x=>!Object.hasOwn(body,x))||
   !uuid(body.aggregateId)||
   !Number.isSafeInteger(body.expectedVersion)||
   body.expectedVersion<expectedVersionMinimum||body.expectedVersion>2147483647||
   (exactVersion!==undefined&&body.expectedVersion!==exactVersion))
   deny("INVALID_OR_UNEXPECTED_COMMAND_FIELD",422);
 for(const f of fieldDefs){
  if(Object.hasOwn(body,f.name)&&!fieldValid(f.type,body[f.name]))
   deny("INVALID_TYPED_DOMAIN_FIELD",422);
 }
}
function assertDomainInvariants(domain,body){
 const f=body;
 if(domain==="LED"){
  const currencies=new Set(f.journalLines.map(x=>x.currency));
  const accountIds=new Set(f.journalLines.map(x=>x.accountId));
  if(currencies.size!==1||accountIds.size<2)
   deny("UNBALANCED_OR_INVALID_CURRENCY_JOURNAL");
  let debit=0n,credit=0n;
  for(const l of f.journalLines){
   if(l.side==="DEBIT")debit+=BigInt(l.amountMinor);
   else credit+=BigInt(l.amountMinor);
  }
  if(debit!==credit||debit===0n)
   deny("UNBALANCED_JOURNAL");
 }
 if(domain==="PAY"&&(f.amountMinor==="0"||!f.beneficiaryVerificationId))
  deny("PAYMENT_CONTROL_EVIDENCE_REQUIRED");
 if(domain==="CRD"&&(f.principalMinor==="0"||f.tenorMonths<1||f.tenorMonths>600))
  deny("CREDIT_LIMITS_INVALID");
 if(domain==="PRD"&&f.interestRateBasisPoints>10000)
  deny("PRODUCT_RATE_OUT_OF_BOUNDS");
 if(domain==="AML"&&f.matchScoreBasisPoints>10000)
  deny("SCREENING_SCORE_OUT_OF_BOUNDS");
 if(domain==="DR"&&(f.targetRpoMinutes===0||f.targetRtoMinutes===0))
  deny("DR_TARGETS_INVALID");
 if(domain==="TST"&&f.expectedAssertionCount===0)
  deny("ASSERTION_COUNT_INVALID");
 if(domain==="REC"&&f.expectedMinor===f.observedMinor&&
   !uuid(f.breakEvidenceId))deny("RECONCILIATION_PROVENANCE_REQUIRED");
}
const digest=o=>{
 const normalized=(x)=>{
  if(Array.isArray(x))return x.map(normalized);
  if(object(x))return Object.fromEntries(Object.keys(x).sort().map(k=>[k,normalized(x[k])]));
  return x;
 };
 return createHash("sha256").update(JSON.stringify(normalized(o))).digest("hex");
};
function catalogSafe(catalog){
 if(!Array.isArray(catalog)||catalog.length!==25||
   new Set(catalog.map(d=>d.id)).size!==25)
   deny("DOMAIN_CATALOG_INCOMPLETE",503);
 for(const d of catalog){
  if(!/^[A-Z]{2,4}$/.test(d.id)||d.actions.length!==3||
   d.fields.length<5||new Set(d.fields.map(f=>f.name)).size!==d.fields.length||
   !d.fields.every(f=>/^[a-zA-Z][a-zA-Z0-9]*$/.test(f.name)&&
     fieldValid(f.type,"__PROBE__")!==undefined)||
   !/^[a-zA-Z]+[A-Za-z0-9]+$/.test(d.submitEvidence)||
   !/^[a-zA-Z]+[A-Za-z0-9]+$/.test(d.reviewEvidence))
   deny("DOMAIN_CATALOG_INVALID",503);
 }
 return catalog;
}
const receipt=(r,d,correlationId)=>{
 if(!object(r)||!uuid(r.bankId)||!uuid(r.aggregateId)||
   !Number.isSafeInteger(r.version)||r.version<1||
   !d.lifecycle.includes(r.state)||
   r.financialEffective!==false||r.regulatorySubmissionEnabled!==false)
   deny("UNTRUSTED_STORE_RESULT",503);
 return Object.freeze({
  bankId:r.bankId,aggregateId:r.aggregateId,domain:d.id,
  version:r.version,state:r.state,correlationId,
  financialEffective:false,regulatorySubmissionEnabled:false
 });
};
export function createStage3DomainServices({catalog,authenticate,authorize,store}={}){
 const domains=catalogSafe(catalog);
 if(typeof authenticate!=="function"||typeof authorize!=="function"||
   typeof store?.atomicCandidate!=="function"||
   typeof store?.readCandidate!=="function"||
   store.trustedBankScope!==true)
   deny("VERIFIED_IDENTITY_OR_ATOMIC_STORE_UNAVAILABLE",503);
 const result=new Map();
 for(const d of domains){
  const invoke=async({stage,body,bankId,request,idempotencyKey,correlationId})=>{
   if(!uuid(bankId)||!uuid(correlationId)||
     typeof idempotencyKey!=="string"||
     !/^[A-Za-z0-9._:-]{16,128}$/.test(idempotencyKey))
     deny("INVALID_ROUTE_OR_IDEMPOTENCY",400);
   const principal=await authenticate(request);
   if(!object(principal)||principal.verified!==true||
     !actor(principal.subjectId)||typeof principal.issuer!=="string"||
     !principal.issuer.startsWith("https://"))
     deny("AUTHENTICATION_REQUIRED",401);
   const permission=d.id.toLowerCase()+"."+d.actions[stage];
   const grant=await authorize({principal,domain:d.id,permission});
   if(!object(grant)||grant.allowed!==true||
     grant.bankId!==bankId||grant.subjectId!==principal.subjectId||
     grant.permission!==permission)
     deny("BANK_PERMISSION_DENIED",403);
   let defs,required;
   if(stage===0){
    defs=d.fields;required=["aggregateId","expectedVersion",...defs.map(x=>x.name)];
   }else if(stage===1){
    defs=[{name:d.submitEvidence,type:"uuid"}];
    required=["aggregateId","expectedVersion",d.submitEvidence];
   }else{
    defs=[{name:d.reviewEvidence,type:"uuid"},
      {name:"decision",type:"enum:ACCEPT,REJECT"}];
    required=["aggregateId","expectedVersion",d.reviewEvidence,"decision"];
   }
   assertShape(body,defs,required,stage===0?0:stage===1?1:2,stage===0?0:undefined);
   if(stage===0)assertDomainInvariants(d.id,body);
   // No authority comes from bank, actor, checker, role, or state in payload.
   const outcome=await store.atomicCandidate(Object.freeze({
    bankId,aggregateId:body.aggregateId,
    actorId:principal.subjectId,domain:d.id,stage,
    expectedVersion:body.expectedVersion,idempotencyKey,correlationId,
    commandDigest:digest({domain:d.id,stage,body}),
    fieldValues:stage===0?Object.freeze(Object.fromEntries(d.fields.map(f=>[f.name,body[f.name]]))):undefined,
    evidenceRef:stage===1?body[d.submitEvidence]:stage===2?body[d.reviewEvidence]:undefined,
    decision:stage===2?body.decision:undefined,
    eventType:[d.id+"_CANDIDATE_DRAFTED",d.id+"_CANDIDATE_SUBMITTED",d.id+"_CANDIDATE_REVIEWED"][stage]
   }));
   if(outcome?.bankId!==bankId||outcome?.aggregateId!==body.aggregateId)
    deny("STORE_SCOPE_MISMATCH",503);
   return receipt(outcome,d,correlationId);
  };
  const read=async({bankId,aggregateId,request,correlationId})=>{
   if(!uuid(bankId)||!uuid(aggregateId)||!uuid(correlationId))
    deny("INVALID_ROUTE",400);
   const principal=await authenticate(request);
   if(!principal?.verified||!actor(principal.subjectId))
    deny("AUTHENTICATION_REQUIRED",401);
   const permission=d.id.toLowerCase()+".candidate.read";
   const grant=await authorize({principal,domain:d.id,permission});
   if(!grant?.allowed||grant.bankId!==bankId||
     grant.subjectId!==principal.subjectId||grant.permission!==permission)
    deny("BANK_PERMISSION_DENIED",403);
   const result=await store.readCandidate({bankId,domain:d.id,aggregateId,
     actorId:principal.subjectId});
   if(result===null)deny("CANDIDATE_NOT_FOUND",404);
   if(result?.bankId!==bankId||result?.aggregateId!==aggregateId)
    deny("STORE_SCOPE_MISMATCH",503);
   return receipt(result,d,correlationId);
  };
  result.set(d.id,Object.freeze({
   id:d.id,actions:Object.freeze([...d.actions]),
   create:args=>invoke({...args,stage:0}),
   submit:args=>invoke({...args,stage:1}),
   review:args=>invoke({...args,stage:2}),
   read
  }));
 }
 return result;
}
/** Test-only deterministic state machine; never licensed for real bank records. */
export function createSyntheticStage3Store(){
 if(typeof process==="undefined"||process.env.NODE_ENV!=="test")
  deny("SYNTHETIC_STORE_NOT_ALLOWED_OUTSIDE_TEST",503);
 const records=new Map(),keys=new Map(),events=[];
 const key=(x)=>[x.bankId,x.domain,x.aggregateId].join(":");
 return Object.freeze({
  trustedBankScope:true,
  async atomicCandidate(c){
   const keyId=[c.bankId,c.domain,c.idempotencyKey].join(":");
   const previous=keys.get(keyId);
   if(previous){
    if(previous.digest!==c.commandDigest)
     deny("IDEMPOTENCY_PAYLOAD_CONFLICT",409);
    return {...previous.receipt};
   }
   const k=key(c),prev=records.get(k);
   let next;
   if(c.stage===0){
    if(c.expectedVersion!==0||prev)deny("CANDIDATE_EXISTS_OR_VERSION_CONFLICT",409);
    next={bankId:c.bankId,aggregateId:c.aggregateId,version:1,
      state:"DRAFT",maker:c.actorId,checker:null,
      fields:c.fieldValues,financialEffective:false,
      regulatorySubmissionEnabled:false};
   }else{
    if(!prev||prev.version!==c.expectedVersion)
     deny("CANDIDATE_MISSING_OR_VERSION_CONFLICT",409);
    if(c.stage===1){
     if(prev.state!=="DRAFT"||prev.maker!==c.actorId)
      deny("MAKER_SUBMISSION_DENIED",403);
     next={...prev,version:prev.version+1,state:"PENDING_REVIEW"};
    }else{
     if(prev.state!=="PENDING_REVIEW"||prev.maker===c.actorId)
      deny("CHECKER_SEPARATION_DENIED",403);
     next={...prev,version:prev.version+1,checker:c.actorId,
       state:c.decision==="ACCEPT"?"REVIEWED_NOT_EFFECTIVE":"REJECTED"};
    }
   }
   records.set(k,next);
   const out={bankId:c.bankId,aggregateId:c.aggregateId,version:next.version,
    state:next.state,financialEffective:false,regulatorySubmissionEnabled:false};
   keys.set(keyId,{digest:c.commandDigest,receipt:{...out}});
   events.push(Object.freeze({bankId:c.bankId,domain:c.domain,aggregateId:c.aggregateId,
    actorId:c.actorId,eventType:c.eventType,version:next.version,
    financialEffective:false,externalPublication:false}));
   return out;
  },
  async readCandidate({bankId,domain,aggregateId}){
   const r=records.get([bankId,domain,aggregateId].join(":"));
   return r?{...r}:null;
  },
  inspectedEvents:()=>events.map(e=>({...e}))
 });
}
export function createStage3HttpDispatcher({catalog,services}={}){
 const ds=catalogSafe(catalog);
 if(!(services instanceof Map)||services.size!==25)deny("SERVICE_REGISTRY_INCOMPLETE",503);
 const actionMap=new Map();
 for(const d of ds){
  d.actions.forEach((a,i)=>actionMap.set(d.id.toLowerCase()+"/"+a,{id:d.id,stage:i}));
 }
 return async function dispatch({method,url,headers={},body,request}={}){
  const correlationId=headers["x-correlation-id"];
  try{
   if(typeof url!=="string"||url.length>256||typeof method!=="string")
    deny("INVALID_HTTP_ROUTE",400);
   const parts=url.split("?")[0].split("/").filter(Boolean);
   if(parts.length<5||parts[0]!=="v1"||parts[1]!=="banks"||
      !uuid(parts[2]))deny("NOT_FOUND",404);
   const bankId=parts[2];
   const service=services.get(parts[3].toUpperCase());
   if(!service)deny("NOT_FOUND",404);
   if(method==="GET"&&parts.length===6&&parts[4]==="candidates"){
    return {status:200,body:await service.read({
     bankId,aggregateId:parts[5],request,correlationId
    })};
   }
   const match=actionMap.get(parts[3]+"/"+parts[4]);
   if(method!=="POST"||parts.length!==5||!match)deny("NOT_FOUND",404);
   if(headers["content-type"]?.split(";")[0]!=="application/json")
    deny("CONTENT_TYPE_REQUIRED",415);
   const raw=typeof body==="string"?body:JSON.stringify(body);
   if(typeof raw!=="string"||Buffer.byteLength(raw,"utf8")>32768)
    deny("PAYLOAD_TOO_LARGE",413);
   let parsed;
   try{parsed=typeof body==="string"?JSON.parse(body):body;}
   catch{deny("INVALID_JSON",400);}
   return {status:202,body:await service[["create","submit","review"][match.stage]]({
      bankId,body:parsed,request,
      idempotencyKey:headers["idempotency-key"],correlationId
     })};
  }catch(e){
   if(!(e instanceof Stage3Denied))return {status:503,body:{code:"INTERNAL_GATE_UNAVAILABLE",status:503,correlationId:uuid(correlationId)?correlationId:null}};
   return {status:e.status,body:{code:e.code,status:e.status,correlationId:uuid(correlationId)?correlationId:null}};
  }
 };
}
