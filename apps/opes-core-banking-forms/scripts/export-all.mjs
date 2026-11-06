import {createHash} from "node:crypto";
import {mkdirSync,writeFileSync} from "node:fs";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
import {FORMS,FORM_DELIVERY,FORM_COUNTS} from "../src/forms.js";
import {syntheticExample} from "../src/validation.js";
const root=fileURLToPath(new URL("../dist/",import.meta.url));
const hashes=[],manifest=[];
const hash=s=>createHash("sha256").update(s).digest("hex");
function save(relative,text){
 const path=join(root,relative);
 mkdirSync(join(root,...relative.split("/").slice(0,-1)),{recursive:true});
 writeFileSync(path,text);
 hashes.push(hash(text)+"  "+relative);
 return {path:relative,size:Buffer.byteLength(text),sha256:hash(text)};
}
const csv=v=>{const s=String(v??"");return /[,\"\n]/.test(s)?'"'+s.replaceAll('"','""')+'"':s;};
const table=(name,headers,records)=>{
 const text=headers.join(",")+"\n"+records.map(r=>headers.map(h=>csv(r[h])).join(",")).join("\n")+"\n";
 save(name,text);
};
const actions=[],fields=[],repeaterRows=[],states=[],workflow=[],crosswalk=[];
if(FORMS.length!==589)throw Error("Unexpected form count");
for(const f of FORMS){
 const path="specifications/"+f.code+"/"+f.id+".json";
 const json=JSON.stringify(f,null,2)+"\n";
 const artifact=save(path,json);
 manifest.push({id:f.id,code:f.code,name:f.name,variant:f.variant,status:f.status,fields:f.fields.length,
  repeaters:f.repeaters.length,screenCrosswalk:f.screenCrosswalk,accepted:false,bankApi:false,artifact});
 for(const [action,state]of Object.entries(f.controls))actions.push({formId:f.id,action,disposition:state,bankSideConnected:false});
 for(const input of f.fields)fields.push({formId:f.id,fieldId:input.id,label:input.label,type:input.type,section:input.section,required:input.required,conditional:!!input.visibleIf,approved:false});
 for(const rep of f.repeaters){
  for(const input of rep.fields)repeaterRows.push({formId:f.id,group:rep.id,fieldId:input.id,label:input.label,type:input.type,minRows:rep.minRows,maxRows:rep.maxRows,approved:false});
 }
 for(const step of f.workflow.states)workflow.push({formId:f.id,state:step.id,description:step.description,executed:false});
 for(const s of [...f.workflow.exceptionStates])states.push({formId:f.id,state:s,engineConnected:false});
 crosswalk.push({formId:f.id,ownerDomain:f.ownerDomain,screenId:f.relatedScreenId||"",screenMapping:f.screenCrosswalk,documentTemplateId:"",approved:false});
}
table("form-register.csv",["id","code","name","variant","status","fields","repeaters","screenCrosswalk","accepted","bankApi"],manifest);
table("form-actions.csv",["formId","action","disposition","bankSideConnected"],actions);
table("form-fields.csv",["formId","fieldId","label","type","section","required","conditional","approved"],fields);
table("repeater-fields.csv",["formId","group","fieldId","label","type","minRows","maxRows","approved"],repeaterRows);
table("workflow-states.csv",["formId","state","description","executed"],workflow);
table("exception-states.csv",["formId","state","engineConnected"],states);
table("screen-document-crosswalk.csv",["formId","ownerDomain","screenId","screenMapping","documentTemplateId","approved"],crosswalk);
const report={createdAt:"2026-11-06",scope:"SYNTHETIC_CLIENT_ONLY",proposedForms:FORMS.length,domains:Object.keys(FORM_COUNTS).length,
  byDomain:FORM_COUNTS,fieldPlacements:fields.length,repeatedFieldDefinitions:repeaterRows.length,
  controls:actions.length,workflowStages:workflow.length,exceptionStates:states.length,
  physicallyVerifiedSourceFiles:FORMS.length,acceptance:{business:0,regulatory:0,serverBound:0,productionTransactions:0},
  knownGaps:["Planning total not an approved canonical form denominator","Only 339 base business tasks; variant contracts share a rules engine",
   "Exact screen ID and printable document crosswalk pending verification","Real API schemas, server-side validation, tenant scope, SoD, outbox, ledger and rail conformance not connected",
   "Effective legal CEMAC rule versions, French translations and all product-specific fields require approval",
   "No production data, official document issuance, signature, storage or financial transaction"]};
save("manifest.json",JSON.stringify({report,forms:manifest},null,2)+"\n");
save("coverage.json",JSON.stringify(report,null,2)+"\n");
save("README.txt",[
 "OPES CORE BANKING 589-FORM PROTOTYPE PACKAGE",
 "589 unique proposed form contracts; not production-ready banking workflows.",
 "Forms are synthetic session-only previews; financial actions blocked.",
 "No real customer data permitted, no server API, no trusted principal, no persisted drafts.",
 "Individual form spec JSON lives in specifications/<GROUP>/<FRM-ID>.json.",
 "Form register, field/action/state matrices and SHA-256 hashes included.",
 "Integration with 726-screen and 407-document branches requires approved ID mapping.",
].join("\n")+"\n");
writeFileSync(join(root,"SHA256SUMS.txt"),hashes.join("\n")+"\n");
console.log(JSON.stringify(report));
