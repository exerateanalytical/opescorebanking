"""OPES banking ledger invariants: deterministic SYNTHETIC in-memory laboratory.

Not a banking production ledger. No persistent database transaction, HSM audit
signature, entitlement gateway, COBAC account mapping or real-money capability.
All amounts represent integer minor currency units, never binary floats.
"""
from __future__ import annotations

from dataclasses import dataclass
from hashlib import sha256
import json
import re
from threading import RLock
from types import MappingProxyType
from uuid import UUID, uuid4

MAX_MINOR = 9_000_000_000_000_000

class LedgerRuleError(ValueError):
    pass

class DuplicateConflict(LedgerRuleError):
    pass

def _valid_uuid(value: str) -> bool:
    try:
        UUID(str(value))
        return True
    except (ValueError, TypeError):
        return False

@dataclass(frozen=True)
class Line:
    account_id: str
    side: str
    currency: str
    amount_minor: int

    def __post_init__(self):
        if not _valid_uuid(self.account_id):
            raise LedgerRuleError("account_id must be a UUID")
        if self.side not in ("DEBIT", "CREDIT"):
            raise LedgerRuleError("invalid debit-credit side")
        if not isinstance(self.currency, str) or not re.fullmatch(r"[A-Z]{3}",self.currency):
            raise LedgerRuleError("invalid ISO-4217-style currency code")
        if type(self.amount_minor) is not int or not 1 <= self.amount_minor <= MAX_MINOR:
            raise LedgerRuleError("amount must be positive exact integer minor units")

@dataclass(frozen=True)
class Journal:
    journal_id: str
    institution_id: str
    source_reference: str
    lines: tuple[Line, ...]
    kind: str
    reverses_journal_id: str | None
    sequence: int
    posting_policy_revision: str

def validate_lines(lines: tuple[Line,...]) -> None:
    if not isinstance(lines, tuple) or len(lines)<2 or len(lines)>500:
        raise LedgerRuleError("2..500 immutable lines required")
    totals: dict[str, dict[str,int]] = {}
    for line in lines:
        if not isinstance(line,Line):
            raise LedgerRuleError("each line must be typed and immutable")
        bucket=totals.setdefault(line.currency,{"DEBIT":0,"CREDIT":0})
        bucket[line.side]+=line.amount_minor
        if bucket[line.side]>MAX_MINOR:
            raise LedgerRuleError("aggregate minor-unit overflow")
    for currency,tot in totals.items():
        if tot["DEBIT"]!=tot["CREDIT"]:
            raise LedgerRuleError("unbalanced currency "+currency)
        if not tot["DEBIT"]:
            raise LedgerRuleError("zero-valued currency is forbidden")

def _digest(institution: str, source: str, lines: tuple[Line,...],
            policy: str, kind: str, reversal: str | None) -> str:
    payload={"institution":institution,"source":source,"policy":policy,
             "kind":kind,"reversal":reversal,
             "lines":[{"account":x.account_id,"side":x.side,"currency":x.currency,
                       "minor":x.amount_minor} for x in lines]}
    return sha256(json.dumps(payload,sort_keys=True,separators=(",",":")).encode()).hexdigest()

