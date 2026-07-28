"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "@/shared/utils/feedback";
import { useCustomerAuthStore } from "@/shared/stores/customer-auth-store";
import { ROUTES } from "@/shared/utils/routes";
import { uploadOne, MediaUploadError } from "@/shared/api/media-upload";
import { ApiError } from "@/features/auth/customer-api";
import { composeAltarImage, dataUrlToFile } from "@/features/storefront/altar-customizer/utils/compose-altar-image";
import { createAltarDesign } from "@/features/storefront/altar-customizer/altar-design-service";
import { persistPendingCanvas } from "@/features/storefront/altar-customizer/utils/pending-canvas-storage";

const NAME_MAX_LENGTH = 150;

/**
 * "Lưu" modal — phase 5. Two branches on the same dialog shell:
 *   - logged out: a login-required prompt (never a silent no-op). Clicking through persists the
 *     current canvas to sessionStorage (`pending-canvas-storage.js`) before redirecting to
 *     `/dang-nhap?next=...`, so `altar-customizer-view.jsx` can restore it on return.
 *   - logged in: name the design, compose+upload a thumbnail (`compose-altar-image.js` +
 *     `media-upload.js`'s existing `uploadOne`), then `POST /api/altar-designs`. A 409 (the
 *     20-design cap, decision D5) gets its own message, not a generic failure toast.
 */
export default function AltarSaveDialog({ open, onOpenChange, canvasState, activeSize, totalPrice }) {
  const router = useRouter();
  const isAuthenticated = useCustomerAuthStore((state) => state.status === "authenticated");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const close = () => {
    if (saving) return;
    onOpenChange(false);
  };

  const handleLoginRedirect = () => {
    persistPendingCanvas(canvasState);
    onOpenChange(false);
    router.push(`${ROUTES.LOGIN}?next=${encodeURIComponent(ROUTES.ALTAR_CUSTOMIZER)}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Vui lòng đặt tên cho thiết kế.");
      return;
    }
    if (!activeSize || !canvasState?.altarSizeId) {
      toast.error("Vui lòng chọn kích thước bàn thờ trước khi lưu.");
      return;
    }
    if ((canvasState.items?.length || 0) === 0 && (canvasState.accessories?.length || 0) === 0) {
      toast.error("Chưa có vật phẩm nào để lưu.");
      return;
    }

    setSaving(true);
    try {
      const imageDataUrl = await composeAltarImage(activeSize, canvasState.items);
      const thumbFile = dataUrlToFile(imageDataUrl, "altar-design-thumb.png");
      const thumb = await uploadOne(thumbFile, "altar-designs");

      await createAltarDesign({
        name: trimmedName,
        thumb,
        altarModelSizeId: canvasState.altarSizeId,
        altarStyleId: canvasState.altarStyleId ?? null,
        // Backend `AltarDesignRequest.items`/`.accessories` are raw JSON array strings —
        // same convention as `ProductCreateRequest.comboProducts` — not nested JSON objects.
        items: JSON.stringify(canvasState.items ?? []),
        accessories: JSON.stringify(canvasState.accessories ?? []),
        totalPrice,
      });

      toast.success("Đã lưu thiết kế vào thư viện của bạn.");
      setName("");
      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        toast.error("Bạn đã lưu tối đa 20 thiết kế. Vui lòng xóa bớt thiết kế trước khi lưu thêm.");
      } else if (error instanceof MediaUploadError) {
        toast.error(error.message || "Không thể tải ảnh xem trước lên.");
      } else {
        toast.error(error?.message || "Không thể lưu thiết kế. Vui lòng thử lại.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Lưu thiết kế bàn thờ"
      onClick={close}
    >
      <div
        className="w-full max-w-[420px] rounded-[8px] bg-white p-6 font-montserrat shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[18px] font-[700] text-[#2E2F2A]">Lưu thiết kế</h2>
          <button type="button" onClick={close} aria-label="Đóng" className="text-[#8C8C8C] hover:text-[#2E2F2A]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="flex flex-col gap-4">
            <p className="text-[14px] leading-[22px] text-[#2E2F2A]">
              Bạn cần đăng nhập để lưu bố cục vào thư viện thiết kế. Bố cục hiện tại của bạn sẽ được
              giữ lại khi bạn quay lại sau khi đăng nhập.
            </p>
            <button
              type="button"
              onClick={handleLoginRedirect}
              className="h-[44px] rounded-[6px] bg-[#C76E00] font-[700] text-white transition duration-200 hover:bg-[#a65c00]"
            >
              Đăng nhập để lưu
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2 text-[14px] text-[#2E2F2A]">
              Tên thiết kế
              <input
                type="text"
                value={name}
                maxLength={NAME_MAX_LENGTH}
                onChange={(event) => setName(event.target.value)}
                placeholder="VD: Bàn thờ phòng khách"
                className="h-[44px] rounded-[6px] border border-[#D1D5DB] px-3 text-[14px] focus:border-[#C76E00] focus:outline-none"
                autoFocus
                disabled={saving}
              />
            </label>
            <button
              type="submit"
              disabled={saving}
              className="h-[44px] rounded-[6px] bg-[#C76E00] font-[700] text-white transition duration-200 hover:bg-[#a65c00] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Đang lưu..." : "Lưu vào thư viện"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
