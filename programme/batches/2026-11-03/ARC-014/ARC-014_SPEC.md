# ARC-014 — External systems and anti-corruption integration boundaries

**OPES Core Banking | Batch 34/60 | 2026-11-03 | DRAFT DELIVERED; REVIEW OPEN**

## Objective
Keep external registries, financial networks, correspondent systems and supervisory feeds from changing core domain semantics without approved translation rules.

## Candidate domain contract
| Attribute | Type | Meaning |
|---|---|---|
| `connector_id` | `string` | registered external system |
| `institution_id` | `uuid` | participant/entity boundary |
| `counterparty_type` | `enum` | registry/payment/credit/reporting/provider |
| `adapter_version` | `string` | reviewed translation edition |
| `external_ref` | `string` | foreign unique reference |
| `internal_ref` | `uuid` | owned domain record |
| `payload_digest` | `string` | retained original-message integrity marker |
| `observed_at` | `timestamp` | time evidence observed |
| `source_status` | `enum` | accepted/rejected/unknown |
| `reconciliation_id` | `uuid|null` | independent verification link |

## Process
1. Validate institution entitlement and external endpoint configuration.
2. Send authorized request with stable correlation and idempotency identifiers.
3. Retain safe request/response provenance under data minimization policy.
4. Translate external statuses through versioned anti-corruption adapter.
5. Mark ambiguous outcomes unresolved pending reconciliation.
6. Escalate mismatches with operator review and full audit chain.

## Design invariants
1. **ARC-014-R01** Never equate external message acknowledgement with settled funds.
2. **ARC-014-R02** Do not embed an external provider's status model directly into core ledger posting rules.
3. **ARC-014-R03** Version adapters and preserve the raw-response evidence needed for audit.
4. **ARC-014-R04** Require secure mutual identity/signing policy from the actual participant contract.
5. **ARC-014-R05** Only sanctioned external reference values may be retained in customer records.
6. **ARC-014-R06** Keep remote outage from causing an automatic duplicated financial command.

## Tests to execute (NONE RUN)
- [ ] **ARC-014-T01** Reject an adapter schema version not approved for that participant.
- [ ] **ARC-014-T02** External timeout creates explicit unknown outcome without reposting.
- [ ] **ARC-014-T03** Retry same external correlation does not create two internal effects.
- [ ] **ARC-014-T04** Cross-institution adapter credentials cannot be used.
- [ ] **ARC-014-T05** Malformed external status never passes as settlement evidence.

## Definition of Ready / acceptance
Institution-specific contracts, message/profile versions, security credentials and qualified payments/legal review.

**Safety and provenance:** draft based on the verified repository programme baseline and inherited CT checkpoint. Historical WP-ACC-005 P0 COBAC 312/322 issue and unverified institution payments entitlements remain blocked. No executable code, independently accepted WP, real tests or institutional/regulatory certification asserted. Require named reviewers and source evidence.
