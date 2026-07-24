"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/shared/Breadcrumb";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutOrderSummary from "@/components/checkout/CheckoutOrderSummary";
import { ROUTES } from "@/shared/utils/routes";
import { useCartStore } from "@/shared/stores/cartStore";
import { toCartLineVMList } from "@/features/cart/cart-view-model";
import { getCart } from "@/features/cart/cart-service";
import { placeOrder } from "@/features/orders/order-service";
import { useIdempotencyKey } from "@/features/checkout/use-idempotency-key";
import { validateCoupon } from "@/features/checkout/coupon-service";
import { listActiveShippingMethods } from "@/features/checkout/shipping-service";
import { useDebouncedCallback } from "@/shared/hooks/useDebouncedCallback";
import { confirm, toast } from "@/shared/utils/feedback";

// Backend error codes surfaced inline (ORDER_API.md): 4001 validation, 4044
// product gone, 4052 coupon not found, 4105 coupon not applicable (message
// carries the reason), 4060 shipping method not found/inactive (BE-2).
function describeOrderError(error) {
  switch (error?.code) {
    case 4001:
      return "Thông tin đơn hàng không hợp lệ. Vui lòng kiểm tra lại các trường bắt buộc.";
    case 4044:
      return "Một sản phẩm trong giỏ hàng không còn tồn tại. Giỏ hàng sẽ được cập nhật lại.";
    case 4052:
      return "Mã giảm giá không tồn tại.";
    case 4105:
      return error?.message || "Mã giảm giá không áp dụng được cho đơn hàng này.";
    case 4060:
      return "Phương thức vận chuyển không khả dụng. Vui lòng chọn lại.";
    default:
      return error?.message || "Không thể đặt hàng. Vui lòng thử lại.";
  }
}

