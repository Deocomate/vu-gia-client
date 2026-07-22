import { cache } from "react";
import ProductDetailView from "@/views/ProductDetailView";
import JsonLd from "@/components/seo/JsonLd";
import { publicGet, PublicApiError } from "@/lib/publicApi";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/lib/seo/siteConfig";
import { buildProductSchema, buildBreadcrumbSchema } from "@/lib/seo/schemas";
import { formatImageUrl } from "@/lib/media";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    return {
      title: "Sản phẩm không tồn tại",
      description: "Sản phẩm bạn tìm kiếm không tồn tại hoặc đã ngừng kinh doanh.",
    };
  }

  const title = product.seoTitle || product.name;
  const description =
    product.seoDescription ||
    `Mua ${product.name} gốm sứ Bát Tràng chính hãng tại Gốm Sứ Vũ Gia.`;
  const image = product.seoImage
    ? formatImageUrl(product.seoImage)
    : product.thumb
      ? formatImageUrl(product.thumb)
      : DEFAULT_OG_IMAGE;
  const canonical = absoluteUrl(`/san-pham/${slug}`);

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

const fetchProductBySlug = cache(async function fetchProductBySlug(slug) {
  try {
    return await publicGet(`/products/slug/${slug}`);
  } catch (error) {
    if (error instanceof PublicApiError) {
      if (error.status !== 404) console.error(`Failed to fetch product "${slug}":`, error.message);
      return null;
    }
    throw error;
  }
});

export default async function ProductDetailPage({ params, searchParams }) {
  const { slug } = await params;
  const sParams = await searchParams;
  const type = sParams?.type || null;
  const product = await fetchProductBySlug(slug);

  const breadcrumb = buildBreadcrumbSchema([
    { name: "Trang chủ", url: "/" },
    { name: "Sản phẩm", url: "/san-pham" },
    ...(product?.category
      ? [{ name: product.category.name, url: `/san-pham?category=${product.category.slug}` }]
      : []),
    { name: product?.name || slug, url: `/san-pham/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={buildProductSchema(product)} />
      <JsonLd data={breadcrumb} />
      <ProductDetailView slug={slug} type={type} product={product} />
    </>
  );
}
