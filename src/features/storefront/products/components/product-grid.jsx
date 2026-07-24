"use client";

import React from "react";
import ProductCard from "@/shared/components/product-card";
import { mapProductToCardProps } from "@/shared/utils/product-card";

export default function ProductGrid({ products = [] }) {
  const list = products.map(mapProductToCardProps);

  // Check if any product in the current list has a name with 2 lines (contains '\n' or length > 22)
  const hasTwoLineTitle = list.some(
    (product) => product.name && (product.name.includes("\n") || product.name.length > 22)
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {list.map((product) => (
        <ProductCard key={product.id} {...product} hasTwoLineTitle={hasTwoLineTitle} />
      ))}
    </div>
  );
}
