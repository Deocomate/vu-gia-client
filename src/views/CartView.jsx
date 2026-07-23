"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/shared/Breadcrumb";
import CartItemList from "@/components/cart/CartItemList";
import CartSummary from "@/components/cart/CartSummary";
import ProductCard from "@/components/shared/ProductCard";
import { ROUTES } from "@/utils/routes";
import { useCartStore } from "@/stores/cartStore";
import { toCartLineVMList } from "@/features/cart/cart-view-model";
import { validateCoupon } from "@/features/checkout/coupon-service";
import { confirm, toast } from "@/utils/feedback";
import { useFeaturedProductCards } from "@/hooks/useFeaturedProductCards";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

const RELATED_PRODUCTS_LIMIT = 4;

export default function CartView() {
  const router = useRouter();
  const mode = useCartStore((s) => s.mode);
  const rawItems = useCartStore((s) => s.items);
  const totalAmount = useCartStore((s) => s.totalAmount);
  const pendingIds = useCartStore((s) => s.pendingIds);
  const updateLineQuantity = useCartStore((s) => s.updateLineQuantity);
  const removeLine = useCartStore((s) => s.removeLine);

  const cartItems = useMemo(() => toCartLineVMList(rawItems, mode), [rawItems, mode]);
  const isMutating = pendingIds.length > 0;

  const breadcrumbItems = [
    { name: "Trang chủ", href: ROUTES.HOME },
    { name: "Giỏ hàng", href: null },
  ];

  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Server mode trusts `totalAmount` from the Cart API (unitPrice is always
  // the current server price); guest mode keeps the local display-only
  // estimate summed from each line's `lineTotal`.
  const subtotal = useMemo(() => {
    if (mode === "server") return totalAmount;
    return cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  }, [mode, totalAmount, cartItems]);

  const tax = 0;

  const total = useMemo(() => {
    return subtotal - discountAmount + tax;
  }, [subtotal, discountAmount, tax]);

  const relatedProducts = useFeaturedProductCards(RELATED_PRODUCTS_LIMIT);

  const handleQuantityChange = (id, newQty) => {
    if (newQty === "" || newQty === null) return;
    updateLineQuantity(id, newQty);
  };

  const handleRemoveItem = async (id) => {
    const ok = await confirm({
      title: "Xóa sản phẩm",
      description: "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?",
      confirmLabel: "Xóa",
      cancelLabel: "Hủy",
      destructive: true,
    });
    if (!ok) return;
    removeLine(id);
  };

  const handleEditItem = (id) => {
    toast.info(`Chỉnh sửa tùy chọn cho sản phẩm #${id}`);
  };

  // RT-B: real server-validated preview (POST /api/coupons/validate, public,
  // always 200) — replaces the previous fabricated fixed-code/10% estimate.
  // The order response's discountAmount/totalAmount remain authoritative at checkout.
  const runValidateCoupon = async (code, orderAmount) => {
    const trimmed = code.trim();
    if (!trimmed) {
      toast.error("Vui lòng nhập mã ưu đãi.");
      return;
    }
    try {
      const result = await validateCoupon({ code: trimmed, orderAmount });
      if (result?.valid) {
        setDiscountAmount(Number(result.discountAmount) || 0);
        setPromoApplied(true);
        toast.success(result.message || "Áp dụng mã ưu đãi thành công.");
      } else {
        setDiscountAmount(0);
        setPromoApplied(false);
        toast.error(result?.message || "Mã ưu đãi không hợp lệ.");
      }
    } catch (error) {
      setDiscountAmount(0);
      setPromoApplied(false);
      toast.error(error?.message || "Không thể kiểm tra mã ưu đãi. Vui lòng thử lại.");
    }
  };

  const handleApplyPromoCode = useDebouncedCallback((code) => {
    runValidateCoupon(code, subtotal);
  }, 400);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống!");
      return;
    }
    router.push(ROUTES.CHECKOUT);
  };

  return (
    <div className="w-full bg-[#FAF7F7] min-h-screen pt-[40px] pb-[50px] lg:pb-[100px] px-[30px] md:px-[60px] lg:px-[80px]">
      <div className="max-w-[1440px] mx-auto flex flex-col">
        {/* Breadcrumb Trail */}
        <Breadcrumb
          items={breadcrumbItems}
          className="hidden md:block mb-[25px]"
        />

        {/* Page Title */}
        <h1 className="font-arima text-[#2E2F2A] text-[36px] font-[400] leading-[40px] mb-8">
          Giỏ hàng
        </h1>

        {/* Columns Grid */}
        <div className="flex flex-col lg:flex-row gap-[20px] lg:gap-[50px] items-start w-full">
          {/* Left Column - Cart Item List */}
          <div className="flex-1 w-full">
            {cartItems.length > 0 ? (
              <CartItemList
                items={cartItems}
                pendingIds={pendingIds}
                onQuantityChange={handleQuantityChange}
                onRemoveItem={handleRemoveItem}
                onEditItem={handleEditItem}
              />
            ) : (
              <div className="w-full bg-white border-[0.5px] border-[#909090] rounded-[6px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] p-12 text-center font-montserrat">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#909090"
                  strokeWidth="1.5"
                  className="mx-auto mb-4"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
                </svg>
                <p className="text-[#909090] text-[16px] font-[500]">
                  Giỏ hàng của bạn đang trống.
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Cart Summary */}
          <div className="w-full lg:w-[486px] shrink-0">
            <CartSummary
              subtotal={subtotal}
              discount={discountAmount}
              tax={tax}
              total={total}
              disabled={isMutating}
              onApplyPromoCode={handleApplyPromoCode}
              onCheckout={handleCheckout}
            />
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-[50px] w-full flex flex-col">
            <h2 className="text-[#97400C] text-[26px] lg:text-[32px] font-[700] leading-[40px] mb-6 font-montserrat">
              Có thể bạn quan tâm
            </h2>

            <div className="flex lg:grid lg:grid-cols-4 gap-[14px] lg:gap-[26px] overflow-x-auto lg:overflow-x-visible no-scrollbar pb-4 lg:pb-0 scroll-smooth snap-x snap-mandatory w-[calc(100%+32px)] mx-[-16px] px-[16px] scroll-px-[16px] md:w-[calc(100%+120px)] md:mx-[-60px] md:px-[60px] md:scroll-px-[60px] lg:w-auto lg:mx-0 lg:px-0">
              {relatedProducts.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-[175px] lg:w-auto snap-start">
                  <ProductCard {...product} hasTwoLineTitle={true} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
