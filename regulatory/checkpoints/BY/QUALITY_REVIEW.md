# BY — Multidisciplinary assurance review
| Perspective | Status | Finding |
|---|---|---|
| regulatory/legal | OPEN | Current charter, signed adoption, Art 56 procedure and 001/GR/2024 missing |
| financial/accounting | OPEN_P0 | No bank-approved PCEC treatment of ex officio debit/returns |
| architecture/domain | PROPOSED | Separate external settlement evidence, restitution, supervisor reporting, Accounting Core |
| cybersecurity/identity/cryptography | OPEN_P0 | No approved issuer signatures, keys, transport, credentials or audit-channel standards |
| AML/fraud/risk | OPEN | Fraudulent restitution and coerced debit must have case-based controls |
| workflow/state consistency | PROPOSED | Unknown external outcome, contested, external debit confirmed and reconciled are distinct |
| data/privacy/retention | OPEN | Art 22 BEAC promise cannot set bank retention policy |
| payments/settlement/reconciliation | OPEN_P0 | Actual BEAC statement, agreement, finality and debit procedure absent |
| resilience/DR/operations | OPEN | No institution-approved RTO/RPO or tested failback |
| testability/observability/audit | PROPOSED | 14 negative scenarios specified, none run; external receipts required |
| usability/accessibility | DEFERRED | No operator UI implemented; future dual-supervisor incident triage must be accessible |
| maintainability/performance/scalability | PROPOSED | Effective-dated policy versioning and bounded contexts; no benchmark |
| regulator/auditor evidence | OPEN_P0 | No countersigned charter, bank policy approval, issuer acknowledgment or PDF SHA256 |

**Stop decision:** WP-ACC-005 remains OPEN/P0-BLOCKED; dependent packages not advanced. Historical 2014 charter is material source evidence, not proof of current bank participation or right to implement. The BEAC 2024 surveillance review describes operational reporting and SANGHA, but neither establishes current COBAC incident thresholds nor an authenticated BEAC reporting interface. Do not turn a possible central-bank ex officio debit into an automatic customer debit.

**Legal citation discrepancy:** Charter preamble appears to say 01/GR/2013 dated 17 Mar 2014; Article 1 says 01/GR/2014. Require issuer-authenticated 2014 surveillance instruction before cross-referencing.

**Delivery quality:** Structured source limitations, control register, states, APIs/events, 14 negative scenarios, P0/P1 gaps, and exact next task prepared. No production testing, static scans, DR exercises, source SHA-256, certification or regulator contact.
