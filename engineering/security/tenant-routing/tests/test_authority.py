"""Deterministic PostgreSQL interleaving tests T43/T47.

This proves ONLY the single-transaction authority+synthetic-effect model,
NOT cross-service revocation ordering, broker mTLS, payment finality or live code.
"""
import concurrent.futures
import threading
import time
import unittest
import uuid

from authority import (
    Denied, connection, effect_count, execute_synthetic, grant,
    record_membership, redeem, revoke, synthetic_digest
)

def create_member():
    return record_membership(uuid.uuid4(), uuid.uuid4())

def lease(member):
    return grant(member,uuid.uuid4(),synthetic_digest(b"synthetic-command"),
                 str(uuid.uuid4())+str(uuid.uuid4()),"synthetic-issuer",uuid.uuid4())

class AuthorityConcurrencyTests(unittest.TestCase):
    def test_t43_two_brokers_exactly_one_redemption(self):
        member=create_member()
        L=lease(member)
        gate=threading.Barrier(3)
        def broker():
            gate.wait(timeout=7)
            try:
                redeem(L)
                return "REDEEMED"
            except Denied:
                return "DENIED"
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as ex:
            a=ex.submit(broker);b=ex.submit(broker)
            gate.wait(timeout=7)
            outcomes=sorted([a.result(timeout=12),b.result(timeout=12)])
        self.assertEqual(outcomes,["DENIED","REDEEMED"])
        with connection() as c:
            n=c.execute("SELECT count(*) FROM opes_security_lab.redemption WHERE issuer=%s AND jti=%s",
                        (L.issuer,L.jti)).fetchone()[0]
        self.assertEqual(n,1)
        self.assertEqual(effect_count(member),0)

    def test_t47_revocation_before_grant(self):
        member=create_member()
        self.assertEqual(revoke(member),"ENFORCED")
        with self.assertRaises(Denied):
            lease(member)
        self.assertEqual(effect_count(member),0)

    def test_t47_revocation_after_grant_before_redeem(self):
        member=create_member()
        L=lease(member)
        self.assertEqual(revoke(member),"ENFORCED")
        with self.assertRaises(Denied):
            redeem(L)
        self.assertEqual(effect_count(member),0)

    def test_t47_revocation_after_redeem_before_execution(self):
        member=create_member()
        L=lease(member);redeem(L)
        self.assertEqual(revoke(member),"ENFORCED")
        with self.assertRaises(Denied):
            execute_synthetic(L)
        self.assertEqual(effect_count(member),0)

    def test_t47_execution_commits_before_revoke(self):
        member=create_member()
        L=lease(member);redeem(L)
        execute_synthetic(L)
        self.assertEqual(effect_count(member),1)
        self.assertEqual(revoke(member),"ENFORCED")
        self.assertEqual(effect_count(member),1)
        with self.assertRaises(Denied):
            execute_synthetic(L)

    def test_t47_active_fence_blocks_revocation_ack_until_commit(self):
        member=create_member()
        L=lease(member);redeem(L)
        fence_acquired=threading.Event()
        release_fence=threading.Event()
        revoke_started=threading.Event()
        revoke_finished=threading.Event()
        def paused_action():
            def hook():
                fence_acquired.set()
                if not release_fence.wait(timeout=8):
                    raise RuntimeError("deterministic action test timeout")
            execute_synthetic(L,on_fence_acquired=hook)
            return "COMMITTED"
        def pending_revoke():
            revoke_started.set()
            outcome=revoke(member)
            revoke_finished.set()
            return outcome
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as ex:
            work=ex.submit(paused_action)
            self.assertTrue(fence_acquired.wait(timeout=5))
            rev=ex.submit(pending_revoke)
            self.assertTrue(revoke_started.wait(timeout=5))
            # Concurrency safety: while the action holds the membership fence,
            # a revoke cannot acknowledge ENFORCED.
            self.assertFalse(revoke_finished.wait(timeout=0.2))
            release_fence.set()
            self.assertEqual(work.result(timeout=8),"COMMITTED")
            self.assertEqual(rev.result(timeout=8),"ENFORCED")
        self.assertEqual(effect_count(member),1)
        with self.assertRaises(Denied):
            grant(member,uuid.uuid4(),synthetic_digest(b"repeat"),
                  str(uuid.uuid4())+str(uuid.uuid4()),"synthetic-issuer",uuid.uuid4())

    def test_idempotency_duplicate_digest_conflict(self):
        member=create_member()
        L=lease(member)
        repeated=grant(member,L.command_id,L.digest,
            self._key_for(L),"synthetic-issuer",uuid.uuid4()) if False else None
        # Verify explicit original key by querying the DB.
        with connection() as c:
            key=c.execute("SELECT idempotency_key FROM opes_security_lab.authority_lease WHERE lease_id=%s",
                          (L.lease_id,)).fetchone()[0]
        second=grant(member,L.command_id,L.digest,key,L.issuer,uuid.uuid4())
        self.assertEqual(second.lease_id,L.lease_id)
        with self.assertRaises(Denied):
            grant(member,L.command_id,synthetic_digest(b"other"),key,L.issuer,uuid.uuid4())

if __name__=="__main__":
    unittest.main(verbosity=2)
