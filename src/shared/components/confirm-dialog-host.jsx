"use client";

import { useEffect } from "react";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import { useConfirmStore } from "@/shared/stores/confirmStore";

export default function ConfirmDialogHost() {
  const open = useConfirmStore((s) => s.open);
  const title = useConfirmStore((s) => s.title);
  const description = useConfirmStore((s) => s.description);
  const confirmLabel = useConfirmStore((s) => s.confirmLabel);
  const cancelLabel = useConfirmStore((s) => s.cancelLabel);
  const destructive = useConfirmStore((s) => s.destructive);
  const close = useConfirmStore((s) => s.close);

  useEffect(() => {
    return () => {
      if (useConfirmStore.getState().open) {
        useConfirmStore.getState().close(false);
      }
    };
  }, []);

  return (
    <ConfirmDialog
      open={open}
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      destructive={destructive}
      onCancel={() => close(false)}
      onConfirm={() => close(true)}
    />
  );
}
