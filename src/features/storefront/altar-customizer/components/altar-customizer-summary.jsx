"use client";

import { useMemo, useState } from "react";
import {
  Bookmark,
  Clock,
  Download,
  Phone,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared/utils/routes";
import { useSiteConfigStore } from "@/shared/stores/site-config-store";
import { absoluteUrl } from "@/shared/lib/seo/site-config";
import { toast } from "@/shared/utils/feedback";
import ContactModal from "@/features/storefront/contact/contact-modal";
import AltarSaveDialog from "@/features/storefront/altar-customizer/components/altar-save-dialog";
import { computeCanvasTotal } from "@/features/storefront/altar-customizer/utils/compute-canvas-total";
import { composeAltarImage } from "@/features/storefront/altar-customizer/utils/compose-altar-image";
import {
  buildAltarExportFilename,
  buildAltarExportHtml,
} from "@/features/storefront/altar-customizer/utils/build-altar-export-html";

const TRUST_ITEMS = [
  { src: "/icons/trust-1.png", lines: ["Tư vấn", "miễn phí"] },
  { src: "/icons/trust-2.png", lines: ["Báo giá", "minh mạch"] },
  { src: "/icons/trust-3.png", lines: ["Giao hàng", "toàn quốc"] },
];

function formatMoney(value) {
  return `${new Intl.NumberFormat("vi-VN").format(Number(value) || 0)}đ`;
}

function formatTotal(value) {
  return `${new Intl.NumberFormat("vi-VN").format(Number(value) || 0)} đ`;
}

/** Groups canvas `items` (one row per placed instance) by `productId` for the summary list —
 * two instances of the same product show as one "2 x Tên sản phẩm" line, matching how the old
 * mock summary displayed quantities, but now derived from real placed instances instead of a
 * hand-maintained `qty` field. */
function groupItemsByProduct(items) {
  const byProduct = new Map();
  items.forEach((item) => {
    const key = `item:${item.productId}`;
    const existing = byProduct.get(key);
    const unitPrice = Number(item.price) || 0;
    if (existing) {
      existing.qty += 1;
      existing.linePrice += unitPrice;
    } else {
      // `unitPrice` is the first instance's price — every instance of the same product carries
      // the same denormalized price (Phase 4's reducer copies it once from the catalog feed), so
      // this is exact, not an approximation; kept alongside `linePrice` for the export table's
      // separate "unit price"/"line total" columns (phase 5) without re-deriving it there.
      byProduct.set(key, { key, name: item.name, qty: 1, unitPrice, linePrice: unitPrice });
    }
  });
  return Array.from(byProduct.values());
}

function accessoriesToLines(accessories) {
  return accessories.map((accessory) => ({
    key: `accessory:${accessory.productId}`,
    name: accessory.name,
    qty: accessory.quantity,
    linePrice: (Number(accessory.price) || 0) * accessory.quantity,
  }));
}

export default function AltarCustomizerSummary({
  items,
  accessories,
  onRemoveItem,
  onRemoveAccessory,
  activeModel,
  activeSize,
  activeStyle,
  altarModelId,
  altarSizeId,
  altarStyleId,
  presetId,
}) {
  const router = useRouter();
  const cartEnabled = useSiteConfigStore((s) => s.cartEnabled);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const lines = useMemo(
    () => [...groupItemsByProduct(items), ...accessoriesToLines(accessories)],
    [items, accessories],
  );
  // Single shared implementation (`compute-canvas-total.js`) so the on-screen total, the saved
  // design's `totalPrice` snapshot, and the exported HTML's grand total can never drift apart.
  const total = useMemo(() => computeCanvasTotal({ items, accessories }), [items, accessories]);

  // No per-item variant size/style in this app's data model (a placed instance is just a
  // product + placement), so the export table's "size/style" column (phase 5 requirement) shows
  // the altar-level selection uniformly on every row — the only "size/style" data that actually
  // exists here.
  const sizeLabel = useMemo(
    () =>
      [
        activeModel?.name,
        activeSize ? `${activeSize.widthCm}x${activeSize.depthCm}cm` : null,
        activeStyle?.name,
      ]
        .filter(Boolean)
        .join(" · "),
    [activeModel, activeSize, activeStyle],
  );

  const canvasState = useMemo(
    () => ({ altarModelId, altarSizeId, altarStyleId, presetId, items, accessories }),
    [altarModelId, altarSizeId, altarStyleId, presetId, items, accessories],
  );

  // The customizer's "product" is a configured combo, not a single catalog product — build a
  // readable description from the selected line items (name/qty) for the contact modal's
  // pre-filled message, since there's no single product name/url to reuse here.
  const comboDescription =
    lines.length > 0
      ? lines.map((line) => `${line.qty} x ${line.name}`).join(", ")
      : "Bộ đồ thờ tùy chỉnh";
  const customizerUrl = absoluteUrl(ROUTES.ALTAR_CUSTOMIZER);

  const goToCart = () => {
    if (!cartEnabled) {
      setIsContactModalOpen(true);
      return;
    }
    router.push(ROUTES.CART);
  };

  const handleRemove = (key) => {
    if (key.startsWith("item:")) {
      const productId = Number(key.slice("item:".length));
      const target = items.find((item) => item.productId === productId);
      if (target) onRemoveItem(target.instanceId);
      return;
    }
    const productId = Number(key.slice("accessory:".length));
    onRemoveAccessory(productId);
  };

  // Client-only, no auth check (phase 5: "Works while logged out") — compose the flattened
  // altar image, build a self-contained HTML string around it, then trigger a browser download
  // via a Blob object URL + synthetic <a download> click (no server round trip at all).
  const handleDownload = async () => {
    if (!activeSize) {
      toast.error("Vui lòng chọn kích thước bàn thờ trước khi tải về.");
      return;
    }
    if (lines.length === 0) {
      toast.error("Chưa có vật phẩm nào để tải về.");
      return;
    }

    setDownloading(true);
    try {
      const imageDataUrl = await composeAltarImage(activeSize, items);
      const html = buildAltarExportHtml({
        imageDataUrl,
        lines: lines.map((line) => ({
          name: line.name,
          sizeLabel,
          quantity: line.qty,
          price: line.unitPrice ?? (line.qty > 0 ? line.linePrice / line.qty : 0),
        })),
        grandTotal: total,
      });

      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = buildAltarExportFilename();
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error?.message || "Không thể tạo tệp tải về. Vui lòng thử lại.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <aside className="right-rail" aria-label="Tóm tắt vật phẩm đã chọn">
      <div className="summary-card">
        <h2>Danh sách vật phẩm</h2>
        {lines.length === 0 ? (
          <p className="summary-empty">Chưa có vật phẩm nào — chọn sản phẩm bên trái để thêm vào bàn thờ.</p>
        ) : (
          <ul className="selected-items">
            {lines.map((line) => (
              <li key={line.key}>
                <span>
                  {line.qty} x {line.name}
                </span>
                <b>{formatMoney(line.linePrice)}</b>
                <button type="button" aria-label={`Xóa ${line.name}`} onClick={() => handleRemove(line.key)}>
                  <Trash2 className="remove-item-icon" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="summary-total">
          <span>Giá tổng</span>
          <strong>{formatTotal(total)}</strong>
          <p>
            Giá có thể thay đổi theo kích thước, màu men và tình trạng sản phẩm thực tế. Gốm Vũ Gia sẽ xác nhận trước khi chốt đơn
          </p>
        </div>
        <div className="summary-actions">
          <button className="primary-action" type="button" onClick={goToCart}>
            Mua ngay
          </button>
          <a className="icon-action phone-action" href="tel:0394123981" aria-label="Gọi tư vấn">
            <Phone aria-hidden="true" fill="currentColor" />
          </a>
          <button className="secondary-action" type="button" onClick={goToCart}>
            Thêm vào giỏ hàng
          </button>
          <button
            className="icon-action download-action"
            type="button"
            aria-label="Tải xuống cấu hình"
            title="Tải về tệp HTML"
            onClick={handleDownload}
            disabled={downloading}
          >
            <Download aria-hidden="true" />
          </button>
          <button
            className="icon-action bookmark-action"
            type="button"
            aria-label="Lưu cấu hình"
            title="Lưu vào thư viện thiết kế"
            onClick={() => setIsSaveDialogOpen(true)}
          >
            <Bookmark aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="trust-card">
        <p>
          Gốm Vũ Gia cam kết tư vấn tận tâm
          <br />
          chuẩn kích thước và đúng nhu cầu
        </p>
        <div className="trust-icons">
          {TRUST_ITEMS.map(({ src, lines: itemLines }) => (
            <span key={itemLines.join("-")}>
              <Image
                src={src}
                alt=""
                width={50}
                height={51}
                className="trust-icon"
                aria-hidden="true"
              />
              {itemLines[0]}
              <br />
              {itemLines[1]}
            </span>
          ))}
        </div>
      </div>

      <div className="support-card lg:hidden">
        <h3>
          <Image src="/icons/support.svg" width={19} height={22} className="rail-icon support-icon" alt="" />
          Cần hỗ trợ
        </h3>
        <p>Đội ngũ Gốm Vũ Gia luôn sẵn sàng hỗ trợ và tư vấn cho bạn</p>
        <strong className="support-phone">
          <Phone className="rail-icon phone-icon" aria-hidden="true" />
          0394 123 981
        </strong>
        <p>
          Thời gian: 8:00 - 18:00 (T2 - CN)
        </p>
      </div>

      <ContactModal
        open={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
        productContext={{ name: comboDescription, url: customizerUrl }}
      />

      <AltarSaveDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        canvasState={canvasState}
        activeSize={activeSize}
        totalPrice={total}
      />
    </aside>
  );
}
