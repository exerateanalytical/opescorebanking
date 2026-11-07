import {useRef,useState} from "react";
import {FileUp,Search,Download,ShieldCheck,XCircle,CheckCircle2} from "lucide-react";
import type {apiClient} from "./client";

type Client=ReturnType<typeof apiClient>;
type Details={evidenceId:string;fileName:string;status:string;sha256:string;bytes:number};
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const MIME=new Set(["application/pdf","application/json","text/plain","image/png","image/jpeg"]);

export function EvidencePanel({domain,client,onVerified}:{
 domain:string;client:Client;onVerified:(id:string)=>void}){
 const [file,setFile]=useState<File|null>(null);
 const [evidenceId,setEvidenceId]=useState("");
 const [details,setDetails]=useState<Details|null>(null);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [notice,setNotice]=useState("");
 const pending=useRef<{id:string;file:File}|null>(null);
 const send=async (id:string,artifact:File)=>{
  try{setBusy(true);setError("");setNotice("");
   const receipt=await client.uploadEvidence(domain,id,artifact);
   pending.current=null;setFile(null);
   setEvidenceId(receipt.evidenceId);
   setDetails({evidenceId:receipt.evidenceId,
     fileName:artifact.name,status:receipt.status,sha256:receipt.sha256,bytes:receipt.bytes});
   setNotice("Evidence committed; independent verification required");
  }catch(ex){
   setError(ex instanceof Error?ex.message:"Evidence upload failed");
  }finally{setBusy(false)}
 };
 function upload(){
  if(!file){setError("Select a real evidence file");return;}
  if(file.size<1||file.size>1048576||!MIME.has(file.type)||
    !/^[A-Za-z0-9._-]{3,140}$/.test(file.name)){
   setError("Allowed: PDF, JSON, text, PNG or JPEG, 1 MiB maximum; safe filename required");
   return;
  }
  const key=crypto.randomUUID();
  pending.current={id:key,file};
  setEvidenceId(key);
  void send(key,file);
 }
 async function lookup(){
  if(!UUID.test(evidenceId)){setError("Enter a valid registered evidence UUID");return;}
  try{setBusy(true);setError("");setNotice("");
   const result=await client.evidence(domain,evidenceId);
   setDetails(result);
   if(result.status==="VERIFIED")onVerified(result.evidenceId);
  }catch(ex){setError(ex instanceof Error?ex.message:"Evidence not found")}
  finally{setBusy(false)}
 }
 async function verify(decision:"APPROVE"|"REJECT"){
  if(!UUID.test(evidenceId)){setError("Select a registered evidence UUID");return;}
  try{setBusy(true);setError("");setNotice("");
   const result=await client.reviewEvidence(domain,evidenceId,decision);
   const record=await client.evidence(domain,evidenceId);
   setDetails(record);
   if(result.status==="VERIFIED"){
    onVerified(evidenceId);setNotice("Independent evidence verification committed");
   }else{setNotice("Evidence rejected and cannot authorize transactions")}
  }catch(ex){setError(ex instanceof Error?ex.message:"Evidence review denied")}
  finally{setBusy(false)}
 }
 async function download(){
  if(!UUID.test(evidenceId))return;
  try{setBusy(true);setError("");await client.downloadEvidence(domain,evidenceId);}
  catch(ex){setError(ex instanceof Error?ex.message:"Evidence download denied")}
  finally{setBusy(false)}
 }
 return <section className="ops-panel ops-evidence">
  <div className="ops-detail-head"><div><h3>Independent control evidence</h3>
    <p>Upload a genuine artefact, validate its SHA-256 digest and obtain a separate
     checker decision. Unverified evidence cannot authorize any of this module's transitions.</p>
   </div><ShieldCheck size={23} color="#607990"/></div>
  {error&&<div className="ops-alert" role="alert">{error}</div>}
  {notice&&<div className="ops-notice" role="status">{notice}</div>}
  <div className="ops-evidence-grid">
   <div className="ops-evidence-section">
    <h4>1 · Register original evidence</h4>
    <label htmlFor="ops-evidence-file">File to store securely</label>
    <input id="ops-evidence-file" type="file" disabled={busy}
      accept=".pdf,.json,.txt,.png,.jpg,.jpeg"
      onChange={e=>{setFile(e.target.files?.[0]??null);pending.current=null}}/>
    <small>Maximum 1 MiB. The server computes SHA-256 and stores immutable bytes.</small>
    <div className="ops-actions">
     <button className="ops-primary" type="button" disabled={busy||!file} onClick={upload}>
      <FileUp size={15}/> Upload evidence</button>
     {pending.current&&<button className="ops-neutral" type="button" disabled={busy}
       onClick={()=>void send(pending.current!.id,pending.current!.file)}>
       Retry same Evidence-ID</button>}
    </div>
   </div>
   <div className="ops-evidence-section">
    <h4>2 · Locate and independently review</h4>
    <label htmlFor="ops-evidence-search">Evidence UUID</label>
    <input id="ops-evidence-search" value={evidenceId}
     onChange={e=>{setEvidenceId(e.target.value);setDetails(null)}}
     placeholder="UUID from evidence registration" disabled={busy}/>
    <div className="ops-actions">
     <button className="ops-neutral" type="button" disabled={busy} onClick={()=>void lookup()}>
      <Search size={15}/> Check status</button>
     {details&&<button className="ops-neutral" type="button" disabled={busy} onClick={()=>void download()}>
      <Download size={15}/> Download original</button>}
    </div>
    {details?<div className="ops-evidence-details">
      <strong>{details.fileName}</strong>
      <span>{details.status} · {details.bytes} bytes</span>
      <code>{details.sha256}</code>
      {details.status==="PENDING_REVIEW"?<div className="ops-actions">
       <button className="ops-primary" type="button" disabled={busy} onClick={()=>void verify("APPROVE")}>
        <CheckCircle2 size={15}/> Verify as independent checker</button>
       <button className="ops-neutral" type="button" disabled={busy} onClick={()=>void verify("REJECT")}>
        <XCircle size={15}/> Reject</button>
      </div>:null}
      {details.status==="VERIFIED"?<button className="ops-neutral" type="button"
       onClick={()=>onVerified(details.evidenceId)}>
       Use verified reference in selected record</button>:null}
    </div>:null}
   </div>
  </div>
  <p className="ops-footnote">Verification records the authorized reviewer's decision.
   Deployment policy must require independent malware scanning and institutional
   evidence-provenance acceptance before real-bank deployment.</p>
 </section>;
}
