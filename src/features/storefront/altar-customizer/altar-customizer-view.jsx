"use client";

import "@/features/storefront/altar-customizer/components/altar-customizer.css";
import AltarCustomizerIntro from "@/features/storefront/altar-customizer/components/AltarCustomizerIntro";
import AltarCustomizerLeftRail from "@/features/storefront/altar-customizer/components/AltarCustomizerLeftRail";
import AltarCustomizerDesignerPanel from "@/features/storefront/altar-customizer/components/AltarCustomizerDesignerPanel";
import AltarCustomizerSummary from "@/features/storefront/altar-customizer/components/AltarCustomizerSummary";
import AltarSizeGuideSection from "@/features/storefront/altar-customizer/components/AltarSizeGuideSection";
import AltarSimilarProductsSection from "@/features/storefront/altar-customizer/components/AltarSimilarProductsSection";
import { INITIAL_CART_ITEMS } from "@/features/storefront/altar-customizer/components/data/altarCustomizerData";
import { useAltarCustomizer } from "@/features/storefront/altar-customizer/components/hooks/useAltarCustomizer";

export default function AltarCustomizerView() {
  const {
    items,
    total,
    zoom,
    zoomIn,
    zoomOut,
    setZoom,
    activeTab,
    setActiveTab,
    activeStep,
    setActiveStep,
    addItem,
    removeItem,
    formatMoney,
    formatTotal,
    getItemText,
  } = useAltarCustomizer(INITIAL_CART_ITEMS);

  return (
    <div className="altar-customizer w-full bg-white overflow-x-hidden">
      <AltarCustomizerIntro />

      <section className="customizer-grid" aria-label="Bộ tùy chỉnh đồ thờ">
        <AltarCustomizerLeftRail
          activeStep={activeStep}
          onStepChange={setActiveStep}
        />
        <AltarCustomizerDesignerPanel
          zoom={zoom}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onZoomChange={setZoom}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onAddItem={addItem}
        />
        <AltarCustomizerSummary
          items={items}
          total={total}
          formatMoney={formatMoney}
          formatTotal={formatTotal}
          getItemText={getItemText}
          onRemove={removeItem}
        />
      </section>

      <AltarSizeGuideSection />
      <AltarSimilarProductsSection />
    </div>
  );
}
