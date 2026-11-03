# Checkpoint CQ — WP-ACC-005: conflicting 312 semantics and PCEC correction authority

Date: 2026-11-03. Predecessor: CP (verified from repository). Phase 4 — Accounting Core and Financial Integrity. **SAFE PARTIAL RESEARCH CHECKPOINT ONLY. WP-ACC-005 OPEN / P0 BLOCKED.**

## Direct primary-source verification in this run

1. COBAC I-2015/01, BEAC issuer-hosted text: https://www.beac.int/wp-content/uploads/2016/10/instruction_cobac_i_2015_01_pcec.pdf . Its Article 7(b) creates **312 — Crédits à moyen terme sensibles**, and Article 7(d) enumerates children **3121–3127** (document printed p.4–5, web-extracted lines 93–131). Article 8(b) creates **322 — Crédits à court terme sensibles** (printed p.6, lines 157–159), but Article 8(d) labels **312 — Crédits à court terme sensibles** while listing children **3220–3227** (printed p.7, lines 185–206). This is **not merely a parent/child prefix mismatch**: 312 already has a different explicit meaning under Article 7. An automated correction or literal import could silently collide two maturity classes. This finding extends CP.
2. COBAC R-99/01, issuer-hosted https://www.beac.int/wp-content/uploads/2016/10/cbR-99_01.pdf , Article 1 assigns certain divisional account amendments to the COBAC President; Article 2(a) authorizes the Secretary-General's **lettres PCEC** to correct PCEC errors/omissions and make minor subaccount changes; Article 2(b) separately covers **lettres CERBER** for reporting; Article 3 reserves other changes to COBAC regulations. The precise authority and form of any later correction must be verified, not presumed.
3. BEAC official COBAC instructions register https://www.beac.int/supervision-bancaire/instructions-de-cobac/ lists I-2015/01 and older PCEC-related instructions, but does not itself provide a correction letter for Article 8(d). Targeted indexed searches for `lettre PCEC` + 312/322 and I-2015/01 errata did not identify an authenticated correction. **Absence from indexed search is not evidence no correction exists.**

## New risk finding and negative control design

**P0 ACCOUNT-IDENTITY COLLISION**: A naive `account_number -> label` dictionary built from the printed 2015 instruction would give code 312 both `Crédits à moyen terme sensibles` and `Crédits à court terme sensibles`. Treat both as provenance-bearing source assertions, but do not merge or overwrite. Neither a database upsert nor a migration script may resolve the conflict by last-write-wins.

Proposed schema for a *research-only* crosswalk:
- `source_instrument_id`, `source_article`, `printed_page`, `literal_account_code`, `literal_label`, `parent_code`, `claimed_maturity_class`, `child_prefix`, `effective_from`, `effective_to`, `evidence_url`, `evidence_hash_status`, `authority_type`, `conflict_id`, `review_state`, `approved_mapping_id`.
- Record A: Article 7(b,d), code 312, maturity MEDIUM, children 3121–3127, source-supported.
- Record B: Article 8(d), code 312, maturity SHORT, children 3220–3227, source-supported **contradictory assertion**.
- Record C: Article 8(b), code 322, maturity SHORT, children 3220–3227 per Article 8(d), source-supported parent assertion; **do not infer an approved mapping from the combination**.
- `conflict_id=PCEC-I2015-ARTICLE8D-312-322`, `review_state=BLOCKED_AUTHORITY_REQUIRED` for any mapping affected by B/C.

Required fail-closed validation cases (specified, **NOT EXECUTED**):
1. Duplicate code 312 with incompatible maturity/semantic identity must fail a candidate taxonomy approval.
2. A source assertion whose printed parent is 312 but child code begins 322 must fail hierarchy approval; source assertion remains preserved.
3. Replacing 312 with 322 based solely on analyst inference must fail.
4. Attempting to post, report, reconcile or migrate through an unapproved ambiguous mapping must fail.
5. A correction letter without signature, issuing authority, effective date, instrument scope and authenticity review must fail approval.
6. An institution switching between PCEC and PCEMF based solely on an account code must fail.
7. Migration that would reclassify short/medium maturity without institution CFO approval and balanced reconciliation must fail.
8. Applying a retroactive mapping that rewrites posted immutable journals must fail.

## Review gates and status

Regulatory: primary discrepancy confirmed; no official correction verified. Financial integrity: maturity collision can contaminate loan reporting, classification and historical balances; **P0 stays open**. Architecture: immutable semantic identities and effective-dated mappings remain proposals. Security: maker-checker approval and evidence access controls required. AML/risk: classification changes may alter downstream exposures; not approved. Data: keep conflicting assertions and full provenance; original signed PDF bytes/hash not archived. Operations: require independent trial balance and subledger reconciliation before any eventual migration. Tests: scenarios specified, none executed. No production code, live accounting rule, compliance certification, or migration authorized.

## Execution accounting

Attempted 1 work package (WP-ACC-005 continuation); completed 0; kept open 1; blocked from closure 1. Safe partial checkpoint CQ documented. P0 resolved 0. Production code 0. Executable tests 0. Definition of Ready FAILED. No dependent work package advanced.

## NEXT EXACT TASK — CR

Obtain authenticated COBAC Secretary-General PCEC letters, corrigenda, or later signed account-chart amendments that address I-2015/01 Article 8(d). Compare their effective dates and authority with Articles 7 and 8, and determine whether a regulator-validated correction exists for the **312 medium-term / 322 short-term** conflict. If none can be obtained, preserve both literal assertions and the blocked mapping; develop a regulator clarification request draft and a versioned evidence acquisition register without approving production account mappings.
