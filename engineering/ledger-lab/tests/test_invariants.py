import concurrent.futures
from dataclasses import FrozenInstanceError
import unittest
from uuid import uuid4

from ledger import (
    DuplicateConflict, Journal, LedgerRuleError, Line, SyntheticLedger,
    validate_lines
)

def uid():return str(uuid4())
class SyntheticLedgerInvariants(unittest.TestCase):
    def setUp(self):
        self.ledger=SyntheticLedger()
        self.bank=uid();self.other=uid();self.policy=uid()
        self.asset=uid();self.liability=uid();self.foreign=uid()
        for acc in (self.asset,self.liability):
            self.ledger.register_test_account(self.bank,acc,"XAF")
        self.ledger.register_test_account(self.other,self.foreign,"XAF")
        self.lines=(Line(self.asset,"DEBIT","XAF",350),Line(self.liability,"CREDIT","XAF",350))
        self.key=uid()+uid()

    def post(self,key=None,source="LAB-1001",lines=None):
        return self.ledger.post_synthetic(self.bank,source,
                                          self.lines if lines is None else lines,
                                          self.key if key is None else key,self.policy)

    def test_balanced_journal_and_derived_projection(self):
        j=self.post()
        self.assertEqual(j.kind,"NORMAL")
        self.assertEqual(self.ledger.projection(self.bank,self.asset),350)
        self.assertEqual(self.ledger.projection(self.bank,self.liability),-350)
        self.assertEqual(self.ledger.journal_count(),1)

    def test_frozen_posted_journal_and_lines(self):
        j=self.post()
        with self.assertRaises(FrozenInstanceError):
            j.kind="FORGED"
        with self.assertRaises(FrozenInstanceError):
            j.lines[0].amount_minor=999
        with self.assertRaises(TypeError):
            j.lines[0]="NOT_A_LINE"

    def test_unbalanced_debit_credit_rejected_no_side_effect(self):
        bad=(self.lines[0],Line(self.liability,"CREDIT","XAF",349))
        with self.assertRaises(LedgerRuleError):
            self.post(lines=bad)
        self.assertEqual(self.ledger.journal_count(),0)

    def test_monetary_types_strict_positive_integer(self):
        for value in [0,-1,1.0,1.5,True,False,"100",None]:
            with self.subTest(value=value):
                with self.assertRaises(LedgerRuleError):
                    Line(self.asset,"DEBIT","XAF",value)
        with self.assertRaises(LedgerRuleError):
            Line(self.asset,"DEBIT","XAF",9_000_000_000_000_001)

    def test_unsupported_cross_bank_account_rejected(self):
        lines=(Line(self.asset,"DEBIT","XAF",350),Line(self.foreign,"CREDIT","XAF",350))
        with self.assertRaises(LedgerRuleError):
            self.post(lines=lines)
        self.assertEqual(self.ledger.journal_count(),0)
        with self.assertRaises(LedgerRuleError):
            self.ledger.projection(self.bank,self.foreign)

    def test_idempotent_exact_replay_same_receipt(self):
        a=self.post();b=self.post()
        self.assertEqual(a.journal_id,b.journal_id)
        self.assertEqual(self.ledger.journal_count(),1)

    def test_key_reuse_changed_payload_is_conflict(self):
        self.post()
        other=(Line(self.asset,"DEBIT","XAF",1),Line(self.liability,"CREDIT","XAF",1))
        with self.assertRaises(DuplicateConflict):
            self.post(lines=other)
        self.assertEqual(self.ledger.journal_count(),1)

    def test_source_replay_new_key_also_denied(self):
        self.post()
        with self.assertRaises(DuplicateConflict):
            self.post(key=uid()+uid())
        self.assertEqual(self.ledger.journal_count(),1)

    def test_reversal_is_distinct_compensating_immutable_journal(self):
        original=self.post()
        rev=self.ledger.reverse_synthetic(self.bank,original.journal_id,
               "REV-LAB-001",uid()+uid(),self.policy,"Synthetic accidental duplicate reversal")
        self.assertEqual(rev.kind,"REVERSAL")
        self.assertEqual(rev.reverses_journal_id,original.journal_id)
        self.assertNotEqual(rev.journal_id,original.journal_id)
        self.assertEqual(self.ledger.journal_count(),2)
        self.assertEqual(self.ledger.projection(self.bank,self.asset),0)
        self.assertEqual(self.ledger.projection(self.bank,self.liability),0)
        self.assertEqual(self.ledger.journal(self.bank,original.journal_id),original)

    def test_duplicate_reversal_denied(self):
        original=self.post()
        self.ledger.reverse_synthetic(self.bank,original.journal_id,
               "REV-LAB-001",uid()+uid(),self.policy,"Synthetic accidental duplicate reversal")
        with self.assertRaises(DuplicateConflict):
            self.ledger.reverse_synthetic(self.bank,original.journal_id,
               "REV-LAB-002",uid()+uid(),self.policy,"Second reversal not permitted")

    def test_cross_bank_reversal_denied(self):
        original=self.post()
        with self.assertRaises(LedgerRuleError):
            self.ledger.reverse_synthetic(self.other,original.journal_id,
               "REV-FOREIGN",uid()+uid(),self.policy,"This is forbidden across banks")

    def test_concurrent_idempotency_does_not_double_post(self):
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
            result=list(pool.map(lambda _:self.post(),range(24)))
        self.assertEqual(len({j.journal_id for j in result}),1)
        self.assertEqual(self.ledger.journal_count(),1)

    def test_multi_currency_requires_balance_per_currency(self):
        other_a=uid();other_b=uid()
        self.ledger.register_test_account(self.bank,other_a,"USD")
        self.ledger.register_test_account(self.bank,other_b,"USD")
        lines=self.lines+(Line(other_a,"DEBIT","USD",500),Line(other_b,"CREDIT","USD",500))
        self.post(lines=lines)
        self.assertEqual(self.ledger.projection(self.bank,other_a),500)
        bad=(Line(self.asset,"DEBIT","XAF",350),Line(other_b,"CREDIT","USD",350))
        with self.assertRaises(LedgerRuleError):
            validate_lines(bad)

if __name__=="__main__": unittest.main(verbosity=2)
