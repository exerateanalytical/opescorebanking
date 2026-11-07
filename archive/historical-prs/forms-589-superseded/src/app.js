import {FORMS,FORM_BY_ID,FORM_COUNTS,FORM_DELIVERY,FORM_STATES} from "./forms.js";
import {FORM_GROUP_SEEDS} from "./registry-seeds.js";
import {isVisible,validateForm,syntheticExample,permittedLocalActions} from "./validation.js";

/**
 * No network calls, browser storage, trusted bank data, real signatures or banking transactions.
 * Sensitive/real banking information must NEVER be entered. Drafts exist in RAM only.
 */
const root=document.querySelector("#app");
const escape=s=>String(s===undefined||s===null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const paths={
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 check:'<path d="m4 12 5 5L20 6"/>',
 file:'<path d="M6 2h9l5 5v15H6Z"/><path d="M15 2v6h5M9 12h7M9 16h7"/>',
 shield:'<path d="M12 2 4 5v6c0 5 3 8 8 11 5-3 8-6 8-11V5Z"/><path d="m9 12 2 2 4-4"/>',
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
 clipboard:'<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 2h6v4H9zM8 12h8M8 16h6"/>',
 download:'<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',
 refresh:'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6 9a7 7 0 0 1 12-2M18 15a7 7 0 0 1-12 2"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 trash:'<path d="M4 7h16M8 7V4h8v3M6 7l1 14h10l1-14M10 11v6m4-6v6"/>',
 lock:'<rect x="4" y="10" width="16" height="12" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
 users:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-3a6 6 0 0 1 12 0v3M17 6c2 1 2 4 0 5M17 15c3 0 4 3 4 5"/>',
 coins:'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 9h5a2 2 0 0 1 0 4h-4a2 2 0 0 0 0 4h5"/>',
 arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
 warning:'<path d="m12 2 10 19H2L12 2ZM12 9v5m0 4v.01"/>',
 eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M19 5l-2 2M7 17l-2 2"/>',
 moon:'<path d="M20 15A8 8 0 0 1 9 4a8 8 0 1 0 11 11Z"/>'
};
const icon=(key,size=17)=>'<svg class="icon" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" aria-hidden="true">'+(paths[key]||paths.file)+'</svg>';
const formState={id:FORMS[0].id,code:"ALL",query:"",tab:"fields",role:"operator",uiState:"idle",menu:false,theme:"light",listLimit:100};
const working=new Map();
const localSaved=new Map();
const activity=[];
const validationById=new Map();
function current(){return FORM_BY_ID.get(formState.id)||FORMS[0];}
function blankDraft(form){return {values:{},repeated:Object.fromEntries(form.repeaters.map(r=>[r.id,Array.from({length:r.minRows},()=>({}))]))};}
function draft(form=current()){if(!working.has(form.id))working.set(form.id,blankDraft(form));return working.get(form.id);}
function savedCount(){return [...localSaved.values()].reduce((n,items)=>n+items.length,0);}
function audit(message){activity.unshift({when:new Date().toISOString(),event:message,source:"LOCAL_BROWSER_ONLY"});if(activity.length>50)activity.length=50;}
function flash(message){const el=document.querySelector("#toast");if(!el)return;el.textContent=message;el.hidden=false;}
function filters(){return FORMS.filter(f=>(formState.code==="ALL"||f.code===formState.code)&&(!formState.query||[f.id,f.name,f.group,f.subject].join(" ").toLowerCase().includes(formState.query.toLowerCase().trim())));}
function routeTo(id){
 if(!FORM_BY_ID.has(id))return;
 formState.id=id;formState.code="ALL";formState.tab="fields";formState.uiState="idle";formState.menu=false;
 formState.query="";formState.listLimit=100;
 location.hash="#/form/"+id;
 render();
}
function selectedOptions(field,value){
 return '<option value="">Select…</option>'+field.options.map(o=>'<option value="'+escape(o)+'"'+(String(value||"")===o?" selected":"")+'>'+escape(o)+'</option>').join("");
}
function renderField(field,value,editable,idPrefix="",repeatMeta=""){
 const form=current();
 const d=draft();
 const visible=repeatMeta?true:isVisible(field,d.values);
 const id=idPrefix+field.id;
 const label='<label for="'+escape(id)+'">'+escape(field.label)+(field.required?'<span class="req"> *</span>':"")+'</label>';
 const inputAttr=' id="'+escape(id)+'" name="'+escape(field.id)+'"'+repeatMeta+' data-field-id="'+escape(field.id)+'"'+(editable&&visible?"":' disabled')+(field.required&&visible?' required':"");
 let input="";
 if(field.type==="select")input='<select class="select"'+inputAttr+'>'+selectedOptions(field,value)+'</select>';
 else if(field.type==="textarea")input='<textarea class="input" maxlength="'+(field.maxLength||1200)+'" rows="3"'+inputAttr+'>'+escape(value||"")+'</textarea>';
 else input='<input class="input"'+inputAttr+' type="'+escape(field.type)+'" value="'+escape(value||"")+'"'+(field.type==="number"?' step="1" inputmode="numeric"'+(field.min!==undefined?' min="'+field.min+'"':'')+(field.max!==undefined?' max="'+field.max+'"':''):' maxlength="180"')+'>';
 const errs=validationById.get(form.id)?.issues?.filter(x=>x.key===(repeatMeta?repeatMeta.match(/data-repeater="([^"]+)"/)?.[1]||"":"")+field.id)||[];
 return '<div class="field'+(field.type==="textarea"?" full":"")+'" data-field-wrap="'+escape(field.id)+'"'+(visible?"":' hidden')+'>'+label+input+(field.hint?'<small>'+escape(field.hint)+'</small>':"")+(errs.length?'<div class="field-error">'+escape(errs[0].message)+'</div>':"")+'</div>';
}
function renderGroups(form,editable){
 const d=draft(form),groups=form.sections;
 return groups.map(group=>{
  const fields=form.fields.filter(f=>f.section===group);
  if(!fields.length)return"";
  return '<fieldset class="fieldset" data-field-group="'+escape(group)+'" '+(fields.some(f=>isVisible(f,d.values))?"":'hidden')+'><legend>'+escape(group)+'</legend><div class="field-grid">'+fields.map(f=>renderField(f,d.values[f.id],editable,"main-")).join("")+'</div></fieldset>';
 }).join("");
}
function renderRepeater(form,editable){
 const d=draft(form);
 return form.repeaters.map(config=>{
  const rows=d.repeated[config.id]||[];
  return '<section class="repeater" aria-label="'+escape(config.label)+'"><header><div><h3>'+escape(config.label)+'</h3><p class="field-hint">'+escape(config.note)+'</p></div><span class="badge">'+rows.length+' / '+config.maxRows+' rows</span></header>'+
  rows.map((row,i)=>'<div class="repeat-row" data-row-container="'+escape(config.id)+'" data-index="'+i+'"><div class="repeat-row-head"><strong>Line '+(i+1)+'</strong><button class="btn tiny" type="button" data-action="remove-row" data-repeater="'+escape(config.id)+'" data-index="'+i+'"'+(!editable||rows.length<=config.minRows?' disabled':'')+'>'+icon("trash")+' Remove</button></div><div class="field-grid">'+config.fields.map(f=>renderField(f,row[f.id],editable,'r-'+config.id+'-'+i+'-',' data-repeater="'+escape(config.id)+'" data-index="'+i+'"')).join("")+'</div></div>').join("")+
  '<button class="btn tiny" type="button" data-action="add-row" data-repeater="'+escape(config.id)+'"'+(!editable||rows.length>=config.maxRows?' disabled':'')+'>'+icon("plus")+' Add '+escape(config.label)+' line</button></section>';
 }).join("");
}
function formFields(form,permissions){
 const d=draft(form),validation=validationById.get(form.id);
 return '<p class="section-intro">Only synthetic values are permitted. Asterisks mark fields required by the <strong>draft client contract</strong>, not an approved banking submission.</p>'+
 '<form id="synthetic-form" novalidate><div class="form-layout">'+renderGroups(form,permissions.canEdit)+renderRepeater(form,permissions.canEdit)+'</div>'+
 (validation?'<div class="notice '+(validation.valid?"good":"danger")+'" id="validation-summary" role="status">'+icon(validation.valid?"check":"warning")+'<div><strong>'+(validation.valid?"Local structure validated — NOT submitted":validation.issues.length+" local validation issue(s)")+'</strong><div>'+(validation.valid?"Backend policy and maker-checker remain unverified.":validation.issues.slice(0,8).map(v=>'<p>'+escape(v.message)+'</p>').join(""))+'</div></div></div>':"")+
 '<div class="form-actions"><button type="submit" class="btn"'+(permissions.canValidate?"":" disabled")+'>'+icon("check")+' Validate locally</button>'+
 '<button type="button" class="btn primary" data-action="save"'+(permissions.canSave?"":" disabled")+'>'+icon("file")+' Save synthetic draft</button>'+
 '<button type="button" class="btn" data-action="reset"'+(permissions.canEdit?"":" disabled")+'>'+icon("refresh")+' Reset fields</button>'+
 '</div></form>';
}
function workflowTab(form){
 return '<h3>Controlled domain workflow</h3><p class="section-intro">The steps below describe required bank-side state transitions. They have not been executed in this interface.</p><ol class="workflow-list">'+form.workflow.states.map((step,i)=>'<li class="workflow-step"><span class="step-circle">'+(i+1)+'</span><div><strong>'+escape(step.id.replaceAll("_"," "))+'</strong><p>'+escape(step.description)+'</p></div><span class="badge warning">Blocked</span></li>').join("")+'</ol>'+
 '<h3>Fail-closed exception states</h3><div class="pill-list">'+form.workflow.exceptionStates.map(s=>'<span class="badge warning">'+escape(s)+'</span>').join("")+'</div><div class="notice">'+icon("lock")+'<span>Unknown payments and settlement outcomes must stay on reconciliation hold. Retries, reversals, and approvals require trusted bank evidence and distinct maker/checker identities.</span></div>';
}
function controlsTab(form){
 return '<h3>Action and security matrix</h3><p class="section-intro">Every control has an explicit implementation status. A browser role preview is not authentication or authorization.</p><div class="controls-grid">'+Object.entries(form.controls).map(([name,status])=>'<div class="control"><strong>'+escape(name.replace(/([A-Z])/g," $1"))+'</strong><span>'+escape(status.replaceAll("_"," "))+'</span><span class="badge '+(status==="LOCAL_ONLY"?"":"danger")+'">'+(status==="LOCAL_ONLY"?"Local prototype only":"Not connected")+'</span></div>').join("")+'</div>'+
 '<hr class="section-divider"><h3>Mandatory server-side controls</h3><div class="pill-list">'+["Bank/branch tenant isolation","OAuth2/OIDC principal","Maker-checker and SoD","Expected-version CAS","Idempotency key","Transactional outbox","Immutable audit trail","Ledger balance & finality","Evidence retention policy","CEMAC rule-version check"].map(t=>'<span class="badge warning">'+escape(t)+'</span>').join("")+'</div>';
}
function auditTab(form){
 const items=localSaved.get(form.id)||[];
 return '<h3>Local draft evidence</h3><p class="section-intro">Session-only browser entries. This is not an immutable banking audit trail.</p>'+
 (items.length?items.map(item=>'<div class="local-record"><strong>'+escape(item.ref)+'</strong><span class="badge">LOCAL_DRAFT_NOT_SUBMITTED</span><p>Created '+escape(item.created)+' · '+item.fields+' captured fields · No bank operation</p><button class="btn tiny" data-action="discard" data-ref="'+escape(item.ref)+'">'+icon("trash")+' Discard local record</button></div>').join(""):'<div class="empty">No local synthetic drafts saved for this form.</div>')+
 '<h3>Browser-only activity</h3>'+(activity.filter(x=>x.form===form.id||!x.form).slice(0,8).map(x=>'<div class="local-record"><strong>'+escape(x.event)+'</strong><p>'+escape(x.when)+' · LOCAL ONLY</p></div>').join("")||'<p class="subtle">No activity recorded.</p>');
}
function summaryTab(form){
 const d=draft(form),output={id:form.id,name:form.name,variant:form.variant,values:d.values,repeaters:d.repeated,watermark:"SYNTHETIC_ONLY",authorization:"NONE",posted:false};
 return '<h3>Inspection preview — draft only</h3><p class="section-intro">This is the exact client-side JSON shape; it contains no real bank ID, signature, output record, transfer, or posted journal.</p><pre class="review-summary">'+escape(JSON.stringify(output,null,2))+'</pre><div class="notice">'+icon("shield")+'<span>Download a sample JSON only if every entered value is fictional. Real identity documents and banking data must never be entered here.</span></div>';
}
function actionsHeader(form,permissions){
 return '<div class="quick-actions"><button class="btn" data-action="sample"'+(permissions.canEdit?"":" disabled")+'>'+icon("file")+' Load synthetic example</button><button class="btn" data-action="validate"'+(permissions.canValidate?"":" disabled")+'>'+icon("check")+' Validate</button><button class="btn primary" data-action="save"'+(permissions.canSave?"":" disabled")+'>'+icon("clipboard")+' Save local draft</button><button class="btn" data-action="download"'+(permissions.canEdit?"":" disabled")+'>'+icon("download")+' JSON sample</button></div>';
}
function formBody(form){
 const permissions=permittedLocalActions(form,formState.role,formState.uiState);
 const stateNotice={
  access_denied:"Permission denied (preview). No bank-side authorization call has occurred.",
  offline_readonly:"Offline/read-only (preview). No transaction may be submitted.",
  version_conflict:"Expected aggregate version conflict (preview). No authoritative version is connected.",
  external_unknown:"External outcome unknown. Hold financial finality pending independent reconciliation.",
  reconciliation_hold:"Reconciliation hold. No settlement or ledger release has occurred.",
  pending_review:"Awaiting review (preview). Independent approval service is unavailable.",
  validating:"Validating (preview). Server-side rules not connected."
 }[formState.uiState];
 const active=actionsHeader(form,permissions);
 const tabs=[["fields","Form fields"],["workflow","Workflow"],["controls","Controls"],["review","Inspect draft"],["audit","Local activity"]];
 let body=formState.tab==="fields"?formFields(form,permissions):formState.tab==="workflow"?workflowTab(form):formState.tab==="controls"?controlsTab(form):formState.tab==="review"?summaryTab(form):auditTab(form);
 return '<div class="form-header"><div><div class="eyebrow">'+escape(form.id)+' · '+escape(form.group)+'</div><h2>'+escape(form.name)+'</h2><p class="subtle">'+escape(form.variantKind.toUpperCase())+' · '+form.fields.length+' proposed fields · '+form.repeaters.length+' repeatable groups</p><div class="form-context"><span class="badge warning">UNACCEPTED</span><span class="badge">'+escape(form.classification)+'</span><span class="badge">'+escape(form.ownerDomain)+' domain</span></div></div><span class="badge warning">Bank submissions disabled</span></div>'+
 '<div class="role-bar"><label for="preview-role">Preview role</label><select class="select" id="preview-role"><option value="operator"'+(formState.role==="operator"?" selected":"")+'>Operator preview</option><option value="reviewer"'+(formState.role==="reviewer"?" selected":"")+'>Reviewer preview</option><option value="auditor"'+(formState.role==="auditor"?" selected":"")+'>Auditor preview</option></select><span>Not bank authentication</span></div>'+
 '<div class="preview-state"><div><strong>UI state — synthetic preview</strong><p class="subtle">Choose an error or offline state to inspect its fail-closed behavior.</p></div><select id="preview-state" class="select"><option value="" disabled>Preview state</option>'+FORM_STATES.map(s=>'<option value="'+escape(s)+'"'+(formState.uiState===s?' selected':'')+'>'+escape(s.replaceAll("_"," "))+'</option>').join("")+'</select></div>'+
 (stateNotice?'<div class="notice danger">'+icon("warning")+'<span>'+escape(stateNotice)+'</span></div>':"")+
 active+'<div class="notice">'+icon("shield")+'<span><strong>Demo only:</strong> enter fictional values, never real KYC documents, account numbers, payroll records or customer data. Nothing is sent to a bank or retained after this browser session.</span></div>'+
 '<div class="metrics"><div class="metric"><span>Form controls</span><strong>'+form.fields.length+'</strong></div><div class="metric"><span>Repeatable groups</span><strong>'+form.repeaters.length+'</strong></div><div class="metric"><span>Workflow stages</span><strong>'+form.workflow.states.length+'</strong></div><div class="metric"><span>Accepted bank actions</span><strong>0</strong></div></div>'+
 '<div class="tabs" role="tablist" aria-label="Form workflow tabs">'+tabs.map(([id,label])=>'<button class="tab" role="tab" aria-selected="'+(formState.tab===id)+'" data-tab="'+id+'">'+label+'</button>').join("")+'</div><div id="tab-panel" role="tabpanel">'+body+'</div>'+
 '<hr class="section-divider"><div class="controls-grid"><div class="control"><strong>Submit for independent approval</strong><span>Requires authenticated tenant-scoped API, idempotency and case version</span><button class="btn" disabled>'+icon("lock")+' Submit — blocked</button></div><div class="control"><strong>Approve / post / reconcile</strong><span>Independent reviewer, ledger and external outcome evidence are not connected</span><button class="btn" disabled>'+icon("lock")+' Execute — blocked</button></div></div>';
}
function render(){
 const form=current(),results=filters(),visible=results.slice(0,formState.listLimit);
 root.innerHTML='<div class="drawer-overlay '+(formState.menu?'open':'')+'" data-action="close-menu"></div><div class="shell"><aside class="sidebar '+(formState.menu?'open':'')+'" aria-label="Form domains"><div class="brand"><span class="brand-symbol">O</span><div><strong>OPES CORE</strong><small>Forms and workflows</small></div></div><div class="nav-title">FUNCTIONAL AREAS</div><nav class="domain-list"><button class="domain-button '+(formState.code==="ALL"?"active":"")+'" data-domain="ALL"><strong>All form groups</strong><small>589</small></button>'+FORM_GROUP_SEEDS.map(([code,count,owner,name])=>'<button class="domain-button '+(formState.code===code?"active":"")+'" data-domain="'+escape(code)+'"><strong>'+escape(name)+'</strong><small>'+count+'</small></button>').join("")+'</nav><div class="nav-footer">Synthetic local drafts only. No approval, bank data or financial operations.</div></aside><div class="main-region"><header class="topbar"><button class="icon-button mobile-menu" aria-label="Open form navigation" data-action="menu">'+icon("menu")+'</button><strong>Banking Forms Workspace</strong><span class="badge">Prototype v0.1</span><span class="topbar-spacer"></span><button class="icon-button" data-action="theme" title="Toggle contrast theme" aria-label="Toggle light or dark theme">'+icon(formState.theme==="light"?"moon":"sun")+'</button><span class="badge warning">Not a banking system</span></header>'+
 '<main class="main" id="main"><div class="eyebrow">CEMAC-first · Multi-institution programme · Forms stage</div><h1>Banking forms and controlled workflows</h1><p class="subtle">589 proposed form variants across 25 areas. Each has task fields, conditional sections, local validation, a workflow definition, and explicit blocked bank-side controls.</p>'+
 '<div class="workspace"><section class="panel"><div class="panel-head"><h2>Forms directory</h2><span class="badge">'+results.length+' matching</span></div><div class="searchbox"><label for="form-search">Search forms</label><input class="input" type="search" id="form-search" placeholder="Loan application, teller cash…" value="'+escape(formState.query)+'"></div><div class="searchbox"><label for="form-domain">Domain</label><select class="select" id="form-domain"><option value="ALL">All 25 groups</option>'+FORM_GROUP_SEEDS.map(([code,count,owner,name])=>'<option value="'+escape(code)+'"'+(formState.code===code?" selected":"")+'>'+escape(name)+' ('+count+')</option>').join("")+'</select></div><div class="form-list">'+visible.map(f=>'<button class="form-list-item '+(formState.id===f.id?"active":"")+'" data-form="'+escape(f.id)+'" aria-current="'+(formState.id===f.id)+'"><small>'+escape(f.id)+' · '+escape(f.variant)+'</small><strong>'+escape(f.name)+'</strong><span>'+f.fields.length+' fields · '+escape(f.group)+'</span></button>').join("")+'</div>'+(results.length>visible.length?'<button class="btn" data-action="more" style="margin-top:10px;width:100%">Show next '+Math.min(100,results.length-visible.length)+' forms</button>':"")+(results.length===0?'<div class="empty">No matching forms. Clear filters or search a different task.</div>':"")+'</section><section class="panel form-panel">'+formBody(form)+'</section></div></main><footer class="footer">Opesware Technologies · 589 proposed client forms · All banking operations disabled · No network or disk persistence · Legal and regulatory validation pending</footer></div></div><div id="toast" class="toast" role="status" hidden></div>';
 document.documentElement.setAttribute("data-theme",formState.theme==="dark"?"dark":"light");
}
function download(filename,textContent){
 const url=URL.createObjectURL(new Blob([textContent],{type:"application/json;charset=utf-8"}));
 const a=document.createElement("a");a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function localValidate(){
 const form=current(),d=draft(form);
 const result=validateForm(form,d.values,d.repeated);
 validationById.set(form.id,result);
 formState.uiState=result.valid?"locally_validated":"validation_error";
 audit("Local input validation: "+(result.valid?"pass":"failed ("+result.issues.length+" issues)"));activity[0].form=form.id;
 render();
 flash(result.valid?"Draft fields structurally validated. No bank action occurred.":result.issues.length+" client input issue(s) remain.");
 return result;
}
function saveDraft(){
 const form=current(),permission=permittedLocalActions(form,formState.role,formState.uiState);
 if(!permission.canSave){flash("Local capture disabled in this preview state or role.");return;}
 const outcome=localValidate();
 if(!outcome.valid)return;
 const d=draft(form),list=localSaved.get(form.id)||[];
 const id="LOCAL-"+form.id+"-"+crypto.randomUUID().slice(0,8).toUpperCase();
 const record={ref:id,created:new Date().toISOString(),fields:Object.keys(d.values).length,snapshot:JSON.parse(JSON.stringify(d)),status:"LOCAL_DRAFT_NOT_SUBMITTED"};
 list.push(record);localSaved.set(form.id,list);formState.uiState="locally_validated";formState.tab="audit";
 audit("Saved synthetic draft "+id);activity[0].form=form.id;
 render();flash("Saved in RAM only. This is not a bank submission.");
}
function updateConditions(){
 const form=current(),d=draft(form),perm=permittedLocalActions(form,formState.role,formState.uiState);
 for(const f of form.fields){
  const wrap=root.querySelector('[data-field-wrap="'+f.id+'"]');
  if(!wrap)continue;
  const visible=isVisible(f,d.values);
  wrap.hidden=!visible;
  const control=wrap.querySelector("input,select,textarea");
  if(control){control.disabled=!visible||!perm.canEdit;control.required=visible&&f.required;}
 }
 for(const fieldset of root.querySelectorAll("[data-field-group]")){
  fieldset.hidden=![...fieldset.querySelectorAll("[data-field-wrap]")].some(w=>!w.hidden);
 }
}
function clickHandler(event){
 const el=event.target.closest("[data-action],[data-domain],[data-form],[data-tab]");
 if(!el)return;
 if(el.dataset.form){routeTo(el.dataset.form);return;}
 if(el.dataset.domain){formState.code=el.dataset.domain;formState.menu=false;formState.listLimit=100;render();return;}
 if(el.dataset.tab){formState.tab=el.dataset.tab;render();return;}
 const action=el.dataset.action,form=current(),d=draft(form),perm=permittedLocalActions(form,formState.role,formState.uiState);
 if(action==="menu"||action==="close-menu"){formState.menu=action==="menu";render();return;}
 if(action==="theme"){formState.theme=formState.theme==="light"?"dark":"light";render();return;}
 if(action==="more"){formState.listLimit=Math.min(formState.listLimit+100,589);render();return;}
 if(action==="sample"){if(!perm.canEdit)return;working.set(form.id,syntheticExample(form));validationById.delete(form.id);formState.uiState="dirty";render();flash("Fictional values loaded; no bank account or customer is represented.");return;}
 if(action==="reset"){if(!perm.canEdit)return;working.set(form.id,blankDraft(form));validationById.delete(form.id);formState.uiState="idle";render();return;}
 if(action==="validate"){if(!perm.canValidate)return;localValidate();return;}
 if(action==="save"){saveDraft();return;}
 if(action==="download"){if(!perm.canEdit)return;const p={formId:form.id,status:"SYNTHETIC_DRAFT_NOT_ISSUED",data:d,authorization:"NONE",bankId:null,transactionPosted:false};download(form.id+"-SAMPLE.json",JSON.stringify(p,null,2));flash("Synthetic sample exported. No bank operation occurred.");return;}
 if(action==="add-row"){if(!perm.canEdit)return;const config=form.repeaters.find(r=>r.id===el.dataset.repeater);if(!config)return;const rows=d.repeated[config.id]||[];if(rows.length>=config.maxRows)return;rows.push({});validationById.delete(form.id);formState.uiState="dirty";render();return;}
 if(action==="remove-row"){if(!perm.canEdit)return;const config=form.repeaters.find(r=>r.id===el.dataset.repeater);if(!config)return;const rows=d.repeated[config.id]||[];const index=Number(el.dataset.index);if(rows.length<=config.minRows||!Number.isInteger(index)||index<0||index>=rows.length)return;rows.splice(index,1);validationById.delete(form.id);formState.uiState="dirty";render();return;}
 if(action==="discard"){const ref=el.dataset.ref;const list=localSaved.get(form.id)||[];if(!list.some(x=>x.ref===ref))return;if(!confirm("Discard this local synthetic draft?"))return;localSaved.set(form.id,list.filter(x=>x.ref!==ref));audit("Discarded local synthetic draft "+ref);activity[0].form=form.id;render();}
}
root.addEventListener("click",clickHandler);
root.addEventListener("submit",event=>{if(event.target.id==="synthetic-form"){event.preventDefault();const perm=permittedLocalActions(current(),formState.role,formState.uiState);if(perm.canValidate)localValidate();}});
root.addEventListener("input",event=>{
 const input=event.target;
 if(input.id==="form-search"){
  const pos=input.selectionStart;formState.query=input.value;formState.listLimit=100;render();const next=root.querySelector("#form-search");next?.focus();if(next&&pos!=null)next.setSelectionRange(pos,pos);return;
 }
 if(!input.dataset.fieldId)return;
 const d=draft(),key=input.dataset.fieldId;
 if(input.dataset.repeater){
  const group=d.repeated[input.dataset.repeater]||[],row=group[Number(input.dataset.index)];
  if(row)row[key]=input.value;
 }else d.values[key]=input.value;
 validationById.delete(formState.id);
 if(formState.uiState==="idle"||formState.uiState==="locally_validated"||formState.uiState==="validation_error")formState.uiState="dirty";
 if(input.tagName==="SELECT")updateConditions();
});
root.addEventListener("change",event=>{
 const el=event.target;
 if(el.id==="form-domain"){formState.code=el.value;formState.listLimit=100;formState.query="";render();return;}
 if(el.id==="preview-role"){formState.role=el.value;formState.uiState="idle";render();return;}
 if(el.id==="preview-state"){formState.uiState=el.value;render();return;}
 if(el.dataset.fieldId)updateConditions();
});
addEventListener("hashchange",()=>{
 const match=location.hash.match(/^#\/form\/(FRM-[A-Z]+-\d{3})$/);
 if(match&&FORM_BY_ID.has(match[1])&&match[1]!==formState.id){
  formState.id=match[1];formState.uiState="idle";formState.role="operator";formState.tab="fields";formState.code="ALL";formState.query="";formState.listLimit=100;render();
 }
});
const match=location.hash.match(/^#\/form\/(FRM-[A-Z]+-\d{3})$/);
if(match&&FORM_BY_ID.has(match[1]))formState.id=match[1];
render();
