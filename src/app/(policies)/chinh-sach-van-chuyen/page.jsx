import ShippingPolicyView from "@/features/storefront/policies/ShippingPolicyView";
import JsonLd from "@/shared/components/seo/JsonLd";
import { getPageByKey } from "@/shared/lib/seo/pageByKey";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/shared/lib/seo/siteConfig";
import { buildBreadcrumbSchema } from "@/shared/lib/seo/schemas";
import { formatImageUrl } from "@/shared/api/media";

export async function generateMetadata() {
  const page = await getPageByKey("shipping-policy");
  const title = page?.seoTitle || "Chính sách vận chuyển";
  const description =
    page?.seoDescription || "Thông tin vận chuyển và giao nhận đơn hàng tại Gốm Sứ Vũ Gia.";
  const image = page?.seoImage ? formatImageUrl(page.seoImage) : DEFAULT_OG_IMAGE;
  const canonical = absoluteUrl("/chinh-sach-van-chuyen");

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
  { name: "Chính sách vận chuyển", url: "/chinh-sach-van-chuyen" },
]);

export default async function ShippingPolicyPage() {
  const page = await getPageByKey("shipping-policy");

  return (
    <>
      <JsonLd data={breadcrumb} />
      <ShippingPolicyView page={page} />
    </>
  );
}
