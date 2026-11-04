# ADR-OPES-003 — Bank-local financial command fence and global identity separation

**Decision:** Adopt a **bank-local authoritative financial command fence** as the reference implementation topology. Design accepted for laboratory continuation; production assurance OPEN. This decision supersedes an assumption that a single global membership service can linearly control an irreversible command in an independent bank database.

## Motivation and current evidence
The existing review `governance/reviews/SEC-TENANT-ROUTING-001_FORMAL_ORDERING_MODEL_06_2026-11-04.md` correctly identifies a check-then-act gap between membership revocation and irreversible posting. A remote token signature, global user status, short TTL or global cache invalidation does not close it.

This run executed the local transaction-bound security experiment under `engineering/security/tenant-routing/`: 7 real PostgreSQL-backed tests passed, including T43 (two brokers race one durable JTI) and T47 (revocation before/after grants, redemption and synthetic irreversible effect; and revocation waiting for a held membership lock). [CI run 41909907072](https://github.com/exerateanalytical/opescorebanking/actions/runs/41909907072).

## Trust domains and rules
1. **Identity domain:** Trusted OIDC issuer and pinned JWKS authenticate a person/workload. The issuer does not authorize a particular bank's financial command. A separate test-only signed token validator under `engineering/security/token-router/` passed 20 tests ([run 41911013397](https://github.com/exerateanalytical/opescorebanking/actions/runs/41911013397)).
2. **Bank-local authority:** Each bank-specific data plane owns revocable membership, permissions, SoD and a durable command nonce/replay register. All local financial commands must carry the institution ID, subject/member ID, command digest, idempotency key and authority revision. No bank may select another bank's DB principal from client headers.
3. **Local irreversible commit:** In a bank-local serializable/row-lock-ordered transaction, acquire the membership fence, validate command and persist both immutable balanced journal rows and the terminal command outcome. The lock ordering is `membership -> command -> journal/outbox`. No client can bypass these tables through an alternate posting route. Any financial capability spanning a different database or transaction boundary requires a separate proof and review.
4. **Revocation acknowledgment:** `REQUESTED` and `PENDING` are not `ENFORCED`. The bank-local authority acknowledges `ENFORCED` only after every earlier locally fenced irreversible command has committed/aborted or has an explicitly reconciled durable outcome. In-flight commands may delay enforcement; unknown outcomes must remain pending and observable.
5. **Global administrator revocation:** A global revoke cannot claim system-wide `ENFORCED` until every affected bank-local authority acknowledges and the distributed control plane retains an authenticated durable acknowledgment ledger. If an authority is unreachable, state remains `PENDING / AT_RISK` (fail-closed to new grants when isolation is detected); no false global guarantee.
6. **External rails:** A prior submitted instruction may settle after membership revocation. The guarantee governs authorization and *new local submission*, not cancellation of external settlement. UNKNOWN rail outcomes require reconciliation before retry.
7. **Education Edition:** Has no credentials, membership projection or network path into a production bank data plane; synthetic fixtures only.
8. **Credential and key control:** OIDC signer, bank-local command capability issuer and DB principal have distinct keys and authority. Broker workload identity must be mTLS-bound and its credential exchange must be audited. The current tests have not established production HSM/certificate operations.

## Safety and liveness claims actually supported
- **Supported in laboratory:** one PostgreSQL database locking one membership row gives ordered synthetic local effects; exactly one JTI redemption; no synthetic effect posted after an ENFORCED bank-local revocation; preserved earlier effects; signed token path/issuer/membership verification with pinned keys; no bank principal spoof by a mutable GUC.
- **Unproven / P0 remains:** equivalent protection for a production ledger, cross-bank global revocation propagation, independent authorities, bank-specific DB failover, durable HSM-backed signed capabilities, hot key rotation, actual mTLS broker and outbox publication, distributed disaster recovery. No full financial transaction tests were performed.

## Engineering acceptance gates and continuation
The selected bank-local topology permits continued development of isolated bounded components. `SEC-TENANT-ROUTING-001` remains **OPEN / P0 production blocker**, despite passing laboratory tests. NEXT EXACT TASK: implement the bank-local authentication gateway + membership authorization + real database principal connection broker as one testable vertical slice, validate revocation/commit interleavings under persistence/restarts, and prove separated/unknown external outcome handling before any live posting.

References:
- [PostgreSQL row locking](https://www.postgresql.org/docs/16/explicit-locking.html)
- [PostgreSQL transaction isolation](https://www.postgresql.org/docs/16/transaction-iso.html)
- [RFC 8725 JWT BCP](https://www.rfc-editor.org/rfc/rfc8725)
- [Basel operational resilience](https://www.bis.org/committees/bcbs/basel-consolidated-guidelines/module/orr/20)
