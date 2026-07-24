"use client";

import React from "react";
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from "@/shared/api/api-enums";

// Static class strings per semantic color name — mirrors the color→class
// convention already established by the admin `StatusBadge.jsx`
// (`bg-{color}-50 text-{color}-700`), just rendered as a pill instead of a
// bordered chip to match the storefront's existing order-card design.
// Tailwind's JIT scanner can't see dynamically-built `bg-${color}-50`
// template strings, so every color used by `ORDER_STATUS_COLOR` must be
// spelled out literally here.
const COLOR_CLASSES = {
  amber: "bg-amber-50 text-amber-700",
  blue: "bg-blue-50 text-blue-700",
  indigo: "bg-indigo-50 text-indigo-700",
  emerald: "bg-emerald-50 text-emerald-700",
  zinc: "bg-zinc-100 text-zinc-700",
  rose: "bg-rose-50 text-rose-700",
};

/** Pill-style order status badge shared by the order list card and order-detail view. */
export default function OrderStatusBadge({ status, className = "" }) {
  const color = ORDER_STATUS_COLOR[status] || "zinc";
  const label = ORDER_STATUS_LABEL[status] || status || "—";

  return (
    <span
      className={`h-[24px] px-3 rounded-[14px] text-[12px] md:text-[14px] font-[700] font-montserrat uppercase inline-flex items-center justify-center whitespace-nowrap ${COLOR_CLASSES[color]} ${className}`}
    >
      {label}
    </span>
  );
}