class SyntheticLedger:
    """Fully lock-serialized, non-persistent synthetic journal and reversal laboratory."""

    def __init__(self):
        self._guard=RLock()
        self._accounts: dict[str,tuple[str,str]]={}
        self._posted: dict[str,Journal]={}
        self._idempotency: dict[tuple[str,str],tuple[str,str]]={}
        self._source: dict[tuple[str,str],str]={}
        self._reversed: set[str]=set()

    def register_test_account(self,institution_id:str,account_id:str,currency:str):
        if not _valid_uuid(institution_id) or not _valid_uuid(account_id):
            raise LedgerRuleError("identity must be UUID")
        if not re.fullmatch(r"[A-Z]{3}",currency):
            raise LedgerRuleError("invalid currency")
        with self._guard:
            if account_id in self._accounts:
                raise LedgerRuleError("account ID already registered")
            self._accounts[account_id]=(institution_id,currency)

    def _validate_accounts(self, institution: str, lines: tuple[Line,...]):
        for line in lines:
            if self._accounts.get(line.account_id)!=(institution,line.currency):
                raise LedgerRuleError("unrecognized or cross-institution account or currency")

    def _post(self, institution:str,source:str,lines:tuple[Line,...],key:str,
              policy:str,kind:str,reversal:str|None) -> Journal:
        if not _valid_uuid(institution):
            raise LedgerRuleError("invalid institution")
        if not isinstance(key,str) or not 16<=len(key)<=128:
            raise LedgerRuleError("idempotency key required")
        if not isinstance(source,str) or not 3<=len(source)<=160:
            raise LedgerRuleError("source reference required")
        if not _valid_uuid(policy):
            raise LedgerRuleError("posting policy version ID required")
        with self._guard:
            validate_lines(lines)
            self._validate_accounts(institution,lines)
            fingerprint=_digest(institution,source,lines,policy,kind,reversal)
            token=(institution,key)
            if token in self._idempotency:
                previous_digest,previous_id=self._idempotency[token]
                if fingerprint!=previous_digest:
                    raise DuplicateConflict("same key with different financial command")
                return self._posted[previous_id]
            if (institution,source) in self._source:
                raise DuplicateConflict("different key must not replay original source")
            if kind=="REVERSAL":
                if reversal not in self._posted or self._posted[reversal].institution_id!=institution:
                    raise LedgerRuleError("cannot reverse foreign or unknown journal")
                if reversal in self._reversed:
                    raise DuplicateConflict("journal already reversed")
            jid=str(uuid4())
            row=Journal(jid,institution,source,lines,kind,reversal,
                        len(self._posted)+1,policy)
            self._posted[jid]=row
            self._idempotency[token]=(fingerprint,jid)
            self._source[(institution,source)]=jid
            if reversal is not None:
                self._reversed.add(reversal)
            return row

    def post_synthetic(self,institution_id:str,source_reference:str,
                       lines:tuple[Line,...],idempotency_key:str,
                       policy_revision:str)->Journal:
        return self._post(institution_id,source_reference,lines,idempotency_key,
                          policy_revision,"NORMAL",None)

    def reverse_synthetic(self,institution_id:str,original_id:str,
                          source_reference:str,idempotency_key:str,
                          policy_revision:str,reason:str)->Journal:
        if not isinstance(reason,str) or len(reason.strip())<10:
            raise LedgerRuleError("reversal justification required")
        with self._guard:
            original=self._posted.get(original_id)
            if original is None or original.institution_id!=institution_id:
                raise LedgerRuleError("original journal not found in institution")
            compensation=tuple(Line(x.account_id,"CREDIT" if x.side=="DEBIT" else "DEBIT",
                                    x.currency,x.amount_minor) for x in original.lines)
            return self._post(institution_id,source_reference,compensation,
                              idempotency_key,policy_revision,"REVERSAL",original_id)

    def journal(self,institution_id:str,journal_id:str)->Journal|None:
        with self._guard:
            journal=self._posted.get(journal_id)
            return journal if journal is not None and journal.institution_id==institution_id else None

    def projection(self,institution_id:str,account_id:str)->int:
        """Synthetic GL debit-minus-credit projection, NOT a customer available balance."""
        with self._guard:
            if account_id not in self._accounts or self._accounts[account_id][0]!=institution_id:
                raise LedgerRuleError("account not in institution")
            return sum((line.amount_minor if line.side=="DEBIT" else -line.amount_minor)
                       for entry in self._posted.values() if entry.institution_id==institution_id
                       for line in entry.lines if line.account_id==account_id)

    def journal_count(self)->int:
        with self._guard:
            return len(self._posted)
