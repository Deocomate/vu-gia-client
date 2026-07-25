import ProductsView from "@/features/storefront/products/products-view";
import JsonLd from "@/shared/components/seo/json-ld";
import { publicGet, PublicApiError } from "@/shared/api/public-api";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/shared/lib/seo/site-config";
import { buildBreadcrumbSchema } from "@/shared/lib/seo/schemas";
import { formatImageUrl } from "@/shared/api/media";

/** Fetches one of the 6 fixed categories by slug, for per-category SEO metadata. */
async function fetchCategoryBySlug(slug) {
  try {
    return await publicGet(`/product-categories/slug/${slug}`);
  } catch (error) {
    if (error instanceof PublicApiError) {
      if (error.status !== 404) console.error(`Failed to fetch category "${slug}":`, error.message);
      return null;
    }
    throw error;
  }
}

export async function generateMetadata({ searchParams }) {
  const sParams = await searchParams;
  const categorySlug = sParams?.category;
  const category = categorySlug ? await fetchCategoryBySlug(categorySlug) : null;

  const title = category?.seoTitle || category?.name || "Sản phẩm";
  const description =
    category?.seoDescription ||
    "Danh mục sản phẩm gốm sứ Bát Tràng chính hãng tại Gốm Sứ Vũ Gia.";
  const image = category?.seoImage ? formatImageUrl(category.seoImage) : DEFAULT_OG_IMAGE;
  const canonical = absoluteUrl(categorySlug ? `/san-pham?category=${categorySlug}` : "/san-pham");

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

const breadcrumb = buildBreadcrumbSchema([
  { name: "Trang chủ", url: "/" },
  { name: "Sản phẩm", url: "/san-pham" },
]);

const PAGE_SIZE = 8;

// Maps the toolbar's UI sort keys to the backend's `sortBy`/`sortDirection` params.
const SORT_MAP = {
  newest: { sortBy: "createdAt", sortDirection: "desc" },
  "best-seller": { sortBy: "soldCount", sortDirection: "desc" },
  "price-asc": { sortBy: "price", sortDirection: "asc" },
  "price-desc": { sortBy: "price", sortDirection: "desc" },
};

async function fetchCategories() {
  try {
    const data = await publicGet("/product-categories", { size: 100 });
    return data?.content || [];
  } catch (error) {
    if (error instanceof PublicApiError) {
      console.error("Failed to fetch product categories:", error.message);
      return [];
    }
    throw error;
  }
}

async function fetchProducts({ productCategoryId, sort, page, search }) {
  const { sortBy, sortDirection } = SORT_MAP[sort] || SORT_MAP.newest;
  try {
    return await publicGet("/products", {
      status: "PUBLISHED",
      productCategoryId,
      name: search || undefined,
      sortBy,
      sortDirection,
      page,
      size: PAGE_SIZE,
    });
  } catch (error) {
    if (error instanceof PublicApiError) {
      console.error("Failed to fetch products:", error.message);
      return null;
    }
    throw error;
  }
}

async function fetchNews() {
  try {
    const data = await publicGet("/news", {
      status: "PUBLISHED",
      sortBy: "publishedAt",
      sortDirection: "desc",
      size: 3,
    });
    return data?.content || [];
  } catch (error) {
    if (error instanceof PublicApiError) {
      console.error("Failed to fetch news:", error.message);
      return [];
    }
    throw error;
  }
}

export default async function ProductsPage({ searchParams }) {
  const sParams = await searchParams;
  const categorySlug = sParams?.category || "all";
  const sort = sParams?.sort || "newest";
  const page = Number(sParams?.page) || 1;
  const search = sParams?.q || "";

  const categories = await fetchCategories();
  const activeCategory =
    categorySlug !== "all" ? categories.find((category) => category.slug === categorySlug) : null;

  const [productsData, news] = await Promise.all([
    fetchProducts({
      productCategoryId: activeCategory?.id,
      sort,
      page,
      search,
    }),
    fetchNews(),
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <ProductsView
        categories={categories}
        products={productsData?.content || []}
        totalElements={productsData?.totalElements ?? 0}
        totalPages={productsData?.totalPages || 1}
        currentPage={productsData?.pageNumber || page}
        selectedCategory={categorySlug}
        selectedSort={sort}
        searchTerm={search}
        news={news}
      />
    </>
  );
}
