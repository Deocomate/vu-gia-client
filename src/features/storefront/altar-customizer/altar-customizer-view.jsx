"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import "@/features/storefront/altar-customizer/components/altar-customizer.css";
import AltarCustomizerIntro from "@/features/storefront/altar-customizer/components/altar-customizer-intro";
import AltarCustomizerLeftRail from "@/features/storefront/altar-customizer/components/altar-customizer-left-rail";
import AltarCustomizerDesignerPanel from "@/features/storefront/altar-customizer/components/altar-customizer-designer-panel";
import AltarCustomizerSummary from "@/features/storefront/altar-customizer/components/altar-customizer-summary";
import AltarSizeGuideSection from "@/features/storefront/altar-customizer/components/altar-size-guide-section";
import AltarSimilarProductsSection from "@/features/storefront/altar-customizer/components/altar-similar-products-section";
import { useAltarCatalog } from "@/features/storefront/altar-customizer/components/hooks/use-altar-catalog";
import {
  mapPresetToCanvasState,
  useAltarCanvasReducer,
} from "@/features/storefront/altar-customizer/components/hooks/use-altar-canvas-reducer";
import { getAltarDesign } from "@/features/storefront/altar-customizer/altar-design-service";
import { consumePendingCanvas } from "@/features/storefront/altar-customizer/utils/pending-canvas-storage";
import { confirm, toast } from "@/shared/utils/feedback";

/**
 * `AltarDesignResponse.items`/`.accessories` are raw JSON array strings (same convention as
 * `ProductEntity.comboProducts`), not nested JSON objects — parse defensively so malformed/absent
 * JSON yields an empty canvas instead of throwing (same pattern as `product-info.jsx`'s
 * `parseComboRefs`).
 */
function parseJsonArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function AltarCustomizerContent() {
  const searchParams = useSearchParams();
  const designId = searchParams.get("designId");

  const { models, groups, styles, items: feedItems, loading: catalogLoading, error: catalogError } = useAltarCatalog();
  const { state, canUndo, canRedo, actions } = useAltarCanvasReducer();
  const { changeSize, loadPreset } = actions;

  const restoredPendingRef = useRef(false);
  const hydratedDesignRef = useRef(false);

  // Phase 5 "logged-out save flow": restore a canvas snapshot persisted right before an
  // interrupted "Lưu" → /dang-nhap redirect (see `altar-save-dialog.jsx` /
  // `pending-canvas-storage.js`). Runs once, synchronously on mount — a `?designId=` open (below)
  // always wins over a stale pending-canvas snapshot, but the snapshot is still consumed
  // (cleared) either way so it never leaks into a later, unrelated session.
  useEffect(() => {
    if (restoredPendingRef.current) return;
    restoredPendingRef.current = true;
    const pending = consumePendingCanvas();
    if (!pending || designId) return;
    changeSize({
      altarModelId: pending.altarModelId ?? null,
      altarSizeId: pending.altarSizeId ?? null,
      altarStyleId: pending.altarStyleId ?? null,
    });
    loadPreset({
      presetId: pending.presetId ?? null,
      items: pending.items || [],
      accessories: pending.accessories || [],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run exactly once, on mount
  }, []);

  // "Open" flow from the account design library (`?designId=`): fetch the saved design, resolve
  // its `altarModelId` by scanning the loaded catalog for the model whose sizes include the
  // design's `altarModelSizeId` (the design response only carries the size id, not its parent
  // model), then hydrate the reducer wholesale — `presetId` is deliberately left `null` here (not
  // the design's own id) so the toolbar's "Khôi phục mẫu" stays correctly disabled: a saved
  // design is not a preset, and its id is not a valid `/altar-presets/{id}` lookup.
  useEffect(() => {
    if (!designId || models.length === 0 || hydratedDesignRef.current) return;
    hydratedDesignRef.current = true;

    (async () => {
      try {
        const design = await getAltarDesign(designId);
        const altarModelId =
          models.find((model) => (model.sizes || []).some((size) => size.id === design.altarModelSizeId))?.id ?? null;

        changeSize({
          altarModelId,
          altarSizeId: design.altarModelSizeId ?? null,
          altarStyleId: design.altarStyleId ?? null,
        });
        loadPreset({
          presetId: null,
          items: parseJsonArray(design.items),
          accessories: parseJsonArray(design.accessories),
        });

        if (design.droppedItemCount > 0) {
          toast.info(
            `${design.droppedItemCount} sản phẩm không còn khả dụng đã được loại bỏ khỏi thiết kế này.`,
          );
        }
        if (
          design.currentTotalPrice != null &&
          design.totalPrice != null &&
          Number(design.currentTotalPrice) !== Number(design.totalPrice)
        ) {
          toast.info("Giá của một số sản phẩm trong thiết kế đã thay đổi so với lúc lưu.");
        }
      } catch (error) {
        toast.error(error?.message || "Không thể mở thiết kế đã lưu.");
      }
    })();
  }, [designId, models, changeSize, loadPreset]);

  // Seed the first model/size once the catalog arrives — only while nothing has been picked yet,
  // so this never overwrites a selection the visitor already made (including the two hydration
  // paths above, which both set `altarModelId` before this can fire — see their effects).
  useEffect(() => {
    if (state.altarModelId || models.length === 0) return;
    const firstModel = models[0];
    const firstSize = (firstModel.sizes || []).find((size) => size.isActive !== false) || null;
    actions.changeSize({ altarModelId: firstModel.id, altarSizeId: firstSize?.id ?? null });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run only when the catalog/selection identity changes, not on every actions re-creation
  }, [models, state.altarModelId]);

  const activeModel = models.find((model) => model.id === state.altarModelId) || null;
  const activeSize = (activeModel?.sizes || []).find((size) => size.id === state.altarSizeId) || null;
  const activeStyle = styles.find((style) => style.id === state.altarStyleId) || null;
  const isDirty = state.items.length > 0 || state.accessories.length > 0;

  const handleSelectModel = (modelId) => {
    const model = models.find((m) => m.id === modelId);
    const nextSize = (model?.sizes || []).find((size) => size.isActive !== false) || null;
    actions.changeSize({ altarModelId: modelId, altarSizeId: nextSize?.id ?? null });
  };

  const handleSelectSize = (sizeId) => actions.changeSize({ altarSizeId: sizeId });
  const handleSelectStyle = (styleId) => actions.changeSize({ altarStyleId: styleId });

  const handleSelectPreset = async (preset) => {
    if (isDirty) {
      const ok = await confirm({
        title: "Thay thế bố cục hiện tại?",
        description: `Bố cục hiện tại sẽ được thay thế bằng bộ gợi ý "${preset.name}". Các thay đổi chưa lưu sẽ mất.`,
        confirmLabel: "Dùng bộ gợi ý này",
        cancelLabel: "Hủy",
        destructive: true,
      });
      if (!ok) return;
    }
    const mapped = mapPresetToCanvasState(preset);
    actions.loadPreset({ presetId: preset.id, ...mapped });
  };

  return (
    <div className="altar-customizer w-full bg-white overflow-x-hidden">
      <AltarCustomizerIntro />

      <section className="customizer-grid" aria-label="Bộ tùy chỉnh đồ thờ">
        <AltarCustomizerLeftRail
          models={models}
          styles={styles}
          loadingCatalog={catalogLoading}
          altarModelId={state.altarModelId}
          altarSizeId={state.altarSizeId}
          altarStyleId={state.altarStyleId}
          presetId={state.presetId}
          onSelectModel={handleSelectModel}
          onSelectSize={handleSelectSize}
          onSelectStyle={handleSelectStyle}
          onSelectPreset={handleSelectPreset}
        />

        <AltarCustomizerDesignerPanel
          activeSize={activeSize}
          canvasState={state}
          canUndo={canUndo}
          canRedo={canRedo}
          actions={actions}
          feedItems={feedItems}
          groups={groups}
          styles={styles}
        />

        <AltarCustomizerSummary
          items={state.items}
          accessories={state.accessories}
          onRemoveItem={actions.remove}
          onRemoveAccessory={actions.removeAccessory}
          activeModel={activeModel}
          activeSize={activeSize}
          activeStyle={activeStyle}
          altarModelId={state.altarModelId}
          altarSizeId={state.altarSizeId}
          altarStyleId={state.altarStyleId}
          presetId={state.presetId}
        />
      </section>

      {catalogError && (
        <p className="mx-auto mt-4 max-w-[1320px] px-[30px] text-center text-sm font-semibold text-rose-600">
          {catalogError}
        </p>
      )}

      <AltarSizeGuideSection />
      <AltarSimilarProductsSection />
    </div>
  );
}

// `useSearchParams` (for `?designId=`) requires a Suspense boundary — same convention as this
// codebase's other client-side search-param readers (see `shared/components/global-altar-widget.jsx`).
export default function AltarCustomizerView() {
  return (
    <Suspense fallback={null}>
      <AltarCustomizerContent />
    </Suspense>
  );
}
