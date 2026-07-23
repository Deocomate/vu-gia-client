// Public (unauthenticated) coupon preview endpoint (`COUPON_API.md` §3.2/4).
// Always responds 200 with `{valid, code, discountType, discountAmount,
// freeShipping, message}` — never throws for an invalid/inapplicable code,
// only for a genuine transport/server failure (`PublicApiError`).
import { publicPost } from "@/lib/publicApi";

/**
 * `POST /api/coupons/validate` — client-side preview only. The order
 * response's `discountAmount`/`totalAmount` remain authoritative (the order
 * endpoint additionally enforces `usageLimitPerUser`).
 */
export function validateCoupon({ code, orderAmount }) {
  return publicPost("/coupons/validate", { code, orderAmount });
}
