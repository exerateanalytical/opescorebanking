"""Single-PostgreSQL-boundary safety experiment for SEC-TENANT-ROUTING-001.

This is NOT a banking posting engine or an authorization gateway.
Every grant/redeem/commit/revoke acquires the SAME membership row lock and
irreversible synthetic effects are written in the SAME PostgreSQL transaction.
A different bank ledger DB, message broker or external payment network cannot
inherit this guarantee without an explicit, tested cross-service protocol.
"""
from __future__ import annotations

import hashlib
import os
import uuid
from dataclasses import dataclass
from typing import Callable

import psycopg

DSN = os.environ.get(
    "OPES_AUTHORITY_LAB_DSN",
    "host=127.0.0.1 port=5432 dbname=opes_test user=postgres password=postgres",
)

class Denied(Exception):
    """Authorization or idempotency denied before any synthetic effect."""

@dataclass(frozen=True)
class Lease:
    lease_id: uuid.UUID
    membership_id: uuid.UUID
    command_id: uuid.UUID
    digest: str
    issuer: str
    jti: uuid.UUID
    revision: int

def connection():
    return psycopg.connect(DSN)

def record_membership(institution_id: uuid.UUID, actor_id: uuid.UUID) -> uuid.UUID:
    membership_id = uuid.uuid4()
    with connection() as c:
        c.execute(
            """INSERT INTO opes_security_lab.membership
               (membership_id,institution_id,actor_id,permission_code)
               VALUES(%s,%s,%s,'synthetic.command.execute')""",
            (membership_id, institution_id, actor_id),
        )
    return membership_id

def _locked_membership(c, membership_id):
    row = c.execute(
        """SELECT institution_id,state,institution_state,revision
           FROM opes_security_lab.membership
           WHERE membership_id=%s FOR UPDATE""",
        (membership_id,),
    ).fetchone()
    if row is None or row[1] != "ACTIVE" or row[2] != "ACTIVE":
        raise Denied("membership/institution inactive or unavailable")
    return row

def _lease_from_row(row):
    return Lease(lease_id=row[0],membership_id=row[1],command_id=row[2],
                 digest=row[3],issuer=row[4],jti=row[5],revision=row[6])

def grant(
    membership_id: uuid.UUID,
    command_id: uuid.UUID,
    command_digest: str,
    idempotency_key: str,
    issuer: str,
    jti: uuid.UUID,
) -> Lease:
    if len(command_digest)!=64 or len(idempotency_key)<16:
        raise Denied("invalid command digest or key")
    with connection() as c:
        inst, _, _, revision = _locked_membership(c, membership_id)
        row=c.execute(
            """SELECT lease_id,membership_id,command_id,command_digest,issuer,jti,membership_revision
               FROM opes_security_lab.authority_lease
               WHERE membership_id=%s AND idempotency_key=%s""",
            (membership_id,idempotency_key),
        ).fetchone()
        if row:
            prior=_lease_from_row(row)
            if prior.digest!=command_digest or prior.command_id!=command_id:
                raise Denied("conflicting idempotency payload")
            return prior
        lease_id=uuid.uuid4()
        c.execute(
            """INSERT INTO opes_security_lab.authority_lease
               (lease_id,membership_id,institution_id,command_id,command_digest,
                idempotency_key,issuer,jti,membership_revision)
               VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
            (lease_id,membership_id,inst,command_id,command_digest,
             idempotency_key,issuer,jti,revision),
        )
        return Lease(lease_id,membership_id,command_id,command_digest,
                     issuer,jti,revision)

def redeem(lease: Lease) -> None:
    with connection() as c:
        _, _, _, revision=_locked_membership(c,lease.membership_id)
        row=c.execute(
            """SELECT state,membership_revision,command_digest
               FROM opes_security_lab.authority_lease
               WHERE lease_id=%s AND membership_id=%s FOR UPDATE""",
            (lease.lease_id,lease.membership_id),
        ).fetchone()
        if row is None or row != ("ISSUED",revision,lease.digest):
            raise Denied("lease used, cancelled, stale or digest conflict")
        c.execute(
            """INSERT INTO opes_security_lab.redemption(issuer,jti,lease_id)
               VALUES (%s,%s,%s) ON CONFLICT DO NOTHING""",
            (lease.issuer,lease.jti,lease.lease_id),
        )
        if c.execute(
            "SELECT count(*) FROM opes_security_lab.redemption WHERE issuer=%s AND jti=%s AND lease_id=%s",
            (lease.issuer,lease.jti,lease.lease_id),
        ).fetchone()[0] != 1:
            raise Denied("jti already owned by different lease")
        # The state transition is performed under the serialized member lock.
        c.execute(
            "UPDATE opes_security_lab.authority_lease SET state='REDEEMED' WHERE lease_id=%s",
            (lease.lease_id,),
        )

def execute_synthetic(
    lease: Lease,
    on_fence_acquired: Callable[[], None] | None = None,
) -> None:
    """The *sole* irreversible synthetic effect is atomic with the authority fence.

    on_fence_acquired is a deterministic test barrier ONLY, never public API.
    """
    with connection() as c:
        _, _, _, revision=_locked_membership(c,lease.membership_id)
        row=c.execute(
            """SELECT state,membership_revision,command_digest
               FROM opes_security_lab.authority_lease
               WHERE lease_id=%s AND membership_id=%s FOR UPDATE""",
            (lease.lease_id,lease.membership_id),
        ).fetchone()
        if row != ("REDEEMED",revision,lease.digest):
            raise Denied("no active redeemed fence")
        if on_fence_acquired is not None:
            on_fence_acquired()
        c.execute(
            """INSERT INTO opes_security_lab.synthetic_effect
               (membership_id,command_id,command_digest) VALUES(%s,%s,%s)""",
            (lease.membership_id,lease.command_id,lease.digest),
        )
        c.execute(
            "UPDATE opes_security_lab.authority_lease SET state='EXECUTED' WHERE lease_id=%s",
            (lease.lease_id,),
        )

def revoke(membership_id: uuid.UUID) -> str:
    """ENFORCED means all earlier in-transaction effects have committed or aborted.

    This is TRUE only inside THIS database's membership lock boundary.
    """
    with connection() as c:
        row=c.execute(
            "SELECT state FROM opes_security_lab.membership WHERE membership_id=%s FOR UPDATE",
            (membership_id,),
        ).fetchone()
        if row is None:
            raise Denied("membership not found")
        c.execute(
            """UPDATE opes_security_lab.membership
               SET state='REVOKED',revision=revision+1,revoked_at=now()
               WHERE membership_id=%s AND state='ACTIVE'""",
            (membership_id,),
        )
        c.execute(
            """UPDATE opes_security_lab.authority_lease SET state='CANCELLED'
               WHERE membership_id=%s AND state IN ('ISSUED','REDEEMED')""",
            (membership_id,),
        )
        return "ENFORCED"

def effect_count(membership_id: uuid.UUID) -> int:
    with connection() as c:
        return c.execute(
            "SELECT count(*) FROM opes_security_lab.synthetic_effect WHERE membership_id=%s",
            (membership_id,),
        ).fetchone()[0]

def synthetic_digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()
