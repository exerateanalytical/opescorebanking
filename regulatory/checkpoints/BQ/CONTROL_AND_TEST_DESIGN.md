# BQ — Rail rollout gate, settlement safety and negative acceptance design
**Design only; no production contracts, APIs, integrations or tests approved.** Extends BP, does not replace BP's 16 scenarios.

## Revised gates
1. **Issuer platform capability:** preserve exact evidence date and effective date; SYSTAC2 retail clearing issuer-confirmed live 3 Aug 2026. Separate instantaneous-payment module **not live as of 12 Aug**, no inferred subsequent launch. SYGMA V10 **unknown now**, despite 12 Aug forecast.
2. **Institution participation:** independently validate bank identity, direct/indirect participant status, signed scheme agreement, valid settlement account, operator entitlements, approved profile and test report; public launch alone fails.
3. **Message integrity:** versioned CEMAC-BANK schema, canonicalization/signature/transport requirements, replay defenses and exact authenticated source must be obtained; base ISO 20022 XML is insufficient.
4. **Settlement:** clearing acceptance, net obligation, SYGMA settlement-account movement, finality and statement reconciliation are distinct. A message type, time window, planned migration or user-facing success indicator cannot establish settlement.
5. **Accounting:** AccountingCore owns exact double-entry journal posting and corrections under bank-approved PCEC; rail adapters emit evidence events only. No direct balance mutation, no retry duplicate, no status-triggered money.
6. **Security/operations:** tenant-scoped rights, maker-checker for rail configuration and exception resolution, immutable audit, signed evidence retention, incident runbooks, outage queues, DR replay and reconciliation SLA require institutional sign-off.

## Candidate transitions (not authoritative scheme semantics)
`INSTRUCTION_AUTHORIZED → SUBMITTED → RAIL_ACKNOWLEDGED → CLEARING_CONFIRMED → SETTLEMENT_EVIDENCE_PENDING → EXTERNAL_SETTLEMENT_CONFIRMED → RECONCILED`. On missing/contradictory evidence enter `EXTERNAL_OUTCOME_UNKNOWN` or `RECONCILIATION_EXCEPTION`. Returns and cancellations are distinct workflows, not rewrites of immutable postings.

## 12 NEW negative acceptance scenarios — unexecuted
| ID | Given | Then |
|---|---|---|
| BQ-T01 | SYSTAC2 issuer production notice, bank contract absent | Reject participant-live and payment-rail readiness |
| BQ-T02 | SYSTAC2 3 Aug go-live interpreted as SYGMA V10 go-live | Reject cross-rail inferred activation |
| BQ-T03 | 12 Aug forecast of SYGMA V10 weeks ahead, no later issuer evidence | Keep SYGMA V10 status UNKNOWN, prohibit V10 adapter live |
| BQ-T04 | SYSTAC2 instant module exists in architecture, no activation evidence | Disable instant payment feature and promises |
| BQ-T05 | SYSTAC2 clearing ACK with no net settlement evidence | Do not mark externally settled or post on ACK alone |
| BQ-T06 | Net settlement confirmed but bank account statement mismatch | Open independent reconciliation exception; no fabricated liquidity |
| BQ-T07 | SYSTAC2 bank A conformance report used for bank B | Reject tenant/institution cross-scope certification |
| BQ-T08 | Valid generic ISO 20022 but wrong BEAC profile version | Reject/quarantine; do not claim compatibility |
| BQ-T09 | Bank is indirect participant but direct-settlement account assumed | Reject direct settlement claim and route configuration |
| BQ-T10 | 2025 migration annex dates conflict with 2026 issuer production | Preserve both records; actual SYSTAC2 launch from 2026 source only; no other inferred dates |
| BQ-T11 | DR replay resubmits payment with outcome unknown | Quarantine replay, investigate original external reference, no duplicate journal |
| BQ-T12 | Same privileged operator edits rail status, confirms settlement and closes recon | Reject SoD; retain tamper-evident audit trail |

## Executable-test prerequisites
Obtain authenticated issuer message specifications, signed bank agreement, finality evidence mapping, test tenant/rail simulator, exact PCEC journal rules, authorization matrix and recovery runbooks. Then implement property-based double-entry/idempotency tests, replay/failover tests, forged signature rejection, net settlement shortfall, delayed returns, cross-tenant isolation and reconciliation mismatch tests. **None executed here.**
