import { cache } from "react";
import NewsDetailView from "@/views/NewsDetailView";
import JsonLd from "@/components/seo/JsonLd";
import { publicGet, PublicApiError } from "@/lib/publicApi";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/lib/seo/siteConfig";
import { buildArticleSchema, buildBreadcrumbSchema } from "@/lib/seo/schemas";
import { formatImageUrl } from "@/lib/media";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const news = await fetchNewsBySlug(slug);

  if (!news) {
    return {
      title: "Bài viết không tồn tại",
      description: "Bài viết bạn tìm kiếm không tồn tại hoặc đã bị gỡ bỏ.",
    };
  }

  const title = news.seoTitle || news.title;
  const description =
    news.seoDescription || news.shortContent || `Đọc bài viết ${news.title} từ Gốm Sứ Vũ Gia.`;
  const image = news.seoImage
    ? formatImageUrl(news.seoImage)
    : news.thumb
      ? formatImageUrl(news.thumb)
      : DEFAULT_OG_IMAGE;
  const canonical = absoluteUrl(`/tin-tuc/${slug}`);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [image],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

const fetchNewsBySlug = cache(async function fetchNewsBySlug(slug) {
  try {
    return await publicGet(`/news/slug/${slug}`);
  } catch (error) {
    if (error instanceof PublicApiError) {
      if (error.status !== 404) console.error(`Failed to fetch news "${slug}":`, error.message);
      return null;
    }
    throw error;
  }
});

export default async function NewsDetailPage({ params }) {
  const { slug } = await params;
  const news = await fetchNewsBySlug(slug);

  const breadcrumb = buildBreadcrumbSchema([
    { name: "Trang chủ", url: "/" },
    { name: "Tin tức", url: "/tin-tuc" },
    ...(news?.category
      ? [{ name: news.category.name, url: `/tin-tuc?newsCategoryId=${news.category.id}` }]
      : []),
    { name: news?.title || slug, url: `/tin-tuc/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={buildArticleSchema(news)} />
      <JsonLd data={breadcrumb} />
      <NewsDetailView slug={slug} des={news?.des} />
    </>
  );
}
