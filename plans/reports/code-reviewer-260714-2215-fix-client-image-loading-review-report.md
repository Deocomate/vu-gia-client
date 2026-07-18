# Code Review: Fix client image loading (MinIO auto-mirror) + next/image optimization

Note: `plans/260714-2052-fix-client-image-loading/plan.md` referenced in the task does not exist in the repo (verified via Glob/Read) — reviewed directly against the acceptance criteria stated in the task prompt instead.

## Scope
- Backend: `docker-compose.yml` (uncommitted diff)
- Frontend: `next.config.mjs`, `src/lib/media.js`, `src/components/shared/SafeImage.jsx`, plus ~26 component/view files listed in the task, all uncommitted.

## Overall Assessment
The core mechanism is sound: `SafeImage` correctly gates on `<Image>` elements whose `src` comes from API data (`formatImageUrl()` output), raw `<img>` fallback branches (cart/checkout/orders, ImageBlock/ImageGridBlock, 5 admin components) are untouched, `formatImageUrl()` signature is unchanged (string→string), and the `sizes` audit is real — spot-checked values match their actual container widths, not copy-pasted. Two things need attention before landing: an unrelated MySQL DB rename/password change bundled into `docker-compose.yml`/`application.yaml`, and scope drift in `Header.jsx`/`Footer.jsx`/`HomeHero.jsx`/`FactoryView.jsx` where unrelated feature work (categories-driven nav, newsletter subscription, CMS-driven hero content) is interleaved with the image fix in the same files.

## Critical Issues
None found in the image-loading mechanism itself.

## High Priority

1. **Unrelated, breaking DB rename bundled into the reviewed backend diff.** `docker-compose.yml` changes `MYSQL_DATABASE: dev_db` → `db_vu_gia_fullstack` and `application.yaml` changes the datasource default URL/port/password (`localhost:3306/dev_db` → `localhost:3307/db_vu_gia_fullstack`, password `rootpassword` → `admin`). This has nothing to do with MinIO/image loading. Any dev with an existing `mysql_data` volume will silently get a fresh empty `db_vu_gia_fullstack` schema on next `docker compose up` (old `dev_db` data still sits in the volume but is no longer referenced) — looks like data loss. This should be split out of the image-fix change set or called out explicitly as an intentional, separate migration.
   - `C:\Users\minhlong\Desktop\projects\vu-gia-fullstack\vu-gia-backend-api\docker-compose.yml`
   - `C:\Users\minhlong\Desktop\projects\vu-gia-fullstack\vu-gia-backend-api\src\main\resources\application.yaml`

2. **`next.config.mjs` will crash `next build` on a malformed `NEXT_PUBLIC_IMAGE_BASE_URL`.** `new URL(imageBase)` at module scope throws uncaught if the env var is set but not a valid absolute URL (e.g. missing protocol). Low likelihood given the documented `.env.example`, but there's no guard/try-catch, so a bad prod env var takes down the entire build rather than failing with an actionable message.
   - `C:\Users\minhlong\Desktop\projects\vu-gia-fullstack\vu-gia-client\next.config.mjs:1-2`

## Medium Priority

1. **Scope drift: unrelated feature work mixed into files touched by the image fix.** `Header.jsx` and `Footer.jsx` gained a full category-driven nav rewrite and a newsletter-subscription form (new props, new `publicPost` API call, toast wiring); `HomeHero.jsx` was rewritten to consume `banners`/`categories` props (dropped `"use client"`, replaced static category/banner arrays with API-driven data); `FactoryView.jsx` gained CMS `page` hero content. None of this is the "fix image loading + next/image optimization" task — it's a separate storefront-API-wiring feature (matches `plans/260713-1234-storefront-api-seo-wiring`). This isn't a defect in the image-fix logic itself (which is applied correctly on top), but it makes the diff hard to review/rollback independently and violates the stated task scope. Recommend confirming with the user whether this was intentionally bundled or is bleed-over from a different in-progress session.
   - `C:\Users\minhlong\Desktop\projects\vu-gia-fullstack\vu-gia-client\src\components\shared\Header.jsx`
   - `C:\Users\minhlong\Desktop\projects\vu-gia-fullstack\vu-gia-client\src\components\shared\Footer.jsx`
   - `C:\Users\minhlong\Desktop\projects\vu-gia-fullstack\vu-gia-client\src\components\home\HomeHero.jsx`
   - `C:\Users\minhlong\Desktop\projects\vu-gia-fullstack\vu-gia-client\src\views\FactoryView.jsx`

