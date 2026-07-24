import ProductsView from "@/views/ProductsView";
import JsonLd from "@/components/seo/JsonLd";
import { publicGet, PublicApiError } from "@/shared/api/publicApi";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/shared/lib/seo/siteConfig";
import { buildBreadcrumbSchema } from "@/shared/lib/seo/schemas";

export function generateMetadata() {
  const title = "Sản phẩm";
  const description = "Danh mục sản phẩm gốm sứ Bát Tràng chính hãng tại Gốm Sứ Vũ Gia.";
  const canonical = absoluteUrl("/san-pham");

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

export default async function ProductsPage({ searchParams }) {
  const sParams = await searchParams;
  const categorySlug = sParams?.category || "all";
  const sort = sParams?.sort || "newest";
  const page = Number(sParams?.page) || 1;
  const search = sParams?.q || "";

  const categories = await fetchCategories();
  const activeCategory =
    categorySlug !== "all" ? categories.find((category) => category.slug === categorySlug) : null;

  const productsData = await fetchProducts({
    productCategoryId: activeCategory?.id,
    sort,
    page,
    search,
  });

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
      />
    </>
  );
}
