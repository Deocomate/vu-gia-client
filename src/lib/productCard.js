import { formatImageUrl } from "@/lib/media";

/**
 * Maps a raw backend `Product` DTO (see `GET /products`, `GET /products/slug/{slug}`)
 * into the flat prop shape `ProductCard` expects: real `slug`/`id` for routing, and
 * VND-formatted price strings for display.
 */
export function mapProductToCardProps(product) {
  const price = Number(product?.price) || 0;
  const compareAtPrice = Number(product?.compareAtPrice) || 0;

  return {
    id: product?.id,
    slug: product?.slug,
    image: formatImageUrl(product?.thumb),
    name: product?.name,
    sku: product?.sku,
    salePrice: `${price.toLocaleString("vi-VN")}đ`,
    originalPrice:
      compareAtPrice > price ? `${compareAtPrice.toLocaleString("vi-VN")}đ` : null,
    soldCount: product?.soldCount,
  };
}
