# BRN-008 — Vault-drawer cash handover and conserved custody transfers

OPES Core Banking — Batch 128 | 2026-11-03 | DRAFT DELIVERED / REVIEW OPEN

## Purpose
Enforce two-sided receipt, exact denominations and independent custody handoff for physical bank cash.

## Data contract
| Field | Type | Intent |
|---|---|---|
| `handover_id` | `uuid` | Idempotent transfer |
| `institution_id` | `uuid` | Bank owner |
| `source_ref` | `uuid` | Vault or drawer |
| `target_ref` | `uuid` | New custodian |
| `currency` | `string` | Exact currency |
| `denominations` | `array` | Counted component list |
| `released_at` | `datetime` | Source handoff |
| `received_at` | `datetime` | Target handoff |
| `exception_ref` | `uuid` | Mismatch proof |

## State transitions and guards
1. REQUESTED>AUTHORIZED:dual approval
2. AUTHORIZED>DISPATCHED:source manifest signed
3. DISPATCHED>RECEIVED:target count verified
4. RECEIVED>RECONCILED:totals equal
5. ANY>DISPUTED:loss or mismatch

## Controlled workflow
1. Verify both custodians and institution boundaries
2. Reserve counted source cash under authorized policy
3. Record source release with signed denomination manifest
4. Count destination receipt independently
5. Reconcile amount and exceptions without editing customer journals

## Required invariants
1. BRN-008-R01: Cash transit must remain explicit until receiving proof
2. BRN-008-R02: Source release alone cannot credit destination inventory
3. BRN-008-R03: Duplicate transfer command cannot double transfer custody
4. BRN-008-R04: Sender may not self-sign sole receiver acceptance
5. BRN-008-R05: Cash operations respect bank physical insurance and risk limits
6. BRN-008-R06: Different legal entities require separate approved treatment

## Negative and acceptance tests — NOT EXECUTED
- [ ] BRN-008-T01: Two receipts cannot add twice
- [ ] BRN-008-T02: Mismatched denominations create dispute
- [ ] BRN-008-T03: Cross-bank target rejected
- [ ] BRN-008-T04: Missing recipient signature leaves in transit
- [ ] BRN-008-T05: Self-approval violates custody policy

## Approval gates
Dual-custody policy, physical count, security and variance evidence.

Evidence status: drafted design only; no executable banking tests or production code. No regulator or institutional signoff. Historic WP-ACC-005 P0 312/322 and bank-specific rail participation unresolved.
