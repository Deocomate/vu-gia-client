import placeholder from "@/assets/images/products/product-image-thumb.png";

/** Fallback cho <Image> khi src rỗng/lỗi. StaticImageData — chỉ dùng với next/image. */
export const PLACEHOLDER_IMAGE = placeholder;

export function formatImageUrl(url) {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("/")
  ) {
    return url;
  }
  // Backend-managed uploads are always absolute already (see @StorageUrl on the
  // API side), so any bare relative value reaching here (e.g. seed data's
  // "assets/images/products/...") refers to files bundled under this app's own
  // public/assets/ — resolve same-origin, not against an external image host.
  return `/${url}`;
}
