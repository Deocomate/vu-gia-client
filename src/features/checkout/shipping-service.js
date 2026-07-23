// Public (unauthenticated) shipping-methods list (BE-2, `SHIPPING_API.md`).
// Same pagination convention as the existing `/api/banners` public search.
import { publicGet } from "@/lib/publicApi";

/**
 * `GET /api/shipping-methods` — active methods sorted by `sortOrder`
 * ascending, for the checkout form's shipping `<select>`. Returns the flat
 * array (unwraps the page envelope) since the storefront always needs the
 * whole active list at once.
 */
export async function listActiveShippingMethods() {
  const page = await publicGet("/shipping-methods", {
    isActive: true,
    sortBy: "sortOrder",
    sortDirection: "ASC",
    size: 100,
  });
  return page?.content || [];
}
