"use client";

import { create } from "zustand";

const DEFAULT_OPTIONS = {
  title: "",
  description: "",
  confirmLabel: "Xác nhận",
  cancelLabel: "Hủy",
  destructive: false,
};

export const useConfirmStore = create((set, get) => ({
  open: false,
  title: "",
  description: "",
  confirmLabel: "Xác nhận",
  cancelLabel: "Hủy",
  destructive: false,
  resolve: null,

  close(result) {
    const { resolve } = get();
    if (resolve) {
      resolve(result);
    }
    set({
      open: false,
      resolve: null,
      ...DEFAULT_OPTIONS,
    });
  },

  openConfirm(options) {
    const { open, resolve: prevResolve } = get();

    if (open && prevResolve) {
      prevResolve(false);
    }

    return new Promise((resolve) => {
      set({
        open: true,
        title: options.title ?? "",
        description: options.description ?? "",
        confirmLabel: options.confirmLabel ?? "Xác nhận",
        cancelLabel: options.cancelLabel ?? "Hủy",
        destructive: options.destructive ?? false,
        resolve,
      });
    });
  },
}));

export function confirm(options) {
  return useConfirmStore.getState().openConfirm(options);
}
