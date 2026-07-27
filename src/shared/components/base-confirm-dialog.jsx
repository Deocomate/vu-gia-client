"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

const THEME_STYLES = {
  brand: {
    overlay: "bg-black/40",
    panel: "rounded-[6px] border border-[#E1DEDE] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]",
    header: "border-b border-[#E1DEDE]",
    title: "font-montserrat text-[#2E2F2A]",
    closeBtn: "text-[#909090] hover:bg-[#FAF7F7] hover:text-[#2E2F2A]",
    description: "font-montserrat text-[#777E90]",
    footer: "border-t border-[#E1DEDE]",
    cancelBtn:
      "border border-[#909090] font-montserrat text-[#2E2F2A] hover:bg-[#FAF7F7]",
    confirmBtn: "font-montserrat text-white bg-primary hover:bg-sale",
    confirmDestructive: "font-montserrat text-white bg-sale hover:bg-[#97400C]",
  },
  admin: {
    overlay: "bg-zinc-950/50",
    panel: "border border-zinc-200 shadow-xl",
    header: "border-b border-zinc-200",
    title: "text-zinc-950",
    closeBtn: "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900",
    description: "text-zinc-600",
    footer: "border-t border-zinc-200",
    cancelBtn: "border border-zinc-300 text-zinc-700 hover:bg-zinc-50",
    confirmBtn: "text-white bg-zinc-950 hover:bg-zinc-800",
    confirmDestructive: "text-white bg-rose-600 hover:bg-rose-700",
  },
};

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function BaseConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  destructive = false,
  theme = "brand",
  onCancel,
  onConfirm,
  // `children`, when provided, replaces the `description` paragraph AND the
  // confirm/cancel footer entirely — the caller (e.g. `ContactModal`) owns
  // its own body content/actions (a form with its own submit button), so
  // this dialog only supplies the overlay/panel/header/focus-trap chrome.
  children,
}) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef(null);
  const cancelRef = useRef(null);
  const previousFocusRef = useRef(null);
  const styles = THEME_STYLES[theme] ?? THEME_STYLES.brand;

  const handleCancel = useCallback(() => {
    onCancel?.();
  }, [onCancel]);

  const handleConfirm = useCallback(() => {
    onConfirm?.();
  }, [onConfirm]);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = requestAnimationFrame(() => {
      // No footer (and thus no `cancelRef` button) when `children` is
      // provided — fall back to the first focusable element inside the
      // panel (e.g. the first form input) instead of leaving focus unset.
      if (cancelRef.current) {
        cancelRef.current.focus();
      } else {
        panelRef.current?.querySelector(FOCUSABLE_SELECTOR)?.focus();
      }
    });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleCancel();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll(FOCUSABLE_SELECTOR),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;

      const previous = previousFocusRef.current;
      if (previous && typeof previous.focus === "function") {
        previous.focus();
      }
    };
  }, [open, handleCancel]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center px-4 ${styles.overlay}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleCancel();
        }
      }}
    >
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={`w-full ${children ? "max-w-lg" : "max-w-md"} bg-white ${styles.panel}`}
      >
        <div className={`flex items-center justify-between px-5 py-4 ${styles.header}`}>
          <h2 id={titleId} className={`text-base font-semibold ${styles.title}`}>
            {title}
          </h2>
          <button
            type="button"
            onClick={handleCancel}
            className={`inline-flex h-8 w-8 items-center justify-center ${styles.closeBtn}`}
            aria-label="Đóng"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        {children ? (
          <div className="px-5 py-5 max-h-[80vh] overflow-y-auto">{children}</div>
        ) : (
          <>
            {description ? (
              <p id={descriptionId} className={`px-5 py-5 text-sm leading-6 ${styles.description}`}>
                {description}
              </p>
            ) : null}
            <div className={`flex justify-end gap-2 px-5 py-4 ${styles.footer}`}>
              <button
                ref={cancelRef}
                type="button"
                onClick={handleCancel}
                className={`h-10 px-4 text-sm font-semibold ${styles.cancelBtn}`}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className={`h-10 px-4 text-sm font-semibold ${
                  destructive ? styles.confirmDestructive : styles.confirmBtn
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
