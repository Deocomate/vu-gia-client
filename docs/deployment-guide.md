# Hướng dẫn Triển khai & Vận hành (Deployment Guide) — Frontend

Tài liệu này hướng dẫn chi tiết setup local, biến môi trường, build và chạy `vu-gia-client` (Next.js
15) dưới dạng container Docker. Cho hướng dẫn **full-stack** (kết nối với backend, test qua Docker
Desktop), xem **[`../../docs/deployment-guide.md`](../../docs/deployment-guide.md)** ở repo root —
tài liệu đó có phần giải thích quan trọng về vì sao app này cần **2 địa chỉ backend khác nhau**
(browser-facing vs internal SSR) mà bạn nên đọc trước khi deploy thật.

---

## 1. Yêu cầu Hệ thống

* **Node.js:** 18.x+ (khuyến nghị LTS 20.x/22.x) — chỉ cần cho dev local không Docker.
* **Docker & Docker Compose:** Docker Engine 20.10+ / Compose v2+ — cho build/chạy production.

---

## 2. Dev local (không Docker)

```bash
npm install
npm run dev          # http://localhost:3000, Turbopack
npm run lint
```

Tạo `.env.local` (xem `.env.example`):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_IMAGE_BASE_URL=http://localhost:8080
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Yêu cầu backend (`vu-gia-backend-api`) đang chạy tại `http://localhost:8080` (`docker compose up -d
--build`, xem README backend). Xác thực dùng Bearer token (không cookie) → không cần cấu hình CORS
credentials đặc biệt.

**Ảnh**: `NEXT_PUBLIC_IMAGE_BASE_URL` chỉ ảnh hưởng ảnh **backend-upload** (đã là absolute URL trong
JSON response, biến này chỉ dùng để build `remotePatterns` cho `next/image`). Ảnh seed/demo
(`assets/images/...`) là file tĩnh trong `public/assets/`, Next.js tự phục vụ, không liên quan biến
này — xem `src/lib/media.js`.

---

## 3. Biến môi trường — build-time vs runtime (đọc kỹ)

| Biến | Khi nào đọc | Ai thấy | Mục đích |
|---|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | **Build time** (`next build`) | Browser + Server | API URL công khai |
| `NEXT_PUBLIC_IMAGE_BASE_URL` | **Build time** | Browser + Server (config `next/image`) | Base URL ảnh, dùng build `remotePatterns` |
| `NEXT_PUBLIC_SITE_URL` | **Build time** | Browser + Server | Canonical URL, OG tags, sitemap |
| `INTERNAL_API_BASE_URL` | **Runtime** (đổi được không cần rebuild) | Chỉ server | Override backend URL cho SSR/`generateMetadata` khi chạy trong container riêng — xem giải thích đầy đủ ở root deployment-guide mục 4b |
| `NEXT_IMAGE_UNOPTIMIZED` | **Build time** (`output: standalone` bake config lúc build) | Server (`next/image` optimizer) | `1` = tắt optimize ảnh, browser fetch trực tiếp. **Chỉ dùng local test**, không set ở prod |

Vì `output: "standalone"`, `next.config.mjs` được resolve **1 lần lúc build** và bake vào output —
`NEXT_IMAGE_UNOPTIMIZED`/`NEXT_PUBLIC_*` phải là **build args**, set sau khi container đã chạy sẽ
**không có tác dụng**. `INTERNAL_API_BASE_URL` là ngoại lệ (đọc trong code server-side lúc runtime
qua `process.env`, không qua `next.config.mjs`) nên đổi được bằng cách restart container, không cần
rebuild.

**Đổi domain production**: chỉ cần đổi `NEXT_PUBLIC_*` (build args) rồi build lại — `next.config.mjs`
tự parse `protocol`/`hostname`/`port` từ `NEXT_PUBLIC_IMAGE_BASE_URL` để build `remotePatterns`, không
cần sửa code.

---

## 4. Build & chạy thủ công (không Docker)

```bash
npm run build   # tạo .next/standalone (độc lập node_modules gốc, nhờ output:"standalone")
npm run start   # PORT mặc định 3000
```

---

## 5. Docker

### A. `docker-compose.yml` (production — Coolify hoặc tương tự)

File này **không publish port ra host** (`expose: "3000"` only) — thiết kế cho chạy sau reverse proxy
(Coolify quản lý network nội bộ, hoặc Nginx/Traefik riêng). Build args đọc từ biến môi trường host:

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.gomvugia.vn/api \
NEXT_PUBLIC_IMAGE_BASE_URL=https://api.gomvugia.vn \
NEXT_PUBLIC_SITE_URL=https://gomvugia.vn \
docker compose up -d --build
```

Trên Coolify: set các biến này trong tab **Environment Variables** của resource (Coolify tự truyền
vào làm build args nếu bạn khai `args:` đọc từ `${VAR}` như trong file hiện tại).

### B. `docker-compose.local.yml` (chỉ dùng test local full-stack qua Docker Desktop)

Overlay publish cổng `3000:3000` ra host + trỏ `INTERNAL_API_BASE_URL` về
`host.docker.internal:8080` (backend chạy ở container/project Compose khác trên cùng máy) +
`NEXT_IMAGE_UNOPTIMIZED=1`. **Không** dùng file này cho production (đặt tên khác
`docker-compose.override.yml` có chủ đích, để Docker Compose/Coolify không tự động merge nó).

```bash
docker compose -f docker-compose.yml -f docker-compose.local.yml up --build -d
```

Xem root [`docs/deployment-guide.md`](../../docs/deployment-guide.md) mục 3 cho kịch bản đầy đủ
(cả backend lẫn frontend).

### C. Docker CLI thuần (không compose)

```bash
docker build -t vu-gia-client \
  --build-arg NEXT_PUBLIC_API_BASE_URL=https://api.gomvugia.vn/api \
  --build-arg NEXT_PUBLIC_IMAGE_BASE_URL=https://api.gomvugia.vn \
  --build-arg NEXT_PUBLIC_SITE_URL=https://gomvugia.vn \
  .
docker run -d -p 3000:3000 --name vu-gia-client-container vu-gia-client
```

---

## 6. Vấn đề đã biết (đã verify + fix)

* **SSR/`next build` crash khi backend không phản hồi** (mạng lỗi, backend tạm sập) — đã fix trong
  `src/lib/publicApi.js` (network-level fetch failure giờ được chuẩn hoá thành `PublicApiError`, mọi
  trang tự graceful-degrade thay vì crash). Xem root deployment-guide mục 6.2 để biết chi tiết + cách
  đã verify.
* **`next/image` optimizer không tự "nhìn xuyên" qua container khác** khi cả 2 dùng chung
  `localhost` — chỉ là vấn đề test local, xem root deployment-guide mục 4c.
