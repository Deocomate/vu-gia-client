"use client";

import {
  AlignCenter,
  CirclePlus,
  FlipHorizontal2,
  Redo2,
  RotateCcw,
  Trash2,
  Undo2,
} from "lucide-react";
import {
  ACCESSORIES,
  CUSTOMIZER_PRODUCTS,
  PRODUCT_TABS,
  altarPreview,
} from "./data/altarCustomizerData";

const TOOLBAR_BUTTONS = [
  { className: "undo-button", label: "Hoàn tác", Icon: Undo2 },
  { className: "redo-button", label: "Làm lại", Icon: Redo2 },
  { className: "center-button", label: "Căn giữa", Icon: AlignCenter },
  { className: "mirror-button", label: "Tạo đối xứng", Icon: FlipHorizontal2 },
  { className: "clear-button", label: "Xóa tất cả", Icon: Trash2 },
  { className: "restore-button", label: "Khôi phục mẫu", Icon: RotateCcw },
];

function formatDisplayPrice(price) {
  return `${new Intl.NumberFormat("vi-VN").format(price)} ₫`;
}

export default function AltarCustomizerDesignerPanel({
  zoom,
  onZoomIn,
  onZoomOut,
  activeTab,
  onTabChange,
  onAddItem,
}) {
  const visibleProducts =
    activeTab === "Tất cả"
      ? CUSTOMIZER_PRODUCTS
      : CUSTOMIZER_PRODUCTS.filter((product) => product.tab === activeTab);

  return (
    <section className="designer-panel" aria-label="Khu vực tùy chỉnh bố cục đồ thờ">
      <div className="tool-bar" aria-label="Thanh công cụ">
        {TOOLBAR_BUTTONS.map(({ className, label, Icon }) => (
          <button
            key={className}
            className={`tool-button ${className}`}
            type="button"
            disabled
            title="Tính năng sắp ra mắt"
            aria-disabled="true"
          >
            <Icon className="tool-icon" aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
        <div className="zoom-control" aria-label="Điều khiển thu phóng">
          <button type="button" aria-label="Thu nhỏ" onClick={onZoomOut}>
            −
          </button>
          <span>{zoom}%</span>
          <button type="button" aria-label="Phóng to" onClick={onZoomIn}>
            +
          </button>
        </div>
      </div>

      <div className="altar-preview">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={altarPreview.src}
          alt="Không gian bàn thờ gỗ"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "center top",
          }}
        />
        <div className="drag-hint">
          <CirclePlus className="drag-hint-icon" aria-hidden="true" />
          <span>Kéo thả vật phẩm để thay đổi vị trí</span>
        </div>
      </div>

      <div className="product-tabs" role="tablist" aria-label="Nhóm vật phẩm">
        {PRODUCT_TABS.map((tab) => (
          <button
            key={tab}
            className={`tab-button${activeTab === tab ? " is-active" : ""}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="custom-products" aria-label="Danh sách sản phẩm có thể thêm">
        {visibleProducts.map((product) => (
          <article key={product.id} className="mini-product-card">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.image.src} alt={product.displayName} />
            </figure>
            <h3>{product.displayName}</h3>
            <p>{product.size}</p>
            <strong>{formatDisplayPrice(product.price)}</strong>
            <button
              className="add-item"
              type="button"
              onClick={() => onAddItem(product.name, product.price)}
            >
              Thêm
            </button>
          </article>
        ))}
      </div>

      <div className="accessory-title">
        <strong>Phụ kiện đi kèm</strong> <span>(không hiển thị trên bàn thờ)</span>
      </div>
      <div className="accessory-list">
        {ACCESSORIES.map((accessory) => (
          <article key={accessory.id}>
            <span className={`accessory-image ${accessory.spriteClass}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={accessory.image.src} alt={accessory.name} />
            </span>
            <div>
              <b>{accessory.name}</b>
              <span>{formatDisplayPrice(accessory.price)}</span>
            </div>
            <button
              className="add-item"
              type="button"
              aria-label={`Thêm ${accessory.name}`}
              onClick={() => onAddItem(accessory.name, accessory.price)}
            >
              +
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
