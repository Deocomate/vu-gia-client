import placeholder from "@/assets/images/products/product-image-thumb.png";

/** Fallback cho <Image> khi src rỗng/lỗi. StaticImageData — chỉ dùng với next/image. */
export const PLACEHOLDER_IMAGE = placeholder;

// Same env var + default as `next.config.mjs`'s `imageBaseUrl` (the backend origin serving
// uploaded files under /files/**, `app.storage.public-url` on the API side — default
// http://localhost:8080). Recomputed here rather than imported: next.config.mjs is a build-time
// -only Node config module, not something this browser/SSR-shared module can import.
const DEFAULT_BACKEND_ORIGIN = "http://localhost:8080";
const FILES_PREFIX = "/files/";

function resolveBackendOrigin() {
  try {
    return new URL(process.env.NEXT_PUBLIC_IMAGE_BASE_URL || DEFAULT_BACKEND_ORIGIN).origin;
  } catch {
    return DEFAULT_BACKEND_ORIGIN;
  }
}

const BACKEND_ORIGIN = resolveBackendOrigin();

export function formatImageUrl(url) {
  if (!url) return "";

  // Decision D2 (Phase 5 — canvas tainting): a real admin-uploaded overlay/thumb is served
  // absolute from the backend origin (StorageUrlSerializer always prepends
  // `app.storage.public-url`), which is cross-origin from this client and taints any <canvas>
  // that draws it (`compose-altar-image.js`'s `toDataURL()` would throw SecurityError). Rewrite
  // it to the same-origin relative path instead — `next.config.mjs`'s `/files/:path*` rewrite
  // proxies that relative path back to this exact backend origin, so the resolved file is
  // identical, just same-origin. Seeded images (bare "assets/..." paths) never hit this branch;
  // they already fall through to the trailing `/${url}` case below.
  if (url.startsWith(BACKEND_ORIGIN)) {
    const rest = url.slice(BACKEND_ORIGIN.length);
    if (rest.startsWith(FILES_PREFIX)) return rest;
  }

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
