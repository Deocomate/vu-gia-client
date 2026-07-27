"use client";

import { useState } from "react";
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
import ContactModal from "@/features/storefront/contact/contact-modal";

const TRUST_ITEMS = [
  { src: "/icons/trust-1.png", lines: ["Tư vấn", "miễn phí"] },
  { src: "/icons/trust-2.png", lines: ["Báo giá", "minh mạch"] },
  { src: "/icons/trust-3.png", lines: ["Giao hàng", "toàn quốc"] },
];

export default function AltarCustomizerSummary({
  items,
  total,
  formatMoney,
  formatTotal,
  getItemText,
  onRemove,
}) {
  const router = useRouter();
  const cartEnabled = useSiteConfigStore((s) => s.cartEnabled);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // The customizer's "product" is a configured combo, not a single catalog
  // product — build a readable description from the selected line items
  // (name/qty) for the contact modal's pre-filled message, since there's no
  // single product name/url to reuse here.
  const comboDescription =
    items.length > 0
      ? items.map((item) => getItemText(item.name, item.qty)).join(", ")
      : "Bộ đồ thờ tùy chỉnh";
  const customizerUrl = absoluteUrl(ROUTES.ALTAR_CUSTOMIZER);

  const goToCart = () => {
    if (!cartEnabled) {
      setIsContactModalOpen(true);
      return;
    }
    router.push(ROUTES.CART);
  };

  return (
    <aside className="right-rail" aria-label="Tóm tắt vật phẩm đã chọn">
      <div className="summary-card">
        <h2>Danh sách vật phẩm</h2>
        <ul className="selected-items">
          {items.map((item) => (
            <li key={item.key}>
              <span>{getItemText(item.name, item.qty)}</span>
              <b>{formatMoney(item.linePrice)}</b>
              <button
                type="button"
                aria-label={`Xóa ${item.name}`}
                onClick={() => onRemove(item.key)}
              >
                <Trash2 className="remove-item-icon" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
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
            title="Tính năng sắp ra mắt"
            disabled
          >
            <Download aria-hidden="true" />
          </button>
          <button
            className="icon-action bookmark-action"
            type="button"
            aria-label="Lưu cấu hình"
            title="Tính năng sắp ra mắt"
            disabled
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
          {TRUST_ITEMS.map(({ src, lines }) => (
            <span key={lines.join("-")}>
              <Image
                src={src}
                alt=""
                width={50}
                height={51}
                className="trust-icon"
                aria-hidden="true"
              />
              {lines[0]}
              <br />
              {lines[1]}
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
    </aside>
  );
}
