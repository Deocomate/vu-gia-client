---
title: "Scope Fixed Altar Customizer Banner to Altar Category & Detail Pages"
description: "Restrict fixed bottom Altar Customizer banner widget strictly to Altar Items Category and Altar Item Detail pages."
status: pending
priority: P2
branch: "main"
tags: ["storefront", "widget", "category"]
blockedBy: []
blocks: []
created: "2026-07-27T05:44:26.475Z"
createdBy: "ck-cli"
source: cli
---

# Scope Fixed Altar Customizer Banner to Altar Category & Detail Pages

## Overview

Restrict the fixed bottom-centered "TÙY CHỈNH BỘ ĐỒ THỜ" banner widget so that it appears **only** on:
- `/san-pham?category=bo-do-tho` (or when active category is "Bộ đồ thờ")
- `/san-pham/[slug]` when the product belongs to the "Bộ đồ thờ" category.

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Research](./phase-01-research.md) | Pending |
| 2 | [Implement](./phase-02-implement.md) | Pending |
| 3 | [Test](./phase-03-test.md) | Pending |

## Dependencies

None

## Validation Log

### Verification Results
- Claims checked: 4
- Verified: 4 | Failed: 0 | Unverified: 0
- Tier: Light

### Confirmed Decisions
1. **Dismiss Behavior**: Once user clicks `X` (dismiss), banner remains hidden for the rest of the session.
2. **Category Matching**: Match slug `bo-do-tho` + fallback keyword matching (`do-tho`, `thờ`) to seamlessly support subcategories if created.

### Whole-Plan Consistency Sweep
- All plan files reconciled. Zero contradictions.
