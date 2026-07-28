"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { adminApi } from "@/shared/api/admin-api";
import { toast } from "@/shared/utils/feedback";
import { ROUTES } from "@/shared/utils/routes";
import { resolveItemId } from "@/shared/components/altar/altar-canvas";
import AltarPresetMetadataFields from "@/features/admin/altar/altar-preset-metadata-fields";
import AltarPresetItemPalette from "@/features/admin/altar/altar-preset-item-palette";
import AltarPresetCanvasPanel from "@/features/admin/altar/altar-preset-canvas-panel";
import AltarPresetAccessoriesList from "@/features/admin/altar/altar-preset-accessories-list";

const EMPTY_FORM = {
  name: "",
  slug: "",
  thumb: "",
  description: "",
  altarModelSizeId: null,
  altarStyleId: null,
  priority: 0,
  isActive: true,
};

/** Stable per-row id for canvas/accessory items that haven't been saved yet — falls back to a
 * timestamp+random string on runtimes without `crypto.randomUUID` (older browsers/test DOM). */
function makeInstanceId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** A feed item (`GET /altar-customizer/items` row) with a non-null `placement` → a canvas item,
 * seeded at the placement's authored default position/scale/z, per-preset overridable from there. */
function placeableToCanvasItem(feedItem) {
  const { placement } = feedItem;
  return {
    instanceId: makeInstanceId(),
    productId: feedItem.productId,
    productImageId: placement.productImageId,
    name: feedItem.name,
    overlayImage: placement.overlayImage,
    widthCm: placement.widthCm,
    x: placement.defaultX,
    y: placement.defaultY,
    scaleAdjust: placement.scaleAdjust ?? 1,
    flipped: false,
    flippable: placement.flippable !== false,
    zIndexOverride: placement.zIndexOverride ?? null,
    quantity: 1,
  };
}

function feedItemToAccessory(feedItem) {
  return {
    instanceId: makeInstanceId(),
    productId: feedItem.productId,
    name: feedItem.name,
    thumb: feedItem.thumb,
    quantity: 1,
  };
}

/** Builds the `items` array for `POST/PUT /altar-presets` — satisfies the backend invariant
 * `productImage != null ⟺ (x != null && y != null)` exactly: canvas items always carry the
 * placement's `productImageId` alongside non-null `x`/`y`; accessories send neither. */
function buildItemsPayload(canvasItems, accessoryItems) {
  const placed = canvasItems.map((item, index) => ({
    productId: item.productId,
    productImageId: item.productImageId,
    quantity: item.quantity ?? 1,
    x: item.x,
    y: item.y,
    scaleAdjust: item.scaleAdjust ?? 1,
    flipped: Boolean(item.flipped),
    zIndexOverride: item.zIndexOverride ?? null,
    sortOrder: index,
  }));
  const accessories = accessoryItems.map((item, index) => ({
    productId: item.productId,
    productImageId: null,
    quantity: item.quantity ?? 1,
    x: null,
    y: null,
    scaleAdjust: 1,
    flipped: false,
    zIndexOverride: null,
    sortOrder: placed.length + index,
  }));
  return [...placed, ...accessories];
}

/** Splits a loaded `AltarPresetResponse.items[]` (server shape not fixed by this agent — see the
 * defensive `??` chains) back into canvas vs. accessory rows for edit-mode. */
function splitLoadedItems(items) {
  const canvasItems = [];
  const accessoryItems = [];
  (items || []).forEach((item) => {
    const productImageId = item.productImageId ?? item.productImage?.id ?? null;
    const hasCoords = item.x !== null && item.x !== undefined && item.y !== null && item.y !== undefined;
    const base = {
      instanceId: makeInstanceId(),
      productId: item.productId ?? item.product?.id,
      name: item.product?.name ?? item.name ?? "",
    };
    if (productImageId && hasCoords) {
      canvasItems.push({
        ...base,
        productImageId,
        // `AltarPresetItemResponse` nests the overlay art at `item.placement.overlayImage` (the
        // underlying `AltarPlacementEntity`), not at a top-level `item.overlayImage`/`.productImage`
        // — those never exist on the real wire shape. Same for `flippable`.
        overlayImage: item.placement?.overlayImage ?? item.product?.thumb ?? "",
        widthCm: item.widthCm ?? item.placement?.widthCm ?? 20,
        x: item.x,
        y: item.y,
        scaleAdjust: item.scaleAdjust ?? 1,
        flipped: Boolean(item.flipped),
        flippable: item.placement?.flippable !== false,
        zIndexOverride: item.zIndexOverride ?? null,
        quantity: item.quantity ?? 1,
      });
    } else {
      accessoryItems.push({
        ...base,
        thumb: item.product?.thumb ?? item.thumb ?? "",
        quantity: item.quantity ?? 1,
      });
    }
  });
  return { canvasItems, accessoryItems };
}

