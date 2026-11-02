# Checkpoint BT — BEAC issuer explanatory distinction and restitution applicability (2026-11-02)

**Programme:** OPES Core Banking / OPESWARE TECHNOLOGIES
**Phase:** 4 — Accounting Core and Financial Integrity
**Work package:** WP-ACC-005 (OPEN, P0 BLOCKED)
**Predecessor:** BS, GitHub main commit `58bb54e1cc96c4fea502d96b6fd18e2e5ba24be6`
**Scope:** Narrow BS category-definition uncertainty using BEAC primary institutional publications; retain legal/financial implementation holds.

## Verified delta
1. BEAC's *Revue de stabilité financière en Afrique centrale, édition 2024*, Encadré 3 (printed page 34) expressly states that Regulation 04/18 Article 5 includes **credit institutions, microfinance institutions and payment institutions** as payment-service providers. It distinguishes payment institutions' **exclusive** payment-service business from banks and microfinance. It cites COBAC R-2019/01 and R-2019/02, including R-2019/02 Article 6.
2. BEAC's *Rapport sur les services de paiement dans la CEMAC 2024* (issuer-hosted under 2026/04) separately discusses banks/EMFs providing payment services and more fluid procedures for reimbursement of erroneously transferred funds. This is sectoral context, not a legal interpretation of Circular 004/DGE/DSMP/2023.
3. **Resolution status:** BS-C01's *general PSP category definition* is more strongly evidenced. **The legal reach of Circular 004/2023 to a particular bank, product, rail, channel and contractual situation is NOT resolved.** Do not claim the circular exempts banks or universally binds every bank payment.
4. No issuer-signed amendment, corrigendum, institution agreement, signed legal opinion, approved PCEC mapping, SYGMA V10 or SYSTAC2 instant-production confirmation obtained. No original PDF binary/hash because the container's BEAC DNS lookup failed.

## Engineering consequence
Retain `institution_category` distinct from `payment_service_authorization`, `product`, `channel`, `rail`, `legal_scope_decision` and `participant_entitlement`. Restrict any automatic restitution timer, hold, release, debit, settlement or prudential treatment until applicable authority and bank-specific facts are verified. A legal-scope decision cannot itself post or reverse money.

See `SOURCE_EVIDENCE_AND_LIMITATIONS.md`, `SCOPE_RECONCILIATION_AND_POLICY_GATES.json`, `CONTROL_AND_TEST_DESIGN.md`, `QUALITY_REVIEW.md`, `CONTINUATION_STATE.json`, and `EXECUTION_REPORT.md`.

**DoR:** FAIL. **Single next task:** WP-ACC-005 — Checkpoint BU.
