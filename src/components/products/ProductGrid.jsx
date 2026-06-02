"use client";

import React from "react";
import ProductCard from "@/components/shared/ProductCard";
import productImageThumb from "@/assets/images/products/product-image-thumb.png";

export default function ProductGrid({ products }) {
  // Realistic fallback products representing 'Bộ đồ thờ' items
  const defaultProducts = [
    {
      id: 1,
      name: "Bát hương Men rạn\nĐắp nổi rồng chầu",
      sku: "MSP: VG-DT001",
      salePrice: "1.200.000đ",
      originalPrice: "1.500.000đ",
      soldCount: 24,
      image: productImageThumb,
    },
    {
      id: 2,
      name: "Bình hoa cúc cổ\nMen lam vẽ vàng",
      sku: "MSP: VG-DT002",
      salePrice: "850.000đ",
      originalPrice: "1.000.000đ",
      soldCount: 15,
      image: productImageThumb,
    },
    {
      id: 3,
      name: "Kỷ 5 chén thờ\nMen lam vẽ vàng",
      sku: "MSP: VG-DT003",
      salePrice: "650.000đ",
      originalPrice: "800.000đ",
      soldCount: 42,
      image: productImageThumb,
    },
    {
      id: 4,
      name: "Mâm bồng đựng quả\nMen rạn đắp nổi",
      sku: "MSP: VG-DT004",
      salePrice: "950.000đ",
      originalPrice: null,
      soldCount: 19,
      image: productImageThumb,
    },
    {
      id: 5,
      name: "Đèn dầu thờ\nMen lam vẽ vàng kim",
      sku: "MSP: VG-DT005",
      salePrice: "450.000đ",
      originalPrice: "550.000đ",
      soldCount: 31,
      image: productImageThumb,
    },
    {
      id: 6,
      name: "Ống hương thờ\nMen lam cổ điển",
      sku: "MSP: VG-DT006",
      salePrice: "380.000đ",
      originalPrice: "450.000đ",
      soldCount: 8,
      image: productImageThumb,
    },
    {
      id: 7,
      name: "Nậm rượu thờ\nMen lam vẽ rồng chầu",
      sku: "MSP: VG-DT007",
      salePrice: "290.000đ",
      originalPrice: "350.000đ",
      soldCount: 54,
      image: productImageThumb,
    },
    {
      id: 8,
      name: "Chóe thờ đựng nước\nMen lam vẽ sen cổ",
      sku: "MSP: VG-DT008",
      salePrice: "320.000đ",
      originalPrice: "400.000đ",
      soldCount: 27,
      image: productImageThumb,
    },
  ];

  const list = products && products.length > 0 ? products : defaultProducts;

  // Check if any product in the current list has a name with 2 lines (contains '\n' or length > 22)
  const hasTwoLineTitle = list.some(
    (product) => product.name && (product.name.includes("\n") || product.name.length > 22)
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {list.map((product) => (
        <ProductCard
          key={product.id}
          image={product.image}
          name={product.name}
          sku={product.sku}
          salePrice={product.salePrice}
          originalPrice={product.originalPrice}
          soldCount={product.soldCount}
          hasTwoLineTitle={hasTwoLineTitle}
        />
      ))}
    </div>
  );
}
