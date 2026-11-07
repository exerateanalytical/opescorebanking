/**
 * Independent trial-balance evidence verifier, not a production ledger.
 * All monetary values MUST be canonical nonnegative decimal minor-unit strings.
 * Enforces per-journal dual-entry equality and per-account comparison against
 * separately sourced expected trial-balance evidence, for one institution and
 * currency at an immutable revision. Does not post or derive regulatory returns.
 */
export class ReconciliationRejected extends Error{
  constructor(code){super(code);this.name="ReconciliationRejected";this.code=code;}
}
const stop=code=>{throw new ReconciliationRejected(code);};
const minor=s=>typeof s==="string"&&/^(0|[1-9][0-9]{0,37})$/.test(s);
const id=s=>typeof s==="string"&&/^[A-Za-z0-9][A-Za-z0-9_.:-]{2,119}$/.test(s);
const accountKey=l=>l.branchId+"\u001f"+l.accountId;
export function reconcileImmutableJournalEvidence({
  institutionId,branchIds,currency,period,revision,journalLines,expectedAccountNet
}={}){
  if(!id(institutionId)||!id(revision)||!Array.isArray(branchIds)||
    branchIds.length===0||new Set(branchIds).size!==branchIds.length||
    !branchIds.every(id)||!/^[A-Z]{3}$/.test(currency||"")||
    !/^[0-9]{4}-(0[1-9]|1[0-2])$/.test(period||"")||
    !Array.isArray(journalLines)||journalLines.length===0||
    !Array.isArray(expectedAccountNet)||expectedAccountNet.length===0)
    stop("INCOMPLETE_RECONCILIATION_INPUT");
  const journal=new Map(),actual=new Map(),lineIds=new Set(),journals=new Set();
  for(const l of journalLines){
    if(!l||!id(l.entryId)||!id(l.journalId)||!id(l.accountId)||
      !id(l.branchId)||!branchIds.includes(l.branchId)||
      l.institutionId!==institutionId||l.currency!==currency||
      l.period!==period||l.revision!==revision||l.state!=="POSTED"||
      l.immutable!==true||!minor(l.debitMinor)||!minor(l.creditMinor)||
      (l.debitMinor!=="0"&&l.creditMinor!=="0")||
      (l.debitMinor==="0"&&l.creditMinor==="0")||
      lineIds.has(l.entryId))stop("INVALID_OR_CROSS_BANK_JOURNAL_LINE");
    lineIds.add(l.entryId);journals.add(l.journalId);
    const d=BigInt(l.debitMinor),c=BigInt(l.creditMinor);
    const j=journal.get(l.journalId)||{debit:0n,credit:0n,count:0};
    j.debit+=d;j.credit+=c;j.count++;journal.set(l.journalId,j);
    const key=accountKey(l);
    actual.set(key,(actual.get(key)||0n)+d-c);
  }
  for(const j of journal.values())
    if(j.count<2||j.debit!==j.credit)stop("UNBALANCED_JOURNAL");
  const expected=new Map();
  for(const b of expectedAccountNet){
    if(!b||!id(b.accountId)||!id(b.branchId)||
      !branchIds.includes(b.branchId)||b.institutionId!==institutionId||
      b.currency!==currency||b.period!==period||b.revision!==revision||
      !/^-?(0|[1-9][0-9]{0,37})$/.test(b.netDebitMinor||""))
      stop("INVALID_EXPECTED_BALANCE");
    const key=accountKey(b);
    if(expected.has(key))stop("DUPLICATE_EXPECTED_BALANCE");
    expected.set(key,BigInt(b.netDebitMinor));
  }
  if(actual.size!==expected.size)stop("MISSING_OR_EXTRA_ACCOUNTS");
  for(const [key,value] of actual)
    if(!expected.has(key)||expected.get(key)!==value)
      stop("ACCOUNT_RECONCILIATION_MISMATCH");
  return Object.freeze({status:"RECONCILED_EVIDENCE_ONLY",institutionId,
    currency,period,revision,journalCount:journals.size,lineCount:lineIds.size,
    accountCount:actual.size,officialStatement:false});
}
