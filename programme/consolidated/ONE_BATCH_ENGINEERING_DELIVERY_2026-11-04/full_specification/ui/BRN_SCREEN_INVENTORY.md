# BRN: Branch and Cash screen and interaction specification
Status: PROPOSED. Desktop and mobile browser must behave as native-feeling applications; WCAG 2.2 AA design target; localization English/French, later regional language packs.
Global layout: desktop adaptive navigation and dense but readable tables; mobile navigation with task-first quick actions, strict maximum two dashboard columns, no horizontal overflow or overlapping controls; visible focus, keyboard navigation, reduced motion, no decorative glow.
## BRN-UI-001: branch-overview
Purpose: perform branch overview tasks within a bank-scoped role. Primary actors: institution operator, authorized reviewer, read-only auditor where appropriate.
Fields: institution/branch context (read-only), aggregate reference, state, effective policy, action reason, timestamps, assigned owner, evidence reference, command correlation. Domain-specific inputs: branch, cash_drawer, vault, cash_movement; render only authorized fields.
Actions: view, filter, search, inspect audit; create/edit only in allowed lifecycle; submit and approve separated by role; sensitive exports separately authorized.
States: initial loading, no data, validation error, permission denied, stale version, pending approval, external unknown, completed, failed reconciliation and offline read-only. Never display external success without proof.
UX: responsive 320px–large desktop, minimum 44x44 CSS px touch targets where practical, legible typography, accessible form labels/error summaries, no icon-only ambiguous actions; localized date/currency, masked sensitive data.
Acceptance: no clipping at 320/375/768/1024/1440px; keyboard-only operation; screen reader announcements for status changes; no color-only error signals; no privilege escalation via hidden controls.

## BRN-UI-002: cash-drawer
Purpose: perform cash drawer tasks within a bank-scoped role. Primary actors: institution operator, authorized reviewer, read-only auditor where appropriate.
Fields: institution/branch context (read-only), aggregate reference, state, effective policy, action reason, timestamps, assigned owner, evidence reference, command correlation. Domain-specific inputs: branch, cash_drawer, vault, cash_movement; render only authorized fields.
Actions: view, filter, search, inspect audit; create/edit only in allowed lifecycle; submit and approve separated by role; sensitive exports separately authorized.
States: initial loading, no data, validation error, permission denied, stale version, pending approval, external unknown, completed, failed reconciliation and offline read-only. Never display external success without proof.
UX: responsive 320px–large desktop, minimum 44x44 CSS px touch targets where practical, legible typography, accessible form labels/error summaries, no icon-only ambiguous actions; localized date/currency, masked sensitive data.
Acceptance: no clipping at 320/375/768/1024/1440px; keyboard-only operation; screen reader announcements for status changes; no color-only error signals; no privilege escalation via hidden controls.

## BRN-UI-003: vault-custody
Purpose: perform vault custody tasks within a bank-scoped role. Primary actors: institution operator, authorized reviewer, read-only auditor where appropriate.
Fields: institution/branch context (read-only), aggregate reference, state, effective policy, action reason, timestamps, assigned owner, evidence reference, command correlation. Domain-specific inputs: branch, cash_drawer, vault, cash_movement; render only authorized fields.
Actions: view, filter, search, inspect audit; create/edit only in allowed lifecycle; submit and approve separated by role; sensitive exports separately authorized.
States: initial loading, no data, validation error, permission denied, stale version, pending approval, external unknown, completed, failed reconciliation and offline read-only. Never display external success without proof.
UX: responsive 320px–large desktop, minimum 44x44 CSS px touch targets where practical, legible typography, accessible form labels/error summaries, no icon-only ambiguous actions; localized date/currency, masked sensitive data.
Acceptance: no clipping at 320/375/768/1024/1440px; keyboard-only operation; screen reader announcements for status changes; no color-only error signals; no privilege escalation via hidden controls.

## BRN-UI-004: cash-count
Purpose: perform cash count tasks within a bank-scoped role. Primary actors: institution operator, authorized reviewer, read-only auditor where appropriate.
Fields: institution/branch context (read-only), aggregate reference, state, effective policy, action reason, timestamps, assigned owner, evidence reference, command correlation. Domain-specific inputs: branch, cash_drawer, vault, cash_movement; render only authorized fields.
Actions: view, filter, search, inspect audit; create/edit only in allowed lifecycle; submit and approve separated by role; sensitive exports separately authorized.
States: initial loading, no data, validation error, permission denied, stale version, pending approval, external unknown, completed, failed reconciliation and offline read-only. Never display external success without proof.
UX: responsive 320px–large desktop, minimum 44x44 CSS px touch targets where practical, legible typography, accessible form labels/error summaries, no icon-only ambiguous actions; localized date/currency, masked sensitive data.
Acceptance: no clipping at 320/375/768/1024/1440px; keyboard-only operation; screen reader announcements for status changes; no color-only error signals; no privilege escalation via hidden controls.

## BRN-UI-005: eod
Purpose: perform eod tasks within a bank-scoped role. Primary actors: institution operator, authorized reviewer, read-only auditor where appropriate.
Fields: institution/branch context (read-only), aggregate reference, state, effective policy, action reason, timestamps, assigned owner, evidence reference, command correlation. Domain-specific inputs: branch, cash_drawer, vault, cash_movement; render only authorized fields.
Actions: view, filter, search, inspect audit; create/edit only in allowed lifecycle; submit and approve separated by role; sensitive exports separately authorized.
States: initial loading, no data, validation error, permission denied, stale version, pending approval, external unknown, completed, failed reconciliation and offline read-only. Never display external success without proof.
UX: responsive 320px–large desktop, minimum 44x44 CSS px touch targets where practical, legible typography, accessible form labels/error summaries, no icon-only ambiguous actions; localized date/currency, masked sensitive data.
Acceptance: no clipping at 320/375/768/1024/1440px; keyboard-only operation; screen reader announcements for status changes; no color-only error signals; no privilege escalation via hidden controls.