export default function CheckoutView() {
  const router = useRouter();
  const mode = useCartStore((s) => s.mode);
  const rawItems = useCartStore((s) => s.items);
  const totalAmount = useCartStore((s) => s.totalAmount);
  const removeLine = useCartStore((s) => s.removeLine);
  const hydrateFromServer = useCartStore((s) => s.hydrateFromServer);

  const cartItems = useMemo(() => toCartLineVMList(rawItems, mode), [rawItems, mode]);

  const breadcrumbs = [
    { name: "Trang chủ", href: ROUTES.HOME },
    { name: "Thanh toán", href: null },
  ];

  // ---- Coupon preview (RT-B) — server-validated estimate, never authoritative ----
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponFreeShipping, setCouponFreeShipping] = useState(false);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // ---- Shipping methods (BE-2) ----
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);

  // ---- Submission ----
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idempotencyKey, regenerateIdempotencyKey] = useIdempotencyKey();

  // Server mode trusts `totalAmount` (unitPrice is always current server
  // price); guest mode sums each line's display-only `lineTotal` — same
  // convention as CartView.
  const subtotal = useMemo(() => {
    if (mode === "server") return totalAmount;
    return cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  }, [mode, totalAmount, cartItems]);

  const shippingFee = couponFreeShipping ? 0 : Number(selectedShippingMethod?.fee) || 0;
  const tax = 0;

  // Display-only estimate — the order response's totalAmount/discountAmount are authoritative.
  const total = useMemo(
    () => subtotal - discountAmount + shippingFee + tax,
    [subtotal, discountAmount, shippingFee, tax],
  );

  useEffect(() => {
    let cancelled = false;
    listActiveShippingMethods()
      .then((methods) => {
        if (!cancelled) setShippingMethods(methods);
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(error?.message || "Không thể tải danh sách phương thức vận chuyển.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const resetCouponPreview = useCallback(() => {
    setCouponCode("");
    setDiscountAmount(0);
    setCouponFreeShipping(false);
  }, []);

  const runValidateCoupon = useCallback(async (code, orderAmount) => {
    const trimmed = code.trim();
    if (!trimmed) {
      toast.error("Vui lòng nhập mã ưu đãi.");
      return;
    }
    setIsValidatingCoupon(true);
    try {
      const result = await validateCoupon({ code: trimmed, orderAmount });
      if (result?.valid) {
        setCouponCode(result.code || trimmed.toUpperCase());
        setDiscountAmount(Number(result.discountAmount) || 0);
        setCouponFreeShipping(Boolean(result.freeShipping));
        toast.success(result.message || "Áp dụng mã ưu đãi thành công.");
      } else {
        setCouponCode("");
        setDiscountAmount(0);
        setCouponFreeShipping(false);
        toast.error(result?.message || "Mã ưu đãi không hợp lệ.");
      }
    } catch (error) {
      setCouponCode("");
      setDiscountAmount(0);
      setCouponFreeShipping(false);
      toast.error(error?.message || "Không thể kiểm tra mã ưu đãi. Vui lòng thử lại.");
    } finally {
      setIsValidatingCoupon(false);
    }
  }, []);

  const debouncedValidateCoupon = useDebouncedCallback(runValidateCoupon, 400);

  const handleApplyPromo = (code) => {
    debouncedValidateCoupon(code, subtotal);
  };

  const handleRemoveItem = async (id) => {
    const ok = await confirm({
      title: "Xóa sản phẩm",
      description: "Bạn có chắc chắn muốn xóa sản phẩm này khỏi đơn hàng?",
      confirmLabel: "Xóa",
      cancelLabel: "Hủy",
      destructive: true,
    });
    if (!ok) return;
    removeLine(id);
    // The order amount just changed — a previously validated discount no
    // longer reflects the current cart; drop it rather than submit a stale estimate.
    resetCouponPreview();
  };

  const handleEditItem = (id) => {
    toast.info(`Chỉnh sửa tùy chọn cho sản phẩm #${id}`);
  };

  const handleShippingMethodChange = (method) => {
    setSelectedShippingMethod(method);
  };

  const handleCheckoutSubmit = async (formData) => {
    if (isSubmitting) return;
    if (cartItems.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        idempotencyKey,
        items: cartItems.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        paymentMethod: formData.paymentMethod,
        shippingMethodId: formData.shippingMethodId,
        receiverName: formData.receiverName,
        receiverPhone: formData.receiverPhone,
        receiverAddress: formData.receiverAddress,
        ...(couponCode ? { couponCode } : {}),
        ...(formData.note ? { note: formData.note } : {}),
      };

      const order = await placeOrder(payload);

      // Confirmed 2xx — safe to rotate the key for any future checkout attempt (RT-A).
      regenerateIdempotencyKey();
      resetCouponPreview();

      // COD and ONL both prune the cart server-side immediately; reconcile
      // from the fresh server cart rather than blind-clearing (RT-C/RT-D) —
      // COD may leave unordered remainders, and ONL's QR/payment info lives
      // on the order, not the cart.
      try {
        const freshCart = await getCart();
        hydrateFromServer(freshCart);
      } catch {
        // Best-effort resync only — never block navigation to the
        // already-placed order's result page on a resync failure.
      }

      toast.success("Đặt hàng thành công!", { duration: 4000 });
      router.push(ROUTES.CHECKOUT_RESULT(order.id));
    } catch (error) {
      setIsSubmitting(false);
      toast.error(describeOrderError(error));
      // 4044's message promises the cart gets refreshed — actually do it, so a
      // retry doesn't keep resubmitting the same now-gone product/line.
      if (error?.code === 4044) {
        try {
          const freshCart = await getCart();
          hydrateFromServer(freshCart);
        } catch {
          // Best-effort resync only — the error toast already told the user what happened.
        }
      }
    }
  };

  return (
    <div className="w-full bg-white min-h-screen pt-[40px] pb-[50px] lg:pb-[100px] px-[30px] md:px-[60px] lg:px-[80px]">
      <div className="max-w-[1440px] mx-auto flex flex-col">
        {/* Breadcrumb Trail */}
        <Breadcrumb
          items={breadcrumbs}
          className="hidden md:block mb-[25px]"
        />

        {/* Page Title */}
        <h1 className="font-arima text-[#2E2F2A] text-[36px] font-[400] leading-[40px] mb-[30px]">
          Thanh toán
        </h1>

        {/* Checkout Content Columns */}
        <div className="flex flex-col lg:flex-row gap-[30px] lg:gap-[70px] items-start w-full">
          {/* Left Column - Form fields */}
          <div className="flex-1 w-full">
            {cartItems.length > 0 ? (
              <CheckoutForm
                onSubmit={handleCheckoutSubmit}
                shippingMethods={shippingMethods}
                orderAmount={total}
                isSubmitting={isSubmitting}
                onShippingMethodChange={handleShippingMethodChange}
              />
            ) : (
              <div className="w-full bg-white border border-[#909090] rounded-[6px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] p-12 text-center font-montserrat">
                <p className="text-[#909090] text-[16px] font-[500]">
                  Đơn hàng của bạn đã được gửi hoặc trống. Quay về cửa hàng để tiếp tục mua sắm.
                </p>
                <Link
                  href={ROUTES.PRODUCTS}
                  className="mt-6 inline-block bg-[#C76E00] text-white px-6 py-2.5 rounded-[3px] font-[600] text-[14px] hover:bg-[#AD5036] transition-colors duration-300 cursor-pointer"
                >
                  Tiếp tục mua hàng
                </Link>
              </div>
            )}
          </div>

          {/* Right Column - Order summary card */}
          <div className="w-full lg:w-[517px] shrink-0">
            <CheckoutOrderSummary
              items={cartItems}
              discount={discountAmount}
              shippingFee={shippingFee}
              tax={tax}
              total={total}
              onApplyPromo={handleApplyPromo}
              onRemoveItem={handleRemoveItem}
              onEditItem={handleEditItem}
            />
            {isValidatingCoupon ? (
              <p className="mt-2 text-[12px] text-[#909090] font-montserrat text-right">
                Đang kiểm tra mã ưu đãi...
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
