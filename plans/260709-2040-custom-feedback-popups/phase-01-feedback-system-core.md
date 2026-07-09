---
phase: 1
title: "Feedback System Core"
status: completed
priority: P1
dependencies: []
---

# Phase 1: Feedback System Core

## Overview

Install Sonner, add brand-themed Toaster + confirm store/host, and expose a
single `@/utils/feedback` facade. No call-site migration yet.

## Requirements

- Functional: `toast.success|error|info|warning|message` callable from client components; confirm host mounted but unused until Phase 3
- Non-functional: brand colors; Framer Motion optional (Sonner has own motion); z-index above Header (`z-50`) and below lightbox (`z-[9999]`) → use `z-[100]` / `z-[200]`

## Architecture

```text
PublicLayout
  ├─ Header / main / Footer / GlobalAltarWidget
  ├─ <Toaster />          (Sonner, client)
  └─ <ConfirmDialogHost /> (reads confirmStore)

utils/feedback.js
  ├─ re-export toast from sonner (typed helpers optional)
  └─ confirm(options) → Promise<boolean> via confirmStore
```

## Related Code Files

- Create: `src/utils/feedback.js`
- Create: `src/stores/confirmStore.js`
- Create: `src/components/shared/ConfirmDialog.jsx` (public brand dialog UI)
- Create: `src/components/shared/ConfirmDialogHost.jsx` (subscribes to store)
- Create: `src/components/shared/AppToaster.jsx` (Sonner wrapper + theme classNames)
- Modify: `src/components/shared/PublicLayout.jsx` — mount Toaster + ConfirmDialogHost
- Modify: `package.json` — add `sonner`

## Implementation Steps

1. `npm install sonner`
2. Import Sonner styles once (in `AppToaster.jsx` or `globals.css`): `import "sonner/dist/styles.css"` (verify exact path for installed version)
3. Create `AppToaster.jsx` (`"use client"`):
   - `<Toaster position="top-center" richColors={false} closeButton />` <!-- Validated: Session 1 Q4 -->
   - Theme via `toastOptions.classNames` / CSS variables: success → `bg-success` or soft green panel; error → sale/rose; info → primary-tinted; match public typography (`font-montserrat`)
   - Default `duration: 3500`; allow per-toast override
4. Create `confirmStore.js` (Zustand, no persist):
   ```js
   // state: { open, title, description, confirmLabel, cancelLabel, destructive, resolve }
   // openConfirm(opts) → Promise<boolean>
   // close(result: boolean)
   ```
5. Create public `ConfirmDialog.jsx` — brand panel (primary CTAs, white surface, soft overlay `bg-black/40`), Lucide `X`, destructive confirm uses `sale` or rose
6. Create `ConfirmDialogHost.jsx` — render dialog when `open`; wire onConfirm/onCancel/Escape/backdrop → `close(true|false)`
7. Create `feedback.js`:
   ```js
   export { toast } from "sonner";
   export { confirm } from "@/stores/confirmStore"; // or thin wrapper
   ```
8. Mount both hosts in `PublicLayout` after children/widget
9. Smoke: temporary button or console — skip leaving debug UI in tree

<!-- Updated: Validation Session 1 - top-center locked; Phase 4 will add AdminShell Toaster -->

## Success Criteria

- [ ] `sonner` in dependencies
- [ ] Toaster visible when `toast.success("test")` from any public page
- [ ] ConfirmHost mounts; `await confirm({title, description})` works from a throwaway test call
- [ ] No native alert used in new files
- [ ] Lint clean on new files

## Risk Assessment

- **z-index clash** with GlobalAltarWidget / mobile Header — mitigate with explicit `z-[100]` toaster, `z-[200]` confirm
- **SSR**: all hosts `"use client"`; PublicLayout can stay server and import client children
- **Double Toaster** — PublicLayout mounts public Toaster; Phase 4 mounts a second Toaster only inside `AdminShell` (separate route tree). Do **not** mount on root `app/layout.js`.
