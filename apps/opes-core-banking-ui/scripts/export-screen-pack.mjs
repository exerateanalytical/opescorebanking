import {mkdirSync,writeFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
import {SCREENS} from "../src/catalog.js";
import {SCREEN_BLUEPRINTS,SCREEN_BLUEPRINTS_COUNT} from "../src/all-screen-blueprints.js";

const root=fileURLToPath(new URL("../dist/",import.meta.url));
const manifest=[];
const digests=[];
const checksum=text=>createHash("sha256").update(text).digest("hex");
if(SCREEN_BLUEPRINTS_COUNT!==726||SCREENS.length!==726)throw Error("Unexpected screen total");
for(const screen of SCREENS){
 const spec=SCREEN_BLUEPRINTS[screen.id];
 if(!spec)throw Error("Missing contract "+screen.id);
 mkdirSync(join(root,"definitions",screen.domain),{recursive:true});
 const relative="definitions/"+screen.domain+"/"+screen.id+".json";
 const payload=JSON.stringify(spec,null,2)+"\n";
 writeFileSync(join(root,relative),payload);
 digests.push(checksum(payload)+"  "+relative);
 manifest.push({id:screen.id,domain:screen.domain,title:screen.name,kind:spec.kind,route:"#/screen/"+screen.id,fields:spec.fields.length,requiredFields:spec.requiredFields.length,workflowStages:spec.phases.length,actionCount:Object.keys(spec.actions).length,captureAllowed:spec.captureAllowed,source:spec.source,acceptance:"NOT_ACCEPTED",bankApiConnected:false,uiRendered:true,documentTemplatesBuilt:false});
}
const domains=[...new Set(manifest.map(s=>s.domain))].sort();
const counts=Object.fromEntries(domains.map(d=>[d,manifest.filter(s=>s.domain===d).length]));
const summary={product:"OPES Core Banking",date:"2026-11-05",screenCount:manifest.length,domainCount:domains.length,domainCounts:counts,state:"UI_ROUTE_RENDERED_DRAFT_UNVERIFIED",warning:"Screen UI designs only; no production banking workflows certified.",backendBindingsAccepted:0,productionTransactionButtonsEnabled:0,perScreenJsonCount:manifest.length,manifest,issues:["Requirements and legal texts are not verified for each individual screen","Bank authorization, maker-checker, transaction and ledger APIs are unconnected","Field schemas are proposed and require owner review","Manual accessibility and bilingual visual acceptance pending"]};
const manifestText=JSON.stringify(summary,null,2)+"\n";
writeFileSync(join(root,"screen-manifest.json"),manifestText);
digests.push(checksum(manifestText)+"  screen-manifest.json");
const columns=["id","domain","route","title","kind","fields","requiredFields","workflowStages","actionCount","captureAllowed","acceptance","bankApiConnected"];
const escapeCsv=value=>{const v=String(value);return /[,\n"]/.test(v)?'"'+v.replaceAll('"','""')+'"':v};
const csv=columns.join(",")+"\n"+manifest.map(s=>columns.map(k=>escapeCsv(s[k])).join(",")).join("\n")+"\n";
writeFileSync(join(root,"screen-register-export.csv"),csv);
digests.push(checksum(csv)+"  screen-register-export.csv");
const emitCsv=(name,columns,records)=>{
 const payload=columns.join(",")+"\n"+records.map(row=>columns.map(key=>escapeCsv(row[key]??"")).join(",")).join("\n")+"\n";
 writeFileSync(join(root,name),payload);
 digests.push(checksum(payload)+"  "+name);
};
const actionRows=[],fieldRows=[],stateRows=[],tabRows=[],phaseRows=[];
for(const s of SCREENS){
 const c=SCREEN_BLUEPRINTS[s.id];
 for(const [actionId,a] of Object.entries(c.actions))actionRows.push({screen_id:s.id,domain:s.domain,action_id:actionId,label:a.label,disposition:a.state,bank_backed:false});
 for(const f of c.fields)fieldRows.push({screen_id:s.id,domain:s.domain,field_id:f.id,label:f.label,type:f.type,group:f.group,required:f.required,source:c.fieldSource,approved:false});
 for(const state of c.stateList)stateRows.push({screen_id:s.id,state,mode:"LOCAL_VISUAL_PREVIEW",business_complete:false});
 for(const [i,tab] of c.tabs.entries())tabRows.push({screen_id:s.id,tab_order:i+1,tab_id:tab,status:"UI_NAVIGATION_IMPLEMENTED",business_validated:false});
 for(const p of c.phases)phaseRows.push({screen_id:s.id,phase:p.id,title:p.title,description:p.description,status:p.status});
}
if(actionRows.length!==7986||stateRows.length!==10164||tabRows.length!==2904||phaseRows.length!==2904)throw Error("Coverage count mismatch");
emitCsv("SCREEN_ACTION_MATRIX_7986.csv",["screen_id","domain","action_id","label","disposition","bank_backed"],actionRows);
emitCsv("SCREEN_FIELD_MATRIX.csv",["screen_id","domain","field_id","label","type","group","required","source","approved"],fieldRows);
emitCsv("SCREEN_STATE_MATRIX_10164.csv",["screen_id","state","mode","business_complete"],stateRows);
emitCsv("SCREEN_TAB_MATRIX_2904.csv",["screen_id","tab_order","tab_id","status","business_validated"],tabRows);
emitCsv("SCREEN_WORKFLOW_STAGE_MATRIX_2904.csv",["screen_id","phase","title","description","status"],phaseRows);
const coverage={screenCount:manifest.length,actionCount:actionRows.length,fieldCount:fieldRows.length,stateCount:stateRows.length,tabCount:tabRows.length,workflowStageCount:phaseRows.length,productionActionsEnabled:0,businessWorkflowsAccepted:0,state:"CLIENT_UI_COVERAGE_ONLY"};
const coverageText=JSON.stringify(coverage,null,2)+"\n";writeFileSync(join(root,"CONTROL_COVERAGE.json"),coverageText);
digests.push(checksum(coverageText)+"  CONTROL_COVERAGE.json");

writeFileSync(join(root,"SHA256SUMS.txt"),digests.join("\n")+"\n");
writeFileSync(join(root,"README.txt"),["OPES Core Banking — 726-screen client UI definition export","One distinct JSON file per screen in definitions/<DOMAIN>/<ID>.json","Executable web app is in ../index.html","All banking APIs and production transactions are NOT connected","All specifications are PROPOSED and NOT_ACCEPTED"].join("\n")+"\n");
console.log("Generated",manifest.length,"individual screen JSON contracts across",domains.length,"domains");
