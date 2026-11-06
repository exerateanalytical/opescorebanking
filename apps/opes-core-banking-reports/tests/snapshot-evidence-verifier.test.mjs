import test from "node:test";
import assert from "node:assert/strict";
import {generateKeyPairSync,sign} from "node:crypto";
import {canonicalSnapshotManifest,createSnapshotEvidenceVerifier} from "../src/snapshot-evidence-verifier.js";
import {createReportSourcePreflight} from "../src/report-source-preflight.js";
const {publicKey,privateKey}=generateKeyPairSync("ed25519");
const pem=publicKey.export({format:"pem",type:"spki"});
const report={id:"RPT-LED-001",version:"0.1.0-design",
  status:"DRAFT_NOT_ACCEPTED",approvedForProduction:false};
const criteria={reportId:report.id,reportVersion:report.version,
  institutionId:"BANK-A",branchIds:["BR-A","BR-B"],period:"2026-11",currency:"XAF"};
const original={
  snapshotId:"SNAP-001",reportId:report.id,reportVersion:report.version,
  institutionId:"BANK-A",branchIds:["BR-A","BR-B"],period:"2026-11",currency:"XAF",
  sourceSystem:"LEDGER-SERVICE",sourceRevision:"REV-001",
  mappingVersion:"MAP-001",reconciliationRef:"REC-001",
  digest:"4".repeat(64),immutable:true,reconciled:true,keyId:"KEY-001"
};
const signed=v=>({...v,signature:sign(null,canonicalSnapshotManifest(v),privateKey).toString("base64url")});
const approvals=new Map([["MAP-001",{institutionId:"BANK-A",reportId:report.id,
  reportVersion:report.version,sourceSystem:"LEDGER-SERVICE",approved:true}]]);
const keys=new Map([["KEY-001",{publicKey:pem,institutionId:"BANK-A",
  sourceSystem:"LEDGER-SERVICE",enabled:true}]]);
const verifier=(changes={})=>createSnapshotEvidenceVerifier({
  trustedKeys:keys,approvedMappings:approvals,
  verifyDigest:async()=>true,verifyLineage:async()=>true,...changes
});
const envelope=signed(original);
test("Manifest serialization is deterministic and excludes live source rows",()=>{
  const a=canonicalSnapshotManifest({...original,rows:[{customer:"SECRET"}]});
  const b=canonicalSnapshotManifest(original);
  assert.deepEqual(a,b);
  assert.ok(!a.toString().includes("SECRET"));
});
test("Ed25519 detached signature, approved mapping, digest and lineage all required",async()=>{
  const result=await verifier()({snapshot:envelope,criteria,report});
  assert.deepEqual(result,{
    signatureValid:true,digestMatches:true,sourceApproved:true,
    mappingApproved:true,lineageComplete:true
  });
});
test("Tampering source, institution, branch, currency, mapping or signature fails",async()=>{
  for(const change of [
    {institutionId:"BANK-B"},{branchIds:["BR-A","BR-C"]},
    {currency:"EUR"},{sourceRevision:"REV-002"},
    {mappingVersion:"MAP-002"},{digest:"5".repeat(64)},
    {signature:"A".repeat(100)}
  ]) {
    const proof=await verifier()({snapshot:{...envelope,...change},criteria,report});
    assert.equal(proof.signatureValid,false);
    assert.equal(proof.lineageComplete,false);
  }
});
test("Unknown signer, bank-scoped key mismatch and disabled source fail",async()=>{
  const alternate = signed({...original,keyId:"KEY-002"});
  assert.equal((await verifier()({snapshot:alternate,criteria,report})).signatureValid,false);
  const wrongKeys=new Map([["KEY-001",{publicKey:pem,institutionId:"BANK-B",
    sourceSystem:"LEDGER-SERVICE",enabled:true}]]);
  assert.equal((await verifier({trustedKeys:wrongKeys})({snapshot:envelope,criteria,report})).signatureValid,false);
  const disabledKeys=new Map([["KEY-001",{publicKey:pem,institutionId:"BANK-A",
    sourceSystem:"LEDGER-SERVICE",enabled:false}]]);
  assert.equal((await verifier({trustedKeys:disabledKeys})({snapshot:envelope,criteria,report})).sourceApproved,false);
});
test("Signed source cannot override independently approved mapping policy",async()=>{
  const policies=new Map([["MAP-001",{...approvals.get("MAP-001"),approved:false}]]);
  const proof=await verifier({approvedMappings:policies})({snapshot:envelope,criteria,report});
  assert.equal(proof.signatureValid,true);
  assert.equal(proof.mappingApproved,false);
  assert.equal(proof.lineageComplete,false);
});
test("Independent digest or lineage failure keeps reporting blocked",async()=>{
  const noDigest=await verifier({verifyDigest:async()=>false})({snapshot:envelope,criteria,report});
  assert.equal(noDigest.digestMatches,false);
  assert.equal(noDigest.lineageComplete,false);
  const noLineage=await verifier({verifyLineage:async()=>false})({snapshot:envelope,criteria,report});
  assert.equal(noLineage.signatureValid,true);
  assert.equal(noLineage.lineageComplete,false);
  const outage=await verifier({verifyDigest:async()=>{throw Error("secrets");}})({snapshot:envelope,criteria,report});
  assert.equal(outage.digestMatches,false);
});
test("Malformed evidence and missing trusted verifier dependencies never pass",async()=>{
  assert.throws(()=>createSnapshotEvidenceVerifier(),/UNTRUSTED_EVIDENCE_CONFIGURATION/);
  assert.throws(()=>canonicalSnapshotManifest({...original,digest:"bad"}),/INVALID_SNAPSHOT_MANIFEST/);
  const proof=await verifier()({snapshot:{...original,signature:"invalid"},criteria,report});
  assert.equal(proof.signatureValid,false);
});
test("Cryptographic evidence integrates into the preflight but cannot enable live reports",async()=>{
  const audited=[];
  const inspect=createReportSourcePreflight({
    reports:new Map([[report.id,report]]),
    authenticate:async()=>({subjectId:"BANK-USER-1",verified:true}),
    authorize:async()=>({allowPreflight:true,subjectId:"BANK-USER-1",
      institutionId:"BANK-A",branchIds:["BR-A","BR-B"]}),
    readSnapshot:async()=>envelope,
    verifyProvenance:verifier(),
    recordAudit:async x=>audited.push(x)
  });
  const result=await inspect({reportId:report.id,period:"2026-11",currency:"XAF"});
  assert.equal(result.sourceMetadataVerified,true);
  assert.equal(result.productionEnabled,false);
  assert.equal(result.status,"BLOCKED");
  assert.equal(audited[0].outcome,"BLOCKED");
});
