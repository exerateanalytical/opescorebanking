# PRD: Product Factory screen and interaction specification
Status: PROPOSED. Desktop and mobile browser must behave as native-feeling applications; WCAG 2.2 AA design target; localization English/French, later regional language packs.
Global layout: desktop adaptive navigation and dense but readable tables; mobile navigation with task-first quick actions, strict maximum two dashboard columns, no horizontal overflow or overlapping controls; visible focus, keyboard navigation, reduced motion, no decorative glow.
## PRD-UI-001: product-catalog
Purpose: perform product catalog tasks within a bank-scoped role. Primary actors: institution operator, authorized reviewer, read-only auditor where appropriate.
Fields: institution/branch context (read-only), aggregate reference, state, effective policy, action reason, timestamps, assigned owner, evidence reference, command correlation. Domain-specific inputs: product, product_version, pricing_rule, eligibility_rule; render only authorized fields.
Actions: view, filter, search, inspect audit; create/edit only in allowed lifecycle; submit and approve separated by role; sensitive exports separately authorized.
States: initial loading, no data, validation error, permission denied, stale version, pending approval, external unknown, completed, failed reconciliation and offline read-only. Never display external success without proof.
UX: responsive 320px–large desktop, minimum 44x44 CSS px touch targets where practical, legible typography, accessible form labels/error summaries, no icon-only ambiguous actions; localized date/currency, masked sensitive data.
Acceptance: no clipping at 320/375/768/1024/1440px; keyboard-only operation; screen reader announcements for status changes; no color-only error signals; no privilege escalation via hidden controls.

## PRD-UI-002: product-builder
Purpose: perform product builder tasks within a bank-scoped role. Primary actors: institution operator, authorized reviewer, read-only auditor where appropriate.
Fields: institution/branch context (read-only), aggregate reference, state, effective policy, action reason, timestamps, assigned owner, evidence reference, command correlation. Domain-specific inputs: product, product_version, pricing_rule, eligibility_rule; render only authorized fields.
Actions: view, filter, search, inspect audit; create/edit only in allowed lifecycle; submit and approve separated by role; sensitive exports separately authorized.
States: initial loading, no data, validation error, permission denied, stale version, pending approval, external unknown, completed, failed reconciliation and offline read-only. Never display external success without proof.
UX: responsive 320px–large desktop, minimum 44x44 CSS px touch targets where practical, legible typography, accessible form labels/error summaries, no icon-only ambiguous actions; localized date/currency, masked sensitive data.
Acceptance: no clipping at 320/375/768/1024/1440px; keyboard-only operation; screen reader announcements for status changes; no color-only error signals; no privilege escalation via hidden controls.

## PRD-UI-003: rate-schedule
Purpose: perform rate schedule tasks within a bank-scoped role. Primary actors: institution operator, authorized reviewer, read-only auditor where appropriate.
Fields: institution/branch context (read-only), aggregate reference, state, effective policy, action reason, timestamps, assigned owner, evidence reference, command correlation. Domain-specific inputs: product, product_version, pricing_rule, eligibility_rule; render only authorized fields.
Actions: view, filter, search, inspect audit; create/edit only in allowed lifecycle; submit and approve separated by role; sensitive exports separately authorized.
States: initial loading, no data, validation error, permission denied, stale version, pending approval, external unknown, completed, failed reconciliation and offline read-only. Never display external success without proof.
UX: responsive 320px–large desktop, minimum 44x44 CSS px touch targets where practical, legible typography, accessible form labels/error summaries, no icon-only ambiguous actions; localized date/currency, masked sensitive data.
Acceptance: no clipping at 320/375/768/1024/1440px; keyboard-only operation; screen reader announcements for status changes; no color-only error signals; no privilege escalation via hidden controls.

## PRD-UI-004: approval
Purpose: perform approval tasks within a bank-scoped role. Primary actors: institution operator, authorized reviewer, read-only auditor where appropriate.
Fields: institution/branch context (read-only), aggregate reference, state, effective policy, action reason, timestamps, assigned owner, evidence reference, command correlation. Domain-specific inputs: product, product_version, pricing_rule, eligibility_rule; render only authorized fields.
Actions: view, filter, search, inspect audit; create/edit only in allowed lifecycle; submit and approve separated by role; sensitive exports separately authorized.
States: initial loading, no data, validation error, permission denied, stale version, pending approval, external unknown, completed, failed reconciliation and offline read-only. Never display external success without proof.
UX: responsive 320px–large desktop, minimum 44x44 CSS px touch targets where practical, legible typography, accessible form labels/error summaries, no icon-only ambiguous actions; localized date/currency, masked sensitive data.
Acceptance: no clipping at 320/375/768/1024/1440px; keyboard-only operation; screen reader announcements for status changes; no color-only error signals; no privilege escalation via hidden controls.

