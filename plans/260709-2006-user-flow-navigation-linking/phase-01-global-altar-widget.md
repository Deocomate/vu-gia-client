---
phase: 1
title: "Global Altar Widget"
status: pending
effort: "S"
---

# Phase 1: Global Altar Widget

## Overview

Promote the product-detail-only `FixedActionWidget` into a single global
slide-out drawer widget (`GlobalAltarWidget`) mounted in `PublicLayout`, so the
"Tự tạo bộ đồ thờ" CTA appears on every public page except the purchase pages.
Removes the old widget to avoid duplication on product detail.

## Requirements

- Functional: Fixed to right edge, vertically centered. Slide-out on hover
  (drawer). Click → `ROUTES.ALTAR_CUSTOMIZER`. Hidden on `/thanh-toan`,
  `/gio-hang`, `/tuy-chinh-bo-do-tho`.
- Non-functional: Desktop-only (`hidden md:flex`), `z-[100]`, no layout shift,
  respects brand color `--color-primary` (#97400C).

## Architecture

- `PublicLayout` is the shared shell used by route groups `(main)`, `(shop)`,
  `(policies)`, `(user)`. Mounting the widget there covers all public pages.
- The widget self-hides via `usePathname()` against a `hiddenPaths` list — so
  even though `(shop)` layout renders `PublicLayout`, the widget won't show on
  cart/checkout.
- Old `FixedActionWidget` was mounted manually in `ProductDetailView`
  (`(main)` group → already under `PublicLayout`), so it must be removed to
  prevent two widgets on the product page.

## Related Code Files

- Create: `src/components/shared/GlobalAltarWidget.jsx`
- Modify: `src/components/shared/PublicLayout.jsx` (mount widget)
- Modify: `src/views/ProductDetailView.jsx` (remove `FixedActionWidget` import + usage at lines 10, 44)
- Delete: `src/components/product-detail/FixedActionWidget.jsx` (no other consumers — verified via grep; deletion confirmed in Validation Session 1)

## Implementation Steps

1. Create `src/components/shared/GlobalAltarWidget.jsx`:

   ```jsx
   "use client";

   import Link from "next/link";
   import { usePathname } from "next/navigation";
   import { ROUTES } from "@/utils/routes";
   import { Paintbrush } from "lucide-react";

   // Pages where the widget must stay hidden to keep purchase focus.
   const HIDDEN_PATHS = [ROUTES.CHECKOUT, ROUTES.CART, ROUTES.ALTAR_CUSTOMIZER];

   export default function GlobalAltarWidget() {
     const pathname = usePathname();
     if (HIDDEN_PATHS.includes(pathname)) return null;

     return (
       <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] hidden md:flex flex-col items-end group">
         <Link
           href={ROUTES.ALTAR_CUSTOMIZER}
           aria-label="Tự tạo bộ đồ thờ"
           className="flex items-center gap-3 bg-primary text-white py-3 pl-4 pr-3 rounded-l-xl shadow-[-4px_4px_15px_rgba(0,0,0,0.15)] transition-transform duration-300 translate-x-[130px] hover:translate-x-0 focus-visible:translate-x-0"
         >
           <Paintbrush className="w-6 h-6 flex-shrink-0" />
           <div className="flex flex-col whitespace-nowrap">
             <span className="text-[12px] font-montserrat font-medium text-white/80 leading-tight">
               Chưa tìm thấy mẫu ưng ý?
             </span>
             <span className="text-[14px] font-montserrat font-bold leading-tight">
               Tự tạo bộ đồ thờ
             </span>
           </div>
         </Link>
       </div>
     );
   }
   ```

   Notes:
   - Use `bg-primary` (theme token) instead of the hardcoded `bg-[#97400C]` for consistency with the rest of the codebase.
   - `focus-visible:translate-x-0` added so keyboard users can reveal/reach the link.
   - Dropped `animate-pulse` (not needed; keep it calm). Add back if desired.

2. Mount in `src/components/shared/PublicLayout.jsx`:

   ```jsx
   import Footer from "@/components/shared/Footer";
   import Header from "@/components/shared/Header";
   import GlobalAltarWidget from "@/components/shared/GlobalAltarWidget";

   export default function PublicLayout({ children }) {
     return (
       <>
         <Header />
         <main className="overflow-x-hidden">{children}</main>
         <Footer />
         <GlobalAltarWidget />
       </>
     );
   }
   ```

3. Remove old widget from `src/views/ProductDetailView.jsx`:
   - Delete import at line 10 (`import FixedActionWidget ...`).
   - Delete `<FixedActionWidget />` usage at line 44.

4. Delete `src/components/product-detail/FixedActionWidget.jsx` — grep confirms
   only `ProductDetailView` imported it (now removed in step 3). Deletion confirmed
   by user (Validation Session 1) to avoid dead code.

## Success Criteria

- [ ] Widget visible on Home, Products, News, About, Policies (desktop ≥ md).
- [ ] Widget hidden on `/thanh-toan`, `/gio-hang`, `/tuy-chinh-bo-do-tho`.
- [ ] Only ONE widget on `/san-pham/[slug]` (old one removed).
- [ ] Hover (and keyboard focus) slides the drawer fully into view; click routes to customizer.
- [ ] No `FixedActionWidget` import remains (grep clean); build/lint pass.

## Risk Assessment

- **Double widget** if step 3 skipped → covered by explicit removal + grep check.
- **`z-[100]` overlap** with modals (e.g. product lightbox uses `z-[9999]`) — fine, lightbox sits above. Header/menu z-index: verify widget doesn't cover a mobile menu (it's `md:` only, low risk).
- **Mobile**: intentionally hidden (`hidden md:flex`) per original widget behavior; if mobile CTA is later wanted, that's a separate scope.
- Rollback: delete new file + revert 2 edits.
