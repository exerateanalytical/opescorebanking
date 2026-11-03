# Checkpoint CO — WP-ACC-005: alternate text discovery and primary-source verification hold

Date: 2026-11-03. Predecessor: CN. Phase 4 Accounting Core and Financial Integrity. **SAFE PARTIAL RESEARCH CHECKPOINT; WP-ACC-005 OPEN / P0 BLOCKED.** No production implementation authorized.

## Newly acquired evidence (this run)

1. Official BEAC COBAC instructions index remains discoverable: https://www.beac.int/supervision-bancaire/instructions-de-cobac/ ; lists "Instruction COBAC I-2015 01 PCEC" as a 2015 approximately 6 MB document. Index listing confirms discoverability, **not verified article text**.
2. Direct official PDF retrieval at https://www.beac.int/wp-content/uploads/2016/10/instruction_cobac_i_2015_01_pcec.pdf timed out again. No Article 8 page image or signed source bytes were obtained.
3. An independently hosted secondary transcription was newly located at https://app.maathis.com/droit/cemac/circulaire/i-2015-01-instruction-n-instruction-cobac-i-201501-instruction-cobac-i-2015-01-p . Its publicly accessible portion contains the title, preamble, Article 1, Articles 2–3 and part of Article 4. It gates the rest behind login, so **Article 8 is not publicly accessible there**. The page itself says the official text controls and describes its summary as AI-generated. It is an **acquisition lead**, not an authority for financial rules.
4. A separate document listing at https://lc-doc.com/document/instruction-cobac-i-201501-du-06-juillet-2015-portant-modification-du-plan-comptable-des-etablissements-de-credit describes a 14-page, approximately 5.85 MB instruction. This is independent metadata only; no source-page verification.
5. Fresh web search for the literal combinations I-2015/01, 312, 322 and PCEC found no authoritative correction. This does **not** establish no corrigendum exists.

## Evidence classification and integrity

| Item | Status | Permitted use |
|---|---|---|
| Official BEAC instructions index | ISSUER INDEX VERIFIED | Source discovery and metadata |
| Official I-2015/01 Article 8 | UNAVAILABLE THIS RUN | None for account mapping |
| Third-party partial transcription, Articles 1–4 | SECONDARY PARTIAL TEXT | Search aid only; not operative ledger source |
| Article 8(d) printed 312 vs surrounding 322 | PREVIOUS-CHECKPOINT REPORT; NOT REVERIFIED | Preserve discrepancy as open P0 |
| Official PCEC letter/corrigendum resolving 312/322 | NOT LOCATED | No substitution allowed |
| R-2018/01 transition/retroactivity legal advice | NOT OBTAINED | No backdated migration or restatement |

The partial transcription includes historical provisioning rates in Article 2. These are **not activated**, since later rules and institution applicability are not reconciled. Do not copy secondary figures into parameter tables.

## Engineering quality gates and next acquisition protocol

- Before trusting any third-party mirror, obtain the issuer-signed original or an independently authenticated archival copy, preserve exact bytes and SHA-256, record retrieval date, printed page number, and whether signature/seal is visible.
- For Article 8(d), independently transcribe **both** the printed source account and the neighboring account hierarchy, with two-person review and explicit discrepancy field; do not normalize 312 to 322.
- Search COBAC/BEAC archives for *lettres PCEC*, corrigenda, and amendments; preserve negative-search logs as limited evidence, not proof of absence.
- Do not activate account migration, provision rates, reporting taxonomy, retroactive adjustment, or ledger posting until legal, regulatory, CFO and reconciliation approvals are evidenced.
- Continue distinct PCEC (credit institutions), PCEMF (microfinance), CERBER (reporting) boundaries. Keep SYGMA, participation and HSM/signing blockers unaffected.

## Multidisciplinary quality review

Regulatory: authoritative Article 8 and corrigendum missing (P0). Finance: no verified account semantics or trial-balance crosswalk (P0). Architecture: semantic ID/version contract remains proposed. Security: maker-checker and immutable evidence are requirements only. Risk/AML: no rule changes. Workflow/operations: fail closed; reconciliation and rollback not tested. Audit: source retrieval limitations explicitly recorded. No code, tests, or certifications.

## Execution accounting

Attempted 1 work package (WP-ACC-005 continuation); completed 0; kept open 1; blocked from closure 1. One **partial research checkpoint CO** documented; P0 resolved 0; production code 0; executable tests 0. No dependent package attempted. Definition of Ready: FAILED.

## NEXT EXACT TASK

**WP-ACC-005 — Checkpoint CP:** Acquire authenticated Article 8 source pages via the official COBAC/BEAC index or an independently authenticated archival copy; verify page/article/account-level 312/322 wording, then search issuer PCEC clarification letters and signed subsequent amendments for correction. If no authenticated pages are available, preserve the block and extend provenance/acquisition log without creating mappings.
