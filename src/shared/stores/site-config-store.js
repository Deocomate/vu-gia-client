"use client";

import { create } from "zustand";

// ---------------------------------------------------------------------------
// Site config store — holds storefront-wide settings hydrated from
// `GET /api/site-settings` by `SiteConfigBridge` (mounted in
// `public-layout.jsx`). No `persist` middleware: re-fetching each session is
// cheap and avoids the toggle being stuck stale from a prior localStorage
// snapshot.
//
// `cartEnabled` defaults to `true` (not `false`/`null`) because the common
// case is cart mode ON — this avoids a flash of hidden cart UI while the
// fetch is in flight.
// ---------------------------------------------------------------------------

export const useSiteConfigStore = create((set) => ({
  cartEnabled: true,
  isLoaded: false,

  setCartEnabled(value) {
    set({ cartEnabled: value });
  },

  markLoaded() {
    set({ isLoaded: true });
  },
}));
