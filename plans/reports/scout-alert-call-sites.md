# Scout: Native alert/confirm Call Sites

**Date:** 2026-07-09  
**Status:** DONE

## Inventory

- **24 `alert()`** across 8 files
- **3 `confirm()`** across 3 files (all destructive)

### confirm()

| File | Line | Type |
|------|------|------|
| `src/views/CartView.jsx` | 88 | confirm-destructive |
| `src/views/CheckoutView.jsx` | 59 | confirm-destructive |
| `src/views/OrdersView.jsx` | 291 | confirm-destructive |

### alert() by type

| Type | Count | Key files |
|------|-------|-----------|
| success | 7 | ProductInfo*, CheckoutView, CartView, ProfileView, OrdersView |
| error | 12 | CheckoutForm, CartView, CheckoutView, NewsDetailSidebar |
| info/placeholder | 5 | Cart/Checkout edit options, Orders CS, News search |

Full line-level inventory lives in the explore-agent session report (same session).

## Mount points

- Public: `PublicLayout.jsx` (Header/main/Footer/GlobalAltarWidget) — **preferred toast host**
- Root `app/layout.js` — children only
- Admin: separate tree; has `ConfirmDialog.jsx` (zinc)

## Existing patterns

- Admin ConfirmDialog: zinc overlay, no rounded corners, destructive rose
- Public lightbox: `z-[9999]`, CSS `animate-fade-in`
- Inline success: ContactView green banner; NewsDetailSidebar CheckCircle
- Token `--color-success: #67A865` underused
- Zustand: `cartStore.js` (persist), `adminAuthStore.js`
- Framer Motion: only Header mobile menu

## Plan overlap

Navigation plan `260709-2006-user-flow-navigation-linking` Phase 3/4 acceptance still requires native `alert()`. Feedback plan must amend those criteria.
