"use client";

import {
  Bookmark,
  Download,
  FileText,
  Headphones,
  Phone,
  Trash2,
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/routes";

const TRUST_ITEMS = [
  { Icon: Headphones, lines: ["Tư vấn", "miễn phí"] },
  { Icon: FileText, lines: ["Báo giá", "minh mạch"] },
  { Icon: Truck, lines: ["Giao hàng", "toàn quốc"] },
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

  const goToCart = () => router.push(ROUTES.CART);

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
            <Phone aria-hidden="true" />
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
          {TRUST_ITEMS.map(({ Icon, lines }) => (
            <span key={lines.join("-")}>
              <Icon className="trust-icon" aria-hidden="true" />
              {lines[0]}
              <br />
              {lines[1]}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
