"use client";

import AdminResourceManager from "@/features/admin/AdminResourceManager";
import { resources } from "@/features/admin/adminResources";

// Products has no per-page custom logic left to wire (unlike Orders/Users): the status/"Nổi bật"
// inline controls and the delete-confirm copy live directly on `resources.products` in
// `adminResources.js` as `column.render`/`deleteTitle`/`deleteDescription`, and create/edit both
// redirect to the dedicated `AdminProductDetailPage.jsx` route (via `onCreate` and `detailPath`),
// so this is a pure passthrough wrapper.
export default function ProductsAdminList() {
  return <AdminResourceManager resource={resources.products} />;
}
