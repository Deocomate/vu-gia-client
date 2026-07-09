---
phase: 3
title: "Confirm Dialogs + A11y"
status: completed
priority: P1
dependencies: [1]
---

# Phase 3: Confirm Dialogs + A11y

## Overview

Replace 3 native `confirm()` calls with `await confirm()` and harden a11y
(focus trap, Escape, aria, scroll lock).

## Requirements

- Functional: delete cart item, delete checkout line, cancel order — only proceed when user confirms
- Non-functional: keyboard + screen-reader usable; no focus leak

## Architecture

```js
import { confirm, toast } from "@/utils/feedback";

const ok = await confirm({
  title: "Xóa sản phẩm",
  description: "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?",
  confirmLabel: "Xóa",
  cancelLabel: "Hủy",
  destructive: true,
});
if (!ok) return;
removeItem(id);
```

Orders cancel flow: confirm → on success `toast.success(...)`.

## Related Code Files

- Modify: `src/views/CartView.jsx` (L88)
- Modify: `src/views/CheckoutView.jsx` (L59)
- Modify: `src/views/OrdersView.jsx` (L291)
- Modify: `src/components/shared/ConfirmDialog.jsx` — a11y polish
- Modify: `src/stores/confirmStore.js` — ensure single pending promise; reject/resolve safely on unmount

## Implementation Steps

1. Replace `if (confirm(...))` with `if (!(await confirm({...}))) return;` — handlers must be `async`
   - Call sites: `CartView.handleRemoveItem` (`CartView.jsx:87`), `CheckoutView.handleRemoveItem` (`CheckoutView.jsx:58`), `OrdersView` cancel (`OrdersView.jsx:291`)
   - Child buttons call `onRemoveItem(id)` without await (`CartItemList.jsx:140`, `CheckoutOrderSummary.jsx:153`) — **OK** (fire-and-forget async). Still works; do not change child signatures.
2. Dialog a11y checklist:
   - [ ] `role="alertdialog"` + `aria-modal="true"`
   - [ ] `aria-labelledby` / `aria-describedby` wired to title/description ids
   - [ ] Focus first focusable (Cancel preferred for destructive) on open
   - [ ] Tab cycles inside dialog
   - [ ] Escape → `close(false)`
   - [ ] Backdrop click → `close(false)`
   - [ ] Restore focus to trigger on close
   - [ ] `document.body` overflow hidden while open
3. Prevent double-open: if `open` already true, resolve previous with `false` then open new (or queue — prefer replace)
4. Grep: zero `confirm(` in public src
5. Manual keyboard pass on Cart delete + Orders cancel

## Success Criteria

- [ ] No native `confirm(` in `src/views` / public components
- [ ] Cancel / Escape / backdrop never deletes items
- [ ] Confirm deletes / cancels as before
- [ ] Screen reader announces dialog (spot-check with browser a11y tree)

## Risk Assessment

- **Async handlers** in React 19 — fine; avoid unhandled rejection
- **Component unmount mid-confirm** — store `resolve(false)` in Host cleanup
- **Lightbox z-index** — confirm at `z-[200]` stays under `z-[9999]` lightbox (OK; rare overlap)
- **Double-click remove** — store single-flight (replace prior promise with `false`) already required in step 3; optionally ignore second open while `open === true` without replacing if UX prefers
