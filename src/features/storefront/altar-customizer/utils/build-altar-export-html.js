/**
 * Escapes the characters that matter for safely interpolating untrusted text into HTML text
 * content/attribute values: & < > " '. Product names are admin-authored catalog text — never
 * sanitized against HTML — and are the only untrusted input reaching `buildAltarExportHtml`.
 * Every interpolated value in this module goes through this helper; never raw string
 * concatenation of an unescaped value.
 */
export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatCurrency(value) {
  return `${new Intl.NumberFormat("vi-VN").format(Number(value) || 0)}đ`;
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

/**
 * Local-time filename for the downloaded export (phase 5: "Filename e.g.
 * ban-tho-vu-gia-{yyyyMMdd-HHmm}.html"). Local time deliberately (not UTC/ISO) — this is a
 * human-facing filename, not a machine timestamp.
 */
export function buildAltarExportFilename(date = new Date()) {
  const y = date.getFullYear();
  const m = pad2(date.getMonth() + 1);
  const d = pad2(date.getDate());
  const hh = pad2(date.getHours());
  const mm = pad2(date.getMinutes());
  return `ban-tho-vu-gia-${y}${m}${d}-${hh}${mm}.html`;
}

function buildRow(line) {
  const quantity = Number(line?.quantity) || 1;
  const unitPrice = Number(line?.price) || 0;
  const lineTotal = unitPrice * quantity;
  return `
      <tr>
        <td>${escapeHtml(line?.name)}</td>
        <td>${escapeHtml(line?.sizeLabel || "")}</td>
        <td class="num">${quantity}</td>
        <td class="num">${formatCurrency(unitPrice)}</td>
        <td class="num">${formatCurrency(lineTotal)}</td>
      </tr>`;
}

/**
 * Builds a single self-contained HTML document string: inline <style>, the composed altar image
 * (`compose-altar-image.js`'s output) as a `data:` URI <img>, and a table of every item/accessory
 * line (name, size/style, quantity, unit price, line total) plus basic Vũ Gia branding. No
 * external resources (fonts/scripts/stylesheets/images) — the file must open offline with zero
 * network requests (phase 5 non-functional requirement).
 *
 * @param {object} params
 * @param {string} params.imageDataUrl - `data:image/...;base64,...` from `composeAltarImage()`.
 * @param {Array<{name:string, sizeLabel?:string, quantity?:number, price?:number}>} params.lines
 * @param {number} params.grandTotal
 * @param {string} [params.title]
 * @param {Date} [params.generatedAt]
 */
export function buildAltarExportHtml({
  imageDataUrl,
  lines,
  grandTotal,
  title = "Thiết kế bàn thờ Gốm Vũ Gia",
  generatedAt = new Date(),
}) {
  const rowsHtml = (lines || []).map(buildRow).join("");
  const generatedLabel =
    generatedAt instanceof Date && !Number.isNaN(generatedAt.getTime())
      ? escapeHtml(generatedAt.toLocaleString("vi-VN"))
      : "";

  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(title)}</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; color: #2E2F2A; background: #FAF7F7; margin: 0; padding: 32px; }
  .brand { font-size: 22px; font-weight: 700; color: #C76E00; margin-bottom: 4px; }
  .meta { font-size: 13px; color: #8C8C8C; margin-bottom: 24px; }
  .composed-image { max-width: 100%; width: 640px; display: block; margin: 0 auto 24px; border: 1px solid #D1D5DB; border-radius: 6px; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th, td { border: 1px solid #D1D5DB; padding: 8px 12px; text-align: left; }
  th { background: #F5F0EA; font-weight: 700; }
  td.num, th.num { text-align: right; }
  tfoot td { font-weight: 700; }
</style>
</head>
<body>
  <div class="brand">Gốm Sứ Vũ Gia</div>
  <div class="meta">${generatedLabel ? `Xuất lúc: ${generatedLabel}` : ""}</div>
  <img class="composed-image" src="${escapeHtml(imageDataUrl)}" alt="${escapeHtml(title)}">
  <table>
    <thead>
      <tr>
        <th>Tên sản phẩm</th>
        <th>Kích thước / Kiểu dáng</th>
        <th class="num">Số lượng</th>
        <th class="num">Đơn giá</th>
        <th class="num">Thành tiền</th>
      </tr>
    </thead>
    <tbody>${rowsHtml}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="4">Tổng cộng</td>
        <td class="num">${formatCurrency(grandTotal)}</td>
      </tr>
    </tfoot>
  </table>
</body>
</html>`;
}
