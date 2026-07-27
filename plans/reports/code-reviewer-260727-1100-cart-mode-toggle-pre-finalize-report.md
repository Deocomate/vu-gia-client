# Cart-Mode Toggle — Pre-Finalize Review

Plan: `plans/260727-1003-cart-mode-toggle/plan.md` (6 phases). Reviewed uncommitted working-tree
changes across both submodules against every phase's Success Criteria and Red Team Fix list.

## Critical

### 1. Existing backend unit test now fails — Phase 6 gate not actually satisfied
`vu-gia-backend-api/src/test/java/vn/springboot/service/ContactRequestServiceImplTest.java` was not
updated when Phase 2 added `ApplicationEventPublisher eventPublisher` to
`ContactRequestServiceImpl`'s constructor. The test class only mocks
`ContactRequestRepository`/`ContactRequestMapper`/`UserRepository`; `@InjectMocks` leaves
`eventPublisher` null, so `create_savesRequestWithNewStatus` throws
`NullPointerException: Cannot invoke "ApplicationEventPublisher.publishEvent(Object)" because
"this.eventPublisher" is null` at `ContactRequestServiceImpl.java:100`.

Verified by running `mvnw.cmd test` directly: **310 tests run, 1 failure, build FAILS**
(`vn.springboot.service.ContactRequestServiceImplTest.create_savesRequestWithNewStatus`). This is
the only failure — every other test (including `ContactRequestControllerTest`) passes.

