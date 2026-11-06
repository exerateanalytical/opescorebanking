import {REPORTS,REPORT_BY_ID,REPORT_GROUPS,REPORT_SUMMARY} from "./report-registry.js";
import {syntheticRows} from "./fixtures.js";
import {executeReport,formatMetric,csvReport,jsonReport,printReportHtml} from "./report-engine.js";
const root=document.querySelector("#app");
const safe=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const state={group:"ALL",kind:"ALL",query:"",reportId:REPORTS[0].id,tab:"preview",menu:false,filters:{currency:"XAF",period:"ALL",branch:"ALL"},result:null,error:"",activeReportId:null};
const selected=()=>REPORT_BY_ID.get(state.reportId)||REPORTS[0];
const shown=()=>REPORTS.filter(r=>(state.group==="ALL"||r.code===state.group)&&(state.kind==="ALL"||r.visual===state.kind)&&(!state.query||[r.title,r.id,r.group,r.code].join(" ").toLowerCase().includes(state.query.toLowerCase())));
const classes=REPORT_SUMMARY.reportClasses;
function notice(text){const el=document.querySelector("#toast");if(!el)return;el.hidden=false;el.textContent=text;setTimeout(()=>{if(el)el.hidden=true;},3500);}
function rerun(report){
 try{state.result=executeReport(report,syntheticRows(report),state.filters);state.error="";state.activeReportId=report.id;}
 catch(e){state.result=null;state.error=String(e.message||e);state.activeReportId=report.id;}
}
function select(id){
 if(!REPORT_BY_ID.has(id))return;
 state.reportId=id;state.tab="preview";state.filters={currency:"XAF",period:"ALL",branch:"ALL"};rerun(selected());
 location.hash="#/report/"+id;render();
}
function download(name,data,type){
 const url=URL.createObjectURL(new Blob([data],{type}));
 const a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function chooseFilters(report){
 return '<div class="report-filters">'+report.allowedFilters.filter(x=>["period","branch","currency","product","status","channel","riskBand","rail","segment"].includes(x.id)).slice(0,6).map(filter=>{
  const value=state.filters[filter.id]??"ALL";
  const opts=filter.id==="period"?["ALL","2026-06","2026-07","2026-08","2026-09","2026-10","2026-11"]:filter.options;
  return '<div class="filterfield"><label for="rf-'+safe(filter.id)+'">'+safe(filter.label)+'</label><select id="rf-'+safe(filter.id)+'" data-filter="'+safe(filter.id)+'">'+opts.map(v=>'<option value="'+safe(v)+'"'+(v===value?' selected':'')+'>'+safe(v)+'</option>').join("")+'</select></div>';
 }).join("")+'</div>';
}
function barChart(result){
 if(!result?.rows.length)return '<div class="empty">No matching synthetic observations.</div>';
 const arr=result.rows;const max=Math.max(1,...arr.filter(x=>!x.suppressed).map(x=>x.count));
 return '<div class="chart" role="img" aria-label="Synthetic observations by '+safe(result.groupBy)+'">'+arr.map(row=>'<div class="bar-row"><span class="bar-label">'+safe(row.dimensionValue)+'</span><div class="bar-track"><div class="bar-fill" style="width:'+(row.suppressed?0:Math.round(row.count/max*100))+'%"></div></div><span class="bar-count">'+(row.suppressed?"—":row.count)+'</span></div>').join("")+'</div>';
}
function table(result,report){
 const cols=["Group","Records",...report.measures.map(x=>x.label)];
 return '<p class="scroll-hint">Scroll horizontally to inspect additional metrics.</p><div class="table-scroll" tabindex="0" role="region" aria-label="Report metrics table, horizontally scrollable"><table><thead><tr>'+cols.map(x=>'<th>'+safe(x)+'</th>').join("")+'</tr></thead><tbody>'+result.rows.map(row=>'<tr><td>'+safe(row.dimensionValue)+'</td><td class="num">'+(row.suppressed?"Suppressed":safe(row.count))+'</td>'+report.measures.map(metric=>'<td class="num">'+(row.suppressed?"SUPPRESSED":safe(formatMetric(row.metrics[metric.id],metric,result.currency)))+'</td>').join("")+'</tr>').join("")+'</tbody></table></div>';
}
function preview(report){
 const result=state.result;
 return chooseFilters(report)+'<div class="quick-actions"><button class="btn primary" data-action="run">Run synthetic preview</button><button class="btn" data-action="clear-filters">Clear filters</button><button class="btn" data-action="csv" '+(!result?"disabled":"")+'>Export sample CSV</button><button class="btn" data-action="json" '+(!result?"disabled":"")+'>Export JSON</button><button class="btn" data-action="html" '+(!result?"disabled":"")+'>Download print specimen</button></div>'+
 (state.error?'<div class="notice" role="alert">'+safe(state.error)+'</div>':'')+
 (result?'<div class="result-stats"><div class="result-stat"><small>Selected synthetic observations</small><strong>'+result.recordCount+'</strong></div><div class="result-stat"><small>Privacy suppressed groups</small><strong>'+result.rows.filter(r=>r.suppressed).length+'</strong></div></div><div class="result-meta">'+safe(result.asOf)+' · '+safe(result.currency)+' · Grouped by '+safe(result.groupBy)+' · Calculations are synthetic training examples</div>'+table(result,report)+(report.outputs.chart?'<h3 style="margin-top:18px">Group count comparison</h3>'+barChart(result):'')+
 (result.issues.length?'<div class="notice" role="status">'+result.issues.map(safe).join("; ")+'</div>':''):'<div class="empty">No synthetic report preview. Adjust the filters and run again.</div>')+
 '<div class="notice"><strong>Blocked:</strong><span>Live report execution, authoritative drilldown, official PDF generation, bank approval and regulatory submission.</span></div>';
}
function specification(report){
 return '<h3>Data contract, measures and business grain</h3><div class="formula">'+report.measures.map(m=>'<div class="formula-item"><small>'+safe(m.id)+' · '+safe(m.unit)+'</small><strong>'+safe(m.label)+'</strong><div class="result-meta">Formula: '+safe(m.formula)+' · Fields: '+safe(m.sourceFields.join(", "))+'</div></div>').join("")+'</div>'+
 '<h3 style="margin-top:20px">Dimensions and period filters</h3><div class="result-meta">'+report.dimensions.map(safe).join(" · ")+' · report grain: '+safe(report.grain)+'</div>'+
 '<h3>Required data lineage</h3>'+Object.entries(report.sourceRequirements).map(([k,v])=>'<div class="control"><strong>'+safe(k.replaceAll("_"," "))+'</strong><span>'+safe(v)+'</span></div>').join("");
}
function controls(report){
 return '<div class="notice"><strong>Release gate:</strong><span>No report has an authenticated banking source or regulatory certification. All source and issuer actions fail closed.</span></div>'+
 [...report.businessChecks,...Object.keys(report.acceptance)].map(v=>'<div class="control"><strong>'+safe(v.replaceAll("_"," "))+'</strong><span>NOT ACCEPTED</span></div>').join("")+
 '<h3 style="margin-top:18px">Action controls</h3>'+Object.entries(report.authorization).filter(([k])=>!["roleClasses","serverPolicy","makerChecker"].includes(k)).map(([k,v])=>'<div class="control"><strong>'+safe(k.replaceAll("_"," "))+'</strong><span>DISABLED</span></div>').join("")+
 '<div class="quick-actions" style="margin-top:16px">'+["Run real bank report","Approve bank report","Submit regulatory return","Export official PDF"].map(x=>'<button class="btn" disabled title="Required authenticated bank service is not available">'+safe(x)+' · BLOCKED</button>').join("")+'</div>';
}
function panel(report){
 return '<div class="report-head"><div><span class="id">'+safe(report.id)+' · '+safe(report.code)+' · v0.1</span><h2>'+safe(report.title)+'</h2><p>'+safe(report.group)+' · '+safe(report.visual)+' · '+report.measures.length+' metrics · '+report.dimensions.length+' dimensions</p></div><span class="badge warn">NOT ACCEPTED</span></div><div class="tabs" role="tablist" aria-label="Report workbench"><button class="tab" data-tab="preview" role="tab" aria-selected="'+(state.tab==="preview")+'">Synthetic preview</button><button class="tab" data-tab="specification" role="tab" aria-selected="'+(state.tab==="specification")+'">Data contract</button><button class="tab" data-tab="controls" role="tab" aria-selected="'+(state.tab==="controls")+'">Access and controls</button></div>'+
 (state.tab==="preview"?preview(report):state.tab==="specification"?specification(report):controls(report));
}
function render(){
 const all=shown();
 if(!all.some(x=>x.id===state.reportId)&&all.length){state.reportId=all[0].id;state.filters={currency:"XAF",period:"ALL",branch:"ALL"};rerun(all[0]);}
 const report=all.find(x=>x.id===state.reportId)||all[0]||null;
 root.innerHTML='<div class="overlay '+(state.menu?"open":"")+'" data-action="close"></div><div class="shell"><aside class="rail '+(state.menu?"open":"")+'" aria-label="Reporting families"><div class="brand"><div class="brandmark">O</div><div><strong>OPES CORE</strong><small>Reporting intelligence</small></div></div><div class="navtitle">REPORT FAMILIES</div><nav class="domains"><button class="domain '+(state.group==="ALL"?"active":"")+'" data-group="ALL"><span>All reports</span><b>378</b></button>'+REPORT_GROUPS.map(([id,n,owner,name])=>'<button class="domain '+(state.group===id?"active":"")+'" data-group="'+safe(id)+'"><span>'+safe(name)+'</span><b>'+n+'</b></button>').join("")+'</nav><div class="railbottom">Training figures only. Official banking/regulatory reports disabled.</div></aside><div class="content"><header class="topbar"><button class="btn menu" data-action="menu">Menu</button><strong>Banking reporting studio</strong><span class="badge">378 report contracts</span><span class="spacer"></span><span class="badge warn">SYNTHETIC ONLY</span></header><main id="main" class="main"><span class="eyebrow">OPES Core Banking · Reporting phase</span><h1>Banking and management reports</h1><p class="desc">378 report definitions across 25 functional groups, with synthetic calculations, currency-safe aggregation, privacy suppression, drilldown and regulatory controls, and preview exports.</p><div class="notice"><strong>No real bank data.</strong><span>All figures are deterministic synthetic examples. Reporting, regulatory submissions and official PDF output require approved institution-scoped sources.</span></div><div class="quick-actions"><button class="btn primary" data-action="run">Run selected synthetic report</button><button class="btn" data-action="csv" '+(!state.result?"disabled":"")+'>CSV specimen</button><button class="btn" data-action="html" '+(!state.result?"disabled":"")+'>Print specimen</button></div><div class="metrics"><div class="metric"><small>Report definitions</small><strong>'+REPORT_SUMMARY.total+'</strong></div><div class="metric"><small>Functional families</small><strong>'+REPORT_SUMMARY.families+'</strong></div><div class="metric"><small>Implemented metric operators</small><strong>'+REPORT_SUMMARY.metricsDefined+'</strong></div><div class="metric"><small>Production-approved reports</small><strong>'+REPORT_SUMMARY.accepted+'</strong></div></div><div class="filterbar"><div class="input-group"><label for="report-search">Search reports</label><input id="report-search" type="search" placeholder="Trial balance, PAR30, teller…" value="'+safe(state.query)+'"></div><div class="input-group"><label for="group-select">Functional group</label><select id="group-select"><option value="ALL">All 25 groups</option>'+REPORT_GROUPS.map(([id,n,owner,name])=>'<option value="'+safe(id)+'"'+(state.group===id?" selected":"")+'>'+safe(name)+" ("+n+")"+'</option>').join("")+'</select></div><div class="input-group"><label for="kind-select">Report layout</label><select id="kind-select"><option value="ALL">All report types</option>'+classes.map(x=>'<option value="'+safe(x)+'"'+(state.kind===x?" selected":"")+'>'+safe(x)+'</option>').join("")+'</select></div></div><div class="workspace"><section class="card"><div class="sidehead"><h2>Report catalogue</h2><small>'+all.length+' matching</small></div><div class="report-list">'+(all.length?all.map(x=>'<button class="report-link '+(x.id===report?.id?"active":"")+'" data-report="'+safe(x.id)+'"><span>'+safe(x.id)+' · '+safe(x.visual)+'</span><strong>'+safe(x.title)+'</strong><small>'+safe(x.group)+' · '+x.measures.length+' measures</small></button>').join(""):'<div class="empty">No reports match the selected filters.</div>')+'</div></section><section class="card">'+(report?panel(report):'<div class="empty">Select a report type.</div>')+'</section></div></main><footer class="footer">Opesware Technologies · DRAFT report studio · CEMAC-specific mapping, verified financial data, maker-checker, regulator sign-off and final issuance pending.</footer></div></div><div class="toast" id="toast" role="status" hidden></div>';
 document.querySelector("#report-search")?.addEventListener("input",e=>{const caret=e.target.selectionStart;state.query=e.target.value;render();const input=document.querySelector("#report-search");input?.focus();if(caret!==null)input?.setSelectionRange(caret,caret);});
 document.querySelector("#group-select")?.addEventListener("change",e=>{state.group=e.target.value;render();});
 document.querySelector("#kind-select")?.addEventListener("change",e=>{state.kind=e.target.value;render();});
 document.querySelectorAll("[data-filter]").forEach(el=>el.addEventListener("change",e=>{state.filters[e.target.dataset.filter]=e.target.value;rerun(selected());render();}));
 const list=document.querySelector(".report-list"),active=list?.querySelector(".report-link.active");
 if(list&&active){const parentRect=list.getBoundingClientRect(),entryRect=active.getBoundingClientRect();
  if(entryRect.top<parentRect.top)list.scrollTop-=parentRect.top-entryRect.top+9;
  else if(entryRect.bottom>parentRect.bottom)list.scrollTop+=entryRect.bottom-parentRect.bottom+9;
 }

}
document.addEventListener("click",e=>{
 const el=e.target.closest("[data-action],[data-report],[data-group],[data-tab]");if(!el)return;
 if(el.dataset.report){select(el.dataset.report);return;}
 if(el.dataset.group){state.group=el.dataset.group;state.menu=false;render();return;}
 if(el.dataset.tab){state.tab=el.dataset.tab;render();return;}
 const action=el.dataset.action;
 if(action==="menu"||action==="close"){state.menu=action==="menu";render();return;}
 const report=selected();
 if(action==="run"){rerun(report);render();notice("Synthetic calculations refreshed. No bank API called.");return;}
 if(action==="clear-filters"){state.filters={currency:"XAF",period:"ALL",branch:"ALL"};rerun(report);render();return;}
 if(!state.result){notice("Run a synthetic report first");return;}
 if(action==="csv")download(report.id+"-SYNTHETIC.csv",csvReport(report,state.result),"text/csv;charset=utf-8");
 if(action==="json")download(report.id+"-SYNTHETIC.json",jsonReport(report,state.result),"application/json");
 if(action==="html")download(report.id+"-PRINT-SPECIMEN.html",printReportHtml(report,state.result),"text/html;charset=utf-8");
});
const first=location.hash.match(/^#\/report\/(RPT-[A-Z]+-\d{3})$/);
if(first&&REPORT_BY_ID.has(first[1]))state.reportId=first[1];
rerun(selected());
addEventListener("hashchange",()=>{const hit=location.hash.match(/^#\/report\/(RPT-[A-Z]+-\d{3})$/);if(hit&&REPORT_BY_ID.has(hit[1])&&hit[1]!==state.reportId){state.reportId=hit[1];state.group="ALL";state.kind="ALL";state.query="";state.tab="preview";state.filters={currency:"XAF",period:"ALL",branch:"ALL"};rerun(selected());render();}});
render();
