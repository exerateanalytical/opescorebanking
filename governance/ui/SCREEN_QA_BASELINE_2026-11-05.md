# UI Screen Control and Gap Matrix — 2026-11-05
Branch `feature/core-banking-726-screen-workspace`; 726 routes defined (114 original draft IDs plus 612 proposed extensions).
## Explicit scope / non-completion
Every route renders a responsive reference workbench. Shared route navigation, search, tab switching, local drafts, transient inspection and discard are exercised in CI. **This is not 726 accepted banking workflows.**
- The four UI tabs are interactive on every route.
- Local drafts are available only for compatible layout families in the operator preview; NO production mutation.
- Server-side submit, independent approval, posting, reconciliation remain blocked; export and print are reserved for later scope.
- All 726 route IDs have a control-matrix row, but exact field mapping, authoritative API contract and per-screen visual acceptance remain open.
- Screens with simulated reference data must remain visibly marked synthetic.
## Audit evidence
GitHub Action `opes-ui-route-ci.yml` includes 726 route contract test, source scans and Chromium smoke audit. 5-width screenshots exercise ACT-UI-001 only, not all 726 layouts, therefore do not claim universal screenshot acceptance.
WCAG 2.2 AA color-pair tests cover semantic CSS tokens; full accessibility audit requires keyboard, screen reader, zoom and French string checks per screen. No standards certification claimed.
## Completion definition
Per screen: unique ID and product owner; full field schema; role matrix; non-bypassed client and server validation; complete tabs/buttons and business transitions; empty/loading/permission/error/offline states; user-approved responsive screenshots and WCAG manual checks; unit/integration/e2e security evidence; sign-off. Keep statuses NOT_ACCEPTED until all gates pass.
Source: `SCREEN_REGISTER.csv` and `SCREEN_CONTROL_MATRIX.csv`.
