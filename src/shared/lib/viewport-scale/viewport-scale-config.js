// Keep these numerically identical to the inline IIFE in viewport-scale-inline-script.js.
// Duplication (not import) is intentional: the inline script must be a self-contained
// string embeddable pre-paint, so the two can't share a runtime import.
export const DESIGN_WIDTH = 1920; // Figma desktop baseline @ 100% OS scale
export const MIN_SCALE = 0.82; // floor: never shrink below this (Phase 1 spike)
export const MAX_SCALE = 1.0; // cap: never enlarge beyond the design
export const MIN_VIEWPORT = 1280; // desktop-only threshold; tablet-landscape (1024-1279) untouched
export const ADMIN_PATH_PREFIX = "/admin";

export function computeScale(innerWidth) {
  if (innerWidth < MIN_VIEWPORT) return 1;
  const raw = innerWidth / DESIGN_WIDTH;
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, raw));
}

export function isAdminPath(pathname) {
  return pathname === ADMIN_PATH_PREFIX || pathname.startsWith(`${ADMIN_PATH_PREFIX}/`);
}
