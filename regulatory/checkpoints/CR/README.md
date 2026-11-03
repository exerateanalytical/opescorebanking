# Checkpoint CR — WP-ACC-005: regulator clarification request and controlled evidence acquisition

Date: 2026-11-03. Predecessor: CQ (GitHub main verified at 5b21d98e009453232522d5ab70041d6517f38107 before this run). Phase 4 — Accounting Core and Financial Integrity. **SAFE PARTIAL RESEARCH CHECKPOINT; WP-ACC-005 OPEN / P0 BLOCKED; NO PRODUCTION IMPLEMENTATION.**

## 1. Evidence and scope
- Source of the conflict (issuer-hosted): https://www.beac.int/wp-content/uploads/2016/10/instruction_cobac_i_2015_01_pcec.pdf — I-2015/01, Article 7(b,d): 312 = *Crédits à moyen terme sensibles*, children 3121–3127; Article 8(b): 322 = *Crédits à court terme sensibles*; Article 8(d): prints 312 for *Crédits à court terme sensibles* but lists 3220–3227. These observations were verified in CQ; this run does not claim a fresh page-image verification.
- Governing correction authority (issuer-hosted): https://www.beac.int/wp-content/uploads/2016/10/cbR-99_01.pdf — R-99/01, Article 2(a) expressly authorizes the COBAC Secretary-General to issue *lettres PCEC* for errors/omissions and clarifications; Article 2(b) distinguishes CERBER reporting letters.
- Fresh public source discovery: https://www.beac.int/supervision-bancaire/instructions-de-cobac/ lists I-2015/01 and older instructions. Targeted indexed queries for COBAC PCEC letters + 312/322 and 2015 errata did not return an authenticated correction. **Not found in the public index does not mean nonexistent.**
- Additional institution boundary: https://www.beac.int/wp-content/uploads/2016/10/Plan-comptable-des-e%CC%81tablissements-de-microfinance-PCEMF-janvier-2010.pdf describes a distinct PCEMF taxonomy; do not import PCEC account interpretations into PCEMF.
- No signed clarification letter, authenticated amended chart, full historical supersession chain, or source-byte hash was obtained this run. All unresolved provenance fields remain UNKNOWN, not invented.

## 2. Regulatory question / disposition
Conflict ID: PCEC-I2015-ARTICLE8D-312-322.
Literal source assertions:
A. Article 7: code 312, medium-term sensitive credit, children 3121–3127.
B. Article 8(b): code 322, short-term sensitive credit.
C. Article 8(d): printed code 312, short-term sensitive credit, children 3220–3227.
**Candidate interpretation (NOT APPROVED):** Article 8(d) may contain a typographical substitution 312 for 322. The contradictory printed text must be retained unchanged. Only authenticated competent-authority clarification or sufficiently authoritative subsequent amendment plus legal review can approve any correction.
Disposition: BLOCKED_AUTHORITY_REQUIRED. No account mapping, posting, reporting, migration, loan maturity reclassification or balance rewrite from this candidate interpretation.

## 3. Formal regulator clarification request — DRAFT, NOT SENT
**Objet : Demande de clarification officielle — Instruction COBAC I-2015/01, article 8(d), comptes 312 et 322 du PCEC**

À l'attention du Secrétariat Général de la Commission Bancaire de l'Afrique Centrale (COBAC),

Dans le cadre de travaux de conception d'un système d'information bancaire destiné à respecter les référentiels comptables applicables aux établissements de crédit de la CEMAC, nous sollicitons une clarification documentaire concernant l'Instruction COBAC I-2015/01.

L'article 7(b) désigne le compte 312 « Crédits à moyen terme sensibles ». L'article 8(b) désigne le compte 322 « Crédits à court terme sensibles ». Toutefois, l'article 8(d) fait référence au compte 312 « Crédits à court terme sensibles » tout en énumérant les subdivisions 3220 à 3227.

Nous vous saurions gré de confirmer :
1. Si la référence « 312 » à l'article 8(d) doit être lue « 322 », ou si une autre interprétation officielle s'applique.
2. S'il existe une lettre PCEC, un erratum, une instruction ou une modification ultérieure traitant de ce point ; dans l'affirmative, sa référence, sa date, son autorité signataire et sa date d'effet.
3. Le traitement applicable aux périodes historiques et aux états déclaratifs, le cas échéant, ainsi que la portée exacte selon les catégories d'établissements concernés.
4. La disponibilité d'une version consolidée officielle du PCEC et des éventuelles lettres PCEC applicables.

