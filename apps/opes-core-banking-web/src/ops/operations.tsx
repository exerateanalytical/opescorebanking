import {useEffect,useRef,useState} from "react";
import {Landmark,Waypoints,ClipboardCheck,Server,ShieldCheck,GitMerge,
  ArrowLeft,Plus,RefreshCw,LockKeyhole,CheckCircle2,FileClock,Archive} from "lucide-react";
import definitions from "./contracts.json";
import {configuration,completeLogin,startLogin} from "./auth";
import type {Config,LoginToken} from "./auth";
import {apiClient,ApiIssue} from "./client";
import type {OpsCase,RecordState,HistoryItem,Receipt} from "./client";
import "./ops.css";
import {EvidencePanel} from "./evidence-panel";

type Field={name:string;type:string};
type Module={id:string;label:string;businessReferenceField:string;
 revisionField:string;fields:Field[]};
const modules=definitions.modules as Module[];
const icons={GOV:Landmark,ARC:Waypoints,TST:ClipboardCheck,
             INF:Server,DR:ShieldCheck,REL:GitMerge};
const colorClasses={GOV:"governance",ARC:"architecture",TST:"testing",
 INF:"infrastructure",DR:"recovery",REL:"release"};
const choice:Record<string,readonly string[]>={
 category:["OPERATIONS","RISK","COMPLIANCE","SECURITY","FINANCE"],
 compatibility:["BACKWARD","FULL","NONE"],
 environment:["STAGING","PREPROD","PRODUCTION"],
 targetEnvironment:["STAGING","PREPROD","PRODUCTION"],
 observedStatus:["HEALTHY","DEGRADED","DOWN"]
};
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const human=(field:string)=>field.replace(/([a-z])([A-Z])/g,"$1 $2")
  .replace(/Sha$/,"SHA-256").replace(/Rpo/g,"RPO").replace(/Rto/g,"RTO")
  .replace(/\b\w/g,x=>x.toUpperCase());
