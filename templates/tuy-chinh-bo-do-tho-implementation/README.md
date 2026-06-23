# Vũ Gia Website - Figma Implementation

Triển khai từ node Figma `9737:8084` của file `Vũ Gia Website (5)`.

## Cấu trúc

- `index.html` — HTML layout
- `styles.css` — CSS thuần, không cần build tool
- `script.js` — tương tác đơn giản: tab, zoom, thêm/xóa vật phẩm, cập nhật tổng tiền

## Cách chạy

Mở trực tiếp `index.html` trong trình duyệt, hoặc chạy bằng một local server:

```bash
python -m http.server 8000
```

Sau đó mở `http://localhost:8000`.

## Ghi chú

Các ảnh đang dùng URL asset tạm từ Figma MCP. Theo metadata Figma, các URL này có thể hết hạn sau 7 ngày. Khi đưa vào production, nên tải ảnh từ Figma/export lại và thay bằng file trong thư mục `assets/`.
