const STORAGE_KEY = "vu-gia:altar-customizer:pending-canvas";

/**
 * Persists the current canvas selection/items/accessories to `sessionStorage` right before a
 * logged-out "Lưu" click redirects to `/dang-nhap`, so the customer's in-progress arrangement
 * survives the round trip through login (phase 5's "logged-out save flow"). Deliberately
 * `sessionStorage` (tab-scoped, not `localStorage`) and a single fixed key — this is a one-shot
 * UX affordance for an interrupted save, not a guest-draft feature: written once right before
 * the redirect, consumed and cleared exactly once on return by `consumePendingCanvas`, never
 * accumulated or reused across tabs/sessions.
 */
export function persistPendingCanvas(canvasState) {
  if (typeof window === "undefined") return;
  try {
    const { altarModelId, altarSizeId, altarStyleId, presetId, items, accessories } = canvasState || {};
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ altarModelId, altarSizeId, altarStyleId, presetId, items, accessories }),
    );
  } catch {
    // Best-effort — a full/unavailable sessionStorage (e.g. private browsing) just means the
    // arrangement won't survive the redirect; the rest of the save flow still works normally.
  }
}

/**
 * Reads and clears (regardless of validity) the pending canvas snapshot, if any — for
 * `AltarCustomizerView` to restore on mount after the customer returns from login. Returns
 * `null` when nothing was persisted or the stored value is malformed.
 */
export function consumePendingCanvas() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    window.sessionStorage.removeItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.items)) return null;
    return parsed;
  } catch {
    return null;
  }
}
