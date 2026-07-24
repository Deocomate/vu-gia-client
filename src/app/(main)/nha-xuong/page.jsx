import FactoryView from "@/features/storefront/factory/factory-view";
import JsonLd from "@/shared/components/seo/json-ld";
import { getPageByKey } from "@/shared/lib/seo/page-by-key";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/shared/lib/seo/site-config";
import { buildBreadcrumbSchema } from "@/shared/lib/seo/schemas";
import { formatImageUrl } from "@/shared/api/media";

export async function generateMetadata() {
  const page = await getPageByKey("factory");
  const title = page?.seoTitle || "Nhà xưởng";
  const description =
    page?.seoDescription || "Khám phá nhà xưởng và năng lực sản xuất của Gốm Sứ Vũ Gia.";
  const image = page?.seoImage ? formatImageUrl(page.seoImage) : DEFAULT_OG_IMAGE;
  const canonical = absoluteUrl("/nha-xuong");

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
  { name: "Nhà xưởng", url: "/nha-xuong" },
]);

export default async function FactoryPage() {
  const page = await getPageByKey("factory");

  return (
    <>
      <JsonLd data={breadcrumb} />
      <FactoryView page={page} />
    </>
  );
}
