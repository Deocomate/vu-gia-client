import { SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl } from "@/shared/lib/seo/site-config";
import { formatImageUrl } from "@/shared/api/media";

/**
 * Resolves any backend-relative or storage-relative image path into an
 * absolute URL suitable for JSON-LD/OG consumers. Falls back to the site's
 * default OG image when the entity has no image of its own.
 */
function resolveAbsoluteImage(path) {
  if (!path) return absoluteUrl(DEFAULT_OG_IMAGE);
  const formatted = formatImageUrl(path);
  return formatted.startsWith("http") ? formatted : absoluteUrl(formatted);
}

/**
 * Builds a schema.org `Product` node for a product detail page.
 * `product` is the raw DTO returned by `GET /products/slug/{slug}`.
 */
export function buildProductSchema(product) {
  if (!product) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [resolveAbsoluteImage(product.thumb)],
    description:
      product.seoDescription ||
      `${product.name} - gốm sứ Bát Tràng chính hãng tại ${SITE_NAME}.`,
    sku: product.sku || undefined,
    category: product.category?.name || undefined,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/san-pham/${product.slug}`),
      priceCurrency: "VND",
      price: product.price,
    },
  };
}

/**
 * Builds a schema.org `NewsArticle` node for a news detail page.
 * `news` is the raw DTO returned by `GET /news/slug/{slug}`.
 */
export function buildArticleSchema(news) {
  if (!news) return null;

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.title,
    image: [resolveAbsoluteImage(news.thumb)],
    description: news.seoDescription || news.shortContent || undefined,
    datePublished: news.publishedAt || undefined,
    dateModified: news.updatedAt || news.publishedAt || undefined,
    mainEntityOfPage: absoluteUrl(`/tin-tuc/${news.slug}`),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/images/header/logo.png"),
      },
    },
  };
}

/**
 * Builds a schema.org `BreadcrumbList` node.
 * `crumbs` is an ordered array of `{ name, url }`, `url` relative to site root.
 */
export function buildBreadcrumbSchema(crumbs) {
  if (!Array.isArray(crumbs) || crumbs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.url),
    })),
  };
}

/**
 * Builds the site-wide schema.org `Organization` node, rendered once in the
 * root layout.
 */
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/images/header/logo.png"),
  };
}
