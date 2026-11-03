# CIF-011 — Sanctions screening evidence and escalation workflow

OPES Core Banking | Batch 51/60 | 2026-11-03 | **DRAFT DELIVERED — REVIEW OPEN**

## Design objective
Specify accountable sanctioned-party checks using legally applicable lists and supervised investigation without assuming a match from name similarity.

## Candidate schema / evidence record
| Field | Type | Meaning |
|---|---|---|
| `screening_case_id` | `uuid` | stable screening investigation |
| `subject_party_id` | `uuid` | person/entity |
| `institution_id` | `uuid` | regulated customer |
| `list_provider_ref` | `string` | approved source identity |
| `source_edition` | `string` | retrieval/update version |
| `screened_at` | `datetime` | observation time |
| `candidate_hit_refs` | `list` | restricted possible matches |
| `match_disposition` | `enum` | potential/false_positive/confirmed/unresolved |
| `reviewer_ref` | `string|null` | compliance decision owner |
| `case_evidence_ids` | `list` | reason and legal source |

## Workflow
1. Select legally applicable active sanctions lists for institution profile.
2. Screen verified aliases, identifiers and corporate control parties as policy requires.
3. Record candidate match and exact source edition and matching feature class.
4. Block prohibited or unresolved actions under applicable policy while protecting case confidentiality.
5. Let authorized compliance examiner classify evidence and escalate real matches.
6. Retain immutable disposition, legal action and rescreen obligations.

## Mandatory proposed controls
1. **CIF-011-REQ-01** Fuzzy matching is a candidate alert and never a legally conclusive sanctions designation.
2. **CIF-011-REQ-02** Never suppress an unresolved potential match because a workflow timer expired.
3. **CIF-011-REQ-03** Screening provider availability is not assumed; unavailable sources trigger fail-safe risk controls.
4. **CIF-011-REQ-04** Keep list licensing, effective date, jurisdiction and evidence freshness individually traceable.
5. **CIF-011-REQ-05** Do not expose sensitive suspicion or list investigations to unauthorized customer-facing channels.
6. **CIF-011-REQ-06** Regulated account blocking/rejection follows reviewed legal rules, not a globally hardcoded threshold.

## Acceptance/negative tests (NOT RUN)
- [ ] **CIF-011-T01** Potential match cannot silently auto-clear.
- [ ] **CIF-011-T02** Unavailable source yields explicit pending screening state.
- [ ] **CIF-011-T03** Wrong list edition cannot support current approval.
- [ ] **CIF-011-T04** False-positive disposition records evidence and reviewer.
- [ ] **CIF-011-T05** Cross-institution review logs remain segregated.

## Gating and source status
**Before acceptance:** Applicable sanctions instrument inventory, authorized screening sources and qualified compliance escalation procedures.

This is a candidate design document only. Qualified legal/compliance review and effective-dated local rules must precede implementation. No banking code, executed tests, regulator approval or customer screening was performed. Unresolved accounting/payment P0 evidence does not become approved through this checkpoint.