export default function AltarPresetBuilder({ presetId }) {
  const isCreate = presetId === "new";

  const [models, setModels] = useState([]);
  const [styles, setStyles] = useState([]);
  const [activeModelId, setActiveModelId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [canvasItems, setCanvasItems] = useState([]);
  const [accessoryItems, setAccessoryItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [modelsPage, stylesPage] = await Promise.all([
        adminApi.get("/altar-models", { size: 100 }),
        adminApi.get("/altar-styles", { size: 100 }),
      ]);
      const activeModels = (modelsPage?.content || []).filter((m) => m.isActive !== false);
      setModels(activeModels);
      setStyles((stylesPage?.content || []).filter((s) => s.isActive !== false));

      if (isCreate) {
        const firstModel = activeModels[0] || null;
        const firstSize = (firstModel?.sizes || [])[0] || null;
        setActiveModelId(firstModel?.id ?? null);
        setForm({ ...EMPTY_FORM, altarModelSizeId: firstSize?.id ?? null });
        setCanvasItems([]);
        setAccessoryItems([]);
        return;
      }

      const preset = await adminApi.get(`/altar-presets/${presetId}`);
      const altarModelSizeId = preset.altarModelSizeId ?? preset.altarModelSize?.id ?? null;
      const ownerModel = activeModels.find((m) => (m.sizes || []).some((s) => s.id === altarModelSizeId));
      setActiveModelId(ownerModel?.id ?? null);
      setForm({
        name: preset.name || "",
        slug: preset.slug || "",
        thumb: preset.thumb || "",
        description: preset.description || "",
        altarModelSizeId,
        altarStyleId: preset.altarStyleId ?? preset.altarStyle?.id ?? null,
        priority: preset.priority ?? 0,
        isActive: preset.isActive ?? true,
      });
      const { canvasItems: loadedCanvas, accessoryItems: loadedAccessories } = splitLoadedItems(preset.items);
      setCanvasItems(loadedCanvas);
      setAccessoryItems(loadedAccessories);
    } catch (requestError) {
      setError(requestError.message || "Không thể tải bộ gợi ý.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload only on identity change (isCreate/presetId), not on every models/styles setState
  }, [isCreate, presetId]);

  useEffect(() => {
    load();
  }, [load]);

  const activeModel = models.find((m) => m.id === activeModelId);
  const activeSize = (activeModel?.sizes || []).find((s) => s.id === form.altarModelSizeId) || null;

  const setField = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  const selectModel = (modelId) => {
    setActiveModelId(modelId);
    const model = models.find((m) => m.id === modelId);
    setField("altarModelSizeId", model?.sizes?.[0]?.id ?? null);
  };

  const addPlaceable = (feedItem) => {
    const nextItem = placeableToCanvasItem(feedItem);
    setCanvasItems((current) => [...current, nextItem]);
    setSelectedId(nextItem.instanceId);
  };

  const addAccessory = (feedItem) => {
    setAccessoryItems((current) => {
      const existing = current.find((row) => row.productId === feedItem.productId);
      if (existing) {
        return current.map((row) => (row.productId === feedItem.productId ? { ...row, quantity: row.quantity + 1 } : row));
      }
      return [...current, feedItemToAccessory(feedItem)];
    });
  };

  const updateSelectedItem = (patch) => {
    setCanvasItems((current) => current.map((item) => (resolveItemId(item) === selectedId ? { ...item, ...patch } : item)));
  };

  const removeSelectedItem = () => {
    setCanvasItems((current) => current.filter((item) => resolveItemId(item) !== selectedId));
    setSelectedId(null);
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Tên bộ gợi ý là bắt buộc.");
      return;
    }
    if (!form.thumb) {
      setError("Cần chọn ảnh đại diện.");
      return;
    }
    if (!form.description.trim()) {
      setError("Cần nhập mô tả.");
      return;
    }
    if (!form.altarModelSizeId) {
      setError("Cần chọn kích thước bàn thờ.");
      return;
    }
    if (canvasItems.length === 0 && accessoryItems.length === 0) {
      setError("Cần thêm ít nhất một vật phẩm.");
      return;
    }

    const payload = {
      name: form.name,
      slug: form.slug || undefined,
      thumb: form.thumb,
      description: form.description,
      altarModelSizeId: form.altarModelSizeId,
      altarStyleId: form.altarStyleId,
      priority: Number(form.priority) || 0,
      isActive: Boolean(form.isActive),
      items: buildItemsPayload(canvasItems, accessoryItems),
    };

    setSaving(true);
    try {
      if (isCreate) {
        const created = await adminApi.post("/altar-presets", payload);
        toast.success("Đã tạo bộ gợi ý.");
        window.location.assign(`${ROUTES.ADMIN_ALTAR_PRESETS}/${created.id}`);
        return;
      }
      await adminApi.put(`/altar-presets/${presetId}`, payload);
      toast.success("Đã lưu bộ gợi ý.");
      await load();
    } catch (requestError) {
      setError(requestError.message || "Không thể lưu bộ gợi ý.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="border border-zinc-200 bg-white p-8">Đang tải bộ gợi ý...</div>;
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 border border-zinc-200 bg-white p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href={ROUTES.ADMIN_ALTAR_PRESETS}
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-950"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Bộ gợi ý
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-zinc-950">
            {isCreate ? "Tạo bộ gợi ý mới" : form.name || "Sửa bộ gợi ý"}
          </h1>
        </div>
        {!isCreate && (
          <button
            type="button"
            onClick={load}
            className="inline-flex h-10 items-center gap-2 border border-zinc-300 px-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Tải lại
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div>
      )}

      <form onSubmit={submit} className="grid gap-5">
        <section className="border border-zinc-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-950">Thông tin bộ gợi ý</h2>
          <AltarPresetMetadataFields
            form={form}
            onFieldChange={setField}
            models={models}
            styles={styles}
            activeModelId={activeModelId}
            onSelectModel={selectModel}
          />
        </section>

        <section className="border border-zinc-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-950">Sắp xếp vật phẩm</h2>
          <div className="grid gap-4 lg:grid-cols-[1fr_1.6fr]">
            <div>
              <span className="mb-1 block text-xs font-semibold text-zinc-600">
                Thư viện sản phẩm {form.altarStyleId ? "(đang lọc theo kiểu men đã chọn)" : ""}
              </span>
              <AltarPresetItemPalette altarStyleId={form.altarStyleId} onAddPlaceable={addPlaceable} onAddAccessory={addAccessory} />
            </div>
            <AltarPresetCanvasPanel
              activeSize={activeSize}
              canvasItems={canvasItems}
              onChangeCanvasItems={setCanvasItems}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onUpdateSelected={updateSelectedItem}
              onRemoveSelected={removeSelectedItem}
            />
          </div>
        </section>

        <section className="border border-zinc-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-950">
            Phụ kiện (không đặt trên bàn thờ)
          </h2>
          <AltarPresetAccessoriesList
            items={accessoryItems}
            onChangeQuantity={(instanceId, quantity) =>
              setAccessoryItems((current) => current.map((item) => (item.instanceId === instanceId ? { ...item, quantity } : item)))
            }
            onRemove={(instanceId) => setAccessoryItems((current) => current.filter((item) => item.instanceId !== instanceId))}
          />
        </section>

        <div className="flex justify-end gap-2 border-t border-zinc-200 pt-4">
          <button type="submit" disabled={saving} className="h-11 bg-zinc-950 px-6 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60">
            {saving ? "Đang lưu..." : isCreate ? "Tạo bộ gợi ý" : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}
