"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { computeScale, isAdminPath } from "@/shared/lib/viewport-scale/viewport-scale-config";

const ZOOM_SUPPORTED =
  typeof document !== "undefined" && "zoom" in document.documentElement.style;

const RESIZE_DEBOUNCE_MS = 100;

export default function ViewportScaler() {
  const pathname = usePathname();

  useEffect(() => {
    if (!ZOOM_SUPPORTED) return;

    const root = document.documentElement;

    const apply = () => {
      if (isAdminPath(pathname)) {
        root.style.zoom = "";
        return;
      }
      const scale = computeScale(window.innerWidth);
      root.style.zoom = scale === 1 ? "" : String(scale);
    };

    apply();

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(apply, RESIZE_DEBOUNCE_MS);
    };
    window.addEventListener("resize", onResize);

    // Re-arms itself on every change since a fired MediaQueryList only fires once per crossing.
    let dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    const onDprChange = () => {
      apply();
      dprQuery.removeEventListener("change", onDprChange);
      dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      dprQuery.addEventListener("change", onDprChange);
    };
    dprQuery.addEventListener("change", onDprChange);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      dprQuery.removeEventListener("change", onDprChange);
    };
  }, [pathname]);

  return null;
}
