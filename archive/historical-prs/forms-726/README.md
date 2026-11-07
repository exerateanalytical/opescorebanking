# OPES Core Banking — Forms and transactional workflow contracts

This branch depends on the 726-screen prototype branch. It uses the same screen IDs and implements one form UI contract per screen (including read-only/query definitions). It does **not** implement or authorize banking transactions.

## How to use
Serve the repository root (e.g. Python static HTTP server), and browse to /apps/opes-core-banking-forms/.
No backend is connected and the app must never be used with real customer or financial data.

## Contents
- 726 typed, traceable form contracts, one per screen.
- Capture mode only for editable screens; review, search, monitor and history screens are nonmutating.
- Screen-specific proposed field specifications, conditional-required sections, email/date/integer checks, equal debit-credit leg checks and XAF denomination verification.
- Browser-only in-memory synthetic drafts. Clearing the page clears drafts. No localStorage, cookies, uploads, remote assets, API calls or authoritative customer records.
- Explicitly disabled submission, approval, ledger posting, settlement and reconciliation controls.
- Responsive UI at 320/375/768/1024/1440 px; tested keyboard focus, empty states and validation errors.
- Per-screen JSON form contract export plus comprehensive CSV matrices and SHA-256.

## Review requirements (NOT MET)
Bank-specific mandatory fields and conditional logic; CEMAC/BEAC/COBAC regulations and effective law review; source-of-truth ownership; authenticated institution tenant/branch scope; trusted server validation; product policy versioning; separate maker-checker roles; postings/settlement invariants; audit/evidence/provenance; idempotency; retry/unknown-outcome holds; multilingual accessibility and screen-by-screen sign-off.

The form layer remains a prototype until all controls pass formal acceptance. No form in this branch should be described as production-ready.

## Next planned phase
Reports and reporting templates follow **after** form validation/functional acceptance work. The 407 standalone document specimen PR remains independent.
