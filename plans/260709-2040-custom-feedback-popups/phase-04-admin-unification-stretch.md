---
phase: 4
title: "Admin Unification Stretch"
status: completed
priority: P2
dependencies: [3]
---

# Phase 4: Admin Unification

<!-- Updated: Validation Session 1 - included in same cook (was optional stretch) -->

## Overview

Extract a shared confirm primitive (brand + admin themes) and mount Sonner in
the admin shell. **In scope for cook** per Validation Session 1.

## Requirements

- Functional: admin delete flows keep working with identical UX (zinc theme)
- Non-functional: one primitive, two themes; no regression in AdminMedia/Products/Settings/ResourceManager
- Mount `<AppToaster />` (or admin-themed Toaster) in `AdminShell` so admin can use `toast` later without a second public mount

## Architecture

```text
components/shared/BaseConfirmDialog.jsx  (structure + a11y)
  ├─ components/shared/ConfirmDialog.jsx     theme="brand"
  └─ components/admin/ConfirmDialog.jsx      theme="admin" (thin re-export)
AdminShell
  └─ <AppToaster />   // separate tree from PublicLayout — no double toast on public pages
```

## Related Code Files

- Create: `src/components/shared/BaseConfirmDialog.jsx` (or refactor in place)
- Modify: `src/components/shared/ConfirmDialog.jsx`
- Modify: `src/components/admin/ConfirmDialog.jsx` — wrap base with zinc classes
- Modify: `src/components/admin/AdminShell.jsx` (or protected layout) — mount Toaster
- Touch consumers only if props API changes (prefer prop-compatible)

## Implementation Steps

1. Extract markup/a11y from public ConfirmDialog into Base
2. Brand + admin themes via `variant` prop or className maps
3. Keep admin public API: `open, title, description, confirmLabel, cancelLabel, destructive, onCancel, onConfirm`
4. Mount Toaster in AdminShell only — never in root `app/layout.js`
5. Smoke-test one delete flow per admin consumer (Settings, ProductDetail, Media, ResourceManager)

## Success Criteria

- [ ] Admin ConfirmDialog visual parity (zinc/rose)
- [ ] Public brand dialog unchanged
- [ ] All 4 admin consumers still compile and open/close
- [ ] Admin Toaster mounted; public pages still have exactly one Toaster (PublicLayout)

## Risk Assessment

- **Prop drift** — keep admin callback API stable to avoid large churn
- **Double Toaster** — admin and public are separate layout trees; verify no root mount
