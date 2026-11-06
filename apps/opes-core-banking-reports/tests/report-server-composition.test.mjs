import test from "node:test";
import assert from "node:assert/strict";
import {composeReportingSourcePreflight} from "../src/report-server-composition.js";
const report={id:"RPT-LED-001",code:"LED",version:"0.1.0-design",
  status:"DRAFT_NOT_ACCEPTED",approvedForProduction:false};
const reports=new Map([[report.id,report]]);
const audit=[];
const domainSources=new Map(
  ["LEDGER","DEPOSITS","PAYMENTS","CREDIT","TREASURY","CASH"]
    .map(sourceDomain=>[sourceDomain,{readSnapshot:async criteria=>({
      ...criteria,sourceDomain,snapshotId:"SNAP-1",
      sourceSystem:"LEDGER-SERVICE",mappingVersion:"MAP-001",
      immutable:true,reconciled:true,digest:"a".repeat(64)
    })}])
);
const base={
  reports,domainSources,
  authenticate:async()=>({subjectId:"SUB-1",verified:true}),
  authorize:async({principal})=>({allowPreflight:true,subjectId:principal.subjectId,
    institutionId:"BANK-A",branchIds:["BR-A"]}),
  verifyProvenance:async()=>({signatureValid:true,digestMatches:true,
    sourceApproved:true,mappingApproved:true,lineageComplete:true}),
  mappingGate:async()=>({status:"MAPPING_EVIDENCE_ONLY",
    financialPublicationEnabled:false,officialFilingEnabled:false}),
  recordAudit:async e=>audit.push(e)
};
const args={reportId:report.id,period:"2026-11",currency:"XAF"};
test("Composition enforces all configured trusted adapters and blocks publication",async()=>{
  const app=composeReportingSourcePreflight(base);
  const out=await app.inspect(args);
  assert.equal(out.status,"BLOCKED");
  assert.equal(app.liveReportingEnabled,false);
  assert.equal(out.productionEnabled,false);
  assert.equal(audit.at(-1).outcome,"BLOCKED");
});
test("Missing authentication or mapping authority prevents composition",()=>{
  assert.throws(()=>composeReportingSourcePreflight({...base,mappingGate:null}),
    /REPORT_COMPOSITION_INCOMPLETE/);
  assert.throws(()=>composeReportingSourcePreflight({...base,domainSources:new Map()}),
    /CONNECTORS_NOT_CONFIGURED/);
});
test("Mapping rejection or incomplete provenance fails closed and auditable",async()=>{
  const denied=composeReportingSourcePreflight({...base,mappingGate:async()=>({
    status:"PENDING",financialPublicationEnabled:false,officialFilingEnabled:false
  })});
  await assert.rejects(denied.inspect(args),/SOURCE_UNAVAILABLE/);
  const noProof=composeReportingSourcePreflight({...base,verifyProvenance:async()=>({
    signatureValid:true,digestMatches:false,mappingApproved:true,
    sourceApproved:true,lineageComplete:true
  })});
  await assert.rejects(noProof.inspect(args),/SOURCE_NOT_VERIFIED/);
});
