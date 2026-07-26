---
name: project-admin-cms-cleanup-ux-polish
description: Status snapshot of the 260726-1053 admin-cms-cleanup-ux-polish 7-phase plan pre-finalize review (2026-07-26)
metadata:
  type: project
---

Plan `plans/260726-1053-admin-cms-cleanup-ux-polish` (backend boolean-serialization fix across 9
resources + admin frontend UX polish + Products/Orders/Users generic-engine migration) was
reviewed pre-finalize on 2026-07-26. All critical red-team-flagged risks held (base-confirm-dialog
zero diff, ShippingMethod reference zero diff, entities untouched, saving→preventClose threading
correct in AdminResourceManager + Users' 3 modals). `npm run lint`/`build` clean, backend
`mvn clean compile` clean.

**Why this matters for future reviews:** one blocking issue was found that the implementation
reports missed — see [[backend-test-compile-verification-gap]] (`BannerServiceImplTest.java`
broke at test-compile due to the `Boolean` wrapper accessor rename; fixed in-review, 2-line
change, mirrors `ShippingMethodServiceImplTest.java`'s pattern). Also found: a genuine
modal-dismiss-during-save race in the *new* Phase 6 Orders row-action modal
(`OrdersAdminList.jsx`'s `OrderStatusModal` doesn't thread `OrderStatusControls`'s internal
`saving` state into the wrapping `Modal`'s `preventClose`, unlike every other modal in the same
phase) — the exact race class the plan's own red-team review (finding #6) was written to prevent,
but the mitigation wasn't applied consistently to this one new integration point.

**How to apply:** the working tree also contained unrelated, pre-existing `APP_ENV`/Flyway
dev-mode changes (`.env.example`, `docker-compose.yml`, `application.yaml`,
`application-development.yaml`) not part of this plan at all (confirmed present before Phase 1
started, per its own report) — flag these as needing separate commit/review, don't conflate with
this plan's diff when it's finally committed.