This directly violates:
- Phase 2 Success Criteria (implicit — "zero changes to `ContactRequestController`'s public
  contract" was honored, but the *service*'s test coverage broke without any test remediation).
- Phase 6 Step 1 / Success Criteria: "Backend: run existing test suite / `mvn test`... confirm no
  regressions" and "Backend test suite... green" — this was evidently never run, since `mvn compile`
  (which the orchestrator ran) does not execute tests and would not catch this.

Note this contradicts what was reported to the orchestrator ("all individually reported clean
lint/build/compile... a combined `mvn compile`... passed clean") — `mvn compile` only compiles
`src/main`, not `src/test`, and neither `mvn compile` nor `test-compile` executes tests, so this
regression was invisible to the verification that was actually run.

**Fix:** add `@Mock private ApplicationEventPublisher eventPublisher;` to the test class (Mockito
will auto-inject it into the constructor via `@InjectMocks`); no assertion changes needed since the
existing test doesn't need to verify the publish call, just not NPE.

## High

### 2. Phase 6 documentation requirement not done
Phase 6 Related Code Files mandates modifying 3 docs: `vu-gia-client/docs/system-architecture.md`,
`vu-gia-client/docs/admin-ui-architecture.md`, `vu-gia-backend-api/docs/system-architecture.md`.
`git status --porcelain docs/` in both repos shows zero changes — none of the 3 files were touched.
Phase 6 Success Criteria explicitly requires these "accurately describe the new flag, its
enforcement boundary (UI-only, no backend blocking)... and the new contact-notification email flow."
This is an unmet, explicit acceptance criterion, not an optional nice-to-have — the plan's own
`documentation-management.md`-driven scope calls this out as required because architecture/behavior
changed.

## Verified Correct (no findings — confirmed by reading code + running checks, not by trusting subagent reports)

- **Red-team Finding 1 (Critical) — both `handleAddToCart` and `handleBuyNow` gated at all sites.**
  Grepped `product-info.jsx` (3 render sites: mobile primary row, desktop primary row, sub-items
  accordion checkout row — all three branch on `cartEnabled` before exposing `onBuyNow`/`onAddToCart`)
  and `product-info-single.jsx` (desktop combined button switches label+handler on `cartEnabled`;
  "Thêm vào giỏ hàng" row conditionally rendered only when `cartEnabled`; mobile sticky bar branches
  the same way). No unguarded call site found.
- **Red-team Finding 2 (Critical) — seeder race fixed.** `SiteSettingSeeder` is a standalone
  `ApplicationRunner`, `@Transactional`, guarded by `count() > 0` check-then-insert at startup before
  traffic is served; steady-state `SiteSettingServiceImpl` uses plain `findById(1L).orElseThrow`, no
  lazy-create path. Confirmed `TransactionalDataCleaner` (dev-mode reseed) does not touch
  `site_setting`, so the seeder's "insert once ever" invariant holds across dev restarts. Confirmed
  `BaseEntity` uses `GenerationType.IDENTITY` with no uniqueness constraint (the exact hazard the
  seeder's javadoc describes) — the seeder correctly closes that gap.
- **Red-team Finding 3 (High) — redirect guard exact-path scoped.** `cart-mode-guard.jsx`'s
  `GATED_PATHS` is a `Set` of `ROUTES.CART` (`/gio-hang`) and `ROUTES.CHECKOUT` (`/thanh-toan`)
  matched via exact `pathname` equality — `/thanh-toan/ket-qua/[id]` cannot match a `Set.has()` exact
  check against `/thanh-toan`.
- **Red-team Finding 5 (High) — render-before-redirect window closed.** `CartModeGuard` returns a
  loading spinner (not `children`) when `gated && !isLoaded`, and returns `null` while
  `shouldRedirect` is true, before ever reaching `return children`.
- **Red-team Finding 6/High (content cap) + Validation Session 1 Q4 (2000 chars).**
  `ContactRequestCreateRequest.content` has `@Size(max = 2000)` confirmed.
- **Red-team Finding 7 (Medium) — no `th:utext`.** `contact-notification.html` uses `th:text`
  exclusively for all 5 dynamic fields including `content`; multi-line rendering handled via
  `white-space:pre-line` CSS, not raw HTML concatenation. Grepped the whole file for `utext` — zero
  matches.
- **Red-team Finding 8 (Medium) — correct allowlist array.** `/api/site-settings` is in
  `PUBLIC_GET_ENDPOINTS` (GET-scoped), not the unscoped `PUBLIC_ENDPOINTS`; `PUT` guarded separately
  by `@PreAuthorize("hasRole('SUPERADMIN')")` — defense-in-depth intact.
- **Red-team Finding 9 (Medium) — safe default.** `app.mail.contact-notify-to: ${CONTACT_NOTIFY_EMAIL:}`
  defaults to empty; `ContactRequestEmailListener` logs-and-returns when blank, never attempts to
  send to an empty address.
- **Red-team Finding 10 (Medium) — bridge no longer silent.** `site-config-bridge.jsx`'s `.catch`
  calls `console.error` before falling back to the default.
- **Red-team Finding 11 (Medium) — no mapper class added**, confirmed no `SiteSettingMapper.java`
  exists; `SiteSettingServiceImpl.toResponse` builds the DTO directly.
- **Red-team Finding 12 (Medium) — `base-confirm-dialog.jsx` extended, not duplicated.** New optional
  `children` prop is `undefined` for every pre-existing caller (`confirm-dialog.jsx`,
  `admin/confirm-dialog.jsx` both pass `{...props}` through with no `children`), so the branch
  defaults to the original description/footer path — verified no behavioral change for existing
  callers. `ContactModal` is the only caller using `children`, and `AdminSiteSettingsPage`'s save
  confirmation correctly reuses the admin-themed `ConfirmDialog` (description-only, no `children`) —
  no collision between Phase 4 and Phase 5's dialog usage.
- **Red-team Finding 13 (Medium) — role-check precedent copied correctly.**
  `AdminSiteSettingsPage.jsx` uses `currentUser?.role === ROLE.SUPERADMIN` sourced from
  `useAdminAuthStore`, matching the exact pattern verified in
  `src/features/admin/users/UsersAdminPage.jsx:163` (note: this file is at
  `src/features/admin/users/UsersAdminPage.jsx`, not `src/features/admin/UsersAdminPage.jsx` as the
  phase file's path suggests — same file, path drift only, not a functional issue).
- **`/lien-he` regression-free.** `contact-view.jsx` diff is a pure extraction — all
  state/handlers/JSX moved verbatim into `contact-form.jsx`; page chrome (hero, images) untouched.
- **`ContactRequestController` public contract unchanged** — zero diff on that file; only the
  service, one DTO, security config, and yaml changed.
- **Product-context prefill (Validation Q1)** wired correctly: `product-info.jsx`/
  `product-info-single.jsx` pass `productContext={{name, url}}` built from `product.name` +
  `absoluteUrl(...)`; `altar-customizer-summary.jsx` builds a combo description from selected line
  items via existing `getItemText` helper since there's no single product identity there — matches
  the phase's documented adaptation.
- **Redirect target is `/lien-he`** (Validation Q2) — `router.replace(ROUTES.CONTACT)`.
- **Confirm-dialog gates the admin save** (Validation Q3) — `AdminSiteSettingsPage.jsx`'s Save button
  only opens the dialog; the actual `adminApi.put` call happens inside `save()`, invoked only by the
  dialog's `onConfirm`; Cancel calls `setConfirmOpen(false)` only, never reaching `save()`.
- **Backend compiles clean** (`mvnw.cmd -q compile`, `mvnw.cmd -q test-compile`) and **frontend lint
  clean** (`npm run lint`) — both re-verified directly in this review, not just trusted from the
  orchestrator's summary.
- **`EmailService.sendHtml` signature match**, `ApiResponse.success` envelope `code=1000` matches
  `publicGet`'s success check, `AsyncConfig`'s `@EnableAsync`/`taskExecutor` bean already present —
  no new async config needed, confirmed present.
- No leftover TODO/FIXME comments in either repo's diff.

## Not Re-Flagged (accepted plan tradeoffs, correctly left alone)
- No backend enforcement of cart/coupon APIs when `cartEnabled=false` (documented non-goal).
- No real-time propagation to already-open tabs (documented non-goal); `SiteConfigBridge` re-fires
  per route-group mount as the plan's corrected Finding 4 describes — this is expected, not a bug.
- `ContactModal` doesn't auto-close on successful submit (shows an inline success message instead,
  same as `/lien-he`) — this matches the extracted `ContactForm`'s existing UX exactly, not a
  regression introduced by this plan; not flagging as a new defect since Phase 4's spec never asked
  for auto-close-on-success.

## Recommended Actions
1. **Blocking:** Fix `ContactRequestServiceImplTest` (mock `ApplicationEventPublisher`) and re-run
   `mvnw.cmd test` to confirm all 310 tests pass before considering Phase 2/Phase 6 done.
2. **Blocking (per Phase 6's explicit Success Criteria):** Write the 3 required doc updates
   (`vu-gia-client/docs/system-architecture.md`, `vu-gia-client/docs/admin-ui-architecture.md`,
   `vu-gia-backend-api/docs/system-architecture.md`) covering the new site-setting entity/endpoints,
   contact-notification email flow, site-config store/bridge, and the bespoke admin settings page.
3. Non-blocking: consider running the plan's own Phase 6 manual test steps (2-6) in a live dev
   environment before marking the plan `status: done` — this review verified code-level correctness
   and automated tests/lint/compile, not live email delivery or browser-level manual flows.

## Unresolved Questions
- None — all red-team findings and validation-session decisions were traceable to specific code and
  verified directly.
