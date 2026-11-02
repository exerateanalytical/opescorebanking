# BT — Multidisciplinary quality review (2026-11-02)

| Lens | Review finding | Status |
|---|---|---|
| Regulatory/legal | Official BEAC explanatory Encadré 3 narrows category ambiguity; binding 2023 circular applicability to banks/products still requires issuer/counsel ruling | P0 OPEN |
| Financial/accounting | No ledger mutation from category, scope, timer, hold, restitution status or clearing ACK; signed PCEC absent | P0 OPEN |
| Domain boundaries | LegalPolicy, InstitutionEntitlement, RestitutionCase, RailAdapter, AccountingCore and Reconciliation remain separated | Proposed only |
| Cybersecurity/cryptography | No participant contract, BEAC profile/signature scheme, key/HSM evidence or security test | P0 OPEN |
| AML/fraud/risk | AML/fraud/judicial holds outrank administrative restitution; formal policy unapproved | OPEN |
| Workflow/state | Scope-unresolved, consent/contest, unknown external outcome and reconciliation separated | Proposed only |
| Data/privacy/retention | Source hashes, contract versions, notification timestamps and consent proof needed; original source bytes unavailable | OPEN |
| Payments/settlement | SYSTAC2 platform go-live does not prove named bank rights or settlement; V10/instant status unverified | P0 OPEN |
| Resilience/DR | Durable idempotency and external-unknown recovery required; no test environment | OPEN |
| Testing/observability/audit | Ten negative scenarios specified; zero banking tests run; no immutable production evidence | OPEN |
| Usability/accessibility | Operators must see legal-scope unresolved and no auto-action; no UI implementation | OPEN |
| Maintainability/scalability | Bitemporal rule versions and tenant-scoped approval recommended; no benchmark | OPEN |
| Regulator/auditor evidence | Issuer reports strengthen interpretation but cannot replace current operative legal texts, signed approvals or source custody | P0 OPEN |

**Decision:** Do not close WP-ACC-005, do not start production financial implementation, and do not infer certification or regulatory approval. BS-C01 narrowed, not closed. No dependent package advanced. Preserve all inherited P0 issues.
