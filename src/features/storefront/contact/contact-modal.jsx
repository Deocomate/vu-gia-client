"use client";

import BaseConfirmDialog from "@/shared/components/base-confirm-dialog";
import ContactForm from "@/features/storefront/contact/contact-form";

/**
 * Contact modal shown in place of add-to-cart/buy-now/go-to-cart CTAs when
 * `cartEnabled` is false (Phase 4). Wraps the shared `ContactForm` inside
 * the existing public-facing `BaseConfirmDialog` primitive (extended in
 * this phase to accept `children`) instead of hand-rolling a new dialog
 * shell — reuses its focus-trap/backdrop/keydown/Escape handling as-is.
 *
 * Controlled-open pattern: caller owns `open` state and is notified of
 * close requests (X button, Escape, backdrop click) via `onOpenChange`.
 *
 * `productContext` (`{ name, url }`), when provided, pre-fills the form's
 * message field with a reference to the product/combo the customer was
 * looking at — still fully editable.
 */
export default function ContactModal({ open, onOpenChange, productContext }) {
  const initialContent = productContext?.name
    ? `Tôi quan tâm đến sản phẩm: ${productContext.name}${
        productContext.url ? ` (${productContext.url})` : ""
      }\n\n`
    : "";

  return (
    <BaseConfirmDialog
      open={open}
      title="Liên hệ tư vấn"
      onCancel={() => onOpenChange?.(false)}
    >
      <ContactForm initialContent={initialContent} />
    </BaseConfirmDialog>
  );
}
