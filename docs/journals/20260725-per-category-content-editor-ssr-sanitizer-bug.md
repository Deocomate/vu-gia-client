# Per-Category Custom Content Editor: SSR Sanitizer Bug & Manual Test Blindness

**Date**: 2026-07-25
**Severity**: Critical (SSR bug), High (block-content truthiness bug)
**Component**: Category content editor, rich-text sanitizer, storefront detail-content renderer
**Status**: Resolved

## What Happened

Shipped the per-category custom content editor feature: admin-editable short description + block-based rich detail content for 6 fixed product categories (previously hardcoded JSX). Generalized the existing `BlockBuilder` drag-drop editor to accept a pluggable block-type registry, added an in-house `contentEditable`-based rich-text primitive (whitelist HTML sanitizer, zero third-party deps), wired admin editor with live WYSIWYG preview (renders through actual production storefront components), and integrated into storefront. Manual browser testing "passed." Code review caught two critical render-path bugs that manual testing could not have surfaced.

## The Brutal Truth

Manual testing of a Next.js SSR app can only exercise the post-hydration client state. It cannot catch bugs in the server-render-only path unless you specifically inspect raw HTML. We didn't. The first bug silently broke the core feature on the actual server-rendered response, visible only via `curl` or "view page source," not in any browser interaction. The second was a logic flaw masked by mutability and truthy checks. Both slipped through because we validated the same interaction path (live browser editing) repeatedly without ever questioning whether the server was rendering what the browser received.

This is maddening and instructive in equal measure. We built a WYSIWYG editor that worked perfectly in the browser and shipped silently broken HTML to users viewing the page source. The lesson is harsh: for SSR apps, code review with explicit render-path tracing is not optional.

## Technical Details

**Bug 1: SSR Sanitizer Returning Empty String Server-Side**

The rich-text sanitizer was implemented as DOM-based:

```javascript
// BROKEN (was in phase-02-rich-text-primitive)
export function sanitizeRichText(html) {
  if (typeof window === "undefined") return ""; // server-side → empty string
  const div = document.createElement("div");
  div.innerHTML = html;
  // whitelist logic...
  return div.innerHTML;
}
```

A Next.js Server Component (`CategoryDetailContent.jsx`) calls `sanitizeRichText()` at render time for SSR. On the server, `typeof window === "undefined"` is always true, so **every rich-text block rendered as an empty string in the server-generated HTML**. Post-hydration in the browser, `window` exists, sanitizer works correctly, component re-renders with content. Manual testing in a browser never saw the bug because the browser-side render was always correct.

Root symptom: `curl http://localhost:3000/san-pham/bo-do-tho` showed empty `<div></div>` for detail blocks; page in browser showed content perfectly.

Fixed by rewriting sanitizer as isomorphic regex/string-based:

```javascript
// FIXED
export function sanitizeRichText(html) {
  if (!html) return "";
  // Regex whitelist, works server and client identically
  return html
    .replace(/(<[^>]*?[on\w]*=["'][^"']*["'])/g, "") // strip event handlers
    .replace(/<(?!\/?(strong|br|p)>)[^>]*>/g, "") // strip non-whitelisted tags
    .trim();
}
```

Now it runs identically on both server and client, no DOM dependency.

**Bug 2: Empty Block List Treated as Truthy**

The storefront wrapper checked:

```javascript
// BROKEN (was in phase-05-storefront-wiring)
export function CategoryDetailContent({ category }) {
  if (!category.detailContent) return null; // "categories with no content render nothing"
  
  const blocks = JSON.parse(category.detailContent);
  // render blocks...
}
```

When an admin deletes all blocks via the editor, it writes `'{"blocks":[]}'` (a truthy JSON string). The truthiness check passes. Later, on render, `blocks` is an empty array, nothing renders anyway—but the guard logic is broken. If an admin later re-adds a block, the category re-appears because the string is still truthy. This violates the explicit plan decision: "categories with no content render nothing, no fallback."

Fixed by parsing and checking block count:

```javascript
// FIXED
export function CategoryDetailContent({ category }) {
  if (!category.detailContent) return null;
  
  try {
    const { blocks = [] } = JSON.parse(category.detailContent);
    if (blocks.length === 0) return null; // explicit empty-block → no render
    // render blocks...
  } catch {
    return null;
  }
}
```

Both bugs were caught by delegating a code-reviewer subagent with explicit instructions: "trace render paths end-to-end; question assumptions; don't just re-run manual test steps."

## What We Tried

1. Manual browser testing (edit, publish, view content) — **only exercises post-hydration state; cannot catch SSR bugs**.
2. Live preview in admin editor (renders through production components) — **ensures WYSIWYG for browser-visible rendering; doesn't validate server response**.
3. Dogfood testing (admin UI used to seed category content as part of acceptance) — **works, but only checks the interaction path, not the actual HTML sent to clients**.

All three passed. None of them caught either bug.

## Root Cause Analysis

**SSR Sanitizer Bug:** Assumed `window` is available at render time because the browser always has it. Forgot that Next.js Server Components run on Node.js, where `typeof window === "undefined"`. A render-path audit (server render → hydration → client render) would have surfaced this immediately. Manual browser testing cannot surface it because the browser always reaches the post-hydration code.

**Truthiness Bug:** Used a shorthand guard (`!category.detailContent`) that works for null/undefined but not for "string that parses to empty array." The assumption was that empty content means null, which is not enforced by the schema or editor. Raw string truthiness is a footgun in JSON schemas.

## Lessons Learned

1. **Manual Browser Testing Is Incomplete for SSR Apps**: Testing in a browser only exercises post-hydration behavior. Server-side render bugs are invisible because the browser-side render is correct. For SSR apps, you **must** inspect raw HTML responses (curl, view-source, Next.js server logs) or write server-render-specific tests.

2. **Code Review with Render-Path Auditing Catches SSR Bugs**: The reviewer's explicit instruction to trace render paths, not just re-run manual steps, was the difference. Delegating review with a specific focus is higher-leverage than running the same test twice.

3. **JSON Truthiness Is a Footgun**: Checking `!string` for "content missing" is unreliable when the string is JSON. Parse first, then check semantic emptiness (block count, not string truthiness).

4. **Rewrite vs. Refactor for Isomorphism**: Once you detect a DOM dependency in a server-called function, delete it entirely. Trying to add `typeof window` checks is a band-aid. Isomorphic code (no platform-specific APIs) is simpler and testable.

5. **Parallel Dev & Prod Builds Corrupt State**: Secondary lesson from this session: running `npm run build` (production) while `npm run dev` is active in the same directory corrupts the dev server's `.next` build-manifest cache (shared output directory). Caused a confusing 500 error unrelated to the actual SSR bug. Avoid running prod build and dev server concurrently.

## Next Steps

1. Add a render-path audit step to the code-review checklist for SSR components: "Does this component call any functions that will run on the server? Do those functions have platform dependencies (DOM, window, etc.)?"
2. Write a server-render-focused test in `__tests__/server-render/` that calls `sanitizeRichText()` in a Node.js context to verify it does not return empty string.
3. Add schema validation to the block editor: enforce that `detailContent` is either null/undefined (no content) or a JSON object with `blocks: array` with length > 0. Reject the intermediate `'{"blocks":[]}'` state.
4. Update `code-standards.md` to document: "For SSR apps, manual browser testing cannot catch server-render bugs. Inspect raw responses or write server-render-specific unit tests."
5. Add a pre-commit hook check: `npm run build` and `npm run dev` cannot run concurrently in the same `package-lock.json` workspace. Warn developer if `.next/` shows signs of concurrent build collision.

