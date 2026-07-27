---
phase: 3
title: Test
status: completed
priority: P2
dependencies:
  - 2
---

# Phase 3: Verification and Build Test

## Overview
Verify banner display rules across all storefront routes and test build.

## Implementation Steps
1. Verify `/san-pham?category=bo-do-tho` shows banner.
2. Verify `/san-pham?category=binh-phong-thuy` hides banner.
3. Verify Altar product detail page shows banner.
4. Verify non-Altar product detail page hides banner.
5. Run lint / build verification.

## Success Criteria
- [ ] All manual test scenarios pass.
- [ ] Clean build without errors.
