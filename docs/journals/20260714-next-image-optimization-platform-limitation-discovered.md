# Next.js Image Optimization: Platform Limitation Discovered Mid-Project

**Date**: 2026-07-14
**Severity**: Medium
**Component**: Image loading pipeline (next/image, MinIO, client-side fallbacks)
**Status**: Resolved (with accepted degradation)

## What Happened

Completed the "Fix client image loading (MinIO auto-mirror) + next/image optimization" plan across 4 phases: infrastructure (minio-init service, docker-compose wiring), client-side SafeImage component (fallback/unoptimized pattern), image optimization audit (46 sites with missing `sizes` prop, priority cleanup), and verification (happy/degraded/upload paths). All acceptance criteria met except one hard constraint: achieving "0 _next/image 500 errors when MinIO is down" proved technically impossible due to Next.js platform architecture.

## The Brutal Truth

This hurt. We spent the better part of a day architecting what we thought was a bulletproof fail-soft strategy (SafeImage with client-side onError fallback), only to discover mid-phase-2 that Next.js's built-in `/_next/image` optimizer fetches remote images **server-side** before the browser ever sees the response. On first-request for any given image-size variant, if MinIO is unreachable, the optimizer returns 500 to the browser *before* the client-side onError handler can fire. This is a platform limitation, not a bug we can fix in code—and it directly contradicts the original success criterion.

The frustrating part: we validated this assumption *after* writing SafeImage and instrumenting 13 files, not before. A 30-minute read of the Next.js Image documentation would have surfaced this. Instead, we discovered it empirically during degraded-path testing.

## Technical Details

- **The Limitation**: next/image's `/_next/image` optimizer runs server-side. When remote (MinIO) is down, the optimizer cannot fetch the image, returns HTTP 500 to the browser, and this happens *before* the client-side onError callback is invoked. Client-side fail-soft (SafeImage) cannot intercept a 500 from the server's optimizer.
- **Root Symptom**: Degraded-path test showed 500 errors on first-request variants: `/images/products/id-large.jpg` → optimizer returns 500 → browser doesn't reach client-side onError.
- **Code Review Catch**: Two real bugs found post-implementation:
  1. `next.config.mjs` line ~35: `new URL(process.env.NEXT_PUBLIC_IMAGE_BASE_URL)` would crash `next build` if env var is malformed or undefined—no try/catch. Fixed with fallback to default.
  2. `SafeImage.jsx` line ~18: ternary `useFallback ? true : props.unoptimized` was awkward—simplified to `unoptimized={useFallback || props.unoptimized}`.
- **Pre-Existing Work**: Diff review revealed ~200 lines of DB renames, CMS/nav/newsletter logic in Header/Footer/HomeHero/FactoryView—all uncommitted from an in-progress plan (260713-1234-storefront-api-seo-wiring), not introduced this session. Flagged to user rather than mixed in.

## What We Tried

1. Client-side onError fallback in SafeImage → doesn't work; server returns 500 before browser can react.
2. Removing `priority` from below-fold images → helps but doesn't solve first-request 500.
3. Setting `unoptimized` on all SafeImage instances → would work but defeats image optimization gains.
4. Server-side try/catch in next.config.mjs → doesn't help; the optimizer itself fails, not the config.

## Root Cause Analysis

Next.js's image optimizer is a server-side reverse proxy. It fetches, transforms, and caches remote images *on the server*. If the remote is unreachable on the **first fetch of a given variant** (e.g., 640×480), the server cannot complete the response and returns 500. The client never gets the chance to handle this gracefully because the HTTP 500 *is* the complete transaction.

This is not a bug; it's how the optimizer is designed. The assumption that "client-side onError can catch all failures" was flawed from the start.

## Lessons Learned

1. **Validate Assumptions Early**: Before architecting around a Next.js feature, read the actual code or docs. A 30-minute spike saves a half-day of implementation.
2. **Platform Constraints Are Real**: Some failures are not fixable in your code layer. Accept graceful degradation where the platform forces it.
3. **Code Review Catches Platform Blindness**: The reviewer caught the try/catch miss and the ternary awkwardness—automation would have too if we'd run lint with strict rules.
4. **Distinguish Scope Creep from Debt**: The pre-existing work (DB renames, CMS wiring) was unrelated. Flagging it explicitly rather than silently reverting kept the handoff clean.
5. **Document Limitations, Not Just Features**: "We accept 500 on first-request MinIO outage" is a valid, documented trade-off. Future devs need to know why image optimization sometimes fails and when.

## Next Steps

1. User to review all uncommitted changes (both repos) and commit in their preferred split.
2. Update code-standards.md to document the "first-request 500 on remote failure" platform limitation and when to use `unoptimized=true` as a workaround.
3. Monitor production image 500s to see if real-world MinIO downtime is frequent enough to justify forcing `unoptimized=true` later.
4. Pre-existing work (260713-1234-storefront-api-seo-wiring) should be committed separately to keep commit history clean.

