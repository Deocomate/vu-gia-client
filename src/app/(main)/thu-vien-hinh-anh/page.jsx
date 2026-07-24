import GalleryView from "@/views/GalleryView";
import JsonLd from "@/shared/components/seo/JsonLd";
import { publicGet, PublicApiError } from "@/shared/api/publicApi";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/shared/lib/seo/siteConfig";
import { buildBreadcrumbSchema } from "@/shared/lib/seo/schemas";

export function generateMetadata() {
  const title = "Thư viện hình ảnh";
  const description = "Thư viện hình ảnh sản phẩm, showroom và nhà xưởng của Gốm Sứ Vũ Gia.";
  const canonical = absoluteUrl("/thu-vien-hinh-anh");

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
  { name: "Thư viện hình ảnh", url: "/thu-vien-hinh-anh" },
]);

async function fetchGalleryImages() {
  try {
    const data = await publicGet("/gallery-images", {
      isActive: true,
      sortBy: "sortOrder",
      sortDirection: "ASC",
    });
    return data?.content ?? [];
  } catch (error) {
    if (error instanceof PublicApiError) {
      console.error("Failed to fetch gallery images:", error.message);
      return [];
    }
    throw error;
  }
}

export default async function GalleryPage() {
  const images = await fetchGalleryImages();

  return (
    <>
      <JsonLd data={breadcrumb} />
      <GalleryView images={images} />
    </>
  );
}
