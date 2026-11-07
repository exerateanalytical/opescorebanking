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

 const evidenceRequest=async <T>(endpoint:string,method:"POST"|"GET",
   data?:FormData|Record<string,string>,evidenceId?:string):Promise<T>=>{
   if(Date.now()+5000>=session.expiresAt)throw new ApiIssue(401,"TOKEN_EXPIRED");
   const body=data instanceof FormData?data:data!==undefined?JSON.stringify(data):undefined;
   const response=await fetch(base+endpoint,{
     method,cache:"no-store",credentials:"omit",mode:"cors",
     headers:{"Authorization":"Bearer "+session.accessToken,
       "Accept":"application/json",...(body instanceof FormData?{}:
         body!==undefined?{"Content-Type":"application/json"}:{}),
       ...(evidenceId?{"Evidence-ID":evidenceId}:{})},
     ...(body!==undefined?{body}:{})
   });
   if(!response.ok){
     let code="EVIDENCE_OPERATION_FAILED";
     try{code=(await response.json() as {code?:string}).code||code}catch{}
     throw new ApiIssue(response.status,code);
   }
   return await response.json() as T;
 };
 const downloadEvidence=async (domain:string,id:string):Promise<void>=>{
   if(Date.now()+5000>=session.expiresAt)throw new ApiIssue(401,"TOKEN_EXPIRED");
   const response=await fetch(base+domain.toLowerCase()+"/evidence/"+
      encodeURIComponent(id)+"/download",{
       headers:{"Authorization":"Bearer "+session.accessToken},
       cache:"no-store",credentials:"omit"});
   if(!response.ok)throw new ApiIssue(response.status,"EVIDENCE_DOWNLOAD_DENIED");
   const blob=await response.blob();
   if(blob.size>1048576)throw new ApiIssue(503,"EVIDENCE_SIZE_INTEGRITY");
   const disposition=response.headers.get("Content-Disposition")||"";
   const name=disposition.match(/filename="([A-Za-z0-9._-]{3,140})"/)?.[1]||"opes-evidence.bin";
   const href=URL.createObjectURL(blob);
   try{
     const link=document.createElement("a");link.href=href;link.download=name;
     document.body.appendChild(link);link.click();link.remove();
   }finally{setTimeout(()=>URL.revokeObjectURL(href),1000);}
 };
 return {
  list:(domain:string,state?:RecordState)=>request<OpsCase[]>(
   domain.toLowerCase()+"/items?limit=100&offset=0"+(state?"&state="+encodeURIComponent(state):""),"GET"),
  get:(domain:string,id:string)=>request<OpsCase>(domain.toLowerCase()+"/items/"+encodeURIComponent(id),"GET"),
  history:(domain:string,id:string)=>request<HistoryItem[]>(
   domain.toLowerCase()+"/items/"+encodeURIComponent(id)+"/history?limit=100&offset=0","GET"),
  uploadEvidence:(domain:string,id:string,file:File)=>{
   const data=new FormData();data.append("file",file,file.name);
   return evidenceRequest<{evidenceId:string;status:string;sha256:string;bytes:number}>(
     domain.toLowerCase()+"/evidence","POST",data,id);
  },
  evidence:(domain:string,id:string)=>evidenceRequest<{
   evidenceId:string;fileName:string;status:string;sha256:string;bytes:number
  }>(domain.toLowerCase()+"/evidence/"+encodeURIComponent(id),"GET"),
  reviewEvidence:(domain:string,id:string,decision:"APPROVE"|"REJECT")=>
   evidenceRequest<{evidenceId:string;status:string;sha256:string}>(
     domain.toLowerCase()+"/evidence/"+encodeURIComponent(id)+"/review","POST",{decision}),
  downloadEvidence,
  create:(domain:string,id:string,fields:Record<string,unknown>,key:string)=>request<Receipt>(
   domain.toLowerCase()+"/items","POST",{itemId:id,fields},key),
  transition:(domain:string,id:string,transition:"submit"|"decision"|"retire",
    version:number,evidenceId:string,decision:string|null,key:string)=>request<Receipt>(
     domain.toLowerCase()+"/items/"+encodeURIComponent(id)+"/"+transition,
     "POST",{expectedVersion:version,evidenceId,decision},key)
 };
}
