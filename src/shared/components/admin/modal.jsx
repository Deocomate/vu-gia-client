"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

/**
 * Independent admin-only modal shell — focus-trap, Escape-to-close, `role="dialog"`,
 * `aria-modal="true"`, backdrop-click-to-close.
 *
 * This intentionally does NOT import from or modify
 * `shared/components/base-confirm-dialog.jsx` (the storefront's shared confirm dialog,
 * used via `theme="brand"`/`"admin"` on every customer-facing page for things like cart
 * removal and address deletion). That file also uses `role="alertdialog"`, which is the
 * correct semantic for an interruptive yes/no confirm, not for this component's
 * multi-field edit/create forms — this uses `role="dialog"` instead. The small amount of
 * focus-trap/Escape logic below is duplicated locally on purpose to keep this change fully
 * scoped to `shared/components/admin/` with zero risk to the storefront.
 */

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const SIZE_CLASSES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-4xl",
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  align = "center",
  preventClose = false,
  closeLabel = "Đóng",
}) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Escape/backdrop/close-button dismissal all route through here so a `saving` (or any
  // other) in-flight guard can block or safely ignore the dismiss attempt in one place.
  const requestClose = useCallback(() => {
    if (preventClose) return;
    onClose?.();
  }, [onClose, preventClose]);

  useEffect(() => {
    if (!open) return undefined;

    previousFocusRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = requestAnimationFrame(() => {
      const focusable = panelRef.current?.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusable && focusable.length > 0) {
        focusable[0].focus();
      } else {
        panelRef.current?.focus();
      }
    });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(panelRef.current.querySelectorAll(FOCUSABLE_SELECTOR));
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
  }, [open, requestClose]);

  if (!open) {
    return null;
  }

  const alignmentClasses = align === "start" ? "items-start overflow-y-auto py-8" : "items-center";

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center bg-zinc-950/50 px-4 ${alignmentClasses}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          requestClose();
        }
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={`w-full border border-zinc-200 bg-white shadow-xl outline-none ${SIZE_CLASSES[size] || SIZE_CLASSES.md}`}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
            <div>
              <h2 id={titleId} className="text-lg font-semibold text-zinc-950">
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className="text-sm text-zinc-500">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={requestClose}
              disabled={preventClose}
              className="inline-flex h-9 w-9 items-center justify-center hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label={closeLabel}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