function initFromPath(){
 const p=window.location.pathname.split("/").filter(Boolean);
 const item=p[0]==="operations"?p[1]?.toUpperCase():undefined;
 return modules.find(m=>m.id===item)?.id??null;
}
function ModuleBadge({state}:{state:RecordState}){
 return <span className={"ops-state ops-state-"+state.toLowerCase()}>{state.replaceAll("_"," ")}</span>;
}
function InputFields({module,draft,onChange,disabled}:{
 module:Module;draft:Record<string,string>;onChange:(id:string,value:string)=>void;disabled:boolean}){
 return <div className="ops-form-grid">
  {module.fields.map(field=>{
   const options=choice[field.name];
   const t=field.type==="integer"?"number":field.type==="date"?"date":
      field.type==="timestamptz"?"datetime-local":"text";
   return <div className="ops-field" key={field.name}>
    <label htmlFor={"op-"+field.name}>{human(field.name)} <span aria-label="required">*</span></label>
    {options?<select id={"op-"+field.name} disabled={disabled} value={draft[field.name]??""}
      onChange={e=>onChange(field.name,e.target.value)}>
      <option value="">Select...</option>{options.map(x=><option key={x}>{x}</option>)}
    </select>:<input id={"op-"+field.name} type={t} disabled={disabled}
      min={field.type==="integer"?0:undefined} step={field.type==="integer"?1:undefined}
      maxLength={field.type==="text"?4000:undefined}
      placeholder={field.name.endsWith("Sha")?"64-character SHA-256 hex digest":
       field.type==="uuid"?"UUID issued by trusted service":undefined}
      value={draft[field.name]??""}
      onChange={e=>onChange(field.name,e.target.value)}/>}
    <small>{field.type==="uuid"?"Use an existing verified record reference":
     field.name.endsWith("Sha")?"Content hash, not a fabricated evidence reference":
     field.type==="timestamptz"?"Local time converted to UTC":field.name}</small>
   </div>;
  })}
 </div>;
}
function normalize(module:Module,form:Record<string,string>):Record<string,unknown>{
 const output:Record<string,unknown>={};
 for(const f of module.fields){
  const raw=(form[f.name]??"").trim();
  if(!raw)throw new Error(human(f.name)+" is required");
  if(f.type==="integer"){
   if(!/^(0|[1-9][0-9]*)$/.test(raw)||Number(raw)>10000000)
    throw new Error(human(f.name)+" must be an exact nonnegative integer");
   output[f.name]=Number(raw);
  }else if(f.type==="uuid"){
   if(!uuid.test(raw))throw new Error("Invalid UUID: "+human(f.name));
   output[f.name]=raw;
  }else if(f.type==="timestamptz"){
   const date=new Date(raw);
   if(Number.isNaN(date.getTime()))throw new Error("Invalid timestamp: "+human(f.name));
   output[f.name]=date.toISOString();
  }else{
   if(f.name.endsWith("Sha")&&!/^[0-9a-f]{64}$/.test(raw))
    throw new Error(human(f.name)+" must be a SHA-256 digest");
   output[f.name]=raw;
  }
 }
 if(module.id==="GOV"&&String(output.reviewDate)<String(output.effectiveDate))
  throw new Error("Policy review date must be on or after the effective date");
 if(module.id==="TST"&&Number(output.passedCount)+Number(output.failedCount)===0)
  throw new Error("A test execution needs assertions and evidence");
 return output;
}
type RetryOperation={run:()=>Promise<void>;label:string};
export function OpsWorkspace(){
 const [config,setConfig]=useState<Config|null>(null);
 const [session,setSession]=useState<LoginToken|null>(null);
 const [active,setActive]=useState<string|null>(initFromPath);
 const [error,setError]=useState("");
 const [note,setNote]=useState("");
 const [list,setList]=useState<OpsCase[]>([]);
 const [selected,setSelected]=useState<OpsCase|null>(null);
 const [history,setHistory]=useState<HistoryItem[]>([]);
 const [draft,setDraft]=useState<Record<string,string>>({});
 const [formVisible,setFormVisible]=useState(false);
 const [evidence,setEvidence]=useState("");
 const [decision,setDecision]=useState<"APPROVE"|"REJECT">("APPROVE");
 const [busy,setBusy]=useState(false);
 const retry=useRef<RetryOperation|null>(null);
 const [retryLabel,setRetryLabel]=useState("");

 useEffect(()=>{
  try{
   const config=configuration();
   setConfig(config);
   if(config&&location.pathname==="/auth/callback"){
    void completeLogin(config).then(token=>{
      setSession(token);setActive(null);setError("");setNote("Signed in; banking permissions are validated by the server");
    }).catch(ex=>setError(String(ex instanceof Error?ex.message:"Sign-in rejected")));
   }
  }catch(ex){setError(ex instanceof Error?ex.message:"Invalid identity settings")}
  const update=()=>setActive(initFromPath());
  window.addEventListener("popstate",update);
  return ()=>window.removeEventListener("popstate",update);
 },[]);

 const go=(id:string|null)=>{
  setActive(id);setSelected(null);setHistory([]);setFormVisible(false);
  setDraft({});setEvidence("");setError("");setNote("");setList([]);
  window.history.pushState(null,"",id?"/operations/"+id.toLowerCase():"/operations");
 };
 const signedIn=!!(config&&session&&session.expiresAt>Date.now()+5000);
 const client=config&&session?apiClient(config,session):null;
 async function refresh(domain:string){
  if(!client)return;
  try{setBusy(true);setError("");
   const rows=await client.list(domain);setList(rows);
  }catch(ex){report(ex)}
  finally{setBusy(false)}
 }
 async function open(domain:string,id:string){
  if(!client)return;
  try{setBusy(true);setError("");
   const [item,audit]=await Promise.all([client.get(domain,id),client.history(domain,id)]);
   setSelected(item);setHistory(audit);setFormVisible(false);setEvidence("");
  }catch(ex){report(ex)}finally{setBusy(false)}
 }
 function report(ex:unknown){
  if(ex instanceof ApiIssue&&ex.status===401)setSession(null);
  setError(ex instanceof Error?ex.message:"A controlled workflow failed");
 }
 useEffect(()=>{if(active&&signedIn)void refresh(active);},[active,session,config]);
 async function executeCreate(module:Module,id:string,body:Record<string,unknown>,key:string){
  if(!client)return;
  try{setBusy(true);setError("");setNote("");
   const r=await client.create(module.id,id,body,key);
   retry.current=null;setRetryLabel("");setNote("Committed "+r.state+" record "+r.itemId);
   setDraft({});setFormVisible(false);await refresh(module.id);await open(module.id,id);
  }catch(ex){report(ex)}finally{setBusy(false)}
 }
 function submitDraft(module:Module){
  try{
   const fields=normalize(module,draft);
   const id=crypto.randomUUID(),key=crypto.randomUUID()+"-OPS-CREATE";
   retry.current={label:"Retry exact CREATE request",
     run:()=>executeCreate(module,id,fields,key)};
   setRetryLabel(retry.current.label);
   void retry.current.run();
  }catch(ex){report(ex)}
 }
 async function executeTransition(domain:string,id:string,op:"submit"|"decision"|"retire",
     expectedVersion:number,evidenceId:string,value:string|null,key:string){
  if(!client)return;
  try{setBusy(true);setError("");setNote("");
   const r=await client.transition(domain,id,op,expectedVersion,evidenceId,value,key);
   retry.current=null;setRetryLabel("");setNote("Committed "+r.state+" at version "+r.version);
   setEvidence("");await refresh(domain);await open(domain,id);
  }catch(ex){report(ex)}finally{setBusy(false)}
 }
 function transition(domain:string,op:"submit"|"decision"|"retire"){
  if(!selected)return;
  if(!uuid.test(evidence)){setError("A valid independently issued evidence UUID is required");return;}
  const key=crypto.randomUUID()+"-OPS-"+op.toUpperCase();
  const id=selected.item_id,version=selected.version,ev=evidence;
  const value=op==="decision"?decision:null;
  retry.current={label:"Retry exact "+op+" request",
    run:()=>executeTransition(domain,id,op,version,ev,value,key)};
  setRetryLabel(retry.current.label);
  void retry.current.run();
 }
 async function login(){
  if(!config)return;
  try{setError("");await startLogin(config);}catch(ex){report(ex)}
 }
 const module=modules.find(x=>x.id===active);
 return <main className="wrap ops-shell">
   <p className="eyebrow">Institution-scoped operations · Java 25 backed</p>
   <div className="ops-heading">
    <div><h1>Operational control modules</h1>
     <p>Governance, contracts, testing, infrastructure evidence, disaster recovery exercises and release approvals.
      Records are durable; none triggers financial postings or physical deployments.</p></div>
    {signedIn?<button className="ops-neutral" type="button" onClick={()=>{
      setSession(null);setSelected(null);setList([]);setNote("Local access token cleared; reauthentication required");
    }}>Clear local session</button>:null}
   </div>
   {error?<div className="ops-alert" role="alert">{error}</div>:null}
   {note?<div className="ops-notice" role="status">{note}</div>:null}
   {!config?<section className="ops-gate"><LockKeyhole size={28}/>
     <h2>Identity provider not configured</h2>
     <p>Set the institution UUID, OIDC issuer, public PKCE client, authorization and token endpoints,
        and same-origin API routing. There are no test accounts or fallback credentials.</p>
    </section>:!signedIn?<section className="ops-gate"><LockKeyhole size={28}/>
     <h2>Institution authentication required</h2><p>Sign in using your bank-approved identity provider.
       Permissions are rechecked inside the bank database for every operation.</p>
     <button className="ops-primary" onClick={()=>void login()} type="button">Sign in with institution SSO</button>
    </section>:
    !module?<section>
     <div className="ops-module-grid">{modules.map(m=>{
      const Icon=icons[m.id as keyof typeof icons];
      return <button key={m.id} className={"ops-module "+colorClasses[m.id as keyof typeof colorClasses]}
        type="button" onClick={()=>go(m.id)}>
        <span className="ops-icon"><Icon size={20} strokeWidth={1.8}/></span>
        <span className="ops-module-title">{m.label}</span>
        <span className="ops-module-sub">{m.id} · Persistent records and approvals</span>
        <span className="ops-module-arrow">Open module</span>
       </button>;
     })}</div>
    </section>:
    <section>
      <button type="button" className="ops-back" onClick={()=>go(null)}>
       <ArrowLeft size={15}/> All operational modules</button>
      <div className="ops-module-header">
       <div><p className="eyebrow">{module.id} · Operational records</p>
        <h2>{module.label}</h2></div>
       <div className="ops-actions">
        <button type="button" className="ops-neutral" disabled={busy}
          onClick={()=>void refresh(module.id)}><RefreshCw size={16}/> Refresh</button>
        <button type="button" className="ops-primary" disabled={busy}
          onClick={()=>{setFormVisible(v=>!v);setSelected(null);setEvidence("");setError("")}}>
           <Plus size={16}/> New record</button>
       </div>
      </div>
      <EvidencePanel domain={module.id} client={client!}
       onVerified={id=>{setEvidence(id);setNote("Verified evidence selected: "+id)}}/>
      {formVisible&&<section className="ops-panel">
       <h3>Create {module.label.toLowerCase()} record</h3>
       <p>All fields are persisted with a bank-scoped version. Content hashes must reference actual evidence.</p>
       <form onSubmit={e=>{e.preventDefault();submitDraft(module)}}>
        <InputFields module={module} draft={draft} disabled={busy}
         onChange={(name,value)=>setDraft(v=>({...v,[name]:value}))}/>
        <div className="ops-actions">
         <button type="submit" disabled={busy} className="ops-primary">Create draft</button>
         <button type="button" disabled={busy} className="ops-neutral"
            onClick={()=>{setFormVisible(false);setDraft({})}}>Cancel</button>
        </div>
       </form>
      </section>}
      {!formVisible&&selected?<section className="ops-panel">
        <div className="ops-detail-head">
         <div><p className="eyebrow">{selected.business_ref} · Revision {selected.business_revision}</p>
          <h3>Record {selected.item_id}</h3></div>
         <ModuleBadge state={selected.state}/>
        </div>
        <div className="ops-readonly">{Object.entries(selected.payload).map(([key,value])=>
         <div key={key}><span>{human(key)}</span><strong>{String(value)}</strong></div>)}</div>
        <div className="ops-metadata">Version {selected.version} · Maker {selected.maker_subject}
        {selected.checker_subject?" · Checker "+selected.checker_subject:""}</div>
        <div className="ops-decision">
         <h4>Controlled transitions</h4>
         <p>Each approval or retirement requires a separately issued evidence UUID.
            Approval and retirement require independent bank permissions.</p>
         <label htmlFor="ops-evidence">Evidence UUID</label>
         <input id="ops-evidence" value={evidence}
          onChange={e=>setEvidence(e.target.value)} placeholder="Existing evidence UUID"/>
         {selected.state==="PENDING_APPROVAL"&&
          <div className="ops-choice"><label htmlFor="ops-decision">Checker decision</label>
           <select id="ops-decision" value={decision}
             onChange={e=>setDecision(e.target.value as "APPROVE"|"REJECT")}>
             <option value="APPROVE">Approve evidence record</option>
             <option value="REJECT">Reject record</option></select></div>}
         <div className="ops-actions">
          {selected.state==="DRAFT"&&<button type="button" disabled={busy}
             className="ops-primary" onClick={()=>transition(module.id,"submit")}>
             <CheckCircle2 size={16}/> Submit for review</button>}
          {selected.state==="PENDING_APPROVAL"&&<button type="button"
             disabled={busy} className="ops-primary" onClick={()=>transition(module.id,"decision")}>
             <CheckCircle2 size={16}/> Record independent decision</button>}
          {selected.state==="APPROVED_RECORD"&&<button type="button"
             disabled={busy} className="ops-neutral" onClick={()=>transition(module.id,"retire")}>
             <Archive size={16}/> Retire record</button>}
          <button type="button" className="ops-neutral" disabled={busy}
             onClick={()=>{setSelected(null);setHistory([])}}>Return to records</button>
         </div>
        </div>
        <div className="ops-history"><h4><FileClock size={16}/> Immutable action history</h4>
         <ol>{history.map((h,i)=><li key={h.version+"-"+i}>
          <strong>{h.event_type}</strong> by {h.actor_subject} · Version {h.version}
          <small>{h.occurred_at}</small></li>)}</ol>
        </div>
       </section>:null}
      {retry.current&&retryLabel?<div className="ops-retry" role="alert">
        If the server acknowledgment was lost, retry the original command with the same key.
        Do not create a replacement command ID.
        <button type="button" disabled={busy} onClick={()=>void retry.current?.run()}>
          {retryLabel}</button></div>:null}
      <div className="ops-panel">
       <h3>Bank-owned records <span className="ops-count">{list.length}</span></h3>
       {busy?<p role="status">Checking authoritative bank records…</p>:
        list.length===0?<p>No approved or draft records returned for this institution.
         Create a real record above after permission and evidence provisioning.</p>:
        <div className="ops-table-scroll"><table className="ops-table">
         <thead><tr><th>Reference</th><th>Revision</th><th>Status</th><th>Version</th><th>Updated</th><th>Open</th></tr></thead>
         <tbody>{list.map(item=><tr key={item.item_id}>
          <td>{item.business_ref}</td><td>{item.business_revision}</td>
          <td><ModuleBadge state={item.state}/></td><td>{item.version}</td>
          <td>{new Date(item.updated_at).toLocaleString()}</td>
          <td><button className="ops-open" type="button" disabled={busy}
             onClick={()=>void open(module.id,item.item_id)}>View</button></td></tr>)}</tbody>
        </table></div>}
      </div>
    </section>}
 </main>;
}
