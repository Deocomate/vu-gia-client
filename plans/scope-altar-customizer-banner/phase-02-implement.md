---
phase: 2
title: "Implement"
status: pending
priority: P2
dependencies: [1]
---

# Phase 2: Implement Category Store and Widget Filtering

## Overview
Create `product-category-store.js` and hook category updates into `ProductsView`, `ProductDetailView`, and `GlobalAltarWidget`.

## Related Code Files
- Create: `src/shared/stores/product-category-store.js`
- Modify: `src/features/storefront/products/products-view.jsx`
- Modify: `src/features/storefront/products/product-detail-view.jsx`
- Modify: `src/shared/components/global-altar-widget.jsx`

## Implementation Steps
1. Create `product-category-store.js`.
2. Update `ProductsView` to set/clear active category.
3. Update `ProductDetailView` to set/clear product category.
4. Update `GlobalAltarWidget` to filter fixed bottom banner display strictly to `bo-do-tho`.

## Success Criteria
- [ ] Fixed banner displays ONLY when viewing Altar category or Altar item detail.
- [ ] Banner remains hidden on all other categories and non-product pages.
