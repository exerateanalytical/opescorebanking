import {createHash} from "node:crypto";
import {mkdirSync,writeFileSync} from "node:fs";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
import {REPORTS,REPORT_GROUP_COUNTS,REPORT_SUMMARY} from "../src/report-registry.js";
import {syntheticRows} from "../src/fixtures.js";
import {executeReport,csvReport,printReportHtml} from "../src/report-engine.js";
const root=fileURLToPath(new URL("../dist/",import.meta.url)),hashes=[],manifest=[],measures=[],filters=[],gates=[];
const digest=s=>createHash("sha256").update(s).digest("hex");
function put(path,data){
 mkdirSync(join(root,...path.split("/").slice(0,-1)),{recursive:true});
 writeFileSync(join(root,path),data);
 hashes.push(digest(data)+"  "+path);
 return {path,bytes:Buffer.byteLength(data),sha256:digest(data)};
}
const q=value=>{let str=String(value??"");if(/^\s*[=+@-]/.test(str)&&!/^[-]?[0-9]+(?:\.[0-9]+)?$/.test(str))str="'"+str;return /[,"\n]/.test(str)?'"'+str.replaceAll('"','""')+'"':str;};
function csv(path,columns,rows){put(path,columns.join(",")+"\n"+rows.map(row=>columns.map(k=>q(row[k])).join(",")).join("\n")+"\n");}
if(REPORTS.length!==378)throw Error("378 report register incomplete");
for(const r of REPORTS){
 const result=executeReport(r,syntheticRows(r),{currency:"XAF"});
 const spec=put("definitions/"+r.code+"/"+r.id+".json",JSON.stringify(r,null,2)+"\n");
 const sample=put("synthetic-csv/"+r.code+"/"+r.id+"-SYNTHETIC.csv",csvReport(r,result));
 const print=put("print-specimens/"+r.code+"/"+r.id+"-SYNTHETIC.html",printReportHtml(r,result));
 manifest.push({id:r.id,title:r.title,code:r.code,grain:r.grain,visual:r.visual,metricCount:r.measures.length,dimensionCount:r.dimensions.length,source:"SYNTHETIC_ONLY",accepted:false,reportSpec:spec,previewCsv:sample,printSpecimen:print});
 for(const m of r.measures)measures.push({reportId:r.id,metricId:m.id,label:m.label,unit:m.unit,formula:m.formula,sourceFields:m.sourceFields.join("|"),accepted:false});
 for(const f of r.allowedFilters)filters.push({reportId:r.id,filterId:f.id,type:f.type,label:f.label});
 for(const [gate,accepted]of Object.entries(r.acceptance))gates.push({reportId:r.id,gate,accepted});
}
const summary={...REPORT_SUMMARY,definitions:manifest.length,syntheticCsv:manifest.length,syntheticHtml:manifest.length,metricAssignments:measures.length,filterAssignments:filters.length,acceptanceGates:gates.length,acceptedReportCount:0,sourceStatus:"SYNTHETIC_ONLY",regulatorySubmissionEnabled:false};
put("manifest.json",JSON.stringify({summary,byDomain:REPORT_GROUP_COUNTS,reports:manifest},null,2)+"\n");
csv("report-register.csv",["id","title","code","grain","visual","metricCount","dimensionCount","source","accepted"],manifest);
csv("measure-contracts.csv",["reportId","metricId","label","unit","formula","sourceFields","accepted"],measures);
csv("filter-contracts.csv",["reportId","filterId","type","label"],filters);
csv("acceptance-matrix.csv",["reportId","gate","accepted"],gates);
put("README.txt","OPES Core Banking — 378 REPORT PROTOTYPES\nAll files are synthetic specimens; no bank financial data, accepted regulator filings or issued reports.\nSources, actual banking totals, regulatory mappings, RLS and formal sign-off not connected.\n");
writeFileSync(join(root,"SHA256SUMS.txt"),hashes.join("\n")+"\n");
console.log(JSON.stringify({...summary,sha256Entries:hashes.length}));
