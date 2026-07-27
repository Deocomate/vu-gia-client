// Public (unauthenticated) site settings (Phase 1, `GET /api/site-settings`).
import { publicGet } from "@/shared/api/public-api";

/** `GET /api/site-settings` — returns `{ cartEnabled: boolean }`. */
export function getSiteSettings() {
  return publicGet("/site-settings");
}
