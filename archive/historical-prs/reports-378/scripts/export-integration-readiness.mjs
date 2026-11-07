import {mkdir,writeFile} from "node:fs/promises";
import {join} from "node:path";
import {createHash} from "node:crypto";
import {createReportingCertificationRegister,reportingAcceptanceSummary}
  from "../src/report-certification-register.js";
const dest=new URL("../dist/integration-readiness/",import.meta.url);
await mkdir(dest,{recursive:true});
const register=createReportingCertificationRegister();
const summary=reportingAcceptanceSummary(register);
const audit=[];
for(const r of register){
  const data=JSON.stringify(r,null,2)+"\n";
  const filename=r.reportId+".json";
  await writeFile(new URL(filename,dest),data);
  audit.push([filename,createHash("sha256").update(data).digest("hex")]);
}
const csv=["report_id,domain,owner,required_gates,accepted_gates,production_status,official_issuance"];
for(const r of register)
  csv.push([r.reportId,r.domain,r.owner,r.requiredGateCount,r.acceptedGateCount,
    r.productionStatus,r.officialIssuanceEnabled].join(","));
await writeFile(new URL("acceptance-register.csv",dest),csv.join("\n")+"\n");
await writeFile(new URL("summary.json",dest),JSON.stringify(summary,null,2)+"\n");
await writeFile(new URL("SHA256SUMS.txt",dest),audit.map(([p,h])=>h+"  "+p).join("\n")+"\n");
if(register.length!==378||summary.groups!==25||summary.productionAccepted!==0||
   summary.requiredEvidenceRecords!==3780)
  throw Error("PRODUCTION_READINESS_REGISTER_DRIFT");
console.log("Generated",register.length,"blocked reports and",
  summary.requiredEvidenceRecords,"independent acceptance gates");
