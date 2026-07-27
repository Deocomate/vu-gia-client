"use client";

import { useEffect } from "react";
import { getSiteSettings } from "@/features/settings/site-settings-service";
import { useSiteConfigStore } from "@/shared/stores/site-config-store";

/**
 * No-UI leaf that hydrates `siteConfigStore` from `GET /api/site-settings`
 * on mount. Mounted once in `PublicLayout` alongside `CartAuthBridge`, but
 * since `PublicLayout` is independently rendered by every storefront
 * route group ((main)/(shop)/(user)/(auth)/(policies)), this fires again on
 * every cross-route-group navigation — harmless (idempotent public GET),
 * not a one-time first-load fetch.
 *
 * Errors are logged (not swallowed): a fully silent catch would give zero
 * diagnosable signal if the backend endpoint is unreachable or missing from
 * the security allowlist, since the store would just quietly stay at its
 * default `true`.
 */
export default function SiteConfigBridge() {
  useEffect(() => {
    getSiteSettings()
      .then(({ cartEnabled }) => {
        useSiteConfigStore.getState().setCartEnabled(cartEnabled);
      })
      .catch((err) => {
        console.error("[site-config] failed to load site settings", err);
      })
      .finally(() => {
        useSiteConfigStore.getState().markLoaded();
      });
  }, []);

  return null;
}
