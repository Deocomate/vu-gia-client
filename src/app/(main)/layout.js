import PublicLayout from "@/components/shared/PublicLayout";
import { publicGet, PublicApiError } from "@/shared/api/publicApi";

/**
 * Header is a client component and can't fetch itself, so the active
 * product-category list (used for its "Sản phẩm" submenu) is fetched once
 * here, at the layout level shared by every public page.
 */
async function fetchActiveProductCategories() {
  try {
    const data = await publicGet("/product-categories", {
      isActive: true,
      sortBy: "priority",
      sortDirection: "ASC",
      size: 20,
    });
    return data?.content ?? [];
  } catch (error) {
    if (error instanceof PublicApiError) {
      console.error("Failed to fetch active product categories:", error.message);
      return [];
    }
    throw error;
  }
}

export default async function MainLayout({ children }) {
  const categories = await fetchActiveProductCategories();

  return <PublicLayout categories={categories}>{children}</PublicLayout>;
}
