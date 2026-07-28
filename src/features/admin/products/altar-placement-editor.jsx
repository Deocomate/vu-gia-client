"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/shared/components/admin/modal";
import AltarPlacementCanvas from "@/features/admin/products/altar-placement-canvas";
import AltarPlacementControls from "@/features/admin/products/altar-placement-controls";
import { fullImageSurfaceBounds } from "@/shared/components/altar/altar-surface-geometry";
import { adminApi, AdminApiError } from "@/shared/api/admin-api";
import { toast, confirm } from "@/shared/utils/feedback";

const EMPTY_PLACEMENT = {
  overlayImage: "",
  x: 0.5,
  y: 0.85,
  widthCm: 20,
  scaleAdjust: 1,
  zIndexOverride: null,
  flippable: true,
};

function pickDefaultBackdrop(models) {
  const model = models.find((m) => (m.sizes || []).some((s) => s.isActive !== false)) || models[0];
  const size = (model?.sizes || []).find((s) => s.isActive !== false) || model?.sizes?.[0];
  return { modelId: model?.id ?? null, sizeId: size?.id ?? null };
}

/**
 * Modal editor for one product image's altar placement (0..1 per image — see
 * `AltarPlacementEntity`). The altar model/size picked here is **authoring-only**: it
 * is never sent to the backend and never persisted on the placement, because one
 * authored `(x, y)`/`widthCm` renders correctly on every altar size (surface-fraction +
 * real-cm scaling, see `altar-surface-geometry.js`). Only `(productId, imageId)` and the
 * placement fields themselves are sent to `PUT/DELETE /products/{productId}/images/{imageId}/placement`.
 */
