\# Code Reviewer Memory Index

- [Backend test-compile verification gap](backend-test-compile-verification-gap.md) — `mvn compile` (main-only) passing is not sufficient for vu-gia-backend-api; always run `mvnw test-compile`/`test` too.
- [Admin CMS cleanup plan status](project-admin-cms-cleanup-ux-polish.md) — 260726 plan, 7 phases, reviewed pre-finalize, 1 critical fix applied.
- [Altar UX/admin-nav cleanup plan status](project-altar-ux-admin-nav-cleanup.md) — 260728 plan; plan files live in parent repo, not vu-gia-client/plans; clean review, 2 minor nits only.
- [Altar canvas: trace DOM event flow, don't trust prose](feedback-altar-canvas-trace-dom-event-flow.md) — pointer-events-none silently killed a click-to-select handler; verify hit-testing/bubbling, not docblock claims.
