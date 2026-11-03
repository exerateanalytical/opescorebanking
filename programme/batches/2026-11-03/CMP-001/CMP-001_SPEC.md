# CMP-001 — Compliance authority inventory and effective-dated rule catalogue

Batch 141 | OPES Core Banking | 2026-11-03 | DRAFT, REVIEW OPEN

## Purpose
Preserve legal and internal policy provenance for institution-specific compliance controls without presenting drafts or international guidance as current binding law.

## Candidate data model
| Name | Type | Intent |
|---|---|---|
| `rule_id` | uuid | Unique obligation |
| `institution_id` | uuid | Regulated applicability |
| `issuer_code` | string | Authority identity |
| `instrument_ref` | string | Primary-source reference |
| `article_ref` | string | Precise clause |
| `effective_from` | date | Verified start |
| `supersedes_ref` | uuid | Controlled amendment |
| `reviewer_id` | string | Qualified legal compliance |
| `rule_state` | string | Discovered reviewed approved blocked |

## State transitions and guards
1. DISCOVERED>UNDER_REVIEW:source acquired
2. UNDER_REVIEW>APPROVED:legal authentication
3. UNDER_REVIEW>CONFLICTED:ambiguous text
4. APPROVED>SUPERSEDED:verified amendment
5. CONFLICTED>APPROVED:competent clarification

## Workflow and recovery
1. Identify jurisdiction and licensed institution class
2. Capture authentic instrument metadata and source custody
3. Map each clause to obligation, rule and affected capabilities
4. Verify amendment chain and legal effective date with qualified reviewer
5. Activate only rules with signed accountable approval

## Required controls
1. CMP-001-REQ-01: An index snippet does not establish legal effective obligation
2. CMP-001-REQ-02: Conflicting primary text remains unresolved, never guessed
3. CMP-001-REQ-03: FATF/Basel/ISO guidance does not automatically become local law
4. CMP-001-REQ-04: Source digitization must preserve page, article and issuer attribution
5. CMP-001-REQ-05: Unverified or overlapping policy revisions fail closed
6. CMP-001-REQ-06: Historic transactions remain interpretable under earlier approved rules

## Acceptance cases — NOT RUN
- [ ] CMP-001-T01: Conflicted source cannot activate rule
- [ ] CMP-001-T02: Two overlapping effective versions rejected
- [ ] CMP-001-T03: Unverified issuer provenance blocked
- [ ] CMP-001-T04: Prior date reproduces original rule
- [ ] CMP-001-T05: Wrong institution policy reference denied

## Evidence gate
Authenticated primary legal documents, qualified local counsel and independent compliance signoff.

Code: none. Tests executed: zero. Independent review: pending. No regulatory certification. Historical accounting 312/322 and bank-specific rail participation P0s remain blocked.
