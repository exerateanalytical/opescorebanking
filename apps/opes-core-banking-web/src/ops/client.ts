import type {Config,LoginToken} from "./auth";
export type RecordState="DRAFT"|"PENDING_APPROVAL"|"APPROVED_RECORD"|"REJECTED"|"RETIRED";
export interface OpsCase{
 item_id:string;domain:string;business_ref:string;business_revision:number;
 version:number;state:RecordState;payload:Record<string,unknown>;
 maker_subject:string;checker_subject:string|null;created_at:string;updated_at:string;
}
export interface Receipt{
 bankId:string;domain:string;itemId:string;version:number;state:RecordState;
 operation:string;actualReleaseDeployed:false;externalOperationsTriggered:false;
}
export interface HistoryItem{
 version:number;event_type:string;actor_subject:string;
 evidence:string|null;occurred_at:string;
}
export class ApiIssue extends Error{
 constructor(public status:number,public code:string){
  super(status===403?"Institution permissions denied":status===401?"Sign-in expired":
   status>=500?"Server outcome unavailable — use the same idempotency key for retry":code);
 }
}
export function apiClient(config:Config,session:LoginToken){
 const base=config.apiBase+"/v1/banks/"+config.bankId+"/operations/";
 const request=async <T>(path:string,method:"GET"|"POST",body?:unknown,key?:string):Promise<T>=>{
  if(Date.now()+5000>=session.expiresAt)throw new ApiIssue(401,"TOKEN_EXPIRED");
  const response=await fetch(base+path,{
   method,mode:"cors",cache:"no-store",credentials:"omit",
   headers:{"Authorization":"Bearer "+session.accessToken,
    "Accept":"application/json",...(body!==undefined?{"Content-Type":"application/json"}:{}),
    ...(key?{"Idempotency-Key":key}:{})},
   ...(body!==undefined?{body:JSON.stringify(body)}:{})
  });
  if(!response.ok){
   let code="REQUEST_FAILED";
   try{code=(await response.json() as {code?:string}).code||code}catch{/* avoid reflecting raw server content */}
   throw new ApiIssue(response.status,code);
  }
  return await response.json() as T;
 };
 return {
  list:(domain:string,state?:RecordState)=>request<OpsCase[]>(
   domain.toLowerCase()+"/items?limit=100&offset=0"+(state?"&state="+encodeURIComponent(state):""),"GET"),
  get:(domain:string,id:string)=>request<OpsCase>(domain.toLowerCase()+"/items/"+encodeURIComponent(id),"GET"),
  history:(domain:string,id:string)=>request<HistoryItem[]>(
   domain.toLowerCase()+"/items/"+encodeURIComponent(id)+"/history?limit=100&offset=0","GET"),
  create:(domain:string,id:string,fields:Record<string,unknown>,key:string)=>request<Receipt>(
   domain.toLowerCase()+"/items","POST",{itemId:id,fields},key),
  transition:(domain:string,id:string,transition:"submit"|"decision"|"retire",
    version:number,evidenceId:string,decision:string|null,key:string)=>request<Receipt>(
     domain.toLowerCase()+"/items/"+encodeURIComponent(id)+"/"+transition,
     "POST",{expectedVersion:version,evidenceId,decision},key)
 };
}
