"use client";

import { useState } from "react";
import SortableImageGallery from "@/components/admin/inputs/SortableImageGallery";
import { adminApi } from "@/shared/api/adminApi";
import { uploadMany } from "@/shared/api/mediaUpload";
import { toast } from "@/shared/utils/feedback";

/**
 * `mode="create"`: purely local array state — parent submits `images` as
 * part of `POST /products` (`images:[{url,priority}]`).
 * `mode="edit"`: persists every mutation against `/products/{productId}/images`
 * live. **[RT-F4]** reorder only PATCHes images whose priority actually
 * changed, and refetches on any partial failure to reconcile with the server.
 */
export default function ProductGalleryManager({ mode, productId, images, onChange, onSetThumb }) {
  const [busy, setBusy] = useState(false);

  const refetch = async () => {
    try {
      const server = await adminApi.get(`/products/${productId}/images`);
      onChange((server || []).map((image) => ({ id: image.id, url: image.url, priority: image.priority })));
    } catch {
      toast.error("Không thể tải lại gallery sau lỗi.");
    }
  };

  if (mode === "create") {
    return (
      <SortableImageGallery
        images={images}
        disabled={busy}
        onReorder={onChange}
        onSetThumb={onSetThumb}
        onUpload={async (files) => {
          setBusy(true);
          try {
            const urls = await uploadMany(files, "products");
            const next = [...images, ...urls.map((url, i) => ({ url, priority: images.length + i }))];
            onChange(next);
          } finally {
            setBusy(false);
          }
        }}
        onRemove={(image) => onChange(images.filter((item) => item.url !== image.url).map((item, i) => ({ ...item, priority: i })))}
      />
    );
  }

  return (
    <SortableImageGallery
      images={images}
      disabled={busy}
      onSetThumb={onSetThumb}
      onUpload={async (files) => {
        setBusy(true);
        try {
          for (const file of files) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("priority", String(images.length));
            const created = await adminApi.upload(`/products/${productId}/images`, formData);
            onChange((current) => [...current, { id: created.id, url: created.url, priority: created.priority }]);
          }
        } catch (error) {
          toast.error(error.message || "Tải ảnh lên thất bại.");
          await refetch();
        } finally {
          setBusy(false);
        }
      }}
      onReorder={async (reordered) => {
        const changed = reordered.filter((image, index) => images.find((original) => original.url === image.url)?.priority !== index);
        onChange(reordered);
        if (!changed.length) return;

        setBusy(true);
        try {
          await Promise.all(
            changed.map((image) =>
              adminApi.patch(`/products/${productId}/images/${image.id}`, { priority: image.priority }),
            ),
          );
        } catch (error) {
          toast.error(error.message || "Sắp xếp thất bại, đang tải lại.");
          await refetch();
        } finally {
          setBusy(false);
        }
      }}
      onRemove={async (image) => {
        setBusy(true);
        try {
          await adminApi.delete(`/products/${productId}/images/${image.id}`);
          onChange(images.filter((item) => item.id !== image.id).map((item, i) => ({ ...item, priority: i })));
        } catch (error) {
          toast.error(error.message || "Không thể xóa ảnh.");
          await refetch();
        } finally {
          setBusy(false);
        }
      }}
    />
  );
}
