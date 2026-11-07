import test from "node:test";
import assert from "node:assert/strict";
import {generateKeyPairSync,sign} from "node:crypto";
import {digestImmutableJournal,createLedgerEvidenceReaders}
  from "../src/report-ledger-evidence.js";
import {canonicalSnapshotManifest,createSnapshotEvidenceVerifier}
  from "../src/snapshot-evidence-verifier.js";
const fields={institutionId:"BANK-A",branchId:"BR-A",period:"2026-11",
  currency:"XAF",revision:"REV-001",state:"POSTED",immutable:true};
const lines=[
 {...fields,entryId:"ENTRY-01",journalId:"JOURNAL-01",
  accountId:"ASSET-001",debitMinor:"12300",creditMinor:"0"},
 {...fields,entryId:"ENTRY-02",journalId:"JOURNAL-01",
  accountId:"LIABILITY-001",debitMinor:"0",creditMinor:"12300"}
];
const scope={institutionId:"BANK-A",branchIds:["BR-A"],
  period:"2026-11",currency:"XAF",sourceRevision:"REV-001"};
const digest=digestImmutableJournal({...scope,revision:scope.sourceRevision,
  journalLines:lines});
const snap={snapshotId:"SNAP-001",reportId:"RPT-LED-001",
  reportVersion:"0.1.0-design",institutionId:"BANK-A",branchIds:["BR-A"],
  period:"2026-11",currency:"XAF",sourceSystem:"LEDGER-SERVICE",
  sourceRevision:"REV-001",mappingVersion:"MAP-001",
  reconciliationRef:"RECON-001",digest,immutable:true,reconciled:true,
  keyId:"KEY-001"};
const journal={...scope,revision:scope.sourceRevision,
  immutable:true,closed:true,sourceSystem:"LEDGER-SERVICE",
  sourceProofId:"LEDGER-PROOF-001",journalLines:lines};
const trial={...scope,revision:scope.sourceRevision,
  immutable:true,closed:true,sourceSystem:"TRIAL-BALANCE-SERVICE",
  sourceProofId:"TRIAL-PROOF-001",reconciliationRef:"RECON-001",
  expectedAccountNet:[
    {...fields,accountId:"ASSET-001",netDebitMinor:"12300"},
    {...fields,accountId:"LIABILITY-001",netDebitMinor:"-12300"}
  ]};
const criteria={...scope,reportId:snap.reportId,reportVersion:snap.reportVersion};
const setup=({journalChange={},trialChange={},lineChange={}}={})=>
 createLedgerEvidenceReaders({
  readClosedJournal:async()=>({...journal,...journalChange,
    journalLines:journalChange.journalLines||[
      {...lines[0],...lineChange},lines[1]]}),
  readIndependentTrialBalance:async()=>({...trial,...trialChange})
 });
test("Canonical digest order is deterministic and bank/currency/revision-bound",()=>{
 const a=digestImmutableJournal({...scope,revision:scope.sourceRevision,
   journalLines:lines});
 const b=digestImmutableJournal({...scope,revision:scope.sourceRevision,
   journalLines:[lines[1],lines[0]]});
 assert.equal(a,b);assert.equal(a.length,64);
 assert.notEqual(digestImmutableJournal({...scope,revision:"REV-002",
   journalLines:lines.map(l=>({...l,revision:"REV-002"}))}),a);
});
test("Independent immutable signed-source digest and account reconciliation succeed",async()=>{
 const r=setup();
 assert.equal(await r.verifyDigest({snapshot:snap,criteria}),true);
 assert.equal(await r.verifyLineage({snapshot:snap,criteria}),true);
});
test("Reject cross-bank, foreign currency, altered amount and stale revision",async()=>{
 for(const altered of [
  {institutionId:"BANK-B"},{currency:"USD"},{debitMinor:"12301"},
  {revision:"REV-002"},{state:"REVERSED"},{immutable:false}
 ]){
   const r=setup({lineChange:altered});
   assert.equal(await r.verifyDigest({snapshot:snap,criteria}),false);
   assert.equal(await r.verifyLineage({snapshot:snap,criteria}),false);
 }
});
test("Reject incomplete, stale, self-referential or unbalanced independent trial balance",async()=>{
 const cases=[
  {trialChange:{sourceSystem:"LEDGER-SERVICE"}},
  {trialChange:{reconciliationRef:"RECON-OLD"}},
  {trialChange:{revision:"REV-OLD"}},
  {trialChange:{sourceProofId:"LEDGER-PROOF-001"}},
  {trialChange:{expectedAccountNet:trial.expectedAccountNet.slice(0,1)}},
  {trialChange:{expectedAccountNet:[
    {...trial.expectedAccountNet[0],netDebitMinor:"12301"},
    trial.expectedAccountNet[1]]}}
 ];
 for(const c of cases){
  const r=setup(c);
  assert.equal(await r.verifyDigest({snapshot:snap,criteria}),true);
  assert.equal(await r.verifyLineage({snapshot:snap,criteria}),false);
 }
});
test("Signer-and-source provenance checks integrate but never authorize a bank report",async()=>{
 const {privateKey,publicKey}=generateKeyPairSync("ed25519");
 const signed={...snap};
 signed.signature=sign(null,canonicalSnapshotManifest(signed),privateKey)
   .toString("base64url");
 const sources=setup();
 const verify=createSnapshotEvidenceVerifier({
  trustedKeys:new Map([["KEY-001",{
    publicKey:publicKey.export({format:"pem",type:"spki"}),
    institutionId:"BANK-A",sourceSystem:"LEDGER-SERVICE",enabled:true
  }]]),
  approvedMappings:new Map([["MAP-001",{
    institutionId:"BANK-A",reportId:snap.reportId,
    reportVersion:snap.reportVersion,sourceSystem:"LEDGER-SERVICE",
    approved:true
  }]]),
  ...sources
 });
 const proof=await verify({snapshot:signed,criteria,
  report:{id:snap.reportId,version:snap.reportVersion}});
 assert.deepEqual(proof,{
  signatureValid:true,digestMatches:true,sourceApproved:true,
  mappingApproved:true,lineageComplete:true
 });
 // This is provenance evidence ONLY. No authorizer or report output exists.
 assert.ok(!("productionApproved" in proof));
 assert.ok(!("officialFilingEnabled" in proof));
});
