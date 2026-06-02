import NewsDetailView from "@/views/NewsDetailView";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  return {
    title: `Tin tức ${slug}`,
    description: `Đọc bài viết ${slug} từ Gốm Sứ Vũ Gia.`,
    openGraph: {
      images: ["/default-og.png"],
    },
  };
}

export default async function NewsDetailPage({ params }) {
  const { slug } = await params;

  return <NewsDetailView slug={slug} />;
}
