import test from "node:test";
import assert from "node:assert/strict";
import {reconcileImmutableJournalEvidence} from "../src/report-reconciliation.js";
const fields={institutionId:"BANK-A",branchId:"BR-A",currency:"XAF",
  period:"2026-11",revision:"REV-001",state:"POSTED",immutable:true};
const lines=[
  {...fields,entryId:"ENTRY-1",journalId:"JOURNAL-1",accountId:"ASSET-1",debitMinor:"10500",creditMinor:"0"},
  {...fields,entryId:"ENTRY-2",journalId:"JOURNAL-1",accountId:"LIABILITY-1",debitMinor:"0",creditMinor:"10500"}
];
const balances=[
  {...fields,accountId:"ASSET-1",netDebitMinor:"10500"},
  {...fields,accountId:"LIABILITY-1",netDebitMinor:"-10500"}
];
const input={institutionId:"BANK-A",branchIds:["BR-A"],currency:"XAF",period:"2026-11",
  revision:"REV-001",journalLines:lines,expectedAccountNet:balances};
test("Reconcile balanced posted immutable evidence per journal and account",()=>{
  const x=reconcileImmutableJournalEvidence(input);
  assert.equal(x.status,"RECONCILED_EVIDENCE_ONLY");assert.equal(x.officialStatement,false);
  assert.equal(x.accountCount,2);
});
test("Reject journal imbalance even with compensating unrelated journal",()=>{
  const modified=[{...lines[0],debitMinor:"10501"},lines[1]];
  assert.throws(()=>reconcileImmutableJournalEvidence({...input,journalLines:modified}),/UNBALANCED_JOURNAL/);
});
test("Reject missing, altered and duplicated independent trial balance",()=>{
  for(const changes of [
    [balances[0]], [{...balances[0],netDebitMinor:"10501"},balances[1]],
    [balances[0],balances[0]]
  ])assert.throws(()=>reconcileImmutableJournalEvidence({...input,expectedAccountNet:changes}));
});
test("Reject cross-bank, cross-branch, currency and revocation/immutability violations",()=>{
  for(const change of [
    {institutionId:"BANK-B"},{branchId:"BR-B"},{currency:"EUR"},{immutable:false},
    {state:"REVERSED"},{revision:"REV-002"}
  ])assert.throws(()=>reconcileImmutableJournalEvidence({
    ...input,journalLines:[{...lines[0],...change},lines[1]]
  }));
});
test("Reject unsafe amounts, floating point, double-sided and blank journal legs",()=>{
  for(const change of [
    {debitMinor:"10.1"},{debitMinor:"-1"},{debitMinor:"0",creditMinor:"0"},
    {debitMinor:"100",creditMinor:"100"}
  ])assert.throws(()=>reconcileImmutableJournalEvidence({
    ...input,journalLines:[{...lines[0],...change},lines[1]]
  }));
});
