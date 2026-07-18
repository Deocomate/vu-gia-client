import NewsView from "@/views/NewsView";
import JsonLd from "@/components/seo/JsonLd";
import { publicGet, PublicApiError } from "@/lib/publicApi";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/lib/seo/siteConfig";
import { buildBreadcrumbSchema } from "@/lib/seo/schemas";

export function generateMetadata() {
  const title = "Tin tức";
  const description = "Tin tức và sự kiện mới nhất từ Gốm Sứ Vũ Gia.";
  const canonical = absoluteUrl("/tin-tuc");

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

const breadcrumb = buildBreadcrumbSchema([
  { name: "Trang chủ", url: "/" },
  { name: "Tin tức", url: "/tin-tuc" },
]);

const PAGE_SIZE = 6;

function parsePage(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

async function fetchNewsCategories() {
  try {
    const data = await publicGet("/news-categories", { page: 1, size: 100 });
    return data?.content ?? [];
  } catch (error) {
    if (error instanceof PublicApiError) {
      console.error("Failed to fetch news categories:", error.message);
      return [];
    }
    throw error;
  }
}

async function fetchNews({ newsCategoryId, page }) {
  try {
    return await publicGet("/news", {
      status: "PUBLISHED",
      newsCategoryId,
      sortBy: "publishedAt",
      sortDirection: "DESC",
      page,
      size: PAGE_SIZE,
    });
  } catch (error) {
    if (error instanceof PublicApiError) {
      console.error("Failed to fetch news:", error.message);
      return { content: [], pageNumber: page, pageSize: PAGE_SIZE, totalElements: 0, totalPages: 1 };
    }
    throw error;
  }
}

export default async function NewsPage({ searchParams }) {
  const params = await searchParams;
  const page = parsePage(params?.page);

  const categories = await fetchNewsCategories();
  // Default to the first real category so the tab bar always has one active
  // entry, mirroring the previous mock's always-one-selected UX.
  const newsCategoryId = params?.newsCategoryId || categories[0]?.id || undefined;

  const newsData = await fetchNews({ newsCategoryId, page });

  return (
    <>
      <JsonLd data={breadcrumb} />
      <NewsView
        news={newsData?.content ?? []}
        categories={categories}
        currentPage={newsData?.pageNumber ?? page}
        totalPages={newsData?.totalPages ?? 1}
        activeCategoryId={newsCategoryId ?? ""}
      />
    </>
  );
}
