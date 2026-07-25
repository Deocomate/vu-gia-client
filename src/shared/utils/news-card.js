import { formatImageUrl } from "@/shared/api/media";

/**
 * Maps a raw backend `News` DTO (see `GET /news`, `GET /news/slug/{slug}`)
 * into the flat prop shape `NewsCard` expects.
 */
export function mapNewsToCardProps(news) {
  return {
    id: news?.id,
    slug: news?.slug,
    image: formatImageUrl(news?.thumb),
    category: news?.category?.name,
    title: news?.title,
    description: news?.shortContent,
  };
}
