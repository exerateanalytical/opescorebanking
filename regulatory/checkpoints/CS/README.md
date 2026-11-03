# Checkpoint CS — WP-ACC-005: source-backed legal/CFO decision dossier (partial, fail-closed)
Date: 2026-11-03. Predecessor: CR, verified repository file. Phase 4 Accounting Core and Financial Integrity.
STATUS: SAFE PARTIAL RESEARCH CHECKPOINT. WP-ACC-005 OPEN / P0 BLOCKED. NOT READY FOR PRODUCTION. No tests run.

## Verified sources and evidentiary boundaries
1. COBAC I-2015/01 issuer-hosted original: https://www.beac.int/wp-content/uploads/2016/10/instruction_cobac_i_2015_01_pcec.pdf . The prior CQ/CP record documents source-page verification of Article 7 (312 medium-term sensitive credit) and Article 8(b,d) (322 short-term sensitive credit but 312 printed as parent in 8(d) with children 3220–3227). This run re-discovered the official instruction listing and document; it does not claim fresh independent visual examination of all pages.
2. R-99/01 official: https://www.beac.int/wp-content/uploads/2016/10/cbR-99_01.pdf . Article 1 provides Presidential instruction authority for divisionary account changes; Article 2(a) provides Secretary-General *lettres PCEC* clarification/error-correction authority; Article 2(b) separately covers CERBER. This is the authority hierarchy for remediation.
3. Official instructions index https://www.beac.int/supervision-bancaire/instructions-de-cobac/ lists I-2015/01 and I-2002/01, but the displayed list alone does not establish a current consolidated chart or absence of letters.
4. NEW contextual primary-source discovery: COBAC Bulletin no. 6, https://www.beac.int/wp-content/uploads/2016/10/Bulletin-COBAC-n%C2%B06.pdf , reproduces Instruction I-2003/01 amending PCEC and I-2002/01. This confirms historical amendment material exists in an official bulletin outside the instruction index; it does NOT resolve 312/322 and must not be treated as such.
5. Official microfinance PCEMF: https://www.beac.int/wp-content/uploads/2016/10/Plan-comptable-des-e%CC%81tablissements-de-microfinance-PCEMF-janvier-2010.pdf . Distinct institution taxonomy.
Targeted current issuer-domain search did NOT produce an authenticated PCEC letter, signed corrigendum, or binding later amendment resolving Article 8(d). Search non-discovery is not proof of nonexistence.

## Decision dossier — pending regulator / qualified counsel / institution CFO
Issue PCEC-I2015-ARTICLE8D-312-322. Source assertions must be stored literally, never normalized silently.
Decision options:
- A: Competent-authority authenticated corrigendum/letter explicitly clarifies 312→322, with scope/effective date: evaluate, independently transcribe, obtain legal/CFO approval, then propose versioned mapping. NOT CURRENTLY AVAILABLE.
- B: Later binding signed amendment changes affected taxonomy: establish exact supersession, dates, institution class and retrospective treatment before proposing mapping. NOT CURRENTLY AVAILABLE.
- C: No authoritative clarification: maintain BLOCKED_AUTHORITY_REQUIRED, preserve both literal assertions and inferred candidate only as non-executable research; no posting, migration, reclassification or reporting on disputed mapping. CURRENT SAFE DISPOSITION.
Decision evidence required: document issuer, signature/authenticity, legal authority, document date, effective date, relevant articles/pages, institution scope, source URL/archive hash, supersession chain, independent reviewer, CFO signoff, and reconciliation/test approval. Never infer a regulatory rule from the child-number prefix alone.

## Proposed controls (design only, not implemented)
RegulatoryRuleEvidence {evidence_id, issuer, instrument_id, article, page, source_url, sha256_nullable, authenticity_state, publication_date_nullable, effective_from_nullable, effective_to_nullable, institution_profile, review_state}.
AccountAssertion {source_evidence_id, literal_code, literal_label, parent_code_nullable, child_codes, assertion_kind, contradiction_group_id, interpretation_state}.
Activation gate: deny when contradictory active assertions, unknown authority, unapproved institution profile, missing effective-date determination, missing independent legal/CFO review, or reconciliation test absent. Use maker-checker and append-only audit events. Reject any attempt to rewrite posted journal lines; future corrections require balanced, authorized, independently reconciled journal entries.
Retrospective treatment of R-2018/01 remains a separate legal/CFO decision; do not backdate accounting effects from date text alone.
CERBER mappings and PCEMF applicability must remain separate; do not turn a PCEC chart inference into regulatory reporting or microfinance postings.

## Evidence register delta from CR
EV-CR-001 OPEN: no authenticated 312/322 clarification.
EV-CR-002 OPEN: no complete later signed supersession chain.
EV-CR-003 OPEN: new official Bulletin no. 6 discovery gives historical amendment trail for investigation, not resolution.
EV-CR-004 OPEN: institution-specific counsel/CFO approvals absent.
EV-CR-005 OPEN: CERBER mapping unverified.
EV-CR-006 OPEN: source bytes/hash not archived this run.
EV-CR-007 OPEN: R-2018/01 transition legal treatment unresolved.

## Quality assurance / run accounting
Regulatory: failed authority gate. Accounting: fail closed; immutable journals and double-entry remain non-negotiable. Security: provenance and dual approval specified only. AML/risk: avoid silent maturity reclassification. Data/audit: versioned literal assertions proposed. Operations: reconciliation and compensating correction required for any eventual migration. Testing: no executable tests performed; no code written. No P0 resolved.
Work packages attempted 1; completed 0; open 1; blocked 1. One safe partial documentation checkpoint CS; no dependent work advanced. Definition of Ready FAILED.

## NEXT EXACT TASK — CT
Inspect the official COBAC Bulletin no. 6 and subsequent official bulletins for PCEC amendment/clarification lineage relevant to accounts 312/322; seek authenticated Secretary-General *lettre PCEC* or signed correction for I-2015/01 Article 8(d). Update the evidence register with exact instrument/article/page/effective-date provenance. If none, keep disputed mappings blocked and refine the regulator-facing legal/CFO dossier; no production financial rules.
