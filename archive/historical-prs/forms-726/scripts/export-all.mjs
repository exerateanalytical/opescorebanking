import {createHash} from "node:crypto";
import {mkdirSync,writeFileSync} from "node:fs";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
import {FORMS,FORM_STATISTICS} from "../src/form-registry.js";
const root=fileURLToPath(new URL("../dist/",import.meta.url));
const hashes=[],manifest=[],fields=[],rules=[],sections=[],actions=[];
const sha=content=>createHash("sha256").update(content).digest("hex");
function put(name,content){const dir=join(root,...name.split("/").slice(0,-1));mkdirSync(dir,{recursive:true});writeFileSync(join(root,name),content);hashes.push(sha(content)+"  "+name);}
function csv(name,cols,rows){const q=x=>{const value=String(x??"");return /[,"\n]/.test(value)?'"'+value.replaceAll('"','""')+'"':value;};put(name,cols.join(",")+"\n"+rows.map(row=>cols.map(key=>q(row[key])).join(",")).join("\n")+"\n");}
if(FORMS.length!==726)throw Error("726 form registry incomplete");
for(const f of FORMS){
 put("contracts/"+f.domain+"/"+f.id+".json",JSON.stringify(f,null,2)+"\n");
 manifest.push({id:f.id,screenId:f.screenId,domain:f.domain,name:f.name,mode:f.mode,fields:f.fields.length,sections:f.sections.length,validationRules:f.validationRules.length,conditions:f.conditionalRules.length,status:f.status,backendAccepted:false});
 for(const x of f.fields)fields.push({formId:f.id,id:x.id,label:x.label,type:x.type,section:x.section,required:x.required,sensitive:x.sensitive});
 for(const x of f.sections)sections.push({formId:f.id,id:x.id,name:x.name,fields:x.fields.length});
 for(const x of f.validationRules)rules.push({formId:f.id,id:x.id,severity:x.severity,operator:x.check.op,fields:x.fields.join("|")});
 for(const [id,a]of Object.entries(f.frontendActions))actions.push({formId:f.id,id,enabled:a.enabled,restriction:a.reason||a.lifetime||""});
}
const summary={...FORM_STATISTICS,generatedContracts:manifest.length,exportedFields:fields.length,validationRows:rules.length,sectionRows:sections.length,actionRows:actions.length,runStatus:"UI_FORM_DRAFTS_ONLY",authoritativeSubmissionEnabled:false,legalApproval:false};
put("manifest.json",JSON.stringify({summary,forms:manifest},null,2)+"\n");
csv("forms.csv",["id","screenId","domain","name","mode","fields","sections","validationRules","conditions","status","backendAccepted"],manifest);
csv("fields.csv",["formId","id","label","type","section","required","sensitive"],fields);
csv("validation-rules.csv",["formId","id","severity","operator","fields"],rules);
csv("sections.csv",["formId","id","name","fields"],sections);
csv("action-matrix.csv",["formId","id","enabled","restriction"],actions);
put("README.txt","OPES Core Banking 726-form client contract export\nAll specifications unapproved. Synthetic drafts only; no bank transactions.\nReference screen IDs preserved. Official financial actions BLOCKED.\n");
writeFileSync(join(root,"SHA256SUMS.txt"),hashes.join("\n")+"\n");
console.log(JSON.stringify(summary));
