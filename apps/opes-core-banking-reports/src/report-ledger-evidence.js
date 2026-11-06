/**
 * Independently verifiable *candidate* ledger-source evidence for reporting.
 * This deliberately does not issue financial statements or regulator returns.
 * No application client is given raw journal records. Source readers must be
 * separately authorized, immutable, read-only bank data-plane providers.
 */
import {createHash,timingSafeEqual} from "node:crypto";
import {reconcileImmutableJournalEvidence} from "./report-reconciliation.js";
export class LedgerEvidenceRejected extends Error {
  constructor(code){super(code);this.name="LedgerEvidenceRejected";this.code=code;}
}
const deny=code=>{throw new LedgerEvidenceRejected(code);};
const id=x=>typeof x==="string"&&/^[A-Za-z0-9][A-Za-z0-9_.:-]{2,119}$/.test(x);
const minor=x=>typeof x==="string"&&/^(0|[1-9][0-9]{0,37})$/.test(x);
const sha=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x);
const period=x=>typeof x==="string"&&/^\d{4}-(0[1-9]|1[0-2])$/.test(x);
const currencies=x=>typeof x==="string"&&/^[A-Z]{3}$/.test(x);
const sameSet=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&
  new Set(a).size===a.length&&a.every(x=>b.includes(x));

/** Deterministic SHA-256 over a complete, bank/currency/revision-scoped journal. */
export function digestImmutableJournal({
  institutionId,branchIds,period:asOf,currency,revision,journalLines
}={}){
  if(!id(institutionId)||!Array.isArray(branchIds)||branchIds.length===0||
    !branchIds.every(id)||new Set(branchIds).size!==branchIds.length||
    !period(asOf)||!currencies(currency)||!id(revision)||
    !Array.isArray(journalLines)||journalLines.length===0||
    journalLines.length>100000)deny("INVALID_JOURNAL_DIGEST_INPUT");
  const entries=new Set();
  const normalized=[];
  for(const l of journalLines){
    if(!l||!id(l.entryId)||entries.has(l.entryId)||
      !id(l.journalId)||!id(l.accountId)||!id(l.branchId)||
      !branchIds.includes(l.branchId)||
      l.institutionId!==institutionId||l.currency!==currency||
      l.period!==asOf||l.revision!==revision||
      l.state!=="POSTED"||l.immutable!==true||
      !minor(l.debitMinor)||!minor(l.creditMinor)||
      (l.debitMinor==="0"&&l.creditMinor==="0")||
      (l.debitMinor!=="0"&&l.creditMinor!=="0"))
      deny("INVALID_OR_OUT_OF_SCOPE_JOURNAL_LINE");
    entries.add(l.entryId);
    normalized.push({
      entryId:l.entryId,journalId:l.journalId,accountId:l.accountId,
      branchId:l.branchId,debitMinor:l.debitMinor,creditMinor:l.creditMinor
    });
  }
  normalized.sort((a,b)=>a.entryId<b.entryId?-1:a.entryId>b.entryId?1:0);
  return createHash("sha256").update(JSON.stringify({
    schema:"opes.reporting.ledger-journal.v1",institutionId,
    branchIds:[...branchIds].sort(),period:asOf,currency,revision,
    journalLines:normalized
  })).digest("hex");
}
const matching=(x,scope,sourceSystem)=>x&&
  x.institutionId===scope.institutionId&&x.currency===scope.currency&&
  x.period===scope.period&&x.revision===scope.sourceRevision&&
  sameSet(x.branchIds,scope.branchIds)&&x.immutable===true&&
  x.closed===true&&id(x.sourceSystem)&&
  (!sourceSystem||x.sourceSystem===sourceSystem);
const eqsha=(a,b)=>sha(a)&&sha(b)&&
  timingSafeEqual(Buffer.from(a,"hex"),Buffer.from(b,"hex"));

/**
 * Return verified digest/lineage callbacks for existing Ed25519 manifest gate.
 * Both callbacks independently reload the immutable revision, to avoid relying
 * on mutable cached query results or snapshot-declared verified flags.
 *
 * readClosedJournal/readTrialBalance MUST be distinct trusted source owners.
 */
export function createLedgerEvidenceReaders({
 readClosedJournal,readIndependentTrialBalance
}={}){
  if(typeof readClosedJournal!=="function"||
    typeof readIndependentTrialBalance!=="function")
    deny("INDEPENDENT_SOURCES_NOT_CONFIGURED");
  const scopeFor=(snapshot,criteria)=>{
    if(!snapshot||!criteria||!id(criteria.institutionId)||
       !Array.isArray(criteria.branchIds)||!criteria.branchIds.every(id)||
       !id(snapshot.sourceRevision)||!id(snapshot.reconciliationRef)||
       !sha(snapshot.digest)||!period(criteria.period)||
       !currencies(criteria.currency)||!id(snapshot.sourceSystem))
      deny("INVALID_LEDGER_EVIDENCE_SCOPE");
    return Object.freeze({
      institutionId:criteria.institutionId,
      branchIds:Object.freeze([...criteria.branchIds]),
      currency:criteria.currency,period:criteria.period,
      sourceRevision:snapshot.sourceRevision
    });
  };
  async function readJournal(snapshot,criteria){
    const scope=scopeFor(snapshot,criteria);
    const journal=await readClosedJournal(scope);
    if(!matching(journal,scope,snapshot.sourceSystem)||
      !id(journal.sourceProofId)||!Array.isArray(journal.journalLines))
      deny("JOURNAL_SOURCE_NOT_AUTHENTIC");
    const digest=digestImmutableJournal({
      ...scope,revision:scope.sourceRevision,
      journalLines:journal.journalLines
    });
    if(!eqsha(digest,snapshot.digest))deny("JOURNAL_DIGEST_MISMATCH");
    return {scope,journal};
  }
  return Object.freeze({
    async verifyDigest({snapshot,criteria}={}){
      try{await readJournal(snapshot,criteria);return true;}
      catch{return false;}
    },
    async verifyLineage({snapshot,criteria}={}){
      try{
        const {scope,journal}=await readJournal(snapshot,criteria);
        const trial=await readIndependentTrialBalance(scope);
        if(!matching(trial,scope)||
          !id(trial.sourceProofId)||!id(trial.reconciliationRef)||
          trial.reconciliationRef!==snapshot.reconciliationRef||
          trial.sourceSystem===journal.sourceSystem||
          trial.sourceProofId===journal.sourceProofId||
          !Array.isArray(trial.expectedAccountNet))
          return false;
        const result=reconcileImmutableJournalEvidence({
          institutionId:scope.institutionId,branchIds:scope.branchIds,
          period:scope.period,currency:scope.currency,
          revision:scope.sourceRevision,
          journalLines:journal.journalLines,
          expectedAccountNet:trial.expectedAccountNet
        });
        return result.status==="RECONCILED_EVIDENCE_ONLY"&&
          result.officialStatement===false;
      }catch{return false;}
    }
  });
}
