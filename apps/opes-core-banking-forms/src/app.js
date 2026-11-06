import {FORMS,FORM_BY_ID,FORM_STATISTICS} from "./form-registry.js";
import {validateForm,safeDemoData,sanitizedLocalDraft,isConditionalActive,conditionallyRequired} from "./validation.js";
import {DOMAIN_LABELS} from "../../opes-core-banking-ui/src/catalog.js";
const root=document.querySelector("#app");
const escape=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const state={domain:"ALL",query:"",mode:"ALL",formId:FORMS[0].id,tab:"fields",menu:false,errors:[],warnings:[],drafts:new Map(),entries:new Map(),draftSelected:""};
const groupCounts=Object.fromEntries([...new Set(FORMS.map(f=>f.domain))].map(d=>[d,FORMS.filter(f=>f.domain===d).length]));
const displayed=()=>FORMS.filter(f=>(state.domain==="ALL"||f.domain===state.domain)&&(state.mode==="ALL"||f.mode===state.mode)&&(!state.query||[f.name,f.id,f.domain].join(" ").toLowerCase().includes(state.query.toLowerCase())));
const current=()=>FORM_BY_ID.get(state.formId)||FORMS[0];
const draftFor=id=>state.entries.get(id)||{};
function notify(message){const e=document.querySelector("#toast");if(!e)return;e.hidden=false;e.textContent=message;setTimeout(()=>{if(e)e.hidden=true;},3400);}
function choose(id){if(!FORM_BY_ID.has(id))return;state.formId=id;state.tab="fields";state.errors=[];state.warnings=[];state.draftSelected="";location.hash="#/form/"+id;render();}
function fieldMarkup(field,form,values,required){
 const cond=form.conditionalRules.filter(c=>c.requires.includes(field.id));const visible=cond.length===0||cond.some(c=>isConditionalActive(c,values))||field.required;
 if(!visible)return "";
 const id="entry-"+field.id;
 const common=' id="'+escape(id)+'" name="'+escape(field.id)+'"'+(required.has(field.id)?" required":"");
 const value=values[field.id]??"";
 let inp="";
 if(field.type==="select")inp='<select'+common+'><option value="">Choose…</option>'+field.options.map(o=>'<option value="'+escape(o)+'"'+(o===value?" selected":"")+'>'+escape(o)+'</option>').join("")+'</select>';
 else if(field.type==="textarea")inp='<textarea'+common+' maxlength="1500" rows="3">'+escape(value)+'</textarea>';
 else if(field.type==="checkbox")inp='<input type="checkbox"'+common+(value?" checked":"")+'>';
 else inp='<input type="'+escape(field.type)+'"'+common+' value="'+escape(value)+'"'+(field.type==="number"?' min="0" step="1" inputmode="numeric"':' maxlength="1500"')+'>';
 const err=state.errors.some(e=>e.fields.includes(field.id));
 return '<div class="field '+(field.type==="textarea"?"full ":"")+(err?"error":"")+'"><label for="'+escape(id)+'">'+escape(field.label)+(required.has(field.id)?' <span class="req">*</span>':'')+'</label>'+inp+'<small class="hint">'+escape(field.section)+(field.sensitive?" · sensitive-classified field (synthetic only)":"")+'</small></div>';
}
function inputs(form){
 if(form.mode!=="DRAFT_CAPTURE")return '<div class="note">This screen is '+escape(form.mode.replaceAll("_"," ").toLowerCase())+'. Its query/inspection fields are specified but cannot mutate authoritative banking data.</div>'+form.sections.map(section=>'<fieldset class="form-section"><legend>'+escape(section.name)+'</legend><div class="field-grid">'+section.fields.map(id=>{const f=form.fields.find(f=>f.id===id);return '<div class="field"><label>'+escape(f.label)+'</label><input disabled aria-label="'+escape(f.label)+'" placeholder="No trusted bank query API" /></div>';}).join("")+'</div></fieldset>').join("");
 const values=draftFor(form.id),required=conditionallyRequired(form,values);
 return '<form id="data-form" novalidate><div class="note"><strong>Local synthetic draft.</strong> No data is transmitted, saved to device storage or used to initiate a financial transaction. Never enter real bank customer data in this prototype.</div>'+
 (state.errors.length?'<div class="errors" role="alert"><strong>Validation errors ('+state.errors.length+')</strong><ul>'+state.errors.map(e=>'<li>'+escape(e.message)+'</li>').join("")+'</ul></div>':'')+
 (state.warnings.length?'<div class="note" role="status">'+state.warnings.map(w=>escape(w.message)).join("; ")+'</div>':'')+
 '<div class="form-sections">'+form.sections.map(section=>'<fieldset class="form-section"><legend>'+escape(section.name)+'</legend><div class="field-grid">'+section.fields.map(id=>{const field=form.fields.find(f=>f.id===id);return fieldMarkup(field,form,values,required);}).join("")+'</div></fieldset>').join("")+'</div>'+
 '<div class="buttons"><button type="button" class="btn" data-action="demo">Populate synthetic example</button><button type="button" class="btn" data-action="validate">Validate draft</button><button type="submit" class="btn primary">Save draft in memory</button><button type="button" class="btn" data-action="reset">Reset</button></div></form>';
}
function workflows(form){
 const steps=["Identify / capture synthetic task","Local validation only","Independent authorization — BLOCKED","Post / settle / reconcile — BLOCKED"];
 return '<section><h3>Draft workflow and hard security gates</h3><div class="workflow">'+steps.map((s,i)=>'<div class="step"><small>STEP 0'+(i+1)+'</small><strong>'+escape(s)+'</strong><p>'+escape(i<2?"Preview-only step — no bank effect":i===2?"Authenticated reviewer and SoD required":"Authoritative ledger / rail reconciliation required")+'</p></div>').join("")+'</div></section><div class="buttons">'+["Submit for approval","Independent approval","Execute / post","Reconcile","Issue document"].map(s=>'<button type="button" class="btn" disabled title="Verified banking services and permissions unavailable">'+s+' · BLOCKED</button>').join("")+'</div>';
}
function audit(form){
 return '<div class="note"><strong>Server controls required before production:</strong> Tenant identity, bank and branch scopes, idempotency, approved policy versions, independent maker-checker, immutable evidence, atomic posting and outbox, external reconciliation, accessible error states, source and legal verification.</div>'+
 form.reviewGates.map((gate,i)=>'<div class="state-row"><strong>'+escape(gate.replaceAll("_"," "))+'</strong><span>NOT ACCEPTED</span></div>').join("")+
 '<div class="state-row"><strong>Authoritative API contract</strong><span>UNBOUND</span></div><div class="state-row"><strong>Bank transaction effects</strong><span>DISABLED</span></div>';
}
function draftList(form){
 const drafts=state.drafts.get(form.id)||[];
 return '<h3>Memory-only synthetic drafts</h3>'+(drafts.length?'<div class="draft-list">'+drafts.map(d=>'<div class="draft"><div><strong>'+escape(d.id)+'</strong><small>'+escape(d.created)+' · VALIDATED LOCALLY / NOT SUBMITTED</small></div><button class="btn" data-action="inspect" data-draft="'+escape(d.id)+'">Inspect</button></div>').join("")+'</div>':'<div class="note">No in-memory drafts for this screen. No authoritative records are loaded.</div>')+
 (state.draftSelected?'<div class="note">Selected local synthetic draft: '+escape(state.draftSelected)+'. This is not a banking audit record.</div>':'');
}
function workspace(form){
 const disabled=form.mode!=="DRAFT_CAPTURE";
 return '<div class="form-head"><div><div class="id">'+escape(form.id)+' · '+escape(form.domain)+' · '+escape(form.version)+'</div><h2>'+escape(form.name)+'</h2><p>'+form.fields.length+' candidate fields · '+form.validationRules.length+' declarative rules · '+form.conditionalRules.length+' conditional sections · '+escape(form.mode)+'</p></div><div class="form-actions"><span class="pill warning">NOT APPROVED</span><button class="btn" data-action="copy" type="button">Copy form ID</button></div></div><div class="tabs" role="tablist" aria-label="Form workspace"><button class="tab" role="tab" aria-selected="'+(state.tab==="fields")+'" data-tab="fields">Form fields</button><button class="tab" role="tab" aria-selected="'+(state.tab==="drafts")+'" data-tab="drafts">Local drafts</button><button class="tab" role="tab" aria-selected="'+(state.tab==="workflow")+'" data-tab="workflow">Workflow gates</button><button class="tab" role="tab" aria-selected="'+(state.tab==="controls")+'" data-tab="controls">Audit controls</button></div>'+
 (state.tab==="fields"?inputs(form):state.tab==="drafts"?draftList(form):state.tab==="workflow"?workflows(form):audit(form));
}
function render(){
 const f=current(),options=displayed();
 if(!options.some(x=>x.id===state.formId)&&options.length)state.formId=options[0].id;
 const selected=options.find(x=>x.id===state.formId)||options[0]||null;
 root.innerHTML='<div class="overlay '+(state.menu?'open':'')+'" data-action="close"></div><div class="shell"><aside class="rail '+(state.menu?'open':'')+'" aria-label="Banking form domains"><div class="brand"><div class="brandmark">O</div><div><strong>OPES CORE</strong><small>Transactional forms</small></div></div><div class="rail-label">FUNCTIONAL AREAS</div><nav class="domains"><button class="domain '+(state.domain==="ALL"?"active":"")+'" data-domain="ALL"><span>All banking forms</span><b>'+FORMS.length+'</b></button>'+Object.entries(groupCounts).map(([d,n])=>'<button class="domain '+(state.domain===d?"active":"")+'" data-domain="'+d+'"><span>'+escape(DOMAIN_LABELS[d]||d)+'</span><b>'+n+'</b></button>').join("")+'</nav><div class="rail-bottom">Draft design only. Never use real customer information or authorize a banking transaction.</div></aside><div class="main-shell"><header class="topbar"><button class="btn menu" data-action="menu">Menu</button><strong>Banking forms & workflows</strong><span class="pill">Client specifications</span><div class="topbar-spacer"></div><span class="pill warning">PRODUCTION BLOCKED</span></header><main class="content" id="main"><span class="eyebrow">OPES Core Banking · Forms phase</span><h1>Banking transaction forms</h1><p class="desc">Screen-aligned form contracts across all 26 domains, with conditional rules, local validations, sensitive-field markers and fail-closed workflow controls.</p><div class="callout"><strong>Non-production:</strong><span>Forms are local synthetic prototypes. Every bank submission, approval, posting, reconciliation and official document issue is disabled.</span></div><div class="metrics"><div class="metric"><small>Form definitions</small><strong>'+FORM_STATISTICS.total+'</strong></div><div class="metric"><small>Draft capture forms</small><strong>'+FORM_STATISTICS.capture+'</strong></div><div class="metric"><small>Read-only / query forms</small><strong>'+FORM_STATISTICS.readOnly+'</strong></div><div class="metric"><small>Production approvals</small><strong>'+FORM_STATISTICS.approved+'</strong></div></div><div class="filters"><div class="filter"><label for="search">Find form by screen, ID or domain</label><input id="search" type="search" placeholder="Search all 726 form contracts" value="'+escape(state.query)+'"></div><div class="filter"><label for="domain">Domain</label><select id="domain"><option value="ALL">All domains</option>'+Object.keys(groupCounts).map(d=>'<option value="'+d+'"'+(state.domain===d?" selected":"")+'>'+escape(DOMAIN_LABELS[d]||d)+'</option>').join("")+'</select></div><div class="filter"><label for="mode">Interaction type</label><select id="mode"><option value="ALL">All form types</option>'+[...new Set(FORMS.map(f=>f.mode))].map(mode=>'<option value="'+mode+'"'+(state.mode===mode?" selected":"")+'>'+escape(mode.replaceAll("_"," "))+'</option>').join("")+'</select></div></div><div class="workspace"><section class="card"><h2>Form directory <small class="pill">'+options.length+'</small></h2><div class="chooser">'+options.map(x=>'<button class="form-option '+(selected?.id===x.id?"active":"")+'" data-form="'+escape(x.id)+'"><span class="code">'+escape(x.id)+'</span><strong>'+escape(x.name)+'</strong><small>'+escape(x.mode)+' · '+x.fields.length+' fields</small></button>').join("")+'</div></section><section class="card">'+(selected?workspace(selected):'<div class="note">No form matches the current filters.</div>')+'</section></div></main><footer class="footer">Opesware Technologies · OPES Core Banking · Form contract draft only · No financial or regulatory acceptance.</footer></div></div><div id="toast" class="status" role="status" hidden></div>';
 document.querySelector("#search")?.addEventListener("input",e=>{const pos=e.target.selectionStart;state.query=e.target.value;render();const x=document.querySelector("#search");x?.focus();if(pos!==null)x?.setSelectionRange(pos,pos);});
 document.querySelector("#domain")?.addEventListener("change",e=>{state.domain=e.target.value;render();});
 document.querySelector("#mode")?.addEventListener("change",e=>{state.mode=e.target.value;render();});
 document.querySelector("#data-form")?.addEventListener("submit",e=>{e.preventDefault();saveLocal(current());});
 document.querySelector("#data-form")?.addEventListener("input",captureInputs);
 document.querySelector("#data-form")?.addEventListener("change",captureInputs);
}
function captureInputs(e){
 const form=current();if(form.mode!=="DRAFT_CAPTURE")return;
 const target=e.target;if(!target.name)return;
 const values={...draftFor(form.id),[target.name]:target.type==="checkbox"?(target.checked?"Yes":"No"):target.value};
 state.entries.set(form.id,values);
 // When a conditional discriminator changes, rerender to reveal/hide dependent inputs.
 if(form.conditionalRules.some(r=>r.when.field===target.name)){
  const active=document.activeElement?.name;
  render();document.getElementsByName(active)?.[0]?.focus();
 }
}
function runValidation(form,save=false){
 if(form.mode!=="DRAFT_CAPTURE"){notify("Read-only form: no draft capture allowed.");return;}
 const result=validateForm(form,draftFor(form.id));
 state.errors=result.errors;state.warnings=result.warnings;
 if(result.ok&&save){
  const item={id:"LOCAL-"+form.domain+"-"+crypto.randomUUID().slice(0,8),created:new Date().toISOString(),data:sanitizedLocalDraft(form,draftFor(form.id))};
  state.drafts.set(form.id,[...(state.drafts.get(form.id)||[]),item]);state.tab="drafts";
  notify("Saved synthetic draft in memory only. Nothing was transmitted to a bank.");
 }else notify(result.ok?"Local validation passed; no bank approval inferred.":"Found "+result.errors.length+" local field errors.");
 render();
}
function saveLocal(form){runValidation(form,true);}
document.addEventListener("click",e=>{
 const el=e.target.closest("[data-action],[data-domain],[data-form],[data-tab]");if(!el)return;
 if(el.dataset.form){choose(el.dataset.form);return;}
 if(el.dataset.domain){state.domain=el.dataset.domain;state.menu=false;render();return;}
 if(el.dataset.tab){state.tab=el.dataset.tab;state.errors=[];render();return;}
 const action=el.dataset.action;
 if(action==="menu"||action==="close"){state.menu=action==="menu";render();return;}
 const form=current();
 if(action==="demo"){state.entries.set(form.id,safeDemoData(form));state.errors=[];state.warnings=[];render();notify("Only synthetic example data populated.");return;}
 if(action==="validate"){runValidation(form);return;}
 if(action==="reset"){state.entries.delete(form.id);state.errors=[];state.warnings=[];render();return;}
 if(action==="copy"){navigator.clipboard?.writeText(form.id).then(()=>notify("Form ID copied."));return;}
 if(action==="inspect"){state.draftSelected=el.dataset.draft||"";render();}
});
const initial=location.hash.match(/^#\/form\/(FORM-[A-Z]+-UI-\d{3})$/);if(initial&&FORM_BY_ID.has(initial[1]))state.formId=initial[1];
addEventListener("hashchange",()=>{const match=location.hash.match(/^#\/form\/(FORM-[A-Z]+-UI-\d{3})$/);if(match&&FORM_BY_ID.has(match[1])&&match[1]!==state.formId){state.formId=match[1];state.domain="ALL";state.mode="ALL";state.query="";state.tab="fields";render();}});
render();
