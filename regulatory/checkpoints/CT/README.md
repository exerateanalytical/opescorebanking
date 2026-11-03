# Checkpoint CT — WP-ACC-005: official bulletin lineage and evidence-access boundary
Date: 2026-11-03. Predecessor: CS, retrieved from main commit c3312c2e850ecf1a2021f6cd060a64341f595824. Phase 4 Accounting Core and Financial Integrity.
STATUS: SAFE PARTIAL RESEARCH CHECKPOINT; WP-ACC-005 OPEN / P0 BLOCKED; Definition of Ready FAILED. No production code, account activation, migration, or tests.

## Fresh primary-source review and limits
1. BEAC official publications index https://www.beac.int/supervision-bancaire/publications/ identifies *Bulletin COBAC n°5* (2003), *n°6* (2004), *n°8* (2006), *n°9* (2007), and *n°10* (2008), as well as the *Plan comptable des établissements de crédit (1998)*. These are candidates for historical amendment-lineage review, not evidence of a correction in 2015 or later.
2. Official Bulletin no. 6 https://www.beac.int/wp-content/uploads/2016/10/Bulletin-COBAC-n%C2%B06.pdf : indexed text describes 2003 accounting reforms and regulations on organization of accounts, FX positions, securities and asset disposals. A direct full-PDF retrieval timed out this run; no page-level examination of I-2003/01 or the historical account numbers is claimed. Earlier CS identified I-2003/01 in this bulletin.
3. Official Bulletin no. 5 https://www.beac.int/wp-content/uploads/2016/10/Bulletin-COBAC-n%C2%B05.pdf : indexed text describes historical shortcomings in banks' formal accounting procedures, information systems and CERBER reporting. This is contextual operational risk evidence only, NOT a correction of the Article 8(d) code.
4. The issuer-hosted archive index https://www.beac.int/wp-content/uploads/2016/10/ exposes historical COBAC regulations, including R-98/01, R-99/01, R-2003/01, and amendments; file listing does not prove present validity or exhaustiveness.
5. Targeted issuer-domain search for PCEC letters referencing 312/322 did not produce an authenticated signed clarification. Non-discovery is not proof of absence.

## Continuing issue: PCEC-I2015-ARTICLE8D-312-322
Preserve literal verified assertions from CP/CQ: Article 7 assigns 312 to sensitive medium-term loans; Article 8(b) assigns 322 to sensitive short-term loans; Article 8(d) prints 312 for the short-term parent while enumerating children 3220–3227. This run did not revalidate original page images. A probable drafting error is an inference, not a legal correction. No production mapping may derive from the inferred substitution.

## Evidence-acquisition register delta
EV-CR-001 OPEN — obtain signed competent-authority clarification for 312/322; no new primary correction.
EV-CR-002 OPEN — establish subsequent amendment/supersession chain after I-2015/01.
EV-CR-003 OPEN — Bulletin 6 full-text/page inspection timed out; inspect I-2003/01 and older 1998 PCEC, plus bulletins 5/8/9/10 in exact publication order; record which provisions actually affect 312/322 rather than assuming.
EV-CR-004 OPEN — institution-specific legal/CFO decisions and signoffs.
EV-CR-005 OPEN — independent CERBER mapping authority and institution scope.
EV-CR-006 OPEN — acquire original document bytes, archive SHA-256 and page identifiers.
EV-CR-007 OPEN — legal/CFO transition analysis of R-2018/01 effective date.

## Engineering decisions and quality review (specification only)
Regulatory: do not infer authority from bulletin metadata or a document index. Record issuer, signed instrument, article/page, date, effective date, source digest and supersession links before changing regulatory mapping status.
Financial: block ambiguous leaf-account activation; preserve double entry, immutable journals, independent reconciliation, no direct balance mutation, no retroactive posting without approved correction entries.
Architecture/data: store source assertions and candidate interpretation separately, with conflict-group identity and immutable evidence history. Proposed decision states: SOURCE_OBSERVED, CONFLICT_CONFIRMED, AUTHORITY_PENDING, LEGAL_REVIEW_PENDING, CFO_REVIEW_PENDING, APPROVED; only an authenticated resolution may advance beyond AUTHORITY_PENDING.
Security/audit: maker-checker and least privilege for any future account-taxonomy change; signed evidence provenance and append-only decision audit. No implemented enforcement is claimed.
Risk/AML: avoid silent maturity or credit-risk reclassification; no provisioning parameter activation.
Operations/testing: prepare negative tests for conflicting active parent identities, absent signed authority, retroactive mutation, wrong institution profile and unreconciled migration; not executed.
Legal, financial, architecture, security, risk, data, operations, testability and auditor-evidence reviews all retain unresolved gates. No P0 resolved.

## Execution accounting
Work packages attempted 1; completed 0; open 1; blocked from closure 1. Partial safe checkpoint CT documented. Production code 0; tests executed 0. No dependent package advanced.

## NEXT EXACT TASK — CU
Retrieve and inspect official Bulletin COBAC no. 6 pages containing Instruction I-2003/01, cross-reference the 1998 PCEC and bulletins 5/8/9/10 for account 312/322 lineage with precise page and article citations; separately seek signed post-2015 PCEC corrigendum/letter. If no authoritative resolution, preserve BLOCKED_AUTHORITY_REQUIRED and improve the legal/CFO dossier without enabling accounting rules.
