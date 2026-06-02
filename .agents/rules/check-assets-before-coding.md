---
trigger: always_on
---

# Check Existing Assets Before Coding

Before implementing any UI components or writing code that requires images, icons, fonts, or other media files, you **must** inspect the provided codebase structure to check for existing assets.

- **Check specific directories:** Always scan the `public/` and `src/assets/` folders to see what assets are currently available.
- **Do not invent paths:** Only use exact asset paths that actually exist in the project tree. Never hallucinate, guess, or mock fake file names (e.g., do not use `/images/fake-banner.png` if it is not in the directory structure).
- **Fallback behavior:** If a required asset is completely missing, either reuse a generic existing asset (like a default placeholder already present in the project) or explicitly ask the user to provide it before proceeding.
- **Why:** This ensures consistency with the design context, prevents 404 errors (broken images), and eliminates unnecessary back-and-forth caused by missing files.