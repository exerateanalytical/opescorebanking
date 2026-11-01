# AS — Requirement and control delta (NON-EXECUTABLE)
These are proposed design requirements, not implemented contracts, compliance certification or legal opinions. Retain AR source-to-policy gate and financial integrity invariants.

## Proposed requirements
- **AS-R01 Adoption-event provenance**: store `AdoptionEventEvidence` with issuing organ, meeting date, instrument subject, source URI, visual/custody status and precise proposition proved. Do not equate a communiqué's subject description to a certified numbered instrument.
- **AS-R02 Evidence proposition graph**: track `ADOPTION_BY_SUBJECT`, `NUMBER_TITLE_MATCH`, `SIGNED_TEXT_COMPLETE`, `BULLETIN_PUBLICATION`, `EFFECTIVE_DATE`, `COURT_EFFECT`, `IMPLEMENTING_TEXT`, `INSTITUTION_APPROVAL` as independently reviewable assertions, each with source IDs, confidence/authority class, reviewers and supersession history.
- **AS-R03 No negative inference from press silence**: subsequent communiqués and public catalogues can yield `NOT_LOCATED_IN_SCOPED_SEARCH`, never `NOT_ADOPTED` or `NOT_PUBLISHED` without competent issuer-certified negative confirmation.
- **AS-R04 Evidence custody separation**: a web URL and visual inspection are not equivalent to original PDF binary, issuer-certified copy, signature validation, complete page inventory or SHA-256. Store separate custody and authenticity statuses. Never invent hashes.
- **AS-R05 Regulatory policy non-execution**: adoption-event confirmation cannot trigger account dormancy transfer, liability derecognition, accounting posting, beneficiary release or external settlement. Independent legal applicability, bank-specific PCEC mapping, maker-checker, AML/fraud checks and external settlement reconciliation remain mandatory.
- **AS-R06 Conflict and amendment handling**: any newly acquired signed instrument conflicting with the communiqué/third-party copy must preserve all source versions and enter `LEGAL_REASSESSMENT_REQUIRED`; no retroactive journal mutation or automatic transfer replay.
- **AS-R07 API/event design constraint**: any future evidence event must include immutable `source_id`, `proposition_id`, `authority_class`, `source_version`, `review_decision_id`, `evidence_custody_status`, `recorded_at` and idempotency key; events are informational and must have **zero** accounting side effects.

## Proposed state and responsibility boundaries
1. `ADOPTION_EVENT_OBSERVED` (official communiqué) is a separate evidence node, **not** a promotion of the AR `PUBLICATION_VERIFIED` or `LEGAL_EFFECT_REVIEWED` state.
2. Regulatory Evidence Registry owns source metadata and evidence propositions; Legal Applicability owns issuer/legal interpretation and certified judicial effects; Policy Governance owns controlled activation; Accounting Core owns only journals; Payments owns instructions/outcomes; independent Reconciliation owns external matching.
3. Maker cannot approve own evidence proposition. Legal approver cannot substitute for CFO/PCEC approver. No UI-only authorization; privileged changes require tamper-resistant audit and segregation of duties.
4. Financial operation idempotency, exact arithmetic, double-entry and immutable posted journals remain unchanged. Unknown external outcomes remain unresolved pending independent reconciliation.

## Existing gaps — no new IDs allocated
- **GAP-ACC-057 OPEN P0**: full signed 02/25, printed page 10 and Articles 23–26.
- **GAP-ACC-064 / GAP-ACC-068 OPEN P0**: separate certified case registry and operative court dispositions.
- **GAP-ACC-066 OPEN P0**: COBAC–MINFI original and bank-specific PCEC/settlement approvals.
- **GAP-ACC-069 OPEN P0 candidate**: instrument-specific publication issue/page/date and effective-date chain; now explicitly distinguish adoption communiqué evidence from this missing proof.
- **GAP-ACC-070 OPEN P1**: policy approval, source cryptographic authenticity and exception recovery implementation evidence.
No P0 resolved by AS. All requirements are proposals pending cross-disciplinary review and DoR.
