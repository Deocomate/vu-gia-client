"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/shared/Breadcrumb";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutOrderSummary from "@/components/checkout/CheckoutOrderSummary";
import { ROUTES } from "@/utils/routes";
import { useCartStore } from "@/stores/cartStore";

export default function CheckoutView() {
  const router = useRouter();
  const checkoutItems = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const removeItem = useCartStore((s) => s.removeItem);

  const breadcrumbs = [
    { name: "Trang chủ", href: ROUTES.HOME },
    { name: "Thanh toán", href: null },
  ];

  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const subtotal = useMemo(() => {
    return checkoutItems.reduce(
      (sum, item) => sum + (item.price || 0) * (Number(item.quantity) || 0),
      0,
    );
  }, [checkoutItems]);

  const tax = 0;

  const total = useMemo(() => {
    return subtotal - discountAmount + tax;
  }, [subtotal, discountAmount, tax]);

  const handleApplyPromo = (code) => {
    if (code.trim().toUpperCase() === "VUGIA10") {
      if (promoApplied) {
        alert("Mã ưu đãi này đã được áp dụng trước đó.");
        return;
      }
      const calculatedDiscount = Math.round(subtotal * 0.1);
      setDiscountAmount(calculatedDiscount);
      setPromoApplied(true);
      alert(
        `Áp dụng mã giảm giá VUGIA10 thành công! Bạn được giảm ${calculatedDiscount.toLocaleString()} ₫.`,
      );
    } else if (code.trim() === "") {
      alert("Vui lòng nhập mã ưu đãi.");
    } else {
      alert("Mã ưu đãi không hợp lệ.");
    }
  };

  const handleRemoveItem = (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi đơn hàng?")) {
      removeItem(id);
      if (checkoutItems.length <= 1) {
        setDiscountAmount(0);
        setPromoApplied(false);
      }
    }
  };

  const handleEditItem = (id) => {
    alert(`Chỉnh sửa tùy chọn cho sản phẩm #${id}`);
  };

  const handleCheckoutSubmit = (formData) => {
    alert(
      `Đặt hàng thành công!\n\nKhách hàng: ${formData.fullName}\nĐịa chỉ: ${formData.address}, ${formData.city}\nĐiện thoại: ${formData.phone}\nPhương thức vận chuyển: ${
        formData.shippingMethod === "express" ? "Giao hàng hỏa tốc" : "Giao hàng nhanh"
      }\nPhương thức thanh toán: ${
        formData.paymentMethod === "online" ? "Chuyển khoản / QR" : "Thanh toán khi nhận hàng (COD)"
      }\nTổng tiền: ${total.toLocaleString()} ₫\n\nVui lòng đợi phản hồi từ Gốm Vũ Gia.`,
    );
    clearCart();
    setDiscountAmount(0);
    setPromoApplied(false);
    router.push(ROUTES.ORDERS);
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
            {checkoutItems.length > 0 ? (
              <CheckoutForm onSubmit={handleCheckoutSubmit} />
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
              items={checkoutItems}
              discount={discountAmount}
              tax={tax}
              total={total}
              onApplyPromo={handleApplyPromo}
              onRemoveItem={handleRemoveItem}
              onEditItem={handleEditItem}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
