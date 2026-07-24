export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://gomvugia.vn"
).replace(/\/$/, "");

export const SITE_NAME = "Gốm Vũ Gia";

export const DEFAULT_OG_IMAGE = "/default-og.png";

export function absoluteUrl(path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}
