"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Returns a debounced wrapper around `fn`: repeated invocations within
 * `delayMs` of each other collapse into a single call using the LAST
 * invocation's arguments. Used for coupon-preview validation (Cart/Checkout)
 * so button-mashing or fast repeated applies only fire one request.
 */
export function useDebouncedCallback(fn, delayMs = 300) {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return useCallback(
    (...args) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        fnRef.current(...args);
      }, delayMs);
    },
    [delayMs],
  );
}
