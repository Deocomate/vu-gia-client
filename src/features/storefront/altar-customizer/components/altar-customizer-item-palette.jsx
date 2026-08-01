"use client";

import { useMemo, useState } from "react";
import { formatImageUrl } from "@/shared/api/media";

function formatPrice(value) {
  return `${new Intl.NumberFormat("vi-VN").format(Number(value) || 0)} ₫`;
}

/**
 * Product tabs (from `AltarItemGroup` rows, "Tất cả" prepended) + style chips + the placeable/
 * accessory product grids, all filtered client-side from the single `items` feed fetched once by
 * `use-altar-catalog.js` (see that hook's docblock for why: the seeded catalog is small).
 *
 * Split by `renderOnAltar`, not by whether a `placement` exists — a product with
 * `renderOnAltar=true` but no authored `placement` is still shown in the main grid (per decision
 * D1 this is the *common* case in the seeded catalog), just with its "add to altar" action
 * disabled and a reason instead of a broken/no-op button. Only `renderOnAltar=false` rows go to
 * the accessory list.
 */
export default function AltarCustomizerItemPalette({
  items,
  groups,
  styles,
  altarStyleId,
  onChangeStyle,
  onAddPlaceable,
  onAddAccessory,
}) {
  const [activeGroupId, setActiveGroupId] = useState(null);

  const visibleItems = useMemo(() => {
    return (items || []).filter((item) => {
      if (activeGroupId !== null && item.groupId !== activeGroupId) return false;
      if (altarStyleId && item.styleId !== altarStyleId) return false;
      return true;
    });
  }, [items, activeGroupId, altarStyleId]);

  const canvasCandidates = visibleItems.filter((item) => item.renderOnAltar !== false);
  const accessoryCandidates = visibleItems.filter((item) => item.renderOnAltar === false);

  return (
    <>
      <div className="product-tabs" role="tablist" aria-label="Nhóm vật phẩm">
        <button
          type="button"
          role="tab"
          aria-selected={activeGroupId === null}
          className={`tab-button${activeGroupId === null ? " is-active" : ""}`}
          onClick={() => setActiveGroupId(null)}
        >
          Tất cả
        </button>
        {(groups || []).map((group) => (
          <button
            key={group.id}
            type="button"
            role="tab"
            aria-selected={activeGroupId === group.id}
            className={`tab-button${activeGroupId === group.id ? " is-active" : ""}`}
            onClick={() => setActiveGroupId(group.id)}
          >
            {group.name}
          </button>
        ))}
      </div>

      {styles?.length > 0 && (
        <div className="style-chip-row" aria-label="Lọc theo phong cách">
          <button
            type="button"
            className={`style-chip${!altarStyleId ? " is-active" : ""}`}
            onClick={() => onChangeStyle(null)}
          >
            Tất cả phong cách
          </button>
          {styles.map((style) => (
            <button
              key={style.id}
              type="button"
              className={`style-chip${altarStyleId === style.id ? " is-active" : ""}`}
              onClick={() => onChangeStyle(style.id)}
            >
              {style.name}
            </button>
          ))}
        </div>
      )}

      <div className="custom-products" aria-label="Danh sách sản phẩm có thể thêm">
        {canvasCandidates.length === 0 && (
          <p className="palette-empty">Không có sản phẩm phù hợp bộ lọc hiện tại.</p>
        )}
        {canvasCandidates.map((item) => {
          const placeable = Boolean(item.placement);
          return (
            <article key={item.productId} className="mini-product-card">
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={formatImageUrl(item.thumb)} alt={item.name} />
              </figure>
              <h3>{item.name}</h3>
              <strong>{formatPrice(item.price)}</strong>
              {placeable ? (
                <button className="add-item" type="button" onClick={() => onAddPlaceable(item)}>
                  {/* The narrow (≤720px) card is too small for the full label — CSS swaps which
                      span is displayed rather than duplicating the button per breakpoint. */}
                  <span className="add-item-label-full">Thêm vào bàn thờ</span>
                  <span className="add-item-label-short">Thêm</span>
                </button>
              ) : (
                <span
                  className="add-item add-item-disabled"
                  role="note"
                  title="Sản phẩm này chưa có vị trí đặt trên bàn thờ — vui lòng liên hệ tư vấn"
                >
                  Chưa có vị trí đặt
                </span>
              )}
            </article>
          );
        })}
      </div>

      <div className="accessory-title">
        <strong>Phụ kiện đi kèm</strong> <span>(không hiển thị trên bàn thờ)</span>
      </div>
      <div className="accessory-list">
        {accessoryCandidates.length === 0 && (
          <p className="palette-empty">Chưa có phụ kiện phù hợp bộ lọc hiện tại.</p>
        )}
        {accessoryCandidates.map((item) => (
          <article key={item.productId}>
            <span className="accessory-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={formatImageUrl(item.thumb)} alt={item.name} />
            </span>
            <div>
              <b>{item.name}</b>
              <span>{formatPrice(item.price)}</span>
            </div>
            <button
              className="add-item"
              type="button"
              aria-label={`Thêm ${item.name}`}
              onClick={() => onAddAccessory(item)}
            >
              +
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
