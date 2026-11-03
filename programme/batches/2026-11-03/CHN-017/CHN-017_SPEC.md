# CHN-017 — Accessibility, localization and low-vision inclusive banking UX

OPES Core Banking | Checkpoint batch 117 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Define readable, responsive interfaces and multilingual banking copy while preventing loss of financial meaning across screens or assistive technologies.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `screen_id` | `string` | canonical UI identity |
| `channel_type` | `enum` | web/mobile/corporate/agency |
| `locale` | `string` | language and regional formats |
| `accessibility_profile` | `string` | reviewed baseline |
| `focus_order` | `list` | keyboard sequence |
| `font_scale` | `string` | user preference |
| `money_format_rule` | `string` | currency number rendering |
| `error_code` | `string` | typed backend status |
| `translation_version` | `string` | approved copy |
| `audit_ref` | `uuid|null` | UX test evidence |

## Workflow and recovery design
1. Document task flows and financial confirmation screens on desktop/mobile.
2. Specify responsive layout with no clipping, overlap, excessive glow or cramped controls.
3. Support readable text scale, color contrast, keyboard and screen-reader semantics.
4. Localize currency, dates, banking terms and error explanations without changing amounts.
5. Design explicit pending/failed/unknown success states and accessible recovery.
6. Test representative assistive-tech users and record actual results.

## Invariants and enforcement requirements
1. **CHN-017-R01** Color is never sole indicator of account restriction or transaction status.
2. **CHN-017-R02** A visual success animation cannot replace settled server evidence.
3. **CHN-017-R03** Dynamic type resizing cannot hide amount, fee, recipient or confirmation details.
4. **CHN-017-R04** Do not translate regulated product terminology without legal/content review.
5. **CHN-017-R05** Focus order and error messages remain usable without mouse.
6. **CHN-017-R06** Responsive mobile experience should behave like a coherent app, not a clipped desktop page.
7. **CHN-017-R07** Customer authorization does not depend on inaccessible controls.

## Acceptance and negative scenarios — planned, not run
- [ ] **CHN-017-T01** 200% text zoom without overlapping payment controls.
- [ ] **CHN-017-T02** Screen reader announces amount, currency and recipient.
- [ ] **CHN-017-T03** Keyboard-only transaction review works.
- [ ] **CHN-017-T04** High contrast shows status without color-only cues.
- [ ] **CHN-017-T05** Localization retains same exact monetary value.

## Dependency and reviewer gate
Approved institution design system, accessibility criteria and real desktop/mobile/assistive-tech test runs.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
