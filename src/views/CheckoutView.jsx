"use client";

import React, { useState, useMemo } from "react";
import Breadcrumb from "@/components/shared/Breadcrumb";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutOrderSummary from "@/components/checkout/CheckoutOrderSummary";
import { ROUTES } from "@/utils/routes";

// Import order images
import imgDonHang1 from "@/assets/images/don-hang/don-hang-1.png";
import imgDonHang2 from "@/assets/images/don-hang/don-hang-2.png";

export default function CheckoutView() {
  const breadcrumbs = [
    { name: "Trang chủ", href: ROUTES.HOME },
    { name: "Thanh toán", href: null },
  ];

  // Initial cart items initialized to match Figma total pricing
  const [checkoutItems, setCheckoutItems] = useState([
    {
      id: 1,
      title: "Ngói âm dương nâu đen",
      sku: "46345",
      classification: "Nâu đen",
      packSize: 100,
      quantity: 20,
      price: 500000, // 500,000 * 20 = 10,000,000
      image: imgDonHang1,
    },
    {
      id: 2,
      title: "Ngói âm dương nâu đen",
      sku: "46345",
      classification: "Nâu đen",
      packSize: 20,
      quantity: 50,
      price: 240000, // 240,000 * 50 = 12,000,000
      image: imgDonHang2,
    },
  ]);

  const [promoApplied, setPromoApplied] = useState(true); // Pre-applied to match mockup's -2,000,000 đ discount
  const [discountAmount, setDiscountAmount] = useState(2000000);

  const subtotal = useMemo(() => {
    return checkoutItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );
  }, [checkoutItems]);

  const tax = 0;

  const total = useMemo(() => {
    return subtotal - discountAmount + tax;
  }, [subtotal, discountAmount, tax]);

  const handleApplyPromo = (code) => {
    if (code.trim().toUpperCase() === "VUGIA10") {
      const calculatedDiscount = Math.round(subtotal * 0.1);
      setDiscountAmount(calculatedDiscount);
      setPromoApplied(true);
      alert(`Áp dụng mã giảm giá VUGIA10 thành công! Bạn được giảm ${calculatedDiscount.toLocaleString()} ₫.`);
    } else if (code.trim() === "") {
      alert("Vui lòng nhập mã ưu đãi.");
    } else {
      alert("Mã ưu đãi không hợp lệ.");
    }
  };

  const handleRemoveItem = (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi đơn hàng?")) {
      setCheckoutItems((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        if (updated.length === 0) {
          setDiscountAmount(0);
        }
        return updated;
      });
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
      }\nTổng tiền: ${total.toLocaleString()} ₫`
    );
    setCheckoutItems([]);
    setDiscountAmount(0);
  };

  return (
    <div className="w-full bg-white min-h-screen py-[40px] px-4 md:px-[60px] lg:px-[80px]">
      <div className="max-w-[1440px] mx-auto flex flex-col">
        {/* Breadcrumb Trail */}
        <Breadcrumb
          items={breadcrumbs}
          separator=">"
          className="mb-[25px]"
        />

        {/* Page Title */}
        <h1 className="font-arima text-[#2E2F2A] text-[36px] font-[400] leading-[40px] mb-[30px]">
          Thanh toán
        </h1>

        {/* Checkout Content Columns */}
        <div className="flex flex-col lg:flex-row gap-[50px] items-start w-full">
          {/* Left Column - Form fields */}
          <div className="flex-1 w-full">
            {checkoutItems.length > 0 ? (
              <CheckoutForm onSubmit={handleCheckoutSubmit} />
            ) : (
              <div className="w-full bg-white border border-[#909090] rounded-[6px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] p-12 text-center font-montserrat">
                <p className="text-[#909090] text-[16px] font-[500]">
                  Đơn hàng của bạn đã được gửi hoặc trống. Quay về cửa hàng để tiếp tục mua sắm.
                </p>
                <a
                  href={ROUTES.SAN_PHAM}
                  className="mt-6 inline-block bg-[#C76E00] text-white px-6 py-2.5 rounded-[3px] font-[600] text-[14px] hover:bg-[#AD5036] transition-colors duration-300 cursor-pointer"
                >
                  Tiếp tục mua hàng
                </a>
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