export default function AltarPlacementEditor({ open, onClose, productId, imageId, widthCmHint, onSaved, onRemoved }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [models, setModels] = useState([]);
  const [activeModelId, setActiveModelId] = useState(null);
  const [activeSizeId, setActiveSizeId] = useState(null);
  const [placement, setPlacement] = useState(EMPTY_PLACEMENT);
  const [existed, setExisted] = useState(false);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setLoading(true);
    setError("");
    setFormError("");

    (async () => {
      try {
        const [modelsPage, existingPlacement] = await Promise.all([
          adminApi.get("/altar-models", { size: 100 }),
          adminApi
            .get(`/products/${productId}/images/${imageId}/placement`)
            .then((data) => data)
            .catch((requestError) => {
              if (requestError instanceof AdminApiError && requestError.status === 404) return null;
              throw requestError;
            }),
        ]);
        if (cancelled) return;

        const activeModels = (modelsPage?.content || []).filter((m) => m.isActive !== false);
        setModels(activeModels);

        const backdrop = pickDefaultBackdrop(activeModels);
        setActiveModelId(backdrop.modelId);
        setActiveSizeId(backdrop.sizeId);

        if (existingPlacement) {
          setExisted(true);
          setPlacement({
            overlayImage: existingPlacement.overlayImage || "",
            x: existingPlacement.defaultX ?? EMPTY_PLACEMENT.x,
            y: existingPlacement.defaultY ?? EMPTY_PLACEMENT.y,
            widthCm: existingPlacement.widthCm ?? EMPTY_PLACEMENT.widthCm,
            scaleAdjust: existingPlacement.scaleAdjust ?? 1,
            zIndexOverride: existingPlacement.zIndexOverride ?? null,
            flippable: existingPlacement.flippable ?? true,
          });
        } else {
          setExisted(false);
          setPlacement({ ...EMPTY_PLACEMENT, widthCm: widthCmHint || EMPTY_PLACEMENT.widthCm });
        }
      } catch (requestError) {
        if (!cancelled) setError(requestError.message || "Không thể tải dữ liệu bối cảnh.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload only when the modal (re)opens for a given image
  }, [open, productId, imageId]);

  const activeModel = useMemo(() => models.find((m) => m.id === activeModelId), [models, activeModelId]);
  const activeSize = useMemo(
    () => (activeModel?.sizes || []).find((s) => s.id === activeSizeId) || null,
    [activeModel, activeSizeId],
  );

  const setField = (name, value) => setPlacement((current) => ({ ...current, [name]: value }));

  const selectModel = (modelId) => {
    setActiveModelId(modelId);
    const model = models.find((m) => m.id === modelId);
    setActiveSizeId(model?.sizes?.[0]?.id ?? null);
  };

  const save = async () => {
    setFormError("");
    if (!placement.overlayImage) {
      setFormError("Cần tải ảnh vật phẩm (PNG nền trong suốt) trước khi lưu.");
      return;
    }
    // widthCm is an Integer on the backend entity — round rather than reject, so a pasted
    // decimal (the numeric input has no `step` restriction) doesn't bounce with a 400.
    const widthCm = Math.round(Number(placement.widthCm));
    if (!(widthCm > 0)) {
      setFormError("Chiều rộng thực tế (cm) phải lớn hơn 0.");
      return;
    }
    if (!(placement.scaleAdjust >= 0.1 && placement.scaleAdjust <= 5)) {
      setFormError("Điều chỉnh tỉ lệ phải trong khoảng 0.1 - 5.");
      return;
    }
    // Position is surface-relative but no longer limited to [0,1] — items may be dragged
    // anywhere on the full backdrop image (see altar-surface-geometry.js's
    // fullImageSurfaceBounds). Still validated (not just trusted) since this is user input
    // reaching a backend request, using the same bounds the canvas itself clamped against.
    const bounds = fullImageSurfaceBounds(activeSize) || { minX: 0, maxX: 1, minY: 0, maxY: 1 };
    if (
      !(
        placement.x >= bounds.minX &&
        placement.x <= bounds.maxX &&
        placement.y >= bounds.minY &&
        placement.y <= bounds.maxY
      )
    ) {
      setFormError("Vị trí đặt không hợp lệ — vui lòng kéo lại trong ảnh bối cảnh.");
      return;
    }

    const payload = {
      overlayImage: placement.overlayImage,
      defaultX: placement.x,
      defaultY: placement.y,
      widthCm,
      scaleAdjust: placement.scaleAdjust,
      zIndexOverride: placement.zIndexOverride,
      flippable: Boolean(placement.flippable),
    };

    setSaving(true);
    try {
      const saved = await adminApi.put(`/products/${productId}/images/${imageId}/placement`, payload);
      toast.success("Đã lưu vị trí đặt trên bàn thờ.");
      onSaved?.(saved);
      onClose();
    } catch (requestError) {
      setFormError(requestError.message || "Không thể lưu vị trí.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    const ok = await confirm({
      title: "Xóa vị trí đặt",
      description: "Ảnh này sẽ không còn xuất hiện trên bàn thờ tùy chỉnh. Bạn muốn tiếp tục?",
      destructive: true,
    });
    if (!ok) return;

    setRemoving(true);
    try {
      await adminApi.delete(`/products/${productId}/images/${imageId}/placement`);
      toast.success("Đã xóa vị trí đặt.");
      onRemoved?.();
      onClose();
    } catch (requestError) {
      toast.error(requestError.message || "Không thể xóa vị trí.");
    } finally {
      setRemoving(false);
    }
  };

  const busy = saving || removing;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Vị trí trên bàn thờ"
      description="Kéo vật phẩm vào đúng vị trí trên bối cảnh mẫu — vị trí này sẽ áp dụng cho mọi kích thước bàn thờ."
      size="full"
      preventClose={busy}
    >
      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {loading ? (
          <p className="py-10 text-center text-sm text-zinc-500">Đang tải...</p>
        ) : error ? (
          <p className="border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>
        ) : models.length === 0 ? (
          <p className="border border-dashed border-zinc-300 px-4 py-6 text-center text-sm text-zinc-400">
            Chưa có loại bàn thờ nào để xem trước — tạo loại bàn thờ và kích thước trước.
          </p>
        ) : (
          <>
            {formError && (
              <div className="mb-3 border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                {formError}
              </div>
            )}
            <div className="grid gap-5 md:grid-cols-[1.2fr_1fr]">
              <AltarPlacementCanvas
                activeSize={activeSize}
                placement={placement}
                onPositionChange={(x, y) => setPlacement((current) => ({ ...current, x, y }))}
              />
              <AltarPlacementControls
                models={models}
                activeModelId={activeModelId}
                activeSizeId={activeSizeId}
                onSelectModel={selectModel}
                onSelectSize={setActiveSizeId}
                activeSize={activeSize}
                placement={placement}
                onFieldChange={setField}
              />
            </div>
          </>
        )}
      </div>

      <div className="flex shrink-0 items-center justify-between gap-2 border-t border-zinc-200 px-5 py-4">
        <div>
          {existed && (
            <button
              type="button"
              onClick={remove}
              disabled={busy || loading}
              className="h-10 border border-rose-300 px-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {removing ? "Đang xóa..." : "Xóa vị trí"}
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="h-10 border border-zinc-300 px-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={save}
            disabled={busy || loading || !!error || models.length === 0}
            className="h-10 bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Đang lưu..." : "Lưu vị trí"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