Dans l'attente d'une réponse authentifiée, aucune correction automatique de ce libellé ni aucune migration de comptes fondée sur une interprétation non confirmée ne sera appliquée dans notre conception.

Veuillez agréer l'expression de notre considération distinguée.

OPESWARE TECHNOLOGIES — équipe d'ingénierie du programme OPES Core Banking.

**Transmission status: NOT SENT.** No claim of COBAC receipt or endorsement. Final signature, recipient channel and institutional representation must be verified before sending.

## 4. Versioned evidence acquisition register — CR v1
| ID | Evidence needed | Source/authority | Verification requirement | State | Blocking impact |
|---|---|---|---|---|---|
| EV-CR-001 | Signed PCEC clarification for Article 8(d) | COBAC SG under R-99/01 Article 2(a) | issuer, signature, exact wording, scope, effective date, authentic copy/hash | NOT OBTAINED | P0 |
| EV-CR-002 | Later signed amendments/consolidated PCEC | COBAC/BEAC | provision-by-provision supersession, issuer, dates, applicability | NOT VERIFIED | P0 |
| EV-CR-003 | Historical PCEC original and amendment lineage | COBAC/BEAC | exact code/label/page and effective-period crosswalk | INCOMPLETE | P0 |
| EV-CR-004 | Institution-specific applicability and CFO/legal interpretation | licensed institution's authorized reviewers | documented institution type, sign-offs, controlled effective dates | NOT OBTAINED | P0 |
| EV-CR-005 | Reporting mapping for CERBER | authoritative reporting instructions | separate account-to-report mapping, period, version, reconciliation | NOT VERIFIED | P1/P0 if reporting activated |
| EV-CR-006 | Authentic source bytes and SHA-256 | official document download/archive | immutable source copy, retrieval timestamp, SHA-256, page references | NOT ARCHIVED | Evidence quality |
| EV-CR-007 | Retrospective transition treatment of R-2018/01 | COBAC + qualified legal/CFO review | Article 33 effective date vs adoption, transitional instruction, historical adjustment policy | OPEN | P0 for retroactive rules |

## 5. Proposed controls / negative acceptance cases (SPECIFIED, NOT EXECUTED)
- Reject conflicting semantic assignments to the same effective-dated institution-specific account code.
- Reject an Article 8(d) import where the declared parent 312 conflicts with child prefix 322; retain literal evidence.
- Reject inferred substitution 312→322 without authenticated authority and maker-checker/legal/CFO sign-off.
- Reject financial posting, historical migration, CERBER reporting or loan reclassification using a BLOCKED mapping.
- Reject retroactive changes that mutate immutable posted journals; corrections require authorized balanced journal entries.
- Reject a correction letter with unverified issuer, signature, scope or effective date.
- Reject accidental application of PCEC interpretations to PCEMF institutions.
- Require evidence hash, versioned rule provenance, audit trail, and independent reconciliation before any future migration.

## 6. Quality review and execution status
Regulatory: conflict remains, official clarification absent; fail. Financial integrity: collision cannot be allowed to contaminate balances; fail closed. Architecture: preserve three distinct source assertions and immutable semantic identities; design only. Security: controlled evidence review and dual approval; design only. AML/risk: maturity classifications must not silently change exposure classifications. Data/privacy: immutable provenance and access control proposed. Payments: no impact approved. Resilience/operations: rollback by compensating journals, independent reconciliation proposed. Testability: negative cases specified, none run. Auditor readiness: no signed corrective authority, hence not ready. No production code, no executable tests, no certified mapping.

**Run accounting:** attempted 1 substantive work package (WP-ACC-005 continuation); completed 0; open 1; blocked from closure 1. Safe partial documentation checkpoint CR. P0 resolved 0. Definition of Ready FAILED. No dependent work package advanced.

## NEXT EXACT TASK — CS
Obtain an authenticated COBAC Secretary-General *lettre PCEC*, signed corrigendum, or subsequent binding amendment resolving I-2015/01 Article 8(d)'s 312/322 contradiction; verify signature, scope, effective date and provision-level supersession. If unavailable, continue targeted issuer evidence acquisition and prepare a source-backed legal/CFO decision dossier, keeping all disputed mappings blocked and all production financial rules inactive.
