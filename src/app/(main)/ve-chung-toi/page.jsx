import AboutView from "@/features/storefront/about/about-view";
import JsonLd from "@/shared/components/seo/json-ld";
import { getPageByKey } from "@/shared/lib/seo/page-by-key";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/shared/lib/seo/site-config";
import { buildBreadcrumbSchema } from "@/shared/lib/seo/schemas";
import { formatImageUrl } from "@/shared/api/media";

export async function generateMetadata() {
  const page = await getPageByKey("about");
  const title = page?.seoTitle || "Về chúng tôi";
  const description =
    page?.seoDescription ||
    "Gốm Sứ Vũ Gia - kết tinh di sản rực rỡ nghìn năm lửa đỏ Bát Tràng.";
  const image = page?.seoImage ? formatImageUrl(page.seoImage) : DEFAULT_OG_IMAGE;
  const canonical = absoluteUrl("/ve-chung-toi");

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
  { name: "Về chúng tôi", url: "/ve-chung-toi" },
]);

export default async function AboutPage() {
  const page = await getPageByKey("about");

  return (
    <>
      <JsonLd data={breadcrumb} />
      <AboutView page={page} />
    </>
  );
}
