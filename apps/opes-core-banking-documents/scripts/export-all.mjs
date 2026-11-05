import {createHash} from "node:crypto";
import {mkdirSync,writeFileSync} from "node:fs";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
import {TEMPLATES,TEMPLATE_GROUP_COUNTS,TEMPLATE_FAMILIES} from "../src/templates.js";
import {renderDocumentHtml,demoData} from "../src/render.js";
const root=fileURLToPath(new URL("../dist/",import.meta.url));
const sha256=bytes=>createHash("sha256").update(bytes).digest("hex");
const manifest=[],hashes=[];
const csvEscape=v=>{const s=String(v??"");return/[",\n]/.test(s)?'"'+s.replaceAll('"','""')+'"':s};
function save(relative,contents){
 mkdirSync(join(root,...relative.split("/").slice(0,-1)),{recursive:true});
 writeFileSync(join(root,relative),contents);
 const hash=sha256(contents);
 hashes.push(hash+"  "+relative);
 return {relative,size:Buffer.byteLength(contents),sha256:hash};
}
if(TEMPLATES.length!==407)throw Error("Expected 407 document designs");
for(const template of TEMPLATES){
 const html=renderDocumentHtml(template,demoData(template));
 const schema=JSON.stringify(template,null,2)+"\n";
 const htmlFile=save("printable/"+template.code+"/"+template.id+".html",html);
 const jsonFile=save("schemas/"+template.code+"/"+template.id+".json",schema);
 manifest.push({id:template.id,name:template.name,domain:template.code,owner:template.screenDomain,layout:template.layout.paper,
  family:template.family,status:template.status,productionApproved:false,legalApproved:false,fieldCount:template.fields.length,
  htmlFile,jsonFile});
}
const count={total:manifest.length,groups:Object.keys(TEMPLATE_GROUP_COUNTS).length,byDomain:TEMPLATE_GROUP_COUNTS,
  families:TEMPLATE_FAMILIES,html:manifest.length,json:manifest.length,productionApproved:0,issuerBackend:"NOT_CONNECTED",
  warning:"Specimens only; no legal, regulator, or bank-side approval. English only; French translation pending."};
save("manifest.json",JSON.stringify({summary:count,documents:manifest},null,2)+"\n");
const cols=["id","name","domain","owner","layout","family","status","fieldCount","productionApproved"];
save("template-register.csv",cols.join(",")+"\n"+manifest.map(row=>cols.map(key=>csvEscape(row[key])).join(",")).join("\n")+"\n");
save("CONTROLS.md",[
"# OPES Core Banking — 407 Document Print Specimens",
"",
"407 named document templates; 407 portable HTML print files and 407 JSON field contracts.",
"Each file is DRAFT, unapproved and visibly marked SPECIMEN · NOT VALID.",
"No live bank API, verified ledger, independent approval, lawful signature, trust QR, seal or legal issuance.",
"CEMAC consumer rules, TEG disclosures, sector-specific accounting, tax and payroll must be validated.",
"French translations and institution-specific retention policy remain incomplete.",
"Bank/microfinance accounting must use applicable sector-specific supervision, not assumed SYSCOHADA.",
].join("\n")+"\n");
save("EXPORT_SUMMARY.json",JSON.stringify(count,null,2)+"\n");
writeFileSync(join(root,"SHA256SUMS.txt"),hashes.join("\n")+"\n");
console.log(JSON.stringify({exported:manifest.length,portableHtml:manifest.length,jsonContracts:manifest.length,
sha256Entries:hashes.length,groups:count.groups,families:count.families.length}));
