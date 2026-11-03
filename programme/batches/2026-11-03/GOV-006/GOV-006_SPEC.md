# GOV-006 — Regulatory source inventory and controlled taxonomy

OPES Core Banking | 2026-11-03 | Batch 6/30 | Status: DRAFT DELIVERED; WP ACCEPTANCE PENDING
Source context: governance/PROGRAMME_RECOVERY_BASELINE_2026-11-03.md; regulatory/checkpoints/CP/README.md; regulatory/checkpoints/CT/README.md. No fresh regulatory certification claimed.

## Scope and control requirements
1. **GOV-006-R01:** Index applicable authorities by issuer, instrument type, identifier, article, official URL, language, signature, date, effective interval and scope.
2. **GOV-006-R02:** Create issuer classes for BEAC, COBAC, CEMAC/UMAC, GABAC, national authorities and OHADA without asserting universal applicability.
3. **GOV-006-R03:** Tag FATF, Basel, PCI, ISO, NIST and OWASP by normative versus guidance status; guidance does not automatically become binding law.
4. **GOV-006-R04:** Keep retrieved-source observations, human interpretations, issuer corrections and institution policy decisions as distinct evidence classes.
5. **GOV-006-R05:** Record supersession edges at article level; a later publication or index entry does not itself prove repeal.
6. **GOV-006-R06:** Require source-file hash only when original bytes were retained; never manufacture PDF digests from web snippets.
7. **GOV-006-R07:** Set acquisition states DISCOVERED, PAGE_INSPECTED, ORIGINAL_BYTES_HELD, AUTHORITY_VERIFIED, LEGAL_REVIEWED, SUPERSEDED.

## Artifacts required for full WP acceptance
- Regulatory source schema
- Authority inventory categories
- Evidence status rubric

## Acceptance criteria — open until review
- [ ] AC-1: Every operational rule links to authority
- [ ] AC-2: Unverified effective dates never activate rules
- [ ] AC-3: No standards-guidance-to-law promotion

## Evidence and approval blockers
- Current primary-source coverage incomplete; signed corrections pending

## Assurance constraints
Preserve immutable posted journals, exact monetary arithmetic, double entry, evidence-based settlement, least privilege, maker-checker and independent reconciliation where implicated. No production code, execution tests, approval or certification is claimed. Next: assign reviewers and validate acceptance evidence.
