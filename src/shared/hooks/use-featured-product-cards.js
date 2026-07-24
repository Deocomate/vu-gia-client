"use client";

import { useEffect, useState } from "react";
import { publicGet, PublicApiError } from "@/shared/api/public-api";
import { mapProductToCardProps } from "@/shared/utils/product-card";

/**
 * Shared by the 3 "suggested products" widgets (altar customizer, news detail,
 * cart) that all render the same featured-products query.
 */
export function useFeaturedProductCards(limit = 4) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const data = await publicGet("/products", {
          status: "PUBLISHED",
          isFeatured: true,
          size: limit,
        });
        if (!cancelled) setProducts((data?.content || []).map(mapProductToCardProps));
      } catch (error) {
        if (cancelled) return;
        if (!(error instanceof PublicApiError)) {
          console.error("Failed to load featured products", error);
        }
        setProducts([]);
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  return products;
}
