"use client";

import React, { useState, useMemo } from "react";
import Breadcrumb from "@/components/shared/Breadcrumb";
import CartItemList from "@/components/cart/CartItemList";
import CartSummary from "@/components/cart/CartSummary";
import ProductCard from "@/components/shared/ProductCard";
import { ROUTES } from "@/utils/routes";

// Import order images for cart items
import imgDonHang1 from "@/assets/images/don-hang/don-hang-1.png";
import imgDonHang2 from "@/assets/images/don-hang/don-hang-2.png";

// Import a sample product image for related list if available
import imgRelatedDefault from "@/assets/images/products/product-image-thumb.png";

export default function CartView() {
  const breadcrumbItems = [
    { name: "Trang chủ", href: ROUTES.HOME },
    { name: "Giỏ hàng", href: null },
  ];

  // Initial cart items based on Figma coordinates
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "Ngói âm dương nâu đen",
      sku: "46345",
      classification: "Nâu đen",
      packSize: 100,
      quantity: 1,
      price: 70000,
      image: imgDonHang1,
    },
    {
      id: 2,
      title: "Ngói âm dương nâu đen",
      sku: "46345",
      classification: "Nâu đen",
      packSize: 100,
      quantity: 20,
      price: 70000,
      image: imgDonHang2,
    },
  ]);

  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Calculate pricing values
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
  }, [cartItems]);

  const tax = useMemo(() => {
    // 0 in Figma context, but can be scaled
    return 0;
  }, []);

  const total = useMemo(() => {
    return subtotal - discountAmount + tax;
  }, [subtotal, discountAmount, tax]);

  // Related products array
  const relatedProducts = [
    {
      id: 101,
      name: "Bình hút lộc\nMã đáo thành công",
      sku: "MSP: VG001",
      originalPrice: "2.500.000đ",
      salePrice: "2.000.000đ",
      soldCount: 12,
      image: imgRelatedDefault,
    },
    {
      id: 102,
      name: "Bình hút lộc\nMã đáo thành công",
      sku: "MSP: VG001",
      originalPrice: "2.500.000đ",
      salePrice: "2.000.000đ",
      soldCount: 12,
      image: imgRelatedDefault,
    },
    {
      id: 103,
      name: "Bình hút lộc\nMã đáo thành công",
      sku: "MSP: VG001",
      originalPrice: "2.500.000đ",
      salePrice: "2.000.000đ",
      soldCount: 12,
      image: imgRelatedDefault,
    },
    {
      id: 104,
      name: "Bình hút lộc\nMã đáo thành công",
      sku: "MSP: VG001",
      originalPrice: "2.500.000đ",
      salePrice: "2.000.000đ",
      soldCount: 12,
      image: imgRelatedDefault,
    },
  ];

  const handleQuantityChange = (id, newQty) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleEditItem = (id) => {
    alert(`Chỉnh sửa tùy chọn cho sản phẩm #${id}`);
  };

  const handleApplyPromoCode = (code) => {
    if (code.trim().toUpperCase() === "VUGIA10") {
      if (promoApplied) {
        alert("Mã ưu đãi này đã được áp dụng trước đó.");
        return;
      }
      const calculatedDiscount = Math.round(subtotal * 0.1); // 10% discount
      setDiscountAmount(calculatedDiscount);
      setPromoApplied(true);
      alert("Áp dụng mã giảm giá VUGIA10 thành công! Bạn được giảm 10% tổng đơn.");
    } else if (code.trim() === "") {
      alert("Vui lòng nhập mã ưu đãi.");
    } else {
      alert("Mã ưu đãi không hợp lệ.");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }
    alert("Bắt đầu chuyển hướng tới trang thanh toán...");
    window.location.href = ROUTES.CHECKOUT;
  };

  return (
    <div className="w-full bg-[#FAF7F7] min-h-screen py-[40px] px-4 md:px-[60px] lg:px-[80px]">
      <div className="max-w-[1440px] mx-auto flex flex-col">
        {/* Breadcrumb Trail */}
        <Breadcrumb
          items={breadcrumbItems}
          separator=">"
          className="mb-[25px]"
        />

        {/* Page Title */}
        <h1 className="font-arima text-[#2E2F2A] text-[36px] font-[400] leading-[40px] mb-8">
          Giỏ hàng
        </h1>

        {/* Columns Grid */}
        <div className="flex flex-col lg:flex-row gap-[50px] items-start w-full">
          {/* Left Column - Cart Item List */}
          <div className="flex-1 w-full">
            {cartItems.length > 0 ? (
              <CartItemList
                items={cartItems}
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
              onApplyPromoCode={handleApplyPromoCode}
              onCheckout={handleCheckout}
            />
          </div>
        </div>

        {/* Related Products Section (Có thể bạn quan tâm) */}
        <div className="mt-[50px] w-full flex flex-col">
          <h2 className="text-[#97400C] text-[32px] font-[700] leading-[40px] mb-6 font-montserrat">
            Có thể bạn quan tâm
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-[26px]">
            {relatedProducts.map((product) => (
              <div key={product.id} className="w-full max-w-[340px] mx-auto">
                <ProductCard
                  image={product.image}
                  name={product.name}
                  sku={product.sku}
                  originalPrice={product.originalPrice}
                  salePrice={product.salePrice}
                  soldCount={product.soldCount}
                  hasTwoLineTitle={true}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
