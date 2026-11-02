# BR — multidisciplinary review and unresolved P0 (2 November 2026)
| Perspective | Review | Status |
|---|---|---|
| Regulatory/legal | Three-page signed 2023 BEAC circular inspected; PSP scope and potential later supersession not established; no automatic cross-rail adoption | P0 OPEN |
| Accounting integrity | Restitution is separate authorized transfer; no edit to original immutable posting, no fictitious available funds | P0 OPEN pending PCEC |
| Architecture | Case management, funds hold, rail evidence, AccountingCore and reconciliation boundaries proposed | Unapproved ADR |
| Security/cryptography | Bank-specific message authentication, RMA/profile versions, signing and HSM boundary absent | P0 OPEN |
| AML/fraud | Fraud/judicial holds may override automatic release; precedence requires legal approval | OPEN |
| Workflow/state | Claims, notification, hold, consent, nonresponse, dispute, judicial and external-unknown states separated | Design only |
| Data/privacy/retention | Evidence minimization, timestamps, retention and court order requirements need institution policy | OPEN |
| Payments/finality/recon | BEAC legacy SYGMA page is not V10 status; vendor participant count is not per-bank entitlement | P0 OPEN |
| DR/operations | Replay, clock reset, outage, delayed response and insufficient funds are explicitly unsafe | OPEN |
| Test/audit | 16 negative scenarios specified, 0 executed; original circular binary/hash unavailable | OPEN |
| Usability/accessibility | Distinct 'submitted', 'held', 'returned', 'disputed', 'externally settled' labels proposed; no UI code | OPEN |
| Maintainability/performance | Effective-dated rules, policy version and bitemporal evidence; no performance tests | OPEN |
| Regulator/auditor evidence | Signed issuer-hosted scan visually read; no bank contract, current legal opinion or scheme certification | P0 OPEN |

**Review decision:** WP-ACC-005 NOT READY. No dependent package, production code, financial test, regulatory request, security scan or P0 closure. Do not silently assume PSP circular applies to every bank product. Preserve all BQ, COBAC, PCEC, 01/25–02/25 holds. Single next checkpoint BS.