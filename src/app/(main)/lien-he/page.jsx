import ContactView from "@/features/storefront/contact/contact-view";
import JsonLd from "@/shared/components/seo/json-ld";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/shared/lib/seo/site-config";
import { buildBreadcrumbSchema } from "@/shared/lib/seo/schemas";

export function generateMetadata() {
  const title = "Liên hệ";
  const description = "Liên hệ Gốm Sứ Vũ Gia để được tư vấn sản phẩm và dịch vụ.";
  const canonical = absoluteUrl("/lien-he");

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

const breadcrumb = buildBreadcrumbSchema([
  { name: "Trang chủ", url: "/" },
  { name: "Liên hệ", url: "/lien-he" },
]);

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumb} />
      <ContactView />
    </>
  );
}
