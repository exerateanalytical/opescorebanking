import {SCREENS,DOMAIN_FIELDS,DOMAIN_LABELS,SCREEN_BASELINE} from "./registries/screen-catalog";
import {TEMPLATE_GROUPS} from "./registries/document-seeds";
import {REPORT_GROUPS} from "./registries/report-seeds";
export type Item={id:string;domain:string;title:string;group:string};
export type Screen={id:string;domain:string;name:string;kind:string;source:string};
type Group=readonly [string,number,string,string,string];
export const screens:readonly Screen[]=SCREENS as readonly Screen[];
export const labels=DOMAIN_LABELS as Record<string,string>;
export const domainFields=DOMAIN_FIELDS as unknown as Record<string,unknown[][]>;
function items(groups:readonly Group[],kind:string):readonly Item[]{
 const results:Item[]=[];
 for(const [id,total,domain,group,names] of groups){
  const titles=names.split(";").map(s=>s.trim()).filter(Boolean);
  if(titles.length!==total)throw new Error("Source count mismatch "+id);
  titles.forEach((title,i)=>results.push({id:kind+"-"+id+"-"+String(i+1).padStart(3,"0"),domain,title,group}));
 }
 if(new Set(results.map(x=>x.id)).size!==results.length)throw new Error("Duplicate registry IDs");
 return results;
}
export const documents=items(TEMPLATE_GROUPS as unknown as readonly Group[],"DOC");
export const reports=items(REPORT_GROUPS as unknown as readonly Group[],"RPT");
if(screens.length!==726||documents.length!==407||reports.length!==378||
 SCREEN_BASELINE.state!=="UI_ROUTE_SCAFFOLD_NOT_PRODUCTION")
 throw new Error("Source registry changed without approval");
export const byScreen=new Map(screens.map(x=>[x.id,x]));
export const byDocument=new Map(documents.map(x=>[x.id,x]));
export const byReport=new Map(reports.map(x=>[x.id,x]));

import manifests from "./generated/full-manifest.json";
export type SourceField={id:string;label:string;type:string;required?:boolean;options?:string[];section?:string;group?:string};
export type FormContract={id:string;screenId:string;domain:string;name:string;mode:string;fields:SourceField[];validationRules:unknown[];conditionalRules:unknown[];approvedForProduction:boolean};
export type Blueprint={id:string;fields:SourceField[];status:string};
export type DocumentDefinition={id:string;name:string;fields:SourceField[];family:string;approvedForProduction:boolean};
export type ReportDefinition={id:string;title:string;allowedFilters:SourceField[];measures:{id:string;label?:string}[];approvedForProduction:boolean};
const migrated=manifests as unknown as {
  operationalBankingEnabled:boolean;
  counts:{screens:number;forms:number;documents:number;reports:number};
  blueprints:Record<string,Blueprint>;
  forms:FormContract[];templates:DocumentDefinition[];reports:ReportDefinition[];
};
if(migrated.operationalBankingEnabled || migrated.forms.length!==726 ||
 migrated.templates.length!==407 || migrated.reports.length!==378 ||
 Object.keys(migrated.blueprints).length!==726)
 throw new Error("Unreviewed frontend source manifest");
export const formContracts:readonly FormContract[]=migrated.forms;
export const screenBlueprints:Readonly<Record<string,Blueprint>>=migrated.blueprints;
export const templateContracts:readonly DocumentDefinition[]=migrated.templates;
export const reportContracts:readonly ReportDefinition[]=migrated.reports;
export const formById=new Map(formContracts.map(f=>[f.id,f]));
export const templateById=new Map(templateContracts.map(t=>[t.id,t]));
export const reportContractById=new Map(reportContracts.map(r=>[r.id,r]));
