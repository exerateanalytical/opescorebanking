/**
 * Deterministic reporting engine that fails closed for any non-demo source.
 * Does not compute TEG, risk weighted assets, official prudential ratios,
 * capital adequacy, interest, tax, statutory deductions or verified balances.
 */
const MONEY_FIELDS=["amountMinor","expectedMinor","actualMinor","debitMinor","creditMinor"];
const isMinor=(v)=>Number.isSafeInteger(v)&&v>=0;
const asBigInt=(v)=>BigInt(v);
const pct=(n,d)=>d===0n?null:Number(n*10000n/d)/100;
const countRows=rows=>BigInt(rows.length);
const sum=(rows,key)=>rows.reduce((a,r)=>a+asBigInt(r[key]),0n);
const filterKeys=new Set(["period","branch","product","status","currency","channel","rail","riskBand","segment","minDaysPastDue"]);
const DIMENSIONS=new Set(["period","branch","product","status","currency","channel","rail","riskBand","segment"]);
function metricsFor(rows){
 const len=countRows(rows);
 const total=sum(rows,"amountMinor");
 const overdue=rows.filter(r=>r.daysPastDue>0).length;
 const statuses={};
 for(const r of rows)statuses[r.status]=(statuses[r.status]||0)+1;
 const risky=days=>sum(rows.filter(r=>r.daysPastDue>=days),"amountMinor");
 const results={
  RECORD_COUNT:rows.length,
  TOTAL_AMOUNT_MINOR:total.toString(),
  AVERAGE_AMOUNT_MINOR:len===0n?null:(total/len).toString(),
  NET_DIFFERENCE_MINOR:(sum(rows,"actualMinor")-sum(rows,"expectedMinor")).toString(),
  DEBIT_CREDIT_DIFFERENCE_MINOR:(sum(rows,"debitMinor")-sum(rows,"creditMinor")).toString(),
  EXCEPTION_COUNT:rows.filter(r=>r.exceptionFlag).length,
  PENDING_COUNT:statuses.PENDING||0,
  FAILURE_RATE:pct(BigInt(statuses.FAILED||0),len),
  COMPLETION_RATE:pct(BigInt(statuses.COMPLETED||0),len),
  COVERAGE_RATE:pct(BigInt(rows.filter(r=>r.hasEvidence).length),len),
  OVERDUE_COUNT:overdue,
  PAR30:pct(risky(30),total),
  PAR60:pct(risky(60),total),
  PAR90:pct(risky(90),total)
 };
 return results;
}
function verify(report,rows,filters){
 if(!report||!report.id||report.approvedForProduction!==false)throw Error("Unknown or non-prototype report");
 if(!Array.isArray(rows))throw Error("Reporting data must be an array");
 if(rows.length>10000)throw Error("Prototype max 10000 synthetic rows");
 if(!filters||typeof filters!=="object"||Array.isArray(filters))throw Error("Invalid filter object");
 for(const key of Object.keys(filters))if(!filterKeys.has(key))throw Error("Unapproved report filter "+key);
 for(const r of rows){
  if(r.bankId!=="DEMO-BANK"||r.recordSource!=="SYNTHETIC_ONLY"||!String(r.recordId||"").startsWith("DEMO-"))throw Error("Non-synthetic or cross-bank data prohibited");
  for(const key of MONEY_FIELDS)if(!isMinor(r[key]))throw Error("Unsafe monetary value "+key);
  if(!Number.isSafeInteger(r.daysPastDue)||r.daysPastDue<0||r.daysPastDue>10000)throw Error("Invalid overdue classification");
  for(const key of DIMENSIONS)if(typeof r[key]!=="string"||!r[key].trim())throw Error("Invalid grouping dimension "+key);
  if(typeof r.exceptionFlag!=="boolean"||typeof r.hasEvidence!=="boolean")throw Error("Missing evidence flags");
 }
 const ids=new Set();
 for(const r of rows){if(ids.has(r.recordId))throw Error("Duplicate report row ID");ids.add(r.recordId);}
}
function subset(rows,filters){
 return rows.filter(r=>{
  for(const [key,value]of Object.entries(filters)){
   if(value===null||value===undefined||value===""||value==="ALL")continue;
   if(key==="minDaysPastDue"){
    if(!/^(0|[1-9][0-9]*)$/.test(String(value))||Number(value)>10000)throw Error("Invalid days-past-due filter");
    if(r.daysPastDue<Number(value))return false;
   }else if(r[key]!==value)return false;
  }
  return true;
 });
}
const suppressed=(value,size)=>({dimensionValue:String(value),count:size,suppressed:true,metrics:null});
export function executeReport(report,records,filters={currency:"XAF"},opts={}){
 verify(report,records,filters);
 if(opts.authoritative===true||opts.sourceMode&&opts.sourceMode!=="synthetic")throw Error("No trusted bank query engine is connected");
 const selected=subset(records,filters);
 const currencies=[...new Set(selected.map(x=>x.currency))];
 const monetary=report.measures.some(m=>m.unit==="minor"||/PAR\d+/.test(m.id));
 const groupBy=opts.groupBy||report.grain;
 if(!DIMENSIONS.has(groupBy)||!report.dimensions.includes(groupBy)&&groupBy!==report.grain)throw Error("Unsupported group by dimension");
 if(currencies.length>1&&monetary&&groupBy!=="currency")throw Error("Mixed currencies cannot be summed; apply currency filter");
 const buckets=new Map();
 for(const row of selected){
  const key=row[groupBy];
  if(!buckets.has(key))buckets.set(key,[]);
  buckets.get(key).push(row);
 }
 const threshold=report.privacy.suppressSmallGroupThreshold;
 const rows=[...buckets.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([key,list])=>{
  if(list.length<threshold)return suppressed(key,list.length);
  const metricSet=metricsFor(list);
  return {dimensionValue:key,count:list.length,suppressed:false,metrics:Object.fromEntries(report.measures.map(m=>[m.id,metricSet[m.id]]))};
 });
 // Sum across different currencies is only safe when they have been explicitly
 // selected individually; a by-currency table may not publish a total amount.
 const totals=currencies.length>1?null:Object.fromEntries(report.measures.map(m=>[m.id,metricsFor(selected)[m.id]]));
 const issues=[];
 if(rows.some(r=>r.suppressed))issues.push("Rows with fewer than "+threshold+" observations suppressed for confidentiality");
 if(currencies.length>1)issues.push("No aggregate monetary total across currencies");
 if(!selected.length)issues.push("No synthetic observations match the selected filters");
 return {reportId:report.id,source:"SYNTHETIC_ONLY",institution:"DEMO-BANK",asOf:"DEMO-SNAPSHOT-2026-11",accepted:false,
  filters:{...filters},groupBy,currency:currencies.length===1?currencies[0]:"MULTI_CURRENCY",recordCount:selected.length,
  rows,totals,issues,sourceRowsScanned:records.length,confidentiality:report.privacy.classification,
  warning:"SYNTHETIC REPORT ONLY — NOT AN OFFICIAL BANK OR REGULATORY OUTPUT"};
}
export function formatMetric(value,metric,currency="XAF"){
 if(value===null||value===undefined)return "N/A";
 if(metric.unit==="percent")return Number(value).toLocaleString("en-US",{maximumFractionDigits:2})+"%";
 if(metric.unit==="minor"){
  const str=String(value);
  if(!/^-?\d+$/.test(str))return "INVALID";
  return BigInt(str).toLocaleString("en-US")+" "+currency+" (minor)";
 }
 return Number(value).toLocaleString("en-US",{maximumFractionDigits:0});
}
export function csvReport(report,result){
 if(result?.source!=="SYNTHETIC_ONLY"||result?.reportId!==report.id)throw Error("Only synthetic reports can export");
 const cols=["Group","Observations",...report.measures.map(m=>m.label)];
 const q=value=>{const s=String(value??"");return /[,"\n]/.test(s)?'"'+s.replaceAll('"','""')+'"':s};
 const output=[["SYNTHETIC SPECIMEN — NOT A BANK/REGULATORY REPORT"],["Report",report.id,report.title],["Snapshot",result.asOf],cols];
 for(const row of result.rows)output.push([row.dimensionValue,row.count,...report.measures.map(m=>row.suppressed?"SUPPRESSED":row.metrics[m.id]??"N/A")]);
 return output.map(row=>row.map(q).join(",")).join("\n")+"\n";
}
export function jsonReport(report,result){
 if(result?.reportId!==report.id||result?.source!=="SYNTHETIC_ONLY")throw Error("Synthetic report mismatch");
 return JSON.stringify({specification:report,result},null,2)+"\n";
}
const h=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export function printReportHtml(report,result){
 if(result?.reportId!==report.id||result?.source!=="SYNTHETIC_ONLY")throw Error("No verified report output");
 const cols=["Grouping","Observations",...report.measures.map(m=>m.label)];
 const body=result.rows.map(row=>'<tr><td>'+h(row.dimensionValue)+'</td><td class="num">'+h(row.count)+'</td>'+report.measures.map(m=>'<td class="num">'+h(row.suppressed?"SUPPRESSED":formatMetric(row.metrics[m.id],m,result.currency))+'</td>').join("")+'</tr>').join("");
 return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+h(report.id)+" "+h(report.title)+'</title><style>@page{size:A4 landscape;margin:15mm}body{font-family:Arial,sans-serif;color:#152940;font-size:11px}header{border-bottom:3px solid #193B5C;padding-bottom:15px}h1{font-size:23px}small{color:#55687A}table{border-collapse:collapse;width:100%;margin-top:20px;page-break-inside:auto}th,td{border:1px solid #CED6DF;padding:8px;overflow-wrap:anywhere}th{background:#F1F5F8;text-align:left}tr{page-break-inside:avoid}.num{text-align:right;font-variant-numeric:tabular-nums}.warn{background:#FFF1F1;color:#81272F;border:1px solid #B55D60;padding:12px;margin:14px 0;font-weight:bold}.watermark{position:fixed;top:5mm;right:12mm;font-size:12px;letter-spacing:1px;font-weight:bold;color:#A52D36;border:1px solid #A52D36;padding:6px}footer{margin-top:19px;border-top:2px solid #193B5C;padding:11px;font-size:10px;color:#536477}</style></head><body><span class="watermark">SPECIMEN · NOT VALID</span><header><small>OPES CORE BANKING · REPORT DESIGN · '+h(report.code)+'</small><h1>'+h(report.title)+'</h1><small>'+h(report.id)+' · '+h(result.asOf)+' · '+h(result.currency)+'</small></header><div class="warn">SYNTHETIC REPORT — NOT AN OFFICIAL FINANCIAL, ACCOUNTING OR REGULATORY STATEMENT. No authorized bank API, auditor approval or government filing.</div><table><thead><tr>'+cols.map(x=>'<th>'+h(x)+'</th>').join("")+'</tr></thead><tbody>'+body+'</tbody></table><footer>Data source: DEMO-BANK synthetic fixture · Rows suppressed below 5 observations · Issue and submission prohibited</footer></body></html>';
}
