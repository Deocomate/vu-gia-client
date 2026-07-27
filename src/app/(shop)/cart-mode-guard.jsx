"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSiteConfigStore } from "@/shared/stores/site-config-store";
import { ROUTES } from "@/shared/utils/routes";

// Exact-path match only — deliberately does NOT match
// `/thanh-toan/ket-qua/[id]` (order confirmation), which must stay
// reachable regardless of `cartEnabled` so a customer who already placed an
// order can still view their confirmation page after the admin later
// disables cart mode.
const GATED_PATHS = new Set([ROUTES.CART, ROUTES.CHECKOUT]);

function isGatedPath(pathname) {
  return GATED_PATHS.has(pathname);
}

/**
 * Mounted inside `(shop)/layout.js`, wraps every storefront page.
 *
 * For `/gio-hang` and `/thanh-toan` ONLY: blocks rendering `children` until
 * the site-config store has loaded (`isLoaded`), then either renders
 * `children` (cart on) or redirects to `/lien-he` (cart off). This is a
 * targeted exception to the non-blocking default elsewhere — direct
 * nav/bookmark/back-button hits to `/thanh-toan` while cart mode is off (or
 * a slow `/api/site-settings` response) must not briefly render a
 * submittable checkout form before the guard fires, since there is no
 * backend enforcement of cart mode.
 *
 * Every other route renders `children` immediately, matching Phase 3's
 * non-blocking default.
 */
export default function CartModeGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const cartEnabled = useSiteConfigStore((s) => s.cartEnabled);
  const isLoaded = useSiteConfigStore((s) => s.isLoaded);

  const gated = isGatedPath(pathname);
  const shouldRedirect = isLoaded && !cartEnabled && gated;

  useEffect(() => {
    if (shouldRedirect) {
      router.replace(ROUTES.CONTACT);
    }
  }, [shouldRedirect, router]);

  if (gated && !isLoaded) {
    // Lightweight loading state — avoids rendering the interactive
    // cart/checkout page before we know whether cart mode is actually on.
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#97400C] border-t-transparent" />
      </div>
    );
  }

  if (shouldRedirect) {
    // Redirect effect above is in flight — render nothing rather than the
    // gated page itself.
    return null;
  }

  return children;
}
