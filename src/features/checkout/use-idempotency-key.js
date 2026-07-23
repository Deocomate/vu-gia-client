"use client";

import { useCallback, useState } from "react";

/**
 * RFC4122-ish v4 UUID. Prefers the Web Crypto API (always present in
 * browsers); falls back to a `Math.random()`-based generator so this never
 * throws during SSR on a runtime without `globalThis.crypto.randomUUID`.
 */
function generateUuid() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Stable idempotency key for one checkout attempt (RT-A). The key MUST stay
 * the same across retries of the SAME submission — placing an order is
 * itself a cart mutation (the server prunes the cart on success), so
 * regenerating the key on cart/form change would defeat the exact retry
 * protection it exists for (duplicate order + double coupon burn/email on a
 * network-error retry). Only call `regenerate()` after a CONFIRMED 2xx order
 * response, or when the user explicitly starts a brand-new checkout.
 */
export function useIdempotencyKey() {
  const [key, setKey] = useState(() => generateUuid());
  const regenerate = useCallback(() => setKey(generateUuid()), []);
  return [key, regenerate];
}
