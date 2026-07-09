# Research: Toast + Confirm Dialog Approach

**Mode:** hard / scope expansion  
**Date:** 2026-07-09

## Recommendation

**Hybrid:**

1. **Toasts → Sonner** (`sonner`), themed with Vũ Gia tokens (`primary`, `success`, `sale`). Mount `<Toaster />` in `PublicLayout` (and optionally root later for admin).
2. **Confirm → custom public `ConfirmDialog` + Zustand `confirmStore`** with promise API `await confirm({ title, description, destructive })`.
3. **Facade** `src/utils/feedback.js` exporting `toast` + `confirm` so call sites never import Sonner/store directly.

Rationale: Sonner wins a11y, stacking, swipe-dismiss, promise toasts without reinventing queues. Confirm needs brand modal (admin zinc dialog is wrong palette). Facade keeps swap cost low.

## Alternatives considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| Full custom Zustand + Framer Motion toasts | Full brand control | Rebuild queue, a11y, focus, swipe | Overkill for expansion |
| react-hot-toast | Tiny, familiar | Weaker stacking/a11y vs Sonner | Runner-up |
| Radix Toast only | Headless a11y | More glue code | Skip |
| Reuse admin ConfirmDialog as-is | Exists | Zinc admin look on public site | Style fork / shared primitive later |

## Stretch (Phase 4)

- Shared `BaseConfirmDialog` primitive; admin wraps with zinc theme, public with brand theme
- Toast action buttons (e.g. "Xem giỏ" after add-to-cart)
- `toast.promise` for future async API calls
- Optional root-level Toaster for admin pages

## Risks

- Navigation plan Phase 3/4 acceptance still says native `alert()` — must reconcile criteria
- Promise `confirm()` must handle unmount / Escape / backdrop cancel → resolve `false`
- Double feedback if both toast and inline validation fire (CheckoutForm)

## API sketch

```js
import { toast, confirm } from "@/utils/feedback";

toast.success("Đã thêm sản phẩm vào giỏ hàng!");
toast.error("Mã ưu đãi không hợp lệ.");
toast.info("Đang tìm kiếm…");

const ok = await confirm({
  title: "Xóa sản phẩm",
  description: "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?",
  confirmLabel: "Xóa",
  destructive: true,
});
if (ok) removeItem(id);
```

## Sources

- PkgPulse Sonner vs hot-toast 2026; LogRocket toast comparison 2025; shadcn Sonner docs
- Scout: `plans/reports` / session scout (24 alerts, 3 confirms, admin ConfirmDialog, PublicLayout mount)

Status: DONE
