import HomeView from "@/features/storefront/home/home-view";
import { publicGet, PublicApiError } from "@/shared/api/public-api";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/shared/lib/seo/site-config";

export function generateMetadata() {
  const title = "Trang chủ";
  const description = "Gốm Sứ Vũ Gia - gốm sứ Bát Tràng chính hãng.";
  const canonical = absoluteUrl("/");

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
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

export default async function HomePage() {
  const [heroBanners, categoryBanners, featuredProducts, news, categories] =
    await Promise.all([
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
      fetchList("/products", {
        isFeatured: true,
        status: "PUBLISHED",
        size: 8,
      }),
      fetchList("/news", {
        status: "PUBLISHED",
        sortBy: "publishedAt",
        sortDirection: "DESC",
        size: 3,
      }),
      fetchList("/product-categories", {
        isActive: true,
        sortBy: "priority",
        sortDirection: "ASC",
        size: 20,
      }),
    ]);

  return (
    <HomeView
      heroBanners={heroBanners}
      categoryBanners={categoryBanners}
      featuredProducts={featuredProducts}
      news={news}
      categories={categories}
    />
  );
}
