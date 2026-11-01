# AU — Regulatory lineage isolation and financial safety guards (PROPOSED, NON-EXECUTABLE)
These controls refine AT's source-type gate by separating a historical policy negotiation from the later law and from later implementing proposals. They are design decisions for review, not deployed software.

## AU-G01 — Source event is not legal authority
Represent each dated item as a source event with issuer, source type, instrument/topic, phase (draft consultation / adoption communiqué / issuer-certified instrument / publication / judicial order / implementing text), cited proposition, acquisition provenance and reviewer. A communiqué may establish that its issuer made a statement, not the complete law or a certified court effect. A press release must never be upgraded to an enacted instrument by metadata similarity.

## AU-G02 — Never collapse the two regulated subjects
CDC supervision scope and inactive-account/asset handling are distinct regulatory questions. The 15 April 2025 disagreement on **total versus banking-only CDC supervision** must not automatically suspend or invalidate inactive-account duties. The two July 2025 regulations require separately verified texts and separately adjudicated litigation. Model a subject-scoped evidence decision, not one global "CEMAC_2025_APPROVED" flag.

## AU-G03 — Preserve chronology without treating it as monotonic legal authority
An earlier draft can be superseded by a later adopted text; a later consultation may concern supplementary rules rather than replacing an existing regulation. Store draft lineage separately from enacted instrument versions, legal effect and implementing measures. Neither a 2026 draft nor a 2025 pre-adoption consensus may overwrite a policy or retroactively alter an account's classification or a posted journal.

## AU-G04 — Four independent holds before money moves
(i) authentic complete applicable text and publication/legal effect, including court status; (ii) institution-specific legal/compliance and AML/claimant checks; (iii) CFO-approved PCEC journal templates and account treatment; (iv) separately authorized external settlement and independent reconciliation. All four are presently unfulfilled for automated dormant-asset transfer. Source-ingestion and research-review actions have zero financial side effects.

## AU-G05 — Negative transitions and audit reconstruction
On conflicting official statements, absent printed page, uncertain court effect, wrong bulletin series or disputed institution profile: mark the exact proposition ON_HOLD, preserve previous decisions and evidence links, alert legal reviewer, prohibit activation, and avoid implicit retries. External transfer outcome UNKNOWN remains UNKNOWN pending authoritative confirmation. Historical posted journals are immutable; corrections require linked reversal and new entries.

## AU-G06 — Scope/retention and source-custody separation
No customer PII is needed for legal source discovery. Keep evidence-document access controlled; record original PDF hash only after bytes are acquired. A visible seal, URL or text extracted from a PDF does not equal cryptographic issuer verification. Any legal-hold/retention decision must be approved per institution profile.

## Dependency decision
WP-ACC-005 remains OPEN_P0_BLOCKED. Do not start financial implementation, automated dormancy transfer, account closure or legal-policy activation. This checkpoint's documentation may be reviewed without assuming it satisfies Definition of Ready.