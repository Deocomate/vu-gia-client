import ShowroomView from "@/features/storefront/showroom/ShowroomView";
import JsonLd from "@/shared/components/seo/JsonLd";
import { publicGet, PublicApiError } from "@/shared/api/publicApi";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/shared/lib/seo/siteConfig";
import { buildBreadcrumbSchema } from "@/shared/lib/seo/schemas";

export function generateMetadata() {
  const title = "Showroom";
  const description = "Không gian showroom trưng bày sản phẩm gốm sứ của Gốm Sứ Vũ Gia.";
  const canonical = absoluteUrl("/showroom");

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
  { name: "Showroom", url: "/showroom" },
]);

async function fetchShowrooms() {
  try {
    const data = await publicGet("/showrooms", { isActive: true });
    return data?.content ?? [];
  } catch (error) {
    if (error instanceof PublicApiError) {
      console.error("Failed to fetch showrooms:", error.message);
      return [];
    }
    throw error;
  }
}

export default async function ShowroomPage() {
  const showrooms = await fetchShowrooms();

  return (
    <>
      <JsonLd data={breadcrumb} />
      <ShowroomView showrooms={showrooms} />
    </>
  );
}