2. **Pre-existing double-`priority` pattern on product detail pages not addressed by the "≤2 priority per route" audit.** `ProductInfo.jsx` and `ProductInfoSingle.jsx` both render a mobile carousel image with `priority={idx === 0}` AND a desktop main-display `<Image priority>` in the same DOM (CSS-hidden per breakpoint, not unmounted) — that's 2 priority images from this one component, plus the `Header.jsx` logo (`priority`) also fires on every route including product-detail. That's 3 priority images preloaded on the product-detail route, contradicting the stated goal. Not a regression from this diff (these `priority` lines are unchanged context, not part of the audit's edits), but the audit's stated goal ("≤2 priority images per route") is not actually met on `/san-pham/[slug]`. Worth a follow-up.
   - `C:\Users\minhlong\Desktop\projects\vu-gia-fullstack\vu-gia-client\src\components\product-detail\ProductInfo.jsx:70,119`
   - `C:\Users\minhlong\Desktop\projects\vu-gia-fullstack\vu-gia-client\src\components\product-detail\ProductInfoSingle.jsx:70,119`

## Low Priority

- `SafeImage.jsx` sets `unoptimized={true}` only on fallback (placeholder) render — harmless since it's a local static import, but the ternary against `props.unoptimized` is unnecessary complexity if the intent was just "never optimize the local placeholder"; a plain `unoptimized={useFallback || props.unoptimized}` communicates intent slightly more clearly. Non-blocking style note.
- `SafeImage`'s `failed` state never resets if the same mounted instance receives a new `src` (not observed in current call sites — all are per-item/per-key components — but worth a mental note if `SafeImage` is reused inside a paginated/mutating list later).

## Verified Acceptance Criteria

- (a) MinIO auto-mirror: `docker-compose.yml` adds `minio-init` (mc mirror, `--ignore-existing` bucket create, `anonymous set download` on both `assets`/`products`, mirrors `./assets/images` → `assets/images`), gated on `minio: condition: service_healthy`. Confirmed `./assets/images` exists in the backend repo. Confirmed credentials (`minioadmin`/`minioadmin123`) match the `app` service's `MINIO_ACCESS_KEY`/`MINIO_SECRET_KEY`.
- (b) `SafeImage` applied only where `src` is API-sourced (13 call sites across 7 files: `ProductCard`, `NewsCard`, `CategoryNavigation`, `HomeHero`×4, `HomeCategoryBanners`×2, `GalleryView`×3, `FactoryView`), never against static `@/assets` imports directly. Raw `<img>` dual-branch pattern in `CartItemList.jsx`/`CheckoutOrderSummary.jsx`/`OrderItemRow.jsx` confirmed untouched aside from `PLACEHOLDER_IMAGE.src` swap-in and `sizes` additions on the `<Image>` branch. `ImageBlock.jsx`/`ImageGridBlock.jsx` and the 5 admin components (`DataTable.jsx`, `ImageEditor.jsx`, `ImageGridEditor.jsx`, `ImageUploader.jsx`, `SortableImageGallery.jsx`) confirmed unmodified (not present in `git status`).
- (c) `formatImageUrl(url)` unchanged: still `string → string` (returns `""` for falsy input, otherwise a passthrough or base-prefixed string). `src/lib/seo/schemas.js` `resolveAbsoluteImage()` consumes it correctly (`formatted.startsWith("http")` branch works against both cases).
- (d) `sizes` values spot-checked against actual container classes: `AboutHero.jsx` logo (`163px/300px/370px` matches container `w-[163px] md:w-[300px] lg:w-[370px]` exactly), `CategorySEOContent.jsx` (`max-w-[800px]` container → `sizes="(max-width: 800px) 100vw, 800px"`), `ProductCard.jsx` (2-col mobile/4-col desktop grid → `50vw/33vw/25vw`), `CartItemList`/`CheckoutOrderSummary`/`OrderItemRow` (`80px`/`91px` fixed-size thumbnails). All sane, not generic copy-paste.
- (e) No lint invocation errors found on spot-checked files (`media.js`, `SafeImage.jsx`, `HomeHero.jsx`, `Footer.jsx`, `next.config.mjs`) beyond an ESLint flat-config file-arg warning unrelated to the diff content. Did not re-run full `next build` (trusting implementer's stated pass) but confirmed `PLACEHOLDER_IMAGE` static import path exists on disk and `next.config.mjs`'s `remotePatterns` derivation is syntactically valid for the current `.env.local`/`.env.example` value.
- (f) `CartItemList.jsx`, `CheckoutOrderSummary.jsx`, `OrderItemRow.jsx`: dual-branch `typeof item.image === "object" ? <Image> : <img src={item.image || PLACEHOLDER_IMAGE.src}>` logic is preserved verbatim; diffs only add `sizes` to the `<Image>` branch and swap the hardcoded 404 path for `PLACEHOLDER_IMAGE.src` in the `<img>` branch. Confirmed via full diff — no logic change.

## Unresolved Questions

1. Was the DB name/password/port change in `docker-compose.yml` + `application.yaml` intended to ship as part of this image-loading fix, or is it bleed-over from another in-progress task that should be committed separately?
2. Was the category-nav/newsletter-form rewrite in `Header.jsx`/`Footer.jsx` and the CMS-driven hero content in `HomeHero.jsx`/`FactoryView.jsx` intentionally bundled with this fix, or is it uncommitted work from the `260713-1234-storefront-api-seo-wiring` plan bleeding into the same working tree?
