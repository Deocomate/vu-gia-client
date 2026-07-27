"use client";

import { create } from "zustand";

/**
 * Lightweight store to track active category context across storefront routes,
 * allowing global UI widgets (like GlobalAltarWidget) to adapt based on whether
 * the user is currently viewing an Altar product category or Altar item detail.
 */
export const useProductCategoryStore = create((set) => ({
  activeCategorySlug: null,
  activeCategoryName: null,

  setActiveCategory: (slug, name = null) => {
    set({ activeCategorySlug: slug ?? null, activeCategoryName: name ?? null });
  },

  clearActiveCategory: () => {
    set({ activeCategorySlug: null, activeCategoryName: null });
  },
}));
