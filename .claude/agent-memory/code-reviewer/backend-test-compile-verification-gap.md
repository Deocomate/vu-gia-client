---
name: backend-test-compile-verification-gap
description: vu-gia-backend-api Lombok boolean-wrapper changes can break test source compilation even when `mvn compile` (main only) is clean — always run test-compile/test too
metadata:
  type: feedback
---

When a Response DTO field changes from primitive `boolean` to wrapper `Boolean` (or vice versa)
in `vu-gia-backend-api`, Lombok's generated accessor names change:
- primitive `boolean isActive` → getter `isActive()`, setter `setActive(boolean)` (Lombok strips
  the redundant "is" for the setter only).
- wrapper `Boolean isActive` → getter `getIsActive()`, setter `setIsActive(Boolean)` (treated as a
  normal object field, no special boolean-prefix handling).

Builder methods (`.isActive(true)`) are unaffected either way (Lombok `@Builder` always uses the
literal field name), but any test that calls the bean-style getter/setter directly breaks silently
at compile time.

**Why:** During the 260726 admin-cms-cleanup-ux-polish plan review, `BannerResponse.isActive`
was changed to `Boolean` (Phase 1's fix for a MapStruct/Jackson serialization bug — see
[[project-admin-cms-cleanup-ux-polish]]). The implementing agent's report claimed "no code path
relevant to [existing tests] changed" and ran only `mvn compile` (main sources). This was false:
`BannerServiceImplTest.java` called the old `r.setActive(...)` / `result.isActive()` accessor
names directly (not via builder), which no longer existed after the type change —
`mvnw test-compile` failed with "cannot find symbol". `mvn compile` alone did not catch this
because it only compiles `src/main/java`, not `src/test/java`. The already-correct reference
resource (`ShippingMethodServiceImplTest.java`) already used `setIsActive(...)`, confirming the
naming convention and providing the exact fix pattern.

**How to apply:** When reviewing any change to a Lombok-managed field's type (primitive↔wrapper)
in this repo, always run `./mvnw test-compile` (or `./mvnw test`) yourself — do not trust an
implementation report's claim that "tests weren't affected" based on main-only compile success.
Grep the test tree for direct (non-builder) getter/setter calls on the changed class
(`\.setXxx(`, `\.isXxx()`) before concluding zero blast radius.
