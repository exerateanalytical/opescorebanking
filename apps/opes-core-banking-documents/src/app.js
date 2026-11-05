import {TEMPLATES,TEMPLATE_BY_ID,TEMPLATE_GROUP_COUNTS,TEMPLATE_GROUPS,TEMPLATE_FAMILIES,CATALOGUE_STATE} from "./templates.js";
import {renderDocumentHtml,demoData} from "./render.js";

const root=document.querySelector("#app");
const safe=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const state={code:"ALL",family:"ALL",query:"",selected:TEMPLATES[0]?.id||null,menu:false};
const filtered=()=>TEMPLATES.filter(t=>(state.code==="ALL"||t.code===state.code)&&(state.family==="ALL"||t.family===state.family)&&(!state.query||[t.name,t.id,t.group,t.family].join(" ").toLowerCase().includes(state.query.trim().toLowerCase())));
const selected=()=>TEMPLATE_BY_ID.get(state.selected)||TEMPLATES[0];
function choose(id){
 if(!TEMPLATE_BY_ID.has(id))return;
 state.selected=id;
 location.hash="#/document/"+id;
 render();
 document.querySelector("#doc-title")?.focus();
}
function notify(msg){
 const status=document.querySelector("#status");
 if(!status)return;
 status.textContent=msg;status.hidden=false;
 setTimeout(()=>{if(status)status.hidden=true;},3400);
}
function choices(){
 return '<div class="field"><label for="doc-search">Search all 407 documents</label><input id="doc-search" type="search" value="'+safe(state.query)+'" placeholder="Account statement, payslip, loan…"></div>'+
 '<div class="field"><label for="doc-domain">Functional area</label><select id="doc-domain"><option value="ALL">All 25 areas</option>'+TEMPLATE_GROUPS.map(([code,n,owner,name])=>'<option value="'+safe(code)+'"'+(state.code===code?' selected':'')+'>'+safe(name)+' ('+n+')</option>').join("")+'</select></div>'+
 '<div class="field"><label for="doc-family">Document layout</label><select id="doc-family"><option value="ALL">All document types</option>'+TEMPLATE_FAMILIES.map(f=>'<option value="'+safe(f)+'"'+(state.family===f?' selected':'')+'>'+safe(f.charAt(0).toUpperCase()+f.slice(1))+'</option>').join("")+'</select></div>';
}
function listItems(items){
 if(!items.length)return '<div class="empty">No templates match your filters. Clear the search or select another area.</div>';
 return items.map(t=>'<button class="template-item '+(state.selected===t.id?'active':'')+'" type="button" data-template="'+safe(t.id)+'" aria-current="'+(state.selected===t.id?'true':'false')+'"><span class="type">'+safe(t.family)+' · '+safe(t.id)+'</span><strong>'+safe(t.name)+'</strong><span>'+t.fields.length+' proposed fields · '+safe(t.layout.paper)+'</span></button>').join("");
}
function render(){
 const docs=filtered();
 const current=docs.find(t=>t.id===state.selected)||docs[0]||null;
 if(current&&current.id!==state.selected)state.selected=current.id;
 root.innerHTML='<div class="backdrop '+(state.menu?'open':'')+'" data-action="close"></div><div class="shell"><aside class="rail '+(state.menu?'open':'')+'" aria-label="Document domain navigation"><div class="brand"><span class="brandmark" aria-hidden="true">O</span><div><strong>OPES CORE</strong><small>Document library</small></div></div><h2>DOCUMENT GROUPS</h2><div class="domain-list"><button class="domain-link '+(state.code==="ALL"?'active':'')+'" data-domain="ALL"><span>All document areas</span><b>407</b></button>'+TEMPLATE_GROUPS.map(([code,count,owner,name])=>'<button class="domain-link '+(state.code===code?'active':'')+'" data-domain="'+safe(code)+'"><span>'+safe(name)+'</span><b>'+count+'</b></button>').join("")+'</div><div class="rail-footer">Template specimens only. No trusted bank records or legal issuance service.</div></aside><div class="content"><header class="topbar"><button class="btn menu" data-action="menu" aria-label="Open document domains">Menu</button><strong>Banking print templates</strong><span class="badge">v0.1 design library</span><span class="spacer"></span><span class="badge warning">SPECIMEN ONLY</span></header><main class="main" id="main-content"><div class="headerline"><div><div class="eyebrow">OPES Core Banking · Document templates</div><h1>Banking document studio</h1><p class="lead">407 specifically named, individually addressable print document designs. Structured fields, A4/A5 layouts, reference numbers, approval placeholders and controlled specimen output.</p></div></div><div class="warning"><strong>Restricted issuance:</strong><span>All documents are visibly marked SPECIMEN · NOT VALID. They are not legal contracts, official statements, signed evidence, regulator-approved returns or processed bank transactions.</span></div><div class="meta"><div class="metric"><small>Document designs</small><strong>'+TEMPLATES.length+'</strong></div><div class="metric"><small>Document groups</small><strong>'+TEMPLATE_GROUPS.length+'</strong></div><div class="metric"><small>Production-approved</small><strong>'+CATALOGUE_STATE.productionAccepted+'</strong></div></div><div class="controls">'+choices()+'</div><div class="workspace"><section class="panel"><div class="panelhead"><div><h2>Documents</h2><small>'+docs.length+' matching templates</small></div><button class="btn" data-action="reset" type="button">Clear filters</button></div><div class="template-list" aria-label="Select document template">'+listItems(docs)+'</div></section><section class="panel preview-card">'+(current?'<div class="preview-bar"><div><h2 id="doc-title" tabindex="-1">'+safe(current.name)+'</h2><div class="preview-info">'+safe(current.id)+' · '+safe(current.group)+' · '+current.fields.length+' proposed fields · '+safe(current.layout.paper)+'</div></div><span class="badge warning">Not approved</span></div><iframe class="preview-frame" id="document-frame" title="Printable sample document specimen" sandbox="allow-same-origin allow-modals" srcdoc="'+safe(renderDocumentHtml(current,demoData(current)))+'"></iframe><div class="preview-actions"><button class="btn primary" data-action="print" type="button">Print specimen</button><button class="btn" data-action="html" type="button">Download HTML</button><button class="btn" data-action="schema" type="button">Download JSON schema</button><span class="preview-info">Final issuance disabled</span></div>':'<div class="empty">No document selected.</div>')+'</section></div></main><footer class="footnote">© Opesware Technologies · Draft document studio · A4/A5 print previews · No electronic signature, official hologram, working verification QR or bank data connection</footer></div></div><div id="status" role="status" hidden></div>';
 document.querySelector("#doc-search")?.addEventListener("input",e=>{state.query=e.target.value;const caret=e.target.selectionStart;render();const input=document.querySelector("#doc-search");input.focus();if(caret!==null)input.setSelectionRange(caret,caret);});
 document.querySelector("#doc-domain")?.addEventListener("change",e=>{state.code=e.target.value;render();});
 document.querySelector("#doc-family")?.addEventListener("change",e=>{state.family=e.target.value;render();});
}
function download(name,content,type){
 const url=URL.createObjectURL(new Blob([content],{type}));
 const anchor=document.createElement("a");anchor.href=url;anchor.download=name;document.body.appendChild(anchor);anchor.click();anchor.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1200);
}
document.addEventListener("click",e=>{
 const el=e.target.closest("[data-template], [data-domain], [data-action]");
 if(!el)return;
 if(el.dataset.template){choose(el.dataset.template);return;}
 if(el.dataset.domain){state.code=el.dataset.domain;state.menu=false;render();return;}
 const action=el.dataset.action;
 if(action==="reset"){state.code="ALL";state.family="ALL";state.query="";render();return;}
 if(action==="menu"||action==="close"){state.menu=action==="menu";render();return;}
 const doc=selected();if(!doc)return;
 if(action==="print"){const frame=document.querySelector("#document-frame");if(!frame?.contentWindow){notify("Preview not loaded");return;}frame.contentWindow.focus();frame.contentWindow.print();return;}
 if(action==="html"){download(doc.id+"-SPECIMEN.html",renderDocumentHtml(doc,demoData(doc)),"text/html;charset=utf-8");notify("Downloaded a specimen, not a valid banking document.");return;}
 if(action==="schema"){download(doc.id+"-DRAFT.json",JSON.stringify(doc,null,2),"application/json");notify("Downloaded draft schema, not a regulator-approved form.");}
});
const initial=location.hash.match(/^#\/document\/(DOC-[A-Z]+-\d{3})$/);
if(initial&&TEMPLATE_BY_ID.has(initial[1])){state.selected=initial[1];state.code="ALL";}
addEventListener("hashchange",()=>{const hit=location.hash.match(/^#\/document\/(DOC-[A-Z]+-\d{3})$/);if(hit&&TEMPLATE_BY_ID.has(hit[1])&&hit[1]!==state.selected){state.selected=hit[1];state.code="ALL";state.family="ALL";state.query="";render();}});
render();
