"use client";

import { useCallback, useMemo, useState } from "react";

const currency = new Intl.NumberFormat("vi-VN");

export function getItemKey(name, unitPrice) {
  return `${name.trim().toLowerCase()}::${unitPrice}`;
}

function normalizeItem(item) {
  const qty = Number(item.qty || 1);
  const unitPrice = Number(item.unitPrice || 0);
  const name = item.name || "Sản phẩm";
  return {
    key: getItemKey(name, unitPrice),
    name,
    qty,
    unitPrice,
    linePrice: qty * unitPrice,
  };
}

export function formatMoney(value) {
  return `${currency.format(value)}đ`;
}

export function formatTotal(value) {
  return `${currency.format(value)} đ`;
}

export function getItemText(name, qty) {
  return `${qty} x ${name}`;
}

export function useAltarCustomizer(initialItems = []) {
  const [items, setItems] = useState(() => initialItems.map(normalizeItem));
  const [zoom, setZoom] = useState(100);
  const [activeTab, setActiveTab] = useState("Bộ tam sự - ngũ sự");
  const [activeStep, setActiveStep] = useState(0);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.linePrice, 0),
    [items]
  );

  const addItem = useCallback((name, unitPrice) => {
    const key = getItemKey(name, unitPrice);
    setItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key
            ? normalizeItem({
                ...item,
                qty: item.qty + 1,
              })
            : item
        );
      }
      return [...prev, normalizeItem({ name, qty: 1, unitPrice })];
    });
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const zoomIn = useCallback(() => {
    setZoom((value) => Math.min(150, value + 10));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((value) => Math.max(50, value - 10));
  }, []);

  return {
    items,
    total,
    zoom,
    zoomIn,
    zoomOut,
    activeTab,
    setActiveTab,
    activeStep,
    setActiveStep,
    addItem,
    removeItem,
    formatMoney,
    formatTotal,
    getItemText,
  };
}
