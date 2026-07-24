import PrivacyPolicyView from "@/features/storefront/policies/privacy-policy-view";
import JsonLd from "@/shared/components/seo/json-ld";
import { getPageByKey } from "@/shared/lib/seo/page-by-key";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/shared/lib/seo/site-config";
import { buildBreadcrumbSchema } from "@/shared/lib/seo/schemas";
import { formatImageUrl } from "@/shared/api/media";

export async function generateMetadata() {
  const page = await getPageByKey("privacy-policy");
  const title = page?.seoTitle || "Bảo mật thông tin";
  const description =
    page?.seoDescription || "Chính sách bảo mật thông tin khách hàng của Gốm Sứ Vũ Gia.";
  const image = page?.seoImage ? formatImageUrl(page.seoImage) : DEFAULT_OG_IMAGE;
  const canonical = absoluteUrl("/bao-mat-thong-tin");

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
  { name: "Bảo mật thông tin", url: "/bao-mat-thong-tin" },
]);

export default async function PrivacyPolicyPage() {
  const page = await getPageByKey("privacy-policy");

  return (
    <>
      <JsonLd data={breadcrumb} />
      <PrivacyPolicyView page={page} />
    </>
  );
}
