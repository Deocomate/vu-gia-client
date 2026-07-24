import { publicGet, PublicApiError } from "@/shared/api/publicApi";
import { absoluteUrl } from "@/shared/lib/seo/siteConfig";

const STATIC_ROUTES = [
  "/",
  "/san-pham",
  "/tin-tuc",
  "/thu-vien-hinh-anh",
  "/showroom",
  "/nha-xuong",
  "/ve-chung-toi",
  "/lien-he",
  "/bao-mat-thong-tin",
  "/chinh-sach-doi-tra",
  "/chinh-sach-van-chuyen",
  "/cau-hoi-thuong-gap",
];

const PAGE_SIZE = 100;

/**
 * Paginates through a published-entity list endpoint, collecting every
 * `{slug, updatedAt}` pair across all pages. Does not assume a single page
 * covers the whole catalog — loops until the backend reports `last: true`.
 * Returns an empty array on any API-level failure so sitemap generation
 * degrades gracefully instead of failing the whole route build.
 */
async function fetchAllSlugs(path, extraParams) {
  const entries = [];
  let page = 1;

  try {
    while (true) {
      const data = await publicGet(path, {
        ...extraParams,
        page,
        size: PAGE_SIZE,
      });
      const content = data?.content ?? [];
      content.forEach((item) => {
        if (item?.slug) {
          entries.push({ slug: item.slug, updatedAt: item.updatedAt });
        }
      });

      if (!content.length || data?.last) break;
      page += 1;
    }
  } catch (error) {
    if (!(error instanceof PublicApiError)) throw error;
    console.error(`Failed to fetch all slugs for ${path}:`, error.message);
  }

  return entries;
}

export default async function sitemap() {
  const [products, news] = await Promise.all([
    fetchAllSlugs("/products", { status: "PUBLISHED" }),
    fetchAllSlugs("/news", { status: "PUBLISHED" }),
  ]);

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
  }));

  const productEntries = products.map((product) => ({
    url: absoluteUrl(`/san-pham/${product.slug}`),
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
  }));

  const newsEntries = news.map((item) => ({
    url: absoluteUrl(`/tin-tuc/${item.slug}`),
    lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
  }));

  return [...staticEntries, ...productEntries, ...newsEntries];
}
