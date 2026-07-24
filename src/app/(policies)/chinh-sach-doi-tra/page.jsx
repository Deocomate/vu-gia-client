import ReturnPolicyView from "@/features/storefront/policies/return-policy-view";
import JsonLd from "@/shared/components/seo/json-ld";
import { getPageByKey } from "@/shared/lib/seo/page-by-key";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/shared/lib/seo/site-config";
import { buildBreadcrumbSchema } from "@/shared/lib/seo/schemas";
import { formatImageUrl } from "@/shared/api/media";

export async function generateMetadata() {
  const page = await getPageByKey("return-policy");
  const title = page?.seoTitle || "Chính sách đổi trả";
  const description = page?.seoDescription || "Chính sách đổi trả sản phẩm của Gốm Sứ Vũ Gia.";
  const image = page?.seoImage ? formatImageUrl(page.seoImage) : DEFAULT_OG_IMAGE;
  const canonical = absoluteUrl("/chinh-sach-doi-tra");

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
  { name: "Chính sách đổi trả", url: "/chinh-sach-doi-tra" },
]);

export default async function ReturnPolicyPage() {
  const page = await getPageByKey("return-policy");

  return (
    <>
      <JsonLd data={breadcrumb} />
      <ReturnPolicyView page={page} />
    </>
  );
}
