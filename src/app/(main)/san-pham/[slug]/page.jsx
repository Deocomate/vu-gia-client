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

export default async function ProductDetailPage({ params, searchParams }) {
  const { slug } = await params;
  const sParams = await searchParams;
  const type = sParams?.type || null;

  return <ProductDetailView slug={slug} type={type} />;
}
