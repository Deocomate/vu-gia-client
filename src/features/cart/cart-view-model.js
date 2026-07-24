// Normalizes cart line items into ONE shape for UI components, regardless of
// whether the store is in guest (local, pre-login) or server (authenticated,
// API-synced) mode. Server items are keyed by cart-line `id` and use
// `productId/productName/productThumb/unitPrice/lineTotal` (CART_API.md §4);
// guest items are keyed by the real numeric product id and use the older
// ad-hoc `{title, sku, price, image}` shape. `cartStore.js` keeps both raw
// shapes as-is (guest reducers untouched, server actions store the raw
// `CartItemResponse[]`) — this module is the single place that bridges them.
import { formatImageUrl } from "@/shared/api/media";

/** Normalizes a server `CartItemResponse` (CART_API.md §4) into the cart UI's line-item shape. */
export function toCartLineVM(serverItem) {
  const quantity = Number(serverItem?.quantity) || 0;
  const price = Number(serverItem?.unitPrice) || 0;
  return {
    id: serverItem?.id, // cart-line id — required for update/remove
    productId: serverItem?.productId,
    title: serverItem?.productName || "",
    sku: null,
    image: formatImageUrl(serverItem?.productThumb),
    slug: serverItem?.productSlug || null,
    price,
    quantity,
    lineTotal: Number(serverItem?.lineTotal) || price * quantity,
    comboItems: serverItem?.comboItems ?? null,
    classification: "Mặc định",
    packSize: 1,
    source: "server",
  };
}

/** Normalizes a local guest cart item (`cartStore`'s `items`) into the same shape. */
export function toGuestLineVM(guestItem) {
  const quantity = Number(guestItem?.quantity) || 0;
  const price = Number(guestItem?.price) || 0;
  return {
    id: guestItem?.id,
    productId: guestItem?.id, // guest lines are keyed by the real numeric product id (RT-A)
    title: guestItem?.title || "",
    sku: guestItem?.sku || "",
    image: guestItem?.image,
    slug: guestItem?.slug || null,
    price,
    quantity,
    lineTotal: price * quantity,
    comboItems: null,
    classification: guestItem?.classification || "Mặc định",
    packSize: guestItem?.packSize || 1,
    source: "guest",
  };
}

/** Maps a raw `items` array from `cartStore` into view-model rows for the given `mode`. */
export function toCartLineVMList(items, mode) {
  const normalizer = mode === "server" ? toCartLineVM : toGuestLineVM;
  return (items || []).map(normalizer);
}
