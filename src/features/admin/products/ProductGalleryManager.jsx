"use client";

import { useEffect, useState } from "react";
import SortableImageGallery from "@/shared/components/admin/inputs/sortable-image-gallery";
import AltarPlacementEditor from "@/features/admin/products/altar-placement-editor";
import { adminApi, AdminApiError } from "@/shared/api/admin-api";
import { uploadMany } from "@/shared/api/media-upload";
import { toast } from "@/shared/utils/feedback";

/**
 * `mode="create"`: purely local array state — parent submits `images` as
 * part of `POST /products` (`images:[{url,priority}]`).
 * `mode="edit"`: persists every mutation against `/products/{productId}/images`
 * live. **[RT-F4]** reorder only PATCHes images whose priority actually
 * changed, and refetches on any partial failure to reconcile with the server.
 *
 * Altar placement (Phase 2): each gallery image can optionally carry one
 * `AltarPlacementEntity` (`GET/PUT/DELETE /products/{productId}/images/{imageId}/placement`).
 * Only meaningful in `mode="edit"` — a create-mode image has no `id` yet, so the
 * per-image "Vị trí trên bàn thờ" button stays disabled with a "Lưu sản phẩm trước"
 * hint until the product (and its images) have been saved once.
 */
export default function ProductGalleryManager({ mode, productId, images, onChange, onSetThumb }) {
  const [busy, setBusy] = useState(false);
  const [placementMap, setPlacementMap] = useState({}); // imageId -> placement | null (null = confirmed none)
  const [editingImage, setEditingImage] = useState(null);

  const imageIdsKey = images
    .filter((image) => image.id != null)
    .map((image) => image.id)
    .join(",");

  useEffect(() => {
    if (mode !== "edit" || !productId || !imageIdsKey) return undefined;

    let cancelled = false;
    (async () => {
      const ids = imageIdsKey.split(",").map(Number);
      const entries = await Promise.all(
        ids.map(async (id) => {
          try {
            const placement = await adminApi.get(`/products/${productId}/images/${id}/placement`);
            return [id, placement];
          } catch (requestError) {
            if (requestError instanceof AdminApiError && requestError.status === 404) return [id, null];
            // Network/other errors: treat as "unknown" (no badge) rather than surfacing a
            // toast per-image — the gallery still renders, this is a secondary indicator.
            return [id, null];
          }
        }),
      );
      if (!cancelled) setPlacementMap(Object.fromEntries(entries));
    })();

    return () => {
      cancelled = true;
    };
  }, [mode, productId, imageIdsKey]);

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
        onEditPlacement={() => {}}
        placementDisabled
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
        onRemove={(image) => onChange(images.filter((item) => item.priority !== image.priority).map((item, i) => ({ ...item, priority: i })))}
      />
    );
  }

  // Prefill hint for a brand-new placement's widthCm from any sibling image's existing
  // placement — most products photograph the same physical object across images, so this
  // removes most of the extra typing (see Phase 2 plan's resolved "Open Questions").
  const widthCmHint = Object.values(placementMap).find(Boolean)?.widthCm;

  return (
    <>
      <SortableImageGallery
        images={images}
        disabled={busy}
        onSetThumb={onSetThumb}
        onEditPlacement={(image) => setEditingImage(image)}
        placementMap={Object.fromEntries(Object.entries(placementMap).map(([id, value]) => [id, Boolean(value)]))}
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
          const changed = reordered.filter((image, index) => images.find((original) => original.id === image.id)?.priority !== index);
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
            setPlacementMap((current) => {
              const next = { ...current };
              delete next[image.id];
              return next;
            });
          } catch (error) {
            toast.error(error.message || "Không thể xóa ảnh.");
            await refetch();
          } finally {
            setBusy(false);
          }
        }}
      />

      {editingImage && (
        <AltarPlacementEditor
          open={Boolean(editingImage)}
          onClose={() => setEditingImage(null)}
          productId={productId}
          imageId={editingImage.id}
          widthCmHint={widthCmHint}
          onSaved={(saved) => setPlacementMap((current) => ({ ...current, [editingImage.id]: saved }))}
          onRemoved={() => setPlacementMap((current) => ({ ...current, [editingImage.id]: null }))}
        />
      )}
    </>
  );
}
