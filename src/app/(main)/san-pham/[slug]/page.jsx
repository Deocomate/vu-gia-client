import ProductDetailView from "@/views/ProductDetailView";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  return {
    title: `Chi tiết sản phẩm ${slug}`,
    description: `Mua sản phẩm ${slug} gốm sứ Bát Tràng chính hãng tại Gốm Sứ Vũ Gia.`,
    openGraph: {
      images: ["/default-og.png"],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;

  return <ProductDetailView slug={slug} />;
}
