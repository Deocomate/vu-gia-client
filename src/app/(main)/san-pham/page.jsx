import ProductsView from "@/views/ProductsView";
import { ROUTES } from "@/utils/routes";

export const metadata = {
  title: "Sản phẩm",
  description: "Danh mục sản phẩm gốm sứ Bát Tràng chính hãng tại Gốm Sứ Vũ Gia.",
  alternates: {
    canonical: ROUTES.PRODUCTS,
  },
};

export default function ProductsPage() {
  return <ProductsView />;
}
