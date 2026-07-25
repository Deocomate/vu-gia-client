import HomeView from "@/features/storefront/home/home-view";
import { publicGet, PublicApiError } from "@/shared/api/public-api";
import { getPageByKey } from "@/shared/lib/seo/page-by-key";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/shared/lib/seo/site-config";
import { formatImageUrl } from "@/shared/api/media";

export async function generateMetadata() {
  const page = await getPageByKey("home");
  const title = page?.seoTitle || "Trang chủ";
  const description = page?.seoDescription || "Gốm Sứ Vũ Gia - gốm sứ Bát Tràng chính hãng.";
  const image = page?.seoImage ? formatImageUrl(page.seoImage) : DEFAULT_OG_IMAGE;
  const canonical = absoluteUrl("/");

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/** Fetches a public list endpoint, returning a safe empty page shape on any API-level error. */
async function fetchList(path, params) {
  try {
    const data = await publicGet(path, params);
    return data?.content ?? [];
  } catch (error) {
    if (error instanceof PublicApiError) {
      console.error(`Failed to fetch ${path}:`, error.message);
      return [];
    }
    throw error;
  }
}

/** Fetches a single public resource, returning `null` on any API-level error. */
async function fetchOne(path) {
  try {
    return await publicGet(path);
  } catch (error) {
    if (error instanceof PublicApiError) {
      console.error(`Failed to fetch ${path}:`, error.message);
      return null;
    }
    throw error;
  }
}

/** Fetches published products for one of the 6 fixed categories, by slug. */
async function fetchProductsByCategorySlug(slug, size) {
  const category = await fetchOne(`/product-categories/slug/${slug}`);
  if (!category) return [];
  return fetchList("/products", {
    productCategoryId: category.id,
    status: "PUBLISHED",
    size,
  });
}

export default async function HomePage() {
  const [
    heroBanners,
    categoryBanners,
    boDoThoProducts,
    binhPhongThuyProducts,
    lucBinhProducts,
    news,
  ] = await Promise.all([
    fetchList("/banners", {
      position: "HOME_HERO",
      isActive: true,
      sortBy: "sortOrder",
      sortDirection: "ASC",
      size: 5,
    }),
    fetchList("/banners", {
      position: "HOME_CATEGORY",
      isActive: true,
      sortBy: "sortOrder",
      sortDirection: "ASC",
      size: 3,
    }),
    fetchProductsByCategorySlug("bo-do-tho", 8),
    fetchProductsByCategorySlug("binh-phong-thuy", 8),
    fetchProductsByCategorySlug("luc-binh-gom-su", 8),
    fetchList("/news", {
      status: "PUBLISHED",
      sortBy: "publishedAt",
      sortDirection: "DESC",
      size: 3,
    }),
  ]);

  return (
    <HomeView
      heroBanners={heroBanners}
      categoryBanners={categoryBanners}
      boDoThoProducts={boDoThoProducts}
      binhPhongThuyProducts={binhPhongThuyProducts}
      lucBinhProducts={lucBinhProducts}
      news={news}
    />
  );
}
