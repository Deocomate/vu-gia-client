import { publicGet, PublicApiError } from "@/shared/api/public-api";

/**
 * Fetches a `Page` entity by its `key` and returns ONLY its hero/SEO scalar
 * fields. Deliberately never returns/exposes `content` (the rich
 * block-editor field) — that field stays admin-only per the block-builder
 * plan's storefront boundary. Any future consumer of this helper (Phase 6's
 * `generateMetadata`, this phase's static info pages) structurally cannot
 * read `content` through it.
 *
 * Returns `null` when the page doesn't exist or the request fails, so
 * callers can render a graceful fallback instead of crashing.
 */
export async function getPageByKey(key) {
  try {
    const page = await publicGet(`/pages/key/${key}`);
    if (!page) return null;

    return {
      heroTitle: page.heroTitle ?? null,
      heroSubtitle: page.heroSubtitle ?? null,
      heroDes: page.heroDes ?? null,
      heroImage: page.heroImage ?? null,
      seoTitle: page.seoTitle ?? null,
      seoDescription: page.seoDescription ?? null,
      seoImage: page.seoImage ?? null,
    };
  } catch (error) {
    if (error instanceof PublicApiError) {
      if (error.status !== 404) console.error(`Failed to fetch page "${key}":`, error.message);
      return null;
    }
    throw error;
  }
}
