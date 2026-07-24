import FaqView from "@/views/FaqView";
import JsonLd from "@/shared/components/seo/JsonLd";
import { publicGet, PublicApiError } from "@/shared/api/publicApi";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/shared/lib/seo/siteConfig";
import { buildBreadcrumbSchema } from "@/shared/lib/seo/schemas";

export function generateMetadata() {
  const title = "Câu hỏi thường gặp";
  const description = "Giải đáp các câu hỏi thường gặp khi mua hàng tại Gốm Sứ Vũ Gia.";
  const canonical = absoluteUrl("/cau-hoi-thuong-gap");

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
  { name: "Câu hỏi thường gặp", url: "/cau-hoi-thuong-gap" },
]);

async function fetchFaqs() {
  try {
    const data = await publicGet("/faqs", {
      isActive: true,
      sortBy: "sortOrder",
      sortDirection: "ASC",
    });
    return data?.content ?? [];
  } catch (error) {
    if (error instanceof PublicApiError) {
      console.error("Failed to fetch FAQs:", error.message);
      return [];
    }
    throw error;
  }
}

export default async function FaqPage() {
  const faqs = await fetchFaqs();

  return (
    <>
      <JsonLd data={breadcrumb} />
      <FaqView faqs={faqs} />
    </>
  );
}
