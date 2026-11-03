# CB — Engineering control and acceptance-test design (not executed)
**Scope:** WP-ACC-005; builds on CA's 16 tests without repeating them. **New negative scenarios:** 12. All are design-only; no executable fixtures or authorized scheme environment exist.

## Semantics and ownership
The public MT–MX equivalence annex is a discovery index, **not** a mapping contract. The exact signed message, XSD edition, business-rule set, code lists, signatures, endpoint contract, institution entitlement, idempotency and response semantics must come from issuer-authorized CEMAC-BANK/CMA material. No public ISO 20022 schema alone proves BEAC interoperability.

Proposed domain owners: Authority Registry (issuer and amendment evidence); Rail Entitlement (participant/contract); Profile Registry (exact message editions/digests); Secure Rail Adapter (transport, signatures and unknown outcome); Payment Orchestration (correlation and idempotency); Accounting Core (immutable balanced journals); External Reconciliation (statement proof); Audit (tamper-evident chain). All are proposals pending DoR.

## Twelve NEW negative acceptance scenarios — unexecuted
| ID | Failure injection | Required assertion |
|---|---|---|
| CB-T01 | Two schedule rows both numbered 12 are imported as unique stage keys | Reject ambiguous stage identity; do not overwrite milestone or infer live date |
| CB-T02 | Annex interval NOV–FEV 2025 or DEC–JANV 2025 automatically parsed as an approved deployment interval | Quarantine contradictory interval pending issuer correction |
| CB-T03 | Collection alias `BEAC_SYGMA_ISO20022` silently substituted for `BEAC_SYGMA_ISO20022_BEAC_IAP_TIA` | Block until issuer-approved identity and digest mapping |
| CB-T04 | Message family `pacs.008` accepted without an exact BEAC schema edition and rule-set digest | Reject conformance claim and transmission |
| CB-T05 | Proprietary MT999 overdraft/reservation command translated to CAMT based only on public equivalence table | Deny privileged operation; require issuer business rules and checker |
| CB-T06 | MT900 and MT910 both mapped to camt.054 without debit/credit direction and account authority | No automatic journal or liquidity change |
| CB-T07 | camt.052 intraday report used as final cash position despite later correction | Do not assert finality or available liquidity |
| CB-T08 | camt.053 statement reimported with identical account/statement/entry identity | No duplicate reconciliation item or journal |
| CB-T09 | camt.056 cancellation request received without authoritative outcome | Original posted journal unchanged; external outcome stays unresolved |
| CB-T10 | camt.029 response for a different original payment is linked to current cancellation | Reject correlation, audit and quarantine |
| CB-T11 | Signed MX message arrives with unknown key version or unvalidated canonicalization | Quarantine; never treat HTTP success as authenticated instruction |
| CB-T12 | REST API returns HTTP 200 but no authenticated scheme processing or settlement evidence | Preserve UNKNOWN/ACCEPTED distinction; no finality or balance creation |

For each eventual executable case: exact source clause and edition; bank and environment; controlled test data; actor permissions; expected and actual message/GL states; idempotency keys; independent statement proof; audit-chain evidence; failover/replay check; reviewer signoff. **Executed cases: 0.**

## Financial invariants
Immutable posted journals; debit=credit per currency; exact monetary units; controlled correction not mutation; no network status-driven posting; no duplicate posting on retry; no phantom liquidity; independent external settlement reconciliation; no unapproved scheme mapping; maker-checker for privileged actions.

## Operational and security review gates
Cryptographic signing/canonicalization, certificate chain/HSM boundary, endpoint mutual authentication, key rotation, replay window, secure audit, least privilege and incident/DR runbooks cannot be declared complete without the actual BEAC/CMA documents and bank-specific test evidence. No RTO/RPO, certification, or security-test result is asserted.
