"use client";

import "@/components/altar-customizer/altar-customizer.css";
import AltarCustomizerIntro from "@/components/altar-customizer/AltarCustomizerIntro";
import AltarCustomizerLeftRail from "@/components/altar-customizer/AltarCustomizerLeftRail";
import AltarCustomizerDesignerPanel from "@/components/altar-customizer/AltarCustomizerDesignerPanel";
import AltarCustomizerSummary from "@/components/altar-customizer/AltarCustomizerSummary";
import AltarSizeGuideSection from "@/components/altar-customizer/AltarSizeGuideSection";
import AltarSimilarProductsSection from "@/components/altar-customizer/AltarSimilarProductsSection";
import { INITIAL_CART_ITEMS } from "@/components/altar-customizer/data/altarCustomizerData";
import { useAltarCustomizer } from "@/components/altar-customizer/hooks/useAltarCustomizer";

export default function AltarCustomizerView() {
  const {
    items,
    total,
    zoom,
    zoomIn,
    zoomOut,
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
