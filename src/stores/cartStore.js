"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // { id, title, sku, classification, packSize, price, image, quantity }

      addItem(product, qty = 1) {
        const quantity = Math.max(1, Number(qty) || 1);
        set((state) => {
          const existing = state.items.find((it) => it.id === product.id);
          if (existing) {
            return {
              items: state.items.map((it) =>
                it.id === product.id
                  ? { ...it, quantity: (Number(it.quantity) || 0) + quantity }
                  : it,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                classification: "Mặc định",
                packSize: 1,
                ...product,
                quantity,
              },
            ],
          };
        });
      },

      updateQuantity(id, quantity) {
        set((state) => ({
          items: state.items.map((it) => {
            if (it.id !== id) return it;
            // Allow empty string while the user is editing the input.
            if (quantity === "" || quantity === null) {
              return { ...it, quantity: "" };
            }
            const n = Number(quantity);
            if (Number.isNaN(n)) return it;
            return { ...it, quantity: Math.max(1, n) };
          }),
        }));
      },

      removeItem(id) {
        set((state) => ({ items: state.items.filter((it) => it.id !== id) }));
      },

      clearCart() {
        set({ items: [] });
      },

      totalCount() {
        return get().items.reduce((n, it) => n + (Number(it.quantity) || 0), 0);
      },

      subtotal() {
        return get().items.reduce(
          (sum, it) => sum + (it.price || 0) * (Number(it.quantity) || 0),
          0,
        );
      },
    }),
    { name: "vugia-cart" },
  ),
);
